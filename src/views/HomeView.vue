<script setup lang="ts">
import Home from '../components/Home.vue'
import { ref } from 'vue'
import { Auth } from '@/auth'

const auth = new Auth()
const isLoggedIn = ref(auth.isLoggedIn())
</script>

<template>

  <Home />

</template>
