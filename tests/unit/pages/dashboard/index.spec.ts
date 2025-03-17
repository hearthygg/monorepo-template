// tests/unit/pages/dashboard/index.spec.ts
import { describe, it, expect } from 'vitest';
import { shallowMount } from '@vue/test-utils';
import Index from '@/pages/dashboard/index.vue';

describe('Index.vue', () => {
  it('should display the correct current date', () => {
    const wrapper = shallowMount(Index);
    const currentDateElement = wrapper.find('.mb-6 p'); // 根据模板结构选择元素
    const currentDate = new Date().toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long'
    });
    expect(currentDateElement.text()).toContain(currentDate);
  });

  it('should have 4 statistics cards', () => {
    const wrapper = shallowMount(Index);
    const statCards = wrapper.findAll('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 .bg-white');
    expect(statCards.length).toBe(4);
  });

  it('should display the correct statistics values', () => {
    const wrapper = shallowMount(Index);
    const statValues = wrapper.findAll('.grid.grid-cols-1.md\\:grid-cols-2.lg\\:grid-cols-4 .bg-white .text-2xl.font-semibold.text-gray-900');
    expect(statValues[0].text()).toBe('256');
    expect(statValues[1].text()).toBe('128');
    expect(statValues[2].text()).toBe('64');
    expect(statValues[3].text()).toBe('16');
  });

  it('should display the correct pending experiments', () => {
    const wrapper = shallowMount(Index);
    const pendingExperiments = wrapper.findAll('.bg-white.rounded-lg.shadow.p-6 .p-3.border.border-gray-200.rounded-md');
    expect(pendingExperiments.length).toBe(4);
    expect(pendingExperiments[0].text()).toContain('药物A临床试验');
    expect(pendingExperiments[1].text()).toContain('新材料强度测试');
    expect(pendingExperiments[2].text()).toContain('环境污染物分析');
    expect(pendingExperiments[3].text()).toContain('食品安全检测');
  });

  it('should display the correct recent experiments', () => {
    const wrapper = shallowMount(Index);
    const recentExperiments = wrapper.findAll('.bg-white.rounded-lg.shadow.overflow-hidden table tbody tr');
    expect(recentExperiments.length).toBe(6); // 包含表头和 5 行数据
    expect(recentExperiments[1].text()).toContain('药物A临床试验');
    expect(recentExperiments[2].text()).toContain('新材料强度测试');
    expect(recentExperiments[3].text()).toContain('环境污染物分析');
    expect(recentExperiments[4].text()).toContain('食品安全检测');
    expect(recentExperiments[5].text()).toContain('生物样本分析');
  });
});
