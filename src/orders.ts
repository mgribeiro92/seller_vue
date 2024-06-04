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

async function changeState(state: string, order_id: number) {
  const auth = new Auth()
  const currentUser = auth.currentUser()

  const body = {
    order: {
      id: order_id,
      state: state,
    }
  }
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + '/change_state', {
    method: 'POST',
    headers: {
      "Accept": "application/json",
      "Content-Type": "application/json",
      "Authorization": "Bearer" + ' ' + currentUser?.token
    },
    body: JSON.stringify(body)     
  })
  return response
}

export const orders = {
  getOrders,
  changeState
}

