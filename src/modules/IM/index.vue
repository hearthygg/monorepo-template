<template>
  <div class="im-container gradient-bg">
    <!-- 左侧会话列表 -->
    <div class="im-sidebar">
      <div class="sidebar-header">
        <div class="search-box flex items-center gap-2">
          <input v-model="searchKeyword" type="text" placeholder="搜索联系人..." class="search-input" />
          <!-- 创建聊天室 -->
          <div class="p-2 bg-gray-100 rounded-md cursor-pointer" @click="openCreateCustomChatRoomDialog">
            <Plus class="text-gray-700 hover:text-blue-700" />
          </div>
        </div>
      </div>
      <div class="user-list">
        <template v-if="chatRoomList.length">
          <div v-for="conv in chatRoomList" :key="conv.id" :class="['user-item', { active: currentChatRoomId === conv.id }]" @click="selectConversation(conv)">
            <div class="user-avatar">
              <Avatar :name="getPrivateChatDisplayName(conv)" :is-group="conv.type === 'group'" size="md" />
            </div>
            <div class="user-info">
              <div class="user-name">
                <template v-if="conv.type === 'group'">
                  {{ conv.name }}
                </template>
                <template v-else>
                  {{ getPrivateChatDisplayName(conv) }}
                </template>
                <span class="text-xs text-gray-500">{{ formatChatTime(conv.lastMessage?.createdAt as string) }}</span>
              </div>
              <div class="user-status">
                <span>{{ getMessagePreview(conv.lastMessage?.content) }}</span>
              </div>
            </div>
            <div v-if="conv.unreadCount && conv.unreadCount > 0" class="unread-badge">{{ conv.unreadCount }}</div>
          </div>
        </template>
        <template v-else>
          <el-empty description="暂无聊天记录" />
          <button class="px-4 py-2 mx-auto bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium flex items-center transition-colors" @click="createTeamDefaultChatRoom">
            <Plus class="h-4 w-4 mr-2" />
            创建聊天默认聊天室
          </button>
        </template>
      </div>
    </div>
    <!-- 主聊天区+群成员区 -->
    <div class="im-main-flex">
      <div class="chat-main-area">
        <div v-if="currentChatRoomId" class="chat-container">
          <!-- 聊天头部 -->
          <div class="chat-header chat-header-card">
            <div class="chat-user-info">
              <Avatar :name="getChatDisplayName(currentChatRoomInfo)" :is-group="currentChatRoomInfo?.type === 'group'" size="md" class="chat-avatar" />
              <div>
                <div class="chat-user-name">{{ getChatDisplayName(currentChatRoomInfo) }}</div>
                <div class="chat-user-status">
                  <template v-if="currentChatRoomInfo?.type === 'group'">群聊</template>
                  <template v-else>私聊</template>
                </div>
              </div>
            </div>
            <div class="chat-actions">
              <button class="action-btn">📞</button>
              <button class="action-btn">📹</button>
              <button class="action-btn">⋯</button>
            </div>
          </div>
          <!-- 消息列表 -->
          <div ref="messageList" class="message-list message-list-card" @scroll="onMessageListScroll">
            <div v-for="(msg, idx) in chatRoomMessages" :key="msg.id">
              <div v-if="idx === 0 || shouldShowTime(chatRoomMessages[idx - 1]?.createdAt, msg.createdAt)">
                <div class="msg-time">{{ formatChatTime(msg.createdAt) }}</div>
              </div>
              <div :class="['message-item', { 'message-mine': msg.senderId === currentUserId }]">
                <div class="message-avatar">
                  <Avatar :name="msg.senderNickname" />
                </div>
                <div class="message-content">
                  <div class="message-bubble-outer">
                    <span class="group-sender">{{ msg.senderNickname }}</span>
                    <div class="message-bubble">
                      <div class="message-text">
                        <div v-html="msg.content"></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <!-- 输入区 -->
          <div class="message-input-area-flat">
            <ChatRichInput :members="teamMemberOnlineStatus" @send="handlerSendMessage" />
          </div>
        </div>
        <div v-else class="gradient-bg h-full flex items-center justify-center flex-col gap-4">
          <MessageSquareMore class="text-blue-500 w-16 h-16" />
          <div class="text-center">
            <p class="text-lg font-medium text-gray-700">请选择会话</p>
            <p class="text-sm text-gray-500">选择一个会话，开始聊天</p>
          </div>
        </div>
      </div>
      <!-- 群聊右侧成员列表 -->
      <div v-if="currentChatRoomInfo?.type === 'group' && currentChatRoomInfo?.members.length" class="group-member-panel-flex">
        <div class="group-member-title flex justify-between items-center">
          <div>群成员（{{ currentChatRoomInfo?.members.length }}）</div>
          <Dropdown @select="handleMenuCommand">
            <template #trigger>
              <div class="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center transition-colors">
                <MoreHorizontal class="h-5 w-5 text-gray-600" />
              </div>
            </template>
            <DropdownItem value="add" :icon="Plus"> 添加成员 </DropdownItem>
            <DropdownItem divider />
            <DropdownItem value="exit" :icon="LogOut" danger> 退出群聊 </DropdownItem>
            <DropdownItem value="delete" :icon="Trash2" danger> 删除会话 </DropdownItem>
          </Dropdown>
        </div>
        <div class="group-member-list">
          <template v-for="member in currentChatRoomInfo?.members" :key="member?.id">
            <Dropdown trigger="click-contextmenu" class="w-full" @select="handleMemberMenuCommand($event, member.userId)">
              <template #trigger>
                <div class="group-member-item">
                  <Avatar v-if="member" :show-online-status="true" :is-online="getUserOnlineStatus(member.userId) === OnlineStatusEnum.ONLINE" :name="member.user?.nickname" size="sm" class="group-member-avatar" />
                  <div v-if="member" class="group-member-info">
                    <div class="group-member-name">
                      {{ member.user?.nickname }}
                      <component :is="getRoleIcon(member.role)" v-if="getRoleIcon(member.role)" :class="['inline-block ml-1 w-3 h-3', getRoleIconColor(member.role)]" />
                    </div>
                  </div>
                </div>
              </template>
              <DropdownItem value="mention"> <span class="text-[16px]"> @ </span> <span class="ml-1">TA</span> </DropdownItem>
              <DropdownItem value="sendMessage" :icon="MessageSquareMore"> 发送消息 </DropdownItem>
              <DropdownItem divider />
              <DropdownItem value="remove" :icon="Trash2" danger> 移出本群 </DropdownItem>
            </Dropdown>
          </template>
        </div>
      </div>
    </div>
    <!-- 添加成员弹窗 -->
    <InviteMember v-model:visible="inviteDialogVisible" :members="inviteMembers" :max="5" @confirm="handleInvite" />
    <!-- 创建聊天室弹窗 -->
    <CreateChatRoom v-model:visible="createChatRoomDialogVisible" @confirm="handleCreateChatRoom" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue';
