<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import NavBar from './components/Navbar.vue'

</script>

<template>

  <NavBar v-if="$route.meta.showNavBar != false"/>
  <RouterView />
</template>

<style>

  .modal {
    display: block;
    position: fixed;
    z-index: 1;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modal-content {
    background-color: white;
    margin: 15% auto;
    padding: 20px;
    border: 1px solid #888;
    width: 30%;
  }

</style>