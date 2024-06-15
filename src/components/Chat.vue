<script setup lang="ts">

import { ref, onMounted } from 'vue'
// import chatChannel from '../websocket/chat_channel';
import { stores } from '@/stores'
import consumer from '@/websocket/consumer';

const store_name = ref()
const store_id = ref()
console.log(store_name)
const messages = ref([]);
const newMessage = ref()

const chatChannel = consumer.subscriptions.create({ channel: "ChatChannel", chat_room_id: 4 }, {
  connected() {
    console.log("Conectado ao ChatChannel")
  },
  disconnected() {
    console.log("Desconectado do ChatChannel")
  },
  speak(message: any) {
    this.perform('speak', { message })
  }
});

onMounted(async () => {
  store_id.value = localStorage.getItem('store')
  const store_data = await stores.getStore(store_id.value)
  store_name.value = store_data.name
  getMessages()
  chatChannel.received = (data: any) => {
    messages.value.push(data);
  };
})

async function getMessages() {
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + `/chat_rooms/${4}`
  )
  const data = await response.json()
  messages.value = data.chat_messages
}


function sendMessage() {
  const new_message = {
    content: newMessage.value,
    sender_id: store_id.value,
    sender_type: "Store",
    sent_at: new Date().toLocaleString(),
    chat_room_id: 4
  };
  chatChannel.speak(new_message);
  console.log(new_message)
  newMessage.value = '';  
}

</script>

<template>
  <div class="chat">
    <div v-for="message in messages">
      <strong>{{ message.sender_id }}:</strong> {{ message.content }}
    </div>
    <input v-model="newMessage" @keyup.enter="sendMessage">
  </div>
</template>
