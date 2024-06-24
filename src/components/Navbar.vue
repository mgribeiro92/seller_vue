<script setup lang="ts">

import { ref, onMounted, onUpdated } from 'vue'
import { Auth } from '../auth'
import { stores } from '../stores'
import consumer from "../websocket/consumer"

const auth = new Auth()
const currentUser = ref(auth.currentUser())

const colors = ['Cinza', 'Vermelho', 'Verde', 'Azul', 'Roxo', 'Laranja']
const selected_color = ref('Cinza')
const store_name = ref()
const notification = ref()

function conectionNotification(store_id: any) {
  consumer.subscriptions.create({ channel: "NotificationChannel", type: "store", id: store_id }, {
  connected() {
    console.log("Conectado ao NotificationChannel")
  },

  disconnected() {
    console.log("Desconectado ao NotificationChannel")
  },

  received(data: any) {
    console.log('ta chegando no received')
    notification.value = data.notification
    console.log(notification.value)
  },
})
}

onMounted(async() => {
  const store_id = sessionStorage.getItem('store')
  if (store_id) {
    const store_data = await stores.getStore(store_id)
    store_name.value = store_data.name
    conectionNotification(store_id)
  }
})


const emit = defineEmits(['changeColor']);
const handleChangeColor = () => {
  sessionStorage.setItem('tema', selected_color.value)
  emit('changeColor');
}

</script>

<template> 
  <nav>
    <h4 v-if="!store_name">Escolha uma loja para prosseguir</h4>
    <h4 v-else>Loja: {{ store_name }}</h4>
    <div class="select-color">
      <div class="change-color">
        <label>Mudar de tema:</label>
        <select class="form-control" v-model="selected_color">
          <option disabled value="">Selecione uma cor...</option>
          <option v-for="color in colors" :key="color" :value="color">
            {{ color }}
          </option>
        </select>      
      </div>
      <button class="btn-change-color" @click="handleChangeColor">Mudar</button>
    </div>    
    <RouterLink class="nav-link" to="/chats">{{ notification }}</RouterLink>
    <div class="user"><RouterLink to="" class="nav-link">Ola, {{ currentUser && currentUser.email }}!</RouterLink></div>
  </nav>
</template>



<style scoped>

  nav {      
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .select-color {
    display: flex;
    align-items: end;
    gap: 10px;
  }

  .change-color {
    display: flex;
    align-items: center;
    flex-direction: column;
    text-align: left;
  }

  .form-control {
    width: 150px;
  }

  .btn-change-color {
		padding: 0px 10px;
		background-color: #f2f2f2;
		border-radius: 4px;
		cursor: pointer;
		height: 30px;
    width: 100px;
    margin-right: 20px;
	}

  .btn-change-color:hover {
    color: #f2f2f2;
  }

</style>
