
import { useState } from "react";
import { 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp, 
  User, 
  Mail,
  Phone,
  Settings,
  Bell,
  BarChart3,
  FileText,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const PerfilMedico = () => {
  const agendaHoje = [
    {
      id: 1,
      paciente: "João Silva",
      horario: "09:00",
      tipo: "Consulta",
      status: "confirmada"
    },
    {
      id: 2,
      paciente: "Maria Santos",
      horario: "10:30",
      tipo: "Retorno",
      status: "confirmada"
    },
    {
      id: 3,
      paciente: "Carlos Oliveira",
      horario: "14:00",
      tipo: "Primeira consulta",
      status: "pendente"
    },
    {
      id: 4,
      paciente: "Ana Costa",
      horario: "15:30",
      tipo: "Consulta",
      status: "confirmada"
    }
  ];

  const estatisticas = [
    {
      titulo: "Consultas Hoje",
      valor: "8",
      icon: Calendar,
      cor: "text-blue-600"
    },
    {
      titulo: "Pacientes Este Mês",
      valor: "156",
      icon: Users,
      cor: "text-green-600"
    },
    {
      titulo: "Taxa de Ocupação",
      valor: "85%",
      icon: TrendingUp,
      cor: "text-purple-600"
    },
    {
      titulo: "Avaliação Média",
      valor: "4.9",
      icon: Star,
      cor: "text-yellow-600"
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
              <span className="text-sm font-medium">Dra. Ana Silva</span>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Conteúdo Principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Estatísticas */}
            <div className="grid md:grid-cols-4 gap-4">
              {estatisticas.map((stat, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600">{stat.titulo}</p>
                        <p className="text-2xl font-bold">{stat.valor}</p>
                      </div>
                      <stat.icon className={`w-8 h-8 ${stat.cor}`} />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Agenda de Hoje */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Agenda de Hoje - {new Date().toLocaleDateString('pt-BR')}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {agendaHoje.map((consulta) => (
                  <div key={consulta.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold">{consulta.paciente}</h4>
                        <p className="text-sm text-gray-600">{consulta.tipo}</p>
                      </div>
                      <Badge variant={consulta.status === "confirmada" ? "default" : "secondary"}>
                        {consulta.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Clock className="w-4 h-4" />
                      {consulta.horario}
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button size="sm">Iniciar Atendimento</Button>
                      <Button size="sm" variant="outline">Ver Histórico</Button>
                      <Button size="sm" variant="outline">Remarcar</Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Gráfico Semanal */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Consultas Esta Semana
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-end justify-between gap-4">
                  {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map((dia, index) => {
                    const altura = Math.random() * 80 + 20;
                    return (
                      <div key={dia} className="flex flex-col items-center">
                        <div 
                          className="bg-gradient-to-t from-blue-600 to-green-500 rounded-t w-12"
                          style={{ height: `${altura}%` }}
                        ></div>
                        <span className="text-sm text-gray-600 mt-2">{dia}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Perfil do Médico */}
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
                  <h3 className="font-semibold">Dra. Ana Silva</h3>
                  <p className="text-sm text-gray-600">Cardiologista</p>
                  <p className="text-xs text-gray-500">CRM/SP 123456</p>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span>ana.silva@email.com</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>(11) 99999-9999</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Star className="w-4 h-4 text-yellow-400" />
                    <span>4.9 (150 avaliações)</span>
                  </div>
                </div>
                <Button variant="outline" className="w-full">
                  Editar Perfil
                </Button>
              </CardContent>
            </Card>

            {/* Configurações da Agenda */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Agenda
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600">
                  Configurar Horários
                </Button>
                <Button variant="outline" className="w-full">
                  Bloquear Horários
                </Button>
                <Button variant="outline" className="w-full">
                  Agenda Semanal
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
                  <Users className="w-4 h-4 mr-2" />
                  Lista de Pacientes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <FileText className="w-4 h-4 mr-2" />
                  Relatórios
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="w-4 h-4 mr-2" />
                  Estatísticas
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="w-4 h-4 mr-2" />
                  Configurações
                </Button>
              </CardContent>
            </Card>

            {/* Status Online */}
            <Card>
              <CardHeader>
                <CardTitle>Status</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Disponível para consultas</span>
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  Alterar Status
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PerfilMedico;
