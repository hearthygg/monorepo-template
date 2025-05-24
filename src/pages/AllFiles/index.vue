<template>
  <div class="space-y-6">
    <!-- 面包屑导航 -->
    <!-- <BreadcrumbNav
      :items="breadcrumbItems"
      @navigate="handleNavigate"
    /> -->

    <!-- 页面标题 -->
    <div>
      <h1 class="text-2xl font-bold text-gray-900">所有文件</h1>
      <p class="text-gray-500 mt-1">管理您的文件和文件夹</p>
    </div>

    <!-- 筛选和搜索 -->
    <FileFilters
      :search-query="searchQuery"
      :sort-by="sortBy"
      :sort-order="sortOrder"
      :type-filter="typeFilter"
      :team-filter="teamFilter"
      :view-mode="viewMode"
      :show-starred-only="showStarredOnly"
      :total-count="files.length"
      :filtered-count="filteredAndSortedFiles.length"
      :selected-count="selectedFiles.length"
      @search-change="searchQuery = $event"
      @sort-change="handleSortChange"
      @type-filter-change="typeFilter = $event"
      @team-filter-change="teamFilter = $event"
      @view-mode-change="viewMode = $event"
      @starred-filter-change="showStarredOnly = $event"
      @upload="isUploadModalOpen = true"
      @create-folder="isCreateFolderOpen = true"
      @bulk-delete="handleBulkDelete"
      @bulk-download="handleBulkDownload"
    />

    <!-- 文件列表/网格 -->
    <div v-if="filteredAndSortedFiles.length === 0" class="text-center py-12">
      <div class="text-gray-400 mb-4">
        <FileXIcon class="h-12 w-12 mx-auto" />
      </div>
      <h3 class="text-lg font-medium text-gray-900 mb-2">没有找到文件</h3>
      <p class="text-gray-500 mb-4">
        {{ searchQuery || typeFilter.length > 0 || teamFilter || showStarredOnly ? '尝试调整搜索条件或筛选器' : '还没有上传任何文件' }}
      </p>
      <button v-if="!searchQuery && typeFilter.length === 0 && !teamFilter && !showStarredOnly" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600" @click="isUploadModalOpen = true">上传第一个文件</button>
    </div>

    <!-- 列表视图 -->
    <div v-else-if="viewMode === 'list'" class="bg-white rounded-lg shadow-sm border border-gray-200">
      <!-- 列表头部 -->
      <div class="flex items-center gap-4 p-3 border-b border-gray-200 bg-gray-50">
        <div class="flex items-center">
          <input type="checkbox" :checked="selectedFiles.length === filteredAndSortedFiles.length" class="rounded border-gray-300 text-blue-600 focus:ring-blue-500" @change="handleSelectAll" />
        </div>
        <div class="flex-1 text-sm font-medium text-gray-700">名称</div>
        <div class="w-32 text-sm font-medium text-gray-700">修改者</div>
        <div class="w-20 text-sm font-medium text-gray-700">收藏</div>
        <div class="w-12"></div>
      </div>

      <!-- 文件列表 -->
      <div class="divide-y divide-gray-100">
        <FileListItem
          v-for="file in filteredAndSortedFiles"
          :id="file.id"
          :key="file.id"
          :name="file.name"
          :type="file.type"
          :size="file.size"
          :team-name="file.teamName"
          :updated-at="file.updatedAt"
          :updated-by="file.updatedBy"
          :is-starred="file.isStarred"
          :is-selected="selectedFiles.includes(file.id)"
          :permissions="file.permissions"
          @click="handleFileClick(file.id)"
          @select="selected => handleFileSelect(file.id, selected)"
          @star="handleFileStar(file.id)"
          @preview="handleFilePreview(file.id)"
          @download="handleFileDownload(file.id)"
          @share="handleFileShare(file.id)"
          @rename="handleFileRename(file.id)"
          @delete="handleFileDelete(file.id)"
        />
      </div>
    </div>

    <!-- 网格视图 -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
      <FileGridItem
        v-for="file in filteredAndSortedFiles"
        :id="file.id"
        :key="file.id"
        :name="file.name"
        :type="file.type"
        :size="file.size"
        :team-name="file.teamName"
        :updated-at="file.updatedAt"
        :updated-by="file.updatedBy"
        :is-starred="file.isStarred"
        :is-selected="selectedFiles.includes(file.id)"
        :permissions="file.permissions"
        @click="handleFileClick(file.id)"
        @select="selected => handleFileSelect(file.id, selected)"
        @star="handleFileStar(file.id)"
        @preview="handleFilePreview(file.id)"
        @download="handleFileDownload(file.id)"
        @share="handleFileShare(file.id)"
        @rename="handleFileRename(file.id)"
        @delete="handleFileDelete(file.id)"
      />
    </div>

    <!-- 文件上传模态框 -->
    <FileUploadModal :is-open="isUploadModalOpen" @close="isUploadModalOpen = false" @upload="handleUpload" />

    <!-- 创建文件夹对话框 -->
    <div v-if="isCreateFolderOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div class="absolute inset-0" @click="isCreateFolderOpen = false"></div>
      <div class="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6" @click.stop>
        <h2 class="text-xl font-semibold text-gray-900 mb-4">创建新文件夹</h2>
        <div class="space-y-4">
          <div class="space-y-2">
            <label for="folder-name" class="block text-sm font-medium text-gray-700">文件夹名称</label>
            <input id="folder-name" v-model="newFolderName" type="text" placeholder="输入文件夹名称" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:border-blue-500 focus:ring-blue-500" @keydown.enter="handleCreateFolder" />
          </div>
          <div class="flex justify-end gap-2">
            <button class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50" @click="isCreateFolderOpen = false">取消</button>
            <button :disabled="!newFolderName.trim()" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50" @click="handleCreateFolder">创建</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { FileX as FileXIcon } from 'lucide-vue-next';
