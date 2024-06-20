<script setup lang="ts">

import { Auth } from "@/auth"
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from 'vue-router';
import { orders } from '@/orders'
import { stores } from '@/stores'
import draggable from 'vuedraggable';
import { products } from "@/products";
import Message from "./Message.vue";
import { fetchEventSource } from "@microsoft/fetch-event-source";

const auth = new Auth()
const store = ref({ id: 0, name: '', created_at: '', updated_at: '', image_url: '', products: [], update_at: '', url: '' });
const orders_data = ref()
const orders_created = ref([])
const orders_accepted = ref([])
const orders_rejected = ref([])
const orders_delivery = ref([])
const orders_finished = ref([])
const msg = ref('')
const alert = ref('')
const show_order = ref(false)
const selected_order = ref()

const router = useRouter()
const store_id = sessionStorage.getItem('store')
const localhost = "http://127.0.0.1:3000/"

auth.verifyToken()
try {
  auth.validToken()    
} finally {
  if (store_id) {
    getOrders()
  } else {
    router.push('/')
  }
}

async function getOrders() {
  store.value = await stores.getStore(store_id)
  orders_data.value = await orders.getOrders(store_id)
  // console.log(orders_data.value)
  orders_created.value = orders_data.value.filter((item: { state: string; }) => item.state === 'payment_success')
  orders_accepted.value = orders_data.value.filter((item: { state: string; }) => item.state === 'accepted')
  orders_delivery.value = orders_data.value.filter((item: { state: string; }) => item.state === 'delivery')
  orders_finished.value = orders_data.value.filter((item: { state: string; }) => item.state === 'finished')
  orders_rejected.value = orders_data.value.filter((item: { state: string; }) => item.state === 'rejected')
}

async function dragAdd(event: any) { 
  const state = event.to.id
  const order_id = event.item.id
  console.log(state)
  const response_orders = await orders.changeState(state, order_id)
  if (response_orders.status == 422) {
    msg.value = 'Pedido de numero ' + order_id + ' não pode ser movido para ' + state + '!'
    alert.value = "error"
  } else {
    msg.value = 'Pedido de numero ' + order_id + ' foi ser movido para ' + state + '!'
    alert.value = "success"
  }
  getOrders()
}

