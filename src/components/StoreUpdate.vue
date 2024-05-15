<script setup lang="ts">

import { ref } from 'vue'
import { stores } from '@/stores'

const {store_id} = defineProps(['store_id'])

const fileInput = ref()
let imagemSelecionada: File

function handleFileInputChange() {
  const files = fileInput.value.files
  console.log(files)
  // if (files.length > 0) {
  //   imagemSelecionada = files[0];
  // }
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
      <div class="form-outline mb-2">                  
        <label>Description</label>
        <textarea  class="form-control" rows="5" maxlength="500"></textarea>
      </div>
      <input type="file" ref="fileInput" class="form-control-file" @change="handleFileInputChange">
      <button class="btn-img" @click="uploadImage">Send Logo</button>
    </div>
   
  </div>

</template>

<style scoped>

  .update-store {
    display: flex;
    flex-direction: column;
    width: 500px;
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