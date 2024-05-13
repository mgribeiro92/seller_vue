<script setup lang="ts">

import { useRouter } from 'vue-router'
import { Auth } from '@/auth'
import { ref, onMounted } from 'vue'
import { stores } from '@/stores'

import event from '@/event';
import Message from './Message.vue';

// const router = useRouter()
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
    stores_data.value = await stores.getStore()
    console.log(stores_data.value)
  }  
  event.on("stores_url", (dados: any) => {
    msg.value = dados.msg
    alert.value = dados.alert
    show_store.value = false
  })
})

async function createStore() {
  stores.newStore(name_store.value || '')
  show_modal.value = false
}

</script>

<template>

  <div class="message">
    <Message v-if="msg" :message="msg" :alert="alert"/>
  </div>  
  <div class="container">
    <h3>Stores</h3>
    <hr>
    <div class="stores">
      <div class="card-store" v-for = "store in stores_data" :key = "store.id">
        <div class="card-store-front">
          <img :src="localhost + store.image_url">
          <h5 class="card-title">{{ store.name }}</h5>

        </div>
        <div class="card-store-back">
          <RouterLink :to="{ name: 'store', params: { storeId: store.id }}">Show store and products</RouterLink>
        </div>        
      </div>
      <div class="card-store">
        <img src="../assets/mais.png" alt="">
        <p></p>
        <button @click="show_store = true" class="btn-store">Create a new store</button>      
      </div>      
    </div>
  </div>  
  
  <div v-if="show_store" class="container">  
    <hr>
    <h3>Create a new store!</h3>
    <div style="width: 400px">
      <div class="form-outline mb-2">                  
        <label>Name</label>
        <input type="text" class="form-control" v-model="name_store">
        <span v-show="!name_store" class="error-message">Por favor, insira um nome.</span>
      </div>
      <button v-show="name_store" @click="show_modal = true" class="btn-login">Create Store</button>         
    </div>
  </div>

  <div v-if="show_modal" class="modal">
    <div class="modal-content">
      <h5>Confirma o nome da loja?</h5>
      <p style="margin-top:10px">O nome da sua loja é... <span style="font-weight: bold">{{ name_store }}</span></p> 
      <div class="btn-confirmation-row">
        <img class="btn-confirmation" @click="show_modal = false" src="../assets/botao-x.png" alt="">
        <img class="btn-confirmation" @click="createStore()" src="../assets/verificar.png" alt="">
      </div>      
    </div>
  </div>

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
    width: 16rem;
    height: 8rem;
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
    color: #a32020;
    border-left: 2px solid #a32020;
    padding: 10px;
  }

  .card-store-back {
    background-color: #a32020;
    color: white;
    transform: rotateY(-180deg);
  }
    
  .card-store:hover .card-store-front {
    transform: rotateY(180deg);
  }

  .card-store:hover .card-store-back {
    transform: rotateY(0)
  }

  img {
    width: 50px;
    height: 50px;
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