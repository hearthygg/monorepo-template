<template>
  <div class="min-h-screen bg-gray-50">
    <!-- 顶部导航栏 -->
    <header class="bg-white shadow-sm">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <BeakerIcon class="h-8 w-8 text-blue-600" />
            <h1 class="ml-2 text-xl font-bold text-gray-900">实验管理系统</h1>
          </div>
          <div class="flex items-center">
            <button class="p-1 rounded-full text-gray-500 hover:text-gray-700 focus:outline-none">
              <BellIcon class="h-6 w-6" />
            </button>
            <div class="ml-4 relative">
              <div class="flex items-center">
                <!-- <img class="h-8 w-8 rounded-full" src="/placeholder.svg?height=32&width=32" alt="用户头像" /> -->
                <span class="ml-2 text-sm font-medium text-gray-700">管理员</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- 主要内容 -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <!-- 欢迎信息 -->
      <div class="mb-6">
        <h2 class="text-2xl font-bold text-gray-900">欢迎回来，管理员</h2>
        <p class="text-gray-600">{{ currentDate }}</p>
      </div>

      <!-- 统计卡片 -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div v-for="(stat, index) in statistics" :key="index" class="bg-white rounded-lg shadow p-6 flex items-center">
          <div :class="`p-3 rounded-full ${stat.bgColor}`">
            <component :is="stat.icon" class="h-6 w-6 text-white" />
          </div>
          <div class="ml-4">
            <p class="text-sm font-medium text-gray-600">{{ stat.title }}</p>
            <p class="text-2xl font-semibold text-gray-900">{{ stat.value }}</p>
            <p class="text-sm text-gray-500">
              <span :class="stat.trend === '上升' ? 'text-green-600' : 'text-red-600'"> {{ stat.trend === '上升' ? '↑' : '↓' }} {{ stat.percentage }} </span>
              相比上月
            </p>
          </div>
        </div>
      </div>

      <!-- 图表和列表区域 -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <!-- 实验状态图表 -->
        <div class="bg-white rounded-lg shadow p-6 lg:col-span-2">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">实验状态分布</h3>
            <div class="flex space-x-2">
              <button
                v-for="period in ['周', '月', '年']"
                :key="period"
                :class="`px-3 py-1 text-sm rounded-md ${selectedPeriod === period ? 'bg-blue-100 text-blue-600' : 'text-gray-600 hover:bg-gray-100'}`"
                @click="selectedPeriod = period"
              >
                {{ period }}
              </button>
            </div>
          </div>
          <div class="h-64 flex items-center justify-center">
            <div ref="chartContainer" class="w-full h-full"></div>
          </div>
        </div>

        <!-- 待处理实验 -->
        <div class="bg-white rounded-lg shadow p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium text-gray-900">待处理实验</h3>
            <button class="text-sm text-blue-600 hover:text-blue-800">查看全部</button>
          </div>
          <div class="space-y-4">
            <div v-for="(experiment, index) in pendingExperiments" :key="index" class="p-3 border border-gray-200 rounded-md hover:bg-gray-50">
              <div class="flex justify-between items-start">
                <div>
                  <p class="font-medium text-gray-900">{{ experiment.name }}</p>
                  <p class="text-sm text-gray-500">{{ experiment.date }}</p>
                </div>
                <span :class="`px-2 py-1 text-xs rounded-full ${statusColors[experiment.status]}`">
                  {{ experiment.status }}
                </span>
              </div>
              <div class="mt-2 flex justify-between items-center">
                <div class="flex items-center text-sm text-gray-500">
                  <UserIcon class="h-4 w-4 mr-1" />
                  <span>{{ experiment.researcher }}</span>
                </div>
                <button class="text-sm text-blue-600 hover:text-blue-800">处理</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- 最近实验列表 -->
      <div class="bg-white rounded-lg shadow overflow-hidden">
        <div class="px-6 py-4 border-b border-gray-200">
          <h3 class="text-lg font-medium text-gray-900">最近实验</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">实验名称</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">负责人</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">开始日期</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">状态</th>
                <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">进度</th>
                <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">操作</th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="(experiment, index) in recentExperiments" :key="index" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900">{{ experiment.name }}</div>
                  <div class="text-sm text-gray-500">{{ experiment.id }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="flex items-center">
                    <!-- <img class="h-8 w-8 rounded-full" :src="experiment.avatar || '/placeholder.svg?height=32&width=32'" alt="" /> -->
                    <div class="ml-2">
                      <div class="text-sm font-medium text-gray-900">{{ experiment.researcher }}</div>
                      <div class="text-sm text-gray-500">{{ experiment.department }}</div>
                    </div>
                  </div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ experiment.date }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="`px-2 py-1 text-xs rounded-full ${statusColors[experiment.status]}`">
                    {{ experiment.status }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="w-full bg-gray-200 rounded-full h-2.5">
                    <div class="bg-blue-600 h-2.5 rounded-full" :style="`width: ${experiment.progress}%`"></div>
                  </div>
                  <span class="text-xs text-gray-500">{{ experiment.progress }}%</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button class="text-blue-600 hover:text-blue-900 mr-3">查看</button>
                  <button class="text-gray-600 hover:text-gray-900">编辑</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="px-6 py-3 flex justify-between items-center bg-gray-50 border-t border-gray-200">
          <div class="text-sm text-gray-700">
            显示 <span class="font-medium">1</span> 到 <span class="font-medium">5</span> 共 <span class="font-medium">{{ totalExperiments }}</span> 条记录
          </div>
          <div class="flex space-x-2">
            <button class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">上一页</button>
            <button class="px-3 py-1 border border-gray-300 rounded-md text-sm text-gray-700 hover:bg-gray-50">下一页</button>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { Beaker as BeakerIcon, Bell as BellIcon, User as UserIcon, CheckCircle as CheckCircleIcon, Clock as ClockIcon, AlertTriangle as AlertTriangleIcon } from 'lucide-vue-next';

// 当前日期
const currentDate = computed(() => {
  const now = new Date();
  return now.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    weekday: 'long'
  });
});

