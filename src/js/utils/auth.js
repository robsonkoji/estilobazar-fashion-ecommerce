import { 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged 
} from 'firebase/auth';
import { auth } from './firebase.js';

let currentUser = null;

onAuthStateChanged(auth, (user) => {
  currentUser = user;
  window.dispatchEvent(new CustomEvent('admin-auth-changed', { detail: user }));
});

export function getCurrentUser() {
  return currentUser || auth.currentUser;
}

export function isAuthenticated() {
  return !!(currentUser || auth.currentUser);
}

export async function loginAdmin(email, password) {
  try {
    const credential = await signInWithEmailAndPassword(auth, email, password);
    currentUser = credential.user;
    return { success: true, user: credential.user };
  } catch (error) {
    console.error('Erro no login admin:', error);
    let message = 'Falha ao autenticar. Verifique o e-mail e a senha.';
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password' || error.code === 'auth/user-not-found') {
      message = 'E-mail ou senha incorretos.';
    } else if (error.code === 'auth/too-many-requests') {
      message = 'Muitas tentativas incorretas. Tente novamente mais tarde.';
    }
    return { success: false, error: message };
  }
}

export async function logoutAdmin() {
  try {
    await signOut(auth);
    currentUser = null;
    return { success: true };
  } catch (error) {
    console.error('Erro no logout admin:', error);
    return { success: false, error: error.message };
  }
}
