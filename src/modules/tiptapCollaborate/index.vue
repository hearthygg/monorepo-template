<template>
  <div class="tiptap-collaborate h-full flex flex-col">
    <!-- 工具栏 -->
    <div v-if="isEditable" class="toolbar bg-white border-b border-gray-200 px-4 py-2 flex items-center justify-between">
      <div class="flex items-center space-x-2">
        <button v-for="item in toolbarItems" :key="item.name" :class="['toolbar-btn', { active: editor?.isActive(item.command) }]" :title="item.title" @click="item.action">
          <Icon :icon="item.icon" class="w-4 h-4" />
        </button>
      </div>
      <div class="flex items-center space-x-4 text-sm text-gray-600">
        <div v-if="isConnected" class="flex items-center">
          <div class="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
          <span>{{ onlineUsersCount }} 人在线</span>
        </div>
        <div v-else class="flex items-center">
          <div class="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
          <span>连接中...</span>
        </div>
      </div>
    </div>

    <!-- 编辑器容器 -->
    <div class="editor-container flex-1 overflow-hidden">
      <!-- 预览模式 -->
      <div v-if="!isEditable" class="preview-mode h-full p-6 overflow-auto">
        <div v-if="loading" class="flex items-center justify-center h-full">
          <el-loading-spinner />
          <span class="ml-2">加载中...</span>
        </div>
        <div v-else-if="error" class="flex items-center justify-center h-full text-red-500">
          <Icon icon="mdi:alert-circle" class="w-6 h-6 mr-2" />
          <span>{{ error }}</span>
        </div>
        <div v-else class="prose prose-lg max-w-none" v-html="documentContent"></div>
      </div>

      <!-- 编辑模式 -->
      <div v-else class="edit-mode h-full">
        <div v-if="loading" class="flex items-center justify-center h-full">
          <el-loading-spinner />
          <span class="ml-2">连接协作服务器中...</span>
        </div>
        <div v-else-if="error" class="flex items-center justify-center h-full text-red-500">
          <Icon icon="mdi:alert-circle" class="w-6 h-6 mr-2" />
          <span>{{ error }}</span>
          <el-button class="ml-4" size="small" @click="retryConnection">重试</el-button>
        </div>
        <div v-else class="h-full">
          <EditorContent :editor="editor" class="editor-content h-full" />
        </div>
      </div>
    </div>

    <!-- 状态栏 -->
    <div v-if="isEditable" class="status-bar bg-gray-50 border-t border-gray-200 px-4 py-2 text-xs text-gray-600 flex items-center justify-between">
      <div class="flex items-center space-x-4">
        <span>字数: {{ wordCount }}</span>
        <span>字符: {{ charCount }}</span>
      </div>
      <div class="flex items-center space-x-2">
        <span v-if="isSaving">保存中...</span>
        <span v-else-if="lastSaved" class="text-green-600">已保存 {{ formatTime(lastSaved) }}</span>
        <span v-else class="text-orange-600">未保存</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, computed, watch, nextTick } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Collaboration from '@tiptap/extension-collaboration';
import CollaborationCursor from '@tiptap/extension-collaboration-cursor';
import { Icon } from '@iconify/vue';
import { ElMessage } from 'element-plus';
import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';
import { IndexeddbPersistence } from 'y-indexeddb';
import type { FileTreeDto } from '@/services/api/file/types';
import { getCollaborativeContentApi, getCollaborativeInfoApi } from '@/services/api/collaborative';
import type { CollaborativeDocumentContentDto, CollaborativeDocumentInfoDto } from '@/services/api/collaborative/types';
import { useUserStore } from '@/stores/user';
const props = defineProps<{
  file: FileTreeDto;
  isEditable: boolean;
}>();
const userStore = useUserStore();
// 响应式数据
const editor = ref<Editor>();
const loading = ref(true);
const error = ref('');
const isConnected = ref(false);
const onlineUsersCount = ref(0);
const isSaving = ref(false);
const lastSaved = ref<Date | null>(null);
const documentContent = ref('');
const documentInfo = ref<CollaborativeDocumentInfoDto | null>(null);

// Yjs 相关
let ydoc: Y.Doc | null = null;
let provider: WebsocketProvider | null = null;
let persistence: IndexeddbPersistence | null = null;

