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

const products_data = ref({ id: 0, title: '', price: '', image_product_url: ''})
const store_data = ref()
const store = ref({ id: 0, name: '', created_at: '', updated_at: '', image_url: '', products: [], update_at: '', url: '' });
const msg = ref('')
const alert = ref('')
const update_store = ref(false)
const show_modal = ref(false)

const name_store_edit = defineModel<string>('name_store_edit')

const auth = new Auth()
const router = useRouter()
const route = useRoute()
const store_id = route.params.storeId
const localhost = import.meta.env.VITE_BASE_URL

onMounted(async () => {
  auth.verifyToken()
  try {
    await auth.validToken()
  } finally {
    store.value = await stores.getStore(store_id) 
  }
})

async function editingStore() {
  const data_edit =  await stores.editStore(name_store_edit.value || '', store_id)
  console.log(data_edit)
  if(data_edit.id) {
    update_store.value = false
    store.value = data_edit.name
    msg.value = "Store updated successfully!"
    alert.value = "success"
  }
  console.log(data_edit.name)
}

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

  <Message v-if="msg" :message="msg" :alert="alert"/>  
  <div class="container">
    <div class="store-row">
      <div class="store-name">
        <img v-if="store.image_url" :src="localhost + store.image_url">
        <h3 v-show="!update_store">{{ store.name }}</h3>
        <input v-show="update_store" class="form-control" style="width:300px" :placeholder="store.name" v-model="name_store_edit"></input>
        <img v-show="update_store" class="btn-confirmation" @click="update_store = false" src="../assets/botao-x.png" alt="">
        <img v-show="update_store" class="btn-confirmation" @click="editingStore()" src="../assets/verificar.png" alt="">
      </div>
      <div class="store-edit-destroy">
        <button class='btn-edit-destroy' @click="update_store = true ">Update</button>
        <button class='btn-edit-destroy' @click="show_modal = true">Delete</button>
      </div>      
    </div> 
    <!-- <StoreProducts v-if="!update_store" :store_id="store_id"/> -->
    <StoreUpdate v-show="update_store" :store_id="store_id"/>
  </div>
  

  <div v-if="show_modal" class="modal">
    <div class="modal-content">
      <h5>Are you sure want to delete this store?</h5>      
      <div class="btn-confirmation-row">
        <img class="btn-confirmation" @click="show_modal = false" src="../assets/botao-x.png" alt="">
        <img class="btn-confirmation" @click="deletingStore()" src="../assets/verificar.png" alt="">
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

  img {
    width: 80px;
    height: 80px;
    border-radius: 50%;
  }

  .store-row {
    display: flex;
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

  .btn-edit-destroy {    
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
  }

</style>