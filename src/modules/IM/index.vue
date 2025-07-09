<template>
  <div class="im-container gradient-bg">
    <!-- 左侧会话列表 -->
    <div class="im-sidebar">
      <div class="sidebar-header">
        <div class="search-box">
          <input v-model="searchKeyword" type="text" placeholder="搜索联系人..." class="search-input" />
        </div>
      </div>
      <div class="user-list">
        <template v-if="chatRoomList.length">
          <div v-for="conv in chatRoomList" :key="conv.id" :class="['user-item', { active: currentChatRoomId === conv.id }]" @click="selectConversation(conv)">
            <div class="user-avatar">
              <Avatar :name="conv.name" :is-group="conv.type === 'group'" size="md" />
            </div>
            <div class="user-info">
              <div class="user-name">{{ conv.name }}</div>
              <div class="user-status">
                <template v-if="conv.type === 'group'">群聊</template>
                <!-- <template v-else>{{ getUserById(conv.members.find(id => id !== currentUserId)!)?.isOnline ? '在线' : '离线' }}</template> -->
              </div>
            </div>
            <!-- <div v-if="conv.unreadCount > 0" class="unread-badge">{{ conv.unreadCount }}</div> -->
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
              <Avatar :name="currentChatRoomInfo?.name" :is-group="currentChatRoomInfo?.type === 'group'" size="md" class="chat-avatar" />
              <div>
                <div class="chat-user-name">{{ currentChatRoomInfo?.name }}</div>
                <div class="chat-user-status">
                  <template v-if="currentChatRoomInfo?.type === 'group'">群聊</template>
                  <!-- <template v-else>{{ getUserById(currentConversation.members.find(id => id !== currentUserId)!)?.isOnline ? '在线' : '离线' }}</template> -->
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
                  <Avatar :name="msg.senderNickname" size="sm" />
                </div>
                <div class="message-content">
                  <div class="message-bubble-outer">
                    <div class="message-bubble">
                      <div class="message-text">
                        <template v-if="currentChatRoomInfo?.type === 'group' && msg.senderId !== currentUserId">
                          <span class="group-sender">{{ msg.senderNickname }}：</span>
                        </template>
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
          <el-dropdown @command="handleMenuCommand">
            <div class="px-2 py-2 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center">
              <MoreHorizontal class="h-5 w-5" />
            </div>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item command="add">
                  <div class="flex items-center text-gray-900 text-base">
                    <Plus class="h-5 w-5 mr-2 text-blue-500" />
                    添加成员
                  </div>
                </el-dropdown-item>
                <el-dropdown-item command="delete" divided>
                  <div class="flex items-center text-gray-900 text-base">
                    <Trash2 class="h-5 w-5 mr-2 text-red-500" />
                    删除会话
                  </div>
                </el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="group-member-list">
          <div v-for="member in currentChatRoomInfo?.members" :key="member?.id" class="group-member-item">
            <Avatar v-if="member" :name="member.user?.nickname" size="sm" class="group-member-avatar" />
            <div v-if="member" class="group-member-info">
              <div class="group-member-name">{{ member.user?.nickname }}</div>
              <div class="group-member-status">{{ getUserOnlineStatus(member.userId) === OnlineStatusEnum.ONLINE ? '在线' : '离线' }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <!-- 添加成员 -->
    <InviteMember v-model:visible="inviteDialogVisible" :members="inviteMembers" :max="5" @confirm="handleInvite" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, nextTick, onMounted, watch } from 'vue';
import { useChat } from './composables/useChat';
import type { ChatRoomResponseDto } from '@/services/api/im/type';
import { Plus, MessageSquareMore, MoreHorizontal, Trash2 } from 'lucide-vue-next';
import Avatar from '@/components/common/Avatar.vue';
import { ElMessage } from 'element-plus';
import { debounce } from '@/utils/common';
import ChatRichInput from './components/ChatRichInput.vue';
import { formatChatTime, shouldShowTime } from '@/utils/date';
import InviteMember from './components/InviteMember.vue';
import { batchAddChatRoomMembersApi } from '@/services/api/im';
import { OnlineStatusEnum } from '@/constants/enum';

const props = defineProps<{ teamId?: number }>();
const { chatRoomList, currentChatRoomId, currentChatRoomInfo, currentUserId, chatRoomMessages, teamMemberOnlineStatus, joinRoom, getChatRoomMessages, createTeamDefaultChatRoom, sendMessage, getChatRoomInfo } = useChat(props.teamId);

const inviteDialogVisible = ref(false);
const inviteMembers = computed(() => teamMemberOnlineStatus.value.filter(member => !currentChatRoomInfo.value?.members.find(m => m.userId === member.id)));

const messageList = ref<HTMLElement>();
const messageInput = ref<HTMLTextAreaElement>();
const searchKeyword = ref('');

// 选择会话
const selectConversation = async (conv: ChatRoomResponseDto) => {
  await joinRoom(conv.id);
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
  }
};

const scrollToBottom = () => {
  if (messageList.value) {
    messageList.value.scrollTop = messageList.value.scrollHeight;
  }
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

const getUserOnlineStatus = (userId: number) => {
  return teamMemberOnlineStatus.value.find(m => m.id === userId)?.onlineStatus;
};

const handleMenuCommand = (command: string) => {
  if (command === 'add') {
    inviteDialogVisible.value = true;
  } else if (command === 'delete') {
    // 你的删除会话逻辑
    ElMessage.warning('删除会话');
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
}
.user-status {
  font-size: 12px;
  color: #8a99b3;
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
  top: 50%;
  transform: translateY(-50%);
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
  display: flex;
  flex-direction: column;
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
  margin: 0 10px 0 10px;
  align-self: flex-end;
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
  border-radius: 18px 18px 18px 6px;
  box-shadow: 0 2px 8px rgba(80, 120, 200, 0.08);
  padding: 14px 22px;
  font-size: 15px;
  color: #2d3a4a;
  margin-bottom: 4px;
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
}
.group-member-list {
  flex: 1;
  overflow-y: auto;
}
.group-member-item {
  display: flex;
  align-items: center;
  padding: 10px 18px;
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
