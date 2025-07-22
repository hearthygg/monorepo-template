<template>
  <div class="flex h-full bg-white">
    <!-- 左侧文件树 -->
    <div class="w-64 border-r border-gray-200 flex flex-col">
      <div class="flex-1 overflow-y-auto p-2">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="space-y-2 opacity-100 transition-opacity duration-300">
          <div v-for="i in 5" :key="i" class="animate-pulse">
            <div class="flex items-center space-x-2">
              <div class="w-4 h-4 bg-gray-200 rounded"></div>
              <div class="h-4 bg-gray-200 rounded flex-1"></div>
            </div>
          </div>
        </div>
        <!-- 文件树内容 -->
        <div v-else-if="showContent" class="opacity-100 transition-opacity duration-300">
          <div v-for="node in fileTree" :key="node.id">
            <TreeNode
              :node="node"
              :level="0"
              :expanded-folders="expandedFolders"
              :selected-folder="selectedFolder"
              :renaming-id="renamingId"
              @contextmenu="handleFileContextMenu"
              @toggle="toggleFolder"
              @select="selectFolder"
              @start-rename="handleStartRename"
              @finish-rename="handleFinishRename"
              @cancel-rename="handleCancelRename"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 右侧文件列表 -->
    <div class="flex-1 flex flex-col">
      <!-- 工具栏 -->
      <div class="border-b border-gray-200 p-4">
        <div class="flex items-center justify-between">
          <!-- 面包屑导航 -->
          <BreadcrumbNav :items="breadcrumbItems" :is-trigger="true" @navigate="selectFolder" />

          <!-- 右侧工具栏 -->
          <div class="flex items-center space-x-2">
            <!-- 搜索框 -->
            <div class="relative">
              <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input v-model="searchQuery" type="text" placeholder="搜索文件..." class="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
            </div>

            <!-- 视图切换按钮 -->
            <div class="flex items-center bg-gray-100 rounded-lg p-1">
              <button :class="['p-2 rounded-md transition-all', viewMode === 'list' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900']" @click="viewMode = 'list'">
                <List class="h-4 w-4" />
              </button>
              <button :class="['p-2 rounded-md transition-all', viewMode === 'grid' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-600 hover:text-gray-900']" @click="viewMode = 'grid'">
                <Grid class="h-4 w-4" />
              </button>
            </div>

            <!-- 操作按钮 -->
            <div class="flex items-center space-x-2">
              <button v-if="selectedFiles.size > 0" class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium flex items-center transition-colors" @click="handleBulkDownload">
                <Download class="h-4 w-4 mr-2" />
                下载 ({{ selectedFiles.size }})
              </button>
              <button v-if="selectedFiles.size > 0" class="px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium flex items-center transition-colors" @click="handleBulkDelete">
                <Trash2 class="h-4 w-4 mr-2" />
                删除 ({{ selectedFiles.size }})
              </button>
              <button class="px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-sm font-medium flex items-center transition-colors" @click="() => openCreateFolderModal()">
                <FolderPlus class="h-4 w-4 mr-2" />
                新建文件夹
              </button>
              <button class="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium flex items-center transition-colors" @click="() => openUploadModal()">
                <Upload class="h-4 w-4 mr-2" />
                上传文件
              </button>
              <button class="px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium flex items-center transition-colors" @click="() => handlerOpenCreateSuperDocumentModal()">
                <FileText class="h-4 w-4 mr-2" />
                超级文档
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- 文件列表内容 -->
      <div class="flex-1 overflow-y-auto p-4">
        <!-- 加载状态 -->
        <div v-if="isLoading" class="space-y-4 opacity-100 transition-opacity duration-300">
          <div v-for="i in 8" :key="i" class="animate-pulse">
            <div class="flex items-center space-x-4 p-3">
              <div class="w-6 h-6 bg-gray-200 rounded"></div>
              <div class="flex-1 space-y-2">
                <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                <div class="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>
        <!-- 文件列表 -->
        <div v-else-if="showContent" class="opacity-100 transition-opacity duration-300">
          <div :class="viewMode === 'list' ? 'space-y-1' : 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4'">
            <FileItem
              v-for="item in currentContent"
              :key="item.id"
              :file="item"
              :team-name="teamName"
              :is-selected="selectedFiles.has(item.id)"
              :view-mode="viewMode"
              :renaming-id="fileListRenamingId"
              @contextmenu="handleFileContextMenu"
              @select="handleFileSelect"
              @click="handleFileClick"
              @start-rename="handleFileListStartRename"
              @finish-rename="handleFileListFinishRename"
              @cancel-rename="handleFileListCancelRename"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 文件上传模态框 -->
    <FileUploadModal v-if="isUploadModalOpen" :team-id="parseInt(props.teamId)" :folder-id="parentFolderId" :team-name="teamName" :file-tree="fileTree" @close="isUploadModalOpen = false" @success="handleFileUploadSuccess" />

    <!-- 新建文件夹模态框 -->
    <CreateFolderModal v-model="isCreateFolderModalOpen" :file-tree="fileTree" :team-name="teamName" :team-id="parseInt(props.teamId)" :parent-id="parentFolderId" @create="handleCreateFolder" />

    <!-- 右键菜单 -->
    <FileContextMenu :selected-file="contextMenu.selectedFile" :permission="contextMenu.permission" :x="contextMenu.x" :y="contextMenu.y" :visible="contextMenu.visible" @close="hideContextMenu" @action="handleContextMenuAction" />

    <!-- 更新权限模态框 -->
    <UpdatePermissionModal v-if="contextMenu.selectedFile?.id" v-model="isUpdatePermissionModalOpen" :file="contextMenu.selectedFile" @success="handleUpdatePermissionSuccess" />

    <!-- 查看文件属性模态框 -->
    <FilePropertiesModal v-model="isFilePropertiesModalOpen" :file-id="contextMenu.selectedFile?.id || null" />

    <!-- 文件预览/编辑窗口管理器 -->
    <WindowManager />

    <!-- 新建超级文档模态框 -->
    <CreateSuperDocumentModal v-model="isCreateSuperDocumentModalOpen" :file-tree="fileTree" :team-name="teamName" :team-id="parseInt(props.teamId)" :parent-id="parentFolderId" @confirm="handleCreateSuperDocument" />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeMount, nextTick } from 'vue';