// 工具栏配置
const toolbarItems = [
  {
    name: 'bold',
    icon: 'mdi:format-bold',
    title: '粗体',
    command: 'bold',
    action: () => editor.value?.chain().focus().toggleBold().run()
  },
  {
    name: 'italic',
    icon: 'mdi:format-italic',
    title: '斜体',
    command: 'italic',
    action: () => editor.value?.chain().focus().toggleItalic().run()
  },
  {
    name: 'underline',
    icon: 'mdi:format-underline',
    title: '下划线',
    command: 'underline',
    action: () => editor.value?.chain().focus().toggleUnderline().run()
  },
  {
    name: 'strike',
    icon: 'mdi:format-strikethrough',
    title: '删除线',
    command: 'strike',
    action: () => editor.value?.chain().focus().toggleStrike().run()
  },
  { name: 'divider1', icon: '', title: '', command: '', action: () => {} },
  {
    name: 'heading1',
    icon: 'mdi:format-header-1',
    title: '标题1',
    command: 'heading',
    action: () => editor.value?.chain().focus().toggleHeading({ level: 1 }).run()
  },
  {
    name: 'heading2',
    icon: 'mdi:format-header-2',
    title: '标题2',
    command: 'heading',
    action: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run()
  },
  {
    name: 'heading3',
    icon: 'mdi:format-header-3',
    title: '标题3',
    command: 'heading',
    action: () => editor.value?.chain().focus().toggleHeading({ level: 3 }).run()
  },
  { name: 'divider2', icon: '', title: '', command: '', action: () => {} },
  {
    name: 'bulletList',
    icon: 'mdi:format-list-bulleted',
    title: '无序列表',
    command: 'bulletList',
    action: () => editor.value?.chain().focus().toggleBulletList().run()
  },
  {
    name: 'orderedList',
    icon: 'mdi:format-list-numbered',
    title: '有序列表',
    command: 'orderedList',
    action: () => editor.value?.chain().focus().toggleOrderedList().run()
  },
  {
    name: 'blockquote',
    icon: 'mdi:format-quote-close',
    title: '引用',
    command: 'blockquote',
    action: () => editor.value?.chain().focus().toggleBlockquote().run()
  },
  {
    name: 'codeBlock',
    icon: 'mdi:code-tags',
    title: '代码块',
    command: 'codeBlock',
    action: () => editor.value?.chain().focus().toggleCodeBlock().run()
  }
];

// 计算属性
const wordCount = computed(() => {
  if (!editor.value) return 0;
  const text = editor.value
    .getText()
    .trim()
    .split(/\s+/)
    .filter(word => word.length > 0).length;
  return text;
});

const charCount = computed(() => {
  if (!editor.value) return 0;
  return editor.value.getText().length;
});

// 格式化时间
const formatTime = (date: Date) => {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);

  if (minutes < 1) return '刚刚';
  if (minutes < 60) return `${minutes}分钟前`;

  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}小时前`;

  const days = Math.floor(hours / 24);
  return `${days}天前`;
};

// 初始化编辑器
const initEditor = async () => {
  try {
    loading.value = true;
    error.value = '';

    // 先清理之前的实例
    cleanup();

    // 获取文档信息
    const infoResponse = await getCollaborativeInfoApi(props.file.id);
    documentInfo.value = infoResponse.data;

    if (!documentInfo.value.collaborationEnabled) {
      error.value = '此文档未启用协作功能';
      loading.value = false;
      return;
    }

    // 获取文档内容
    const contentResponse = await getCollaborativeContentApi(props.file.id);
    const content = contentResponse.data;

    // 创建 Yjs 文档
    ydoc = new Y.Doc();

    // 创建协作文本 - 使用唯一的字段名
    const ytext = ydoc.getText(`doc-${content.documentId}`);

    // 如果有初始内容，设置到 Yjs 文档中
    if (content.htmlContent) {
      ytext.insert(0, content.htmlContent);
    }

    // 设置持久化存储
    persistence = new IndexeddbPersistence(`collaborative-doc-${content.documentId}`, ydoc);

    // 等待持久化加载完成
    await new Promise<void>((resolve: () => void) => {
      persistence!.once('synced', () => resolve());
    });

    // 连接 WebSocket
    const wsUrl = `ws://localhost:3001/yjs`;
    provider = new WebsocketProvider(wsUrl, content.documentId, ydoc, {
      connect: true,
      // 禁用自动重连
      resyncInterval: 0,
      maxBackoffTime: 0,
      params: {
        token: userStore.token || '',
        documentId: content.documentId
      }
      // // 自定义WebSocket工厂函数
      // WebSocketPolyfill: (url, protocols, options) => {
      //   return new WebSocket(url, protocols, {
      //     ...options,
      //     headers: {
      //       Authorization: `Bearer ${userStore.token}`,
      //       'X-Document-Id': content.documentId
      //     }
      //   });
      // }
    });

    // 监听连接状态
    provider.on('status', ({ status }: { status: string }) => {
      isConnected.value = status === 'connected';
      console.log('WebSocket连接状态:', status);

      if (status === 'disconnected') {
        console.error('WebSocket连接断开，不会自动重连');
        error.value = 'WebSocket连接断开，请检查后端服务';
      }
    });

    // 监听连接错误
    provider.on('connection-error', (err: any) => {
      console.error('WebSocket连接错误:', err);
      error.value = `连接错误: ${err.message || '未知错误'}`;
    });

    // 监听在线用户数变化
    provider.on('sync', (isSynced: boolean) => {
      if (isSynced) {
        onlineUsersCount.value = provider!.awareness.getStates().size;
      }
    });

    // 创建编辑器
    editor.value = new Editor({
      element: document.createElement('div'),
      extensions: [
        StarterKit,
        Image,
        Underline,
        Strike,
        Collaboration.configure({
          document: ydoc,
          field: `doc-${content.documentId}`
        }),
        CollaborationCursor.configure({
          provider,
          user: {
            id: Math.random().toString(36).substr(2, 9),
            name: '用户' + Math.floor(Math.random() * 1000),
            color: '#' + Math.floor(Math.random() * 16777215).toString(16)
          }
        })
      ],
      content: ytext.toString(),
      onUpdate: ({ editor }) => {
        // 内容更新时的处理
        console.log('内容已更新');
      }
    });

    loading.value = false;
  } catch (err) {
    console.error('初始化编辑器失败:', err);
    error.value = '初始化编辑器失败，请检查网络连接';
    loading.value = false;
  }
};

