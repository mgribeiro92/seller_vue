<script setup lang="ts">

import { useRouter } from 'vue-router'
import { Auth } from '@/auth'
import { ref, onMounted } from 'vue'
import { stores } from '@/stores'

import event from '@/event';
import Message from './Message.vue';
import NewStore from './NewStore.vue'

const router = useRouter()
const auth =  new Auth()

const name_store = defineModel<string>('name_store')
const stores_data = ref()
const msg = ref('')
const alert = ref('')
const show_store = ref(false)
const show_modal = ref(false)
const localhost = "http://127.0.0.1:3000/"

onMounted(async () => {
  auth.verifyToken()
  try {
    await auth.validToken()    
  } finally {
    const stores_response = await stores.getStores()
    stores_data.value = stores_response.stores
  }  
  event.on("stores_url", (dados: any) => {
    msg.value = dados.msg
    alert.value = dados.alert
    show_store.value = false
  })
})

function storeSelected(store: any) {
  sessionStorage.setItem("store", store)
  const url = router.resolve({ name: 'store', params: { storeId: store } }).href
  window.location.href = url
}

</script>

<template>

  <div v-if="!show_store" class="container">
    <h3>Bem vindo lojista!</h3>
    <hr>
    <p>Por favor escolha uma loja pra continuar...</p>
    <div class="stores">
      <div class="card-store" v-for = "store in stores_data" :key = "store.id">
        <div class="card-store-front">
          <h5 class="card-title">{{ store.name }}</h5>
        </div>
        <div @click="storeSelected(store.id)"  class="card-store-back">
          <h5 class="card-title">{{ store.name }}</h5>
          <p>Escolher loja!</p>
        </div>        
      </div>
      <div class="card-store" style="padding: 15px">
        <img src="../assets/mais.png" alt="">
        <button @click="show_store = true" class="btn-store">Criar nova loja!</button>      
      </div>      
    </div>
  </div>  
  
  <NewStore v-else />

</template>



<style scoped>

  a {
    text-decoration: none;
    color: inherit;
  }

  .stores-title {
    padding: 0px 30px;
    margin: 10px 50px;  
  }

  .stores {
    display: flex;
    flex-wrap: wrap;
  }

  .card-store {
    margin: 10px;
    width: 250px;
    height: 100px;
    display: flex;
    align-items: center;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    position: relative;
    perspective: 800px;
  }

  .card-store-front, .card-store-back {
    width: 100%;
    height: 100%;
    position: absolute;
    backface-visibility: hidden;
    border-radius: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  .card-store-front {
    background-color: white;
    padding: 10px;
  }

  .card-store-back { 
    color: white;
    transform: rotateY(-180deg);
    display: flex;
    flex-direction: column;
    gap: 15px;
    padding: 15px;
  }
    
  .card-store:hover .card-store-front {
    transform: rotateY(180deg);
  }

  .card-store:hover .card-store-back {
    transform: rotateY(0)
  }

  img {
    width: 40px;
    height: 40px;
    margin-right: 10px;
  }

  .message {
    padding: 0px 30px;
    margin: 10px 50px;
  }

  .btn-store {
    background: none;
    border: none;
    padding: 0;
    font: inherit;
    color: blue;
    text-decoration: underline;
    cursor: pointer;
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

  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .btn-confirmation-row {
    display: flex;
    justify-content: center;
    gap: 30px
  }
  
  .btn-confirmation:hover {
    cursor: pointer;
  }

  .btn-login {    
		padding: 0px 10px;
		margin: 10px 0px;  
		color: #421010;
		background-color: white;
		border-radius: 4px;
		cursor: pointer;
		height: 35px;
    width: 150px;
		border: 1px solid #421010;
	}

	.btn-login:hover {
		color: white; 
		background-color: #421010;
	}

</style>