<script setup lang="ts">

import { Auth } from '@/auth'
import { ref, onMounted } from 'vue'
import Message from '../components/Message.vue'
import event from '@/event'
import { getAuthInstance } from '@/authManager';

const auth = getAuthInstance()
const currentUser = ref(auth.currentUser())
const isLoggedIn = auth.isLoggedIn()

console.log(auth)
const msg = ref('')
const alert = ref('')

onMounted(() => {
	event.on("sign_in", (dados: any) => {
		msg.value = dados.msg
		alert.value = dados.alert   
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