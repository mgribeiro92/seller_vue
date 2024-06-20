import { Auth } from '@/auth'

const auth = new Auth()
const current_user = auth.currentUser()

async function lastChat(store_id: any) {
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + `/last_chat?store=${store_id}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer" + ' ' + current_user?.token,
        "X-API-KEY": "fvXfHcO7vr8qIHuCb5wFsLcd8uE="
      }
    }
  )
  const chat_data = await response.json()
  return chat_data
}

async function getChats(store_id: any) {
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + `/chat_rooms?store=${store_id}`, {
      method: "GET",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json",
        "Authorization": "Bearer" + ' ' + current_user?.token,
        "X-API-KEY": "fvXfHcO7vr8qIHuCb5wFsLcd8uE="
      }
    }
  )
  return response.json()
}

async function getChat(chat_room_id: any) {
  const response = await fetch(
    import.meta.env.VITE_BASE_URL + `/chat_rooms/${chat_room_id}`, {
      method: "GET",
      headers: {
         "Accept": "application/json",
         "Content-Type": "application/json",
         "Authorization": "Bearer" + ' ' + current_user?.token,
         "X-API-KEY": "8MlfP2mtJVVnICGCJBQ2IeBvSbo="
      },
    }
  )
  return response.json()
}

export const chats = {
  lastChat,
  getChats,
  getChat
}