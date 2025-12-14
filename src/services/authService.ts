import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as firebaseSignOut } from "firebase/auth";

// Helper para leer variables de entorno de forma segura
// Esto evita el error "Cannot read properties of undefined (reading 'VITE_...')"
const getEnv = (key: string) => {
  // 1. Intentar leer de import.meta.env (Vite)
  const meta = import.meta as any;
  if (meta && meta.env && meta.env[key]) {
    return meta.env[key];
  }
  // 2. Intentar leer de process.env (Node/Legacy)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  return undefined;
};

// 1. Configuración de Firebase
const firebaseConfig = {
  apiKey: getEnv('VITE_FIREBASE_API_KEY'),
  authDomain: getEnv('VITE_FIREBASE_AUTH_DOMAIN'),
  projectId: getEnv('VITE_FIREBASE_PROJECT_ID'),
  storageBucket: getEnv('VITE_FIREBASE_STORAGE_BUCKET'),
  messagingSenderId: getEnv('VITE_FIREBASE_MESSAGING_SENDER_ID'),
  appId: getEnv('VITE_FIREBASE_APP_ID')
};

// 2. Inicialización Singleton
let auth: any = null;

const initAuth = () => {
  if (auth) return auth;
  
  // Validar si existe la configuración mínima requerida
  if (!firebaseConfig.apiKey) {
    console.warn("Carmelita: No Firebase Config found. Auth will run in Demo Mode.");
    return null;
  }

  try {
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    return auth;
  } catch (e) {
    console.error("Firebase Init Error:", e);
    return null;
  }
};

// 3. Funciones de Autenticación
export const loginWithGoogle = async () => {
  const authInstance = initAuth();

  // MODO DEMO (Fallback si no hay configuración)
  if (!authInstance) {
    await new Promise(r => setTimeout(r, 1500)); // Simular delay de red
    return {
      uid: 'demo-user-123',
      displayName: 'Ana María (Demo)',
      email: 'ana@demo.com',
      photoURL: null,
      isDemo: true
    };
  }

  // MODO REAL
  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup(authInstance, provider);
    return result.user;
  } catch (error: any) {
    console.error("Google Login Error:", error);
    throw error;
  }
};

export const logout = async () => {
  const authInstance = initAuth();
  if (authInstance) {
    await firebaseSignOut(authInstance);
  }
};