import { Search, Download, Trash2, List, Grid, FolderPlus, Upload, Folder, FileText } from 'lucide-vue-next';
import TreeNode from './TreeNode.vue';
import BreadcrumbNav from './BreadcrumbNav.vue';
import FileItem from './FileItem.vue';
import FileUploadModal from './FileUploadModal.vue';
import CreateFolderModal from './CreateFolderModal.vue';
import { createFolderApi, createSuperDocApi, deleteFileApi, getFileTreeApi, renameFileApi, downloadFileApi, downloadMultipleFilesApi } from '@/services/api/file';
import type { CreateFolderDto, CreateSuperDocumentDto, FileTreeDto } from '@/services/api/file/types';
import { ElMessage, ElMessageBox } from 'element-plus';
import { FilePermissionLevel } from '@/constants/enum';
import FileContextMenu from '@/components/contextMenu/FileContextMenu.vue';
import { useContextMenu } from '@/components/contextMenu/useContextMenu';
import UpdatePermissionModal from '@/components/business/UpdatePermissionModal.vue';
import FilePropertiesModal from '@/components/business/FilePropertiesModal.vue';
import type { BreadcrumbItem } from '@/types/file';
import WindowManager from '@/components/WindowManager/WindowManager.vue';
import { useWindowManager } from '@/composables/useWindowManager';
import { formatFileSize } from '@/utils/file';
import CreateSuperDocumentModal from './CreateSuperDocumentModal.vue';

const { openFileWindow } = useWindowManager();

// 类型定义
type ViewMode = 'list' | 'grid';

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
const isCreateSuperDocumentModalOpen = ref(false);
const isUpdatePermissionModalOpen = ref(false);
const isFilePropertiesModalOpen = ref(false);
const renamingId = ref<number | null>(null);
const fileListRenamingId = ref<number | null>(null);
const currentContextMenuType = ref<string>('');

// 要上传文件/文件夹的父级id
const parentFolderId = ref<number>(0);

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
    children: [],
    isEditable: false
  }
]);

// 添加加载状态
const isLoading = ref(true);
const showContent = ref(false);

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

const handleFileContextMenu = (item: FileTreeDto, e: MouseEvent, type: string): void => {
  showContextMenu(e, item, item.permission);
  currentContextMenuType.value = type;
};

const handleFileUploadSuccess = async (): Promise<void> => {
  isUploadModalOpen.value = false;
  getFileTree();
};

const handleCreateFolder = async (data: CreateFolderDto) => {
  data.parentId = selectedFolder.value === 0 ? undefined : selectedFolder.value;
  await createFolderApi(data);
  ElMessage.success('创建成功');
  isCreateFolderModalOpen.value = false;
  getFileTree();
};

const handlerOpenCreateSuperDocumentModal = (fileId?: number) => {
  parentFolderId.value = fileId ?? selectedFolder.value;
  isCreateSuperDocumentModalOpen.value = true;
};

// 新建超级文档
const handleCreateSuperDocument = async (data: CreateSuperDocumentDto) => {
  await createSuperDocApi(data);
  ElMessage.success('创建成功');
  isCreateSuperDocumentModalOpen.value = false;
  getFileTree();
};