type DateTimeFormatOptions = any
function transformarData(dataString: string | number | Date) {
  const data = new Date(dataString);
  const options: DateTimeFormatOptions = { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' };
  return data.toLocaleString('pt-BR', options);
}

function showOrder(order_id: any) {
  selected_order.value = orders_data.value.find((order: { id: any; }) => order.id === order_id)
  console.log(selected_order.value)
  show_order.value = !show_order.value
}

const currentUser = auth.currentUser() 
fetchEventSource (
  import.meta.env.VITE_BASE_URL + '/stores/' + store_id + '/orders/new',{
    method: "GET",
    headers: {
      "Accept": "application/json",
      "X-API-KEY": import.meta.env.X_API_KEY,
      "Authorization": "Bearer" + ' ' + currentUser?.token
    },
    async onopen(response) {
      if (response.ok) {
        console.log('connected!')
        return
      }
    },
    onmessage(message) {
      if (message.event === "new-order") {
        let data = JSON.parse(message.data)
        console.log(data.order)
        console.log(data.order.length)
        if (data.order.length == 0) {
          msg.value = "Loja não tem novos pedidos!"
          alert.value = "warning"
        } else {
          msg.value = `Loja tem ${data.order.length} pedidos novos!`
          alert.value = "info"
          getOrders()
        }
      }
    },
  }
)


</script>

<template>
  
  <div class="orders">   
    <Message v-if="msg" :message="msg" :alert="alert"/>
    <div class="store-row">
      <h3>Pedidos</h3>         
    </div>
    <hr>
    <!-- <div>Pedidos dos ultimos 3 dias, clique aqui para mudar!</div> -->
  </div>
  
  <div class="orders-card container">
    <div class="card-col">   
      <h4 class="created">Novos</h4>
      <draggable 
        style="height: 100%" 
        v-model="orders_created" 
        :itemKey="(item: any) => item" 
        id="created" 
        :group="{ name: 'orders', put: false }"
        :animation="300" 
        @add="dragAdd">
        <template #item="{ element: order }">
          <div :id="order.id" class="card-drag created-card" @dblclick="showOrder(order.id)">
            <h5>Order {{ order.id }}</h5>
            <div v-for="order_item in order.order_items">
              <p>{{ order_item.amount }}x {{ order_item.product.title }} - R$ {{ order_item.price }}</p>
            </div>
            <!-- <p>Created: {{ transformarData(order.created_at) }}</p> -->
            <p>Pedido Pago</p>    
          </div>
        </template>
      </draggable>
    </div>
    
    <div class="card-col">   
      <h4 class='accepted'>Aceito</h4>
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
          <div :id="order.id" class="card-drag accepted-card" @dblclick="showOrder(order.id)">
            <h5>Order {{ order.id }}</h5>
            <div v-for="order_item in order.order_items">
              <p>{{ order_item.amount }}x {{ order_item.product.title }} - R$ {{ order_item.price }}</p>
            </div>
            <p>Pedido Aceito</p>          
          </div>
        </template>
      </draggable>
    </div>

    <div class="card-col">   
      <h4 class="delivery">Entrega</h4>
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
          <div :id="order.id" class="card-drag delivery-card" @dblclick="showOrder(order.id)">
            <h5>Order {{ order.id }}</h5>
            <div v-for="order_item in order.order_items">
              <p>{{ order_item.amount }}x {{ order_item.product.title }} - R$ {{ order_item.price }}</p>
            </div>
            <p>Pedido em Entrega</p>          
          </div>
        </template>
      </draggable>
    </div>

    <div class="card-col">   
      <h4 class="finished">Finalizado</h4>
      <draggable 
        style="height: 100%" 
        v-model="orders_finished" 
        :itemKey="(item: any) => item" 
        id="finished" 
        :options="{ put: true }"
        group="orders"
        :animation="300"
        @add="dragAdd">
        <template #item="{ element: order }">
          <div :id="order.id" class="card-drag finished-card" @dblclick="showOrder(order.id)">
            <h5>Order {{ order.id }}</h5>
            <div v-for="order_item in order.order_items">
              <p>{{ order_item.amount }}x {{ order_item.product.title }} - R$ {{ order_item.price }}</p>
            </div>
            <p>Pedido Finalizado</p>         
          </div>
        </template>
      </draggable>
    </div>

    <div class="card-col">   
      <h4 class="rejected">Rejeitado</h4>
      <draggable 
        style="height: 100%" 
        v-model="orders_rejected" 
        :itemKey="(item: any) => item"
        :group="{ name: 'orders', pull: false }"
        id="rejected" 
        :animation="300"
        @add="dragAdd">
        <template #item="{ element: order }">
          <div :id="order.id" class="card-drag rejected-card" @dblclick="showOrder(order.id)">
            <h5>Order {{ order.id }}</h5>
            <div v-for="order_item in order.order_items">
              <p>{{ order_item.amount }}x {{ order_item.product.title }} - R$ {{ order_item.price }}</p>
            </div>
            <p>Pedido Rejeitado</p>           
          </div>
        </template>
      </draggable>
    </div>

    <div v-if="show_order" class="modal">  
    <div class="modal-content">
      <span class="close-btn" @click="show_order = false">&times;</span>    
      <h4>Pedido: {{selected_order.id}}</h4>
      <p>Comprador: {{ selected_order.buyer_id }}</p>
      <div v-for="order_item in selected_order.order_items">
        <p>{{ order_item.amount }}x {{ order_item.product.title }} - R$ {{ order_item.price }}</p>        
      </div>
      <p>Criado em: {{ transformarData(selected_order.created_at) }}</p>
      <p>Atualizado em: {{ transformarData(selected_order.updated_at) }}</p>
      <p>Estado: {{ selected_order.state }}</p>
    </div>
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

  .orders {
    padding: 10px;
  }

  .orders-card{
    display: flex;
  }

  .card-col{
    flex: 1;
    width: auto;
  }

  .card-drag {
		border: 1px solid transparent;
		border-radius: 5px;
    margin: 10px 3px;
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

  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    font-size: 24px;
    color: #888;
  }

  .close-btn:hover {
    color: #000;
  }

</style>