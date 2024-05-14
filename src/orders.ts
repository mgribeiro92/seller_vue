import { Auth } from './auth'
const auth = new Auth()
const currentUser = auth.currentUser()

async function getOrders(store_id: any) {
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

async function changeState(state: string, product_id: number) {
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + '/orders/' + state + '/' + product_id, {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer" + ' ' + currentUser?.token
    },       
  })
  return await response.json()
}

export const orders = {
  getOrders,
  changeState
}

