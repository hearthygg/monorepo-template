import { ref, onMounted, onUnmounted, reactive } from 'vue';
// Socket.IO 是一个基于 WebSocket 的实时通信库
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { useUserStore } from '@/stores/user';
import type { ChatRoomDetailResponseDto, ChatRoomMessageResponseDto, ChatRoomQueryDto, ChatRoomResponseDto } from '@/services/api/im/type';
import { createPrivateChatRoomApi, deleteChatRoomApi, getChatRoomInfoApi, getChatRoomListApi, getChatRoomMessagesApi, removeChatRoomMemberApi } from '@/services/api/im';
import { checkCreateRoomPermissionApi, createTeamCustomChatRoomApi, createTeamDefaultChatRoomApi, getTeamMemberOnlineStatusApi } from '@/services/api/team';
import { ChatRoomType } from '@/constants/enum';
import { ElMessage } from 'element-plus';
import type { TeamMemberOnlineStatus } from '@/types/team';
import { toTimestamp } from '@/utils/date';
import { OnlineStatusEnum } from '@/constants/enum';

// 消息去重工具函数
const filterDuplicateMessages = (newMessages: ChatRoomMessageResponseDto[], existingMessages: ChatRoomMessageResponseDto[]): ChatRoomMessageResponseDto[] => {
  const existingIds = new Set(existingMessages.map(msg => msg.id));
  return newMessages.filter(newMsg => !existingIds.has(newMsg.id));
};

