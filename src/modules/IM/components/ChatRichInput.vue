<template>
  <div class="chat-rich-input">
    <div class="toolbar">
      <button title="插入图片" class="toolbar-btn" @click="triggerImageUpload">🖼️</button>
      <!-- 表情包选择器 -->
      <div class="emoji-picker-wrapper" @click.stop>
        <button title="插入表情" class="toolbar-btn" @click="toggleEmojiPanel">😊</button>
        <div v-if="showEmojiPanel" class="emoji-panel">
          <span v-for="emoji in emojiList" :key="emoji" class="emoji-item" @click="insertEmoji(emoji)">{{ emoji }}</span>
        </div>
      </div>
      <input ref="fileInput" type="file" accept="image/*" style="display: none" @change="onImageChange" />
    </div>
    <EditorContent :editor="editor" class="editor-content" @keydown="onKeyDown" @paste="onPaste" @input="onInput" />

    <!-- @成员选择面板 -->
    <div v-if="showMentionPanel" class="mention-panel">
      <div v-for="(member, index) in filteredMembers" :key="member.id" :class="['mention-item', { 'mention-item-selected': index === selectedMemberIndex }]" @click="selectMember(member)">
        <div class="mention-avatar">
          <Avatar :name="member.nickname" size="sm" />
        </div>
        <div class="mention-info">
          <div class="mention-name">{{ member.nickname }}</div>
          <div class="mention-status">{{ member.onlineStatus === OnlineStatusEnum.ONLINE ? '在线' : '离线' }}</div>
        </div>
      </div>
      <div v-if="filteredMembers.length === 0" class="mention-empty">未找到匹配的成员</div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, defineProps, computed } from 'vue';
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Avatar from '@/components/common/Avatar.vue';
import { OnlineStatusEnum, UploadScene } from '@/constants/enum';
import { uploadImageApi } from '@/services/api/upload';

interface TeamMember {
  id: number;
  nickname: string;
  avatar?: string;
  onlineStatus: OnlineStatusEnum;
}

const props = defineProps<{
  members?: TeamMember[];
}>();

const emit = defineEmits(['send']);
const fileInput = ref<HTMLInputElement | null>(null);
const showEmojiPanel = ref(false);

// @功能相关状态
const showMentionPanel = ref(false);
const mentionKeyword = ref('');
const mentionStartPos = ref(0);
const selectedMemberIndex = ref(0);

// 过滤后的成员列表
const filteredMembers = computed(() => {
  if (!props.members) return [];
  if (!mentionKeyword.value) return props.members;
  return props.members.filter(member => member.nickname.toLowerCase().includes(mentionKeyword.value.toLowerCase()));
});

const emojiList = [
  '😀',
  '😁',
  '😂',
  '🤣',
  '😃',
  '😄',
  '😅',
  '😆',
  '😉',
  '😊',
  '😋',
  '😎',
  '😍',
  '😘',
  '🥰',
  '😗',
  '😙',
  '😚',
  '🙂',
  '🤗',
  '🤩',
  '🤔',
  '🤨',
  '😐',
  '😑',
  '😶',
  '🙄',
  '😏',
  '😣',
  '😥',
  '😮',
  '🤐',
  '😯',
  '😪',
  '😫',
  '🥱',
  '😴',
  '😌',
  '😛',
  '😜',
  '😝',
  '🤤',
  '😒',
  '😓',
  '😔',
  '😕',
  '🙃',
  '🤑',
  '😲',
  '☹️',
  '🙁',
  '😖',
  '😞',
  '😟',
  '😤',
  '😢',
  '😭',
  '😦',
  '😧',
  '😨',
  '😩',
  '🤯',
  '😬',
  '😰',
  '😱',
  '🥵',
  '🥶',
  '😳',
  '🤪',
  '😵',
  '😡',
  '😠',
  '🤬',
  '😷',
  '🤒',
  '🤕',
  '🤢',
  '🤮',
  '🥴',
  '😇',
  '🥳',
  '🥺',
  '🤠',
  '🤡',
  '🤥',
  '🤫',
  '🤭',
  '🧐',
  '🤓',
  '😈',
  '👿',
  '👹',
  '👺',
  '💀',
  '👻',
  '👽',
  '🤖',
  '💩',
  '😺',
  '😸',
  '😹',
  '😻',
  '😼',
  '��',
  '🙀',
  '😿',
  '😾'
];

