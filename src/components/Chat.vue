<script setup lang="ts">

import { ref, onMounted } from 'vue'
// import chatChannel from '../websocket/chat_channel';
import { stores } from '@/stores'
import consumer from '@/websocket/consumer';

const { chat_info } = defineProps(['chat_info'])

const store_name = ref()
const store_id = ref()
const messages = ref();
const newMessage = ref()
const chat = ref()

if (chat_info) {
  chat.value = chat_info.chat
  messages.value = chat_info.chat_messages
  console.log(chat_info)
}

const chatChannel = consumer.subscriptions.create({ channel: "ChatChannel", chat_room_id: chat.value.id }, {
  connected() {
    console.log("Conectado ao ChatChannel")
  },
  disconnected() {
    console.log("Desconectado do ChatChannel")
  },
  received(data: any) {
    messages.value.push(data);
    scrollToBottom()
  },
  speak(message: any) {
    this.perform('speak', { message })
  }
});

onMounted(async () => {
  store_id.value = sessionStorage.getItem('store')
  const store_data = await stores.getStore(store_id.value)
  store_name.value = store_data.name
  scrollToBottom()
})

// async function getMessages() {
//   const response = await fetch(
//     import.meta.env.VITE_BASE_URL + `/chat_rooms/${4}`
//   )
//   const data = await response.json()
//   messages.value = data.chat_messages
// }

function scrollToBottom() {
  setTimeout(() => {
    const chatContainer = document.querySelector('.chat-container')
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, 100);
}

function sendMessage() {
  const new_message = {
    content: newMessage.value,
    sender_id: store_id.value,
    sender_type: "Store",
    sent_at: new Date().toLocaleString(),
    chat_room_id: chat.value.id
  };
  chatChannel.speak(new_message);
  console.log(new_message)
  scrollToBottom()
  newMessage.value = '';  
}

function getMessageClass(message: { sender_type: string; }) {
  return message.sender_type === "Store" ? 'message-right' : 'message-left';
}

const emit = defineEmits(['closeChat'])
function closedChat() {
  console.log('fechar chat')
  emit('closeChat')
}

function formatDateTime(dateString: string | number | Date) {
  const date = new Date(dateString);
  return date.toLocaleString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false
  });
}


</script>

<template>
  <div class="chat-info">
    <div class="chat-title">
      <div>Chat</div>
      <div class="store-chat-name">{{ chat.buyer_email }}</div>
    </div>
    <div class="chat-close" @click="closedChat">Fechar</div>
  </div>
  <div class="chat-container">    
    <div v-for="message in messages" :class="getMessageClass(message)">
      <div class="message-wrapper">
        <div class="message-bubble">
          <div>{{ message.content }}</div>
          <div style="font-size: 10px;">{{ formatDateTime(message.sent_at)}}</div>
        </div>
      </div>
     </div>
    <div ref="bottom"></div>    
  </div>
  <div class="input-wrapper">
    <input v-model="newMessage" @keyup.enter="sendMessage" placeholder="Digite sua mensagem...">
    <button @click="sendMessage">Enviar</button>
  </div>
</template>

<style>

  .chat-info {
    display: flex;
    padding: 10px;
    position: absolute;
    width: 100%;
    border-radius: 5px;

    justify-content: space-between;
    align-items: end;
  }
  
  .chat-container {
    position: relative;
    max-width: 400px; 
    height: 300px; 
    overflow-y: auto;
    margin-bottom: 70px;
    margin-top: 100px;
  }

  .chat-title {
    font-size: 25px;
  }

  .store-chat-name {
    font-size: 15px;
  }

  .chat-close:hover {
    cursor: pointer;
    color: darkblue;
    text-decoration: underline;
  }

  .message-wrapper {
    display: flex;
    justify-content: flex-end; 
    padding: 5px;
    text-align: right;
  }

  .message-bubble {
    padding: 8px 12px;
    border-radius: 10px;
    max-width: 90%;
  }

  .message-left .message-wrapper {
    justify-content: flex-start;
    text-align: left;
  }

  .message-right .message-bubble {
    background-color: rgb(0, 107, 107);
    color: white;

  }

  .message-left .message-bubble {
    background-color:	rgb(187, 255, 213)
  }

  .input-wrapper {
    position: absolute;
    bottom: 10px;
    left: 0;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0px 10px;
  }

  .input-wrapper input {
    flex: 1;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-right: 10px;
  }

  .input-wrapper button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
  }

</style>