// 统计数据
const statistics = ref([
  {
    title: '总实验数',
    value: '256',
    trend: '上升',
    percentage: '12%',
    icon: ClockIcon,
    bgColor: 'bg-blue-500'
  },
  {
    title: '已完成实验',
    value: '128',
    trend: '上升',
    percentage: '8%',
    icon: CheckCircleIcon,
    bgColor: 'bg-green-500'
  },
  {
    title: '进行中实验',
    value: '64',
    trend: '下降',
    percentage: '3%',
    icon: ClockIcon,
    bgColor: 'bg-yellow-500'
  },
  {
    title: '异常实验',
    value: '16',
    trend: '上升',
    percentage: '5%',
    icon: AlertTriangleIcon,
    bgColor: 'bg-red-500'
  }
]);

// 状态颜色映射
const statusColors = {
  已完成: 'bg-green-100 text-green-800',
  进行中: 'bg-blue-100 text-blue-800',
  待审批: 'bg-yellow-100 text-yellow-800',
  已暂停: 'bg-gray-100 text-gray-800',
  异常: 'bg-red-100 text-red-800'
};

// 待处理实验
const pendingExperiments = ref([
  { name: '药物A临床试验', date: '2023-10-15', status: '待审批', researcher: '张医生' },
  { name: '新材料强度测试', date: '2023-10-14', status: '异常', researcher: '李工程师' },
  { name: '环境污染物分析', date: '2023-10-13', status: '待审批', researcher: '王研究员' },
  { name: '食品安全检测', date: '2023-10-12', status: '待审批', researcher: '刘技术员' }
]);

// 最近实验
const recentExperiments = ref([
  {
    id: 'EXP-2023-001',
    name: '药物A临床试验',
    researcher: '张医生',
    department: '医学部',
    date: '2023-10-15',
    status: '进行中',
    progress: 75,
    avatar: '/placeholder.svg?height=32&width=32'
  },
  {
    id: 'EXP-2023-002',
    name: '新材料强度测试',
    researcher: '李工程师',
    department: '工程部',
    date: '2023-10-10',
    status: '异常',
    progress: 45,
    avatar: '/placeholder.svg?height=32&width=32'
  },
  {
    id: 'EXP-2023-003',
    name: '环境污染物分析',
    researcher: '王研究员',
    department: '环境科学部',
    date: '2023-10-05',
    status: '已完成',
    progress: 100,
    avatar: '/placeholder.svg?height=32&width=32'
  },
  {
    id: 'EXP-2023-004',
    name: '食品安全检测',
    researcher: '刘技术员',
    department: '食品安全部',
    date: '2023-09-28',
    status: '已完成',
    progress: 100,
    avatar: '/placeholder.svg?height=32&width=32'
  },
  {
    id: 'EXP-2023-005',
    name: '生物样本分析',
    researcher: '陈博士',
    department: '生物技术部',
    date: '2023-09-20',
    status: '已暂停',
    progress: 60,
    avatar: '/placeholder.svg?height=32&width=32'
  }
]);

const totalExperiments = ref(28);
const selectedPeriod = ref('月');
const chartContainer = ref(null);

onMounted(() => {
  // 这里可以添加图表初始化代码
  // 例如使用 ECharts 或其他图表库
  if (window.echarts && chartContainer.value) {
    const chart = window.echarts.init(chartContainer.value);
    chart.setOption({
      tooltip: {
        trigger: 'item'
      },
      legend: {
        orient: 'vertical',
        left: 'left'
      },
      series: [
        {
          name: '实验状态',
          type: 'pie',
          radius: '60%',
          data: [
            { value: 128, name: '已完成' },
            { value: 64, name: '进行中' },
            { value: 48, name: '待审批' },
            { value: 16, name: '异常' }
          ],
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]
    });

    // 窗口大小变化时重新调整图表大小
    window.addEventListener('resize', () => {
      chart.resize();
    });
  }
});
</script>
