<script setup>

import { ref, onMounted } from 'vue'

const message = ref('')
const messages = ref([])


</script>

<template>
  <div>
    <input v-model="message" @keyup.enter="sendMessage" placeholder="Type your message here">
    <ul>
      <li v-for="msg in messages" :key="msg">{{ msg }}</li>
    </ul>
  </div>
</template>
