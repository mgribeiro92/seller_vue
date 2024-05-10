import { createStorage, type SimpleStorage } from './storage'
import router from '@/router';
import event from '@/event'

class Auth {
	private storage: SimpleStorage

	constructor(persistent = false) {
		this.storage = createStorage(persistent)
	}

	private getFallback(key: string) : string | null {
		let transient = createStorage(false)
		let persistent = createStorage(true)

		return transient.get(key) || persistent.get(key)
	}

	success(response: Response, onSuccess: () => void) {
		response.json().then((json) => {
			this.storage.store('token', json.token)
			this.storage.store('email', json.email)
			this.storage.store('refresh_token', json.refresh_token)
			onSuccess()
		})
	}

	failure(response: Response, onFailure: (json: any) => void) {
		response.json().then((json => {
			console.log(json)
			onFailure(json)
		}))				
	}

	currentUser() {
		if(!this.isLoggedIn()) {
			return null
		}

		return {
			email: this.getFallback('email'),
			token: this.getFallback('token'),
			refresh_token: this.getFallback('refresh_token')
		}
	}

	isLoggedIn() {
		return Boolean(this.getFallback('token'))
	}

	signOut(andThen = () => {}) {
		let transient = createStorage(false)
		let persistent = createStorage(true)

		transient.remove('token')
		transient.remove('email')
		transient.remove('refresh_token')
		persistent.remove('token')
		persistent.remove('email')
		persistent.remove('refresh_token')

		andThen()
	}

	async signIn(email: string, password: string, onSuccess: () => void, onFailure: { (json: JSON): void }) {
		console.log("will sign in...")
		const body = {
			login: {
				email: email,
				password: password,
			}
		}
		const response = await fetch (
			import.meta.env.VITE_BASE_URL + '/sign_in', {
			method: "POST",
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
				"X-API-KEY": "fvXfHcO7vr8qIHuCb5wFsLcd8uE="
			},
			body: JSON.stringify(body)
		})	
		.then((response) => {
			if(response.ok) {
				this.success(response, onSuccess)
			}
			else {
				this.failure(response, onFailure)				
			}
		})				
	}

	async newToken() {
		const body = {
			refresh_token: this.getFallback('refresh_token')
		}
		const response = await fetch (
			import.meta.env.VITE_BASE_URL + '/new_token', {
				method: 'POST',
				headers: {
					"Accept": "application/json",
					"Content-Type": "application/json"
				},
				body: JSON.stringify(body)
			})
		return await response.json()		
	}

	verifyToken() {
		if (!this.isLoggedIn()) {
			setTimeout(() => {
				event.emit("logged_in", {
				msg: "Please log in to access delivery!",
				alert: "warning" 
				})
			}, 500)
			this.signOut()
			router.push('/sign_in')
		}
	}

	replaceToken (token: string) {
		if (localStorage.getItem('token')) {
			localStorage.setItem('token', token)
		} else {
			sessionStorage.setItem('token',token)
		}		
	}

	async validToken() {
		const response = await fetch (
		import.meta.env.VITE_BASE_URL + '/me', {
		method: 'GET',
			headers: {
				"Accept": "application/json",
				"Content-Type": "application/json",
				"Authorization": "Bearer" + ' ' + this.getFallback('token')
			},           
		})
    const data = await response.json()
		if(data.message == "Invalid token!") {
      const newTokenResponse = await this.newToken()   
      if (newTokenResponse.token) {
        this.replaceToken(newTokenResponse.token)
        window.location.reload()
      } else {
        setTimeout(() => {
				event.emit("token_invalid", { 
					msg: 'Session closed, please log in again!',					
					alert: 'warning' 
          })
        }, 1000)
        this.signOut()
        router.push('/sign_in')
		  }
    }
	}


}

export {Auth}