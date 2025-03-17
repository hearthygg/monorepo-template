<template>
  <div class="ai-container">
    <div class="chat-window">
      <div v-for="(message, index) in messages" :key="index" class="message-item">
        <div :class="['message-content', message.type === 'user' ? 'user' : 'ai']">
          {{ message.content }}
        </div>
      </div>
    </div>
    <div class="input-area">
      <el-input v-model="userInput" placeholder="输入您的问题..." @keyup.enter="sendQuery" />
      <el-button type="primary" @click="sendQuery">发送</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const messages = ref([]);
const userInput = ref('');
const QWEN_API_URL = 'https://api.qwen.aliyun.com/v1/chat/completions'; // 需替换为实际API地址

const sendQuery = async () => {
  const userMessage = { type: 'user', content: userInput.value };
  messages.value.push(userMessage);

  try {
    const response = await axios.post(
      QWEN_API_URL,
      {
        messages: [{ role: 'user', content: userInput.value }],
        model: 'qwq' // 指定模型
      },
      {
        headers: {
          // 'Authorization': `Bearer ${process.env.VUE_APP_QWEN_API_KEY}` // 需配置环境变量
          Authorization: `111` // 需配置环境变量
        }
      }
    );

    const aiResponse = response.data.choices[0].message;
    messages.value.push({ type: 'ai', content: aiResponse.content });
  } catch (error) {
    console.error('AI 请求失败:', error);
    messages.value.push({ type: 'ai', content: '系统错误，请重试' });
  }
};
</script>
