<script setup lang="ts">

import { ref, onMounted } from 'vue'
import { products } from '@/products'
import { useRouter, useRoute } from 'vue-router';

const route = useRoute()
const update_product = ref(null)
const new_product = ref(false)
const products_data = ref()

const update_product_title = defineModel<string>('update_title_product')
const update_product_price = defineModel<number>('update_price_product')
const new_product_title = defineModel<string>('new_title_product')
const new_product_price = defineModel<number>('new_price_product')

const msg = ref('')
const alert = ref('')
const localhost = import.meta.env.VITE_BASE_URL
const store_id = route.params.storeId

const total_pages = ref()
const current_page = ref(1)

onMounted(async () => {
  const response = await products.getProducts(store_id, current_page.value)
  products_data.value = response.result.products
  total_pages.value = response.result.pagination.pages
  // store.value = await stores.getStore(store_id)
  console.log(products_data.value) 

})

const fileInput = ref()
let imageSelected: File

const handleFileInput = (event: any) => {
  imageSelected = event.target.files[0];
  console.log(imageSelected)
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
  if(imageSelected) {
    products.uploadImageProduct(imageSelected, product_id)  
  }
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

async function nextPage() {
  if (current_page.value < total_pages.value) {
    current_page.value++
    const response = await products.getProducts(store_id, current_page.value)
    products_data.value = response.result.products
  }
}

async function prevPage() {
  if (current_page.value > 1) {
    current_page.value--
    const response = await products.getProducts(store_id, current_page.value)
    products_data.value = response.result.products
  }
}

</script>


<template>

  <!-- <div v-if="!products">
    <div class="row">
      <p class="col">Não existe produtos para essa loja!</p>
      <button class="col-4 btn-new-product" @click="new_product = true">New product</button>
    </div>    
  </div> -->
  <div class="products">
    <div class="product-row">
      <div class="store-name">Produtos</div>
      <button class="btn-new-product" @click="new_product = true">New product</button>
    </div>  
    <div v-show="new_product == false" class="tabela">       
      <table>      
        <thead>
          <tr>
            <th style="width: 120px"></th>
            <th style="width: 200px">Name</th>
            <th style="width: 100px">Price</th>
            <th style="width: 120px">Update</th>
            <th v-show="!update_product" style="width: 120px">Delete</th>
            <th v-show="update_product" style="width: 120px">Send Image</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products_data" :key="product.id">

            <td>
              <img v-if="product.image_url" :src="localhost + product.image_url">
              <img v-else src="../assets/dummy-image-square-1.png">
            </td>
            <td v-show="update_product != product.id">{{ product.title }}</td>              
            <td v-show="update_product != product.id">{{ product.price }}</td>
            <td v-show="update_product != product.id">
              <button class="btn-edit-destroy-product" @click="update_product = product.id">Update</button>
            </td>
            <td v-show="update_product != product.id">
              <button @click="deletingProduct(product.id)" class="btn-edit-destroy-product">Delete</button>
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
            <td v-if="update_product == product.id">
              <input type="file" ref="fileInput" class="form-control-file" @change="handleFileInput">
            </td>              
          </tr>            
        </tbody>
      </table> 
      <div class="pagination" v-show="total_pages > 1">
        <button @click="prevPage" :disabled="current_page == 1">Anterior</button>
        <span>{{ current_page }}</span>
        <button @click="nextPage" :disabled="current_page == total_pages">Próxima</button>
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
          <input type="number" step="0.01" class="form-control" v-model="new_product_price">
        </div>
        <input type="submit" class="btn-new-product" value="Create product"></input>
        
      </form>
    </div>  
  </div>
</template>

<style scoped>

  img {
      width: 80px;
      height: 80px;
      border-radius: 50%;
    }

  .products {
    padding: 10px;
  }

  .product-row {
    display: flex;
    align-items: center;
    gap: 200px;
  }


  .form-new-product {
    width: 300px;
  }
  
  .pagination {
    display: flex;
    justify-content: center;
    gap: 20px;
  }
  
  .btn-new-product {
		padding: 0px 10px;
		color: #a32020;
		background-color: white;
		border-radius: 4px;
		cursor: pointer;
		height: 30px;
    width: 150px;

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