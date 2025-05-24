<template>
  <div v-if="isOpen" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
    <div class="absolute inset-0" @click="$emit('close')"></div>

    <div class="relative bg-white rounded-lg shadow-lg w-full max-w-md p-6" @click.stop>
      <div class="flex justify-between items-center mb-4">
        <h2 class="text-xl font-semibold text-gray-900">创建新团队空间</h2>
        <button class="p-2 hover:bg-gray-100 rounded-md" @click="$emit('close')">
          <XIcon class="h-4 w-4" />
        </button>
      </div>

      <form class="space-y-4" @submit.prevent="handleSubmit">
        <div class="space-y-2">
          <label for="team-name" class="block text-sm font-medium text-gray-700">团队名称</label>
          <input id="team-name" v-model="name" type="text" placeholder="输入团队名称" required class="w-full px-3 py-2 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none" />
        </div>

        <div class="space-y-2">
          <label for="team-description" class="block text-sm font-medium text-gray-700">团队描述</label>
          <textarea
            id="team-description"
            v-model="description"
            placeholder="简要描述团队的用途和目标"
            rows="3"
            class="w-full px-3 py-2 border border-gray-200 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-100 focus:outline-none resize-none"
          ></textarea>
        </div>

        <div class="flex justify-end gap-2 pt-2">
          <button type="button" :disabled="isLoading" class="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50" @click="$emit('close')">取消</button>
          <button type="submit" :disabled="isLoading || !name" class="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50">
            {{ isLoading ? '创建中...' : '创建团队' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { X as XIcon } from 'lucide-vue-next';

interface Props {
  isOpen: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'create', data: { name: string; description: string }): void;
}>();

const name = ref('');
const description = ref('');
const isLoading = ref(false);

const handleSubmit = async () => {
  if (!name.value) return;

  isLoading.value = true;

  // 模拟API调用
  await new Promise(resolve => setTimeout(resolve, 1000));

  emit('create', { name: name.value, description: description.value });
  isLoading.value = false;
  name.value = '';
  description.value = '';
  emit('close');
};
</script>
