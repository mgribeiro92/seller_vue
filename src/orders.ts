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

async function changeState(state: string, order_id: number) {
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
  const resposta = await response.json()
  console.log(resposta)
}

export const orders = {
  getOrders,
  changeState
}

