<script setup lang="ts">

import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router';

const products = ref([])

const route = useRoute()
const storeId = route.params.storeId
onMounted(async () => {
  try {
    const response = await fetch (
     'http://127.0.0.1:3000/api/stores/' + storeId, {
        method: "GET",
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json"
        }
      }
    )
    products.value = await response.json()
  } catch (error) {
    console.error('Erro ao carregar os dados:', error);
  }
})


</script>


<template>


  <h1>Teste products</h1>
  {{ products }}
</template>