<script setup lang="ts">

import router from '@/router';
import { ref } from 'vue';
import { Auth } from '@/auth'

const auth = new Auth()

const email = defineModel<string>('email')
const password =  defineModel<string>('password')
const remember = defineModel<boolean>('remember', {default: true})
const awaiting = ref(false)

function onSubmit() {
	let auth = new Auth(remember.value)
  awaiting.value = true
  auth.signIn(email.value || '', password.value || '', () => {
		awaiting.value = false
		router.push('/')
    }, 
		(response) => {
			awaiting.value = false
			console.log(response)
			response.json().then((json) => {				
				console.log(json)
			})																														
		}
	)
}

</script>

<template>
<header>
	<div>
		<!-- <Message v-show="msg" :message="msg" :alert="alert"/> -->		
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
			<p>If you don't have an account: </p>	
		</div>
	</div>
</header>
</template>

<style scoped> 

	header {
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