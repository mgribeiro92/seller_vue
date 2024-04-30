<script setup lang="ts">

import { useRouter } from 'vue-router'
import { Auth } from '@/auth'
import { ref, onMounted } from 'vue'
import Message from '../components/Message.vue'
import event from '@/event'

const router = useRouter()
const auth = new Auth()

const currentUser = ref(auth.currentUser())


const msg = ref('')
const alert = ref('')

onMounted(() => {
  auth.verifyTokenRedirect()

	event.on("sign_in", (dados: any) => {
		msg.value = dados.msg
		alert.value = dados.alert   
	})
})

</script>


<template>
  <div class="container">
    <Message v-if="msg" :message="msg" :alert="alert"/>
  </div>
  
  <div class="container">
    <h3>Welcome seller!</h3>
    <hr>
    <p>This is your email account: {{ currentUser?.email }}!</p>

  </div>
 
</template>

<style>

  .teste {
    display: flex;
  }

  .container {
    margin-top: 10px;
  }

</style>