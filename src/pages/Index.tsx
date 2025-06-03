
import { useState } from "react";
import { Search, MapPin, Calendar, Star, User, Clock, Phone, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const Index = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  const especialidades = [
    "Cardiologia", "Dermatologia", "Psiquiatria", "Pediatria", 
    "Ginecologia", "Ortopedia", "Neurologia", "Oftalmologia"
  ];

  const medicosDestaque = [
    {
      id: 1,
      nome: "Dra. Ana Silva",
      especialidade: "Cardiologia",
      crm: "CRM/SP 123456",
      rating: 4.9,
      avaliacoes: 150,
      proximaConsulta: "Hoje às 14:00",
      valor: "R$ 200",
      foto: "/placeholder.svg",
      endereco: "São Paulo, SP"
    },
    {
      id: 2,
      nome: "Dr. Carlos Santos",
      especialidade: "Psiquiatria",
      crm: "CRM/RJ 789012",
      rating: 4.8,
      avaliacoes: 98,
      proximaConsulta: "Amanhã às 09:30",
      valor: "R$ 250",
      foto: "/placeholder.svg",
      endereco: "Rio de Janeiro, RJ"
    },
    {
      id: 3,
      nome: "Dra. Maria Oliveira",
      especialidade: "Dermatologia",
      crm: "CRM/MG 345678",
      rating: 4.9,
      avaliacoes: 203,
      proximaConsulta: "Hoje às 16:30",
      valor: "R$ 180",
      foto: "/placeholder.svg",
      endereco: "Belo Horizonte, MG"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              AgendarBrasil
            </h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Para Pacientes</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Para Médicos</a>
            <a href="#" className="text-gray-600 hover:text-blue-600 transition-colors">Como Funciona</a>
          </nav>
          <div className="flex space-x-2">
            <Button variant="outline" className="hidden sm:flex">Entrar</Button>
            <Button className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600">
              Cadastrar
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Sua <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">saúde</span> em primeiro lugar
          </h2>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Encontre e agende consultas com os melhores médicos do Brasil. 
            Gratuito para pacientes, fácil para médicos.
          </p>

          {/* Search Section */}
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 max-w-4xl mx-auto">
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Especialidade ou médico"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <Input
                  placeholder="Cidade ou bairro"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="pl-10 h-12"
                />
              </div>
              <Button className="h-12 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600">
                <Search className="w-4 h-4 mr-2" />
                Buscar
              </Button>
            </div>
            
            {/* Especialidades */}
            <div className="flex flex-wrap gap-2 justify-center">
              {especialidades.map((esp) => (
                <Badge 
                  key={esp} 
                  variant="secondary" 
                  className="cursor-pointer hover:bg-blue-100 transition-colors"
                >
                  {esp}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Médicos em Destaque */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Médicos em Destaque</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {medicosDestaque.map((medico) => (
            <Card key={medico.id} className="hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader className="pb-4">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <CardTitle className="text-lg">{medico.nome}</CardTitle>
                    <p className="text-sm text-gray-600">{medico.especialidade}</p>
                    <p className="text-xs text-gray-500">{medico.crm}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{medico.rating}</span>
                    <span className="text-sm text-gray-500">({medico.avaliacoes})</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-1" />
                    {medico.endereco}
                  </div>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center text-green-600">
                    <Clock className="w-4 h-4 mr-1" />
                    {medico.proximaConsulta}
                  </div>
                  <span className="font-semibold text-blue-600">{medico.valor}</span>
                </div>
                
                <Button className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600">
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Consulta
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gradient-to-r from-blue-600 to-green-500 text-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Por que escolher o AgendarBrasil?</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Busca Inteligente</h4>
              <p className="text-blue-100">Encontre médicos por especialidade, localização e disponibilidade em tempo real.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Agendamento Fácil</h4>
              <p className="text-blue-100">Agende consultas em poucos cliques, com confirmação automática.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Phone className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-semibold mb-2">Suporte 24/7</h4>
              <p className="text-blue-100">Nossa equipe está sempre disponível para ajudar pacientes e médicos.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold mb-6">Pronto para começar?</h3>
          <p className="text-xl text-gray-600 mb-8">
            Junte-se a milhares de pacientes que já encontraram seus médicos ideais.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600">
              Encontrar Médico
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline">
              Sou Médico
            </Button>
          </div>
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
                <li><a href="#" className="hover:text-white transition-colors">Como Funciona</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Buscar Médicos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Minhas Consultas</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Para Médicos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Cadastre-se</a></li>
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

export default Index;
