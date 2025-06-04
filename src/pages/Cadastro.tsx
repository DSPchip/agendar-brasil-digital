
import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Stethoscope, ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import {
  getAuth,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  User as FirebaseAuthUser,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import type { CadastroFormData } from "@/types/user";

// Schema para cadastro completo
const cadastroCompletoSchema = z
  .object({
    tipo: z.enum(["paciente", "medico"], {
      required_error: "Por favor, selecione o tipo de conta.",
    }),
    nomeCompleto: z
      .string()
      .min(2, "Nome deve ter pelo menos 2 caracteres"),
    email: z.string().email("E-mail inválido"),
    senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
    confirmarSenha: z.string(),
    telefone: z.string().min(10, "Telefone inválido"),
    dataNascimento: z
      .preprocess((arg) => {
        return arg instanceof Date ? arg : undefined;
      }, z.date().optional()),
    genero: z
      .enum(["masculino", "feminino", "outro", "prefiro-nao-informar"])
      .optional(),
    historicoMedico: z.string().optional(),
    planoSaude: z.string().optional(),
    crm: z.string().optional(),
    especialidade: z.string().optional(),
    anosExperiencia: z
      .preprocess((arg) => {
        return typeof arg === "string" && arg !== ""
          ? parseInt(arg, 10)
          : undefined;
      }, z.number().optional()),
    biografia: z.string().optional(),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "Senhas não coincidem",
    path: ["confirmarSenha"],
  })
  .refine((data) => {
    if (data.tipo === "medico") {
      return data.crm && data.especialidade;
    }
    return true;
  }, {
    message: "CRM e especialidade são obrigatórios para médicos",
    path: ["crm"],
  });

type CadastroCompletoInput = z.infer<typeof cadastroCompletoSchema>;

// Schema para completar perfil
const completarPerfilSchema = z.object({
  tipo: z.enum(["paciente", "medico"], {
    required_error: "Por favor, selecione o tipo de conta.",
  }),
  nomeCompleto: z.string().min(2, "Nome deve ter pelo menos 2 caracteres").optional(),
  telefone: z
    .union([z.string().min(10, "Telefone inválido"), z.literal("")])
    .optional(),
  dataNascimento: z
    .preprocess((arg) => (arg instanceof Date ? arg : undefined), z.date().optional()),
  genero: z
    .enum(["masculino", "feminino", "outro", "prefiro-nao-informar"])
    .optional(),
  historicoMedico: z.string().optional(),
  planoSaude: z.string().optional(),
  crm: z.string().optional(),
  especialidade: z.string().optional(),
  anosExperiencia: z
    .preprocess((arg) => {
      return typeof arg === "string" && arg !== ""
        ? parseInt(arg, 10)
        : undefined;
    }, z.number().optional()),
  biografia: z.string().optional(),
});

type CompletarPerfilInput = z.infer<typeof completarPerfilSchema>;

function CadastroCompletoForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const auth = getAuth();
  const db = getFirestore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CadastroCompletoInput>({
    resolver: zodResolver(cadastroCompletoSchema),
    defaultValues: {
      tipo: "paciente",
    },
  });

  const tipoSelecionado = watch("tipo");

  const onSubmit = async (data: CadastroCompletoInput) => {
    try {
      console.log("Iniciando cadastro com dados:", data);
      
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.senha
      );
      const newUser = userCredential.user;

      const newUserDocRef = doc(db, "users", newUser.uid);
      const newUserDataToSave: any = {
        uid: newUser.uid,
        email: newUser.email,
        tipo: data.tipo,
        nomeCompleto: data.nomeCompleto,
        telefone: data.telefone,
        createdAt: new Date(),
      };

      if (data.tipo === "paciente") {
        newUserDataToSave.dataNascimento = data.dataNascimento || null;
        newUserDataToSave.genero = data.genero || null;
        newUserDataToSave.historicoMedico = data.historicoMedico || null;
        newUserDataToSave.planoSaude = data.planoSaude || null;
      } else {
        newUserDataToSave.crm = data.crm || null;
        newUserDataToSave.especialidade = data.especialidade || null;
        newUserDataToSave.anosExperiencia = data.anosExperiencia || null;
        newUserDataToSave.biografia = data.biografia || null;
      }

      await setDoc(newUserDocRef, newUserDataToSave);

      toast({
        title: "Sucesso!",
        description: "Conta criada e informações salvas.",
        variant: "default",
      });

      navigate(data.tipo === "paciente" ? "/perfil-paciente" : "/perfil-medico");
    } catch (error: any) {
      console.error("Erro na submissão do cadastro completo:", error);
      let errorMessage = "Ocorreu um erro. Tente novamente.";

      if (error.code) {
        switch (error.code) {
          case "auth/email-already-in-use":
            errorMessage = "Este e-mail já está em uso.";
            break;
          case "auth/invalid-email":
            errorMessage = "Endereço de e-mail inválido.";
            break;
          case "auth/operation-not-allowed":
            errorMessage =
              "Operação de e-mail/senha não permitida. Habilite no console do Firebase.";
            break;
          case "auth/weak-password":
            errorMessage = "A senha é muito fraca.";
            break;
          default:
            errorMessage = `Erro no Auth: ${error.message}`;
        }
      }

      toast({
        title: "Erro",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Seletor de tipo */}
      <div className="space-y-2">
        <Label className="text-base font-semibold">Tipo de conta</Label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setValue("tipo", "paciente")}
            className={`
              p-4 border-2 rounded-lg transition-all
              ${tipoSelecionado === "paciente" 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-300 hover:border-blue-300"
              }
            `}
          >
            <User className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="font-medium">Paciente</p>
            <p className="text-sm text-gray-500">Agendar consultas</p>
          </button>
          <button
            type="button"
            onClick={() => setValue("tipo", "medico")}
            className={`
              p-4 border-2 rounded-lg transition-all
              ${tipoSelecionado === "medico" 
                ? "border-green-500 bg-green-50" 
                : "border-gray-300 hover:border-green-300"
              }
            `}
          >
            <Stethoscope className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="font-medium">Médico</p>
            <p className="text-sm text-gray-500">Gerenciar agenda</p>
          </button>
        </div>
        {errors.tipo && (
          <p className="text-sm text-red-500 mt-1">{errors.tipo.message}</p>
        )}
      </div>

      {/* Dados básicos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="nomeCompleto">Nome completo</Label>
          <Input
            id="nomeCompleto"
            {...register("nomeCompleto")}
            className="mt-1"
          />
          {errors.nomeCompleto && (
            <p className="text-sm text-red-500 mt-1">
              {errors.nomeCompleto.message}
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="telefone">Telefone</Label>
          <Input
            id="telefone"
            {...register("telefone")}
            placeholder="(11) 99999-9999"
            className="mt-1"
          />
          {errors.telefone && (
            <p className="text-sm text-red-500 mt-1">
              {errors.telefone.message}
            </p>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="email">E-mail</Label>
          <Input id="email" type="email" {...register("email")} className="mt-1" />
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
              {...register("senha")}
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
              {...register("confirmarSenha")}
              className="mt-1"
            />
            {errors.confirmarSenha && (
              <p className="text-sm text-red-500 mt-1">
                {errors.confirmarSenha.message}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Campos específicos do Paciente */}
      {tipoSelecionado === "paciente" && (
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-lg font-semibold text-blue-600">
            Informações do Paciente
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dataNascimento">Data de nascimento</Label>
              <Input
                id="dataNascimento"
                type="date"
                {...register("dataNascimento", { valueAsDate: true })}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Gênero</Label>
              <Controller
                name="genero"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                      <SelectItem value="prefiro-nao-informar">
                        Prefiro não informar
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.genero && (
                <p className="text-sm text-red-500 mt-1">{errors.genero.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="planoSaude">Plano de saúde (opcional)</Label>
            <Input
              id="planoSaude"
              {...register("planoSaude")}
              placeholder="Ex: Unimed, Bradesco Saúde"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="historicoMedico">Histórico médico (opcional)</Label>
            <Textarea
              id="historicoMedico"
              {...register("historicoMedico")}
              placeholder="Descreva condições médicas relevantes, alergias, medicamentos em uso..."
              className="mt-1"
              rows={3}
            />
          </div>
        </div>
      )}

      {/* Campos específicos do Médico */}
      {tipoSelecionado === "medico" && (
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-lg font-semibold text-green-600">
            Informações Profissionais
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="crm">CRM *</Label>
              <Input
                id="crm"
                {...register("crm")}
                placeholder="Ex: CRM/SP 123456"
                className="mt-1"
              />
              {errors.crm && (
                <p className="text-sm text-red-500 mt-1">{errors.crm.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="especialidade">Especialidade *</Label>
              <Input
                id="especialidade"
                {...register("especialidade")}
                placeholder="Ex: Cardiologia"
                className="mt-1"
              />
              {errors.especialidade && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.especialidade.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="anosExperiencia">Anos de experiência</Label>
              <Input
                id="anosExperiencia"
                type="number"
                {...register("anosExperiencia", { valueAsNumber: true })}
                className="mt-1"
                min="0"
                max="60"
              />
              {errors.anosExperiencia && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.anosExperiencia.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="biografia">Biografia (opcional)</Label>
            <Textarea
              id="biografia"
              {...register("biografia")}
              placeholder="Descreva sua formação, especializações, experiência..."
              className="mt-1"
              rows={4}
            />
            {errors.biografia && (
              <p className="text-sm text-red-500 mt-1">
                {errors.biografia.message}
              </p>
            )}
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600"
      >
        Criar Conta
      </Button>

      <div className="text-center mt-6">
        <p className="text-gray-600">
          Já tem uma conta?{" "}
          <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
            Faça login
          </Link>
        </p>
      </div>
    </form>
  );
}

function CompletarPerfilForm({
  usuario,
  dadosPerfilExistente,
}: {
  usuario: FirebaseAuthUser;
  dadosPerfilExistente: any;
}) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const db = getFirestore();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm<CompletarPerfilInput>({
    resolver: zodResolver(completarPerfilSchema),
    defaultValues: {
      tipo: dadosPerfilExistente?.tipo || "paciente",
      nomeCompleto: dadosPerfilExistente?.nomeCompleto || usuario.displayName || "",
      telefone: dadosPerfilExistente?.telefone || usuario.phoneNumber || "",
      dataNascimento: dadosPerfilExistente?.dataNascimento
        ? new Date(dadosPerfilExistente.dataNascimento.seconds * 1000)
        : undefined,
      genero: dadosPerfilExistente?.genero || undefined,
      historicoMedico: dadosPerfilExistente?.historicoMedico || "",
      planoSaude: dadosPerfilExistente?.planoSaude || "",
      crm: dadosPerfilExistente?.crm || "",
      especialidade: dadosPerfilExistente?.especialidade || "",
      anosExperiencia: dadosPerfilExistente?.anosExperiencia || undefined,
      biografia: dadosPerfilExistente?.biografia || "",
    },
  });

  const tipoSelecionado = watch("tipo");

  const onSubmit = async (data: CompletarPerfilInput) => {
    try {
      console.log("Completando perfil com dados:", data);
      
      const userDocRef = doc(db, "users", usuario.uid);
      const dataToUpdate: any = {
        tipo: data.tipo,
      };

      if (data.tipo === "paciente") {
        dataToUpdate.nomeCompleto = data.nomeCompleto || undefined;
        dataToUpdate.telefone = data.telefone || undefined;
        dataToUpdate.dataNascimento = data.dataNascimento || null;
        dataToUpdate.genero = data.genero || null;
        dataToUpdate.historicoMedico = data.historicoMedico || null;
        dataToUpdate.planoSaude = data.planoSaude || null;
      } else {
        dataToUpdate.nomeCompleto = data.nomeCompleto || undefined;
        dataToUpdate.telefone = data.telefone || undefined;
        dataToUpdate.crm = data.crm || null;
        dataToUpdate.especialidade = data.especialidade || null;
        dataToUpdate.anosExperiencia = data.anosExperiencia || null;
        dataToUpdate.biografia = data.biografia || null;
      }

      await updateDoc(userDocRef, dataToUpdate);

      toast({
        title: "Sucesso!",
        description: "Perfil completado com sucesso.",
        variant: "default",
      });

      navigate(data.tipo === "paciente" ? "/perfil-paciente" : "/perfil-medico");
    } catch (firestoreError: any) {
      console.error("Erro ao atualizar perfil:", firestoreError);
      toast({
        title: "Erro",
        description: `Não foi possível atualizar o perfil: ${firestoreError.message}`,
        variant: "destructive",
      });
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Escolha de tipo */}
      <div className="space-y-2">
        <Label className="text-base font-semibold">Tipo de conta</Label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => setValue("tipo", "paciente")}
            className={`
              p-4 border-2 rounded-lg transition-all
              ${tipoSelecionado === "paciente" 
                ? "border-blue-500 bg-blue-50" 
                : "border-gray-300 hover:border-blue-300"
              }
            `}
          >
            <User className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="font-medium">Paciente</p>
            <p className="text-sm text-gray-500">Agendar consultas</p>
          </button>
          <button
            type="button"
            onClick={() => setValue("tipo", "medico")}
            className={`
              p-4 border-2 rounded-lg transition-all
              ${tipoSelecionado === "medico" 
                ? "border-green-500 bg-green-50" 
                : "border-gray-300 hover:border-green-300"
              }
            `}
          >
            <Stethoscope className="w-8 h-8 mx-auto mb-2 text-green-500" />
            <p className="font-medium">Médico</p>
            <p className="text-sm text-gray-500">Gerenciar agenda</p>
          </button>
        </div>
        {errors.tipo && (
          <p className="text-sm text-red-500 mt-1">{errors.tipo.message}</p>
        )}
      </div>

      {/* Campos básicos se não existirem */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {!dadosPerfilExistente.nomeCompleto && (
          <div>
            <Label htmlFor="nomeCompleto">Nome completo</Label>
            <Input
              id="nomeCompleto"
              {...register("nomeCompleto")}
              className="mt-1"
            />
            {errors.nomeCompleto && (
              <p className="text-sm text-red-500 mt-1">
                {errors.nomeCompleto.message}
              </p>
            )}
          </div>
        )}

        {!dadosPerfilExistente.telefone && (
          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input
              id="telefone"
              {...register("telefone")}
              placeholder="(11) 99999-9999"
              className="mt-1"
            />
            {errors.telefone && (
              <p className="text-sm text-red-500 mt-1">
                {errors.telefone.message}
              </p>
            )}
          </div>
        )}
      </div>

      {/* Campos de paciente */}
      {tipoSelecionado === "paciente" && (
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-lg font-semibold text-blue-600">
            Informações do Paciente
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dataNascimento">Data de nascimento</Label>
              <Input
                id="dataNascimento"
                type="date"
                {...register("dataNascimento", { valueAsDate: true })}
                className="mt-1"
              />
            </div>

            <div>
              <Label>Gênero</Label>
              <Controller
                name="genero"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Selecione" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="masculino">Masculino</SelectItem>
                      <SelectItem value="feminino">Feminino</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                      <SelectItem value="prefiro-nao-informar">
                        Prefiro não informar
                      </SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.genero && (
                <p className="text-sm text-red-500 mt-1">{errors.genero.message}</p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="planoSaude">Plano de saúde (opcional)</Label>
            <Input
              id="planoSaude"
              {...register("planoSaude")}
              placeholder="Ex: Unimed, Bradesco Saúde"
              className="mt-1"
            />
          </div>

          <div>
            <Label htmlFor="historicoMedico">Histórico médico (opcional)</Label>
            <Textarea
              id="historicoMedico"
              {...register("historicoMedico")}
              placeholder="Descreva condições médicas relevantes, alergias, medicamentos em uso..."
              className="mt-1"
              rows={3}
            />
          </div>
        </div>
      )}

      {/* Campos de médico */}
      {tipoSelecionado === "medico" && (
        <div className="space-y-4 border-t pt-6">
          <h3 className="text-lg font-semibold text-green-600">
            Informações Profissionais
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="crm">CRM</Label>
              <Input
                id="crm"
                {...register("crm")}
                placeholder="Ex: CRM/SP 123456"
                className="mt-1"
              />
              {errors.crm && (
                <p className="text-sm text-red-500 mt-1">{errors.crm.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="especialidade">Especialidade</Label>
              <Input
                id="especialidade"
                {...register("especialidade")}
                placeholder="Ex: Cardiologia"
                className="mt-1"
              />
              {errors.especialidade && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.especialidade.message}
                </p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="anosExperiencia">Anos de experiência</Label>
              <Input
                id="anosExperiencia"
                type="number"
                {...register("anosExperiencia", { valueAsNumber: true })}
                className="mt-1"
                min="0"
                max="60"
              />
              {errors.anosExperiencia && (
                <p className="text-sm text-red-500 mt-1">
                  {errors.anosExperiencia.message}
                </p>
              )}
            </div>
          </div>

          <div>
            <Label htmlFor="biografia">Biografia (opcional)</Label>
            <Textarea
              id="biografia"
              {...register("biografia")}
              placeholder="Descreva sua formação, especializações, experiência..."
              className="mt-1"
              rows={4}
            />
            {errors.biografia && (
              <p className="text-sm text-red-500 mt-1">
                {errors.biografia.message}
              </p>
            )}
          </div>
        </div>
      )}

      <Button
        type="submit"
        className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600"
      >
        Completar Perfil
      </Button>
    </form>
  );
}

const Cadastro = () => {
  const [usuarioLogado, setUsuarioLogado] = useState<FirebaseAuthUser | null>(
    null
  );
  const [dadosPerfilExistente, setDadosPerfilExistente] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();
  const auth = getAuth();
  const db = getFirestore();

  useEffect(() => {
    console.log("Iniciando monitoramento de autenticação...");
    
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log("Estado de autenticação mudou:", user?.uid || "não logado");
      setLoading(true);
      setUsuarioLogado(user);

      if (user) {
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          console.log("Dados do usuário encontrados:", userData);
          setDadosPerfilExistente(userData);

          if (userData.tipo === "paciente" || userData.tipo === "medico") {
            toast({
              title: "Já cadastrado",
              description: "Você já possui um perfil completo.",
              variant: "default",
            });
            navigate(
              userData.tipo === "paciente"
                ? "/perfil-paciente"
                : "/perfil-medico"
            );
            setLoading(false);
            return;
          }
        } else {
          console.log("Criando documento básico para usuário logado...");
          try {
            await setDoc(userDocRef, {
              uid: user.uid,
              email: user.email,
              nomeCompleto: user.displayName || "Nome não informado",
              tipo: null,
              createdAt: new Date(),
            });
            setDadosPerfilExistente({
              uid: user.uid,
              email: user.email,
              nomeCompleto: user.displayName || "",
              tipo: null,
            });
          } catch (e) {
            console.error("Erro ao criar documento básico:", e);
            toast({
              title: "Erro",
              description: "Ocorreu um erro ao configurar seu perfil inicial.",
              variant: "destructive",
            });
            navigate("/");
          }
        }
      } else {
        setDadosPerfilExistente(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db, navigate, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-lg">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Link>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              {usuarioLogado && dadosPerfilExistente?.tipo === null
                ? "Completar seu Perfil"
                : "Criar Conta"}
            </CardTitle>
            <p className="text-gray-600">
              {usuarioLogado && dadosPerfilExistente?.tipo === null
                ? "Por favor, complete seus dados para continuar"
                : "Escolha o tipo de conta e preencha seus dados"}
            </p>
          </CardHeader>

          <CardContent>
            {usuarioLogado && !dadosPerfilExistente?.tipo ? (
              <CompletarPerfilForm
                usuario={usuarioLogado}
                dadosPerfilExistente={dadosPerfilExistente}
              />
            ) : (
              <CadastroCompletoForm />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cadastro;
