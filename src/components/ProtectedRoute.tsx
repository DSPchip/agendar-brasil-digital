import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const ProtectedRoute = ({ element }: { element: React.ReactElement }) => {
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // Usuário está logado
        setAuthenticated(true);
      } else {
        // Usuário não está logado
        setAuthenticated(false);
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]); // Re-run effect if auth object changes (shouldn't happen in this case, but good practice)

  if (loading) {
    // Opcional: renderizar um spinner ou tela de carregamento enquanto verifica a autenticação
    return <div>Carregando...</div>; 
  }

  if (authenticated) {
    return element;
  } else {
    // Redireciona para a página de login se não estiver autenticado
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
