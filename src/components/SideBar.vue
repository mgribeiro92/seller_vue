<script setup lang="ts">

import router from '@/router';
import { ref, onMounted } from 'vue'
import { Auth } from '../auth'

const auth = new Auth()
const store_id = ref()

onMounted(async() => {
  store_id.value = sessionStorage.getItem('store') 
})

const logOut = function() {
  console.log('logout chamado')
  auth.signOut()
  router.push('/sign_in')
  localStorage.removeItem('store')
}

</script>

<template>
  <div class="sidebar">
    <div class="delivery-title">Delivery</div>
    <ul>
      <li><RouterLink to="/">Trocar de loja</RouterLink></li>
      <li v-if="store_id"><RouterLink :to="{ name: 'store', params: { storeId: store_id }}">Ver Loja</RouterLink></li>
      <li v-if="store_id"><RouterLink :to="{ name: 'products', params: { storeId: store_id }}">Produtos</RouterLink></li>
      <li v-if="store_id"><RouterLink :to="{ name: 'orders', params: { storeId: store_id }}">Pedidos</RouterLink></li> 
      <li v-if="store_id"><RouterLink :to="{ name: 'chats' }">Chats</RouterLink></li>
      <li v-if="store_id"><RouterLink :to="{ name: 'user' }">Perfil Usuario</RouterLink></li>
      <li @click="logOut">Sair</li>
    </ul>
  </div>
</template>

<style>

  .sidebar {
    width: 200px;
    height: 100vh;
  }

  .delivery-title {
    height: 80px;
    font-size: 30px;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;

  }

  ul {
    list-style-type: none;
    padding: 0;
    padding: 20px;
  }

  li {
    margin-bottom: 10px;
    text-align: center;
    padding-bottom: 5px;
  }

  li:hover {
    cursor: pointer;
  }

  a {
    color: #004c4c;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
}
</style>