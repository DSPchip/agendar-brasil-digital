import { useState, useEffect } from "react";
import { useForm } from "react-hook-form"; // Importar useForm
import { zodResolver } from "@hookform/resolvers/zod"; // Importar zodResolver
import { z } from "zod"; // Importar z
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
  Activity,
  LogOut // Importar LogOut icon
} from "lucide-react";
import { getAuth, onAuthStateChanged, signOut, User as FirebaseAuthUser } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore"; // Importar updateDoc
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

// Definir uma interface para os dados do médico (opcional, mas boa prática)
interface MedicoData {
  uid: string;
  nomeCompleto: string;
  email: string;
  telefone?: string;
  crm?: string;
  especialidade?: string;
  anosExperiencia?: number;
  biografia?: string;
  tipo: 'medico';
  // Adicionar outros campos se necessário (ex: avaliacaoMedia, totalAvaliacoes, consultas, horariosAtendimento)
  avaliacaoMedia?: number;
  totalAvaliacoes?: number;
  consultas?: any[]; // Considere definir uma interface para consultas
  horariosAtendimento?: any[]; // Considere definir uma interface para horários
}

// Schema de validação para a edição do perfil do médico
const medicoEditSchema = z.object({
  nomeCompleto: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  telefone: z.string().min(10, "Telefone inválido").optional().or(z.literal("")),
  crm: z.string().optional(),
  especialidade: z.string().optional(),
  anosExperiencia: z.number().optional(),
  biografia: z.string().optional(),
});

type MedicoEditFormData = z.infer<typeof medicoEditSchema>;

