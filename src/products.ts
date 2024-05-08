import { Auth } from './auth'
import event from './event';
import router from '@/router';

async function createProduct(product_title: string, product_price: any, store_id: any) {
  const auth = new Auth()
  const currentUser = auth.currentUser()
  const body = {
    product: {
      title: product_title,
      price: product_price,
      store_id: store_id
    }
  }
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + '/products', {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer" + ' ' + currentUser?.token
    },
    body: JSON.stringify(body)          
  })
  if(response.ok) {    
    window.location.reload()
  } else {
    return response
  }
}

async function updateProduct(product_title: any, product_price: number, product_id: any, store_id: any) {
  const auth = new Auth()
  const currentUser = auth.currentUser()
  const body = {
    product: {
      title: product_title,
      price: product_price
    }
  }
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + '/products/' + product_id, {
    method: 'PUT',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer" + ' ' + currentUser?.token
    },
    body: JSON.stringify(body)          
  })
  if(response.status == 200) {    
    window.location.reload()
  }
}

async function deleteProduct(product_id: any) {
  console.log('deletando o produto')
  const auth = new Auth()
  const currentUser = auth.currentUser()
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + '/products/' + product_id, {
    method: 'DELETE',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer" + ' ' + currentUser?.token
    },      
  })
  window.location.reload()
}

export const products = {
  updateProduct,
  createProduct,
  deleteProduct
}