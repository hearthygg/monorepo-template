<template>
  <div class="p-8 bg-gray-50 min-h-screen">
    <h1 class="text-3xl font-bold mb-8 text-gray-900">Ant Design 风格的 Element Plus 组件</h1>

    <!-- 表格示例 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">表格组件</h2>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <p class="text-gray-700 mb-6">下面是经过样式调整后的表格组件，更接近 Ant Design 的简洁风格。</p>

        <div class="ant-style-table">
          <el-table :data="tableData" style="width: 100%" :header-cell-style="{ background: '#fafafa' }" :border="false" :stripe="true">
            <el-table-column prop="date" label="日期" width="180"></el-table-column>
            <el-table-column prop="name" label="姓名" width="180"></el-table-column>
            <el-table-column prop="address" label="地址"></el-table-column>
            <el-table-column label="操作" width="200">
              <template #default>
                <el-button type="primary" size="small" text>查看</el-button>
                <el-button type="primary" size="small" text>编辑</el-button>
                <el-button type="danger" size="small" text>删除</el-button>
              </template>
            </el-table-column>
          </el-table>

          <div class="flex justify-end mt-4">
            <el-pagination background layout="prev, pager, next" :total="50" class="ant-style-pagination"></el-pagination>
          </div>
        </div>

        <div class="mt-6 bg-gray-100 p-4 rounded">
          <h3 class="text-sm font-medium mb-2 text-gray-700">使用方法：</h3>
          <pre class="text-sm overflow-x-auto">
&lt;div class="ant-style-table"&gt;
  &lt;el-table
    :data="tableData"
    style="width: 100%"
    :header-cell-style="{ background: '#fafafa' }"
    :border="false"
    :stripe="true"
  &gt;
    &lt;el-table-column prop="date" label="日期" width="180"&gt;&lt;/el-table-column&gt;
    &lt;el-table-column prop="name" label="姓名" width="180"&gt;&lt;/el-table-column&gt;
    &lt;el-table-column prop="address" label="地址"&gt;&lt;/el-table-column&gt;
    &lt;el-table-column label="操作" width="200"&gt;
      &lt;template #default&gt;
        &lt;el-button type="primary" size="small" text&gt;查看&lt;/el-button&gt;
        &lt;el-button type="primary" size="small" text&gt;编辑&lt;/el-button&gt;
        &lt;el-button type="danger" size="small" text&gt;删除&lt;/el-button&gt;
      &lt;/template&gt;
    &lt;/el-table-column&gt;
  &lt;/el-table&gt;
  
  &lt;div class="flex justify-end mt-4"&gt;
    &lt;el-pagination
      background
      layout="prev, pager, next"
      :total="50"
      class="ant-style-pagination"
    &gt;&lt;/el-pagination&gt;
  &lt;/div&gt;
&lt;/div&gt;
          </pre>
        </div>
      </div>
    </section>

    <!-- 弹窗示例 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">弹窗组件</h2>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <p class="text-gray-700 mb-6">下面是经过样式调整后的弹窗组件，更接近 Ant Design 的简洁风格。</p>

        <div class="space-x-4">
          <el-button type="primary" @click="dialogVisible = true">打开对话框</el-button>
          <el-button type="primary" @click="openMessageBox">打开确认框</el-button>
        </div>

        <div class="ant-style-dialog">
          <el-dialog v-model="dialogVisible" title="Ant Design 风格对话框" width="500px" destroy-on-close>
            <div class="p-2">
              <p>这是一个模仿 Ant Design 风格的对话框内容。</p>
              <p class="mt-2">您可以在这里放置表单或其他内容。</p>

              <div class="mt-4">
                <el-form :model="form" label-width="100px">
                  <el-form-item label="活动名称">
                    <el-input v-model="form.name" placeholder="请输入活动名称"></el-input>
                  </el-form-item>
                  <el-form-item label="活动区域">
                    <el-select v-model="form.region" placeholder="请选择活动区域" class="w-full">
                      <el-option label="区域一" value="shanghai"></el-option>
                      <el-option label="区域二" value="beijing"></el-option>
                    </el-select>
                  </el-form-item>
                </el-form>
              </div>
            </div>
            <template #footer>
              <div class="dialog-footer">
                <el-button @click="dialogVisible = false">取消</el-button>
                <el-button type="primary" @click="dialogVisible = false">确认</el-button>
              </div>
            </template>
          </el-dialog>
        </div>

        <div class="mt-6 bg-gray-100 p-4 rounded">
          <h3 class="text-sm font-medium mb-2 text-gray-700">使用方法：</h3>
          <pre class="text-sm overflow-x-auto">
