<template>
  <div :class="['avatar', `avatar-${size}`, { 'avatar-circle': shape === 'circle' }, { 'avatar-square': shape === 'square' }]" :style="avatarStyle">
    <!-- 图片头像 -->
    <img v-if="src && !showTextAvatar" :src="src" :alt="alt" class="avatar-image" @error="handleImageError" />

    <!-- 文字头像 -->
    <div v-else class="avatar-text" :style="textAvatarStyle">
      {{ displayText }}
    </div>

    <!-- 在线状态指示器 -->
    <div v-if="showOnlineStatus" :class="['avatar-status', { 'status-online': isOnline }, { 'status-offline': !isOnline }]" />

    <!-- 群组标识 -->
    <div v-if="isGroup" class="avatar-group-badge">群</div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';

interface Props {
  src?: string; // 头像图片URL
  alt?: string; // 图片alt属性
  name?: string; // 用户名（用于生成文字头像）
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'; // 头像尺寸
  shape?: 'circle' | 'square'; // 头像形状
  isOnline?: boolean; // 在线状态
  showOnlineStatus?: boolean; // 是否显示在线状态
  isGroup?: boolean; // 是否为群组头像
  bgColor?: string; // 文字头像背景色
  textColor?: string; // 文字头像文字颜色
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  shape: 'circle',
  showOnlineStatus: false,
  isGroup: false,
  bgColor: '',
  textColor: ''
});

// 是否显示文字头像
const showTextAvatar = ref(false);

// 处理图片加载错误
const handleImageError = () => {
  showTextAvatar.value = true;
};

// 显示的文字（取名字的第一个字符）
const displayText = computed(() => {
  if (!props.name) return '?';
  return props.name.charAt(0).toUpperCase();
});

// 头像样式
const avatarStyle = computed(() => {
  const styles: Record<string, string> = {};

  // 如果没有图片且没有指定背景色，使用默认的渐变色
  if ((!props.src || showTextAvatar.value) && !props.bgColor) {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#85C1E9'];
    const colorIndex = props.name ? props.name.charCodeAt(0) % colors.length : 0;
    styles.background = colors[colorIndex];
  }

  return styles;
});

// 文字头像样式
const textAvatarStyle = computed(() => {
  const styles: Record<string, string> = {};

  if (props.bgColor) {
    styles.background = props.bgColor;
  }

  if (props.textColor) {
    styles.color = props.textColor;
  }

  return styles;
});

// 尺寸映射
const sizeMap = {
  xs: 'w-6 h-6 text-xs',
  sm: 'w-8 h-8 text-sm',
  md: 'w-10 h-10 text-base',
  lg: 'w-12 h-12 text-lg',
  xl: 'w-16 h-16 text-xl'
};
</script>

<style scoped>
.avatar {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  /* overflow: hidden; */
  font-weight: 600;
  color: white;
}

.avatar-circle {
  border-radius: 50%;
}

.avatar-square {
  border-radius: 8px;
}

.avatar-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.avatar-text {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: white;
}

.avatar-status {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 25%;
  height: 25%;
  border-radius: 50%;
  border: 2px solid white;
}

.status-online {
  background-color: #10b981;
}

.status-offline {
  background-color: #9ca3af;
}

.avatar-group-badge {
  position: absolute;
  top: -2px;
  right: -2px;
  background: #3b82f6;
  color: white;
  font-size: 10px;
  padding: 2px 4px;
  border-radius: 4px;
  font-weight: 500;
}

/* 尺寸样式 */
.avatar-xs {
  width: 24px;
  height: 24px;
  font-size: 12px;
}

.avatar-sm {
  width: 32px;
  height: 32px;
  font-size: 14px;
}

.avatar-md {
  width: 40px;
  height: 40px;
  font-size: 16px;
}

.avatar-lg {
  width: 48px;
  height: 48px;
  font-size: 18px;
}

.avatar-xl {
  width: 64px;
  height: 64px;
  font-size: 24px;
}
</style>
