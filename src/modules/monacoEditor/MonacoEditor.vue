<template>
  <div ref="containerRef" :style="containerStyle"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed, nextTick } from 'vue';
import * as monaco from 'monaco-editor';
import { getMonacoLanguageByExt } from './language-map';

interface Props {
  modelValue: string;
  language?: string;
  fileExt?: string;
  theme?: string;
  readOnly?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'vs-dark',
  readOnly: false,
  language: undefined,
  fileExt: ''
});
const emit = defineEmits(['update:modelValue', 'change', 'save']);

const containerRef = ref<HTMLDivElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;
let isInternalUpdate = false; // 标记是否是内部更新

// 自动推断 language
const monacoLanguage = computed(() => {
  return props.language || getMonacoLanguageByExt(props.fileExt);
});

const containerStyle = {
  width: '100%',
  height: '100%',
  minWidth: '200px',
  minHeight: '100px'
};

onMounted(() => {
  if (containerRef.value) {
    editor = monaco.editor.create(containerRef.value, {
      value: props.modelValue,
      language: monacoLanguage.value,
      theme: props.theme,
      readOnly: props.readOnly,
      automaticLayout: true,
      fontSize: 14,
      minimap: { enabled: false }
    });

    // 监听编辑器内容变化
    editor.onDidChangeModelContent(() => {
      if (isInternalUpdate) return; // 跳过内部更新

      const value = editor!.getValue();
      emit('update:modelValue', value);
      emit('change', value);
    });

    // 绑定 Ctrl+S/Cmd+S
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      emit('save', editor!.getValue());
    });
  }
});

// 监听外部值变化，更新编辑器
watch(
  () => props.modelValue,
  async newValue => {
    if (editor && newValue !== editor.getValue()) {
      isInternalUpdate = true; // 标记为内部更新
      editor.setValue(newValue);
      await nextTick();
      isInternalUpdate = false; // 重置标记
    }
  }
);

watch(monacoLanguage, lang => {
  if (editor) {
    monaco.editor.setModelLanguage(editor.getModel()!, lang);
  }
});

watch(
  () => props.theme,
  theme => {
    if (editor) {
      monaco.editor.setTheme(theme!);
    }
  }
);

watch(
  () => props.readOnly,
  ro => {
    if (editor) {
      editor.updateOptions({ readOnly: ro });
    }
  }
);

onUnmounted(() => {
  editor?.dispose();
});
</script>

<style scoped>
:host,
.monaco-editor,
div[ref='containerRef'] {
  width: 100%;
  height: 100%;
  min-width: 200px;
  min-height: 100px;
}
</style>
