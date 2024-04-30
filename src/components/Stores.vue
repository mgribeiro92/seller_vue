<script setup lang="ts">

import { useRouter } from 'vue-router'
import { Auth } from '@/auth'
import { ref, onMounted } from 'vue'
import { stores } from '@/stores'

import event from '@/event';
import Message from './Message.vue';
import NewStore from './NewStore.vue';

// const router = useRouter()
const auth =  new Auth()

const stores_data = ref()
const msg = ref('')
const alert = ref('')
const show_store = ref(false)
const show_modal = ref(false)

onMounted(async () => {
  auth.verifyTokenRedirect()
  stores_data.value = await stores.getStore()
  event.on("stores", (dados: any) => {
    msg.value = dados.msg
    alert.value = dados.alert
    show_store.value = false 
  })
})

</script>

<template>

  <div class="message">
    <Message v-if="msg" :message="msg" :alert="alert"/>
  </div>  
  <div class="container">
    <h3>Stores</h3>
    <hr>
    <div class="stores">
      <div class="card"  v-for = "store in stores_data" :key = "store.id">
        <div class="card-body">
          <h5 class="card-title">{{ store.name }}</h5>
          <RouterLink :to="{ name: 'products', params: { storeId: store.id }}">Show products</RouterLink>          
        </div>
      </div>
      <div class="card">
        <div class="card-body">
          <h5 class="card-title"></h5>
          <img src="../assets/mais.png" alt="">
          <p></p>
          <button @click="show_store = true" class="btn-store">Create a new store</button>      
        </div>
      </div>      
    </div>
  </div>

  <button @click="show_modal = true">Abrir Modal</button>
  
  <div v-if="show_store" class="container">  
    <hr>
    <h3>Create a new store!</h3>
    <form class="card" @submit.prevent="newStore">
      <div class="form-outline mb-2">                  
        <label>Name</label>
        <input type="text" class="form-control" v-model="name_store">
      </div>          
      <input type="submit" class="btn-login" value="Create store"></input>
    </form>
  </div>


  <div v-if="show_modal" class="modal">
    <div class="modal-content">
      <span @click="show_modal = false" class="close">&times;</span>
      <p>Conteúdo do modal aqui...</p>
    </div>
  </div>

</template>



<style scoped>

  .stores-title {
    padding: 0px 30px;
    margin: 10px 50px;  
  }

  .stores {
    display: flex;
    flex-wrap: wrap;
  }

  .card{
    margin: 10px;
    width: 16rem;
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
    width: 80%;
  }

  .close {
    color: #aaa;
    float: right;
    font-size: 28px;
    font-weight: bold;
  }

  .close:hover,
  .close:focus {
    color: black;
    text-decoration: none;
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