import { useChat } from './composables/useChat';
import type { ChatRoomResponseDto } from '@/services/api/im/type';
import { Plus, MessageSquareMore, MoreHorizontal, Trash2, Search, Crown, Shield, LogOut } from 'lucide-vue-next';
import Avatar from '@/components/common/Avatar.vue';
import { ElMessage, ElMessageBox } from 'element-plus';
import { debounce } from '@/utils/common';
import ChatRichInput from './components/ChatRichInput.vue';
import { formatChatTime, shouldShowTime } from '@/utils/date';
import InviteMember from './components/InviteMember.vue';
import CreateChatRoom from './components/CreateChatRoom.vue';
import { batchAddChatRoomMembersApi } from '@/services/api/im';
import { OnlineStatusEnum, ChatMemberRole } from '@/constants/enum';
import Dropdown from '@/components/common/Dropdown.vue';
import DropdownItem from '@/components/common/DropdownItem.vue';
import type { ChatRoomDetailResponseDto } from '@/services/api/im/type';
const props = defineProps<{ teamId?: number }>();
const {
  chatRoomList,
  currentChatRoomId,
  currentChatRoomInfo,
  currentUserId,
  chatRoomMessages,
  teamMemberOnlineStatus,
  joinRoom,
  getChatRoomMessages,
  createTeamDefaultChatRoom,
  sendMessage,
  getChatRoomInfo,
  shouldScrollToBottom,
  resetScrollToBottom,
  createPrivateChatRoom,
  createCustomChatRoom,
  getChatRoomList,
  removeChatRoomMember,
  exitChatRoom,
  deleteChatRoom
} = useChat(props.teamId);

const inviteDialogVisible = ref(false);
const inviteMembers = computed(() => teamMemberOnlineStatus.value.filter(member => !currentChatRoomInfo.value?.members.find(m => m.userId === member.id)));

const createChatRoomDialogVisible = ref(false);

