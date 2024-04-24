<script setup lang="ts">

import router from '@/router';
import { Auth } from '../auth'
import { ref, onMounted } from 'vue'

const auth = new Auth()
const currentUser = ref(auth.currentUser())

const logOut = function() {
  console.log('logout chamado')
  auth.signOut()
  router.push('/sign_in')
}
</script>

<template> 
<nav class="navbar navbar-expand">
  <div class="container-fluid">
    <a class="navbar-brand">Delivery</a>    
    <div class="collapse navbar-collapse">
      <ul class="navbar-nav me-auto mb-2 mb-lg-0">
        <li class="nav-item">          
          <RouterLink class="nav-link" to="/">Home</RouterLink>
        </li>
        <li class="nav-item">          
          <RouterLink class="nav-link" to="/stores">Stores</RouterLink>
        </li>                       
      </ul>        
      <ul class="d-flex navbar-nav">
        <li class="nav-item">
          <RouterLink to="" class="nav-link">Hi, {{ currentUser && currentUser.email }}!</RouterLink>
        </li>				        
        <li class="nav-item">
          <button @click="logOut()" class="nav-link">Log out</button>
        </li>
      </ul>
    </div>
  </div>
</nav>
</template>

<style scoped>

  nav {      
    background:	#a32020;
    width: 100%;
  }

  .nav-link {
    color: white;
  }

  .navbar-brand {
    color: white;
  }
  
</style>
