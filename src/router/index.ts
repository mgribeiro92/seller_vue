import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignInView from '../views/SignInView.vue'
import SignUpView from '../views/SignUpView.vue'
import StoresView from '../views/StoresView.vue'
import StoreSelectedView from '../views/StoreSelectedView.vue'
import OrdersView from '../views/OrdersView.vue'
import ProductsView from '../views/ProductsView.vue'
import Chat from '../components/Chat.vue'

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
      path: '/sign_up',
      name: 'sign_up',
      component: SignUpView,
      meta: { showNavBar: false }
    }, 
    {
      path: '/stores/:storeId',
      name: 'store',      
      component: StoreSelectedView,        
    },
    {
      path: '/products/:storeId',
      name: 'products',      
      component: ProductsView,        
    }, 
    {
      path: '/orders/:storeId',
      name: 'orders',      
      component: OrdersView,        
    },
    {
      path: '/chat',
      name: 'chat',      
      component: Chat,        
    },  
  ]
})

export default router
