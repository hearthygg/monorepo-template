<template>
  <div :class="['message-bubble', { 'message-mine': isMine }]">
    <div class="message-text">{{ content }}</div>
    <div class="message-time">{{ formatTime(timestamp) }}</div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  content: string;
  timestamp: Date;
  isMine: boolean;
}

defineProps<Props>();

const formatTime = (timestamp: Date) => {
  const now = new Date();
  const diff = now.getTime() - timestamp.getTime();

  if (diff < 60000) return '刚刚';
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`;
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`;

  return timestamp.toLocaleDateString();
};
</script>

<style scoped>
.message-bubble {
  background: white;
  padding: 12px 16px;
  border-radius: 18px;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
  position: relative;
  max-width: 100%;
}

.message-bubble.message-mine {
  background: #007bff;
  color: white;
}

.message-text {
  margin-bottom: 4px;
  line-height: 1.4;
  word-wrap: break-word;
}

.message-time {
  font-size: 11px;
  opacity: 0.7;
  text-align: right;
}
</style>
