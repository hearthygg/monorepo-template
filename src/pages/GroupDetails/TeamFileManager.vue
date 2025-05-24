<template>
  <div class="flex h-full bg-white">
    <!-- 左侧文件树 -->
    <div class="w-64 border-r border-gray-200 flex flex-col">
      <div class="p-3 border-b border-gray-200">
        <h3 class="text-sm font-medium text-gray-900">文件夹</h3>
      </div>
      <div class="flex-1 overflow-y-auto p-2">
        <div v-for="node in fileTree" :key="node.id">
          <TreeNode :node="node" :level="0" :expanded-folders="expandedFolders" :selected-folder="selectedFolder" @toggle="toggleFolder" @select="selectFolder" />
        </div>
      </div>
    </div>

    <!-- 右侧文件列表 -->
    <div class="flex-1 flex flex-col">
      <!-- 工具栏 -->
      <div class="p-4 border-b border-gray-200 space-y-3">
        <!-- 面包屑导航 -->
        <BreadcrumbNav :items="breadcrumbItems" @navigate="selectFolder" />

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

            <button class="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
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
        <div v-if="currentContent.length === 0" class="text-center py-12">
          <Folder class="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 class="text-lg font-medium text-gray-900 mb-2">文件夹为空</h3>
          <p class="text-gray-500 mb-4">开始上传文件或创建新文件夹</p>
          <div class="flex justify-center space-x-2">
            <button class="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center">
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
          <FileListItem v-for="item in currentContent" :key="item.id" :file="item" :team-name="teamName" :is-selected="selectedFiles.has(item.id)" @select="handleFileSelect" @click="handleFileClick" />
        </div>

        <!-- 网格视图 -->
        <div v-else class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <FileGridItem v-for="item in currentContent" :key="item.id" :file="item" :team-name="teamName" :is-selected="selectedFiles.has(item.id)" @select="handleFileSelect" @click="handleFileClick" />
        </div>
      </div>
    </div>

    <!-- 文件上传模态框 -->
    <FileUploadModal v-if="isUploadModalOpen" @close="isUploadModalOpen = false" @upload="handleFileUpload" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { Search, Download, Trash2, List, Grid, FolderPlus, Upload, Folder } from 'lucide-vue-next';
import TreeNode from './TreeNode.vue';
import BreadcrumbNav from './BreadcrumbNav.vue';
import FileListItem from './FileListItem.vue';
import FileGridItem from './FileGridItem.vue';
import FileUploadModal from './FileUploadModal.vue';

// 类型定义
type FileType = 'folder' | 'file';
type FileCategory = 'doc' | 'image' | 'other';
type ViewMode = 'list' | 'grid';
type BreadcrumbType = 'home' | 'folder';

interface User {
  name: string;
}

interface FileNode {
  id: string;
  name: string;
  type: FileType;
  fileType?: FileCategory;
  parentId?: string;
  size?: number;
  updatedAt: Date;
  updatedBy: User;
  isStarred?: boolean;
  children?: FileNode[];
}

interface BreadcrumbItem {
  id: string;
  name: string;
  type: BreadcrumbType;
}

// Props 定义
const props = defineProps<{
  teamId: string;
  teamName: string;
}>();

// 响应式数据
const viewMode = ref<ViewMode>('list');
const searchQuery = ref('');
const selectedFiles = ref<Set<string>>(new Set());
const isUploadModalOpen = ref(false);
const expandedFolders = ref<Set<string>>(new Set(['root', 'design']));
const selectedFolder = ref('root');

