<script setup>

import { ref, onMounted } from 'vue'
import chatChannel from '@/websocket/chat_channel'

const message = ref('')
const messages = ref([])

onMounted(() => {
  chatChannel.received = (data) => {
    messages.value.push(data.message)
  }
})

const sendMessage = () => {
  if (message.value.trim() === '') return
  chatChannel.speak(message.value)
  message.value = ''
}
</script>

<template>
  <div>
    <input v-model="message" @keyup.enter="sendMessage" placeholder="Type your message here">
    <ul>
      <li v-for="msg in messages" :key="msg">{{ msg }}</li>
    </ul>
  </div>
</template>
