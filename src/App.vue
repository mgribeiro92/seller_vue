<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import { ref } from 'vue'
import NavBar from './components/Navbar.vue'
import SideBar from './components/SideBar.vue'

const selected_color = ref()

function color(selectedColor: any) {
  console.log('ta chamando a mudanca de cor no app')
  console.log(selectedColor)
  // selected_color.value = selectedColor
  let corHex;
    switch (selectedColor) {
      case 'Verde':
        corHex = '#002600';
        break;
      case 'Vermelho':
        corHex = '#b20000';
        break;
      case 'Azul':
        corHex = '#00004c';
        break;
      case 'Roxo':
        corHex = '#800080';
        break
      case 'Laranja':
        corHex = '#FFA500';
        break
      default:
        corHex = '#595959'; // Azul por padrão
    }
    document.documentElement.style.setProperty('--cor-dinamica', corHex)
}

</script>

<template>

  <header>
    <SideBar v-if="$route.meta.showNavBar != false"/>
    <div class="central">
      <NavBar v-if="$route.meta.showNavBar != false" @changeColor="color"/>
      <div class="conteudo"><RouterView /></div>   
    </div>

  </header>  

  
</template>

<style>

  :root {
    --cor-dinamica: #595959; /* Default azul */
  }

  header {
    display: flex;
    width: 100%;
  }

  nav {
    color: var(--cor-dinamica);
    background-color: #f2f2f2;
  }

  
  .store-name { 
    font-size: 25px;
  }

  .sidebar {
    color: var(--cor-dinamica);
    background-color: #f2f2f2;
  }

  .sidebar > ul > li {
    border-bottom: 2px solid var(--cor-dinamica);
  }

  .central {
    width: 100%;
  }

  .card-store-front {
    color: var(--cor-dinamica);
    border-left: 2px solid var(--cor-dinamica);
  }

  .card-store-back {
    background-color: var(--cor-dinamica);
  }

  .conteudo {
    border-top: 2px solid var(--cor-dinamica);
    border-left: 2px solid var(--cor-dinamica);
    height: 100vh;
    padding: 0;
  }

  .btn-change-color {
		color: var(--cor-dinamica);	
		border: 1px solid var(--cor-dinamica);
	}

  .btn-change-color:hover {
    background-color: var(--cor-dinamica);
  }

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