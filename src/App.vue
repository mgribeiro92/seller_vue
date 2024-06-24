<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { onMounted, ref } from 'vue'
import { chats } from '@/chats'
import NavBar from './components/Navbar.vue'
import SideBar from './components/SideBar.vue'
import Chat from './components/Chat.vue'

const selected_color = ref('')
const show_chat = ref(false);
const show_icon_chat = ref(false)
const chat_info = ref()
const store_id = sessionStorage.getItem('store')

onMounted(() => {
  color()
  if (store_id) {
    show_icon_chat.value = true
  }
})

function closeChat() {
  show_chat.value = !show_chat.value
}

async function openChat() {
  chat_info.value = await chats.lastChat(store_id)
  show_chat.value = !show_chat.value;
}


function color() {
  const color = sessionStorage.getItem('tema')
  let corHex;
    switch (color) {
      case 'Verde':
        corHex = '#008000';
        break;
      case 'Vermelho':
        corHex = '#b20000';
        break;
      case 'Azul':
        corHex = '#00004c';
        break;
      case 'Roxo':
        corHex = '#800080';
        break
      case 'Laranja':
        corHex = '#FFA500';
        break
      default:
        corHex = '#595959'; 
    }
    document.documentElement.style.setProperty('--cor-dinamica', corHex)
}

</script>

<template>

  <header>
    <SideBar v-if="$route.meta.showNavBar != false"/>
    <div class="central">
      <NavBar v-if="$route.meta.showNavBar != false" @changeColor="color"/>
      <div class="conteudo"><RouterView /></div>   
    </div>
    <button v-if="show_icon_chat" class="floating-button" @click="openChat">
      Chat
    </button>
    <div v-if="show_chat && $route.meta.showNavBar != false" class="chat-wrapper">
      <Chat :chat_info="chat_info" @closeChat="closeChat"/>
    </div>
  </header>  

  
</template>

<style>

  :root {
    --cor-dinamica: #595959; /* Default azul */
  }

  header {
    display: flex;
    width: 100%;
  }

  nav {
    color: var(--cor-dinamica);
    background-color: #f2f2f2;
  }
  
  h3 {
    color: gray
  }

  .floating-button {
    position: fixed;
    bottom: 20px;
    right: 20px;
    padding: 10px 20px;
    background-color: var(--cor-dinamica);
    color: white;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
  }

  .chat-wrapper {
    position: fixed;
    bottom: 20px;
    right: 20px;
    min-width: 400px; 
    background-color: white;
    border: 1px solid #ddd;
    border-radius: 10px;
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
    z-index: 1000;
  }
  
  .chat-info {
    color: var(--cor-dinamica);
    border-bottom: 2px solid var(--cor-dinamica);
  }

  .store-name { 
    font-size: 25px;
  }

  .open-chat {
    color: var(--cor-dinamica)
  }

  .sidebar {
    color: var(--cor-dinamica);
    background-color: #f2f2f2;
  }

  .sidebar > ul > li {
    border-bottom: 2px solid var(--cor-dinamica);
  }

  .central {
    width: 100%;
  }

  .card-store-front {
    color: var(--cor-dinamica);
    border-left: 2px solid var(--cor-dinamica);
  }

  .card-store-back {
    background-color: var(--cor-dinamica);
  }

  .conteudo {
    border-top: 2px solid var(--cor-dinamica);
    border-left: 2px solid var(--cor-dinamica);
    height: 100vh;
    padding: 0;
  }

  .btn-change-color {
		color: var(--cor-dinamica);	
		border: 1px solid var(--cor-dinamica);
	}

  .btn-change-color:hover {
    background-color: var(--cor-dinamica);
  }

  .modal {
    display: block;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modal-content {
    background-color: white;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 30%;
  }

  .btn {
    padding: 0px 10px;
		margin: 0px 10px;  
		color: var(--cor-dinamica);
		background-color: white;
		border-radius: 4px;
		cursor: pointer;
		height: 30px;
    width: 150px;
    border: 1px solid var(--cor-dinamica);
	}

  .btn:hover {
    color: white;
    background-color: var(--cor-dinamica);
  }

</style>