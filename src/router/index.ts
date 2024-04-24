import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignInView from '../views/SignInView.vue'
import StoresView from '../views/StoresView.vue'
import ProductsView from '../views/ProductsView.vue'
import { ref } from 'vue'
import { Auth } from '@/auth'

const auth = new Auth()
const isLoggedIn = auth.isLoggedIn()

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
      beforeEnter (_, __, next) { 
        if (isLoggedIn) {       
          next();
          return;
        }
        next('/sign_in')
      }         
    },    
  ]
})

export default router