const messageList = ref<HTMLElement>();
const messageInput = ref<HTMLTextAreaElement>();
const searchKeyword = ref('');

// 监听是否需要滚动到底部
watch(shouldScrollToBottom, newValue => {
  if (newValue) {
    nextTick(() => {
      scrollToBottomDirect();
      resetScrollToBottom();
    });
  }
});

// 选择会话
const selectConversation = async (conv: ChatRoomResponseDto) => {
  await joinRoom(conv.id);
  nextTick(() => {
    scrollToBottomDirect();
  });
};

const handlerSendMessage = (html: string) => {
  // 提取纯文本
  const text = html
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, '')
    .trim();
  // 检查是否包含图片
  const hasImg = /<img\s/i.test(html);
  if (text || hasImg) {
    sendMessage(html);
    // 发送消息后使用简单可靠的滚动方法
    nextTick(() => {
      scrollToBottomDirect();
    });
  }
};

// 直接滚动到底部的方法
const scrollToBottomDirect = () => {
  if (!messageList.value) return;

  // 方法1：直接设置scrollTop
  messageList.value.scrollTop = messageList.value.scrollHeight;

  // 方法2：使用scrollIntoView（备用方案）
  setTimeout(() => {
    const lastMessage = messageList.value?.lastElementChild;
    if (lastMessage) {
      console.log('使用scrollIntoView滚动到最后一条消息');
      lastMessage.scrollIntoView({ behavior: 'smooth', block: 'end' });
    }
  }, 50);
};

// 更可靠的滚动到底部方法，监听DOM变化
const scrollToBottomWithObserver = () => {
  if (!messageList.value) return;

  console.log('开始滚动到底部');
  console.log('当前scrollTop:', messageList.value.scrollTop);
  console.log('当前scrollHeight:', messageList.value.scrollHeight);
  console.log('当前clientHeight:', messageList.value.clientHeight);

  // 先立即滚动一次
  messageList.value.scrollTop = messageList.value.scrollHeight;

  console.log('滚动后scrollTop:', messageList.value.scrollTop);

  // 使用MutationObserver监听DOM变化
  const observer = new MutationObserver(() => {
    console.log('DOM变化，重新滚动');
    console.log('变化后scrollHeight:', messageList.value!.scrollHeight);
    // DOM变化后重新滚动到底部
    messageList.value!.scrollTop = messageList.value!.scrollHeight;
  });

  // 监听子节点变化
  observer.observe(messageList.value, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['src', 'style', 'class']
  });

  // 3秒后停止监听（防止无限监听）
  setTimeout(() => {
    observer.disconnect();
    console.log('停止监听DOM变化');
  }, 3000);
};

const adjustTextareaHeight = () => {
  if (messageInput.value) {
    messageInput.value.style.height = 'auto';
    messageInput.value.style.height = messageInput.value.scrollHeight + 'px';
  }
};

// watch(chatRoomMessages, () => {
//   nextTick(() => scrollToBottom());
// });

const handleInvite = async (memberIds: number[]) => {
  if (currentChatRoomId.value) {
    await batchAddChatRoomMembersApi(currentChatRoomId.value, memberIds);
    ElMessage.success('添加成员成功');
    await getChatRoomInfo(currentChatRoomId.value);
  }
};

const handleCreateChatRoom = async (name: string) => {
  if (props.teamId) {
    await createCustomChatRoom(name);
    ElMessage.success('创建聊天室成功');
    // 重新获取聊天室列表
    await getChatRoomList();
    createChatRoomDialogVisible.value = false;
  }
};

const openCreateCustomChatRoomDialog = () => {
  createChatRoomDialogVisible.value = true;
};

const getUserOnlineStatus = (userId: number) => {
  return teamMemberOnlineStatus.value.find(m => m.id === userId)?.onlineStatus;
};

// 获取角色图标组件
const getRoleIcon = (role: ChatMemberRole) => {
  switch (role) {
    case ChatMemberRole.OWNER:
      return Shield;
    case ChatMemberRole.ADMIN:
      return Crown;
    default:
      return null;
  }
};

// 获取角色图标颜色
const getRoleIconColor = (role: ChatMemberRole) => {
  switch (role) {
    case ChatMemberRole.OWNER:
      return 'text-blue-500';
    case ChatMemberRole.ADMIN:
      return 'text-yellow-500';
    default:
      return '';
  }
};

