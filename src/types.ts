export interface Address {
  street: string,
  city: string,
  number: string,
  zip_code: string,
  country: string
  state: string
}

export interface UserType {
  id: number,
  email: string
}

export interface ChatsRoom {
  id: number, 
  buyer_id: number, 
  buyer_email: string,
  store_id: number,
  store_name: string,
  unread_messages: number
}