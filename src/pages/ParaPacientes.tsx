
import { useState } from "react";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Star, 
  Clock, 
  Shield, 
  Smartphone, 
  CheckCircle,
  ArrowRight,
  Heart,
  Users,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const ParaPacientes = () => {
  const beneficios = [
    {
      icon: Search,
      titulo: "Busca Fácil",
      descricao: "Encontre médicos por especialidade, localização e disponibilidade em tempo real."
    },
    {
      icon: Calendar,
      titulo: "Agendamento 24/7",
      descricao: "Agende consultas a qualquer hora, com confirmação imediata e lembretes automáticos."
    },
    {
      icon: Shield,
      titulo: "Médicos Verificados",
      descricao: "Todos os profissionais têm CRM verificado e são credenciados pelos conselhos médicos."
    },
    {
      icon: Star,
      titulo: "Avaliações Reais",
      descricao: "Veja avaliações e comentários de pacientes reais para escolher o melhor médico."
    },
    {
      icon: Smartphone,
      titulo: "Totalmente Gratuito",
      descricao: "Use nossa plataforma sem custos. Pague apenas a consulta diretamente ao médico."
    },
    {
      icon: Heart,
      titulo: "Cuidado Personalizado",
      descricao: "Histórico de consultas organizado e acesso fácil aos seus dados médicos."
    }
  ];

  const comoFunciona = [
    {
      numero: "01",
      titulo: "Busque",
      descricao: "Digite sua especialidade e localização para encontrar médicos disponíveis."
    },
    {
      numero: "02",
      titulo: "Compare",
      descricao: "Veja perfis, avaliações, preços e horários disponíveis de cada médico."
    },
    {
      numero: "03",
      titulo: "Agende",
      descricao: "Escolha o melhor horário e confirme sua consulta em poucos cliques."
    },
    {
      numero: "04",
      titulo: "Compareça",
      descricao: "Receba lembretes e vá à consulta no horário marcado."
    }
  ];

  const especialidades = [
    "Cardiologia", "Dermatologia", "Psiquiatria", "Pediatria",
    "Ginecologia", "Ortopedia", "Neurologia", "Oftalmologia",
    "Endocrinologia", "Gastroenterologia", "Urologia", "Pneumologia"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              AgendarBrasil
            </h1>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link to="/para-pacientes" className="text-blue-600 font-semibold">Para Pacientes</Link>
            <Link to="/para-medicos" className="text-gray-600 hover:text-blue-600 transition-colors">Para Médicos</Link>
            <Link to="/como-funciona" className="text-gray-600 hover:text-blue-600 transition-colors">Como Funciona</Link>
          </nav>
          <div className="flex space-x-2">
            <Link to="/login">
              <Button variant="outline" className="hidden sm:flex">Entrar</Button>
            </Link>
            <Link to="/cadastro">
              <Button className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600">
                Cadastrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Para <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">Pacientes</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Encontre e agende consultas com os melhores médicos do Brasil. Rápido, fácil e totalmente gratuito.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/perfil-paciente">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600">
                Buscar Médicos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link to="/como-funciona">
              <Button size="lg" variant="outline">
                Como Funciona
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Por que usar o AgendarBrasil?</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {beneficios.map((beneficio, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <beneficio.icon className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{beneficio.titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{beneficio.descricao}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Como Funciona */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Como Funciona</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {comoFunciona.map((passo, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">{passo.numero}</span>
                </div>
                <h4 className="text-xl font-semibold mb-2">{passo.titulo}</h4>
                <p className="text-gray-600">{passo.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Especialidades */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Especialidades Disponíveis</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {especialidades.map((esp) => (
            <Badge 
              key={esp} 
              variant="secondary" 
              className="p-4 text-center cursor-pointer hover:bg-blue-100 transition-colors text-sm"
            >
              {esp}
            </Badge>
          ))}
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-r from-blue-600 to-green-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-6">Pronto para cuidar da sua saúde?</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Milhares de pacientes já encontraram seus médicos ideais. É gratuito e fácil de usar!
          </p>
          <Link to="/perfil-paciente">
            <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              Começar Agora
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-xl font-bold">AgendarBrasil</span>
              </div>
              <p className="text-gray-400">Conectando pacientes e médicos em todo o Brasil.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Para Pacientes</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/como-funciona" className="hover:text-white transition-colors">Como Funciona</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Buscar Médicos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Minhas Consultas</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Para Médicos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/cadastro" className="hover:text-white transition-colors">Cadastre-se</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Suporte</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidade (LGPD)</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AgendarBrasil. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ParaPacientes;
