<script setup lang="ts">

import StoreProducts from './StoreProducts.vue';
import Message from './Message.vue';
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router';
import { Auth } from '@/auth'
import { stores } from '@/stores'
import  { products }  from '@/products'
import event from '@/event'
import StoreUpdate from './StoreUpdate.vue'
import type { Address } from '../types.ts'


const products_data = ref({ id: 0, title: '', price: '', image_product_url: ''})
const store_data = ref()
const store = ref({ id: 0, name: '', created_at: '', updated_at: '', image_url: '', products: [], update_at: '', url: '', description: '', category: '', address: [] });
const msg = ref('')
const alert = ref('')
const update_store = ref(false)
const show_modal = ref(false)
const address = ref<Address>({} as Address);

const name_store_edit = defineModel<string>('name_store_edit')

const auth = new Auth()
const router = useRouter()
const route = useRoute()
const store_id = sessionStorage.getItem('store')
const localhost = import.meta.env.VITE_BASE_URL

onMounted(async () => {
  auth.verifyToken()
  try {
    await auth.validToken()
  } finally {
    getStore()
  }
})

async function getStore() {
  if (store_id) {
    const store_data =  await stores.getStore(store_id)
    console.log(store_data)
    store.value = store_data
    if (store_data.address) {
      address.value = store_data.address
    }
  } else {
    router.push('/')
  }
}
  
function showStore() {
  update_store.value = false
  console.log('chamando a store')
  getStore()
  msg.value = "Loja atualizada com sucesso!"
  alert.value = "info"
}

// async function editingStore() {
//   const data_edit =  await stores.editStore(name_store_edit.value || '', store_id)
//   console.log(data_edit)
//   if(data_edit.id) {
//     update_store.value = false
//     store.value = data_edit.name
//     msg.value = "Store updated successfully!"
//     alert.value = "success"
//   }
//   console.log(data_edit.name)
// }

async function deletingStore() {
  console.log('aqui vai deletar a store')
  const data_edit = await stores.deleteStore(store_id)
  if (data_edit.message = "Store destroyed!") {
    setTimeout(() => {
      event.emit("stores_url", {
        msg: 'Store deleted successfully!',					
        alert: 'success' 
        })
      }, 500)
    router.push('/stores')  
  }
}
</script>

<template>   

  <div v-if="!update_store" class="store">
    <Message v-if="msg" :message="msg" :alert="alert"/>
    <div class="store-row">
      <div class="store-name">
        <img v-if="store.image_url" :src="localhost + store.image_url">
        <h3>{{ store.name }}</h3>  
      </div>
      <div class="store-edit-destroy">
        <button class='btn' @click="update_store = true ">Update</button>
        <button class='btn' @click="show_modal = true">Delete</button>
      </div>    
    </div>
    <hr> 
    <div class="store-info">       
      <div class="store-title">Categoria</div>
      <p>{{ store.category }}</p>
      <div class="store-title">Descrição</div>
      <p>{{ store.description }}</p>
      <div class="store-title">Endereço</div>
      <div><span class="address-title">Rua: </span>{{ address.street }}, {{ address.number }}</div>
      <div><span class="address-title">Cidade: </span>{{ address.city }} - {{ address.state }}</div>
      <div><span class="address-title">CEP: </span>{{ address.zip_code }}</div>
      <div><span class="address-title">Pais: </span>{{ address.country }}</div>
    </div>    
  </div>

  <StoreUpdate v-else="update_store" :store="store" :address="address" @showStore="showStore"/>

  <div v-if="show_modal" class="modal">
    <div class="modal-content">
      <h5>Are you sure want to delete this store?</h5>      
      <div class="btn-confirmation-row">
        <img @click="show_modal = false" src="../assets/botao-x.png" alt="">
        <img @click="deletingStore()" src="../assets/verificar.png" alt="">
      </div>      
    </div>
  </div> 
  

</template>

<style scoped>

  a {
    text-decoration: none;
    justify-content: center;
    display: flex;
    align-items: center;
  }

  .store {
    display: flex;
    flex-direction: column;
    margin: 10px;
  }

  .store-name > img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }

  .store-info {
    margin: 10px;
  }

  .store-title {
    font-size: 20px;
    font-weight: bold;
    color: gray;
  }
  
  .address-title {
    font-weight: bold;
    color: gray
  }

  .btn-confirmation {
    width: 40px;
    height: 40px;
    cursor: pointer;
  }

  .btn-confirmation-row > img {
    width: 40px;
    height: 40px;
    cursor: pointer;
  }

  .btn-confirmation-row {
    display: flex;
    justify-content: space-around;
  }

  .store-row {
    display: flex;
    align-items: center;
    padding: 10px;
  }

  .store-name {
    flex: 90%;
    display: flex;
    gap: 20px;
    align-items: center;
    color: #ed911f;
  }

  .store-edit-destroy {
    flex: 10%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  /* .btn-edit-destroy {    
		padding: 0px 10px;
		margin: 0px 10px;  
		color: #ed911f;
		background-color: white;
		border-radius: 4px;
		cursor: pointer;
		height: 30px;
    width: 100px;
		border: 1px solid #ed911f;
	}

  .btn-edit-destroy:hover {
    color: white;
    background-color: #ed911f;
  } */

</style>