&lt;div class="ant-style-dialog"&gt;
  &lt;el-dialog
    v-model="dialogVisible"
    title="Ant Design 风格对话框"
    width="500px"
    destroy-on-close
  &gt;
    &lt;div class="p-2"&gt;
      &lt;p&gt;这是一个模仿 Ant Design 风格的对话框内容。&lt;/p&gt;
      &lt;p class="mt-2"&gt;您可以在这里放置表单或其他内容。&lt;/p&gt;
      
      &lt;div class="mt-4"&gt;
        &lt;el-form :model="form" label-width="100px"&gt;
          &lt;el-form-item label="活动名称"&gt;
            &lt;el-input v-model="form.name" placeholder="请输入活动名称"&gt;&lt;/el-input&gt;
          &lt;/el-form-item&gt;
          &lt;el-form-item label="活动区域"&gt;
            &lt;el-select v-model="form.region" placeholder="请选择活动区域" class="w-full"&gt;
              &lt;el-option label="区域一" value="shanghai"&gt;&lt;/el-option&gt;
              &lt;el-option label="区域二" value="beijing"&gt;&lt;/el-option&gt;
            &lt;/el-select&gt;
          &lt;/el-form-item&gt;
        &lt;/el-form&gt;
      &lt;/div&gt;
    &lt;/div&gt;
    &lt;template #footer&gt;
      &lt;div class="dialog-footer"&gt;
        &lt;el-button @click="dialogVisible = false"&gt;取消&lt;/el-button&gt;
        &lt;el-button type="primary" @click="dialogVisible = false"&gt;确认&lt;/el-button&gt;
      &lt;/div&gt;
    &lt;/template&gt;
  &lt;/el-dialog&gt;
&lt;/div&gt;
          </pre>
        </div>
      </div>
    </section>

    <!-- 卡片示例 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">卡片组件</h2>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <p class="text-gray-700 mb-6">下面是经过样式调整后的卡片组件，更接近 Ant Design 的简洁风格。</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- 基础卡片 -->
          <div class="ant-style-card">
            <el-card class="box-card">
              <template #header>
                <div class="flex justify-between items-center">
                  <span class="font-medium">卡片标题</span>
                  <el-button class="button" type="text">操作按钮</el-button>
                </div>
              </template>
              <div v-for="o in 4" :key="o" class="text-item mb-3 pb-3 border-b border-gray-100 last:border-0">
                {{ '列表内容 ' + o }}
              </div>
            </el-card>
          </div>

          <!-- 无边框卡片 -->
          <div class="ant-style-card">
            <el-card class="box-card" :body-style="{ padding: '20px' }" shadow="hover">
              <template #header>
                <div class="flex justify-between items-center">
                  <span class="font-medium">卡片标题</span>
                  <div>
                    <el-dropdown>
                      <span class="el-dropdown-link">
                        <el-icon class="el-icon--right">
                          <more />
                        </el-icon>
                      </span>
                      <template #dropdown>
                        <el-dropdown-menu>
                          <el-dropdown-item>查看</el-dropdown-item>
                          <el-dropdown-item>编辑</el-dropdown-item>
                          <el-dropdown-item>删除</el-dropdown-item>
                        </el-dropdown-menu>
                      </template>
                    </el-dropdown>
                  </div>
                </div>
              </template>
              <div class="flex items-center mb-4">
                <el-avatar :size="50" src="https://via.placeholder.com/150" class="mr-4"></el-avatar>
                <div>
                  <h4 class="text-lg font-medium">用户信息卡片</h4>
                  <p class="text-gray-500">这是一个用户信息展示卡片</p>
                </div>
              </div>
              <div class="space-y-2">
                <p><strong>用户名:</strong> admin</p>
                <p><strong>邮箱:</strong> admin@example.com</p>
                <p><strong>角色:</strong> 管理员</p>
              </div>
              <div class="mt-4 pt-4 border-t border-gray-100">
                <el-button type="primary" size="small">编辑资料</el-button>
                <el-button size="small">查看详情</el-button>
              </div>
            </el-card>
          </div>
        </div>

        <div class="mt-6 bg-gray-100 p-4 rounded">
          <h3 class="text-sm font-medium mb-2 text-gray-700">使用方法：</h3>
          <pre class="text-sm overflow-x-auto">
