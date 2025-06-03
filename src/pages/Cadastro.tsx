import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Stethoscope, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, createUserWithEmailAndPassword, onAuthStateChanged, User as FirebaseAuthUser } from "firebase/auth"; // Importar onAuthStateChanged
import { getFirestore, doc, setDoc, getDoc, updateDoc } from "firebase/firestore"; // Importar getDoc e updateDoc
import { useToast } from "@/components/ui/use-toast";
import type { CadastroFormData } from "@/types/user";

// Schema de validação para o cadastro completo (usuário não autenticado)
const cadastroCompletoSchema = z.object({
  tipo: z.enum(['paciente', 'medico'], { required_error: "Por favor, selecione o tipo de conta." }),
  nomeCompleto: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmarSenha: z.string(),
  telefone: z.string().min(10, "Telefone inválido"),
  dataNascimento: z.preprocess((arg) => (arg instanceof Date ? arg : undefined), z.date().optional()), // Processar string de data para Date
  genero: z.enum(['masculino', 'feminino', 'outro', 'prefiro-nao-informar']).optional(),
  historicoMedico: z.string().optional(),
  planoSaude: z.string().optional(),
  crm: z.string().optional(),
  especialidade: z.string().optional(),
  anosExperiencia: z.preprocess((arg) => (typeof arg === 'string' ? parseInt(arg, 10) : arg), z.number().optional()), // Processar string para number
  biografia: z.string().optional(),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "Senhas não coincidem",
  path: ["confirmarSenha"],
});

// Schema de validação para completar perfil (usuário autenticado sem tipo definido)
const completarPerfilSchema = z.object({
  tipo: z.enum(['paciente', 'medico'], { required_error: "Por favor, selecione o tipo de conta." }),
   // Incluir campos específicos baseados no tipo, mas torná-los opcionais para este schema
  nomeCompleto: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").optional(), // Nome pode vir do Google
  telefone: z.string().min(10, "Telefone inválido").optional().or(z.literal("")),
  dataNascimento: z.preprocess((arg) => (arg instanceof Date ? arg : undefined), z.date().optional()),
  genero: z.enum(['masculino', 'feminino', 'outro', 'prefiro-nao-informar']).optional(),
  historicoMedico: z.string().optional(),
  planoSaude: z.string().optional(),
  crm: z.string().optional(),
  especialidade: z.string().optional(),
  anosExperiencia: z.preprocess((arg) => (typeof arg === 'string' ? parseInt(arg, 10) : arg), z.number().optional()),
  biografia: z.string().optional(),
});

type CompletarPerfilFormData = z.infer<typeof completarPerfilSchema>;

