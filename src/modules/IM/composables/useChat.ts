import { ref, onMounted, onUnmounted } from 'vue';
// Socket.IO 是一个基于 WebSocket 的实时通信库
import io from 'socket.io-client';
import type { Socket } from 'socket.io-client';
import { useUserStore } from '@/stores/user';
import type { ChatRoomDetailResponseDto, ChatRoomMessageResponseDto, ChatRoomQueryDto, ChatRoomResponseDto } from '@/services/api/im/type';
import { getChatRoomInfoApi, getChatRoomListApi, getChatRoomMessagesApi } from '@/services/api/im';
import { checkCreateRoomPermissionApi, createTeamDefaultChatRoomApi, getTeamMemberOnlineStatusApi } from '@/services/api/team';
import { ChatRoomType } from '@/constants/enum';
import { ElMessage } from 'element-plus';
import type { TeamMemberOnlineStatus } from '@/types/team';
import { toTimestamp } from '@/utils/date';

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
      console.log('连接成功');
    });

    socket.value.on('disconnect', () => {
      isConnected.value = false;
      console.log('连接断开');
    });

    socket.value.on('newMessage', message => {
      // messages.value.push(message);
      console.log(message);

      // 更新当前聊天室消息
      if (message.chatRoomId === currentChatRoomId.value) {
        chatRoomMessages.value.push(message);
      }
    });

    // 监听用户上线
    socket.value.on('userOnline', message => {
      console.log('用户上线', message);
    });

    // 监听用户下线
    socket.value.on('userOffline', message => {
      console.log(message);
    });

    // socket.value.on('unreadCountUpdate', data => {
    //   if (data.chatRoomId === chatRoomId) {
    //     unreadCount.value = data.unreadCount;
    //   }
    // });

    // socket.value.on('muteStatusUpdate', data => {
    //   if (data.chatRoomId === chatRoomId) {
    //     isMuted.value = data.isMuted;
    //   }
    // });
  };

  const getChatRoomList = async (query: ChatRoomQueryDto) => {
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
      await getChatRoomInfo(chatRoomId);
      // 首次获取聊天室消息历史
      firstGetChatRoomMessages();
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
    console.log(content);
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
    // 旧-新排序
    chatRoomMessages.value = res.data.reverse();
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
    chatRoomMessages.value.unshift(...res.data.reverse());
  };

  // const markAsRead = (messageId = null) => {
  //   if (socket.value && chatRoomId) {
  //     socket.value.emit('markAsRead', {
  //       chatRoomId,
  //       userId,
  //       messageId
  //     });
  //   }
  // };

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
      getChatRoomList({
        teamId: currentTeamId.value || undefined
      });
      ElMessage.success('创建默认聊天室成功');
    }
  };

  onMounted(() => {
    initSocket();
    // 初始化获取聊天列表
    getChatRoomList({
      teamId: currentTeamId.value || undefined
    });
    if (currentTeamId.value) {
      // 初始化获取是否有在团队空间下创建自定义聊天室权限
      checkCreateRoomPermissionApi(currentTeamId.value, ChatRoomType.Group).then(res => {
        isCreateTeamCustomChatRoom.value = res.data.canCreate;
      });

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
    sendMessage,
    getChatRoomMessages,
    getChatRoomInfo,
    teamMemberOnlineStatus
  };
}
