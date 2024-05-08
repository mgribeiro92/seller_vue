<script setup lang="ts">

import Message from './Message.vue';
import { ref, onMounted, onUpdated } from 'vue'
import { useRoute } from 'vue-router';
import router from '@/router';
import { Auth } from '@/auth'
import { stores } from '@/stores'
import { products } from '@/products'
import event from '@/event'

const store_products = ref()
const store = ref('')
const msg = ref('')
const alert = ref('')
const update_store = ref(false)
const update_product = ref(null)
const show_modal = ref(false)
const new_product = ref(false)

const name_store_edit = defineModel<string>('name_store_edit')
const update_product_title = defineModel<string>('update_title_product')
const update_product_price = defineModel<number>('update_price_product')
const new_product_title = defineModel<string>('new_title_product')
const new_product_price = defineModel<number>('new_price_product')


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
    console.log(store_data.products)
    if(store_data.products.length != 0) {
      store_products.value = store_data.products
    }
    event.on("products_url", (dados: any) => {
    msg.value = dados.msg
    alert.value = dados.alert
  })
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
    router.push('/stores')  }

}

async function updatingProduct(product_id: any, old_product_title: any, old_product_price: any) {
  let product_title: string;
  let product_price: number;

  if(update_product_title.value) {
    product_title = update_product_title.value
  } else {
    product_title = old_product_title
  }

  if(update_product_price.value) {
    product_price = update_product_price.value
  } else {
    product_price = old_product_price
  }

  products.updateProduct(product_title, product_price, product_id, store_id)
  update_product.value = null 
}

async function newProduct() {
  const new_product_response = await products.createProduct(new_product_title.value || '', new_product_price.value, store_id)
  if(new_product_response) {
    msg.value = "Product was not created, try again",
    alert.value = "error"
  }
}

function deletingProduct(product_id: number) {
  products.deleteProduct(product_id)
}

</script>


<template>

  <Message v-if="msg" :message="msg" :alert="alert"/>
  <div class="container">
    <div class="store-row">
      <div class="store-name">
        <h3 v-show="!update_store">{{ store }}</h3>
        <input v-show="update_store" class="form-control" style="width:300px" :placeholder="store" v-model="name_store_edit"></input>
        <img v-show="update_store" class="btn-confirmation" @click="update_store = false" src="../assets/botao-x.png" alt="">
        <img v-show="update_store" class="btn-confirmation" @click="editingStore()" src="../assets/verificar.png" alt="">
      </div>
      <div class="store-edit-destroy">
        <button class='btn-edit-destroy' @click="update_store = true ">Editar</button>
        <button class='btn-edit-destroy' @click="show_modal = true">Excluir</button>
      </div>      
    </div>
    <hr>   
    <div v-if="!store_products">
      <div class="row">
        <p class="col">Não existe produtos para essa loja!</p>
        <button class="col-4 btn-new-product" @click="new_product = true">New product</button>
      </div>
      
    </div>
    <div v-else class="tabela">
      <div class="row">
        <h4 class="col">Products</h4>
        <button class="col-4 btn-new-product" @click="new_product = true">New product</button>
      </div>      
      <table v-show="new_product == false">      
          <thead>
            <tr>
              <th style="width: 200px">Name</th>
              <th style="width: 100px">Price</th>
              <th style="width: 120px">Update</th>
              <th style="width: 120px">Delete</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="product in store_products" :key="product.id">

              <td v-show="update_product != product.id">{{ product.title }}</td>              
              <td v-show="update_product != product.id">{{ product.price }}</td>
              <td v-show="update_product != product.id">
                <button class="btn-edit-destroy-product" @click="update_product = product.id">Update</button>
              </td>
              
              <td v-show="update_product == product.id">
                <input type="text" :placeholder="product.title" v-model="update_product_title"></input>
              </td>
              <td v-show="update_product == product.id">
                <input type="number" step="0.1" :placeholder="product.price" v-model='update_product_price'></input>                
              </td>              
              <td v-show="update_product == product.id">
                <img class="btn-confirmation" style="margin-right: 10px" @click="update_product = null" src="../assets/botao-x.png" alt="">
                <img class="btn-confirmation" @click="updatingProduct(product.id, product.title, product.price)" src="../assets/verificar.png" alt="">
              </td>

              <td>
                <button @click="deletingProduct(product.id)" class="btn-edit-destroy-product">Delete</button>
              </td>
            </tr>            
          </tbody>
      </table>   
    </div>
  </div>

  <div class="container" v-show="new_product == true">
    <form class="form-new-product" @submit.prevent="newProduct()">
      <div class="form-outline mb-2">                  
        <label>Title</label>
        <input type="text" class="form-control" v-model="new_product_title">
      </div>
      <div class="form-outline mb-4">                  
        <label>Price</label>
        <input type="number" step="0.1" class="form-control" v-model="new_product_price">
      </div>
      <input type="submit" class="btn-new-product" value="Create product"></input>
    </form>
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

  .form-new-product {
    width: 300px;
  }

  .btn-edit-destroy {    
		padding: 0px 10px;
		margin: 10px 0px;  
		color: #a32020;
		background-color: white;
		border-radius: 4px;
		cursor: pointer;
		height: 30px;
    width: 100px;
		border: 1px solid #a32020;
	}

  .btn-edit-destroy:hover {
    color: white;
    background-color: #a32020;
  }

  .btn-new-product {    
		padding: 0px 10px;
		margin: 0px 0px;  
		color: #a32020;
		background-color: white;
		border-radius: 4px;
		cursor: pointer;
		height: 30px;
    width: 150px;
		border: 1px solid #a32020;
	}

  .btn-new-product:hover {
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

  .btn-edit-destroy-product {  
		color: #a32020;
		background-color: white;
    border: none;
	}

  .btn-edit-destroy-product:hover {
    border-bottom: 1px solid #a32020;
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
  
  /* .tabela{
    width: 500px;
    margin: 20px 0px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    padding: 10px;
    text-align: left;
    border-left: 2px solid #a32020;
  } */

  table { 
    width: auto;  
    border-collapse: collapse;
    margin-top: 10px;
  }

  th, td {
    padding: 5px;
    border-bottom: 1px solid #ddd;
    text-align: left;
    font-size: 15;
  }

</style>