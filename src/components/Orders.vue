<script setup lang="ts">

import { Auth } from "@/auth"
import { ref, onMounted } from "vue";
import { orders } from '@/orders'
import { stores } from '@/stores'
import draggable from 'vuedraggable';

const auth = new Auth()
const stores_data = ref()
const orders_data = ref()
const orders_created = ref([])
const orders_accepted = ref([])
const orders_rejected = ref([])
const orders_delivery = ref([])
const orders_finished = ref([])


onMounted(async () => {
  auth.verifyToken()
  try {
    await auth.validToken()    
  } finally {
    stores_data.value = await stores.getStore()
    orders_data.value = await orders.getOrders(4)
    orders_created.value = orders_data.value.filter((item: { state: string; }) => item.state === 'created')
    orders_accepted.value = orders_data.value.filter((item: { state: string; }) => item.state === 'accepted')
  }
})

async function gettingOrders(event: any)  {
  const storeId = event.target.value;
  console.log(storeId)
  orders_data.value = await orders.getOrders(4)
}

function dragAdd(event: any) {
  const listName = event.to.id
  const itemId = event.item.id
  console.log(listName)
  console.log(itemId)
}

function transformarData(dataString: string | number | Date) {
  const data = new Date(dataString);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  return data.toLocaleString('pt-BR', options);
}

</script>

<template>

  <div class="container">
    <h3>Orders</h3>    

    <select class="form-select" @change="gettingOrders">
      <option selected disabled>Select a store!</option>
      <option v-for="store in stores_data" :key = "store.id" :value="store.id">
        {{store.name }}
      </option>          
    </select> 
    
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
          <div :id="order.id" class="card-drag yellow">
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
        id="accepted" 
        :options="{ put: true }"
        group="orders"
        :animation="300"
        @add="dragAdd">
        <template #item="{ element: order }">
          <div :id="order.id" class="card-drag blue">
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
        id="accepted" 
        :options="{ put: true }"
        group="orders"
        :animation="300"
        @add="dragAdd">
        <template #item="{ element: order }">
          <div :id="order.id" class="card-drag purple">
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
        id="accepted" 
        :options="{ put: true }"
        group="orders"
        :animation="300"
        @add="dragAdd">
        <template #item="{ element: order }">
          <div :id="order.id" class="card-drag green">
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
        id="accepted" 
        :animation="300">
        <template #item="{ element: order }">
          <div :id="order.id" class="card-drag red">
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
    margin: 5px;
    padding: 10px;
  }

  .card-drag:hover {
    cursor: pointer;
  }

  .created {
    background-color: #ffffb2;
    color: #ffa500;
    border-color: #ffff7f;
  }

  .accepted {
    color: #3232ff;
    background-color: #b2b2ff;
    border-color: #7f7fff;
  }

  .delivery {
    background-color: #d8b2d8;
    color: #800080;
    border-color: #bf7fbf;
  }

  .finished {
    color: #198c19;
    background-color: #b2d8b2;
    border-color: #7fbf7f;
  }

  .rejected {
    color: #cc0000;
		background-color: #ffb2b2;
		border-color: #ff7f7f;
  }

  .red {
		/* color: #cc0000;
		background-color: #ffb2b2;
		border-color: #ff7f7f; */
    border-left: 2px solid #cc0000;
    border-bottom: 2px solid #cc0000;
	}
  
  .blue {
    /* color: #3232ff;
    background-color: #b2b2ff;
    border-color: #7f7fff; */
    border-left: 2px solid #3232ff;
    border-bottom: 2px solid #3232ff;
  }

  .green {
    /* color: #198c19;
    background-color: #b2d8b2;
    border-color: #7fbf7f; */
    border-left: 2px solid #198c19;
    border-bottom: 2px solid #198c19;
  }

  .yellow {
    /* background-color: #ffffb2;
    color: #ffa500;
    border-color: #ffff7f; */
    border-left: 2px solid #ffa500;
    border-bottom: 2px solid #ffa500;
  }

  .purple {
    /* background-color: #d8b2d8;
    color: #800080;
    border-color: #bf7fbf; */
    border-left: 2px solid #800080;
    border-bottom: 2px solid #800080;
  }

  .form-select {
    width: 500px;
  }

</style>