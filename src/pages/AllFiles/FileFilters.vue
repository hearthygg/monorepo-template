<template>
  <div class="space-y-4">
    <!-- 主操作栏 -->
    <div class="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
      <!-- 左侧：搜索和筛选 -->
      <div class="flex flex-1 max-w-2xl gap-2">
        <div class="relative flex-1">
          <SearchIcon class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="搜索文件和文件夹..."
            class="bg-white pl-10 w-full px-3 py-2 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none"
            @input="$emit('searchChange', searchQuery)"
          />
        </div>

        <!-- 高级筛选按钮 -->
        <button
          :class="['flex bg-white items-center gap-2 px-3 py-2 border rounded-md text-sm transition-colors', showAdvancedFilters ? 'bg-blue-50 border-blue-200' : 'border-gray-200 hover:bg-gray-50']"
          @click="showAdvancedFilters = !showAdvancedFilters"
        >
          <FilterIcon class="h-4 w-4" />
          筛选
          <span v-if="activeFiltersCount > 0" class="bg-gray-100 text-gray-800 text-xs px-1.5 py-0.5 rounded-full">
            {{ activeFiltersCount }}
          </span>
        </button>
      </div>

      <!-- 右侧：操作按钮 -->
      <div class="flex items-center gap-2">
        <!-- 批量操作 -->
        <div v-if="selectedCount > 0" class="flex items-center gap-2 mr-4">
          <span class="text-sm text-gray-600">已选择 {{ selectedCount }} 项</span>
          <button class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50" @click="$emit('bulkDownload')">下载</button>
          <button class="px-3 py-1 border border-gray-300 rounded text-sm text-red-600 hover:bg-gray-50" @click="$emit('bulkDelete')">删除</button>
        </div>

        <!-- 收藏筛选 -->
        <button
          :class="['flex items-center gap-2 px-3 py-2 rounded-md text-sm transition-colors', showStarredOnly ? 'bg-blue-500 text-white' : 'border border-gray-200 hover:bg-gray-50']"
          @click="$emit('starredFilterChange', !showStarredOnly)"
        >
          <StarIcon class="h-4 w-4" />
          收藏
        </button>

        <!-- 排序 -->
        <div class="relative">
          <button class="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50 text-sm" @click="showSortDropdown = !showSortDropdown">
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

        <!-- 创建按钮 -->
        <button class="flex items-center gap-2 px-3 py-2 border border-gray-200 rounded-md hover:bg-gray-50 text-sm" @click="$emit('createFolder')">
          <FolderPlusIcon class="h-4 w-4" />
          新建文件夹
        </button>

        <button class="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm" @click="$emit('upload')">
          <UploadIcon class="h-4 w-4" />
          上传文件
        </button>
      </div>
    </div>

    <!-- 高级筛选面板 -->
    <div v-if="showAdvancedFilters" class="bg-gray-50 rounded-lg p-4 space-y-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <!-- 文件类型筛选 -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">文件类型</label>
          <div class="space-y-2">
            <label v-for="option in typeOptions" :key="option.value" class="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" :checked="typeFilter.includes(option.value)" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" @change="toggleType(option.value)" />
              <span class="text-sm text-gray-700">{{ option.label }}</span>
            </label>
          </div>
        </div>

        <!-- 团队筛选 -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">所属团队</label>
          <select :value="teamFilter" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500" @change="$emit('teamFilterChange', ($event.target as HTMLSelectElement).value)">
            <option v-for="option in teamOptions" :key="option.value" :value="option.value">
              {{ option.label }}
            </option>
          </select>
        </div>

        <!-- 其他筛选选项 -->
        <div class="space-y-2">
          <label class="text-sm font-medium text-gray-700">其他选项</label>
          <div class="space-y-2">
            <label class="flex items-center space-x-2 cursor-pointer">
              <input type="checkbox" :checked="showStarredOnly" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" @change="$emit('starredFilterChange', ($event.target as HTMLInputElement).checked)" />
              <span class="text-sm text-gray-700">仅显示收藏</span>
            </label>
          </div>
        </div>
      </div>

      <!-- 清除筛选按钮 -->
      <div v-if="hasActiveFilters" class="flex justify-end">
        <button class="px-3 py-1 border border-gray-300 rounded text-sm hover:bg-gray-50" @click="clearFilters">清除所有筛选</button>
      </div>
    </div>

    <!-- 活动筛选器显示 -->
    <div v-if="hasActiveFilters" class="flex items-center gap-2 flex-wrap">
      <span class="text-sm text-gray-500">活动筛选:</span>
      <span v-for="type in typeFilter" :key="type" class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
        {{ getTypeLabel(type) }}
        <button class="ml-1 hover:bg-gray-200 rounded-full p-0.5 text-gray-500" @click="removeType(type)">×</button>
      </span>
      <span v-if="teamFilter" class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
        {{ getTeamLabel(teamFilter) }}
        <button class="ml-1 hover:bg-gray-200 rounded-full p-0.5 text-gray-500" @click="$emit('teamFilterChange', '')">×</button>
      </span>
      <span v-if="showStarredOnly" class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-md">
        仅收藏
        <button class="ml-1 hover:bg-gray-200 rounded-full p-0.5 text-gray-500" @click="$emit('starredFilterChange', false)">×</button>
      </span>
    </div>

    <!-- 结果统计 -->
    <div class="flex items-center justify-between text-sm text-gray-500">
      <span>显示 {{ filteredCount }} / {{ totalCount }} 个项目</span>
      <span v-if="selectedCount > 0">已选择 {{ selectedCount }} 项</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search as SearchIcon, Filter as FilterIcon, SortAsc as SortAscIcon, SortDesc as SortDescIcon, Grid as GridIcon, List as ListIcon, Star as StarIcon, Upload as UploadIcon, FolderPlus as FolderPlusIcon } from 'lucide-vue-next';

