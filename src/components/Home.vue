<script setup lang="ts">

import { Auth } from '@/auth'
import { ref, onMounted } from 'vue'
import Message from '../components/Message.vue'
import event from '@/event'

const auth = new Auth()
const currentUser = ref(auth.currentUser())
const isLoggedIn = auth.isLoggedIn()

const msg = ref('')
const alert = ref('')

onMounted(() => {
	event.on("sign_in", (dados: any) => {
		console.log(dados)
		msg.value = dados.msg
		alert.value = dados.alert
		console.log('log dos dados recebidos')    
	})
})

</script>


<template>
  <div style="margin: 10px">
    <Message v-if="msg" :message="msg" :alert="alert"/>
  </div>
  
  <h2>Welcome seller!</h2>
  <h3>{{ currentUser?.email }}</h3>
</template>

<style>

  .teste {
    display: flex;
  }

</style>