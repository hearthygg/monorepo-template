<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-8">
    <div class="max-w-7xl mx-auto space-y-6">
      <!-- 总览卡片 -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div class="bg-blue-50 rounded-lg p-4">
            <h3 class="text-sm font-medium text-blue-600">总成绩</h3>
            <p class="text-3xl font-bold text-blue-700">{{ score }}</p>
          </div>
          <div class="bg-green-50 rounded-lg p-4">
            <h3 class="text-sm font-medium text-green-600">重新下载次数</h3>
            <p class="text-3xl font-bold text-green-700">{{ downloadCount }}</p>
          </div>
          <div class="bg-yellow-50 rounded-lg p-4">
            <h3 class="text-sm font-medium text-yellow-600">连线错误</h3>
            <p class="text-3xl font-bold text-yellow-700">{{ connectionErrors }}</p>
          </div>
          <div class="bg-purple-50 rounded-lg p-4">
            <h3 class="text-sm font-medium text-purple-600">识别错误</h3>
            <p class="text-3xl font-bold text-purple-700">{{ identificationErrors }}</p>
          </div>
        </div>
      </div>

      <!-- 图表区域 -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <!-- 饼图 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold mb-4">色块识别分布</h2>
          <div class="h-80">
            <v-chart class="w-full h-full" :option="pieOption" autoresize />
          </div>
        </div>

        <!-- 柱状图 -->
        <div class="bg-white rounded-lg shadow-md p-6">
          <h2 class="text-lg font-semibold mb-4">错误分析</h2>
          <div class="h-80">
            <v-chart class="w-full h-full" :option="barOption" autoresize />
          </div>
        </div>
      </div>

      <!-- 详细报告 -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <h2 class="text-lg font-semibold mb-4">详细报告</h2>
        <div class="space-y-4">
          <div class="border-l-4 border-blue-500 pl-4">
            <h3 class="font-medium text-gray-900">成绩评估</h3>
            <p class="text-gray-600">总成绩为 {{ score }} 分，{{ getScoreEvaluation() }}</p>
          </div>

          <div class="border-l-4 border-green-500 pl-4">
            <h3 class="font-medium text-gray-900">下载情况</h3>
            <p class="text-gray-600">重新下载次数为 {{ downloadCount }} 次，表现{{ getDownloadEvaluation() }}</p>
          </div>

          <div class="border-l-4 border-yellow-500 pl-4">
            <h3 class="font-medium text-gray-900">连线错误分析</h3>
            <ul class="list-disc list-inside text-gray-600">
              <li>电源接地次数：{{ groundingErrors }} 次</li>
              <li>PLC 输入和输出相连：{{ plcErrors }} 次</li>
            </ul>
          </div>

          <div class="border-l-4 border-purple-500 pl-4">
            <h3 class="font-medium text-gray-900">色块识别分析</h3>
            <ul class="list-disc list-inside text-gray-600">
              <li>绿色：{{ greenBlocks }} 次</li>
              <li>正确：{{ correctBlocks }} 次</li>
              <li>黄色：{{ yellowBlocks }} 次</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { PieChart, BarChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent, GridComponent } from 'echarts/components';
import VChart from 'vue-echarts';
import { ref } from 'vue';

use([CanvasRenderer, PieChart, BarChart, TitleComponent, TooltipComponent, LegendComponent, GridComponent]);

// 数据
const score = ref(70);
const downloadCount = ref(1);
const groundingErrors = ref(1);
const plcErrors = ref(0);
const greenBlocks = ref(6);
const correctBlocks = ref(0);
const yellowBlocks = ref(5);

// 计算总错误
const connectionErrors = ref(groundingErrors.value + plcErrors.value);
const identificationErrors = ref(greenBlocks.value + correctBlocks.value + yellowBlocks.value);

// 饼图配置
const pieOption = {
  tooltip: {
    trigger: 'item',
    formatter: '{a} <br/>{b}: {c} ({d}%)'
  },
  legend: {
    orient: 'vertical',
    left: 'left'
  },
  series: [
    {
      name: '色块识别',
      type: 'pie',
      radius: ['50%', '70%'],
      avoidLabelOverlap: false,
      itemStyle: {
        borderRadius: 10,
        borderColor: '#fff',
        borderWidth: 2
      },
      label: {
        show: false,
        position: 'center'
      },
      emphasis: {
        label: {
          show: true,
          fontSize: '20',
          fontWeight: 'bold'
        }
      },
      labelLine: {
        show: false
      },
      data: [
        { value: greenBlocks.value, name: '绿色', itemStyle: { color: '#10B981' } },
        { value: correctBlocks.value, name: '正确', itemStyle: { color: '#2563EB' } },
        { value: yellowBlocks.value, name: '黄色', itemStyle: { color: '#FBBF24' } }
      ]
    }
  ]
};

// 柱状图配置
const barOption = {
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow'
    }
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: {
    type: 'category',
    data: ['电源接地', 'PLC错误', '绿色块', '正确块', '黄色块'],
    axisLabel: {
      interval: 0,
      rotate: 30
    }
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '错误次数',
      type: 'bar',
      data: [
        {
          value: groundingErrors.value,
          itemStyle: { color: '#EF4444' }
        },
        {
          value: plcErrors.value,
          itemStyle: { color: '#F59E0B' }
        },
        {
          value: greenBlocks.value,
          itemStyle: { color: '#10B981' }
        },
        {
          value: correctBlocks.value,
          itemStyle: { color: '#2563EB' }
        },
        {
          value: yellowBlocks.value,
          itemStyle: { color: '#FBBF24' }
        }
      ],
      itemStyle: {
        borderRadius: [8, 8, 0, 0]
      }
    }
  ]
};

// 评估函数
const getScoreEvaluation = () => {
  if (score.value >= 90) return '表现优秀';
  if (score.value >= 80) return '表现良好';
  if (score.value >= 70) return '表现一般';
  if (score.value >= 60) return '刚好及格';
  return '需要改进';
};

const getDownloadEvaluation = () => {
  if (downloadCount.value <= 1) return '良好';
  if (downloadCount.value <= 3) return '一般';
  return '需要改进';
};
</script>

<style>
.v-chart {
  width: 100%;
  height: 100%;
}
</style>