&lt;div class="ant-style-card"&gt;
  &lt;el-card class="box-card"&gt;
    &lt;template #header&gt;
      &lt;div class="flex justify-between items-center"&gt;
        &lt;span class="font-medium"&gt;卡片标题&lt;/span&gt;
        &lt;el-button class="button" type="text"&gt;操作按钮&lt;/el-button&gt;
      &lt;/div&gt;
    &lt;/template&gt;
    &lt;div v-for="o in 4" :key="o" class="text-item mb-3 pb-3 border-b border-gray-100 last:border-0"&gt;
      {{ '列表内容 ' + o }}
    &lt;/div&gt;
  &lt;/el-card&gt;
&lt;/div&gt;
          </pre>
        </div>
      </div>
    </section>

    <!-- 自定义样式代码 -->
    <section class="mb-12">
      <h2 class="text-xl font-semibold mb-4 text-gray-800">自定义样式代码</h2>
      <div class="bg-white p-6 rounded-lg shadow-sm">
        <p class="text-gray-700 mb-4">将以下CSS代码添加到你的项目中，以实现Ant Design风格的Element Plus组件。</p>

        <div class="bg-gray-100 p-4 rounded">
          <pre class="text-sm overflow-x-auto">
/* Ant Design 风格的 Element Plus 组件样式 */

/* 表格样式 */
.ant-style-table .el-table {
  --el-table-border-color: #f0f0f0;
  --el-table-header-bg-color: #fafafa;
  --el-table-row-hover-bg-color: #fafafa;
  --el-table-fixed-box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  overflow: hidden;
}

.ant-style-table .el-table th.el-table__cell {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  background-color: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.ant-style-table .el-table td.el-table__cell {
  border-bottom: 1px solid #f0f0f0;
}

.ant-style-table .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
  background-color: #fafafa;
}

.ant-style-table .el-table__body tr.hover-row > td.el-table__cell {
  background-color: #f5f5f5;
}

/* 分页样式 */
.ant-style-pagination .el-pagination.is-background .btn-prev,
.ant-style-pagination .el-pagination.is-background .btn-next,
.ant-style-pagination .el-pagination.is-background .el-pager li {
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  margin: 0 4px;
}

.ant-style-pagination .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #1890ff;
  border-color: #1890ff;
}

.ant-style-pagination .el-pagination.is-background .el-pager li:not(.disabled):hover {
  border-color: #1890ff;
  color: #1890ff;
}

/* 对话框��式 */
.ant-style-dialog .el-dialog {
  border-radius: 2px;
  box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.ant-style-dialog .el-dialog__header {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  margin-right: 0;
}

.ant-style-dialog .el-dialog__title {
  font-weight: 500;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
}

.ant-style-dialog .el-dialog__headerbtn {
  top: 16px;
  right: 20px;
}

.ant-style-dialog .el-dialog__body {
  padding: 24px;
  color: rgba(0, 0, 0, 0.65);
}

.ant-style-dialog .el-dialog__footer {
  padding: 10px 24px;
  border-top: 1px solid #f0f0f0;
  text-align: right;
}

.ant-style-dialog .dialog-footer .el-button {
  min-width: 80px;
}

/* 卡片样式 */
.ant-style-card .el-card {
  border-radius: 2px;
  border: 1px solid #f0f0f0;
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09);
}

.ant-style-card .el-card__header {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fff;
}

.ant-style-card .el-card__body {
  padding: 24px;
}

.ant-style-card .el-card.is-hover-shadow:hover {
  box-shadow: 0 1px 2px -2px rgba(0, 0, 0, 0.16), 0 3px 6px 0 rgba(0, 0, 0, 0.12), 0 5px 12px 4px rgba(0, 0, 0, 0.09);
}
          </pre>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue';
import { ElButton, ElTable, ElTableColumn, ElPagination, ElDialog, ElMessageBox, ElForm, ElFormItem, ElInput, ElSelect, ElOption, ElCard, ElAvatar, ElDropdown, ElDropdownMenu, ElDropdownItem, ElIcon } from 'element-plus';
import { More } from '@element-plus/icons-vue';

// 表格数据
const tableData = [
  {
    date: '2023-05-03',
    name: '张三',
    address: '北京市朝阳区芍药居'
  },
  {
    date: '2023-05-02',
    name: '李四',
    address: '上海市浦东新区金科路'
  },
  {
    date: '2023-05-01',
    name: '王五',
    address: '广州市天河区珠江新城'
  },
  {
    date: '2023-04-30',
    name: '赵六',
    address: '深圳市南山区科技园'
  }
];

// 对话框
const dialogVisible = ref(false);

// 表单数据
const form = reactive({
  name: '',
  region: ''
});