const editor = ref<Editor | null>(null);

onMounted(() => {
  editor.value = new Editor({
    extensions: [StarterKit, Image],
    content: ''
  });
});

onBeforeUnmount(() => {
  editor.value?.destroy();
});

// 发送消息（Ctrl+Enter）
const onKeyDown = (e: KeyboardEvent) => {
  if (e.ctrlKey && e.key === 'Enter') {
    e.preventDefault();
    const html = editor.value?.getHTML() || '';
    if (html.replace(/<[^>]+>/g, '').trim() || /<img\s/i.test(html)) {
      emit('send', html);
      editor.value?.commands.clearContent();
    }
  }

  // @功能键盘导航
  if (showMentionPanel.value) {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      selectedMemberIndex.value = Math.min(selectedMemberIndex.value + 1, filteredMembers.value.length - 1);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      selectedMemberIndex.value = Math.max(selectedMemberIndex.value - 1, 0);
    } else if (e.key === 'Enter' || e.key === 'Tab') {
      e.preventDefault();
      if (filteredMembers.value[selectedMemberIndex.value]) {
        selectMember(filteredMembers.value[selectedMemberIndex.value]);
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      showMentionPanel.value = false;
    }
  }

  // 其他情况（Enter、Shift+Enter）都允许换行，不阻止默认
};

// 粘贴图片上传
const onPaste = async (e: ClipboardEvent) => {
  if (!e.clipboardData) return;
  const items = e.clipboardData.items;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.type.indexOf('image') !== -1) {
      const file = item.getAsFile();
      if (file) {
        // 上传图片
        const res = await uploadImageApi(file, UploadScene.CHAT_IMAGE);
        const src = res.data.url;
        editor.value?.commands.insertContent({
          type: 'image',
          attrs: { src }
        });
      }
      e.preventDefault();
      break;
    }
  }
};

// 插入图片
const triggerImageUpload = () => {
  fileInput.value?.click();
};
// 插入图片（上传/选择）
const onImageChange = async (e: Event) => {
  const files = (e.target as HTMLInputElement).files;
  if (files && files[0]) {
    const res = await uploadImageApi(files[0], UploadScene.CHAT_IMAGE);
    const src = res.data.url;
    editor.value?.commands.insertContent({
      type: 'image',
      attrs: { src }
    });
    (e.target as HTMLInputElement).value = '';
  }
};

// 表情面板
const toggleEmojiPanel = () => {
  showEmojiPanel.value = !showEmojiPanel.value;
};

// 插入表情
const insertEmoji = (emoji: string) => {
  editor.value?.commands.insertContent(emoji);
  showEmojiPanel.value = false;
};

// 处理@成员选择
const onInput = () => {
  if (!editor.value) return;
  const text = editor.value.getText();
  const cursorPos = editor.value.state.selection.anchor;

  // 从光标位置向前查找@符号
  let startPos = cursorPos;
  let atFound = false;

  while (startPos > 0) {
    const char = text[startPos - 1];
    if (char === '@') {
      atFound = true;
      break;
    } else if (char === ' ' || char === '\n') {
      break;
    }
    startPos--;
  }

  if (atFound) {
    const keyword = text.slice(startPos, cursorPos);
    showMentionPanel.value = true;
    mentionKeyword.value = keyword;
    mentionStartPos.value = startPos - 1; // @符号的位置
    selectedMemberIndex.value = 0;
  } else {
    showMentionPanel.value = false;
  }
};