const handleUpdatePermissionSuccess = async (): Promise<void> => {
  isUpdatePermissionModalOpen.value = false;
  getFileTree();
};

const getFileTree = async () => {
  try {
    isLoading.value = true;
    showContent.value = false;
    const res = await getFileTreeApi(parseInt(props.teamId));
    fileTree.value[0].children = res.data;
  } catch (error) {
    console.error('获取文件树失败:', error);
  } finally {
    // 延迟显示内容，让过渡更平滑
    setTimeout(() => {
      isLoading.value = false;
      // 再延迟一点显示内容
      setTimeout(() => {
        showContent.value = true;
      }, 100);
    }, 200);
  }
};

// 右键菜单操作
const handleContextMenuAction = async (action: string, file: FileTreeDto) => {
  // 这里可以根据不同的操作执行相应的逻辑
  switch (action) {
    case 'open':
      console.log('打开文件/文件夹');
      handleFileClick(file);
      break;
    case 'preview':
      console.log('预览文件');
      openFileWindow(file, 'view');
      break;
    case 'download':
      console.log('下载文件');
      handleFileDownload(file);
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
    case 'createFolder':
      // 创建文件夹
      openCreateFolderModal(file.id);
      break;
    case 'uploadFile':
      openUploadModal(file.id);
      break;
    case 'rename':
      if (currentContextMenuType.value === 'list') {
        fileListRenamingId.value = file.id;
      } else {
        renamingId.value = file.id;
      }
      break;
    case 'delete':
      ElMessageBox.confirm(`确定删除 ${file.name} 吗？`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async () => {
        console.log('删除文件');
        await deleteFileApi(file.id);
        ElMessage.success('删除成功');
        getFileTree();
      });
      break;
    case 'properties':
      console.log('查看属性');
      isFilePropertiesModalOpen.value = true;
      break;
    case 'permission':
      console.log('更新权限');
      isUpdatePermissionModalOpen.value = true;
      break;
    case 'edit':
      if (file.isEditable) {
        openFileWindow(file, 'edit');
      } else {
        // ElMessage.warning('文件不可编辑');
        // 弹出替换远程文件的窗口功能
      }
      break;
    case 'createSuperDoc':
      console.log('新建超级文档');
      handlerOpenCreateSuperDocumentModal(file.id);
      break;
    default:
      console.log(`未知操作: ${action}`);
  }

  hideContextMenu();
};

const handleOpenChatWindow = (): void => {
  openFileWindow(
    {
      id: -1,
      name: '交流中心',
      isFolder: false,
      isOwner: true,
      permission: FilePermissionLevel.VIEW,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      children: [],
      isEditable: false,
      owner: {
        id: 0,
        nickname: '系统'
      },
      ext: 'chat'
    },
    'view',
    {
      position: {
        x: 50,
        y: 50
      },
      size: {
        width: 1200,
        height: 800
      }
    }
  );
};

const handleStartRename = (id: number): void => {
  renamingId.value = id;
};

const handleFileListStartRename = (id: number): void => {
  fileListRenamingId.value = id;
};

const handleFinishRename = async (nodeId: number, newName: string): Promise<void> => {
  try {
    renamingId.value = null;
    await renameFileApi(nodeId, { name: newName });
    ElMessage.success('重命名成功');
    await getFileTree();
  } catch (error) {
    console.error('重命名失败:', error);
  }
};

const handleFileListFinishRename = async (nodeId: number, newName: string): Promise<void> => {
  try {
    fileListRenamingId.value = null;
    await renameFileApi(nodeId, { name: newName });
    ElMessage.success('重命名成功');
    await getFileTree();
  } catch (error) {
    console.error('重命名失败:', error);
  }
};

const handleCancelRename = (): void => {
  renamingId.value = null;
};

const handleFileListCancelRename = (): void => {
  fileListRenamingId.value = null;
};

const openCreateFolderModal = (fileId?: number) => {
  parentFolderId.value = fileId ?? selectedFolder.value;
  isCreateFolderModalOpen.value = true;
};

const openUploadModal = (fileId?: number) => {
  parentFolderId.value = fileId ?? selectedFolder.value;
  isUploadModalOpen.value = true;
};