// 获取私聊显示名称（对面用户的昵称）
const getPrivateChatDisplayName = (conv: ChatRoomResponseDto) => {
  if (conv.type === 'group') {
    return conv.name;
  }

  // 私聊：找到对面用户的昵称
  if (conv.members && currentUserId.value) {
    const otherMember = conv.members.find(member => member.userId !== currentUserId.value);
    return otherMember?.user?.nickname || '未知用户';
  }

  return conv.name; // 兜底返回聊天室名称
};

const getChatDisplayName = (chatRoomInfo?: ChatRoomDetailResponseDto | null) => {
  if (!chatRoomInfo) {
    return '未知聊天室';
  }
  if (chatRoomInfo.type === 'group') {
    return chatRoomInfo.name;
  }
  if (chatRoomInfo.members && currentUserId.value) {
    const otherMember = chatRoomInfo.members.find(member => member.userId !== currentUserId.value);
    return otherMember?.user?.nickname || '未知用户';
  }
  return chatRoomInfo.name;
};

// 获取消息预览内容
const getMessagePreview = (content?: string) => {
  if (!content) {
    return '';
  }

  // 检查是否包含图片
  if (/<img\s/i.test(content)) {
    return '[图片]';
  }

  // 去除HTML标签，获取纯文本
  const plainText = content
    .replace(/<[^>]+>/g, '') // 去除所有HTML标签
    .replace(/&nbsp;/g, ' ') // 替换&nbsp;为空格
    .replace(/&amp;/g, '&') // 替换&amp;为&
    .replace(/&lt;/g, '<') // 替换&lt;为<
    .replace(/&gt;/g, '>') // 替换&gt;为>
    .replace(/&quot;/g, '"') // 替换&quot;为"
    .trim();

  // 限制长度，超出部分用省略号
  const maxLength = 30;
  if (plainText.length > maxLength) {
    return plainText.substring(0, maxLength) + '...';
  }

  return plainText;
};

const handleMenuCommand = (command: string) => {
  if (command === 'add') {
    inviteDialogVisible.value = true;
  } else if (command === 'exit') {
    ElMessageBox.confirm('确定退出群聊吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      exitChatRoom();
    });
  } else if (command === 'delete') {
    ElMessageBox.confirm('确定删除群聊吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      deleteChatRoom();
    });
  }
};

const handleMemberMenuCommand = (command: string, userId: number) => {
  if (command === 'mention') {
    ElMessage.warning('@ TA');
  } else if (command === 'sendMessage') {
    // 私聊消息
    createPrivateChatRoom(userId);
  } else if (command === 'remove') {
    ElMessageBox.confirm('确定移出该成员吗？', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {
      removeChatRoomMember(userId);
    });
  }
};

onMounted(() => {
  if (messageInput.value) {
    messageInput.value.addEventListener('input', adjustTextareaHeight);
  }
});

// 防抖后的加载历史消息方法
const debouncedGetChatRoomMessages = debounce(() => {
  getChatRoomMessages();
}, 300);

// 消息列表滚动事件
const onMessageListScroll = (e: Event) => {
  const el = e.target as HTMLElement;
  if (el.scrollTop === 0) {
    debouncedGetChatRoomMessages();
  }
};
</script>

