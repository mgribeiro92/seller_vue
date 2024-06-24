<script setup lang="ts">

import Chat from './Chat.vue'
import { useRouter } from 'vue-router'
import { ref, onMounted } from 'vue';
import { chats } from '../chats'
import type { ChatsRoom } from '../types'

const router = useRouter()
const all_chats = ref<ChatsRoom[]>([])
const show_chat = ref()
const chat_info = ref()
const store_id = sessionStorage.getItem('store')

async function openChat(chat_room_id: any) {
  chat_info.value = await chats.getChat(chat_room_id)
  console.log(chat_info.value)
  show_chat.value = !show_chat.value
}

async function allChats() {
  const chat_data = await chats.getChats(store_id)
  all_chats.value = chat_data.chats
}

onMounted(() => {
  if (store_id) {
    allChats()
  } else {
    router.push('/')
  }

})

function closeChat() {
  console.log('closechat dos chats')
  show_chat.value = !show_chat.value
  allChats()
}

</script>

<template>
  <NavBar/>
  <div v-if="show_chat" class="chat-wrapper">
    <Chat :chat_info="chat_info" @closeChat="closeChat"/>
  </div>
  <div class="chats-container">
    <h3>Chats!</h3>
    <hr>
    <div v-for="chat in all_chats">
      <div class="card-chat">
        <div>Chat #{{ chat.id }}</div>
        <div>Comprador: {{ chat.buyer_email }}</div>
        <div>Mensagens novas: {{ chat.unread_messages }}</div>
        <div @click="openChat(chat.id)" class="open-chat">Abrir Chat</div>
      </div>
    </div>
  </div>

</template>

<style scoped>

  .chats-container {
    margin: 20px;
  }

  .card-chat {
    display: flex;
    gap: 30px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    padding: 20px;
    width: 800px;
  }

  .open-chat {
    text-decoration: underline;
    cursor: pointer;
  }

</style>