interface Props {
  searchQuery: string;
  sortBy: 'name' | 'modified' | 'size' | 'type';
  sortOrder: 'asc' | 'desc';
  typeFilter: string[];
  teamFilter: string;
  viewMode: 'grid' | 'list';
  showStarredOnly: boolean;
  totalCount: number;
  filteredCount: number;
  selectedCount: number;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  searchChange: [query: string];
  sortChange: [sortBy: string, order: 'asc' | 'desc'];
  typeFilterChange: [types: string[]];
  teamFilterChange: [team: string];
  viewModeChange: [mode: 'grid' | 'list'];
  starredFilterChange: [starred: boolean];
  upload: [];
  createFolder: [];
  bulkDelete: [];
  bulkDownload: [];
}>();

const searchQuery = ref(props.searchQuery);
const showAdvancedFilters = ref(false);
const showSortDropdown = ref(false);

const sortOptions = [
  { value: 'name', label: '文件名' },
  { value: 'modified', label: '修改时间' },
  { value: 'size', label: '文件大小' },
  { value: 'type', label: '文件类型' }
];

const typeOptions = [
  { value: 'folder', label: '文件夹' },
  { value: 'doc', label: '文档' },
  { value: 'image', label: '图片' },
  { value: 'spreadsheet', label: '表格' },
  { value: 'code', label: '代码' },
  { value: 'other', label: '其他' }
];

const teamOptions = [
  { value: '', label: '所有团队' },
  { value: 'design', label: '产品设计团队' },
  { value: 'frontend', label: '前端开发组' },
  { value: 'marketing', label: '市场营销部' },
  { value: 'backend', label: '后端开发团队' }
];

const activeFiltersCount = computed(() => {
  return props.typeFilter.length + (props.teamFilter ? 1 : 0) + (props.showStarredOnly ? 1 : 0);
});

const hasActiveFilters = computed(() => {
  return props.searchQuery || props.typeFilter.length > 0 || props.teamFilter || props.showStarredOnly;
});

const toggleType = (type: string) => {
  const newTypes = props.typeFilter.includes(type) ? props.typeFilter.filter(t => t !== type) : [...props.typeFilter, type];
  emit('typeFilterChange', newTypes);
};

const removeType = (type: string) => {
  const newTypes = props.typeFilter.filter(t => t !== type);
  emit('typeFilterChange', newTypes);
};

const getTypeLabel = (type: string) => {
  return typeOptions.find(t => t.value === type)?.label || type;
};

const getTeamLabel = (team: string) => {
  return teamOptions.find(t => t.value === team)?.label || team;
};

const handleSortChange = (newSortBy: string) => {
  const newOrder = props.sortBy === newSortBy && props.sortOrder === 'asc' ? 'desc' : 'asc';
  emit('sortChange', newSortBy, newOrder);
  showSortDropdown.value = false;
};

const clearFilters = () => {
  searchQuery.value = '';
  emit('searchChange', '');
  emit('typeFilterChange', []);
  emit('teamFilterChange', '');
  emit('starredFilterChange', false);
};

// 点击外部关闭下拉菜单
document.addEventListener('click', e => {
  const target = e.target as HTMLElement;
  if (!target.closest('.relative')) {
    showSortDropdown.value = false;
  }
});
</script>
