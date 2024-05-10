import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignInView from '../views/SignInView.vue'
import StoresView from '../views/StoresView.vue'
import ProductsView from '../views/ProductsView.vue'
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
      path: '/stores/:storeId/products',
      name: 'products',      
      component: ProductsView,        
    },  
    {
      path: '/orders',
      name: 'orders',      
      component: OrdersView,        
    },  
  ]
})

export default router
