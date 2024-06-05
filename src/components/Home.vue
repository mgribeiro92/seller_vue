<script setup lang="ts">

import { useRouter } from 'vue-router'
import { Auth } from '@/auth'
import { ref, onMounted } from 'vue'
import Stores from '../components/Stores.vue'
import Message from '../components/Message.vue'
import event from '@/event'

const router = useRouter()
const auth = new Auth()

const currentUser = ref(auth.currentUser())

const msg = ref('')
const alert = ref('')

onMounted(() => {
  auth.verifyToken()
  auth.validToken()
  
	event.on("sign_in", (dados: any) => {
		msg.value = dados.msg
		alert.value = dados.alert   
	})
})

</script>


<template>
  
  <div class="home">
    <Message v-if="msg" :message="msg" :alert="alert"/>
    <Stores />
  </div>


 
</template>

<style>

  .home {
    padding: 10px;
  }

</style>