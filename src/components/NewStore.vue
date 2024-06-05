<script setup lang="ts">

import { ref } from 'vue'
import { stores } from '@/stores'
import Message from './Message.vue';

const {store_id} = defineProps(['store_id'])

const fileInput = ref()
const name_store = ref()
const description_store = ref()
const category_store = ref()
const cep = ref()
const address_street = ref()
const address_number = ref()
const address_city = ref()
const address_state = ref()
const show_address = ref(false)
const msg = ref()
const alert = ref()

let imagemSelecionada: File
function handleFileInputChange() {
  const files = fileInput.value.files
  console.log(files)
  if (files.length > 0) {
    imagemSelecionada = files[0];
  }
}

async function createStore() {
  console.log('criando a loja')
  if (!name_store.value || !description_store.value || !category_store.value || !cep.value || !address_number.value ) {
    msg.value = "Por favor preencher todos os itens!"
    alert.value = "error"
  }
  const response_store = await stores.newStore(name_store.value, description_store.value, category_store.value)
  const store_id = response_store.id
  const response_address = await stores.newAddress(store_id, address_street.value, address_number.value, cep.value, address_city.value, address_state)
  console.log(response_address)
  if (imagemSelecionada) {
    stores.uploadImageStore(imagemSelecionada, store_id)
  }
}




// function uploadImage() {
//   stores.uploadImageStore(imagemSelecionada, store_id)
// }

async function fetchAddress() {
  if (cep.value.length == 8) {
    console.log('CEP completo:', cep.value)
    const response = await fetch(
      "https://viacep.com.br/ws/" + cep.value + "/json/", {
        method: "GET"
      }
    )
    const address = await response.json()
    show_address.value = true
    if (response.ok) {
      address_street.value = address.logradouro
      address_city.value = address.localidade
      address_state.value = address.uf
    }   
  }
}


</script>

<template>
  <div class="container">
    <Message v-show="msg" :message="msg" :alert="alert"/>
    <h3>Criar uma nova loja!</h3>
    <div class="new-store">
      <div class="store-info">
        <div class="form-outline mb-2">                  
          <label>Name</label>
          <input type="text" class="form-control" v-model="name_store">
          <small v-show="!name_store" class="form-text text-muted">Por favor, insira um nome.</small>
        </div>
        <div class="form-outline mb-2">                  
          <label>Categoria</label>
          <select class="form-control" v-model="category_store">
            <option>Restaurante</option>
            <option>Doceria</option>
            <option>Bebidas</option>
          </select>
        </div>
        <div class="form-outline mb-2">                  
          <label>Descrição</label>
          <textarea class="form-control" rows="3" maxlength="500" v-model="description_store"></textarea>
        </div>
        <div class="form-outline mb-2">
          <label>Imagem: </label>
          <br>
          <input type="file" ref="fileInput" class="form-control-file" @change="handleFileInputChange">
        </div>
      </div>
      <div class="store-address">
        <div class="form-outline mb-2">
          <h5>Endereço</h5>                 
          <label>CEP</label>
          <input style="width: 150px" class="form-control" maxlength="8" v-model="cep" @input="fetchAddress" @keyup.enter="fetchAddress">
          <small class="form-text text-muted">Por favor coloque seu cep para continuar.</small>
        </div>
        <div class="address-number">
          <div class="form-outline mb-2 logradouro">
            <label>Logradouro</label>
            <input class="form-control" type="text" :placeholder="address_street" readonly>
          </div>
          <div class="form-outline mb-2 number">
            <label>Número</label>
            <input class="form-control" type="text" v-model="address_number">
          </div>          
        </div>
        <div class="address-number">
          <div class="form-outline mb-2 logradouro">
            <label>Cidade</label>
            <input class="form-control" type="text" :placeholder="address_city" readonly>
          </div>
          <div class="form-outline mb-2 number">
            <label>Estado</label>
            <input class="form-control" type="text" :placeholder="address_state" readonly>
          </div>          
        </div>  
      </div>   
    </div>
    <button @click="createStore" class="btn btn-outline-success mt-4">Criar Loja</button>  
  </div>


</template>

<style>

  .new-store{
    display: flex;
    gap: 50px
  }

  .store-info {
    flex: 1
  }

  .store-address {
    flex: 1
  }

  .address-number {
    display: flex;
    gap: 10px;
  }

  .logradouro {
    flex: 8;
  }

  .number {
    flex: 2;
  }

</style>










