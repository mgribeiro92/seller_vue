<script setup lang="ts">

import { Auth } from '@/auth'
import { ref, onMounted } from 'vue'


const auth = new Auth()

const stores = ref([])
const isLoading = ref(true)
const currentUser = auth.currentUser()
console.log(currentUser?.token)


onMounted(async () => {
  try {
    const response = await fetch (
      'http://127.0.0.1:3000/api/stores', {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer" + ' ' + currentUser?.token
      },           
    })
    const data = await response.json();
    stores.value = data;
    isLoading.value = false;
  } catch (error) {
    console.error('Erro ao carregar os dados:', error);
    isLoading.value = false;
  }
});

</script>

<template>

  <div class="stores-title">
    <h2>Lojas do usuario</h2>
    <hr>
    <div class="stores">
      <div class="card" style="width: 18rem;" v-for = "store in stores" :key = "store.id">
        <div class="card-body">
          <h5 class="card-title">{{ store.name }}</h5>
          <h6 class="card-subtitle mb-2 text-muted">Categoria da Loja: </h6>
          <a href="#" class="card-link">Ver produtos da Loja</a>
        </div>
      </div>
      <div class="card" style="width: 18rem;">
        <div class="card-body">
          <h5 class="card-title"></h5>          
          <a href="#" class="card-link">Criar uma nova loja!</a>
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


</style>