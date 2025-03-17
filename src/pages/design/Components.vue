<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-8 text-gray-900">组件系统</h1>

    <!-- 按钮 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">按钮</h2>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="space-y-8">
          <!-- 按钮变体 -->
          <div>
            <h3 class="text-lg font-medium mb-3 text-gray-700">按钮变体</h3>
            <div class="flex flex-wrap gap-4">
              <button class="btn btn-primary">主要按钮</button>
              <button class="btn btn-secondary">次要按钮</button>
              <button class="btn btn-outline">轮廓按钮</button>
              <button class="btn btn-ghost">幽灵按钮</button>
              <button class="btn btn-link">链接按钮</button>
            </div>
          </div>

          <!-- 按钮尺寸 -->
          <div>
            <h3 class="text-lg font-medium mb-3 text-gray-700">按钮尺寸</h3>
            <div class="flex flex-wrap items-center gap-4">
              <button class="btn btn-primary btn-sm">小按钮</button>
              <button class="btn btn-primary">默认按钮</button>
              <button class="btn btn-primary btn-lg">大按钮</button>
            </div>
          </div>

          <!-- 按钮状态 -->
          <div>
            <h3 class="text-lg font-medium mb-3 text-gray-700">按钮状态</h3>
            <div class="flex flex-wrap gap-4">
              <button class="btn btn-primary">默认状态</button>
              <button class="btn btn-primary hover">悬停状态</button>
              <button class="btn btn-primary focus">聚焦状态</button>
              <button class="btn btn-primary active">激活状态</button>
              <button class="btn btn-primary" disabled>禁用状态</button>
              <button class="btn btn-primary btn-loading">加载状态</button>
            </div>
          </div>

          <!-- 带图标的按钮 -->
          <div>
            <h3 class="text-lg font-medium mb-3 text-gray-700">带图标的按钮</h3>
            <div class="flex flex-wrap gap-4">
              <button class="btn btn-primary">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path>
                </svg>
                添加
              </button>
              <button class="btn btn-secondary">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
                </svg>
                上传
              </button>
              <button class="btn btn-outline">
                <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
                </svg>
                删除
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 表单元素 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">表单元素</h2>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <div class="space-y-8">
          <!-- 输入框 -->
          <div>
            <h3 class="text-lg font-medium mb-3 text-gray-700">输入框</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="default-input" class="form-label">默认输入框</label>
                <input id="default-input" type="text" class="form-input" placeholder="请输入内容" />
              </div>
              <div>
                <label for="disabled-input" class="form-label">禁用输入框</label>
                <input id="disabled-input" type="text" class="form-input" placeholder="禁用状态" disabled />
              </div>
              <div>
                <label for="error-input" class="form-label">错误输入框</label>
                <input id="error-input" type="text" class="form-input error" placeholder="错误状态" />
                <p class="form-error">请输入有效内容</p>
              </div>
              <div>
                <label for="success-input" class="form-label">成功输入框</label>
                <input id="success-input" type="text" class="form-input success" placeholder="成功状态" />
                <p class="form-success">输入有效</p>
              </div>
            </div>
          </div>

          <!-- 选择框 -->
          <div>
            <h3 class="text-lg font-medium mb-3 text-gray-700">选择框</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label for="default-select" class="form-label">默认选择框</label>
                <select id="default-select" class="form-select">
                  <option value="" disabled selected>请选择选项</option>
                  <option value="option1">选项 1</option>
                  <option value="option2">选项 2</option>
                  <option value="option3">选项 3</option>
                </select>
              </div>
              <div>
                <label for="disabled-select" class="form-label">禁用选择框</label>
                <select id="disabled-select" class="form-select" disabled>
                  <option value="" disabled selected>禁用状态</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 复选框和单选框 -->
          <div>
            <h3 class="text-lg font-medium mb-3 text-gray-700">复选框和单选框</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <div class="space-y-2">
                  <div class="form-checkbox-wrapper">
                    <input id="checkbox1" type="checkbox" class="form-checkbox" />
                    <label for="checkbox1" class="form-checkbox-label">复选框 1</label>
                  </div>
                  <div class="form-checkbox-wrapper">
                    <input id="checkbox2" type="checkbox" class="form-checkbox" />
                    <label for="checkbox2" class="form-checkbox-label">复选框 2</label>
                  </div>
                  <div class="form-checkbox-wrapper">
                    <input id="checkbox3" type="checkbox" class="form-checkbox" disabled />
                    <label for="checkbox3" class="form-checkbox-label">禁用复选框</label>
                  </div>
                </div>
              </div>
              <div>
                <div class="space-y-2">
                  <div class="form-radio-wrapper">
                    <input id="radio1" type="radio" name="radio-group" class="form-radio" />
                    <label for="radio1" class="form-radio-label">单选框 1</label>
                  </div>
                  <div class="form-radio-wrapper">
                    <input id="radio2" type="radio" name="radio-group" class="form-radio" />
                    <label for="radio2" class="form-radio-label">单选框 2</label>
                  </div>
                  <div class="form-radio-wrapper">
                    <input id="radio3" type="radio" name="radio-group" class="form-radio" disabled />
                    <label for="radio3" class="form-radio-label">禁用单选框</label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 文本区域 -->
          <div>
            <h3 class="text-lg font-medium mb-3 text-gray-700">文本区域</h3>
            <div>
              <label for="textarea" class="form-label">文本区域</label>
              <textarea id="textarea" class="form-textarea" rows="4" placeholder="请输入多行文本"></textarea>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 卡片 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">卡片</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
        <!-- 基础卡片 -->
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">基础卡片</h3>
            <p class="card-text">这是一个基础卡片示例，只包含简单的内容。</p>
          </div>
        </div>

        <!-- 带图片的卡片 -->
        <div class="card">
          <img src="https://via.placeholder.com/400x200" alt="卡片图片" class="card-img" />
          <div class="card-body">
            <h3 class="card-title">带图片的卡片</h3>
            <p class="card-text">这是一个带有图片的卡片示例，图片位于顶部。</p>
          </div>
        </div>

        <!-- 带操作的卡片 -->
        <div class="card">
          <div class="card-body">
            <h3 class="card-title">带操作的卡片</h3>
            <p class="card-text">这是一个带有操作按钮的卡片示例。</p>
            <div class="card-actions">
              <button class="btn btn-sm btn-primary">确认</button>
              <button class="btn btn-sm btn-outline">取消</button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 提示和通知 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">提示和通知</h2>
      <div class="space-y-4">
        <div class="alert alert-info">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>这是一条信息提示，用于展示一般性信息。</span>
        </div>
        <div class="alert alert-success">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>这是一条成功提示，用于展示操作成功的反馈。</span>
        </div>
        <div class="alert alert-warning">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
          </svg>
          <span>这是一条警告提示，用于展示需要注意的信息。</span>
        </div>
        <div class="alert alert-error">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>这是一条错误提示，用于展示错误信息或操作失败的反馈。</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
