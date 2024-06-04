<script setup lang="ts">

import { ref, onMounted, onUpdated } from 'vue'
import { Auth } from '../auth'
import { stores } from '../stores'

const auth = new Auth()
const currentUser = ref(auth.currentUser())

const colors = ['Vermelho', 'Verde', 'Azul', 'Roxo', 'Laranja']
const selectedColor = ref(colors[0])
const store_name = ref()

onMounted(async() => {
  const store_id = localStorage.getItem('store')
  const store_data = await stores.getStore(store_id)
  store_name.value = store_data.name
  console.log(store_name.value)
})

onUpdated(async() => {
  console.log('update da navbar')
})

const emit = defineEmits(['changeColor']);
const handleChangeColor = () => {
  console.log('ta chamando a mudança de cor')
  emit('changeColor', selectedColor.value);
}

</script>

<template> 
  <nav>
    <h4 v-if="!store_name">Escolha uma loja para prosseguir</h4>
    <h4 v-else>Loja: {{ store_name }}</h4>
    <div class="change-color">
      <label>Mudar de tema:</label>
      <select class="form-control" v-model="selectedColor">
        <option v-for="color in colors" :key="color" :value="color">
          {{ color }}
        </option>
      </select>
      <button class="btn-change-color" @click="handleChangeColor">Mudar</button>
    </div>
    
    <div class="user"><RouterLink to="" class="nav-link">Hi, {{ currentUser && currentUser.email }}!</RouterLink></div>
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


  .change-color {
    display: flex;
    align-items: center;
    gap: 10px;
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
	}

  .btn-change-color:hover {
    color: #f2f2f2;
  }

</style>
