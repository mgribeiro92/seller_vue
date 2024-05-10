import { Auth } from './auth'


async function getOrders(store_id: any) {
  const auth = new Auth()
  const currentUser = auth.currentUser()
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + '/orders_seller/' + store_id, {
    method: 'GET',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer" + ' ' + currentUser?.token
    },       
  })
  return await response.json()
}

export const orders = {
  getOrders
}

