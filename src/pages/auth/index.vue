<script setup lang="ts">
import { ref, reactive } from 'vue';
import { ElMessage } from 'element-plus';
import { useUserStore } from '@/stores/user';
import { useRoute, useRouter } from 'vue-router';

const activeTab = ref<'login' | 'register'>('login');
const userStore = useUserStore();
const router = useRouter();
const route = useRoute();
// 登录表单数据和校验
const loginForm = reactive({
  // email: '',
  username: '',
  password: '',
  remember: false
});
const loginRules = {
  // email: [
  //   { required: true, message: '请输入邮箱地址', trigger: 'blur' },
  //   { type: 'email' as const, message: '邮箱格式不正确', trigger: ['blur', 'change'] }
  // ],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
};
const loginFormRef = ref();

// 注册表单数据和校验
const registerForm = reactive({
  // email: '',
  username: '',
  password: '',
  confirmPassword: ''
});
const registerRules = {
  // email: [
  //   { required: true, message: '请输入邮箱地址', trigger: 'blur' },
  //   { type: 'email' as const, message: '邮箱格式不正确', trigger: ['blur', 'change'] }
  // ],
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  confirmPassword: [
    { required: true, message: '请再次输入密码', trigger: 'blur' },
    {
      validator: (rule: any, value: string, callback: any) => {
        if (value !== registerForm.password) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
      trigger: 'blur'
    }
  ]
};
const registerFormRef = ref();

// 登录处理
const handleLogin = () => {
  loginFormRef.value.validate((valid: boolean) => {
    if (valid) {
      userStore
        .login({
          username: loginForm.username,
          password: loginForm.password
        })
        .then(() => {
          ElMessage.success('登录成功');
          const redirect = route.query.redirect as string;
          // 登录成功后跳转
          router.push(redirect || '/');
        });
    }
  });
};

// 注册处理
const handleRegister = () => {
  registerFormRef.value.validate((valid: boolean) => {
    if (valid) {
      // TODO: 调用注册API
      ElMessage.success('注册成功（模拟）');
    }
  });
};
</script>

<template>
  <div class="flex min-h-screen">
    <!-- 左侧插画与品牌 -->
    <div class="flex-1 bg-blue-50 flex flex-col items-center justify-center p-10">
      <div class="absolute top-4 left-4 flex items-center">
        <img src="@/assets/images/logo.png" alt="ShareFile Logo" class="w-10 h-10 mr-3" />
        <span class="text-2xl font-bold text-blue-700">ShareFile</span>
      </div>
      <div class="mb-8">
        <img src="@/assets/images/login-illustration.png" alt="illustration" class="max-w-md w-full animate-float" />
      </div>
      <div class="absolute bottom-4 left-4 text-gray-400 text-sm">© 2025 ShareFile. 高效协作的云端文件管理平台</div>
    </div>
    <!-- 右侧表单卡片 -->
    <div class="flex-1 flex items-center justify-center bg-white">
      <transition name="fade-slide" appear>
        <div key="auth-card" class="w-full max-w-[500px] bg-white rounded-xl shadow-lg p-10 animate-fade-in">
          <h2 class="mb-2 text-2xl font-semibold">欢迎回来</h2>
          <div class="text-gray-500 mb-6">请登录您的账户以继续</div>
          <div class="flex mb-6 auth-tab py-2">
            <el-radio-group v-model="activeTab" class="w-full">
              <el-radio-button size="large" label="login" class="flex-1">登录</el-radio-button>
              <el-radio-button size="large" label="register" class="flex-1">注册</el-radio-button>
            </el-radio-group>
          </div>
          <transition name="fade-slide" mode="out-in">
            <el-form v-if="activeTab === 'login'" ref="loginFormRef" key="login" :model="loginForm" :rules="loginRules" label-position="top" @submit.prevent>
              <!-- <el-form-item label="邮箱地址" prop="email">
                <el-input v-model="loginForm.email" size="large" placeholder="请输入邮箱地址" clearable class="transition focus:ring-2 focus:ring-blue-400" />
              </el-form-item> -->
              <el-form-item label="用户名" prop="username">
                <el-input v-model="loginForm.username" size="large" placeholder="请输入用户名" clearable class="transition focus:ring-2 focus:ring-blue-400" />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="loginForm.password" size="large" type="password" placeholder="请输入密码" show-password clearable class="transition focus:ring-2 focus:ring-blue-400" />
              </el-form-item>
              <div class="flex justify-between items-center mb-4">
                <el-checkbox v-model="loginForm.remember" size="large">记住我</el-checkbox>
                <a href="#" class="text-blue-600 text-sm hover:underline">忘记密码?</a>
              </div>
              <el-form-item>
                <el-button size="large" type="primary" class="w-full transition active:scale-95" @click="handleLogin">登录</el-button>
              </el-form-item>
            </el-form>
            <el-form v-else ref="registerFormRef" key="register" :model="registerForm" :rules="registerRules" label-position="top" @submit.prevent>
              <!-- <el-form-item label="邮箱地址" prop="email">
                <el-input v-model="registerForm.email" size="large" placeholder="请输入邮箱地址" clearable class="transition focus:ring-2 focus:ring-blue-400" />
              </el-form-item> -->
              <el-form-item label="用户名" prop="username">
                <el-input v-model="registerForm.username" size="large" placeholder="请输入用户名" clearable class="transition focus:ring-2 focus:ring-blue-400" />
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="registerForm.password" size="large" type="password" placeholder="请输入密码" show-password clearable class="transition focus:ring-2 focus:ring-blue-400" />
              </el-form-item>
              <el-form-item label="确认密码" prop="confirmPassword">
                <el-input v-model="registerForm.confirmPassword" size="large" type="password" placeholder="请再次输入密码" show-password clearable class="transition focus:ring-2 focus:ring-blue-400" />
              </el-form-item>
              <el-form-item>
                <el-button size="large" type="primary" class="w-full transition active:scale-95" @click="handleRegister">注册</el-button>
              </el-form-item>
            </el-form>
          </transition>
        </div>
      </transition>
    </div>
  </div>
</template>
<style lang="scss">
.auth-tab {
  .el-radio-button__inner {
    width: 100%;
  }
}
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(16px);
}
.fade-slide-enter-to,
.fade-slide-leave-from {
  opacity: 1;
  transform: translateY(0);
}
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(32px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-fade-in {
  animation: fade-in 0.6s cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes float {
  0% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
  100% {
    transform: translateY(0px);
  }
}

.animate-float {
  animation: float 3s ease-in-out infinite;
  animation-delay: 0.5s;
}
</style>
