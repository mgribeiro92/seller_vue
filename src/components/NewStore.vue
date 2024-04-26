<script setup lang='ts'>

import { useRouter } from 'vue-router'
import { Auth } from '../auth'
import { ref, onMounted } from 'vue'
// import event from '@/event';

const router = useRouter()
const auth =  new Auth()

const name_store = defineModel<string>('name_store')

const msg = ref('')
const alert = ref('')

onMounted(() => {
  auth.verifyTokenRedirect()  
})

function newStore() {
  console.log(name_store.value)
}

</script>

<template>
  <div class="container">
    <h2>Create a new store!</h2>
    <hr>
    <form class="card" @submit.prevent="newStore">
      <div class="form-outline mb-2">                  
        <label>Name</label>
        <input type="text" class="form-control" v-model="name_store">
      </div>          
      <input type="submit" class="btn-login" value="Create store"></input>
    </form>
  </div>

</template>

<style scoped>

  .container {
    margin-top: 10px;
  }

  .card {
    width: 400px;
    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
    padding: 10px;
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