import FileListItem from './FileListItem.vue';
import FileGridItem from './FileGridItem.vue';
import FileFilters from './FileFilters.vue';
import FileUploadModal from './FileUploadModal.vue';

// 模拟文件数据
const mockFiles = [
  {
    id: '1',
    name: '产品需求文档',
    type: 'folder' as const,
    teamName: '产品设计团队',
    updatedAt: new Date(2025, 4, 20, 14, 30),
    updatedBy: { name: '李明' },
    isStarred: false,
    permissions: { canEdit: true, canDelete: true, canShare: true }
  },
  {
    id: '2',
    name: '用户界面设计稿.png',
    type: 'image' as const,
    size: 2048576,
    teamName: '产品设计团队',
    updatedAt: new Date(2025, 4, 19, 16, 45),
    updatedBy: { name: '王芳' },
    isStarred: true,
    permissions: { canEdit: true, canDelete: true, canShare: true }
  },
  {
    id: '3',
    name: '销售数据分析.xlsx',
    type: 'spreadsheet' as const,
    size: 1024000,
    teamName: '市场营销部',
    updatedAt: new Date(2025, 4, 18, 10, 15),
    updatedBy: { name: '张伟' },
    isStarred: false,
    permissions: { canEdit: false, canDelete: false, canShare: true }
  },
  {
    id: '4',
    name: '前端组件库.js',
    type: 'code' as const,
    size: 512000,
    teamName: '前端开发组',
    updatedAt: new Date(2025, 4, 17, 9, 30),
    updatedBy: { name: '刘强' },
    isStarred: true,
    permissions: { canEdit: true, canDelete: true, canShare: true }
  },
  {
    id: '5',
    name: '项目进度报告.pdf',
    type: 'other' as const,
    size: 3072000,
    teamName: '产品设计团队',
    updatedAt: new Date(2025, 4, 16, 11, 20),
    updatedBy: { name: '赵敏' },
    isStarred: false,
    permissions: { canEdit: true, canDelete: true, canShare: true }
  },
  {
    id: '6',
    name: 'API文档',
    type: 'folder' as const,
    teamName: '后端开发团队',
    updatedAt: new Date(2025, 4, 15, 8, 45),
    updatedBy: { name: '陈浩' },
    isStarred: false,
    permissions: { canEdit: true, canDelete: true, canShare: true }
  },
  {
    id: '7',
    name: '品牌指南.docx',
    type: 'doc' as const,
    size: 4096000,
    teamName: '市场营销部',
    updatedAt: new Date(2025, 4, 14, 15, 20),
    updatedBy: { name: '林雪' },
    isStarred: true,
    permissions: { canEdit: true, canDelete: false, canShare: true }
  },
  {
    id: '8',
    name: '测试用例.xlsx',
    type: 'spreadsheet' as const,
    size: 768000,
    teamName: '质量保证团队',
    updatedAt: new Date(2025, 4, 13, 13, 10),
    updatedBy: { name: '吴磊' },
    isStarred: false,
    permissions: { canEdit: true, canDelete: true, canShare: true }
  }
];

