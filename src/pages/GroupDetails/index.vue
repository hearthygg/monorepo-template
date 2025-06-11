<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 页面顶部导航栏 -->
    <div class="bg-white border-b border-gray-200 py-3 px-4">
      <div class="flex items-center justify-between">
        <!-- 左侧：返回按钮和团队信息 -->
        <div class="flex items-center space-x-4">
          <button class="p-2 hover:bg-gray-100 rounded-md transition-colors" @click="routerBack">
            <ArrowLeft class="h-5 w-5" />
          </button>
          <div class="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
            <span class="text-blue-600 text-sm font-bold">
              {{ team.name.substring(0, 2).toUpperCase() }}
            </span>
          </div>
          <div>
            <h1 class="text-lg font-semibold text-gray-900">{{ team.name }}</h1>
            <div class="flex items-center space-x-3 text-xs text-gray-500">
              <span>{{ team.memberCount }} 成员</span>
              <span>•</span>
              <span>{{ team.fileCount }} 文件</span>
            </div>
          </div>
        </div>

        <!-- 中间：视图切换按钮 -->
        <div class="flex items-center bg-gray-100 rounded-lg p-1">
          <button :class="['px-3 py-2 text-sm font-medium rounded-md transition-all flex items-center', viewMode === 'dashboard' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900']" @click="viewMode = 'dashboard'">
            <BarChart3 class="h-4 w-4 mr-2" />
            数据看板
          </button>
          <button :class="['px-3 py-2 text-sm font-medium rounded-md transition-all flex items-center', viewMode === 'files' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900']" @click="viewMode = 'files'">
            <FolderOpen class="h-4 w-4 mr-2" />
            文件管理
          </button>
        </div>

        <!-- 右侧：操作按钮 -->
        <div class="flex items-center space-x-2">
          <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium flex items-center transition-colors" @click="isInviteModalOpen = true">
            <UserPlus class="h-4 w-4 mr-2" />
            邀请成员
          </button>
          <div class="relative">
            <button class="p-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors" @click="showMoreMenu = !showMoreMenu">
              <MoreVertical class="h-4 w-4" />
            </button>
            <div v-if="showMoreMenu" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
              <div class="py-1">
                <button class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Edit3 class="mr-2 h-4 w-4" />
                  编辑团队信息
                </button>
                <button class="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                  <Settings class="mr-2 h-4 w-4" />
                  团队设置
                </button>
                <hr class="my-1" />
                <button class="flex items-center w-full px-4 py-2 text-sm text-red-500 hover:bg-gray-100">
                  <Share2 class="mr-2 h-4 w-4" />
                  离开团队
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 主要内容区域 -->
    <div class="h-[calc(100vh-73px)]">
      <!-- 数据看板模式 -->
      <div v-if="viewMode === 'dashboard'" class="space-y-6 p-4 h-full overflow-y-auto">
        <!-- 统计卡片 -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div v-for="(stat, index) in statsData" :key="index" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div class="flex items-center justify-between">
              <div class="flex-1">
                <p class="text-sm font-medium text-gray-600 mb-1">{{ stat.title }}</p>
                <p class="text-2xl font-bold text-gray-900">{{ stat.value }}</p>
                <div v-if="stat.change" class="flex items-center mt-2">
                  <span :class="['text-xs font-medium', stat.change.type === 'increase' ? 'text-green-600' : 'text-red-600']"> {{ stat.change.type === 'increase' ? '+' : '-' }}{{ Math.abs(stat.change.value) }}% </span>
                  <span class="text-xs text-gray-500 ml-1">{{ stat.change.period }}</span>
                </div>
              </div>
              <div :class="['p-3 rounded-lg', getStatBgClass(stat.color)]">
                <component :is="stat.icon" :class="['h-6 w-6', getStatIconClass(stat.color)]" />
              </div>
            </div>
          </div>
        </div>

        <!-- 标签页内容 -->
        <div class="space-y-6">
          <div class="flex space-x-1 bg-gray-100 p-1 rounded-lg w-fit">
            <button
              v-for="tab in tabs"
              :key="tab.value"
              :class="['px-4 py-2 text-sm font-medium rounded-md transition-all', activeTab === tab.value ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900']"
              @click="activeTab = tab.value"
            >
              {{ tab.label }}
            </button>
          </div>

          <!-- 概览标签页 -->
          <div v-if="activeTab === 'overview'" class="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <!-- 最近文件 -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
              <div class="flex items-center justify-between p-6 border-b border-gray-200">
                <h3 class="text-lg font-semibold">最近文件</h3>
                <button class="text-sm text-blue-600 hover:text-blue-700 font-medium" @click="viewMode = 'files'">查看全部</button>
              </div>
              <div class="p-6">
                <div class="space-y-2">
                  <div v-for="file in recentFiles" :key="file.id" class="flex items-center gap-4 p-3 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <component :is="getFileIcon(file.type)" class="h-8 w-8 text-blue-500" />
                    <div class="flex-1 min-w-0">
                      <h4 class="text-sm font-medium text-gray-900 truncate">{{ file.name }}</h4>
                      <div class="flex items-center mt-1 text-xs text-gray-500 gap-2">
                        <span class="truncate">{{ file.teamName }}</span>
                        <span>•</span>
                        <span>{{ formatDate(file.updatedAt) }}</span>
                      </div>
                    </div>
                    <div class="flex items-center gap-2">
                      <button class="p-1 hover:bg-gray-200 rounded">
                        <Star :class="['h-4 w-4', file.isStarred ? 'fill-yellow-400 text-yellow-400' : 'text-gray-400']" />
                      </button>
                      <button class="p-1 hover:bg-gray-200 rounded">
                        <MoreHorizontal class="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 团队活动 -->
            <div class="bg-white rounded-lg shadow-sm border border-gray-200">
              <div class="p-6 border-b border-gray-200">
                <h3 class="text-lg font-semibold">团队动态</h3>
              </div>
              <div class="p-6">
                <div class="space-y-4">
                  <div v-for="activity in activities.slice(0, 5)" :key="activity.id" class="flex items-start space-x-3">
                    <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                      <span class="text-xs font-medium">{{ activity.user.name.substring(0, 2).toUpperCase() }}</span>
                    </div>
                    <div class="flex-1 min-w-0">
                      <div class="p-3 rounded-lg border border-gray-200 bg-gray-50">
                        <div class="flex items-start justify-between">
                          <div class="flex items-center space-x-2 flex-1">
                            <component :is="getActivityIcon(activity.type)" class="h-4 w-4 text-blue-500" />
                            <div class="flex-1 min-w-0">
                              <p class="text-sm text-gray-900">
                                <span class="font-medium">{{ activity.user.name }}</span> {{ activity.description }}
                              </p>
                              <p v-if="activity.metadata?.fileName" class="text-xs text-gray-600 mt-1 truncate">文件: {{ activity.metadata.fileName }}</p>
                            </div>
                          </div>
                          <span class="text-xs text-gray-500 flex-shrink-0 ml-2">
                            {{ formatTimeAgo(activity.timestamp) }}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 成员标签页 -->
          <div v-if="activeTab === 'members'" class="space-y-6">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-semibold">团队成员 ({{ members.length }})</h3>
              <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium flex items-center" @click="isInviteModalOpen = true">
                <UserPlus class="h-4 w-4 mr-2" />
                邀请成员
              </button>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div v-for="member in members" :key="member.id" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div class="flex items-start justify-between mb-4">
                  <div class="flex items-center space-x-3">
                    <div class="relative">
                      <div class="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center">
                        <span class="text-lg font-semibold">{{ member.name.substring(0, 2).toUpperCase() }}</span>
                      </div>
                      <div v-if="member.isOnline" class="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    <div class="flex-1 min-w-0">
                      <h3 class="text-lg font-semibold text-gray-900 truncate">{{ member.name }}</h3>
                      <p class="text-sm text-gray-500 truncate">{{ member.email }}</p>
                    </div>
                  </div>
                </div>
                <div class="space-y-3">
                  <div class="flex items-center justify-between">
                    <span :class="['px-2 py-1 rounded text-xs font-medium flex items-center gap-1', getRoleBadgeClass(member.role)]">
                      <component :is="getRoleIcon(member.role)" class="h-3 w-3" />
                      {{ getRoleText(member.role) }}
                    </span>
                    <span class="text-xs text-gray-500">
                      {{ member.isOnline ? '在线' : formatTimeAgo(member.lastActive) }}
                    </span>
                  </div>
                  <div class="text-xs text-gray-500">加入时间: {{ formatDate(member.joinedAt) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- 动态标签页 -->
          <div v-if="activeTab === 'activity'" class="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <h3 class="text-lg font-semibold mb-6">团队动态</h3>
            <div class="space-y-4">
              <div v-for="activity in activities" :key="activity.id" class="flex items-start space-x-3">
                <div class="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span class="text-xs font-medium">{{ activity.user.name.substring(0, 2).toUpperCase() }}</span>
                </div>
                <div class="flex-1 min-w-0">
                  <div class="p-3 rounded-lg border border-gray-200 bg-gray-50">
                    <div class="flex items-start justify-between">
                      <div class="flex items-center space-x-2 flex-1">
                        <component :is="getActivityIcon(activity.type)" class="h-4 w-4 text-blue-500" />
                        <div class="flex-1 min-w-0">
                          <p class="text-sm text-gray-900">
                            <span class="font-medium">{{ activity.user.name }}</span> {{ activity.description }}
                          </p>
                          <p v-if="activity.metadata?.fileName" class="text-xs text-gray-600 mt-1 truncate">文件: {{ activity.metadata.fileName }}</p>
                        </div>
                      </div>
                      <span class="text-xs text-gray-500 flex-shrink-0 ml-2">
                        {{ formatTimeAgo(activity.timestamp) }}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 文件管理模式 -->
      <TeamFileManager v-else :team-id="team.id" :team-name="team.name" />
    </div>

    <!-- 邀请成员模态框 -->
    <InviteMemberModal v-model="isInviteModalOpen" width="700px" :team-id="currentTeamId" @success="handleInviteMember" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { ArrowLeft, BarChart3, FolderOpen, UserPlus, MoreVertical, Edit3, Settings, Share2, Users, Files, Activity, Star, Upload, FileText, MessageSquare, MoreHorizontal, Crown, Shield, User } from 'lucide-vue-next';
import type { LucideIcon } from 'lucide-vue-next';
import TeamFileManager from './TeamFileManager.vue';
import InviteMemberModal from '@/components/business/InviteMemberModal.vue';

const route = useRoute();
const currentTeamId = computed(() => parseInt(route.params.id as string));
// 类型定义
type ViewMode = 'dashboard' | 'files';
type TabType = 'overview' | 'members' | 'activity';
type ActivityType = 'file_upload' | 'member_join' | 'file_edit' | 'comment';
type RoleType = 'owner' | 'admin' | 'member';
type FileType = 'doc' | 'image' | 'other';
type StatColor = 'blue' | 'green' | 'purple' | 'orange';

interface UserInfo {
  name: string;
}

interface Team {
  id: string;
  name: string;
  description: string;
  avatarUrl: string;
  createdAt: Date;
  memberCount: number;
  fileCount: number;
  currentUserRole: RoleType;
}

interface Member {
  id: string;
  name: string;
  email: string;
  role: RoleType;
  joinedAt: Date;
  lastActive: Date;
  isOnline: boolean;
}

interface ActivityInfo {
  id: string;
  type: ActivityType;
  user: UserInfo;
  timestamp: Date;
  description: string;
  metadata?: {
    fileName?: string;
    memberName?: string;
  };
}

interface File {
  id: string;
  name: string;
  type: FileType;
  size: number;
  teamName: string;
  updatedAt: Date;
  updatedBy: UserInfo;
  isStarred: boolean;
}

interface Stat {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
    period: string;
  };
  icon: LucideIcon;
  color: StatColor;
}

interface InviteData {
  emails: string[];
  role: RoleType;
}

const router = useRouter();

// 响应式数据
const viewMode = ref<ViewMode>('dashboard');
const activeTab = ref<TabType>('overview');
const isInviteModalOpen = ref(false);
const showMoreMenu = ref(false);

// 模拟数据
const team = ref<Team>({
  id: '1',
  name: '产品设计团队',
  description: '负责产品UI/UX设计和用户研究，致力于创造优秀的用户体验',
  avatarUrl: '',
  createdAt: new Date(2024, 0, 15),
  memberCount: 8,
  fileCount: 36,
  currentUserRole: 'admin'
});

const members = ref<Member[]>([
  {
    id: '1',
    name: '李明',
    email: 'liming@example.com',
    role: 'owner',
    joinedAt: new Date(2024, 0, 15),
    lastActive: new Date(),
    isOnline: true
  },
  {
    id: '2',
    name: '王芳',
    email: 'wangfang@example.com',
    role: 'admin',
    joinedAt: new Date(2024, 1, 20),
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    isOnline: false
  },
  {
    id: '3',
    name: '张伟',
    email: 'zhangwei@example.com',
    role: 'member',
    joinedAt: new Date(2024, 2, 10),
    lastActive: new Date(Date.now() - 30 * 60 * 1000),
    isOnline: true
  },
  {
    id: '4',
    name: '刘强',
    email: 'liuqiang@example.com',
    role: 'member',
    joinedAt: new Date(2024, 3, 5),
    lastActive: new Date(Date.now() - 24 * 60 * 60 * 1000),
    isOnline: false
  }
]);

const activities = ref<ActivityInfo[]>([
  {
    id: '1',
    type: 'file_upload',
    user: { name: '李明' },
    timestamp: new Date(Date.now() - 30 * 60 * 1000),
    description: '上传了新文件',
    metadata: { fileName: '产品原型设计.fig' }
  },
  {
    id: '2',
    type: 'member_join',
    user: { name: '系统' },
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    description: '新成员加入团队',
    metadata: { memberName: '赵敏' }
  },
  {
    id: '3',
    type: 'file_edit',
    user: { name: '王芳' },
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
    description: '编辑了文件',
    metadata: { fileName: '用户研究报告.docx' }
  },
  {
    id: '4',
    type: 'comment',
    user: { name: '张伟' },
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    description: '在文件中添加了评论',
    metadata: { fileName: '界面设计规范.pdf' }
  }
]);

const recentFiles = ref<File[]>([
  {
    id: '1',
    name: '产品原型设计.fig',
    type: 'other',
    size: 2048576,
    teamName: '产品设计团队',
    updatedAt: new Date(Date.now() - 30 * 60 * 1000),
    updatedBy: { name: '李明' },
    isStarred: true
  },
  {
    id: '2',
    name: '用户研究报告.docx',
    type: 'doc',
    size: 1024000,
    teamName: '产品设计团队',
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedBy: { name: '王芳' },
    isStarred: false
  },
  {
    id: '3',
    name: '界面设计规范.pdf',
    type: 'other',
    size: 3072000,
    teamName: '产品设计团队',
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
    updatedBy: { name: '张伟' },
    isStarred: true
  }
]);

// 计算属性
const statsData = computed<Stat[]>(() => [
  {
    title: '团队成员',
    value: members.value.length,
    change: { value: 12, type: 'increase', period: '本月' },
    icon: Users,
    color: 'blue'
  },
  {
    title: '文件总数',
    value: team.value.fileCount,
    change: { value: 8, type: 'increase', period: '本周' },
    icon: Files,
    color: 'green'
  },
  {
    title: '活跃度',
    value: '85%',
    change: { value: 5, type: 'increase', period: '本月' },
    icon: Activity,
    color: 'purple'
  },
  {
    title: '存储使用',
    value: '2.4GB',
    change: { value: 15, type: 'increase', period: '本月' },
    icon: Star,
    color: 'orange'
  }
]);

const tabs = [
  { value: 'overview' as TabType, label: '概览' },
  { value: 'members' as TabType, label: '成员' },
  { value: 'activity' as TabType, label: '动态' }
];

// 方法
const handleInviteMember = (data: InviteData): void => {
  console.log('Inviting members:', data);
  // isInviteModalOpen.value = false;
};

const getStatBgClass = (color: StatColor): string => {
  const classes: Record<StatColor, string> = {
    blue: 'bg-blue-50',
    green: 'bg-green-50',
    purple: 'bg-purple-50',
    orange: 'bg-orange-50'
  };
  return classes[color] || 'bg-gray-50';
};

const getStatIconClass = (color: StatColor): string => {
  const classes: Record<StatColor, string> = {
    blue: 'text-blue-500',
    green: 'text-green-500',
    purple: 'text-purple-500',
    orange: 'text-orange-500'
  };
  return classes[color] || 'text-gray-500';
};

const getFileIcon = (type: FileType): LucideIcon => {
  switch (type) {
    case 'doc':
      return FileText;
    default:
      return Files;
  }
};

const getActivityIcon = (type: ActivityType): LucideIcon => {
  switch (type) {
    case 'file_upload':
      return Upload;
    case 'member_join':
      return UserPlus;
    case 'file_edit':
      return Edit3;
    case 'comment':
      return MessageSquare;
    default:
      return Activity;
  }
};

const getRoleIcon = (role: RoleType): LucideIcon => {
  switch (role) {
    case 'owner':
      return Crown;
    case 'admin':
      return Shield;
    default:
      return User;
  }
};

const getRoleText = (role: RoleType): string => {
  switch (role) {
    case 'owner':
      return '组长';
    case 'admin':
      return '管理员';
    default:
      return '成员';
  }
};

const getRoleBadgeClass = (role: RoleType): string => {
  switch (role) {
    case 'owner':
      return 'bg-yellow-100 text-yellow-800';
    case 'admin':
      return 'bg-blue-100 text-blue-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (date: Date): string => {
  return new Intl.DateTimeFormat('zh-CN', {
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

const formatTimeAgo = (date: Date): string => {
  const now = new Date();
  const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

  if (diffInMinutes < 1) return '刚刚';
  if (diffInMinutes < 60) return `${diffInMinutes}分钟前`;
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小时前`;
  if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}天前`;
  return formatDate(date);
};

// 点击外部关闭菜单
const handleClickOutside = (event: MouseEvent): void => {
  if (showMoreMenu.value && !(event.target as HTMLElement).closest('.relative')) {
    showMoreMenu.value = false;
  }
};

const routerBack = (): void => {
  router.back();
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>
