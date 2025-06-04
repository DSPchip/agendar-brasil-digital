
import { useState } from "react";
import { 
  Search, 
  Calendar, 
  Star, 
  Clock, 
  Shield, 
  Heart, 
  Phone, 
  CheckCircle,
  ArrowRight,
  MapPin,
  User,
  Smartphone
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const ParaPacientes = () => {
  const beneficios = [
    {
      icon: Search,
      titulo: "Busca Inteligente",
      descricao: "Encontre médicos por especialidade, localização, horário disponível e avaliações de outros pacientes."
    },
    {
      icon: Calendar,
      titulo: "Agendamento Rápido",
      descricao: "Agende consultas em poucos cliques, 24h por dia, com confirmação automática em tempo real."
    },
    {
      icon: Shield,
      titulo: "100% Gratuito",
      descricao: "Use todos os recursos da plataforma sem pagar nada. Sem taxas ocultas ou mensalidades."
    },
    {
      icon: Star,
      titulo: "Avaliações Reais",
      descricao: "Leia avaliações de outros pacientes e escolha os melhores profissionais para seu cuidado."
    },
    {
      icon: Clock,
      titulo: "Horários Flexíveis",
      descricao: "Encontre horários que se encaixem na sua agenda, incluindo fins de semana e feriados."
    },
    {
      icon: Phone,
      titulo: "Suporte Completo",
      descricao: "Nossa equipe está sempre disponível para ajudar com dúvidas ou problemas técnicos."
    }
  ];

  const comoFunciona = [
    {
      numero: "01",
      titulo: "Cadastre-se",
      descricao: "Crie sua conta gratuita em menos de 2 minutos com suas informações básicas."
    },
    {
      numero: "02",
      titulo: "Busque Médicos",
      descricao: "Use nossa busca inteligente para encontrar o profissional ideal por especialidade ou localização."
    },
    {
      numero: "03",
      titulo: "Agende a Consulta",
      descricao: "Escolha o horário que funciona para você e confirme o agendamento instantaneamente."
    },
    {
      numero: "04",
      titulo: "Compareça à Consulta",
      descricao: "Receba lembretes e compareça no horário marcado. Depois, avalie o atendimento."
    }
  ];

  const especialidades = [
    "Cardiologia", "Dermatologia", "Psiquiatria", "Pediatria",
    "Ginecologia", "Ortopedia", "Neurologia", "Oftalmologia",
    "Endocrinologia", "Urologia", "Otorrinolaringologia", "Gastroenterologia"
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
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Como Funciona</a>
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
            Encontre os melhores médicos do Brasil, agende consultas facilmente e tenha acesso a cuidados de saúde de qualidade.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cadastro">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600">
                Começar Agora - É Grátis
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Ver Como Funciona
            </Button>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Por que escolher o AgendarBrasil?</h3>
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
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {especialidades.map((especialidade) => (
              <Badge 
                key={especialidade} 
                variant="secondary" 
                className="p-3 text-center justify-center cursor-pointer hover:bg-blue-100 transition-colors"
              >
                {especialidade}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Recursos Adicionais */}
      <section className="bg-gradient-to-r from-blue-600 to-green-500 text-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Recursos Exclusivos</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Smartphone className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">App Mobile</h4>
              <p className="text-blue-100">Acesse de qualquer lugar pelo seu celular ou tablet.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Histórico Médico</h4>
              <p className="text-blue-100">Mantenha seu histórico de consultas sempre organizado.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Lembretes</h4>
              <p className="text-blue-100">Receba notificações antes das suas consultas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Rápido */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h3>
        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                É realmente gratuito para pacientes?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Sim! O AgendarBrasil é 100% gratuito para pacientes. Você pode buscar médicos, agendar consultas e usar todos os recursos sem pagar nada.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Como posso cancelar uma consulta?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Você pode cancelar consultas diretamente pela plataforma até 24 horas antes do horário marcado, sem nenhum custo.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Posso agendar para outra pessoa?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Sim, você pode agendar consultas para familiares e dependentes usando sua conta do AgendarBrasil.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-6">Pronto para cuidar da sua saúde?</h3>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Cadastre-se agora e tenha acesso aos melhores médicos do Brasil na palma da sua mão.
          </p>
          <Link to="/cadastro">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600">
              Criar Conta Gratuita
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
                <li><Link to="/para-pacientes" className="hover:text-white transition-colors">Como Funciona</Link></li>
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
