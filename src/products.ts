import { Auth } from './auth'

const auth = new Auth()
const currentUser = auth.currentUser()

async function getProducts(store_id: any) {
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + '/products/store/' + store_id, {
      method: 'GET',
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer" + ' ' + currentUser?.token
      },
    }
  )
  return await response.json()
}

async function createProduct(product_title: string, product_price: any, store_id: any) {
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

async function uploadImageProduct(image: File, product_id: number) {
  const formData = new FormData()
  formData.append('product[image_product]', image);
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + '/products/' + product_id, {
      method: 'PUT',
      headers: {
        "Accept": "application/json",
        "Authorization": "Bearer" + ' ' + currentUser?.token, 
      },
      body: formData,
    }
  )
}

export const products = {
  getProducts,
  updateProduct,
  createProduct,
  deleteProduct,
  uploadImageProduct
}