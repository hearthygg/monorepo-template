<template>
  <div class="video-preview-container h-full flex flex-col">
    <!-- 工具栏 -->
    <div class="toolbar bg-gray-50 px-4 py-2 flex items-center justify-between border-b border-gray-200">
      <div class="flex items-center gap-3">
        <Icon :icon="getIconNameByFile(file.ext || '')" class="h-5 w-5 text-purple-600" />
        <div>
          <div class="font-medium text-sm">{{ file.name }}</div>
          <div class="text-xs text-gray-500">
            {{ formatFileSize(file.size || 0) }} • {{ formatDate(new Date(file.createdAt)) }}
            <span v-if="videoInfo.duration"> • {{ formatDuration(videoInfo.duration) }} </span>
          </div>
        </div>
      </div>

      <div class="flex items-center gap-2">
        <!-- 播放速度控制 -->
        <div class="flex items-center gap-1 bg-white rounded border border-gray-200 px-2 py-1">
          <span class="text-xs text-gray-600">速度:</span>
          <select v-model="playbackRate" class="text-xs border-none bg-transparent focus:outline-none" @change="changePlaybackRate">
            <option value="0.5">0.5x</option>
            <option value="0.75">0.75x</option>
            <option value="1">1x</option>
            <option value="1.25">1.25x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>

        <!-- 全屏按钮 -->
        <!-- <button
          @click="toggleFullscreen"
          class="p-1 hover:bg-gray-200 rounded"
          title="全屏"
        >
          <MaximizeIcon class="h-4 w-4" />
        </button> -->

        <!-- 下载按钮 -->
        <button class="p-1 hover:bg-gray-200 rounded" title="下载" @click="downloadFile">
          <DownloadIcon class="h-4 w-4" />
        </button>
      </div>
    </div>

    <!-- 视频播放区域 -->
    <div class="video-player flex-1 relative bg-black">
      <div ref="videoContainer" class="w-full h-full flex items-center justify-center">
        <!-- 加载状态 -->
        <div v-if="loading" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
          <div class="text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-2"></div>
            <div class="text-sm text-white">加载中...</div>
          </div>
        </div>

        <!-- 错误状态 -->
        <div v-if="error" class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-75 z-10">
          <div class="text-center">
            <AlertCircleIcon class="h-12 w-12 text-red-500 mx-auto mb-2" />
            <div class="text-sm text-white mb-2">视频加载失败</div>
            <button class="px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700" @click="retryLoad">重试</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick, shallowRef } from 'vue';
import { Video as VideoIcon, Download as DownloadIcon, Maximize as MaximizeIcon, AlertCircle as AlertCircleIcon } from 'lucide-vue-next';
import type { FileTreeDto } from '@/services/api/file/types';
import { ElMessage } from 'element-plus';
import Plyr from 'plyr';
import 'plyr/dist/plyr.css';
import { formatFileSize, formatDate } from '@/utils/file';
import { Icon } from '@iconify/vue';
import { getIconNameByFile } from '@/utils/file-icon-map';

interface Props {
  file: FileTreeDto;
}

const props = defineProps<Props>();

// 响应式状态
const videoContainer = ref<HTMLDivElement>();
const loading = ref(true);
const error = ref(false);
const playbackRate = ref(1);
const player = shallowRef<Plyr | null>(null);
const isComponentMounted = ref(true);
const isInitializing = ref(false);

// 视频信息
const videoInfo = ref({
  duration: 0,
  width: 0,
  height: 0
});

