<template>
  <div class="space-y-4">
    <!-- 搜索和操作栏 -->
    <div class="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div class="flex-1 max-w-md">
        <div class="relative">
          <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索团队名称或描述..."
            class="bg-white pl-10 w-full px-3 py-2 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
            @input="$emit('searchChange', searchQuery)"
          />
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- 筛选按钮 -->
        <div class="relative">
          <button class="bg-white flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50 text-sm" @click="showFilterDropdown = !showFilterDropdown">
            <FilterIcon class="h-4 w-4" />
            筛选
            <span v-if="roleFilter.length > 0" class="bg-gray-100 text-gray-800 text-xs px-1.5 py-0.5 rounded-full">
              {{ roleFilter.length }}
            </span>
          </button>

          <div v-if="showFilterDropdown" class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
            <div class="py-1">
              <div class="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">按角色筛选</div>
              <label v-for="option in roleOptions" :key="option.value" class="flex items-center px-4 py-2 hover:bg-gray-50 cursor-pointer">
                <input type="checkbox" :checked="roleFilter.includes(option.value)" class="mr-2 h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" @change="toggleRole(option.value)" />
                <span class="text-sm text-gray-700">{{ option.label }}</span>
              </label>
            </div>
          </div>
        </div>

        <!-- 排序按钮 -->
        <div class="relative">
          <button class="bg-white flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50 text-sm" @click="showSortDropdown = !showSortDropdown">
            <SortAscIcon v-if="sortOrder === 'asc'" class="h-4 w-4" />
            <SortDescIcon v-else class="h-4 w-4" />
            排序
          </button>

          <div v-if="showSortDropdown" class="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10">
            <div class="py-1">
              <div class="px-4 py-2 text-sm font-medium text-gray-700 border-b border-gray-100">排序方式</div>
              <button
                v-for="option in sortOptions"
                :key="option.value"
                :class="['w-full text-left px-4 py-2 text-sm hover:bg-gray-50', sortBy === option.value ? 'bg-blue-50 text-blue-700' : 'text-gray-700']"
                @click="handleSortChange(option.value)"
              >
                {{ option.label }}
              </button>
            </div>
          </div>
        </div>

        <!-- 视图切换 -->
        <div class="flex border border-gray-200 rounded-md">
          <button :class="['p-2 rounded-l-md', viewMode === 'grid' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50']" @click="$emit('viewModeChange', 'grid')">
            <GridIcon class="h-4 w-4" />
          </button>
          <button :class="['p-2 rounded-r-md', viewMode === 'list' ? 'bg-blue-500 text-white' : 'bg-white text-gray-600 hover:bg-gray-50']" @click="$emit('viewModeChange', 'list')">
            <ListIcon class="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>

    <!-- 活动筛选器和结果统计 -->
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div v-if="roleFilter.length > 0" class="flex items-center gap-2">
          <span class="text-sm text-gray-500">角色:</span>
          <span v-for="role in roleFilter" :key="role" class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
            {{ getRoleLabel(role) }}
            <button class="ml-1 hover:bg-gray-200 rounded-full p-0.5 text-gray-500" @click="removeRole(role)">×</button>
          </span>
        </div>
        <button v-if="roleFilter.length > 0 || searchQuery" class="text-sm text-gray-500 hover:text-gray-700" @click="clearFilters">清除筛选</button>
      </div>

      <div class="text-sm text-gray-500">显示 {{ filteredCount }} / {{ totalCount }} 个团队</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { Search as SearchIcon, Filter as FilterIcon, SortAsc as SortAscIcon, SortDesc as SortDescIcon, Grid as GridIcon, List as ListIcon } from 'lucide-vue-next';

interface Props {
  searchQuery: string;
  sortBy: 'name' | 'created' | 'members' | 'files';
  sortOrder: 'asc' | 'desc';
  roleFilter: string[];
  viewMode: 'grid' | 'list';
  totalCount: number;
  filteredCount: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  searchChange: [query: string];
  sortChange: [sortBy: string, order: 'asc' | 'desc'];
  roleFilterChange: [roles: string[]];
  viewModeChange: [mode: 'grid' | 'list'];
}>();

const searchQuery = ref(props.searchQuery);
const showFilterDropdown = ref(false);
const showSortDropdown = ref(false);

const sortOptions = [
  { value: 'name', label: '团队名称' },
  { value: 'created', label: '创建时间' },
  { value: 'members', label: '成员数量' },
  { value: 'files', label: '文件数量' }
];

const roleOptions = [
  { value: 'owner', label: '组长' },
  { value: 'admin', label: '管理员' },
  { value: 'member', label: '成员' }
];

const toggleRole = (role: string) => {
  const newRoles = props.roleFilter.includes(role) ? props.roleFilter.filter(r => r !== role) : [...props.roleFilter, role];
  emit('roleFilterChange', newRoles);
};

const removeRole = (role: string) => {
  const newRoles = props.roleFilter.filter(r => r !== role);
  emit('roleFilterChange', newRoles);
};

const getRoleLabel = (role: string) => {
  return roleOptions.find(r => r.value === role)?.label || role;
};

const handleSortChange = (newSortBy: string) => {
  const newOrder = props.sortBy === newSortBy && props.sortOrder === 'asc' ? 'desc' : 'asc';
  emit('sortChange', newSortBy, newOrder);
  showSortDropdown.value = false;
};

const clearFilters = () => {
  searchQuery.value = '';
  emit('searchChange', '');
  emit('roleFilterChange', []);
};

// 点击外部关闭下拉菜单
document.addEventListener('click', e => {
  const target = e.target as HTMLElement;
  if (!target.closest('.relative')) {
    showFilterDropdown.value = false;
    showSortDropdown.value = false;
  }
});
</script>