const PerfilMedico = () => {
  const [editMode, setEditMode] = useState(false);
  const [medico, setMedico] = useState<MedicoData | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();
  const { toast } = useToast();

   const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<MedicoEditFormData>({
    resolver: zodResolver(medicoEditSchema),
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Usuário está logado, buscar dados no Firestore
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          // Verificar se é realmente um médico (opcional, mas recomendado)
          if (userData && userData.tipo === 'medico') {
            setMedico(userData as MedicoData); // Cast para o tipo MedicoData
             // Preencher o formulário de edição com os dados do médico ao carregar
            reset(userData as MedicoEditFormData);
          } else {
            // Usuário logado mas não é médico ou dados incompletos, talvez redirecionar
            console.error("Usuário logado não é um médico ou dados incompletos.", userData);
             toast({
              title: "Erro",
              description: "Perfil não encontrado ou tipo incorreto.",
              variant: "destructive",
            });
            navigate("/"); // Redireciona para o início
          }
        } else {
          // Documento do usuário não encontrado no Firestore após login
          console.error("Documento do médico não encontrado no Firestore para UID:", user.uid);
           toast({
              title: "Erro",
              description: "Dados do perfil não encontrados.",
              variant: "destructive",
            });
          navigate("/"); // Redireciona para o início ou login
        }
      } else {
        // Usuário não logado, redirecionar para login (ProtectedRoute já deveria lidar com isso, mas é uma segurança)
        setMedico(null);
         toast({
            title: "Não autenticado",
            description: "Por favor, faça login para acessar esta página.",
            variant: "destructive",
          });
        navigate("/login");
      }
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth, db, navigate, reset, toast]); // Adicionar reset às dependências

  // Função para lidar com a submissão do formulário de edição
  const onEditSubmit = async (data: MedicoEditFormData) => {
    const user = auth.currentUser; // Obter o usuário logado
    if (!user) return; // Não deve acontecer se a rota for protegida, mas é uma segurança

    const userDocRef = doc(db, "users", user.uid);

    try {
      // Atualizar o documento no Firestore
      await updateDoc(userDocRef, {
        nomeCompleto: data.nomeCompleto,
        telefone: data.telefone || null, // Salvar null se o campo estiver vazio
        crm: data.crm || null,
        especialidade: data.especialidade || null,
        anosExperiencia: data.anosExperiencia || null,
        biografia: data.biografia || null,
      });

      // Atualizar o estado local após salvar com sucesso
       setMedico(prevMedico => {
          if (!prevMedico) return null; // Retorna null se prevMedico for null
          return { 
              ...prevMedico, 
              nomeCompleto: data.nomeCompleto, 
              telefone: data.telefone || undefined, 
              crm: data.crm || undefined, 
              especialidade: data.especialidade || undefined, 
              anosExperiencia: data.anosExperiencia || undefined, 
              biografia: data.biografia || undefined 
          }; // Usar undefined para campos opcionais vazios para consistência
      });

      toast({
        title: "Sucesso!",
        description: "Perfil atualizado com sucesso.",
        variant: "default",
      });

      setEditMode(false); // Sair do modo de edição após salvar

    } catch (error: any) {
      console.error("Erro ao atualizar perfil:", error.message);
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao atualizar o perfil. Tente novamente.",
        variant: "destructive",
      });
    }
  };

   // Função para lidar com o logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({
        title: "Sucesso!",
        description: "Logout realizado com sucesso.",
        variant: "default",
      });
      navigate("/");
    } catch (error: any) {
      console.error("Erro ao fazer logout:", error.message);
      toast({
        title: "Erro no Logout",
        description: "Ocorreu um erro ao fazer logout. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Carregando perfil...</div>;
  }

   if (!medico) {
      return <div className="flex justify-center items-center min-h-screen text-red-600">Não foi possível carregar o perfil do médico.</div>;
  }

  // Dados de consultas e horários ainda são mockados. Você precisará integrar com seus dados reais.
  const proximasConsultas: any[] = medico.consultas || []; 
  const horariosAtendimento: any[] = medico.horariosAtendimento || []; 

  const diasSemana: { [key: string]: string } = {
    segunda: 'Segunda-feira',
    terca: 'Terça-feira',
    quarta: 'Quarta-feira',
    quinta: 'Quinta-feira',
    sexta: 'Sexta-feira',
    sabado: 'Sábado',
    domingo: 'Domingo'
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header do perfil */}
        <Card className="mb-8 shadow-lg border-0">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24 bg-gradient-to-r from-green-500 to-blue-500">
                <AvatarFallback className="text-white text-2xl font-bold">
                  {medico.nomeCompleto ? medico.nomeCompleto.split(' ').map(n => n[0]).join('') : '--'}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  {/* Exibir nome do médico */}
                  <h1 className="text-3xl font-bold text-gray-900">{medico.nomeCompleto}</h1>
                  <Badge variant="secondary" className="bg-green-100 text-green-700">
                    <Stethoscope className="w-3 h-3 mr-1" />
                    Médico
                  </Badge>
                </div>

                {/* Exibir especialidade e CRM do médico */}
                <p className="text-lg text-gray-600 mb-3">{medico.especialidade || 'Não informado'} • {medico.crm || 'Não informado'}</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
                   {/* Exibir email do médico */}
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4" />
                    {medico.email}
                  </div>
                   {/* Exibir telefone do médico */}
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" />
                    {medico.telefone || 'Não informado'}
                  </div>
                   {/* Exibir anos de experiência do médico */}
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4" />
                    {medico.anosExperiencia ? `${medico.anosExperiencia} anos de experiência` : 'Não informado'}
                  </div>
                </div>

                <div className="flex items-center gap-4 mt-4">
                   {/* Exibir avaliação média e total de avaliações - AINDA PODE ESTAR MOCKADO OU PRECISA SER CALCULADO/BUSCADO */}
                  <div className="flex items-center gap-1">
                    <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                    <span className="font-semibold">{medico.avaliacaoMedia?.toFixed(1) || '--'}</span>
                    <span className="text-gray-500">({medico.totalAvaliacoes || 0} avaliações)</span>
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

               {/* Botão de Logout */}
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center gap-2 text-red-600 border-red-600 hover:bg-red-50 hover:text-red-700"
              >
                <LogOut className="w-4 h-4" />
                Sair
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

          {/* Aba Agenda - AGORA PODE USAR DADOS DO FIRESTORE (se salvos na coleção 'users') */}
          <TabsContent value="agenda" className="space-y-6">
            <div className="grid gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-xl text-green-600">Próximas Consultas</CardTitle>
                </CardHeader>
                <CardContent>
                  {proximasConsultas.length > 0 ? (
                    <div className="space-y-4">
                      {proximasConsultas.map((consulta, index) => (
                        // Adapte a exibição dos dados da consulta conforme a estrutura salva no Firestore
                        <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                          <div>
                            <h3 className="font-semibold">{consulta.pacienteNome || 'Paciente'}</h3> {/* Adapte conforme seus dados */}
                            <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                              <span className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {consulta.data ? new Date(consulta.data).toLocaleDateString() : 'Data não informada'} {/* Adapte conforme seus dados */}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-4 h-4" />
                                {consulta.hora || 'Hora não informada'} {/* Adapte conforme seus dados */}
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

          {/* Aba Pacientes - AINDA USANDO DADOS MOCKADOS ou REQUER BUSCA ADICIONAL NO FIRESTORE */}
          <TabsContent value="pacientes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-blue-600">Meus Pacientes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                   {/* Esta seção precisará ser populada com dados reais dos pacientes vinculados a este médico */}
                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">Maria Silva Santos</h3>
                        <p className="text-sm text-gray-600">Última consulta: 15/01/2024</p>
                        <p className="text-sm text-sm text-gray-500">Histórico: Hipertensão</p>
                      </div>
                      <Button size="sm" variant="outline">Ver Prontuário</Button>
                    </div>
                  </div>

                  <div className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-semibold">João Oliveira Costa</h3>
                        <p className="text-sm text-gray-600">Última consulta: 10/01/2024</p>
                        <p className="text-sm text-sm text-gray-500">Histórico: Diabetes tipo 2</p>
                      </div>
                      <Button size="sm" variant="outline">Ver Prontuário</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Horários - AGORA PODE USAR DADOS DO FIRESTORE (se salvos na coleção 'users') */}
          <TabsContent value="horarios" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Horários de Atendimento</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {horariosAtendimento.map((horario: any, index: number) => ( // Usando any temporariamente
                    <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-32">
                          <p className="font-medium">{diasSemana[horario.diaSemana] || 'Dia não informado'}</p>
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
                {/* Botão para salvar horários - precisará de lógica para atualizar no Firestore */}
                <Button className="mt-6 bg-gradient-to-r from-green-600 to-blue-500">
                  Salvar Horários
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Aba Perfil - AGORA COM EDICAO INTEGRADA COM FIRESTORE */}
          <TabsContent value="perfil" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Informações Profissionais</CardTitle>
              </CardHeader>
              <CardContent>
                {editMode ? (
                  <form onSubmit={handleSubmit(onEditSubmit)} className="space-y-4"> {/* Ligar o formulário com react-hook-form */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="nomeCompleto">Nome completo</Label>
                        <Input id="nomeCompleto" {...register('nomeCompleto')} className="mt-1" /> {/* Usar register */}
                         {errors.nomeCompleto && (
                          <p className="text-sm text-red-500 mt-1">{errors.nomeCompleto.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input id="telefone" {...register('telefone')} className="mt-1" /> {/* Usar register */}
                         {errors.telefone && (
                          <p className="text-sm text-red-500 mt-1">{errors.telefone.message}</p>
                        )}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="crm">CRM</Label>
                        <Input id="crm" {...register('crm')} className="mt-1" /> {/* Usar register */}
                         {errors.crm && (
                          <p className="text-sm text-red-500 mt-1">{errors.crm.message}</p>
                        )}
                      </div>
                      <div>
                        <Label htmlFor="especialidade">Especialidade</Label>
                        <Input id="especialidade" {...register('especialidade')} className="mt-1" /> {/* Usar register */}
                         {errors.especialidade && (
                          <p className="text-sm text-red-500 mt-1">{errors.especialidade.message}</p>
                        )}
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="anosExperiencia">Anos de experiência</Label>
                      <Input 
                        id="anosExperiencia" 
                        type="number" 
                        {...register('anosExperiencia', { valueAsNumber: true })} 
                        className="mt-1"
                        min="0"
                        max="60"
                      /> {/* Usar register */}
                       {errors.anosExperiencia && (
                          <p className="text-sm text-red-500 mt-1">{errors.anosExperiencia.message}</p>
                        )}
                    </div>
                    <div>
                      <Label htmlFor="biografia">Biografia</Label>
                      <Textarea 
                        id="biografia" 
                        {...register('biografia')}
                        rows={4}
                        className="mt-1"
                      /> {/* Usar register */}
                       {errors.biografia && (
                          <p className="text-sm text-red-500 mt-1">{errors.biografia.message}</p>
                        )}
                    </div>
                     {/* Email geralmente não editável, então mantemos disabled e sem register direto */}
                     <div>
                       <Label htmlFor="email">E-mail</Label>
                       <Input id="email" type="email" defaultValue={medico.email} disabled className="mt-1" />
                     </div>
                    <div className="flex gap-3">
                      {/* Botão Salvar Alterações - ligar ao handleSubmit */}
                      <Button type="submit" className="bg-gradient-to-r from-green-600 to-blue-500">
                        Salvar Alterações
                      </Button>
                      <Button type="button" variant="outline" onClick={() => { setEditMode(false); reset(medico as MedicoEditFormData); }}> {/* Botão de cancelar, resetar formulário */}
                        Cancelar
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">CRM</Label>
                        <p className="mt-1">{medico.crm || 'Não informado'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Especialidade</Label>
                        <p className="mt-1">{medico.especialidade || 'Não informado'}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Anos de experiência</Label>
                      <p className="mt-1">{medico.anosExperiencia ? `${medico.anosExperiencia} anos` : 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Biografia</Label>
                      <p className="mt-1 text-gray-700">{medico.biografia || 'Não informado'}</p>
                    </div>
                     <div>
                       <Label className="text-sm font-medium text-gray-500">E-mail</Label>
                       <p className="mt-1">{medico.email}</p>
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
