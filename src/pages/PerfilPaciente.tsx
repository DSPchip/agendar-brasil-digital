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
  Heart,
  LogOut
} from "lucide-react";
import { getAuth, onAuthStateChanged, signOut, User as FirebaseAuthUser } from "firebase/auth";
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore"; // Importar updateDoc
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

// Definir uma interface para os dados do paciente (opcional, mas boa prática)
interface PacienteData {
  uid: string;
  nomeCompleto: string;
  email: string;
  telefone?: string;
  dataNascimento?: Date;
  genero?: string;
  historicoMedico?: string;
  planoSaude?: string;
  tipo: 'paciente';
  // Adicionar outros campos se necessário
}

// Schema de validação para a edição do perfil do paciente
const pacienteEditSchema = z.object({
  nomeCompleto: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  telefone: z.string().min(10, "Telefone inválido").optional().or(z.literal("")),
  planoSaude: z.string().optional(),
  historicoMedico: z.string().optional(),
  // Adicionar validação para dataNascimento e genero se forem editáveis
});

type PacienteEditFormData = z.infer<typeof pacienteEditSchema>;

const PerfilPaciente = () => {
  const [editMode, setEditMode] = useState(false);
  const [paciente, setPaciente] = useState<PacienteData | null>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();
  const db = getFirestore();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { register, handleSubmit, formState: { errors }, reset, setValue } = useForm<PacienteEditFormData>({
    resolver: zodResolver(pacienteEditSchema),
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          if (userData && userData.tipo === 'paciente') {
            setPaciente(userData as PacienteData);
             // Preencher o formulário de edição com os dados do paciente ao carregar
            reset(userData as PacienteEditFormData);
          } else {
            console.error("Usuário logado não é um paciente ou dados incompletos.", userData);
            toast({
              title: "Erro",
              description: "Perfil não encontrado ou tipo incorreto.",
              variant: "destructive",
            });
            navigate("/");
          }
        } else {
          console.error("Documento do paciente não encontrado no Firestore para UID:", user.uid);
           toast({
              title: "Erro",
              description: "Dados do perfil não encontrados.",
              variant: "destructive",
            });
          navigate("/");
        }
      } else {
        setPaciente(null);
         toast({
            title: "Não autenticado",
            description: "Por favor, faça login para acessar esta página.",
            variant: "destructive",
          });
        navigate("/login");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db, navigate, reset, toast]); // Adicionar reset às dependências

   // Função para lidar com a submissão do formulário de edição
  const onEditSubmit = async (data: PacienteEditFormData) => {
    const user = auth.currentUser; // Obter o usuário logado
    if (!user) return; // Não deve acontecer se a rota for protegida, mas é uma segurança

    const userDocRef = doc(db, "users", user.uid);

    try {
      // Atualizar o documento no Firestore
      await updateDoc(userDocRef, {
        nomeCompleto: data.nomeCompleto,
        telefone: data.telefone || null, // Salvar null se o campo estiver vazio
        planoSaude: data.planoSaude || null,
        historicoMedico: data.historicoMedico || null,
        // Adicionar campos de dataNascimento e genero aqui se forem editáveis
      });

      // Atualizar o estado local após salvar com sucesso
      setPaciente(prevPaciente => {
          if (!prevPaciente) return null; // Retorna null se prevPaciente for null
          return { 
              ...prevPaciente, 
              nomeCompleto: data.nomeCompleto, 
              telefone: data.telefone || undefined, 
              planoSaude: data.planoSaude || undefined, 
              historicoMedico: data.historicoMedico || undefined 
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

  if (!paciente) {
      return <div className="flex justify-center items-center min-h-screen text-red-600">Não foi possível carregar o perfil do paciente.</div>;
  }

  // Dados de consulta e avaliações ainda são mockados. Você precisará integrar com seus dados reais.
  const proximasConsultas: any[] = []; 
  const consultasPassadas: any[] = []; 
  const avaliacoes: any[] = []; 


  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-8 px-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header do perfil */}
        <Card className="mb-8 shadow-lg border-0">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
              <Avatar className="w-24 h-24 bg-gradient-to-r from-blue-500 to-green-500">
                <AvatarFallback className="text-white text-2xl font-bold">
                  {paciente.nomeCompleto ? paciente.nomeCompleto.split(' ').map(n => n[0]).join('') : '--'}
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
                    {paciente.telefone || 'Não informado'}
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4" />
                    {paciente.planoSaude || 'Não informado'}
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

          {/* Aba Consultas - AINDA USANDO DADOS MOCKADOS */}
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

          {/* Aba Histórico - AINDA USANDO DADOS MOCKADOS */}
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

          {/* Aba Avaliações - AINDA USANDO DADOS MOCKADOS */}
          <TabsContent value="avaliacoes" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl text-yellow-600">Minhas Avaliações</CardTitle>
              </CardHeader>
              <CardContent>
                {avaliacoes.length > 0 ? (
                  <div className="space-y-4">
                    {avaliacoes.map((avaliacao) => (
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

          {/* Aba Perfil - AGORA COM EDICAO INTEGRADA COM FIRESTORE */}
          <TabsContent value="perfil" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">Informações Pessoais</CardTitle>
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
                    <div>
                      <Label htmlFor="email">E-mail</Label>
                       {/* Email geralmente não editável, então mantemos disabled e sem register direto */}
                      <Input id="email" type="email" defaultValue={paciente.email} disabled className="mt-1" /> 
                    </div>
                    <div>
                      <Label htmlFor="planoSaude">Plano de saúde</Label>
                      <Input id="planoSaude" {...register('planoSaude')} className="mt-1" /> {/* Usar register */}
                    </div>
                    <div>
                      <Label htmlFor="historicoMedico">Histórico médico</Label>
                      <Textarea 
                        id="historicoMedico" 
                        {...register('historicoMedico')}
                        rows={4}
                         className="mt-1"
                      /> {/* Usar register */}
                    </div>
                    {/* Adicionar campos de data de nascimento e gênero para edição, se necessário e com os inputs/seletores corretos e register */}
                    <div className="flex gap-3">
                      <Button type="submit" className="bg-gradient-to-r from-blue-600 to-green-500"> {/* Botão de submit */}
                        Salvar Alterações
                      </Button>
                      <Button type="button" variant="outline" onClick={() => { setEditMode(false); reset(paciente as PacienteEditFormData); }}> {/* Botão de cancelar, resetar formulário */}
                        Cancelar
                      </Button>
                    </div>
                  </form>
                ) : (
                   <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Data de nascimento</Label>
                        <p className="mt-1">{paciente.dataNascimento ? new Date(paciente.dataNascimento).toLocaleDateString() : 'Não informado'}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-500">Gênero</Label>
                        <p className="mt-1 capitalize">{paciente.genero || 'Não informado'}</p>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Plano de saúde</Label>
                      <p className="mt-1">{paciente.planoSaude || 'Não informado'}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-500">Histórico médico</Label>
                      <p className="mt-1 text-gray-700">{paciente.historicoMedico || 'Não informado'}</p>
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
