import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignInView from '../views/SignInView.vue'
import StoresView from '../views/StoresView.vue'
import StoreSelectedView from '../views/StoreSelectedView.vue'
import OrdersView from '../views/OrdersView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,     
    },
    {
      path: '/sign_in',
      name: 'sign_in',
      component: SignInView,
      meta: { showNavBar: false }
    },
    {
      path: '/stores',
      name: 'stores',
      component: StoresView,     
    },
    {
      path: '/stores/:storeId',
      name: 'store',      
      component: StoreSelectedView,        
    },  
    {
      path: '/orders',
      name: 'orders',      
      component: OrdersView,        
    },  
  ]
})

export default router
