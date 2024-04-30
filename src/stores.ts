import { Auth } from './auth'
import event from './event';
import { useRouter } from 'vue-router'
import { ref } from 'vue'

function replaceToken (token: string) {
  if (localStorage.getItem('token')) {
    localStorage.setItem('token', token)
  } else {
    sessionStorage.setItem('token',token)
  }		
}

async function getStore() {
  const router = useRouter()
  const auth = new Auth()
  const currentUser = auth.currentUser()
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
        getStore()
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
      console.log(data)
    }      
  } catch (error) {    
    console.error('Erro ao carregar os dados:', error)
  }
}

function newStore() {
  const router = useRouter()
  setTimeout(() => {
    event.emit("stores", { 
      msg: 'Store created successfully!',					
      alert: 'success' 
    })
    console.log('timeout lancado') 
  }, 1000)
  router.push({name: 'stores'}) 
}

export const stores = {
  getStore,
  newStore
}