<style scoped>
.im-container {
  display: flex;
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}
.gradient-bg {
  background: linear-gradient(120deg, #e0e7ff 0%, #fbeffb 100%);
}
.card-shadow {
  box-shadow:
    0 4px 24px 0 rgba(80, 120, 200, 0.1),
    0 1.5px 4px 0 rgba(80, 120, 200, 0.08);
  border-radius: 18px;
  background: #fff;
}
.im-sidebar {
  width: 320px;
  /* margin: 18px 0 18px 18px; */
  display: flex;
  flex-direction: column;
  /* border-radius: 18px; */
  overflow: hidden;
  background: #fff;
  border-right: 1px solid #f2f6fc;
}
.sidebar-header {
  padding: 12px 20px 12px 20px;
  border-bottom: 1px solid #f0f0f0;
  background: transparent;
}
.sidebar-header h3 {
  margin: 0 0 12px 0;
  color: #2d3a4a;
  font-size: 20px;
  font-weight: 600;
}
.search-input {
  width: 100%;
  padding: 10px 16px;
  border: 1px solid #e0e7ff;
  border-radius: 16px;
  outline: none;
  font-size: 15px;
  background: #f7f8fa;
  transition: border-color 0.2s;
}
.search-input:focus {
  border-color: #6c8cff;
}
.user-list {
  flex: 1;
  overflow-y: auto;
  background: transparent;
  padding: 8px 0;
}
.user-item {
  display: flex;
  align-items: center;
  padding: 12px 20px;
  margin: 0 8px 8px 8px;
  border-radius: 14px;
  cursor: pointer;
  transition:
    background 0.18s,
    box-shadow 0.18s;
  position: relative;
}
.user-item:hover {
  background: #f0f4ff;
  box-shadow: 0 2px 8px 0 rgba(80, 120, 200, 0.08);
}
.user-item.active {
  background: linear-gradient(90deg, #e0e7ff 0%, #fbeffb 100%);
  box-shadow: 0 2px 12px 0 rgba(80, 120, 200, 0.12);
}
.user-avatar {
  position: relative;
  margin-right: 14px;
}
.user-avatar img {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(80, 120, 200, 0.1);
}
.online-status {
  position: absolute;
  bottom: 3px;
  right: 3px;
  width: 13px;
  height: 13px;
  border-radius: 50%;
  background-color: #ccc;
  border: 2px solid #fff;
}
.online-status.online {
  background-color: #4caf50;
}
.user-info {
  flex: 1;
  min-width: 0;
}
.user-name {
  font-weight: 500;
  color: #2d3a4a;
  font-size: 16px;
  margin-bottom: 2px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.user-status {
  font-size: 13px;
  color: #8a99b3;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 200px;
}
.unread-badge {
  background-color: #ff4757;
  color: white;
  border-radius: 50%;
  padding: 2px 7px;
  font-size: 12px;
  font-weight: 600;
  min-width: 22px;
  text-align: center;
  position: absolute;
  right: 18px;
  top: 80%;
  transform: translateY(-80%);
  box-shadow: 0 1px 4px 0 rgba(255, 71, 87, 0.15);
}

/* 主聊天区域样式 */
.im-main-flex {
  display: flex;
  flex: 1;
  height: 100%;
  background: #f8f9fa;
}
.chat-main-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
}
.chat-container {
  display: flex;
  flex-direction: column;
  height: 100%;
}

/* 聊天头部卡片样式 */
.chat-header-card {
  background: #f8f9fa;
  /* border-radius: 18px 18px 0 0; */
  box-shadow: 0 2px 12px 0 rgba(80, 120, 200, 0.08);
  /* margin: 18px 18px 0 0; */
  padding: 10px 28px 10px 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid #f2f6fc;
}
.chat-user-info {
  display: flex;
  align-items: center;
}
.chat-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  margin-right: 16px;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(80, 120, 200, 0.1);
}
.chat-user-name {
  font-weight: 600;
  color: #2d3a4a;
  font-size: 18px;
  margin-bottom: 2px;
}
.chat-user-status {
  font-size: 13px;
  color: #8a99b3;
}
.chat-actions {
  display: flex;
  gap: 12px;
}
.action-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.2s;
}
.action-btn:hover {
  background-color: #f0f4ff;
}