// 选择成员
const selectMember = (member: TeamMember) => {
  if (!editor.value) return;

  const mention = `@${member.nickname} `;

  // 删除@关键词，插入@用户名
  const currentText = editor.value.getText();
  const beforeMention = currentText.slice(0, mentionStartPos.value);
  const afterMention = currentText.slice(mentionStartPos.value + mentionKeyword.value.length + 1);

  const newText = beforeMention + mention + afterMention;
  editor.value.commands.setContent(newText);

  // 将光标移动到@用户名后面
  const newCursorPos = mentionStartPos.value + mention.length;
  editor.value.commands.setTextSelection(newCursorPos);

  showMentionPanel.value = false;
  mentionKeyword.value = '';
};
</script>

<style scoped>
.chat-rich-input {
  background: #fff;
  /* border-radius: 12px; */
  box-shadow: 0 1px 4px rgba(80, 120, 200, 0.06);
  padding: 8px;
  position: relative;
  width: 100%;
}
.editor-content {
  min-height: 120px;
  max-height: 200px;
  overflow-y: auto;
  /* border: 1px solid #e0e7ef; */
  font-size: 15px;
  line-height: 1.6;
  padding: 8px;
  width: 100%;
  border-radius: 8px;
  background: #fff;
  transition: border-color 0.2s;
  white-space: pre-wrap; /* 允许换行和保留空格 */
  word-break: break-all; /* 长单词/数字也能断行 */
}
.editor-content,
.editor-content * {
  outline: none !important;
  box-shadow: none !important;
}

/* 图片宽高展示限制 */
:deep(.editor-content img) {
  max-width: 220px;
  max-height: 160px;
  height: auto;
  width: auto;
  display: block;
  margin: 4px 0;
  border-radius: 8px;
  object-fit: contain;
  box-shadow: 0 1px 4px rgba(80, 120, 200, 0.08);
}
.toolbar {
  display: flex;
  gap: 8px;
  /* margin-top: 4px; */
}
.toolbar-btn {
  background: none;
  border: none;
  font-size: 18px;
  cursor: pointer;
  padding: 2px 6px;
  border-radius: 6px;
  transition: background 0.15s;
}
.toolbar-btn:hover {
  background: #f0f4ff;
}
.emoji-picker-wrapper {
  position: relative;
  display: inline-block;
}
.emoji-panel {
  position: absolute;
  left: 0;
  top: 36px;
  z-index: 10;
  background: #fff;
  border: 1px solid #e0e7ef;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(80, 120, 200, 0.12);
  padding: 8px 10px;
  display: flex;
  flex-wrap: wrap;
  width: 320px;
  max-height: 220px;
  overflow-y: auto;
}
.emoji-item {
  font-size: 22px;
  padding: 4px;
  margin: 2px;
  cursor: pointer;
  border-radius: 4px;
  transition: background 0.12s;
}
.emoji-item:hover {
  background: #f0f4ff;
}

.mention-panel {
  position: absolute;
  left: 0;
  top: 100%;
  z-index: 10;
  background: #fff;
  border: 1px solid #e0e7ef;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(80, 120, 200, 0.12);
  padding: 8px;
  width: 320px;
  max-height: 220px;
  overflow-y: auto;
}

.mention-item {
  display: flex;
  align-items: center;
  padding: 8px;
  cursor: pointer;
  border-radius: 6px;
  transition: background 0.12s;
}

.mention-item:hover,
.mention-item-selected {
  background: #f0f4ff;
}

.mention-avatar {
  margin-right: 8px;
}

.mention-info {
  flex: 1;
}

.mention-name {
  font-size: 14px;
  font-weight: 500;
  color: #2d3a4a;
  margin-bottom: 2px;
}

.mention-status {
  font-size: 12px;
  color: #8a99b3;
}

.mention-empty {
  text-align: center;
  padding: 12px;
  color: #8a99b3;
  font-size: 14px;
}

/* @用户名高亮样式 */
:deep(.mention-highlight) {
  background: #e0e7ff;
  color: #6c8cff;
  font-weight: 500;
  padding: 2px 4px;
  border-radius: 4px;
  margin: 0 2px;
}
</style>
