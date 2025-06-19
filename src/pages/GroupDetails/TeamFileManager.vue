<template>
  <div class="flex h-full bg-white">
    <!-- 左侧文件树 -->
    <div class="w-64 border-r border-gray-200 flex flex-col">
      <!-- <div class="p-3 border-b border-gray-200">
        <h3 class="text-sm font-medium text-gray-900">文件夹</h3>
      </div> -->
      <div class="flex-1 overflow-y-auto p-2">
        <div v-for="node in fileTree" :key="node.id">
          <TreeNode :node="node" :level="0" :expanded-folders="expandedFolders" :selected-folder="selectedFolder" @contextmenu="handleFileContextMenu" @toggle="toggleFolder" @select="selectFolder" />
        </div>
      </div>
    </div>

    <!-- 右侧文件列表 -->
    <div class="flex-1 flex flex-col">
      <!-- 工具栏 -->
      <div class="p-3 border-b border-gray-200 space-y-3">
        <!-- 操作栏 -->
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-2">
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
              <input v-model="searchQuery" placeholder="搜索文件..." class="pl-10 w-64 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
            </div>
          </div>

          <div class="flex items-center space-x-2">
            <div v-if="selectedFiles.size > 0" class="flex items-center space-x-2 mr-4">
              <span class="text-sm text-gray-600">已选择 {{ selectedFiles.size }} 项</span>
              <button class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
                <Download class="h-4 w-4 mr-1" />
                下载
              </button>
              <button class="px-3 py-1 text-sm border border-gray-300 rounded-md hover:bg-gray-50 text-red-600 flex items-center">
                <Trash2 class="h-4 w-4 mr-1" />
                删除
              </button>
            </div>

            <div class="flex border border-gray-200 rounded-md">
              <button :class="['px-3 py-2 text-sm rounded-l-md', viewMode === 'list' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50']" @click="viewMode = 'list'">
                <List class="h-4 w-4" />
              </button>
              <button :class="['px-3 py-2 text-sm rounded-r-md border-l', viewMode === 'grid' ? 'bg-blue-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50']" @click="viewMode = 'grid'">
                <Grid class="h-4 w-4" />
              </button>
            </div>

            <button class="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center" @click="isCreateFolderModalOpen = true">
              <FolderPlus class="h-4 w-4 mr-2" />
              新建文件夹
            </button>

            <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm flex items-center" @click="isUploadModalOpen = true">
              <Upload class="h-4 w-4 mr-2" />
              上传文件
            </button>
          </div>
        </div>
      </div>

      <!-- 文件列表内容 -->
      <div class="flex-1 overflow-y-auto p-4">
        <!-- 面包屑导航 -->
        <BreadcrumbNav :is-trigger="true" :items="breadcrumbItems" @navigate="selectFolder" />
        <div v-if="currentContent.length === 0" class="text-center py-12">
          <Folder class="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">文件夹为空</h3>
          <p class="text-gray-500 mb-4">开始上传文件或创建新文件夹</p>
          <div class="flex justify-center space-x-2">
            <button class="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center" @click="isCreateFolderModalOpen = true">
              <FolderPlus class="h-4 w-4 mr-2" />
              新建文件夹
            </button>
            <button class="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm flex items-center" @click="isUploadModalOpen = true">
              <Upload class="h-4 w-4 mr-2" />
              上传文件
            </button>
          </div>
        </div>

        <!-- 列表视图 -->
        <div v-else-if="viewMode === 'list'" class="space-y-1">
          <FileListItem v-for="item in currentContent" :key="item.id" :file="item" :team-name="teamName" :is-selected="selectedFiles.has(item.id)" @contextmenu="handleFileContextMenu" @select="handleFileSelect" @click="handleFileClick" />
        </div>

        <!-- 网格视图 -->
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <FileGridItem v-for="item in currentContent" :key="item.id" :file="item" :team-name="teamName" :is-selected="selectedFiles.has(item.id)" @contextmenu="handleFileContextMenu" @select="handleFileSelect" @click="handleFileClick" />
        </div>
      </div>
    </div>

    <!-- 文件上传模态框 -->
    <FileUploadModal v-if="isUploadModalOpen" :team-id="parseInt(props.teamId)" :folder-id="selectedFolder" :items="breadcrumbItems" @close="isUploadModalOpen = false" @success="handleFileUploadSuccess" />

    <!-- 新建文件夹模态框 -->
    <CreateFolderModal v-model="isCreateFolderModalOpen" :items="breadcrumbItems" :team-id="parseInt(props.teamId)" @create="handleCreateFolder" />

    <!-- 右键菜单 -->
    <FileContextMenu :selected-file="contextMenu.selectedFile" :permission="contextMenu.permission" :x="contextMenu.x" :y="contextMenu.y" :visible="contextMenu.visible" @close="hideContextMenu" @action="handleContextMenuAction" />

    <!-- 更新权限模态框 -->
    <UpdatePermissionModal v-if="contextMenu.selectedFile?.id" v-model="isUpdatePermissionModalOpen" :file="contextMenu.selectedFile" @success="handleUpdatePermissionSuccess" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { Search, Download, Trash2, List, Grid, FolderPlus, Upload, Folder } from 'lucide-vue-next';
import TreeNode from './TreeNode.vue';
import BreadcrumbNav from './BreadcrumbNav.vue';
import FileListItem from './FileListItem.vue';
import FileGridItem from './FileGridItem.vue';
import FileUploadModal from './FileUploadModal.vue';
import CreateFolderModal from './CreateFolderModal.vue';
import { createFolderApi, getFileTreeApi } from '@/services/api/file';
import type { CreateFolderDto, FileTreeDto } from '@/services/api/file/types';
import { ElMessage } from 'element-plus';
import { FilePermissionLevel } from '@/constants/enum';
import FileContextMenu from '@/components/contextMenu/FileContextMenu.vue';
import { useContextMenu } from '@/components/contextMenu/useContextMenu';
import UpdatePermissionModal from '@/components/business/UpdatePermissionModal.vue';

