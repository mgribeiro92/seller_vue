<script setup lang="ts">

import { ref } from 'vue'
import event from '@/event'
import { product } from '@/products'

const {products, store_id} = defineProps(['products', 'store_id'])

console.log(products)
const update_product = ref(null)
const new_product = ref(false)

const update_product_title = defineModel<string>('update_title_product')
const update_product_price = defineModel<number>('update_price_product')
const new_product_title = defineModel<string>('new_title_product')
const new_product_price = defineModel<number>('new_price_product')

const msg = ref('')
const alert = ref('')

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

  product.updateProduct(product_title, product_price, product_id, store_id)  
}

async function newProduct() {
  const new_product_response = await product.createProduct(new_product_title.value || '', new_product_price.value, store_id)
  if(new_product_response) {
    msg.value = "Product was not created, try again",
    alert.value = "error"
  }
}

function deletingProduct(product_id: number) {
  product.deleteProduct(product_id)
}

</script>


<template>
    <hr>   
    <div v-if="!products">
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
            <tr v-for="product in products" :key="product.id">

              <td v-show="update_product != product.id">{{ product.title }}</td>              
              <td v-show="update_product != product.id">{{ product.price }}</td>
              <td v-show="update_product != product.id">
                <button class="btn-edit-destroy-product" @click="update_product = product.id">Update</button>
              </td>
              
              <td v-show="update_product == product.id">
                <input type="text" :placeholder="product.title" v-model="update_product_title"></input>
              </td>
              <td v-show="update_product == product.id">
                <input type="number" step="0.01" :placeholder="product.price" v-model='update_product_price'></input>                
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

  <div class="container" v-show="new_product == true">
    <form class="form-new-product" @submit.prevent="newProduct()">
      <div class="form-outline mb-2">                  
        <label>Title</label>
        <input type="text" class="form-control" v-model="new_product_title">
      </div>
      <div class="form-outline mb-4">                  
        <label>Price</label>
        <input type="number" step="0.01" class="form-control" v-model="new_product_price">
      </div>
      <input type="submit" class="btn-new-product" value="Create product"></input>
    </form>
  </div>  

</template>

<style>

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
    height: 45px;
  }

</style>