export function useChat(teamId?: number) {
  const socket = ref<Socket | null>(null);
  const chatRoomMessages = ref<ChatRoomMessageResponseDto[]>([]);
  const isConnected = ref(false);
  const isMuted = ref(false);
  const currentChatRoomId = ref<string | null>(null);
  const chatRoomList = ref<ChatRoomResponseDto[]>([]);
  const userStore = useUserStore();
  const currentUserId = ref<number | null>(userStore.userInfo?.id || null);

  // 当前团队ID 团队空间下特殊处理
  const currentTeamId = ref<number | null>(teamId || null);
  // 是否有在团队空间下创建自定义聊天室权限
  const isCreateTeamCustomChatRoom = ref(false);
  // 当前聊天室信息
  const currentChatRoomInfo = ref<ChatRoomDetailResponseDto | null>(null);
  // 团队成员在线状态
  const teamMemberOnlineStatus = ref<TeamMemberOnlineStatus[]>([]);

  // 新增：标记是否需要滚动到底部（用于自己发送的消息）
  const shouldScrollToBottom = ref(false);

  // 查询聊天室默认参数
  const queryChatRoomDefault = reactive({
    teamId: currentTeamId.value || undefined,
    hasUnread: true,
    includeMembers: true
  });

  const initSocket = () => {
    socket.value = io('http://localhost:3600/chat', {
      transports: ['websocket'],
      // 可选：添加认证token
      query: {
        token: userStore.token
      }
    });

    socket.value.on('connect', () => {
      isConnected.value = true;
      if (currentTeamId.value) {
        // 初始化获取团队成员在线状态
        getTeamMemberOnlineStatusApi(currentTeamId.value).then(res => {
          teamMemberOnlineStatus.value = res.data.members.map(item => ({
            id: item.userId,
            nickname: item.nickname,
            avatar: item.avatar,
            onlineStatus: item.onlineStatus.status
          }));
        });
      }
    });

    socket.value.on('disconnect', () => {
      isConnected.value = false;
      console.log('连接断开');
    });

    socket.value.on('newMessage', message => {
      // 聊天室列表处理
      const chatRoom = chatRoomList.value.find(item => item.id === message.chatRoomId);
      if (chatRoom) {
        chatRoom.lastMessage = message;
      } else {
        // 重新获取聊天室列表
        getChatRoomList({
          teamId: currentTeamId.value || undefined,
          hasUnread: true
        });
      }
      // 更新当前聊天室消息
      if (message.chatRoomId === currentChatRoomId.value) {
        // 检查消息是否已存在，避免重复插入
        const existingMessage = chatRoomMessages.value.find(msg => msg.id === message.id);
        if (!existingMessage) {
          chatRoomMessages.value.push(message);
          // 判断是否是自己发送的消息，如果是则标记需要滚动到底部
          if (message.senderId === currentUserId.value) {
            shouldScrollToBottom.value = true;
          }
        } else {
          console.warn('收到重复消息，已忽略:', message.id, message.content.substring(0, 50));
        }

        // 标记当前聊天室为已读
        markAsRead();
      }
    });

    // 监听用户上线
    socket.value.on('userOnline', message => {
      const user = teamMemberOnlineStatus.value.find(item => item.id === message.userId);
      if (user) {
        user.onlineStatus = OnlineStatusEnum.ONLINE;
      }
    });

    // 监听用户下线
    socket.value.on('userOffline', message => {
      const user = teamMemberOnlineStatus.value.find(item => item.id === message.userId);
      if (user) {
        user.onlineStatus = OnlineStatusEnum.OFFLINE;
      }
    });

    // 监听未读消息数量更新
    socket.value.on('unreadCountUpdate', data => {
      chatRoomList.value.forEach(item => {
        if (item.id === data.chatRoomId) {
          item.unreadCount = data.unreadCount;
        }
      });
    });

    // socket.value.on('muteStatusUpdate', data => {
    //   if (data.chatRoomId === chatRoomId) {
    //     isMuted.value = data.isMuted;
    //   }
    // });
  };

  const getChatRoomList = async (query: ChatRoomQueryDto = queryChatRoomDefault) => {
    const res = await getChatRoomListApi(currentUserId.value as number, query);
    chatRoomList.value = res.data;
  };

  const getChatRoomInfo = async (chatRoomId: string) => {
    const res = await getChatRoomInfoApi(chatRoomId);
    currentChatRoomInfo.value = res.data;
  };

  const joinRoom = async (chatRoomId: string) => {
    if (socket.value) {
      // 如果当前聊天室ID与要加入的聊天室ID相同，则不进行任何操作
      if (chatRoomId === currentChatRoomId.value) {
        return;
      }
      socket.value.emit('joinRoom', { chatRoomId });
      currentChatRoomId.value = chatRoomId;
      // 清空当前消息列表，避免跨聊天室消息混淆
      chatRoomMessages.value = [];
      // 获取聊天室详情
      getChatRoomInfo(chatRoomId);
      // 首次获取聊天室消息历史
      await firstGetChatRoomMessages();
      // 标记当前聊天室为已读
      markAsRead();
    }
  };

  const leaveRoom = (chatRoomId: string) => {
    if (socket.value) {
      socket.value.emit('leaveRoom', { chatRoomId });
      currentChatRoomId.value = null;
    }
  };

  // 发送消息
  const sendMessage = (content: string, type = 'text', atUserIds: number[] = [], replyToId = null) => {
    if (socket.value && currentChatRoomId.value) {
      socket.value.emit('sendMessage', {
        chatRoomId: currentChatRoomId.value,
        senderId: currentUserId.value,
        type,
        content,
        atUserIds,
        replyToId
      });
    }
  };

  // 首次获取聊天室消息历史
  const firstGetChatRoomMessages = async (limit = 10) => {
    if (!currentChatRoomId.value) {
      return;
    }
    const res = await getChatRoomMessagesApi(currentChatRoomId.value, {
      before: new Date().getTime().toString(),
      limit
    });
    // 旧-新排序，并去重
    const newMessages = res.data.reverse();
    const uniqueMessages = filterDuplicateMessages(newMessages, chatRoomMessages.value);
    chatRoomMessages.value = [...chatRoomMessages.value, ...uniqueMessages];
  };

  // 滚动加载聊天室消息历史
  const getChatRoomMessages = async (limit = 10) => {
    if (!currentChatRoomId.value) {
      return;
    }
    const res = await getChatRoomMessagesApi(currentChatRoomId.value, {
      before: chatRoomMessages.value[0] ? toTimestamp(chatRoomMessages.value[0].createdAt) + '' : new Date().getTime().toString(),
      limit
    });
    // 旧-新排序，并去重
    const newMessages = res.data.reverse();
    const uniqueMessages = filterDuplicateMessages(newMessages, chatRoomMessages.value);
    chatRoomMessages.value.unshift(...uniqueMessages);
  };

  const markAsRead = () => {
    if (socket.value && currentChatRoomId.value) {
      socket.value.emit('markAsRead', {
        chatRoomId: currentChatRoomId.value
      });
    }
  };

  // const toggleMute = () => {
  //   if (socket.value && chatRoomId) {
  //     socket.value.emit('toggleMute', {
  //       chatRoomId,
  //       userId
  //     });
  //   }
  // };

  // 创建团队默认聊天室
  const createTeamDefaultChatRoom = async () => {
    if (currentTeamId.value && isCreateTeamCustomChatRoom.value) {
      await createTeamDefaultChatRoomApi(currentTeamId.value);
      // 重新获取聊天列表
      getChatRoomList();
      ElMessage.success('创建默认聊天室成功');
    }
  };

  // 创建团队空间下的自定义聊天室
  const createCustomChatRoom = async (name: string) => {
    if (currentTeamId.value && isCreateTeamCustomChatRoom.value) {
      await createTeamCustomChatRoomApi(currentTeamId.value, {
        name,
        type: ChatRoomType.Group
      });
    }
  };

  // 检查私聊房间是否存在
  const findPrivateChatRoom = (userId1: number, userId2: number) => {
    return chatRoomList.value.find(item => item.type === ChatRoomType.Private && item.members?.some(member => member.userId === userId1) && item.members?.some(member => member.userId === userId2));
  };

  const createPrivateChatRoom = async (userId: number) => {
    if (currentUserId.value && userId) {
      if (userId === currentUserId.value) {
        return;
      }
      // 查找包含两个用户的私聊房间
      let privateChatRoom = findPrivateChatRoom(userId, currentUserId.value);

      if (privateChatRoom) {
        // 切换到私聊聊天室
        await joinRoom(privateChatRoom.id);
        // 滚动到底部
        shouldScrollToBottom.value = true;
        return;
      }
      const res = await createPrivateChatRoomApi(currentUserId.value, userId);
      privateChatRoom = res.data;
      // 重新获取聊天室列表
      await getChatRoomList();
      await joinRoom(privateChatRoom.id);
      // 滚动到底部
      shouldScrollToBottom.value = true;
    }
  };

  // 移除聊天室成员
  const removeChatRoomMember = async (userId: number) => {
    if (currentChatRoomId.value && userId) {
      await removeChatRoomMemberApi(currentChatRoomId.value, userId);
      ElMessage.success('移除成员成功');
      // 重新查询聊天室详情
      await getChatRoomInfo(currentChatRoomId.value);
    }
  };

  // 退出聊天室
  const exitChatRoom = async () => {
    if (currentChatRoomId.value) {
      await removeChatRoomMemberApi(currentChatRoomId.value, currentUserId.value as number);
      ElMessage.success('退出聊天室成功');
      // 清空当前聊天室信息
      currentChatRoomInfo.value = null;
      // 清空当前聊天室ID
      currentChatRoomId.value = null;
      // 清空当前聊天室消息列表
      chatRoomMessages.value = [];
      // 重新获取聊天室列表
      getChatRoomList();
    }
  };

  // 删除聊天室
  const deleteChatRoom = async () => {
    if (currentChatRoomId.value) {
      await deleteChatRoomApi(currentChatRoomId.value);
      ElMessage.success('删除聊天室成功');
      // 清空当前聊天室信息
      currentChatRoomInfo.value = null;
      // 清空当前聊天室ID
      currentChatRoomId.value = null;
      // 清空当前聊天室消息列表
      chatRoomMessages.value = [];
      // 重新获取聊天室列表
      getChatRoomList();
    }
  };

  // 重置滚动到底部标记
  const resetScrollToBottom = () => {
    shouldScrollToBottom.value = false;
  };

  onMounted(() => {
    initSocket();
    // 初始化获取聊天列表
    getChatRoomList();
    if (currentTeamId.value) {
      // 初始化获取是否有在团队空间下创建自定义聊天室权限
      checkCreateRoomPermissionApi(currentTeamId.value, ChatRoomType.Group).then(res => {
        isCreateTeamCustomChatRoom.value = res.data.canCreate;
      });
    }
  });

  onUnmounted(() => {
    if (socket.value) {
      socket.value.close();
    }
  });

  return {
    chatRoomMessages,
    isConnected,
    isMuted,
    chatRoomList,
    currentChatRoomInfo,
    currentChatRoomId,
    currentUserId,
    getChatRoomList,
    joinRoom,
    leaveRoom,
    createTeamDefaultChatRoom,
    createCustomChatRoom,
    sendMessage,
    getChatRoomMessages,
    getChatRoomInfo,
    createPrivateChatRoom,
    removeChatRoomMember,
    exitChatRoom,
    deleteChatRoom,
    teamMemberOnlineStatus,
    shouldScrollToBottom,
    resetScrollToBottom
  };
}
