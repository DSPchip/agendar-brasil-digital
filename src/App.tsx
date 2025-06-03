import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Cadastro from "./pages/Cadastro";
import Login from "./pages/Login";
import PerfilPaciente from "./pages/PerfilPaciente";
import PerfilMedico from "./pages/PerfilMedico";
import ParaPacientes from "./pages/ParaPacientes";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/ProtectedRoute"; // Importe o ProtectedRoute

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/cadastro" element={<Cadastro />} />
          <Route path="/login" element={<Login />} />
          {/* Use ProtectedRoute para rotas de perfil */}
          <Route 
            path="/perfil-paciente" 
            element={<ProtectedRoute element={<PerfilPaciente />} />} 
          />
          <Route 
            path="/perfil-medico" 
            element={<ProtectedRoute element={<PerfilMedico />} />} 
          />
          <Route path="/para-pacientes" element={<ParaPacientes />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
