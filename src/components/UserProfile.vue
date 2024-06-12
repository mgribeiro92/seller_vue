<script setup lang="ts">

import { Auth } from '@/auth'
import { useRouter } from 'vue-router';
import { ref, onMounted } from 'vue';
import type { UserType } from '../types'

const auth = new Auth()
const router = useRouter()

const user_profile = ref<UserType>({} as UserType)
const user_id = ref()

onMounted(async () => {
  auth.verifyToken()
  auth.validToken()  
  const user_info = await auth.userProfile()
  user_profile.value = user_info
  user_id.value = user_info.id

})


function deleteUser() {
  console.log('excluir usuario')
  if (confirm('Você tem certeza que deseja desativar sua conta?\nTodas as suas lojas também vão ser desativadas, assim como todos os produtos')) {
    auth.deleteUser(user_id.value)
    // router.push('/sign_in')
    alert('Conta desativada com sucesso!')
  } else {
    alert('Ação cancelada!')
  }
}

</script>


<template>

  <div class="user-info">
    <div class="user">Perfil do Usúario</div>
    <div>Email: {{ user_profile.email }}</div>
    <button @click="deleteUser">Desativar Conta</button>
  </div>

</template>

<style>

  .user-info {
    margin: 10px;
  }
  .user {
    font-size: 20px;
    font-weight: bold;
  }

</style>