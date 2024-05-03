<script setup lang="ts">

import Message from './Message.vue';
import { ref, onMounted, onUpdated } from 'vue'
import { useRoute } from 'vue-router';
import router from '@/router';
import { Auth } from '@/auth'
import { stores } from '@/stores'

const products = ref()
const store = ref('')
const msg = ref('')
const alert = ref('')
const editing = ref(false)
const show_modal = ref(false)

const name_store_edit = defineModel<string>('name_store_edit')

const auth = new Auth()
const currentUser = auth.currentUser()

const route = useRoute()
const store_id = route.params.storeId

onMounted(async () => {
  auth.verifyToken()
  try {
    await auth.validToken()
  } finally {
    const store_data = await stores.getStoreAndProducts(store_id)
    store.value = store_data.store.name
    if(store_data.products.length != 0) {
      products.value = store_data.products
    }
  }
})

async function editingStore() {
  const data_edit =  await stores.editStore(name_store_edit.value || '', store_id)
  console.log(data_edit)
  if(data_edit.id) {
    editing.value = false
    store.value = data_edit.name
    msg.value = "Store updated successfully!"
    alert.value = "success"
  }
  console.log(data_edit.name)
}

async function deletingStore() {
  console.log('aqui vai deletar a store')
  stores.deleteStore(store_id)
  show_modal.value = false
  // router.push('/stores')
}

</script>


<template>

  <Message v-if="msg" :message="msg" :alert="alert"/>
  <div class="container">
    <div class="store-row">
      <div class="store-name">
        <h3 v-show="!editing">{{ store }}</h3>
        <input v-show="editing" class="form-control" style="width:300px" :placeholder="store" v-model="name_store_edit"></input>
        <img v-show="editing" class="btn-confirmation" @click="editing = false" src="../assets/botao-x.png" alt="">
        <img v-show="editing" class="btn-confirmation" @click="editingStore()" src="../assets/verificar.png" alt="">
      </div>
      <div class="store-edit-destroy">
        <button class='btn-edit-destroy' @click="editing = true ">Editar</button>
        <button class='btn-edit-destroy' @click="show_modal = true">Excluir</button>
      </div>      
    </div>
    <hr>   
    <div v-if="!products">
      <p>Não existe produtos para essa loja!</p>
    </div>
    <div v-else class="tabela">
      <h4>Products</h4>
      <table>      
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <div v-for="product in products" :key="product.id">
                <td>{{ product.title }}</td>
                <td>{{ product.price }}</td>
              </div>
            </tr>
          </tbody>
      </table>   
    </div>
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

<style>

  .tabela{  
      align-items: center;
      margin: 20px 0px;
      border-radius: 8px;
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
      padding: 10px;
      text-align: left;
      border-left: 2px solid #a32020;
  }

  .store-row {
    display: flex;
  }

  .store-name {
    flex: 80%;
    margin-top: 10px;
    display: flex;
    gap: 20px;
  }

  .store-edit-destroy {
    flex: 20%;
    display: flex;
    justify-content: space-between;
  }

  .btn-edit-destroy {    
		padding: 0px 10px;
		margin: 10px 0px;  
		color: #a32020;
		background-color: white;
		border-radius: 4px;
		cursor: pointer;
		height: 35px;
    width: 100px;
		border: 1px solid #a32020;
	}

  .btn-edit-destroy:hover {
    color: white;
    background-color: #a32020;
  }

  .btn-confirmation {
    margin-top: 5px;
    width: 35px;
    height: 35px;
  }

  .btn-confirmation:hover {
    cursor: pointer;
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
    width: 25%;
  }

  .btn-confirmation-row {
    display: flex;
    justify-content: center;
    gap: 30px
  }
  

  table { 
      width: 100%;  
      border-collapse: collapse;
      margin-top: 10px;
  }

  h4 {
      font-size: 20px;
      margin-top: 10px;
      margin-bottom: 10px;
      color: #00283d;
  }

  thead {
      color: #00283d
  }


  h2 {
      text-align: center;
      color: #333;
  }

  th, td {
      padding: 5px;
      border-bottom: 1px solid #ddd;
      text-align: left;
      font-size: 15;
  }

  tbody tr:nth-child(even) {
      background-color: #f2f2f2;
  }

</style>