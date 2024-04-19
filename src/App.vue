<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/Navbar.vue'

</script>

<template>

  <NavBar v-if="$route.meta.showNavBar != false"/>
  <RouterView />
</template>

