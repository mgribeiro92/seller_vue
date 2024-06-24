<script setup lang="ts">

import { ref, onMounted } from 'vue'
import { stores } from '@/stores'
import Message from './Message.vue';

const {store, address} = defineProps(['store', 'address'])
console.log(store)
console.log(address)

const fileInput = ref()
const store_id = ref()
const name_store = ref()
const description_store = ref()
const category_store = ref()
const cep = ref()
const address_street = ref()
const address_number = ref()
const address_city = ref()
const address_state = ref()
const address_id = ref()
const show_address = ref(false)
const msg = ref()
const alert = ref()
const localhost = import.meta.env.VITE_BASE_URL

onMounted(() => {
  store_id.value = store.id
  name_store.value = store.name
  description_store.value = store.description
  category_store.value = store.category
  cep.value = address.zip_code
  address_city.value = address.city
  address_street.value = address.street
  address_number.value = address.number
  address_state.value = address.state
  address_id.value = address.id
})

let imagemSelecionada: File
function handleFileInputChange() {
  const files = fileInput.value.files
  console.log(files)
  if (files.length > 0) {
    imagemSelecionada = files[0];    
  }
}

const emit = defineEmits(['showStore']);
async function updateStore(){
  const response_store = await stores.editStore(store_id.value, name_store.value, description_store.value, category_store.value)
  const response_address = await stores.updateAddress(address_id.value, address_street.value, address_number.value, cep.value, address_city.value, address_state.value)
  console.log(response_address)
  if (imagemSelecionada) {
    console.log('ta passando na imagem')
    stores.uploadImageStore(imagemSelecionada, store.id)
  }
  emit('showStore');
}

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
  <div class="update">
    <Message v-show="msg" :message="msg" :alert="alert"/>
    <h3>Editar Loja!</h3>
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
        <img v-if="store.image_url" :src="localhost + store.image_url">
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
            <input class="form-control" type="text" v-model="address_street">
          </div>
          <div class="form-outline mb-2 number">
            <label>Número</label>
            <input class="form-control" type="text" v-model="address_number">
          </div>          
        </div>
        <div class="address-number">
          <div class="form-outline mb-2 logradouro">
            <label>Cidade</label>
            <input class="form-control" type="text" v-model="address_city">
          </div>
          <div class="form-outline mb-2 number">
            <label>Estado</label>
            <input class="form-control" type="text" v-model="address_state">
          </div>          
        </div>  
      </div>   
    </div>
    <button @click="updateStore" class="btn btn-outline-success mt-4">Editar</button>  
  </div>


</template>

<style scoped>

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }

  .update {
    margin: 10px
  }

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










