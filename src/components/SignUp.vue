<script setup lang="ts">

import { useRouter } from 'vue-router'
import Message from '../components/Message.vue'
import { onMounted, ref } from 'vue';
import { Auth } from '@/auth'
import event from '@/event'

const auth = new Auth()
const router = useRouter()
const email = defineModel<string>('email')
const password =  defineModel<string>('password')
const password_confirmation = defineModel<string>('password_confirmation')
const address = ref(false)

const msg =  ref('')
const alert = ref('')
const cep = ref()
const address_street = ref()
const address_number = ref()
const address_city = ref()
const address_state = ref()
const user_id = ref()

onMounted(() => {
  console.log('montagem sign up')
}) 

async function onSubmit() {
  address.value = true
  // const response_sign_up = await auth.signUp(email.value || '', password.value || '', password_confirmation.value || '')
  // const user_id = response_sign_up.id
  user_id.value = 45
}

async function sendAddress(){
  const response_address = await auth.newAddress(user_id.value, address_street.value, address_number.value, cep.value, address_city.value, address_state)
  console.log(response_address)
}


async function fetchAddress() {
  if (cep.value.length == 8) {
    console.log('CEP completo:', cep.value)
    const response = await fetch(
      "https://viacep.com.br/ws/" + cep.value + "/json/", {
        method: "GET"
      }
    )
    const address = await response.json()
    if (response.ok) {
      address_street.value = address.logradouro
      address_city.value = address.localidade
      address_state.value = address.uf
    }   
  }
}


</script>

<template>
  <header>    
    <div v-if="!address"class="sign-up">
      <Message v-show="msg" :message="msg" :alert="alert"/>	
      <form class="form-signup" @submit="onSubmit">           
        <h2>Sign Up</h2>                                
        <div class="form-outline mb-2">                  
          <label>Email</label>
          <input type="text" class="form-control" v-model="email">
        </div>        
        <div class="form-outline mb-2">                    
          <label>Password</label>
          <input type="password" class="form-control" v-model="password">
        </div> 
        <div class="form-outline mb-2">                    
          <label>Password Confirmation</label>
          <input type="password" class="form-control" v-model="password_confirmation">
        </div>
        <input type="submit" class="btn-sign-up" value="Sign Up"></input>		           
      </form>
      <p>Se ja tiver uma conta, faça <RouterLink :to="{name: 'sign_in'}">login!</RouterLink></p>
    </div>

    <div v-else class="address">
      <Message v-show="msg" :message="msg" :alert="alert"/>	
      <div class="form-outline mb-2">
        <h5>Endereço</h5>                 
        <label>CEP</label>
        <input style="width: 200px" class="form-control" maxlength="8" v-model="cep" @input="fetchAddress" @keyup.enter="fetchAddress">
        <small class="form-text text-muted">Por favor coloque seu cep para continuar.</small>
      </div>
      <div class="address-number">
        <div class="form-outline mb-2 logradouro">
          <label>Logradouro</label>
          <input class="form-control" type="text" :placeholder="address_street" readonly>
        </div>
        <div class="form-outline mb-2 number">
          <label>Número</label>
          <input class="form-control" type="text" v-model="address_number">
        </div>          
      </div>
      <div class="address-number">
        <div class="form-outline mb-2 logradouro">
          <label>Cidade</label>
          <input class="form-control" type="text" :placeholder="address_city" readonly>
        </div>
        <div class="form-outline mb-2 number">
          <label>Estado</label>
          <input class="form-control" type="text" :placeholder="address_state" readonly>
        </div>          
      </div>
      <button @click="sendAddress" class="btn-sign-up">Concluir Cadastro</button>  
    </div>
  </header>
</template>



<style scoped> 

	header {
		display: flex;
		align-items: center;
		justify-content: center;
    height: 100vh;
    border: 2px solid blue; 
	}

	.sign-up {
		width: 400px;    
    border-radius: 20px; 
    padding: 20px;
    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
    border: 2px solid #fa9901;
	}

  .address {
    width: 400px;    
    border-radius: 20px; 
    padding: 20px;
    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);
    border: 2px solid #fa9901;
  }

	h2 {
		color: #fa9901
	}
	
	p {
		color: #421010
	}

	label {
		color: #421010
	}
		
	.btn-sign-up {    
		padding: 0px 10px;
		margin: 10px 0px;  
		color: #421010;
		background-color: white;
		border-radius: 4px;
		cursor: pointer;
		height: 35px;
		border: 1px solid #421010;
	}

	.btn-sign-up:hover {
		color: white; 
		background-color: #421010;
	}
 </style>