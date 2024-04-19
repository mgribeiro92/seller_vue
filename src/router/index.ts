import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import SignInView from '../views/SignInView.vue'
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
      beforeEnter (_, __, next) { 
        if (isLoggedIn) {       
          next();
          return;
        }
        next('/sign_in')
      } 
    },
    {
      path: '/sign_in',
      name: 'sign_in',
      component: SignInView,
      meta: { showNavBar: false }
    },    
  ]
})

export default router