// 打开确认框
const openMessageBox = () => {
  ElMessageBox.confirm('此操作将永久删除该文件, 是否继续?', 'Ant Design 风格确认框', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning',
    customClass: 'ant-style-message-box'
  })
    .then(() => {
      ElMessageBox.alert('删除成功', '提示', {
        confirmButtonText: '确定',
        customClass: 'ant-style-message-box'
      });
    })
    .catch(() => {
      // 取消操作
    });
};
</script>

<style>
/* Ant Design 风格的 Element Plus 组件样式 */

/* 表格样式 */
.ant-style-table .el-table {
  --el-table-border-color: #f0f0f0;
  --el-table-header-bg-color: #fafafa;
  --el-table-row-hover-bg-color: #fafafa;
  --el-table-fixed-box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
  border-radius: 2px;
  overflow: hidden;
}

.ant-style-table .el-table th.el-table__cell {
  font-weight: 500;
  color: rgba(0, 0, 0, 0.85);
  background-color: #fafafa;
  border-bottom: 1px solid #f0f0f0;
}

.ant-style-table .el-table td.el-table__cell {
  border-bottom: 1px solid #f0f0f0;
}

.ant-style-table .el-table--striped .el-table__body tr.el-table__row--striped td.el-table__cell {
  background-color: #fafafa;
}

.ant-style-table .el-table__body tr.hover-row > td.el-table__cell {
  background-color: #f5f5f5;
}

/* 分页样式 */
.ant-style-pagination .el-pagination.is-background .btn-prev,
.ant-style-pagination .el-pagination.is-background .btn-next,
.ant-style-pagination .el-pagination.is-background .el-pager li {
  background-color: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 2px;
  margin: 0 4px;
}

.ant-style-pagination .el-pagination.is-background .el-pager li:not(.disabled).active {
  background-color: #1890ff;
  border-color: #1890ff;
}

.ant-style-pagination .el-pagination.is-background .el-pager li:not(.disabled):hover {
  border-color: #1890ff;
  color: #1890ff;
}

/* 对话框样式 */
.ant-style-dialog .el-dialog {
  border-radius: 2px;
  box-shadow:
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
  overflow: hidden;
}

.ant-style-dialog .el-dialog__header {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  margin-right: 0;
}

.ant-style-dialog .el-dialog__title {
  font-weight: 500;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
}

.ant-style-dialog .el-dialog__headerbtn {
  top: 16px;
  right: 20px;
}

.ant-style-dialog .el-dialog__body {
  padding: 24px;
  color: rgba(0, 0, 0, 0.65);
}

.ant-style-dialog .el-dialog__footer {
  padding: 10px 24px;
  border-top: 1px solid #f0f0f0;
  text-align: right;
}

.ant-style-dialog .dialog-footer .el-button {
  min-width: 80px;
}

/* 消息框样式 */
.ant-style-message-box.el-message-box {
  border-radius: 2px;
  box-shadow:
    0 3px 6px -4px rgba(0, 0, 0, 0.12),
    0 6px 16px 0 rgba(0, 0, 0, 0.08),
    0 9px 28px 8px rgba(0, 0, 0, 0.05);
  padding-bottom: 10px;
}

.ant-style-message-box .el-message-box__header {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.ant-style-message-box .el-message-box__title {
  font-weight: 500;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
}

.ant-style-message-box .el-message-box__content {
  padding: 24px;
  color: rgba(0, 0, 0, 0.65);
}

.ant-style-message-box .el-message-box__btns {
  padding: 10px 24px;
  border-top: 1px solid #f0f0f0;
}

.ant-style-message-box .el-message-box__btns .el-button {
  min-width: 80px;
}

/* 卡片样式 */
.ant-style-card .el-card {
  border-radius: 2px;
  border: 1px solid #f0f0f0;
  box-shadow:
    0 1px 2px -2px rgba(0, 0, 0, 0.16),
    0 3px 6px 0 rgba(0, 0, 0, 0.12),
    0 5px 12px 4px rgba(0, 0, 0, 0.09);
}

.ant-style-card .el-card__header {
  padding: 16px 24px;
  border-bottom: 1px solid #f0f0f0;
  background-color: #fff;
}

.ant-style-card .el-card__body {
  padding: 24px;
}

.ant-style-card .el-card.is-hover-shadow:hover {
  box-shadow:
    0 1px 2px -2px rgba(0, 0, 0, 0.16),
    0 3px 6px 0 rgba(0, 0, 0, 0.12),
    0 5px 12px 4px rgba(0, 0, 0, 0.09);
}

.text-item {
  margin-bottom: 10px;
}
</style>
