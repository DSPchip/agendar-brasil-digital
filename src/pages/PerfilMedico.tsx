
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";
import { 
  Stethoscope, 
  Calendar, 
  Clock, 
  Star, 
  User, 
  Phone, 
  Mail, 
  Edit3,
  Users,
  Award,
  Activity
} from "lucide-react";

const PerfilMedico = () => {
  const [editMode, setEditMode] = useState(false);

  // Dados mockados do médico
  const medico = {
    id: "1",
    nomeCompleto: "Dr. Carlos Santos",
    email: "carlos.santos@email.com",
    telefone: "(11) 99999-8888",
    crm: "CRM/SP 123456",
    especialidade: "Cardiologia",
    anosExperiencia: 15,
    biografia: "Médico cardiologista com 15 anos de experiência. Especialista em cardiologia intervencionista e ecocardiografia. Formado pela USP com residência no InCor.",
    avaliacaoMedia: 4.8,
    totalAvaliacoes: 127,
    consultas: [
      {
        id: "1",
        paciente: "Maria Silva",
        data: new Date("2024-01-15"),
        status: "agendada"
      },
      {
        id: "2",
        paciente: "João Oliveira",
        data: new Date("2024-01-16"),
        status: "agendada"
      }
    ],
    horariosAtendimento: [
      { diaSemana: 'segunda', horaInicio: '08:00', horaFim: '17:00', ativo: true },
      { diaSemana: 'terca', horaInicio: '08:00', horaFim: '17:00', ativo: true },
      { diaSemana: 'quarta', horaInicio: '08:00', horaFim: '17:00', ativo: true },
      { diaSemana: 'quinta', horaInicio: '08:00', horaFim: '17:00', ativo: true },
      { diaSemana: 'sexta', horaInicio: '08:00', horaFim: '17:00', ativo: true },
      { diaSemana: 'sabado', horaInicio: '08:00', horaFim: '12:00', ativo: false },
      { diaSemana: 'domingo', horaInicio: '08:00', horaFim: '12:00', ativo: false }
    ]
  };

  const diasSemana = {
    segunda: 'Segunda-feira',
    terca: 'Terça-feira',
    quarta: 'Quarta-feira',
    quinta: 'Quinta-feira',
    sexta: 'Sexta-feira',
    sabado: 'Sábado',
    domingo: 'Domingo'
  };

  const proximasConsultas = medico.consultas.filter(c => c.status === 'agendada');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header do perfil */}
        <Card className="mb-8 shadow-lg border-0">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500">
                <AvatarFallback className="text-white text-2xl font-bold">
                  {medico.nomeCompleto.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{medico.nomeCompleto}</h1>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <Stethoscope className="w-3 h-3 mr-1" />
                    Médico
                  </Badge>
                </div>
                
                <p className="text-lg text-gray-600 mb-3">{medico.especialidade} • {medico.crm}</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {medico.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {medico.telefone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    {medico.anosExperiencia} anos de experiência
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4">
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{medico.avaliacaoMedia}</span>
                    <span className="text-gray-500">({medico.totalAvaliacoes} avaliações)</span>
                  </div>
                </div>
              </div>

              <Button 
                onClick={() => setEditMode(!editMode)}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                {editMode ? 'Cancelar' : 'Editar Perfil'}
              </Button>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="agenda" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="agenda" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Agenda
            </TabsTrigger>
            <TabsTrigger value="pacientes" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Pacientes
            </TabsTrigger>
            <TabsTrigger value="horarios" className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Horários
            </TabsTrigger>
            <TabsTrigger value="perfil" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Perfil
            </TabsTrigger>
          </TabsList>

          {/* Aba Agenda */}
          <TabsContent value="agenda" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-green-600">Próximas Consultas</CardTitle>
                </CardHeader>
                <CardContent>
                  {proximasConsultas.length > 0 ? (
                    <div className="space-y-4">
                      {proximasConsultas.map((consulta) => (
                        <div key={consulta.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">{consulta.paciente}</h3>
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {consulta.data.toLocaleDateString()}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                14:00
                              </span>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button size="sm" variant="outline">Ver Detalhes</Button>
                            <Button size="sm">Iniciar Consulta</Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-8">Nenhuma consulta agendada</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Aba Pacientes */}
          <TabsContent value="pacientes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">Meus Pacientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Maria Silva Santos</h3>
                        <p className="text-sm text-gray-600">Última consulta: 15/01/2024</p>
                        <p className="text-sm text-gray-500">Histórico: Hipertensão</p>
                      </div>
                      <Button size="sm" variant="outline">Ver Prontuário</Button>
                    </div>
                  </div>
                  
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">João Oliveira Costa</h3>
                        <p className="text-sm text-gray-600">Última consulta: 10/01/2024</p>
                        <p className="text-sm text-gray-500">Histórico: Diabetes tipo 2</p>
                      </div>
                      <Button size="sm" variant="outline">Ver Prontuário</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Horários */}
          <TabsContent value="horarios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Horários de Atendimento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {medico.horariosAtendimento.map((horario) => (
                    <div key={horario.diaSemana} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-32">
                          <p className="font-medium">{diasSemana[horario.diaSemana]}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Input 
                            type="time" 
                            defaultValue={horario.horaInicio} 
                            className="w-32"
                            disabled={!horario.ativo}
                          />
                          <span>até</span>
                          <Input 
                            type="time" 
                            defaultValue={horario.horaFim} 
                            className="w-32"
                            disabled={!horario.ativo}
                          />
                        </div>
                      </div>
                      <Switch defaultChecked={horario.ativo} />
                    </div>
                  ))}
                </div>
                <Button className="mt-6 bg-gradient-to-r from-green-600 to-blue-500">
                  Salvar Horários
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Perfil */}
          <TabsContent value="perfil" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Informações Profissionais</CardTitle>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nome">Nome completo</Label>
                        <Input id="nome" defaultValue={medico.nomeCompleto} />
                      </div>
                      <div>
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input id="telefone" defaultValue={medico.telefone} />
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="crm">CRM</Label>
                        <Input id="crm" defaultValue={medico.crm} />
                      </div>
                      <div>
                        <Label htmlFor="especialidade">Especialidade</Label>
                        <Input id="especialidade" defaultValue={medico.especialidade} />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="anosExperiencia">Anos de experiência</Label>
                      <Input 
                        id="anosExperiencia" 
                        type="number" 
                        defaultValue={medico.anosExperiencia} 
                      />
                    </div>
                    <div>
                      <Label htmlFor="biografia">Biografia</Label>
                      <Textarea 
                        id="biografia" 
                        defaultValue={medico.biografia}
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button className="bg-gradient-to-r from-green-600 to-blue-500">
                        Salvar Alterações
                      </Button>
                      <Button variant="outline" onClick={() => setEditMode(false)}>
                        Cancelar
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">CRM</Label>
                        <p className="mt-1">{medico.crm}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Especialidade</Label>
                        <p className="mt-1">{medico.especialidade}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Anos de experiência</Label>
                      <p className="mt-1">{medico.anosExperiencia} anos</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Biografia</Label>
                      <p className="mt-1 text-gray-700">{medico.biografia}</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default PerfilMedico;