/* 消息列表卡片样式 */
.message-list-card {
  background: #fff;
  /* border-radius: 0 0 18px 18px; */
  box-shadow: 0 2px 12px 0 rgba(80, 120, 200, 0.08);
  /* margin: 0 18px 0 0; */
  padding: 32px 32px 24px 32px;
  flex: 1;
  overflow-y: auto;
  /* 确保容器有正确的高度 */
  min-height: 0;
  /* 移除 flex-direction: column，避免滚动计算错误 */
  border-bottom: 1px solid #f2f6fc;
}
.message-item {
  display: flex;
  align-items: flex-end;
  margin-bottom: 28px;
  position: relative;
}
.message-item.message-mine {
  flex-direction: row-reverse;
}
.message-avatar {
  margin: 0 5px 0 5px;
  /* align-self: flex-start; */
}
.message-avatar img {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 8px rgba(80, 120, 200, 0.1);
}
.message-content {
  max-width: 60%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.message-item.message-mine .message-content {
  align-items: flex-end;
}
.message-bubble-outer {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
}
.message-item.message-mine .message-bubble-outer {
  align-items: flex-end;
}
.message-bubble {
  background: #f8f9fa;
  border-radius: 6px 6px 6px 12px;
  box-shadow: 0 2px 8px rgba(80, 120, 200, 0.08);
  padding: 7px 11px;
  font-size: 15px;
  color: #2d3a4a;
  position: relative;
  word-break: break-word;
  transition: background 0.2s;
}
.message-item.message-mine .message-bubble {
  background: linear-gradient(90deg, #6c8cff 0%, #a0bfff 100%);
  color: #fff;
  border-radius: 18px 18px 6px 18px;
}
.message-text {
  margin-bottom: 2px;
  line-height: 1.6;
}
.message-time {
  font-size: 12px;
  /* color: #fff; */
  text-align: right;
  margin-top: 2px;
}

/* 输入区域样式 */
.message-input-area-flat {
  background: transparent;
  /* padding: 0 0 36px 0; */
  display: flex;
  justify-content: center;
}
.input-row {
  background: #fff;
  /* border-radius: 18px; */
  width: 100%;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  /* padding: 10px 18px 10px 14px; */
  padding: 8px;
  box-shadow: none;
  gap: 12px;
}
.input-toolbar-inline {
  display: flex;
  gap: 6px;
}
.toolbar-btn-flat {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 4px 5px;
  border-radius: 50%;
  transition: background 0.18s;
}
.toolbar-btn-flat:hover {
  background: #f0f4ff;
}
.message-input-flat {
  flex: 1;
  border: none;
  border-radius: 14px;
  background: #f7f8fa;
  padding: 10px 16px;
  font-size: 15px;
  outline: none;
  resize: none;
  min-height: 36px;
  max-height: 80px;
  font-family: inherit;
  line-height: 1.5;
  color: #2d3a4a;
  margin: 0 8px;
  box-shadow: none;
  transition: background 0.2s;
}
.message-input-flat:focus {
  background: #fff;
}
.message-input-flat::placeholder {
  color: #c0c6d1;
  font-size: 15px;
}
.send-btn-flat {
  background: linear-gradient(90deg, #6c8cff 0%, #a0bfff 100%);
  color: #fff;
  border: none;
  border-radius: 16px;
  padding: 0 28px;
  height: 36px;
  min-width: 68px;
  font-weight: 600;
  font-size: 15px;
  cursor: pointer;
  box-shadow: none;
  transition: background 0.18s;
  display: flex;
  align-items: center;
  justify-content: center;
}
.send-btn-flat:disabled {
  background: #e0e7ff;
  color: #b0b8c9;
  cursor: not-allowed;
}
.send-btn-flat:not(:disabled):hover {
  background: linear-gradient(90deg, #4a6cff 0%, #7faaff 100%);
}

/* 未选择聊天时的样式 */
.no-chat-selected {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8f9fa;
}

.no-chat-content {
  text-align: center;
  color: #666;
}

.no-chat-icon {
  font-size: 64px;
  margin-bottom: 20px;
}

.no-chat-content h3 {
  margin: 0 0 10px 0;
  color: #333;
}

.no-chat-content p {
  margin: 0;
  font-size: 14px;
}

/* 滚动条样式 */
.user-list::-webkit-scrollbar,
.message-list::-webkit-scrollbar {
  width: 6px;
}

.user-list::-webkit-scrollbar-track,
.message-list::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.user-list::-webkit-scrollbar-thumb,
.message-list::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 3px;
}

.user-list::-webkit-scrollbar-thumb:hover,
.message-list::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

.group-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #6c8cff;
  color: #fff;
  font-size: 11px;
  border-radius: 8px;
  padding: 1px 6px;
  font-weight: 600;
  box-shadow: 0 1px 4px rgba(80, 120, 200, 0.1);
}
.group-sender {
  color: #6c8cff;
  font-weight: 600;
  margin-right: 4px;
}
.group-member-panel-flex {
  width: 220px;
  height: 100%;
  background: #fff;
  border-left: 1px solid #f2f6fc;
  box-shadow: -2px 0 12px 0 rgba(80, 120, 200, 0.04);
  display: flex;
  flex-direction: column;
}
.group-member-title {
  height: 70px;
  font-size: 15px;
  font-weight: 600;
  color: #2d3a4a;
  padding: 18px 18px 10px 18px;
  border-left: 1px solid #f2f6fc;
  border-bottom: 1px solid #f2f6fc;
}
.group-member-list {
  flex: 1;
  overflow-y: auto;
}
.group-member-item {
  display: flex;
  align-items: center;
  padding: 10px 18px;
  width: 100%;
  border-bottom: 1px solid #f7f8fa;
}
.group-member-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 10px;
}
.group-member-info {
  flex: 1;
}
.group-member-name {
  font-size: 15px;
  color: #2d3a4a;
  font-weight: 500;
}
.group-member-status {
  font-size: 12px;
  color: #8a99b3;
}
.msg-time {
  width: 100%;
  text-align: center;
  color: #999;
  font-size: 13px;
}
</style>