// 下载文件相关方法
const handleFileDownload = async (file: FileTreeDto) => {
  if (file.isFolder) {
    ElMessage.warning('文件夹暂不支持下载');
    return;
  }

  // 检查是否有文件路径
  if (!file.path) {
    ElMessage.error('文件路径不存在，无法下载');
    return;
  }

  try {
    ElMessage.info('正在准备下载...');

    // 使用fetch下载文件内容
    const response = await fetch(file.path!);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 获取文件大小
    const contentLength = response.headers.get('content-length');
    const fileSize = contentLength ? parseInt(contentLength) : 0;

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    link.style.display = 'none';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);

    const sizeText = fileSize > 0 ? ` (${formatFileSize(fileSize)})` : '';
    ElMessage.success(`下载 ${file.name} 成功${sizeText}`);
  } catch (error) {
    console.error('下载失败:', error);
    ElMessage.error('下载失败，请稍后重试');
  }
};

const handleBulkDownload = async () => {
  if (selectedFiles.value.size === 0) {
    ElMessage.warning('请先选择要下载的文件');
    return;
  }

  // 获取选中的文件信息
  const selectedFileIds = Array.from(selectedFiles.value);
  const selectedFileInfos = currentContent.value.filter(file => selectedFileIds.includes(file.id));

  // 检查是否有文件没有路径
  const filesWithoutPath = selectedFileInfos.filter(file => !file.path);
  if (filesWithoutPath.length > 0) {
    ElMessage.error(`以下文件无法下载：${filesWithoutPath.map(f => f.name).join(', ')}`);
    return;
  }

  try {
    ElMessage.info('正在准备批量下载...');

    // 如果只有一个文件，直接下载
    if (selectedFileInfos.length === 1) {
      const file = selectedFileInfos[0];
      if (file.isFolder) {
        ElMessage.warning('文件夹暂不支持下载');
        return;
      }

      // 使用fetch下载文件内容
      const response = await fetch(file.path!);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // 获取文件大小
      const contentLength = response.headers.get('content-length');
      const fileSize = contentLength ? parseInt(contentLength) : 0;

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      const sizeText = fileSize > 0 ? ` (${formatFileSize(fileSize)})` : '';
      ElMessage.success(`下载成功${sizeText}`);
      selectedFiles.value.clear();
      return;
    }

    // 多个文件时，逐个下载（因为预签名URL不支持批量打包）
    ElMessage.info(`将逐个下载 ${selectedFileInfos.length} 个文件`);

    let downloadedCount = 0;
    for (const file of selectedFileInfos) {
      if (file.isFolder) {
        ElMessage.warning(`${file.name} 是文件夹，跳过下载`);
        continue;
      }

      downloadedCount++;
      ElMessage.info(`正在下载 ${downloadedCount}/${selectedFileInfos.length}: ${file.name}`);

      // 使用fetch下载文件内容
      const response = await fetch(file.path!);
      if (!response.ok) {
        ElMessage.error(`下载 ${file.name} 失败: HTTP ${response.status}`);
        continue;
      }

      // 获取文件大小
      const contentLength = response.headers.get('content-length');
      const fileSize = contentLength ? parseInt(contentLength) : 0;

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = file.name;
      link.style.display = 'none';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      const sizeText = fileSize > 0 ? ` (${formatFileSize(fileSize)})` : '';
      ElMessage.success(`下载 ${file.name} 成功${sizeText}`);

      // 添加延迟，避免浏览器阻止多个下载
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    ElMessage.success(`批量下载完成，共下载 ${downloadedCount} 个文件`);
    selectedFiles.value.clear();
  } catch (error) {
    console.error('批量下载失败:', error);
    ElMessage.error('批量下载失败，请稍后重试');
  }
};

// 添加批量删除方法
const handleBulkDelete = async () => {
  if (selectedFiles.value.size === 0) {
    ElMessage.warning('请先选择要删除的文件');
    return;
  }

  const selectedFileIds = Array.from(selectedFiles.value);
  const selectedFileInfos = currentContent.value.filter(file => selectedFileIds.includes(file.id));

  try {
    await ElMessageBox.confirm(`确定删除选中的 ${selectedFileInfos.length} 个文件吗？`, '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    });

    ElMessage.info('正在删除文件...');

    // 逐个删除文件
    for (const file of selectedFileInfos) {
      await deleteFileApi(file.id);
    }

    ElMessage.success('删除成功');
    selectedFiles.value.clear();
    await getFileTree();
  } catch (error) {
    if (error !== 'cancel') {
      console.error('批量删除失败:', error);
      ElMessage.error('删除失败，请稍后重试');
    }
  }
};

defineExpose({
  handleOpenChatWindow
});

onBeforeMount(() => {
  getFileTree();
});
</script>

<style scoped>
/* 平滑的透明度过渡 */
.opacity-100 {
  opacity: 1;
}

.transition-opacity {
  transition: opacity 0.3s ease-in-out;
}

/* 骨架屏动画优化 */
.animate-pulse {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

/* 内容淡入动画 */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* 为内容添加淡入效果 */
.opacity-100.transition-opacity {
  animation: fadeIn 0.4s ease-out;
}
</style>
