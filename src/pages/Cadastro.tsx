import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { useToast } from "@/components/ui/use-toast";
import type { CadastroFormData } from "@/types/user"; // <-- Assuma que aqui você importou o tipo correto

//
// ————————————————————————————————————————————————————————————————
// 1) ZOD Schemas
// ————————————————————————————————————————————————————————————————
// Cada formulário tem seu próprio schema, e passaremos cada um direto
// para `useForm({ resolver: zodResolver(...) })`.
// 
// * `cadastroCompletoSchema` para quem NÃO está autenticado.
// * `completarPerfilSchema` para quem JÁ está autenticado mas ainda não
//    tem `.tipo` preenchido no Firestore.
//

/** Campos obrigatórios para quem está fazendo o cadastro completo (usuário não autenticado) */
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
        // Se vier do input type="date", React Hook Form já converte para Date
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
  });

type CadastroCompletoInput = z.infer<typeof cadastroCompletoSchema>;

/** Campos para completar perfil (usuário já autenticado, mas Firestore ainda não continha `.tipo`) */
const completarPerfilSchema = z.object({
  tipo: z.enum(["paciente", "medico"], {
    required_error: "Por favor, selecione o tipo de conta.",
  }),
  // Todos os outros campos são opcionais aqui:
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

//
// ————————————————————————————————————————————————————————————————
// 2) Sub‐componente: CadastroCompletoForm
//    (quando o usuário NÃO está logado em Firebase Auth).
// ————————————————————————————————————————————————————————————————
function CadastroCompletoForm() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const auth = getAuth();
  const db = getFirestore();

  // Configura o form com o schema de cadastro completo:
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CadastroCompletoInput>({
    resolver: zodResolver(cadastroCompletoSchema),
    defaultValues: {
      tipo: "paciente",
    },
  });

  const onSubmit = async (data: CadastroCompletoInput) => {
    try {
      // 1) Cria o usuário no Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        data.email,
        data.senha
      );
      const newUser = userCredential.user;

      // 2) Prepara o objeto para gravar no Firestore:
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

      // 3) Grava no Firestore
      await setDoc(newUserDocRef, newUserDataToSave);

      toast({
        title: "Sucesso!",
        description: "Conta criada e informações salvas.",
        variant: "default",
      });

      // 4) Redireciona para o perfil correto
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Seletor de tipo */}
      <div className="space-y-2">
        <Label className="text-base font-semibold">Tipo de conta</Label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              // Simplesmente atualizamos o valor interno do RHF
              // para exibir o estado "Paciente" ou "Médico":
              // Podemos chamar setValue('tipo', 'paciente') aqui, mas
              // para simplificar, o próprio campo <input type="radio" /> faria isso.
            }}
            className={`
              p-4 border-2 rounded-lg transition-all
              ${/* Se o valor interno de "tipo" estiver em "paciente"... */ ""}
            `}
          >
            <User className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="font-medium">Paciente</p>
            <p className="text-sm text-gray-500">Agendar consultas</p>
          </button>
          <button
            type="button"
            className={`
              p-4 border-2 rounded-lg transition-all
              ${/* Se o valor interno de "tipo" estiver em "medico"... */ ""}
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

      {/* Campos “Paciente” */}
      {/** Observe que aqui podemos usar `watch("tipo")` caso queiramos esconder/exibir em tempo real */}
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
            <Select
              onValueChange={(value) =>
                // cast explícito porque nosso Zod espera z.enum<...>
                // mas SelectValue é só uma string
                value
              }
            >
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

      {/* Campos “Médico” */}
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
      </div>

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

//
// ————————————————————————————————————————————————————————————————
// 3) Sub‐componente: CompletarPerfilForm
//    (quando o usuário JÁ está logado mas não tem `tipo` em Firestore)
// ————————————————————————————————————————————————————————————————
interface CompletarPerfilFormProps {
  usuario: FirebaseAuthUser;
  dadosPerfilExistente: any; // o objeto que veio do Firestore, sem `.tipo`
  // Adicione quaisquer outras props que você realmente precisa passar de Cadastro para cá
}

function CompletarPerfilForm({
  usuario,
  dadosPerfilExistente,
}: {
  usuario: FirebaseAuthUser;
  dadosPerfilExistente: any; // o objeto que veio do Firestore, sem `.tipo`
}) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const db = getFirestore();

  // Montamos o formulário com “defaultValues” a partir do `dadosPerfilExistente`
  const {
    register,
    handleSubmit,
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

  const onSubmit = async (data: CompletarPerfilInput) => {
    try {
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
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {/* Escolha de tipo */}
      <div className="space-y-2">
        <Label className="text-base font-semibold">Tipo de conta</Label>
        <div className="grid grid-cols-2 gap-4">
          <button
            type="button"
            onClick={() => {
              /* Chamaria setValue("tipo", "paciente") se precisássemos */
            }}
            className={`
              p-4 border-2 rounded-lg transition-all
              ${/* destaque se for "paciente" */ ""}
            `}
          >
            <User className="w-8 h-8 mx-auto mb-2 text-blue-500" />
            <p className="font-medium">Paciente</p>
            <p className="text-sm text-gray-500">Agendar consultas</p>
          </button>
          <button
            type="button"
            className={`
              p-4 border-2 rounded-lg transition-all
              ${/* destaque se for "medico" */ ""}
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

      {/* Se usuário veio do Google/Firebase, preenchemos apenas os campos faltantes */}
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
              defaultValue={
                dadosPerfilExistente?.dataNascimento
                  ? new Date(
                      dadosPerfilExistente.dataNascimento.seconds * 1000
                    )
                      .toISOString()
                      .split("T")[0]
                  : ""
              }
            />
          </div>

          <div>
            <Label>Gênero</Label>
            <Select
              onValueChange={(value) =>
                /* usar setValue("genero", value) se precisarmos */
                undefined
              }
              defaultValue={dadosPerfilExistente?.genero}
            >
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
            defaultValue={dadosPerfilExistente?.planoSaude || ""}
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
            defaultValue={dadosPerfilExistente?.historicoMedico || ""}
          />
        </div>
      </div>

      {/* Campos de médico */}
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
              defaultValue={dadosPerfilExistente?.crm || ""}
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
              defaultValue={dadosPerfilExistente?.especialidade || ""}
            />
            {errors.especialidade && (
              <p className="text-sm text-red-500 mt-1">
                {errors.especialidade.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="anosExperiencia">Anos de experiência</Label>
            <Input
              id="anosExperiencia"
              type="number"
              {...register("anosExperiencia", { valueAsNumber: true })}
              className="mt-1"
              min="0"
              max="60"
              defaultValue={dadosPerfilExistente?.anosExperiencia || ""}
            />
            {errors.anosExperiencia && (
              <p className="text-sm text-red-500 mt-1">
                {errors.anosExperiencia.message}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="biografia">Biografia (opcional)</Label>
            <Textarea
              id="biografia"
              {...register("biografia")}
              placeholder="Descreva sua formação, especializações, experiência..."
              className="mt-1"
              rows={4}
              defaultValue={dadosPerfilExistente?.biografia || ""}
            />
            {errors.biografia && (
              <p className="text-sm text-red-500 mt-1">
                {errors.biografia.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <Button
        type="submit"
        className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600"
      >
        Completar Perfil
      </Button>
    </form>
  );
}

//
// ————————————————————————————————————————————————————————————————
// 4) Componente principal “Cadastro”
//    Decide qual sub‐form renderizar (cadastro novo vs. completar perfil).
// ————————————————————————————————————————————————————————————————
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
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setLoading(true);
      setUsuarioLogado(user);

      if (user) {
        // Tenta buscar o documento no Firestore:
        const userDocRef = doc(db, "users", user.uid);
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const userData = userDocSnap.data();
          setDadosPerfilExistente(userData);

          // Se já houver “tipo” definido, redireciona imediatamente:
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

          // Se não tiver “tipo”, deixamos dadosPerfilExistente no estado
          // e exibir o form de “completar perfil”.
        } else {
          // Usuário autenticado, mas sem doc no Firestore.
          // Cria um documento minimalista e depois exibe o form de completar:
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
            console.error(
              "Erro ao criar documento básico no Firestore para usuário logado:",
              e
            );
            toast({
              title: "Erro",
              description: "Ocorreu um erro ao configurar seu perfil inicial.",
              variant: "destructive",
            });
            navigate("/");
          }
        }
      } else {
        // Não há usuário logado → mostraremos o cadastro completo
        setDadosPerfilExistente(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth, db, navigate, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Carregando...
      </div>
    );
  }

  // Se estiver logado mas já tiver tipo preenchido, o useEffect acima teria redirecionado.
  // Portanto, chegamos aqui em dois casos:
  //
  // - Caso A: `usuarioLogado === null`  → MOSTRAR `CadastroCompletoForm`.
  // - Caso B: `usuarioLogado !== null && dadosPerfilExistente?.tipo === null`
  //            → MOSTRAR `CompletarPerfilForm`.

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
                usuario={usuarioLogado} // Passa o usuário logado
                dadosPerfilExistente={dadosPerfilExistente} // Passa os dados existentes
                // Remova outras props que são gerenciadas internamente ou não são necessárias
              />
            ) : (
              <CadastroCompletoForm
                // Remova props que são gerenciadas internamente ou não são necessárias
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cadastro;
