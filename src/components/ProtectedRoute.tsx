import { Navigate } from "react-router-dom";

// Simulação de autenticação
// Em uma aplicação real, você teria sua lógica de autenticação aqui
const isAuthenticated = () => {
  // Por enquanto, retornaremos sempre false para simular que o usuário não está logado
  // Substitua esta lógica pela sua verificação de autenticação real
  console.log("Checking authentication...");
  return false; 
};

const ProtectedRoute = ({ element }: { element: React.ReactElement }) => {
  if (isAuthenticated()) {
    return element;
  } else {
    // Redireciona para a página de login se não estiver autenticado
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