const Cadastro = () => {
  const [tipoUsuario, setTipoUsuario] = useState<'paciente' | 'medico'>('paciente');
  const [usuarioLogado, setUsuarioLogado] = useState<FirebaseAuthUser | null>(null); // Estado para o usuário logado
  const [dadosPerfilExistente, setDadosPerfilExistente] = useState<any | null>(null); // Estado para dados do perfil no Firestore
  const [loading, setLoading] = useState(true); // Estado de carregamento inicial

  const navigate = useNavigate();
  const { toast } = useToast();
  const auth = getAuth();
  const db = getFirestore();

  // Configuração do useForm - ajustaremos o resolver e o comportamento com base no estado de autenticação
  const form = useForm<CadastroFormData | CompletarPerfilFormData>({
     resolver: zodResolver(cadastroCompletoSchema), // Default resolver
     defaultValues: {
       tipo: 'paciente'
     }
   });
   const { register, handleSubmit, formState: { errors }, setValue, watch, reset } = form;

  // Efeito para verificar o estado de autenticação e buscar dados do perfil
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUsuarioLogado(user);
      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);
        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setDadosPerfilExistente(userData);
          // Se já tem tipo válido, redirecionar para o perfil
          if (userData && (userData.tipo === 'paciente' || userData.tipo === 'medico')) {
             toast({
                title: "Já cadastrado",
                description: "Você já possui um perfil completo.",
                variant: "default",
             });
             navigate(userData.tipo === 'paciente' ? "/perfil-paciente" : "/perfil-medico");
             return; // Sair do useEffect após redirecionar
          }
           // Se usuário logado mas sem tipo ou tipo inválido, preencher formulário com dados existentes e usar schema de completar perfil
           reset(userData); // Preencher formulário com dados existentes
           setTipoUsuario(userData?.tipo || 'paciente'); // Setar tipo padrão ou existente
           // Mudar o resolver do formulário para o de completar perfil
           form.setResolver(zodResolver(completarPerfilSchema));

        } else {
          // Usuário autenticado (ex: via Google), mas sem documento no Firestore. Criar documento básico.
           try {
              await setDoc(userDocRef, {
                uid: user.uid,
                email: user.email,
                nomeCompleto: user.displayName || 'Nome não informado',
                tipo: null, // Inicializa sem tipo
                createdAt: new Date(),
              });
               // Preencher formulário com os dados básicos do Google
              reset({
                email: user.email,
                nomeCompleto: user.displayName || '',
                tipo: 'paciente', // Default para o formulário
              });
              setTipoUsuario('paciente');
               // Mudar o resolver do formulário para o de completar perfil
              form.setResolver(zodResolver(completarPerfilSchema));
              setDadosPerfilExistente({ uid: user.uid, email: user.email, nomeCompleto: user.displayName || '', tipo: null }); // Setar dados básicos para o formulário

           } catch (firestoreError) {
              console.error("Erro ao criar documento básico no Firestore para usuário logado:", firestoreError);
               toast({
                title: "Erro",
                description: "Ocorreu um erro ao configurar seu perfil inicial.",
                variant: "destructive",
              });
              // Opcional: Deslogar o usuário se a criação do documento falhar
              // signOut(auth);
              navigate("/"); // Redirecionar para o início
           }
        }
      } else {
         // Nenhum usuário logado, garantir que o formulário seja o de cadastro completo
         reset(); // Resetar o formulário
         setTipoUsuario('paciente'); // Resetar o tipo
         form.setResolver(zodResolver(cadastroCompletoSchema)); // Usar schema de cadastro completo
         setDadosPerfilExistente(null);
      }
      setLoading(false);
    });

    return () => unsubscribe(); // Cleanup
   }, [auth, db, navigate, reset]); // Adicionar dependências


  // Função de submissão principal
  const onSubmit = async (data: CadastroFormData | CompletarPerfilFormData) => {
    const auth = getAuth();
    const db = getFirestore();
    const user = auth.currentUser; // Obter o usuário logado (se houver)

    try {
      if (user && dadosPerfilExistente) { // Fluxo: Completar Perfil (usuário logado sem tipo válido)
         const userDocRef = doc(db, "users", user.uid);
         const dataToUpdate: any = { // Usando any, considere um tipo mais específico
            tipo: data.tipo,
         };

         // Adicionar campos específicos baseados no tipo escolhido agora
         if (data.tipo === 'paciente') {
            const pacienteData = data as CompletarPerfilFormData; // Cast para ter acesso aos campos opcionais
             dataToUpdate.dataNascimento = pacienteData.dataNascimento || null;
             dataToUpdate.genero = pacienteData.genero || null;
             dataToUpdate.historicoMedico = pacienteData.historicoMedico || null;
             dataToUpdate.planoSaude = pacienteData.planoSaude || null;
             // Manter nome e telefone existentes do Firestore ou Google Auth se não forem alterados/coletados aqui
             if (pacienteData.nomeCompleto !== undefined) dataToUpdate.nomeCompleto = pacienteData.nomeCompleto;
             if (pacienteData.telefone !== undefined) dataToUpdate.telefone = pacienteData.telefone;

         } else if (data.tipo === 'medico') {
            const medicoData = data as CompletarPerfilFormData; // Cast
             dataToUpdate.crm = medicoData.crm || null;
             dataToUpdate.especialidade = medicoData.especialidade || null;
             dataToUpdate.anosExperiencia = medicoData.anosExperiencia || null;
             dataToUpdate.biografia = medicoData.biografia || null;
              // Manter nome e telefone existentes do Firestore ou Google Auth se não forem alterados/coletados aqui
             if (medicoData.nomeCompleto !== undefined) dataToUpdate.nomeCompleto = medicoData.nomeCompleto;
             if (medicoData.telefone !== undefined) dataToUpdate.telefone = medicoData.telefone;
         }

         await updateDoc(userDocRef, dataToUpdate);

         toast({
           title: "Sucesso!",
           description: "Perfil completado com sucesso.",
           variant: "default",
         });

         // Redirecionar para o perfil correto após completar
         navigate(data.tipo === 'paciente' ? "/perfil-paciente" : "/perfil-medico");


      } else { // Fluxo: Cadastro Completo (usuário não autenticado)

        const cadastroData = data as CadastroFormData; // Cast para ter acesso aos campos obrigatórios do cadastro completo

        // Criar usuário com e-mail e senha no Firebase Auth
        const userCredential = await createUserWithEmailAndPassword(auth, cadastroData.email, cadastroData.senha);
        const newUser = userCredential.user;

        console.log('Usuário criado no Firebase Auth:', newUser);

        // Salvar informações adicionais do usuário no Firestore
        const newUserDocRef = doc(db, "users", newUser.uid);

        const newUserDataToSave: any = { 
          uid: newUser.uid,
          email: newUser.email,
          tipo: cadastroData.tipo,
          nomeCompleto: cadastroData.nomeCompleto,
          telefone: cadastroData.telefone,
          createdAt: new Date(),
        };

        if (cadastroData.tipo === 'paciente') {
          newUserDataToSave.dataNascimento = cadastroData.dataNascimento || null;
          newUserDataToSave.genero = cadastroData.genero || null;
          newUserDataToSave.historicoMedico = cadastroData.historicoMedico || null;
          newUserDataToSave.planoSaude = cadastroData.planoSaude || null;
        } else if (cadastroData.tipo === 'medico') {
          newUserDataToSave.crm = cadastroData.crm || null;
          newUserDataToSave.especialidade = cadastroData.especialidade || null;
          newUserDataToSave.anosExperiencia = cadastroData.anosExperiencia || null;
          newUserDataToSave.biografia = cadastroData.biografia || null;
        }

        await setDoc(newUserDocRef, newUserDataToSave);

        toast({
          title: "Sucesso!",
          description: "Conta criada e informações salvas.",
          variant: "default",
        });

        // Redirecionar após o cadastro completo
        // O usuário já está autenticado, então podemos tentar redirecionar para o perfil
         navigate(cadastroData.tipo === 'paciente' ? "/perfil-paciente" : "/perfil-medico");

      }

    } catch (error: any) {
      console.error("Erro na submissão do formulário:", error.message);
      let errorMessage = "Ocorreu um erro. Tente novamente.";

       // Tratar erros específicos do Firebase Auth (para o fluxo de cadastro completo)
      if (!user && error.code) {
         switch (error.code) {
           case 'auth/email-already-in-use':
             errorMessage = "Este e-mail já está em uso.";
             break;
           case 'auth/invalid-email':
             errorMessage = "Endereço de e-mail inválido.";
             break;
           case 'auth/operation-not-allowed':
             errorMessage = "Operação de e-mail/senha não permitida. Habilite no console do Firebase.";
             break;
           case 'auth/weak-password':
             errorMessage = "A senha é muito fraca.";
             break;
           default:
             errorMessage = `Erro no Auth: ${error.message}`;
         }
      } else { // Outros erros, possivelmente do Firestore ou lógica interna
          errorMessage = `Erro geral: ${error.message}`;
      }

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const handleTipoChange = (tipo: 'paciente' | 'medico') => {
    setTipoUsuario(tipo);
    setValue('tipo', tipo); // Atualizar valor no react-hook-form
  };

   if (loading) {
      return <div className="flex justify-center items-center min-h-screen">Carregando...</div>;
   }

   // Se o usuário está logado e já tem um perfil completo, o useEffect já redirecionou. Este caso não deve ser renderizado.
   // Mas como segurança, poderíamos exibir uma mensagem ou redirecionar novamente se necessário.
   if (usuarioLogado && dadosPerfilExistente && (dadosPerfilExistente.tipo === 'paciente' || dadosPerfilExistente.tipo === 'medico')) {
      return null; // Ou um spinner/mensagem breve antes do redirecionamento
   }


  return (    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Link>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              {usuarioLogado && !dadosPerfilExistente?.tipo ? 'Completar seu Perfil' : 'Criar Conta'}
            </CardTitle>
            <p className="text-gray-600">
              {usuarioLogado && !dadosPerfilExistente?.tipo 
                ? 'Por favor, complete seus dados para continuar' 
                : 'Escolha o tipo de conta e preencha seus dados'}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Seleção do tipo de usuário - Visível apenas se não tiver um tipo definido ainda */}
            {(!dadosPerfilExistente || !dadosPerfilExistente.tipo) && (
              <div className="space-y-4">
                <Label className="text-base font-semibold">Tipo de conta</Label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => handleTipoChange('paciente')}
                    className={\`p-4 border-2 rounded-lg transition-all ${
                      tipoUsuario === 'paciente'
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-blue-300'
                    }\`}
                  >
                    <User className={\`w-8 h-8 mx-auto mb-2 ${
                      tipoUsuario === 'paciente' ? 'text-blue-500' : 'text-gray-400'
                    }\`} />
                    <p className="font-medium">Paciente</p>
                    <p className="text-sm text-gray-500">Agendar consultas</p>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleTipoChange('medico')}
                    className={\`p-4 border-2 rounded-lg transition-all ${
                      tipoUsuario === 'medico'
                        ? 'border-green-500 bg-green-50'
                        : 'border-gray-200 hover:border-green-300'
                    }\`}
                  >
                    <Stethoscope className={\`w-8 h-8 mx-auto mb-2 ${
                      tipoUsuario === 'medico' ? 'text-green-500' : 'text-gray-400'
                    }`} />
                    <p className="font-medium">Médico</p>
                    <p className="text-sm text-gray-500">Gerenciar agenda</p>
                  </button>
                </div>
                 {errors.tipo && (
                    <p className="text-sm text-red-500 mt-1">{errors.tipo.message}</p>
                 )}
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

              {/* Campos comuns - Exibir apenas se for um cadastro completo ou se não tiver nome/telefone já nos dados existentes */}
              {!usuarioLogado || (!dadosPerfilExistente?.nomeCompleto || !dadosPerfilExistente?.telefone) ? (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {/* Campo Nome Completo */}
                   {!dadosPerfilExistente?.nomeCompleto && (
                      <div>
                        <Label htmlFor="nomeCompleto">Nome completo</Label>
                        <Input
                          id="nomeCompleto"
                          {...register('nomeCompleto')}
                          className="mt-1"
                           // Valor padrão se já existir nos dados básicos do Google/Firestore
                          defaultValue={dadosPerfilExistente?.nomeCompleto || usuarioLogado?.displayName || ''}
                        />
                        {errors.nomeCompleto && (
                          <p className="text-sm text-red-500 mt-1">{errors.nomeCompleto.message}</p>
                        )}
                      </div>
                   )}

                   {/* Campo Telefone */}
                    {!dadosPerfilExistente?.telefone && (
                      <div>
                        <Label htmlFor="telefone">Telefone</Label>
                        <Input
                          id="telefone"
                          {...register('telefone')}
                          placeholder="(11) 99999-9999"
                          className="mt-1"
                           // Valor padrão se já existir nos dados básicos do Google/Firestore
                          defaultValue={dadosPerfilExistente?.telefone || usuarioLogado?.phoneNumber || ''}
                        />
                        {errors.telefone && (
                          <p className="text-sm text-red-500 mt-1">{errors.telefone.message}</p>
                        )}
                      </div>
                    )}

                 </div>
              ) : null}


              {/* Campos de E-mail e Senha - Visíveis apenas para cadastro completo (usuário não logado) */}
              {!usuarioLogado && (
                 <div className="space-y-4">
                   <div>
                     <Label htmlFor="email">E-mail</Label>
                     <Input
                       id="email"
                       type="email"
                       {...register('email')}
                       className="mt-1"
                     />
                     {errors.email && (
                       <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                       )}
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                     <div>
                       <Label htmlFor="senha">Senha</Label>
                       <Input
                         id="senha"
                         type="password"
                         {...register('senha')}
                         className="mt-1"
                       />
                       {errors.senha && (
                         <p className="text-sm text-red-500 mt-1">{errors.senha.message}</p>
                       )}
                     </div>

                     <div>
                       <Label htmlFor="confirmarSenha">Confirmar senha</Label>
                       <Input
                         id="confirmarSenha"
                         type="password"
                         {...register('confirmarSenha')}
                         className="mt-1"/>
                       {errors.confirmarSenha && (
                         <p className="text-sm text-red-500 mt-1">{errors.confirmarSenha.message}</p>
                       )}
                     </div>
                   </div>
                 </div>
              )}

              {/* Campos específicos do paciente - Visíveis apenas se o tipo selecionado for paciente E o tipo ainda não estiver definido */}
              {tipoUsuario === 'paciente' && (!dadosPerfilExistente || !dadosPerfilExistente.tipo) && (
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-semibold text-blue-600">Informações do Paciente</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dataNascimento">Data de nascimento</Label>
                      <Input
                        id="dataNascimento"
                        type="date"
                        {...register('dataNascimento', { valueAsDate: true })}
                        className="mt-1"
                         defaultValue={dadosPerfilExistente?.dataNascimento ? new Date(dadosPerfilExistente.dataNascimento.seconds * 1000).toISOString().split('T')[0] : ''}
                      />
                    </div>

                    <div>
                      <Label>Gênero</Label>
                      <Select onValueChange={(value) => setValue('genero', value as any)} defaultValue={dadosPerfilExistente?.genero}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="masculino">Masculino</SelectItem>
                          <SelectItem value="feminino">Feminino</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                          <SelectItem value="prefiro-nao-informar">Prefiro não informar</SelectItem>
                        </SelectContent>
                      </Select>
                       {errors.genero && (
                          <p className="text-sm text-red-500 mt-1">{errors.genero.message}</p>
                       )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="planoSaude">Plano de saúde (opcional)</Label>
                    <Input
                      id="planoSaude"
                      {...register('planoSaude')}
                      placeholder="Ex: Unimed, Bradesco Saúde"
                      className="mt-1"
                       defaultValue={dadosPerfilExistente?.planoSaude || ''}
                    />
                  </div>

                  <div>
                    <Label htmlFor="historicoMedico">Histórico médico (opcional)</Label>
                    <Textarea
                      id="historicoMedico"
                      {...register('historicoMedico')}
                      placeholder="Descreva condições médicas relevantes, alergias, medicamentos em uso..."
                      className="mt-1"
                      rows={3}
                       defaultValue={dadosPerfilExistente?.historicoMedico || ''}
                    />
                  </div>
                </div>
              )}

              {/* Campos específicos do médico - Visíveis apenas se o tipo selecionado for médico E o tipo ainda não estiver definido */}
              {tipoUsuario === 'medico' && (!dadosPerfilExistente || !dadosPerfilExistente.tipo) && (
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-semibold text-green-600">Informações Profissionais</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="crm">CRM</Label>
                      <Input
                        id="crm"
                        {...register('crm')}
                        placeholder="Ex: CRM/SP 123456"
                        className="mt-1"
                         defaultValue={dadosPerfilExistente?.crm || ''}
                      />
                       {errors.crm && (
                          <p className="text-sm text-red-500 mt-1">{errors.crm.message}</p>
                       )}
                    </div>

                    <div>
                      <Label htmlFor="especialidade">Especialidade</Label>
                      <Input
                        id="especialidade"
                        {...register('especialidade')}
                        placeholder="Ex: Cardiologia"
                        className="mt-1"
                         defaultValue={dadosPerfilExistente?.especialidade || ''}
                      />
                       {errors.especialidade && (
                          <p className="text-sm text-red-500 mt-1">{errors.especialidade.message}</p>
                       )}
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
                       defaultValue={dadosPerfilExistente?.anosExperiencia || ''}
                    />
                     {errors.anosExperiencia && (
                          <p className="text-sm text-red-500 mt-1">{errors.anosExperiencia.message}</p>
                       )}
                  </div>

                  <div>
                    <Label htmlFor="biografia">Biografia (opcional)</Label>
                    <Textarea
                      id="biografia"
                      {...register('biografia')}
                      placeholder="Descreva sua formação, especializações, experiência..."
                      className="mt-1"
                      rows={4}
                       defaultValue={dadosPerfilExistente?.biografia || ''}
                    />
                       {errors.biografia && (
                          <p className="text-sm text-red-500 mt-1">{errors.biografia.message}</p>
                       )}
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600"
              >
                {usuarioLogado && !dadosPerfilExistente?.tipo ? 'Completar Perfil' : 'Criar Conta'}
              </Button>
            </form>

            {/* Link para login - Visível apenas para cadastro completo (usuário não logado) */}
            {!usuarioLogado && (
              <div className="text-center mt-6">
                <p className="text-gray-600">
                  Já tem uma conta?{' '}
                  <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                    Faça login
                  </Link>
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cadastro;
