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
const remember = defineModel<boolean>('remember', {default: true})
const awaiting = ref(false)

const msg =  ref('')
const alert = ref('')

onMounted(() => {
	event.on("token_invalid", (dados: any) => {
		msg.value = dados.msg
		alert.value = dados.alert  
	})
	event.on("logged_in", (dados: any) => {
		msg.value = dados.msg
		alert.value = dados.alert  
	})
}) 

function onSubmit() {
	const auth = new Auth(remember.value)
  awaiting.value = true
  auth.signIn(email.value || '', password.value || '', () => {
		awaiting.value = false		
		console.log('sucesso login')		
		setTimeout(() => {
			event.emit("sign_in", { 
				msg: 'Successful authentication!',					
				alert: 'success' 
			})
			console.log('timeout lancado') 
		}, 1000)
		router.push({name: 'home'})
    }, 
		(json: any) => {
			awaiting.value = false				
			msg.value = json.message
			alert.value = 'error'																																	
		}
	)
}

</script>

<template>

	<div class="header">
		<div style="width: 400px">
			<Message v-show="msg" :message="msg" :alert="alert"/>
		</div>
		<div class="login">			
			<h2>Welcome to delivery for Seller!</h2>
			<p>This application is for sellers only!</p>  		   						
			<form class="form-login" @submit.prevent="onSubmit">       
				<h2>Login</h2>                                
				<div class="form-outline mb-2">                  
					<label>Email</label>
					<input type="email" class="form-control" v-model="email">
				</div>           
				
				<div class="form-outline mb-2">                    
					<label>Password</label>
					<input type="password" class="form-control" v-model="password">
				</div>
				<div class="form-group form-check">
					<input type="checkbox" class="form-check-input" v-model="remember">
					<label class="form-check-label">Remember me</label>
				</div>            
				<input v-show="!awaiting" type="submit" class="btn-login" value="Login"></input> 				           
			</form>
			<p>If you don't have an account: <RouterLink to="/sign_up">Criar conta!</RouterLink></p>
		</div>
	</div>

</template>

<style scoped> 

	.header {
		display: flex;
		align-items: center;
		justify-content: right;
		height: 100vh;
		background-image: url('../assets/background-seller.png');
    background-size: cover
	}

	.login {
		width: 400px;    
		opacity: 1.0;
    border-radius: 20px;
    background-color: white;    
    padding: 40px 20px;
    margin-right: 120px;
    box-shadow: 0px 4px 30px rgba(0, 0, 0, 0.1);		
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
		
	.btn-login {    
		padding: 0px 10px;
		margin: 10px 0px;  
		color: #421010;
		background-color: white;
		border-radius: 4px;
		cursor: pointer;
		height: 35px;
		border: 1px solid #421010;
	}

	.btn-login:hover {
		color: white; 
		background-color: #421010;
	}
 </style>