// 无需额外脚本
</script>

<style>
/* 按钮样式 */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.375rem;
  font-weight: 500;
  font-size: 0.875rem;
  padding: 0.5rem 1rem;
  transition: all 0.2s;
  cursor: pointer;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-sm {
  padding: 0.25rem 0.75rem;
  font-size: 0.75rem;
}

.btn-lg {
  padding: 0.75rem 1.5rem;
  font-size: 1rem;
}

.btn-primary {
  background-color: var(--color-primary-500);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background-color: var(--color-primary-600);
}

.btn-primary:active:not(:disabled) {
  background-color: var(--color-primary-700);
}

.btn-secondary {
  background-color: var(--color-gray-200);
  color: var(--color-gray-800);
}

.btn-secondary:hover:not(:disabled) {
  background-color: var(--color-gray-300);
}

.btn-secondary:active:not(:disabled) {
  background-color: var(--color-gray-400);
}

.btn-outline {
  border: 1px solid var(--color-gray-300);
  color: var(--color-gray-700);
  background-color: transparent;
}

.btn-outline:hover:not(:disabled) {
  background-color: var(--color-gray-100);
}

.btn-outline:active:not(:disabled) {
  background-color: var(--color-gray-200);
}

.btn-ghost {
  color: var(--color-gray-700);
  background-color: transparent;
}

