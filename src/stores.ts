import { Auth } from './auth'
import event from './event';
import { useRouter } from 'vue-router'
import router from '@/router';
import { ref } from 'vue'

const auth = new Auth()
const currentUser = auth.currentUser()

function replaceToken (token: string) {
  if (localStorage.getItem('token')) {
    localStorage.setItem('token', token)
  } else {
    sessionStorage.setItem('token',token)
  }		
}

async function getStore() {
  try {
    const response = await fetch (
      'http://127.0.0.1:3000/stores', {
      method: 'GET',
        headers: {
          "Accept": "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer" + ' ' + currentUser?.token
        },           
      })
    const data = await response.json()
    if(data.message == "Invalid token!") {
      const newTokenResponse = await auth.newToken()
      console.log(newTokenResponse)      
      if (newTokenResponse.token) {
        replaceToken(newTokenResponse.token)
        window.location.reload()
      } else {
        setTimeout(() => {
				event.emit("token_invalid", { 
					msg: 'Session closed, please log in again!',					
					alert: 'warning' 
          })
        }, 1000)
        auth.signOut()
        router.push('/sign_in')
		  }
    } else {
      return data      
    }      
  } catch (error) {    
    console.error('Erro ao carregar os dados:', error)
  }
}

async function newStore(name_store: string) {
  const body = {
    store: {
      name: name_store,
    }
  } 
  const response = await fetch (
    'http://127.0.0.1:3000/stores', {
    method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer" + ' ' + currentUser?.token
      },
      body: JSON.stringify(body)          
    })
  const data_store = await response.json()
  if(data_store) {
    setTimeout(() => {
      console.log('evento emitido')
      event.emit("stores_url", {
        msg: 'Store created successfully!',					
        alert: 'success' 
        })
      }, 1000)
    router.push('/stores')
  }   
}

export const stores = {
  getStore,
  newStore,
}