// 格式化时长
const formatDuration = (seconds: number): string => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${minutes}:${secs.toString().padStart(2, '0')}`;
};

// 销毁播放器
const destroyPlayer = () => {
  if (player.value) {
    try {
      player.value.destroy();
    } catch (e) {
      console.warn('Error destroying player:', e);
    }
    player.value = null;
  }
};

// 初始化 Plyr 播放器
const initPlayer = async () => {
  if (!isComponentMounted.value || !videoContainer.value || !props.file.path || isInitializing.value) {
    return;
  }

  isInitializing.value = true;

  try {
    // 等待DOM更新完成
    await nextTick();

    if (!isComponentMounted.value || !videoContainer.value) {
      isInitializing.value = false;
      return;
    }

    // 先销毁现有的播放器
    destroyPlayer();

    // 创建视频元素
    const video = document.createElement('video');
    video.src = props.file.path;
    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';

    // 清空容器并添加视频元素
    if (videoContainer.value) {
      videoContainer.value.innerHTML = '';
      videoContainer.value.appendChild(video);
    }

    // 等待DOM更新
    await nextTick();

    if (!isComponentMounted.value || !videoContainer.value) {
      isInitializing.value = false;
      return;
    }

    // 使用requestAnimationFrame确保在下一帧初始化，避免与Vue的响应式更新冲突
    requestAnimationFrame(() => {
      if (!isComponentMounted.value || !videoContainer.value) {
        isInitializing.value = false;
        return;
      }

      try {
        // 初始化 Plyr
        const newPlayer = new Plyr(video, {
          controls: ['play-large', 'play', 'progress', 'current-time', 'mute', 'volume', 'captions', 'settings', 'pip', 'airplay', 'fullscreen'],
          settings: ['captions', 'quality', 'speed'],
          speed: {
            selected: 1,
            options: [0.5, 0.75, 1, 1.25, 1.5, 2]
          },
          keyboard: {
            focused: true,
            global: true
          },
          tooltips: {
            controls: true,
            seek: true
          },
          hideControls: true,
          resetOnEnd: false
        });

        // 安全地设置播放器实例
        if (isComponentMounted.value) {
          player.value = newPlayer;

          // 事件监听
          newPlayer.on('ready', () => {
            if (!isComponentMounted.value) return;

            loading.value = false;
            error.value = false;

            // 获取视频信息
            if (newPlayer && videoContainer.value) {
              const videoElement = videoContainer.value.querySelector('video') as HTMLVideoElement;
              if (videoElement) {
                videoInfo.value = {
                  duration: videoElement.duration || 0,
                  width: videoElement.videoWidth || 0,
                  height: videoElement.videoHeight || 0
                };
              }
            }
          });

          newPlayer.on('error', () => {
            if (!isComponentMounted.value) return;

            loading.value = false;
            error.value = true;
          });

          newPlayer.on('loadeddata', () => {
            if (!isComponentMounted.value) return;

            loading.value = false;
          });
        } else {
          // 如果组件已卸载，销毁播放器
          try {
            newPlayer.destroy();
          } catch (e) {
            console.warn('Error destroying player after mount check:', e);
          }
        }

        isInitializing.value = false;
      } catch (e) {
        console.error('Error initializing Plyr:', e);
        if (isComponentMounted.value) {
          loading.value = false;
          error.value = true;
        }
        isInitializing.value = false;
      }
    });
  } catch (e) {
    console.error('Error in initPlayer:', e);
    if (isComponentMounted.value) {
      loading.value = false;
      error.value = true;
    }
    isInitializing.value = false;
  }
};

// 重试加载
const retryLoad = async () => {
  if (!isComponentMounted.value || isInitializing.value) return;

  loading.value = true;
  error.value = false;
  await initPlayer();
};

// 切换播放速度
const changePlaybackRate = () => {
  if (player.value && isComponentMounted.value) {
    try {
      player.value.speed = playbackRate.value;
    } catch (e) {
      console.warn('Error changing playback rate:', e);
    }
  }
};

// 切换全屏
const toggleFullscreen = () => {
  if (player.value && isComponentMounted.value) {
    try {
      if (player.value.fullscreen.active) {
        player.value.fullscreen.exit();
      } else {
        player.value.fullscreen.enter();
      }
    } catch (e) {
      console.warn('Error toggling fullscreen:', e);
    }
  }
};

// 下载文件
const downloadFile = () => {
  if (!props.file.path) {
    ElMessage.error('文件路径不存在');
    return;
  }

  try {
    const link = document.createElement('a');
    link.href = props.file.path;
    link.download = props.file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    ElMessage.success('开始下载文件');
  } catch (e) {
    console.error('Error downloading file:', e);
    ElMessage.error('下载失败');
  }
};

onMounted(async () => {
  isComponentMounted.value = true;
  await initPlayer();
});

onUnmounted(() => {
  isComponentMounted.value = false;
  isInitializing.value = false;
  destroyPlayer();
});
</script>

<style scoped>
.video-preview-container {
  user-select: none;
}

/* 自定义 Plyr 样式 */
:deep(.plyr) {
  width: 100%;
  height: 100%;
}

:deep(.plyr__video-wrapper) {
  height: 100%;
}

:deep(.plyr__video) {
  height: 100%;
  object-fit: contain;
}

:deep(.plyr__controls) {
  background: linear-gradient(transparent, rgba(0, 0, 0, 0.7));
}

:deep(.plyr__control--overlaid) {
  background: rgba(147, 51, 234, 0.9);
  border: 2px solid rgba(255, 255, 255, 0.9);
}

:deep(.plyr__control--overlaid:hover) {
  background: rgba(147, 51, 234, 1);
}

:deep(.plyr__progress__played) {
  background: rgb(147, 51, 234);
}

:deep(.plyr__volume__display) {
  background: rgb(147, 51, 234);
}
</style>
