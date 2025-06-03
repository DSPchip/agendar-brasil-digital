
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { 
  User, 
  Calendar, 
  Clock, 
  Star, 
  MapPin, 
  Phone, 
  Mail, 
  Edit3,
  History,
  Heart
} from "lucide-react";

const PerfilPaciente = () => {
  const [editMode, setEditMode] = useState(false);

  // Dados mockados do paciente
  const paciente = {
    id: "1",
    nomeCompleto: "Maria Silva Santos",
    email: "maria.silva@email.com",
    telefone: "(11) 99999-9999",
    dataNascimento: new Date("1985-03-15"),
    genero: "feminino",
    historicoMedico: "Hipertensão controlada com medicação. Alergia à penicilina.",
    planoSaude: "Unimed",
    consultas: [
      {
        id: "1",
        medico: "Dr. Carlos Santos",
        especialidade: "Cardiologia",
        data: new Date("2024-01-15"),
        status: "concluida",
        valor: 200
      },
      {
        id: "2",
        medico: "Dra. Ana Silva",
        especialidade: "Clínico Geral",
        data: new Date("2024-02-10"),
        status: "agendada",
        valor: 150
      }
    ],
    avaliacoes: [
      {
        id: "1",
        medico: "Dr. Carlos Santos",
        nota: 5,
        comentario: "Excelente atendimento, muito atencioso e explicativo.",
        data: new Date("2024-01-15")
      }
    ]
  };

  const proximasConsultas = paciente.consultas.filter(c => c.status === 'agendada');
  const consultasPassadas = paciente.consultas.filter(c => c.status === 'concluida');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header do perfil */}
        <Card className="mb-8 shadow-lg border-0">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24 bg-gradient-to-r from-blue-500 to-green-500">
                <AvatarFallback className="text-white text-2xl font-bold">
                  {paciente.nomeCompleto.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-gray-900">{paciente.nomeCompleto}</h1>
                  <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                    <User className="w-3 h-3 mr-1" />
                    Paciente
                  </Badge>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {paciente.email}
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {paciente.telefone}
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    {paciente.planoSaude}
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

        <Tabs defaultValue="consultas" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="consultas" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Consultas
            </TabsTrigger>
            <TabsTrigger value="historico" className="flex items-center gap-2">
              <History className="w-4 h-4" />
              Histórico
            </TabsTrigger>
            <TabsTrigger value="avaliacoes" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Avaliações
            </TabsTrigger>
            <TabsTrigger value="perfil" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Perfil
            </TabsTrigger>
          </TabsList>

          {/* Aba Consultas */}
          <TabsContent value="consultas" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-blue-600">Próximas Consultas</CardTitle>
                </CardHeader>
                <CardContent>
                  {proximasConsultas.length > 0 ? (
                    <div className="space-y-4">
                      {proximasConsultas.map((consulta) => (
                        <div key={consulta.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">{consulta.medico}</h3>
                            <p className="text-sm text-gray-600">{consulta.especialidade}</p>
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
                          <div className="text-right">
                            <p className="font-semibold text-green-600">R$ {consulta.valor}</p>
                            <Badge className="bg-blue-100 text-blue-700">Agendada</Badge>
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

          {/* Aba Histórico */}
          <TabsContent value="historico" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-gray-700">Histórico de Consultas</CardTitle>
              </CardHeader>
              <CardContent>
                {consultasPassadas.length > 0 ? (
                  <div className="space-y-4">
                    {consultasPassadas.map((consulta) => (
                      <div key={consulta.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div>
                          <h3 className="font-semibold">{consulta.medico}</h3>
                          <p className="text-sm text-gray-600">{consulta.especialidade}</p>
                          <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              {consulta.data.toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold">R$ {consulta.valor}</p>
                          <Badge variant="secondary">Concluída</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Nenhuma consulta realizada</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Avaliações */}
          <TabsContent value="avaliacoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-yellow-600">Minhas Avaliações</CardTitle>
              </CardHeader>
              <CardContent>
                {paciente.avaliacoes.length > 0 ? (
                  <div className="space-y-4">
                    {paciente.avaliacoes.map((avaliacao) => (
                      <div key={avaliacao.id} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{avaliacao.medico}</h3>
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star 
                                key={i} 
                                className={`w-4 h-4 ${
                                  i < avaliacao.nota ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
                                }`} 
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-600 mb-2">{avaliacao.comentario}</p>
                        <p className="text-sm text-gray-500">
                          Avaliado em {avaliacao.data.toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">Nenhuma avaliação feita</p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Perfil */}
          <TabsContent value="perfil" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Informações Pessoais</CardTitle>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <form className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nome">Nome completo</Label>
                        <Input id="nome" defaultValue={paciente.nomeCompleto} />
                      </div>
                      <div>
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input id="telefone" defaultValue={paciente.telefone} />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                      <Input id="email" type="email" defaultValue={paciente.email} />
                    </div>
                    <div>
                      <Label htmlFor="planoSaude">Plano de saúde</Label>
                      <Input id="planoSaude" defaultValue={paciente.planoSaude} />
                    </div>
                    <div>
                      <Label htmlFor="historico">Histórico médico</Label>
                      <Textarea 
                        id="historico" 
                        defaultValue={paciente.historicoMedico}
                        rows={4}
                      />
                    </div>
                    <div className="flex gap-3">
                      <Button className="bg-gradient-to-r from-blue-600 to-green-500">
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
                        <Label className="text-sm font-medium text-gray-500">Data de nascimento</Label>
                        <p className="mt-1">{paciente.dataNascimento.toLocaleDateString()}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Gênero</Label>
                        <p className="mt-1 capitalize">{paciente.genero}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Plano de saúde</Label>
                      <p className="mt-1">{paciente.planoSaude}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Histórico médico</Label>
                      <p className="mt-1 text-gray-700">{paciente.historicoMedico}</p>
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

export default PerfilPaciente;
