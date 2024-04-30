import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignInView from '../views/SignInView.vue'
import StoresView from '../views/StoresView.vue'
import ProductsView from '../views/ProductsView.vue'

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
  ]
})

export default router
