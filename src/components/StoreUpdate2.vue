<script setup lang="ts">

import { ref } from 'vue'
import { stores } from '@/stores'

const {store_id} = defineProps(['store_id'])

const fileInput = ref()
const cep = ref()

let imagemSelecionada: File

function handleFileInputChange() {
  const files = fileInput.value.files
  console.log(files)
  if (files.length > 0) {
    imagemSelecionada = files[0];
  }
  // console.log(imagemSelecionada)
}

function uploadImage() {
  stores.uploadImageStore(imagemSelecionada, store_id)
}



</script>

<template>

  <div class="container">
    <hr>
    <div class="update-store">      
      <div class="store-info">
        <div class="form-outline mb-2">                  
          <label>Description</label>
          <textarea class="form-control" rows="3" maxlength="500"></textarea>
        </div>
        <input type="file" ref="fileInput" class="form-control-file" @change="handleFileInputChange">
        <button class="btn-img" @click="uploadImage">Send Logo</button>
      </div>
      <div class="store-address">
        <div class="form-outline mb-2">
          <h5>Endereço</h5>                 
          <label>CEP</label>
          <input style="width: 150px" class="form-control" maxlength="8" v-model="cep" @input="fetchAddress" @keyup.enter="fetchAddress">
          <small class="form-text text-muted">Por favor coloque seu cep para continuar.</small>
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

  .update-store {
    display: flex;
    gap: 50px;
    border: 2px solid green
  }

  .store-address {
    flex: 1
  }

  .store-info {
    flex: 1
  }

  .btn-img {    
		padding: 0px 10px;
		margin: 10px 0px;  
		color: #a32020;
		background-color: white;
		border-radius: 4px;
		cursor: pointer;
		height: 30px;
    width: 150px;
		border: 1px solid #a32020;
	}

  .btn-img:hover {
    color: white;
    background-color: #a32020;
  }

</style>