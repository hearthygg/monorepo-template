<template>
  <div ref="containerRef" :style="containerStyle"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, computed } from 'vue';
import * as monaco from 'monaco-editor';

interface Props {
  modelValue: string;
  language: string;
  theme?: string;
  readOnly?: boolean;
  height?: string;
  width?: string;
}

const props = withDefaults(defineProps<Props>(), {
  theme: 'vs-dark',
  readOnly: false,
  height: '400px',
  width: '100%'
});
const emit = defineEmits(['update:modelValue', 'change']);

const containerRef = ref<HTMLDivElement | null>(null);
let editor: monaco.editor.IStandaloneCodeEditor | null = null;

const containerStyle = computed(() => ({
  height: props.height,
  width: props.width,
  minWidth: '200px',
  minHeight: '100px'
}));

onMounted(() => {
  if (containerRef.value) {
    editor = monaco.editor.create(containerRef.value, {
      value: props.modelValue,
      language: props.language,
      theme: props.theme,
      readOnly: props.readOnly,
      automaticLayout: true,
      fontSize: 14,
      minimap: { enabled: false }
    });
    editor.onDidChangeModelContent(() => {
      const value = editor!.getValue();
      emit('update:modelValue', value);
      emit('change', value);
    });
  }
});

watch(
  () => props.modelValue,
  val => {
    if (editor && val !== editor.getValue()) {
      editor.setValue(val);
    }
  }
);

watch(
  () => props.language,
  lang => {
    if (editor) {
      monaco.editor.setModelLanguage(editor.getModel()!, lang);
    }
  }
);

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
