import { Auth } from './auth'
import event from './event';
import router from '@/router';

async function getStores() {
  const auth = new Auth()
  const currentUser = auth.currentUser()
  const response = await fetch (
    'http://127.0.0.1:3000/stores', {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer" + ' ' + currentUser?.token
      },           
    })
  return await response.json()
}

async function newStore(name_store: string, description: Text, category: string) {
  const auth = new Auth()
  const currentUser = auth.currentUser()
  const body = {
    store: {
      name: name_store,
      description: description,
      category: category
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
  return await response.json() 
}

async function editStore(name_store: string, store_id: any) {
  const auth = new Auth()
  const currentUser = auth.currentUser()
  const body = {
    store: {
      name: name_store,
    }
  }
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + '/stores/' + store_id, {
    method: 'PUT',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer" + ' ' + currentUser?.token
    },
    body: JSON.stringify(body)          
  })
  return await response.json()
}

async function getStore(store_id: any) {
  const auth = new Auth()
  const currentUser = auth.currentUser()
  const response = await fetch (
    'http://127.0.0.1:3000/stores/' + store_id, {
       method: "GET",
       headers: {
         "Accept": "application/json",
         "Content-Type": "application/json",
         "Authorization": "Bearer" + ' ' + currentUser?.token
       }
     }
   )
  return await response.json()
}

async function deleteStore(store_id: any) {
  const auth = new Auth()
  const currentUser = auth.currentUser() 
  const response = await fetch (
    import.meta.env.VITE_BASE_URL + '/stores/' + store_id, {
    method: "DELETE",
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer" + ' ' + currentUser?.token
    },        
  })
  return await response.json()
}


async function uploadImageStore(imagem: File, store_id: number) {
  const auth = new Auth()
  const currentUser = auth.currentUser() 
  if (imagem) {
    const formData = new FormData();
    formData.append('store[image]', imagem);
    const response = await fetch(
      import.meta.env.VITE_BASE_URL + '/stores/' + store_id, {
        method: 'PUT',
        headers: {
          "Accept": "application/json",
          "Authorization": "Bearer" + ' ' + currentUser?.token, 
        },
        body: formData,
      }
    )
  } else {
    console.error('Nenhuma imagem selecionada.');
  }
};

async function newAddress(store_id: any, street: any, number: any, cep: any, city: any, state: any) {
  const auth = new Auth()
  const currentUser = auth.currentUser() 
  const body = {
    address: {
      store_id: store_id,
      street: street,
      number: number,
      zip_code: cep,
      city: city,
      state: state,
      country: "Brazil"
    }
  }
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + '/addresses', {
      method: 'POST',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer" + ' ' + currentUser?.token
      },
      body: JSON.stringify(body)          
    } 
  )
  return await response.json()
}


export const stores = {
  getStore,
  getStores,
  newStore,
  editStore,
  deleteStore,
  uploadImageStore,
  newAddress
}