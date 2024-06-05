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

async function newStore(name_store: string) {
  const auth = new Auth()
  const currentUser = auth.currentUser()
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
      event.emit("stores_url", {
        msg: 'Store created successfully!',					
        alert: 'success' 
        })
      }, 1000)
    router.push('/stores')
  }   
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

async function getAddress(cep: any) {
  fetch('https://viacep.com.br/ws/01001000/json/')
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok ' + response.statusText);
    }
    return response.json(); // Tenta analisar a resposta como JSON
  })
  .then(data => {
    console.log(data); // Processa os dados JSON
  })
  .catch(error => {
    console.error('There has been a problem with your fetch operation:', error);
  });
}


export const stores = {
  getStore,
  getStores,
  newStore,
  editStore,
  deleteStore,
  uploadImageStore,
  getAddress
}