.btn-ghost:hover:not(:disabled) {
  background-color: var(--color-gray-100);
}

.btn-ghost:active:not(:disabled) {
  background-color: var(--color-gray-200);
}

.btn-link {
  color: var(--color-primary-600);
  background-color: transparent;
  padding: 0;
  text-decoration: underline;
}

.btn-link:hover:not(:disabled) {
  color: var(--color-primary-700);
}

.btn-loading {
  position: relative;
  color: transparent;
}

.btn-loading::after {
  content: '';
  position: absolute;
  width: 1rem;
  height: 1rem;
  border-radius: 50%;
  border: 2px solid currentColor;
  border-right-color: transparent;
  animation: spin 0.75s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* 表单样式 */
.form-label {
  display: block;
  margin-bottom: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-gray-700);
}

.form-input,
.form-select,
.form-textarea {
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-gray-300);
  border-radius: 0.375rem;
  background-color: white;
  font-size: 0.875rem;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.form-input:focus,
.form-select:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary-400);
  box-shadow: 0 0 0 3px rgba(14, 165, 233, 0.15);
}

.form-input:disabled,
.form-select:disabled,
.form-textarea:disabled {
  background-color: var(--color-gray-100);
  cursor: not-allowed;
}

.form-input.error,
.form-select.error,
.form-textarea.error {
  border-color: var(--color-error-500);
}

.form-input.error:focus,
.form-select.error:focus,
.form-textarea.error:focus {
  box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.15);
}

.form-input.success,
.form-select.success,
.form-textarea.success {
  border-color: var(--color-success-500);
}

.form-input.success:focus,
.form-select.success:focus,
.form-textarea.success:focus {
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.15);
}

.form-error {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: var(--color-error-500);
}

.form-success {
  margin-top: 0.25rem;
  font-size: 0.75rem;
  color: var(--color-success-500);
}

.form-checkbox-wrapper,
.form-radio-wrapper {
  display: flex;
  align-items: center;
}

.form-checkbox,
.form-radio {
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  cursor: pointer;
}

.form-checkbox:disabled,
.form-radio:disabled {
  cursor: not-allowed;
}

.form-checkbox-label,
.form-radio-label {
  font-size: 0.875rem;
  cursor: pointer;
}

.form-checkbox:disabled + .form-checkbox-label,
.form-radio:disabled + .form-radio-label {
  color: var(--color-gray-400);
  cursor: not-allowed;
}

/* 卡片样式 */
.card {
  background-color: white;
  border-radius: 0.5rem;
  box-shadow:
    0 1px 3px 0 rgba(0, 0, 0, 0.1),
    0 1px 2px 0 rgba(0, 0, 0, 0.06);
  overflow: hidden;
}

.card-img {
  width: 100%;
  object-fit: cover;
}

.card-body {
  padding: 1.5rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: var(--color-gray-900);
}

.card-text {
  color: var(--color-gray-600);
  margin-bottom: 1rem;
}

.card-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

/* 提示样式 */
.alert {
  display: flex;
  align-items: center;
  padding: 1rem;
  border-radius: 0.375rem;
  font-size: 0.875rem;
}

.alert-info {
  background-color: var(--color-info-50);
  color: var(--color-info-700);
}

.alert-success {
  background-color: var(--color-success-50);
  color: var(--color-success-700);
}

.alert-warning {
  background-color: var(--color-warning-50);
  color: var(--color-warning-700);
}

.alert-error {
  background-color: var(--color-error-50);
  color: var(--color-error-700);
}
</style>
