<script setup lang="ts">

import { Auth } from "@/auth"
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router';
import { orders } from '@/orders'
import { stores } from '@/stores'
import draggable from 'vuedraggable';
import { product } from "@/products";

const auth = new Auth()
const store = ref({ id: 0, name: '', created_at: '', updated_at: '', image_url: '', products: [], update_at: '', url: '' });
const orders_data = ref()
const orders_created = ref([])
const orders_accepted = ref([])
const orders_rejected = ref([])
const orders_delivery = ref([])
const orders_finished = ref([])

const route = useRoute()
const store_id = route.params.storeId
const localhost = "http://127.0.0.1:3000/"

onMounted(async () => {
  auth.verifyToken()
  try {
    await auth.validToken()    
  } finally {
    store.value = await stores.getStoreAndProducts(store_id)
    orders_data.value = await orders.getOrders(store_id)
    orders_created.value = orders_data.value.filter((item: { state: string; }) => item.state === 'created')
    orders_accepted.value = orders_data.value.filter((item: { state: string; }) => item.state === 'accepted')
  }
})

async function dragAdd(event: any) {
  const state = event.to.id
  const product_id = event.item.id
  // try {
  //   await orders.changeState(state, product_id)
  // } finally {
  //   window.location.reload()
  // }
  console.log(state)
  console.log(product_id)
}

type DateTimeFormatOptions = any
function transformarData(dataString: string | number | Date) {
  const data = new Date(dataString);
  const options: DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  return data.toLocaleString('pt-BR', options);
}

</script>

<template>

  <div class="container">

    <div class="store-row">
      <div class="store-name">
        <img v-if="store.image_url" :src="localhost + store.image_url">
        <h3>{{ store.name }} - Orders</h3>        
      </div>
      <div class="store-edit-destroy">
        <RouterLink class="btn-back-store" :to="{ name: 'store', params: { storeId: store.id }}">Back to Store</RouterLink>
      </div>      
    </div>
    <hr>
  </div>

  
  <div class="orders-card container">  
    
    <div class="card-col">   
      <h4 class="created">Created</h4>
      <draggable 
        style="height: 100%" 
        v-model="orders_created" 
        :itemKey="(item: any) => item" 
        id="created" 
        :group="{ name: 'orders', put: false }"
        :animation="300" 
        @add="dragAdd">
        <template #item="{ element: order }">
          <div :id="order.id" class="card-drag created-card">
            <h5>Order {{ order.id }}</h5>
            <p>Buyer: {{ order.buyer_id }}</p>
            <p>Created: {{ transformarData(order.created_at) }}</p>
            <p>State: {{ order.state }}</p>    
          </div>
        </template>
      </draggable>
    </div>
    
    <div class="card-col">   
      <h4 class='accepted'>Accepted</h4>
      <draggable 
        style="height: 100%" 
        v-model="orders_accepted" 
        :itemKey="(item: any) => item" 
        id="accept" 
        :options="{ put: true }"
        group="orders"
        :animation="300"
        @add="dragAdd">
        <template #item="{ element: order }">
          <div :id="order.id" class="card-drag accepted-card">
            <h5>Order {{ order.id }}</h5>
            <p>Buyer: {{ order.buyer_id }}</p>
            <p>Created: {{ transformarData(order.created_at) }}</p>
            <p>State: {{ order.state }}</p>           
          </div>
        </template>
      </draggable>
    </div>

    <div class="card-col">   
      <h4 class="delivery">Delivery</h4>
      <draggable 
        style="height: 100%" 
        v-model="orders_delivery" 
        :itemKey="(item: any) => item" 
        id="delivery" 
        :options="{ put: true }"
        group="orders"
        :animation="300"
        @add="dragAdd">
        <template #item="{ element: order }">
          <div :id="order.id" class="card-drag delivery-card">
            <h5>Order {{ order.id }}</h5>
            <p>Buyer: {{ order.buyer_id }}</p>
            <p>Created: {{ transformarData(order.created_at) }}</p>
            <p>State: {{ order.state }}</p>           
          </div>
        </template>
      </draggable>
    </div>

    <div class="card-col">   
      <h4 class="finished">Finished</h4>
      <draggable 
        style="height: 100%" 
        v-model="orders_finished" 
        :itemKey="(item: any) => item" 
        id="finish" 
        :options="{ put: true }"
        group="orders"
        :animation="300"
        @add="dragAdd">
        <template #item="{ element: order }">
          <div :id="order.id" class="card-drag finished-card">
            <h5>Order {{ order.id }}</h5>
            <p>Buyer: {{ order.buyer_id }}</p>
            <p>Created: {{ transformarData(order.created_at) }}</p>
            <p>State: {{ order.state }}</p>           
          </div>
        </template>
      </draggable>
    </div>

    <div class="card-col">   
      <h4 class="rejected">Rejected</h4>
      <draggable 
        style="height: 100%" 
        v-model="orders_rejected" 
        :itemKey="(item: any) => item"
        :group="{ name: 'orders', pull: false }"
        id="reject" 
        :animation="300"
        @add="dragAdd">
        <template #item="{ element: order }">
          <div :id="order.id" class="card-drag rejected-card">
            <h5>Order {{ order.id }}</h5>
            <p>Buyer: {{ order.buyer_id }}</p>
            <p>Created: {{ transformarData(order.created_at) }}</p>
            <p>State: {{ order.state }}</p>           
          </div>
        </template>
      </draggable>
    </div>

  </div>
</template>

<style scoped>

  h4 {
    text-align: center;
    border-radius: 5px;
  }

  p {
    margin: 0;
  }

  .orders-card{
    display: flex;
    justify-content: space-between;
  }

  .card-drag {
		border: 1px solid transparent;
		border-radius: 5px;
    margin: 10px 0px;
    padding: 10px;

  }

  .card-drag:hover {
    cursor: pointer;
  }

  .created {
    color: #ffd800;
    border-bottom: 2px solid #ffd800;
  }

  .created-card {
    border-left: 2px solid #ffd800;
    border-bottom: 2px solid #ffd800;
    background-color: rgba(255, 215, 0, 0.1)
  }

  .accepted {
    color: #5968e0;
    border-bottom: 2px solid #5968e0;
  }

  .accepted-card {
    border-left: 2px solid #5968e0;
    border-bottom: 2px solid #5968e0;
    background-color: rgba(89, 104, 224, 0.1)
  }

  .delivery {
    border-bottom: 2px solid #ed911f;
    color: #ed911f;
  }

  .delivery-card {
    border-left: 2px solid #ed911f;
    border-bottom: 2px solid #ed911f;
    background-color: rgba(255, 127, 14, 0.1)

  }

  .finished {
    border-bottom: 2px solid #2ecc71;
    color: #2ecc71;
  }

  .finished-card {
    border-left: 2px solid #2ecc71;
    border-bottom: 2px solid #2ecc71;
    background-color: rgba(46, 204, 113, 0.1)
  }

  .rejected {
		border-bottom: 2px solid #e11b16;
    color: #e11b16;
  }

  .rejected-card {
    border-left: 2px solid #e11b16;
    border-bottom: 2px solid #e11b16;
    background-color: rgba(225, 27, 22, 0.1);

  }

  .form-select {
    width: 500px;
  }

  .btn-back-store {    
		padding: 0px 10px;
		margin: 0px 0px;  
		color: #ed911f;
		background-color: white;
		border-radius: 4px;
		cursor: pointer;
		height: 30px;
    width: 120px;
		border: 1px solid #ed911f;
	}

  .btn-back-store:hover {
    color: white;
    background-color: #ed911f;
  }

</style>