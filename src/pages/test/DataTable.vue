<template>
  <div class="overflow-x-auto">
    <table class="min-w-full border-collapse">
      <thead>
        <tr>
          <th v-for="(header, index) in headers" :key="index" class="bg-gray-100 border border-gray-300 px-4 py-3 text-center text-sm font-medium text-gray-700">
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(row, rowIndex) in data" :key="rowIndex">
          <td v-for="(cell, cellIndex) in row" :key="cellIndex" :class="['border border-gray-300 px-4 py-3 text-center', isNegative(cell) && highlightNegative ? 'text-red-500 font-medium' : '']">
            {{ cell }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { defineProps } from 'vue';

defineProps({
  headers: {
    type: Array,
    required: true
  },
  data: {
    type: Array,
    required: true
  },
  highlightNegative: {
    type: Boolean,
    default: false
  }
});

const isNegative = cell => {
  return cell.includes('<') || cell.includes('>0');
};
</script>
