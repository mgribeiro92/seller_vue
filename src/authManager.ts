import { Auth } from './auth';

let authInstance: Auth  

function initializeAuth(persistent: boolean) {
  if (!authInstance) {
    authInstance = new Auth(persistent);
  }
}

function getAuthInstance() {
  if (authInstance) {
    return authInstance
  }
  
}

export { initializeAuth, getAuthInstance }