// 类型定义
type ViewMode = 'list' | 'grid';
type BreadcrumbType = 'home' | 'folder';

interface BreadcrumbItem {
  id: number;
  name: string;
  type: BreadcrumbType;
}

// Props 定义
const props = defineProps<{
  teamId: string;
  teamName: string;
}>();
const { contextMenu, showContextMenu, hideContextMenu } = useContextMenu();
// 响应式数据
const viewMode = ref<ViewMode>('list');
const searchQuery = ref('');
const selectedFiles = ref<Set<number>>(new Set());
const isUploadModalOpen = ref(false);
const expandedFolders = ref<Set<number>>(new Set([0]));
const selectedFolder = ref(0);
const isCreateFolderModalOpen = ref(false);
const isUpdatePermissionModalOpen = ref(false);

const fileTree = ref<FileTreeDto[]>([
  {
    id: 0,
    name: '团队文件',
    isFolder: true,
    isOwner: true,
    permission: FilePermissionLevel.VIEW,
    owner: {
      id: 0,
      nickname: '系统'
    },
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    children: []
  }
]);

// 计算属性 当前文件夹下的文件列表
const currentContent = computed((): FileTreeDto[] => {
  const findNode = (nodes: FileTreeDto[], id: number): FileTreeDto | null => {
    for (const node of nodes) {
      if (node.id === id) return node;
      if (node.children) {
        const found = findNode(node.children, id);
        if (found) return found;
      }
    }
    return null;
  };

  const currentFolder = findNode(fileTree.value, selectedFolder.value);
  return currentFolder?.children || [];
});

// 计算属性 面包屑导航文件路径
const breadcrumbItems = computed((): BreadcrumbItem[] => {
  const findPath = (nodes: FileTreeDto[], targetId: number, path: FileTreeDto[] = []): FileTreeDto[] | null => {
    for (const node of nodes) {
      const newPath = [...path, node];
      if (node.id === targetId) return newPath;
      if (node.children) {
        const found = findPath(node.children, targetId, newPath);
        if (found) return found;
      }
    }
    return null;
  };

  const path = findPath(fileTree.value, selectedFolder.value);
  if (path) {
    return path.map(node => ({
      id: node.id,
      name: node.name === '团队文件' ? props.teamName : node.name,
      type: node.id === 0 ? 'home' : 'folder'
    }));
  }

  return [{ id: 0, name: props.teamName, type: 'home' }];
});

// 方法
const toggleFolder = (folderId: number): void => {
  const newExpanded = new Set(expandedFolders.value);
  if (newExpanded.has(folderId)) {
    newExpanded.delete(folderId);
  } else {
    newExpanded.add(folderId);
  }
  expandedFolders.value = newExpanded;
};

const selectFolder = (folderId: number): void => {
  selectedFolder.value = folderId;
  selectedFiles.value = new Set();
};

const handleFileSelect = (fileId: number, selected: boolean): void => {
  const newSelected = new Set(selectedFiles.value);
  if (selected) {
    newSelected.add(fileId);
  } else {
    newSelected.delete(fileId);
  }
  selectedFiles.value = newSelected;
};

const handleFileClick = (item: FileTreeDto): void => {
  if (item.isFolder) {
    selectFolder(item.id);
    toggleFolder(item.id);
  } else {
    console.log('Open file:', item.id);
  }
};

const handleFileContextMenu = (item: FileTreeDto, e: MouseEvent): void => {
  console.log('context menu', item, e.clientX, e.clientY);
  showContextMenu(e, item, item.permission);
};

const handleFileUploadSuccess = async (): Promise<void> => {
  isUploadModalOpen.value = false;
  getFileTree();
};

const handleCreateFolder = async (data: CreateFolderDto) => {
  console.log('createFolder', selectedFolder.value);
  data.parentId = selectedFolder.value === 0 ? undefined : selectedFolder.value;
  await createFolderApi(data);
  ElMessage.success('创建成功');
  isCreateFolderModalOpen.value = false;
  getFileTree();
};

const handleUpdatePermissionSuccess = async (): Promise<void> => {
  isUpdatePermissionModalOpen.value = false;
  getFileTree();
};

const getFileTree = async () => {
  const res = await getFileTreeApi(parseInt(props.teamId));
  fileTree.value[0].children = res.data;
};

// 右键菜单操作
const handleContextMenuAction = async (action: string, file: FileTreeDto) => {
  console.log(`执行操作: ${action}`, file);

  // 这里可以根据不同的操作执行相应的逻辑
  switch (action) {
    case 'open':
      console.log('打开文件/文件夹');
      break;
    case 'preview':
      console.log('预览文件');
      break;
    case 'download':
      console.log('下载文件');
      break;
    case 'share':
      console.log('分享文件');
      break;
    case 'star':
      console.log('收藏文件');
      break;
    case 'unstar':
      console.log('取消收藏');
      break;
    case 'copy':
      console.log('复制文件');
      break;
    case 'cut':
      console.log('剪切文件');
      break;
    case 'rename':
      console.log('重命名文件');
      break;
    case 'delete':
      console.log('删除文件');
      break;
    case 'properties':
      console.log('查看属性');
      break;
    case 'permission':
      console.log('更新权限');
      isUpdatePermissionModalOpen.value = true;
      break;
    default:
      console.log(`未知操作: ${action}`);
  }

  hideContextMenu();
};

onMounted(() => {
  getFileTree();
});
</script>
