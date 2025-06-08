
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyChQUJd3bmkRdkW-MvVT_mrOVdcqhbBUp4",
  authDomain: "projeto001-461804.firebaseapp.com",
  projectId: "fir-demo-project",
  storageBucket: "projeto001-461804.firebasestorage.app",
  messagingSenderId: "302040449666",
  appId: "1:302040449666:web:af4783cac42e33a7dcea9b"
};

// Inicialize o Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

// Configurar Google Auth Provider
const googleProvider = new GoogleAuthProvider();
googleProvider.addScope('email');
googleProvider.addScope('profile');

createRoot(document.getElementById('root')!).render(<App />);
