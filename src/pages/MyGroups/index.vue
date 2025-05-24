<template>
  <div class="space-y-6 main-container">
    <!-- 页面标题和操作 -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900">我的团队</h1>
        <p class="text-gray-500 mt-1">管理您参与的所有团队空间</p>
      </div>
      <button class="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors" @click="isCreateModalOpen = true">
        <PlusIcon class="h-4 w-4 mr-2" />
        创建团队
      </button>
    </div>

    <!-- 筛选和搜索 -->
    <TeamFilters
      :search-query="searchQuery"
      :sort-by="sortBy"
      :sort-order="sortOrder"
      :role-filter="roleFilter"
      :view-mode="viewMode"
      :total-count="teams.length"
      :filtered-count="filteredAndSortedTeams.length"
      @search-change="searchQuery = $event"
      @sort-change="handleSortChange"
      @role-filter-change="roleFilter = $event"
      @view-mode-change="viewMode = $event"
    />

    <!-- 团队列表/网格 -->
    <div v-if="filteredAndSortedTeams.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <UsersIcon class="h-12 w-12 mx-auto" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">没有找到团队</h3>
      <p class="text-gray-500 mb-4">
        {{ searchQuery || roleFilter.length > 0 ? '尝试调整搜索条件或筛选器' : '您还没有加入任何团队' }}
      </p>
      <button v-if="!searchQuery && roleFilter.length === 0" class="inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" @click="isCreateModalOpen = true">
        <PlusIcon class="h-4 w-4 mr-2" />
        创建第一个团队
      </button>
    </div>

    <!-- 列表视图 -->
    <div v-else-if="viewMode === 'list'" class="space-y-4">
      <TeamListItem
        v-for="team in filteredAndSortedTeams"
        :id="team.id"
        :key="team.id"
        :name="team.name"
        :description="team.description"
        :member-count="team.memberCount"
        :file-count="team.fileCount"
        :created-at="team.createdAt"
        :role="team.role"
        :is-active="selectedTeam === team.id"
        @click="handleTeamClick(team.id)"
      />
    </div>

    <!-- 网格视图 -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <TeamGridItem
        v-for="team in filteredAndSortedTeams"
        :id="team.id"
        :key="team.id"
        :name="team.name"
        :description="team.description"
        :member-count="team.memberCount"
        :file-count="team.fileCount"
        :created-at="team.createdAt"
        :role="team.role"
        @click="handleTeamClick(team.id)"
      />
    </div>

    <!-- 创建团队模态框 -->
    <CreateTeamModal :is-open="isCreateModalOpen" @close="isCreateModalOpen = false" @submit="handleCreateTeam" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Plus as PlusIcon, Users as UsersIcon } from 'lucide-vue-next';
import TeamListItem from './TeamListItem.vue';
import TeamGridItem from './TeamGridItem.vue';
import TeamFilters from './TeamFilters.vue';
import CreateTeamModal from './CreateTeamModal.vue';
import { useRouter } from 'vue-router';
const router = useRouter();
// 模拟团队数据
const mockTeams = [
  {
    id: '1',
    name: '产品设计团队',
    description: '负责产品UI/UX设计和用户研究，致力于创造优秀的用户体验',
    memberCount: 8,
    fileCount: 36,
    createdAt: new Date(2024, 0, 15),
    role: 'owner' as const
  },
  {
    id: '2',
    name: '前端开发组',
    description: '负责Web前端和移动端应用开发，使用最新的技术栈',
    memberCount: 5,
    fileCount: 24,
    createdAt: new Date(2024, 1, 20),
    role: 'admin' as const
  },
  {
    id: '3',
    name: '市场营销部',
    description: '负责产品推广、市场分析和用户增长策略制定',
    memberCount: 6,
    fileCount: 18,
    createdAt: new Date(2024, 2, 10),
    role: 'member' as const
  },
  {
    id: '4',
    name: '后端开发团队',
    description: '负责服务器端开发、数据库设计和API接口开发',
    memberCount: 7,
    fileCount: 42,
    createdAt: new Date(2024, 3, 5),
    role: 'admin' as const
  },
  {
    id: '5',
    name: '质量保证团队',
    description: '负责产品测试、质量控制和自动化测试流程建设',
    memberCount: 4,
    fileCount: 15,
    createdAt: new Date(2024, 4, 12),
    role: 'member' as const
  },
  {
    id: '6',
    name: '数据分析组',
    description: '负责数据收集、分析和商业智能报告生成',
    memberCount: 3,
    fileCount: 28,
    createdAt: new Date(2024, 4, 18),
    role: 'owner' as const
  }
];

const teams = ref(mockTeams);
const searchQuery = ref('');
const sortBy = ref<'name' | 'created' | 'members' | 'files'>('name');
const sortOrder = ref<'asc' | 'desc'>('asc');
const roleFilter = ref<string[]>([]);
const viewMode = ref<'grid' | 'list'>('list');
const isCreateModalOpen = ref(false);
const selectedTeam = ref<string | null>(null);

// 筛选和排序团队
const filteredAndSortedTeams = computed(() => {
  let filtered = teams.value;

  // 搜索筛选
  if (searchQuery.value) {
    filtered = filtered.filter(team => team.name.toLowerCase().includes(searchQuery.value.toLowerCase()) || team.description.toLowerCase().includes(searchQuery.value.toLowerCase()));
  }

  // 角色筛选
  if (roleFilter.value.length > 0) {
    filtered = filtered.filter(team => roleFilter.value.includes(team.role));
  }

  // 排序
  filtered.sort((a, b) => {
    let aValue: any;
    let bValue: any;

    switch (sortBy.value) {
      case 'name':
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case 'created':
        aValue = a.createdAt.getTime();
        bValue = b.createdAt.getTime();
        break;
      case 'members':
        aValue = a.memberCount;
        bValue = b.memberCount;
        break;
      case 'files':
        aValue = a.fileCount;
        bValue = b.fileCount;
        break;
      default:
        return 0;
    }

    if (sortOrder.value === 'asc') {
      return aValue > bValue ? 1 : -1;
    } else {
      return aValue < bValue ? 1 : -1;
    }
  });

  return filtered;
});

const handleSortChange = (newSortBy: string, newSortOrder: 'asc' | 'desc') => {
  sortBy.value = newSortBy as 'name' | 'created' | 'members' | 'files';
  sortOrder.value = newSortOrder;
};

const handleCreateTeam = (data: { name: string; description: string }) => {
  const newTeam = {
    id: `team-${Date.now()}`,
    name: data.name,
    description: data.description,
    memberCount: 1,
    fileCount: 0,
    createdAt: new Date(),
    role: 'owner' as const
  };

  teams.value.push(newTeam);
};

const handleTeamClick = (teamId: string) => {
  selectedTeam.value = teamId;
  console.log(`Navigate to team ${teamId}`);
  router.push(`/group-details/${teamId}`);
};
</script>
