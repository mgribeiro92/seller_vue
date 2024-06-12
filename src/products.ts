import { Auth } from './auth'

async function getProducts(store_id: any, page: any, filter: any) {
  const url = import.meta.env.VITE_BASE_URL + '/products/store/' + store_id + '/?page=' + page + filter
  console.log(url)
  const auth = new Auth()
  const currentUser = auth.currentUser()
  const response = await fetch(
    url, {
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

// async function getProductsSearch(store_id: any, page: any, filter: any) {
//   const url = import.meta.env.VITE_BASE_URL + '/products/store/' + store_id + '/?page=' + page + filter
//   const auth = new Auth()
//   const currentUser = auth.currentUser()
//   const response = await fetch(
//     url, {
//       method: 'GET',
//       headers: {
//         "Accept": "application/json",
//         "Content-Type": "application/json",
//         "Authorization": "Bearer" + ' ' + currentUser?.token
//       },
//     }
//   )
//   return await response.json()
// }

async function createProduct(product_title: string, product_price: any, product_description: any, product_inventory: any, product_category: any, store_id: any) {
  const auth = new Auth()
  const currentUser = auth.currentUser()
  const body = {
    product: {
      title: product_title,
      price: product_price,
      description: product_description, 
      inventory: product_inventory,
      category: product_category,
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

async function updateProduct(product_title: any, product_price: any, product_inventory: any, product_description: any, product_category: any, product_id: any) {
  const auth = new Auth()
  const currentUser = auth.currentUser()
  const body = {
    product: {
      title: product_title,
      price: product_price,
      inventory: product_inventory,
      description: product_description,
      category: product_category
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
  return response
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
  const auth = new Auth()
  const currentUser = auth.currentUser()
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