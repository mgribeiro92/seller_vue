<script setup lang="ts">

import { ref, onMounted } from 'vue'
import { products } from '@/products'
import { useRouter, useRoute } from 'vue-router';
import Message from './Message.vue';

const route = useRoute()
const update_product = ref()
const new_product = ref(false)
const products_data = ref()
const filter_products = ref('')

const update_product_title = defineModel<string>('update_title_product')
const update_product_price = defineModel<number>('update_price_product')
const update_product_inventory = ref()
const update_product_description = defineModel<string>('update_description_product')
const update_product_category = defineModel<number>('update_category_product')
const new_product_title = defineModel<string>('new_title_product')
const new_product_price = defineModel<number>('new_price_product')
const new_product_description = defineModel<number>('new_description_product')
const new_product_category = defineModel<number>('new_category_product')
const new_product_inventory = ref(0)

const msg = ref('')
const alert = ref('')
const localhost = import.meta.env.VITE_BASE_URL
const store_id = route.params.storeId

const total_pages = ref()
const current_page = ref(1)

onMounted(async () => {
  getProducts()
})

async function getProducts() {
  const response = await products.getProducts(store_id, current_page.value, filter_products.value)
  products_data.value = response.result.products
  total_pages.value = response.result.pagination.pages
  // store.value = await stores.getStore(store_id)
  console.log(products_data.value) 
}

const fileInput = ref()
let imageSelected: File

const handleFileInput = (event: any) => {
  imageSelected = event.target.files[0];
  console.log(imageSelected)
}

async function updatingProduct() {
  const update_response = await products.updateProduct(
    update_product_title.value, 
    update_product_price.value, 
    update_product_inventory.value, 
    update_product_description.value,
    update_product_category.value,
    update_product.value
  )
  console.log(update_response)
  if (update_response.status == 200) {
    getProducts()
    msg.value = "Produto atualizado com sucesso!"
    alert.value = "success"
    update_product.value = true
  }

  if(imageSelected) {
    products.uploadImageProduct(imageSelected, update_product.value)  
  }
}

async function newProduct() {
  const new_product_response = await products.createProduct(new_product_title.value || '', new_product_price.value, new_product_description.value, new_product_inventory.value, new_product_category.value, store_id)
  if(new_product_response) {
    msg.value = "Product was not created, try again",
    alert.value = "error"
  }
}

// function deletingProduct(product_id: number) {
//   products.deleteProduct(product_id)
// }

async function nextPage() {
  if (current_page.value < total_pages.value) {
    current_page.value++
    getProducts()
    console.log(filter_products.value)
  }
}

async function prevPage() {
  if (current_page.value > 1) {
    current_page.value--
    getProducts()
    console.log(filter_products.value)
  }
}

function changeProduct(product_id: any, product_title: any, product_price: any, product_inventory: any, product_description: any, product_category: any) {
  update_product.value = product_id
  update_product_title.value = product_title
  update_product_inventory.value = product_inventory
  update_product_price.value = product_price
  update_product_description.value = product_description
  update_product_category.value = product_category
}

const getClass = (product: any) => {
  return {
    'text-gray': product.inventory == 0,
  };
};

async function filterStore(filter: any) {
  current_page.value = 1
  filter_products.value = filter
  getProducts()
}

</script>

<template>

  <div class="products">
    <Message v-if="msg" :message="msg" :alert="alert"/>
    <div class="product-row">
      <h3>Produtos</h3>
      <button class="btn" @click="new_product = true">Novo produto!</button>
    </div>
    <p>* Para colocar um produto com indisponível altere o estoque para 0.</p>
    <h5>Categorias:</h5>
    <div class="categories">
      <div @click="filterStore('')" class="card-category">Todos</div>
      <div @click="filterStore('&filter=Comida')" class="card-category">Comidas</div>
      <div @click="filterStore('&filter=Bebida')" class="card-category">Bebidas</div>
      <div @click="filterStore('&filter=Doce')" class="card-category">Sobremesa</div>
    </div>
    <div v-show="new_product == false" class="tabela">       
      <table>      
        <thead>
          <tr>
            <th>Imagem</th>
            <th>Nome</th>
            <th>Descrição</th>
            <th>Preço</th>
            <th>Categoria</th>
            <th>Estoque</th>
            <th v-show="!update_product">Status</th>
            <th v-show="update_product">Atualizar</th>
            <th v-show="!update_product">Atualizar</th>
            <th v-show="update_product">Imagem</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in products_data" :key="product.id" :class="getClass(product)">

            <td>
              <img v-if="product.image_url" :src="localhost + product.image_url">
              <img v-else src="../assets/dummy-image-square-1.png">
            </td>
            <td v-show="update_product != product.id">{{ product.title }}</td> 
            <td v-show="update_product != product.id">{{ product.description }}</td>              
            <td v-show="update_product != product.id">{{ product.price }}</td>
            <td v-show="update_product != product.id">{{ product.category }}</td>
            <td v-show="update_product != product.id">{{ product.inventory}}</td>  
            <td v-show="update_product != product.id">
              <div v-if="product.inventory > 0">Disponível</div>
              <div v-else>Indisponível</div>
            </td> 
            <td v-show="update_product != product.id">
              <button class="btn-edit-destroy-product" @click="changeProduct(product.id, product.title, product.price, product.inventory, product.description, product.category)">Atualizar</button>
            </td>            

            <td v-show="update_product == product.id">
              <input type="text" :placeholder="product.title" v-model="update_product_title"></input>
            </td>
            <td v-show="update_product == product.id">
              <textarea type="text" :placeholder="product.description" v-model="update_product_description"></textarea>
            </td>
            <td v-show="update_product == product.id">
              <input type="number" step="0.01" :placeholder="product.price" v-model='update_product_price'></input>                
            </td>
            <td v-show="update_product == product.id">
              <select class="form-control" v-model='update_product_category'>
                <option>Comida</option>
                <option>Bebida</option>
                <option>Doce</option>
              </select>                
            </td>
            <td v-show="update_product == product.id">
              <input type="number" v-model='update_product_inventory'></input>                
            </td>                 
            <td v-show="update_product == product.id">
              <img class="btn-confirmation" style="margin-right: 10px" @click="update_product = false" src="../assets/botao-x.png" alt="">
              <img class="btn-confirmation" @click="updatingProduct()" src="../assets/verificar.png" alt="">
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
          <label>Nome</label>
          <input type="text" class="form-control" v-model="new_product_title">
        </div>
        <div class="form-outline mb-4">                  
          <label>Preço</label>
          <input type="number" step="0.01" class="form-control" v-model="new_product_price">
        </div>
        <div class="form-outline mb-4">                  
          <label>Descrição</label>
          <textarea class="form-control" v-model="new_product_description"></textarea>
        </div>
        <div class="form-outline mb-4">                  
          <label>Categoria</label>
          <select class="form-control" v-model='new_product_category'>
            <option>Comida</option>
            <option>Bebida</option>
            <option>Doce</option>
          </select> 
        </div>
        <div class="form-outline mb-4">                  
          <label>Estoque</label>
          <input type="number" class="form-control" v-model="new_product_inventory">
        </div>
        <input type="submit" class="btn" value="Criar produto!"></input>
        
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

  .text-gray {
    color: gray;
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
  
  .categories {
    display: flex;
    gap: 50px;
    margin-left: 10px;
  }

  .card-category {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    border-radius: 10px;
    padding: 10px;
  }

  .card-category:hover {
    cursor: pointer;
    transform: translateY(-8px);
    transition: transform 0.3s ease
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