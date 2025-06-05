
import { useState } from "react";
import { 
  Search, 
  MapPin, 
  Calendar, 
  Star, 
  User, 
  Clock, 
  Phone, 
  Mail,
  Settings,
  History,
  Bell
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const PerfilPaciente = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");

  const consultasProximas = [
    {
      id: 1,
      medico: "Dra. Ana Silva",
      especialidade: "Cardiologia",
      data: "2025-06-10",
      horario: "14:00",
      endereco: "Rua das Flores, 123 - São Paulo, SP",
      status: "confirmada"
    },
    {
      id: 2,
      medico: "Dr. Carlos Santos",
      especialidade: "Dermatologia",
      data: "2025-06-15",
      horario: "09:30",
      endereco: "Av. Paulista, 456 - São Paulo, SP",
      status: "pendente"
    }
  ];

  const historico = [
    {
      id: 1,
      medico: "Dr. João Oliveira",
      especialidade: "Clínico Geral",
      data: "2025-05-20",
      horario: "10:00",
      status: "realizada"
    },
    {
      id: 2,
      medico: "Dra. Maria Costa",
      especialidade: "Ginecologia",
      data: "2025-05-15",
      horario: "15:30",
      status: "realizada"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="border-b bg-white sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              AgendarBrasil
            </h1>
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Bell className="w-4 h-4 mr-2" />
              Notificações
            </Button>
            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Configurações
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <User className="w-4 h-4 text-blue-600" />
              </div>
              <span className="text-sm font-medium">João Silva</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Busca de Médicos */}
          <div className="lg:col-span-2">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Buscar Médicos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Especialidade ou médico"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      placeholder="Cidade ou bairro"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <Button className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600">
                    <Search className="w-4 h-4 mr-2" />
                    Buscar
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Próximas Consultas */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Próximas Consultas
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {consultasProximas.map((consulta) => (
                  <div key={consulta.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{consulta.medico}</h4>
                        <p className="text-sm text-gray-600">{consulta.especialidade}</p>
                      </div>
                      <Badge variant={consulta.status === "confirmada" ? "default" : "secondary"}>
                        {consulta.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {consulta.data}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {consulta.horario}
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600 mt-1">
                      <MapPin className="w-4 h-4" />
                      {consulta.endereco}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm" variant="outline">Remarcar</Button>
                      <Button size="sm" variant="outline">Cancelar</Button>
                      <Button size="sm">Ver Detalhes</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Perfil */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Meu Perfil
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center">
                  <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                    <User className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="font-semibold">João Silva</h3>
                  <p className="text-sm text-gray-600">Paciente</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>joao@email.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>(11) 99999-9999</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>

            {/* Histórico */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="w-5 h-5" />
                  Histórico Recente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {historico.map((consulta) => (
                  <div key={consulta.id} className="border-b pb-3 last:border-b-0 last:pb-0">
                    <h4 className="font-medium text-sm">{consulta.medico}</h4>
                    <p className="text-xs text-gray-600">{consulta.especialidade}</p>
                    <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                      <Calendar className="w-3 h-3" />
                      {consulta.data} às {consulta.horario}
                    </div>
                  </div>
                ))}
                <Button variant="outline" size="sm" className="w-full">
                  Ver Histórico Completo
                </Button>
              </CardContent>
            </Card>

            {/* Ações Rápidas */}
            <Card>
              <CardHeader>
                <CardTitle>Ações Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button variant="outline" className="w-full justify-start">
                  <Star className="w-4 h-4 mr-2" />
                  Médicos Favoritos
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar Exame
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Phone className="w-4 h-4 mr-2" />
                  Suporte
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilPaciente;
