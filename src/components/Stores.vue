<script setup lang="ts">

import { useRouter } from 'vue-router'
import { Auth } from '@/auth'
import { ref, onMounted, reactive } from 'vue'
import event from '@/event';
import Message from './Message.vue';

const router = useRouter()

const auth = new Auth()
const currentUser = auth.currentUser()
const isLoggedIn = auth.isLoggedIn()

const stores = ref()
const msg = ref('')
const alert = ref('')

async function getStore() {
  try {
    const response = await fetch (
      'http://127.0.0.1:3000/api/user_store', {
      method: 'GET',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer" + ' ' + currentUser?.token
        },           
      })
    const data = await response.json();
    if(data.message == "Nope!") {
      console.log(data)
      auth.newToken()
           
    } else {
      console.log(data)
      stores.value = data
    }      
  } catch (error) {    
    console.error('Erro ao carregar os dados:', error)
  }
}



onMounted(() => {
  getStore()
})

</script>

<template>

  <div class="message">
    <Message v-if="msg" :message="msg" :alert="alert"/>
  </div>  
  <div class="container">
    <h2>Stores</h2>
    <hr>
    <div class="stores">
      <div class="card" style="width: 18rem;"  v-for = "store in stores" :key = "store.id">
        <div class="card-body">
          <h5 class="card-title">{{ store.name }}</h5>
          <RouterLink :to="{ name: 'products', params: { storeId: store.id }}">Show products</RouterLink>          
        </div>
      </div>
      <div class="card" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title"></h5>
          <img src="../assets/mais.png" alt="">
          <p></p>      
          <a href="#" class="card-link">Create a new store!</a>
        </div>
      </div>
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
  }

  .card{
    margin-right: 15px;
  }

  img {
    width: 50px;
    height: 50px;
  }

  .message {
    padding: 0px 30px;
    margin: 10px 50px;
  }


</style>