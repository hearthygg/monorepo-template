<template>
  <teleport to="body">
    <!-- 加入过度动画 -->
    <transition name="el-zoom-in-center">
      <div
        v-show="isShow"
        :class="{ maxShow: isFullscreen }"
        class="window"
        :style="{ left: windowX + 'px', top: windowY + 'px', width: windowWidth + 'px', height: windowHeight + 'px', zIndex: zIndexState.zIndex }"
        @mousedown="startResize($event)"
      >
        <div class="header" @mousedown="startDrag($event)">
          <span class="title">
            <svg class="myIcon mr-2" aria-hidden="true" style="font-size: 24px">
              <use :xlink:href="icon ? `#${icon}` : '#icon-moren'"></use>
            </svg>
            {{ props.dialogTitle }}
          </span>
          <span class="minimize-btn" @click="minimizeWindow">
            <i class="iconfont icon-2zuixiaohua-2"></i>
          </span>
          <span class="fullscreen-btn" @click="toggleFullscreen">
            <i class="iconfont" style="font-weight: bold" :class="isFullscreen ? 'icon-zuidahua' : 'icon-3zuidahua-1'"></i>
          </span>
          <span class="minimize-btn" @click="minimizeWindow">
            <i class="iconfont icon-guanbi"></i>
          </span>
        </div>
        <div class="content">
          <!-- 插槽动态控制显示的内容 -->
          <slot></slot>
        </div>
        <div class="top-left"></div>
        <div class="top"></div>
        <div class="top-right"></div>
        <div class="left"></div>
        <div class="right"></div>
        <div class="bottom-left"></div>
        <div class="bottom"></div>
        <div class="bottom-right"></div>
      </div>
    </transition>
    <!-- 为了避免拖拽或者拉伸的过程中底部有iframe子页面会引起断流 -->
    <div v-if="isDragging || isResizing" class="protectMask"></div>
  </teleport>
</template>

<script lang="ts" setup>
import { computed, reactive, ref } from 'vue';
const props = defineProps({
  // v-model 双向绑定的值
  modelValue: {
    type: Boolean,
    required: true,
    default: () => false
  },
  width: {
    type: Number,
    default: () => 300
  },
  height: {
    type: Number,
    default: () => 200
  },
  x: {
    type: Number,
    default: () => 100
  },
  y: {
    type: Number,
    default: () => 100
  },
  dialogId: {
    type: Number
  },
  dialogTitle: {
    type: String,
    default: () => '窗口标题'
  },
  icon: {
    type: String,
    default: () => 'icon-moren'
  }
});
const emit = defineEmits(['update:modelValue']);
const windowX = ref(props.x);
const windowY = ref(props.y);
const windowWidth = ref(props.width);
const windowHeight = ref(props.height);

const isDragging = ref(false);
// 最大化
const isFullscreen = ref(false);
// 最小化
// const isShow = ref(false);
const isShow = computed({
  get: () => props.modelValue,
  set: value => {
    emit('update:modelValue', value);
  }
});

// 弹窗拉伸状态
const isResizing = ref(false);
// 拉伸设置类别 避免缩放功能和内容的事件冲突
const setClass = ['top-left', 'top-right', 'bottom-left', 'bottom-right', 'top', 'bottom', 'left', 'right'];
// 按钮设置类别主要是为了避免头部的按钮和拖拽功能冲突
const btnClass = ['minimize-btn', 'fullscreen-btn', 'iconfont icon-2zuixiaohua-2', 'iconfont icon-zuidahua', 'iconfont icon-guanbi', 'iconfont icon-3zuidahua-1'];
// 层级数据
const zIndexState = reactive({
  zIndex: 1002,
  // 焦点层级
  focusZindex: 1002,
  // 正常层级
  normalZindex: 1000
});
// 边界参数设置
const startDrag = (event: MouseEvent) => {
  const handle = event.target as HTMLElement;
  // 限制只有可拖拽的元素会进调整大小判断
  if (btnClass.includes(handle.className)) return;
  // 全屏不要拖动和缩放
  if (isFullscreen.value) return;
  isDragging.value = true;
  setViewIndex();
  document.addEventListener('mousemove', drag);
  document.addEventListener('mouseup', endDrag);
  event.preventDefault();
};

const drag = (event: MouseEvent) => {
  if (!isDragging.value) return;
  const xVal = windowX.value + event.movementX;
  const yVal = windowY.value + event.movementY;
  // 避免头部栏拖拽到可视区外
  windowX.value = Math.max(200 - windowWidth.value, Math.min(window.innerWidth - 200, xVal));
  windowY.value = Math.max(0, Math.min(window.innerHeight - 42, yVal));
};

const endDrag = () => {
  isDragging.value = false;
  document.removeEventListener('mousemove', drag);
  document.removeEventListener('mouseup', endDrag);
};

const minimizeWindow = () => {
  isShow.value = !isShow.value;
  if (isShow.value) setViewIndex();
};

const toggleFullscreen = () => {
  isFullscreen.value = !isFullscreen.value;
};