// 模拟文件树数据
const fileTree = ref<FileNode[]>([
  {
    id: 'root',
    name: '团队文件',
    type: 'folder',
    updatedAt: new Date(),
    updatedBy: { name: '系统' },
    children: [
      {
        id: 'design',
        name: '设计文件',
        type: 'folder',
        parentId: 'root',
        updatedAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        updatedBy: { name: '李明' },
        children: [
          {
            id: 'ui-kit',
            name: 'UI组件库',
            type: 'folder',
            parentId: 'design',
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
            updatedBy: { name: '王芳' },
            children: [
              {
                id: 'buttons.fig',
                name: '按钮组件.fig',
                type: 'file',
                fileType: 'other',
                parentId: 'ui-kit',
                size: 1024000,
                updatedAt: new Date(Date.now() - 3 * 60 * 60 * 1000),
                updatedBy: { name: '李明' },
                isStarred: true
              },
              {
                id: 'forms.fig',
                name: '表单组件.fig',
                type: 'file',
                fileType: 'other',
                parentId: 'ui-kit',
                size: 2048000,
                updatedAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
                updatedBy: { name: '王芳' }
              }
            ]
          },
          {
            id: 'mockups',
            name: '原型设计',
            type: 'folder',
            parentId: 'design',
            updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
            updatedBy: { name: '张伟' },
            children: [
              {
                id: 'homepage.fig',
                name: '首页原型.fig',
                type: 'file',
                fileType: 'other',
                parentId: 'mockups',
                size: 5120000,
                updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
                updatedBy: { name: '张伟' },
                isStarred: true
              }
            ]
          }
        ]
      },
      {
        id: 'documents',
        name: '文档资料',
        type: 'folder',
        parentId: 'root',
        updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
        updatedBy: { name: '刘强' },
        children: [
          {
            id: 'requirements.docx',
            name: '需求文档.docx',
            type: 'file',
            fileType: 'doc',
            parentId: 'documents',
            size: 1536000,
            updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
            updatedBy: { name: '刘强' }
          },
          {
            id: 'user-research.pdf',
            name: '用户研究报告.pdf',
            type: 'file',
            fileType: 'other',
            parentId: 'documents',
            size: 3072000,
            updatedAt: new Date(Date.now() - 8 * 60 * 60 * 1000),
            updatedBy: { name: '王芳' },
            isStarred: true
          }
        ]
      },
      {
        id: 'assets',
        name: '素材资源',
        type: 'folder',
        parentId: 'root',
        updatedAt: new Date(Date.now() - 18 * 60 * 60 * 1000),
        updatedBy: { name: '李明' },
        children: [
          {
            id: 'logo.png',
            name: '品牌Logo.png',
            type: 'file',
            fileType: 'image',
            parentId: 'assets',
            size: 512000,
            updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
            updatedBy: { name: '李明' }
          },
          {
            id: 'icons.zip',
            name: '图标包.zip',
            type: 'file',
            fileType: 'other',
            parentId: 'assets',
            size: 2560000,
            updatedAt: new Date(Date.now() - 12 * 60 * 60 * 1000),
            updatedBy: { name: '张伟' }
          }
        ]
      }
    ]
  }
]);

// 计算属性
const currentContent = computed((): FileNode[] => {
  const findNode = (nodes: FileNode[], id: string): FileNode | null => {
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

const breadcrumbItems = computed((): BreadcrumbItem[] => {
  const findPath = (nodes: FileNode[], targetId: string, path: FileNode[] = []): FileNode[] | null => {
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
      type: node.id === 'root' ? 'home' : 'folder'
    }));
  }

  return [{ id: 'root', name: props.teamName, type: 'home' }];
});

// 方法
const toggleFolder = (folderId: string): void => {
  const newExpanded = new Set(expandedFolders.value);
  if (newExpanded.has(folderId)) {
    newExpanded.delete(folderId);
  } else {
    newExpanded.add(folderId);
  }
  expandedFolders.value = newExpanded;
};

const selectFolder = (folderId: string): void => {
  selectedFolder.value = folderId;
  selectedFiles.value = new Set();
};

const handleFileSelect = (fileId: string, selected: boolean): void => {
  const newSelected = new Set(selectedFiles.value);
  if (selected) {
    newSelected.add(fileId);
  } else {
    newSelected.delete(fileId);
  }
  selectedFiles.value = newSelected;
};

const handleFileClick = (item: FileNode): void => {
  if (item.type === 'folder') {
    selectFolder(item.id);
    toggleFolder(item.id);
  } else {
    console.log('Open file:', item.id);
  }
};

const handleFileUpload = async (files: File[]): Promise<void> => {
  console.log('Uploading files:', files);
  isUploadModalOpen.value = false;
};
</script>