const files = ref(mockFiles);
const searchQuery = ref('');
const sortBy = ref<'name' | 'modified' | 'size' | 'type'>('name');
const sortOrder = ref<'asc' | 'desc'>('asc');
const typeFilter = ref<string[]>([]);
const teamFilter = ref('');
const viewMode = ref<'grid' | 'list'>('list');
const showStarredOnly = ref(false);
const selectedFiles = ref<string[]>([]);
const isUploadModalOpen = ref(false);
const isCreateFolderOpen = ref(false);
const newFolderName = ref('');

// 面包屑导航
const breadcrumbItems = [
  { id: 'home', name: '首页', type: 'home' as const },
  { id: 'files', name: '所有文件', type: 'team' as const }
];

// 筛选和排序文件
const filteredAndSortedFiles = computed(() => {
  let filtered = files.value;

  // 搜索筛选
  if (searchQuery.value) {
    filtered = filtered.filter(file => file.name.toLowerCase().includes(searchQuery.value.toLowerCase()));
  }

  // 类型筛选
  if (typeFilter.value.length > 0) {
    filtered = filtered.filter(file => typeFilter.value.includes(file.type));
  }

  // 团队筛选
  if (teamFilter.value) {
    const teamMap: Record<string, string> = {
      design: '产品设计团队',
      frontend: '前端开发组',
      marketing: '市场营销部',
      backend: '后端开发团队'
    };
    filtered = filtered.filter(file => file.teamName === teamMap[teamFilter.value]);
  }

  // 收藏筛选
  if (showStarredOnly.value) {
    filtered = filtered.filter(file => file.isStarred);
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
      case 'modified':
        aValue = a.updatedAt.getTime();
        bValue = b.updatedAt.getTime();
        break;
      case 'size':
        aValue = a.size || 0;
        bValue = b.size || 0;
        break;
      case 'type':
        aValue = a.type;
        bValue = b.type;
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
  sortBy.value = newSortBy as 'name' | 'modified' | 'size' | 'type';
  sortOrder.value = newSortOrder;
};

const handleFileSelect = (fileId: string, selected: boolean) => {
  if (selected) {
    selectedFiles.value.push(fileId);
  } else {
    selectedFiles.value = selectedFiles.value.filter(id => id !== fileId);
  }
};

const handleSelectAll = (event: Event) => {
  const target = event.target as HTMLInputElement;
  selectedFiles.value = target.checked ? filteredAndSortedFiles.value.map(f => f.id) : [];
};

const handleUpload = async (uploadFiles: File[]) => {
  // 模拟文件上传
  console.log('Uploading files:', uploadFiles);
  // 这里应该调用实际的上传API
};

const handleCreateFolder = () => {
  if (!newFolderName.value.trim()) return;

  const newFolder = {
    id: `folder-${Date.now()}`,
    name: newFolderName.value,
    type: 'folder' as const,
    teamName: '产品设计团队',
    updatedAt: new Date(),
    updatedBy: { name: '当前用户' },
    isStarred: false,
    permissions: { canEdit: true, canDelete: true, canShare: true }
  };

  files.value.unshift(newFolder);
  newFolderName.value = '';
  isCreateFolderOpen.value = false;
};

const handleBulkDelete = () => {
  files.value = files.value.filter(file => !selectedFiles.value.includes(file.id));
  selectedFiles.value = [];
};

const handleBulkDownload = () => {
  console.log('Downloading files:', selectedFiles.value);
  // 这里应该调用实际的下载API
};

const handleFileClick = (fileId: string) => {
  console.log(`Open file ${fileId}`);
};

const handleFileStar = (fileId: string) => {
  const file = files.value.find(f => f.id === fileId);
  if (file) {
    file.isStarred = !file.isStarred;
  }
};

const handleFilePreview = (fileId: string) => {
  console.log(`Preview file ${fileId}`);
};

const handleFileDownload = (fileId: string) => {
  console.log(`Download file ${fileId}`);
};

const handleFileShare = (fileId: string) => {
  console.log(`Share file ${fileId}`);
};

const handleFileRename = (fileId: string) => {
  console.log(`Rename file ${fileId}`);
};

const handleFileDelete = (fileId: string) => {
  files.value = files.value.filter(f => f.id !== fileId);
};
</script>