// 四个角落和四个方向设置宽高的功能
const startResize = (event: MouseEvent) => {
  // 全屏不要拖动和缩放
  if (isFullscreen.value) return;
  const handle = event.target as HTMLElement;
  // 限制只有可拖拽的元素会进调整大小判断
  if (!setClass.includes(handle.className)) return;
  const initialX = event.clientX;
  const initialY = event.clientY;
  const initialWidth = windowWidth.value;
  const initialHeight = windowHeight.value;
  const initialWindowX = windowX.value;
  const initialWindowY = windowY.value;

  isResizing.value = true;
  setViewIndex();
  const resize = (event: MouseEvent) => {
    if (!isResizing.value) return;
    let newWidth = initialWidth;
    let newHeight = initialHeight;
    let newWindowX = initialWindowX;
    let newWindowY = initialWindowY;

    switch (handle.className) {
      case 'top-left':
        newWidth -= event.clientX - initialX;
        newHeight -= event.clientY - initialY;
        newWindowX += event.clientX - initialX;
        newWindowY += event.clientY - initialY;
        break;
      case 'top':
        newHeight -= event.clientY - initialY;
        newWindowY += event.clientY - initialY;
        break;
      case 'top-right':
        newHeight -= event.clientY - initialY;
        newWidth += event.clientX - initialX;
        newWindowY += event.clientY - initialY;
        break;
      case 'left':
        newWidth -= event.clientX - initialX;
        newWindowX += event.clientX - initialX;
        break;
      case 'right':
        newWidth += event.clientX - initialX;
        break;
      case 'bottom-left':
        newWidth -= event.clientX - initialX;
        newHeight += event.clientY - initialY;
        newWindowX += event.clientX - initialX;
        break;
      case 'bottom':
        newHeight += event.clientY - initialY;
        break;
      case 'bottom-right':
        newHeight += event.clientY - initialY;
        newWidth += event.clientX - initialX;
        break;
    }

    windowWidth.value = Math.max(newWidth, 100);
    windowHeight.value = Math.max(newHeight, 100);
    windowX.value = Math.max(newWindowX, 0);
    windowY.value = Math.max(newWindowY, 0);
  };

  const endResize = () => {
    isResizing.value = false;
    document.removeEventListener('mousemove', resize);
    document.removeEventListener('mouseup', endResize);
  };

  document.addEventListener('mousemove', resize);
  document.addEventListener('mouseup', endResize);
};

// 让当前窗口在最上层其他窗口最下层
const setViewIndex = () => {
  zIndexState.zIndex = zIndexState.focusZindex;
};

// 重置初始状态
const resetWindowState = () => {
  windowX.value = props.x;
  windowY.value = props.y;
  windowWidth.value = props.width;
  windowHeight.value = props.height;
};
</script>

<style lang="scss" scoped>
.window {
  position: fixed;
  width: 300px;
  height: 200px;
  border: 1px solid #dcdfe6;
  background-color: white;
  z-index: 1000;
  border-radius: 5px;
}
// 弹窗全屏样式覆盖
.maxShow {
  width: 100vw !important;
  height: 100vh !important;
  left: 0 !important;
  top: 0 !important;
  border: none;
  overflow: hidden;
  border-radius: 0;
  z-index: 1003 !important;
}
// 拖动和缩放的遮罩层
.protectMask {
  width: 100vw;
  height: 100vh;
  position: absolute;
  background: transparent;
  z-index: 99997;
  top: 0;
  left: 0;
  // overflow: hidden;
}
.header {
  display: flex;
  align-items: center;
  padding: 5px;
  cursor: move;
  user-select: none;
  background-color: #ebf5ff;
  color: #303133;
  // font-weight: bold;
  border-radius: 5px 5px 0 0;
  .title {
    flex-grow: 1;
    font-size: 18px;
  }
  .iconfont {
    color: #606266;
  }
  .icon-guanbi {
    font-size: 14px;
  }
}

.minimize-btn,
.fullscreen-btn {
  padding: 5px;
  margin: 0 5px;
  cursor: pointer;
  &:hover {
    .iconfont {
      color: #409eff !important;
    }
  }
}

.content {
  // padding: 10px;
  overflow: auto;
  border-radius: 0 0 5px 5px;
  color: #606266;
  font-size: 15px;
  display: flex;
  flex-direction: column;
  height: calc(100% - 44px);
  @include scrollBar;
}

.hidden {
  display: none;
}

.resize-handle {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
}

.top-left,
.top-right,
.bottom-left,
.bottom-right,
.top,
.bottom,
.left,
.right {
  position: absolute;
  width: 10px;
  height: 10px;
  cursor: nwse-resize;
}
.top,
.bottom {
  width: 100%;
}
.left,
.right {
  height: 100%;
}
.top-left {
  top: -5px;
  left: -5px;
}

.top-right {
  top: -5px;
  right: -5px;
  cursor: nesw-resize; /* 设置光标样式 */
}

.bottom-left {
  bottom: -5px;
  left: -5px;
  cursor: nesw-resize; /* 设置光标样式 */
}

.bottom-right {
  bottom: -5px;
  right: -5px;
}

.top,
.bottom {
  position: absolute;
  left: 0;
  right: 0;
  height: 10px;
  cursor: ns-resize;
}

.top {
  top: -5px;
}

.bottom {
  bottom: -5px;
}

.left,
.right {
  position: absolute;
  top: 0;
  bottom: 0;
  width: 10px;
  cursor: ew-resize;
}

.left {
  left: -5px;
}

.right {
  right: -5px;
}
</style>