// 重试连接
const retryConnection = () => {
  cleanup();
  initEditor();
};

// 清理资源
const cleanup = () => {
  if (editor.value) {
    editor.value.destroy();
    editor.value = undefined;
  }

  if (provider) {
    provider.destroy();
    provider = null;
  }

  if (persistence) {
    persistence.destroy();
    persistence = null;
  }

  if (ydoc) {
    ydoc.destroy();
    ydoc = null;
  }
};

// 监听文件变化
watch(
  () => props.file,
  () => {
    if (props.isEditable) {
      initEditor();
    } else {
      loadPreviewContent();
    }
  },
  { immediate: true }
);

// 加载预览内容
const loadPreviewContent = async () => {
  try {
    loading.value = true;
    error.value = '';

    const response = await getCollaborativeContentApi(props.file.id);
    documentContent.value = response.data.htmlContent || '<p>暂无内容</p>';

    loading.value = false;
  } catch (err) {
    console.error('加载预览内容失败:', err);
    error.value = '加载内容失败';
    loading.value = false;
  }
};

// 生命周期
onBeforeUnmount(() => {
  cleanup();
});
</script>

<style scoped>
.tiptap-collaborate {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.toolbar {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.toolbar-btn {
  padding: 0.5rem;
  border-radius: 0.25rem;
  border: none;
  background: transparent;
  cursor: pointer;
  transition: background-color 0.2s;
}

.toolbar-btn:hover {
  background-color: #f3f4f6;
}

.toolbar-btn.active {
  background-color: #dbeafe;
  color: #2563eb;
}

.toolbar-btn[data-divider] {
  width: 1px;
  height: 1.5rem;
  background-color: #d1d5db;
  margin: 0 0.5rem;
  cursor: default;
}

.editor-content {
  padding: 1.5rem;
  font-size: 16px;
  line-height: 1.6;
}

.editor-content :deep(.ProseMirror) {
  outline: none;
  min-height: 100%;
}

.editor-content :deep(.ProseMirror p) {
  margin-bottom: 1rem;
}

.editor-content :deep(.ProseMirror h1) {
  font-size: 1.875rem;
  font-weight: 700;
  margin-bottom: 1.5rem;
  margin-top: 2rem;
}

.editor-content :deep(.ProseMirror h2) {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  margin-top: 1.5rem;
}

.editor-content :deep(.ProseMirror h3) {
  font-size: 1.25rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  margin-top: 1rem;
}

.editor-content :deep(.ProseMirror ul),
.editor-content :deep(.ProseMirror ol) {
  margin-bottom: 1rem;
  padding-left: 1.5rem;
}

.editor-content :deep(.ProseMirror li) {
  margin-bottom: 0.25rem;
}

.editor-content :deep(.ProseMirror blockquote) {
  border-left: 4px solid #d1d5db;
  padding-left: 1rem;
  font-style: italic;
  color: #6b7280;
  margin-bottom: 1rem;
}

.editor-content :deep(.ProseMirror pre) {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.25rem;
  margin-bottom: 1rem;
  overflow-x: auto;
}

.editor-content :deep(.ProseMirror code) {
  background-color: #f3f4f6;
  padding: 0.125rem 0.25rem;
  border-radius: 0.25rem;
  font-size: 0.875rem;
}

.editor-content :deep(.ProseMirror pre code) {
  background-color: transparent;
  padding: 0;
}

.editor-content :deep(.ProseMirror img) {
  max-width: 100%;
  height: auto;
  border-radius: 0.25rem;
}

/* 协作光标样式 */
.editor-content :deep(.ProseMirror .collaboration-cursor__caret) {
  position: relative;
  border-left: 2px solid;
  border-right: 2px solid;
  margin-left: -1px;
  margin-right: -1px;
  word-break: normal;
  pointer-events: none;
  z-index: 20;
}

.editor-content :deep(.ProseMirror .collaboration-cursor__label) {
  position: absolute;
  top: 0;
  left: 0;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
  user-select: none;
  white-space: nowrap;
  color: white;
  padding: 1px 3px;
  border-radius: 3px;
  white-space: nowrap;
  z-index: 30;
}

.preview-mode {
  background-color: white;
}

.status-bar {
  font-size: 0.75rem;
}
</style>
