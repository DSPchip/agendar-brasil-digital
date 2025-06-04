
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, EyeOff, Phone } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  signInWithPhoneNumber, 
  RecaptchaVerifier,
  ConfirmationResult,
  User as FirebaseAuthUser 
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido").optional().or(z.literal("")), 
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres.").optional().or(z.literal("")),
  telefone: z.string().optional().or(z.literal("")),
  codigoVerificacao: z.string().optional().or(z.literal("")),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'phone'>('email');
  const [verificationStep, setVerificationStep] = useState(false);
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const auth = getAuth();
  const db = getFirestore();

  const { register, handleSubmit, formState: { errors }, reset, getValues } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Função para buscar o tipo de usuário e redirecionar
  const fetchUserAndRedirect = async (user: FirebaseAuthUser) => {
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);

    if (userDocSnap.exists()) {
      const userData = userDocSnap.data();
      if (userData && userData.tipo) {
        if (userData.tipo === 'paciente') {
          navigate("/perfil-paciente");
        } else if (userData.tipo === 'medico') {
          navigate("/perfil-medico");
        } else {
          console.error("Tipo de usuário desconhecido no Firestore:", userData.tipo);
          toast({
            title: "Perfil incompleto",
            description: "Por favor, complete seu cadastro para continuar.",
            variant: "default",
          });
          navigate("/cadastro");
        }
      } else {
        console.error("Documento do usuário sem campo 'tipo' no Firestore.");
         toast({
            title: "Perfil incompleto",
            description: "Por favor, complete seu cadastro para continuar.",
            variant: "default",
          });
        navigate("/cadastro");
      }
    } else {
      console.error("Documento do usuário não encontrado no Firestore após login.");
       toast({
          title: "Erro",
          description: "Ocorreu um erro ao buscar seus dados de perfil.",
          variant: "destructive",
        });
      navigate("/");
    }
  };

  // Lógica de login com E-mail e Senha
  const onEmailPasswordSubmit = async (data: LoginFormData) => {
    if (!data.email || !data.senha) {
        toast({
            title: "Erro",
            description: "Por favor, insira e-mail e senha para login.",
            variant: "destructive",
        });
        return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.senha);
      const user = userCredential.user;
      
      toast({
        title: "Sucesso!",
        description: "Login realizado com sucesso.",
        variant: "default",
      });

      await fetchUserAndRedirect(user);

    } catch (error: any) {
      console.error("Erro de login:", error.message);
      let errorMessage = "Ocorreu um erro ao fazer login. Tente novamente.";

      switch (error.code) {
        case 'auth/user-not-found':
          errorMessage = "Nenhum usuário encontrado com este e-mail.";
          break;
        case 'auth/wrong-password':
          errorMessage = "Senha incorreta.";
          break;
        case 'auth/invalid-email':
          errorMessage = "Endereço de e-mail inválido.";
          break;
        case 'auth/invalid-credential':
            errorMessage = "Credenciais inválidas. Verifique seu e-mail e senha.";
            break;
        default:
          errorMessage = "Ocorreu um erro ao fazer login. Tente novamente.";
      }

      toast({
        title: "Erro no Login",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  // Lógica de login com telefone
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        'size': 'invisible',
        'callback': () => {
          console.log('reCAPTCHA resolved');
        }
      });
    }
  };

  const handlePhoneLogin = async (data: LoginFormData) => {
    if (!data.telefone) {
      toast({
        title: "Erro",
        description: "Por favor, insira o número de telefone.",
        variant: "destructive",
      });
      return;
    }

    try {
      setupRecaptcha();
      const phoneNumber = data.telefone.startsWith('+55') ? data.telefone : `+55${data.telefone}`;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, window.recaptchaVerifier);
      setConfirmationResult(confirmation);
      setVerificationStep(true);
      
      toast({
        title: "Código enviado!",
        description: "Verifique seu telefone e insira o código de verificação.",
        variant: "default",
      });
    } catch (error: any) {
      console.error("Erro no login com telefone:", error.message);
      toast({
        title: "Erro",
        description: "Erro ao enviar código de verificação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const handleVerifyCode = async (data: LoginFormData) => {
    if (!data.codigoVerificacao || !confirmationResult) {
      toast({
        title: "Erro",
        description: "Por favor, insira o código de verificação.",
        variant: "destructive",
      });
      return;
    }

    try {
      const result = await confirmationResult.confirm(data.codigoVerificacao);
      const user = result.user;
      
      toast({
        title: "Sucesso!",
        description: "Login com telefone realizado com sucesso.",
        variant: "default",
      });

      await fetchUserAndRedirect(user);
    } catch (error: any) {
      console.error("Erro na verificação do código:", error.message);
      toast({
        title: "Erro",
        description: "Código de verificação inválido.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    if (loginMethod === 'email') {
      await onEmailPasswordSubmit(data);
    } else if (loginMethod === 'phone' && !verificationStep) {
      await handlePhoneLogin(data);
    } else if (loginMethod === 'phone' && verificationStep) {
      await handleVerifyCode(data);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 flex items-center justify-center">
      <div className="container mx-auto max-w-md">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar ao início
          </Link>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              Entrar
            </CardTitle>
            <p className="text-gray-600">Acesse sua conta no AgendarBrasil</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Seletor de método de login */}
            <div className="flex space-x-2 p-1 bg-gray-100 rounded-lg">
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('email');
                  setVerificationStep(false);
                  reset();
                }}
                className={`flex-1 py-2 px-4 rounded-md transition-all ${
                  loginMethod === 'email'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                E-mail/Senha
              </button>
              <button
                type="button"
                onClick={() => {
                  setLoginMethod('phone');
                  setVerificationStep(false);
                  reset();
                }}
                className={`flex-1 py-2 px-4 rounded-md transition-all ${
                  loginMethod === 'phone'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Smartphone
              </button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {loginMethod === 'email' && (
                <>
                  <div>
                    <Label htmlFor="email">E-mail</Label>
                    <Input
                      id="email"
                      type="email"
                      {...register('email')}
                      className="mt-1"
                      placeholder="seu@email.com"
                    />
                    {errors.email && (
                      <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="senha">Senha</Label>
                    <div className="relative mt-1">
                      <Input
                        id="senha"
                        type={showPassword ? "text" : "password"}
                        {...register('senha')}
                        className="pr-10"
                        placeholder="Digite sua senha"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4" />
                        ) : (
                          <Eye className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    {errors.senha && (
                      <p className="text-sm text-red-500 mt-1">{errors.senha.message}</p>
                    )}
                  </div>
                </>
              )}

              {loginMethod === 'phone' && !verificationStep && (
                <div>
                  <Label htmlFor="telefone">Número de Telefone</Label>
                  <div className="relative mt-1">
                    <Phone className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                    <Input
                      id="telefone"
                      type="tel"
                      {...register('telefone')}
                      className="pl-10"
                      placeholder="(11) 99999-9999"
                    />
                  </div>
                  {errors.telefone && (
                    <p className="text-sm text-red-500 mt-1">{errors.telefone.message}</p>
                  )}
                </div>
              )}

              {loginMethod === 'phone' && verificationStep && (
                <div>
                  <Label htmlFor="codigoVerificacao">Código de Verificação</Label>
                  <Input
                    id="codigoVerificacao"
                    type="text"
                    {...register('codigoVerificacao')}
                    className="mt-1"
                    placeholder="Digite o código recebido"
                    maxLength={6}
                  />
                  {errors.codigoVerificacao && (
                    <p className="text-sm text-red-500 mt-1">{errors.codigoVerificacao.message}</p>
                  )}
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600"
              >
                {loginMethod === 'email' && 'Entrar'}
                {loginMethod === 'phone' && !verificationStep && 'Enviar Código'}
                {loginMethod === 'phone' && verificationStep && 'Verificar Código'}
              </Button>

              {loginMethod === 'phone' && verificationStep && (
                <Button 
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setVerificationStep(false);
                    setConfirmationResult(null);
                    reset();
                  }}
                  className="w-full"
                >
                  Voltar
                </Button>
              )}
            </form>

            <div className="text-center mt-6">
              <p className="text-gray-600">
                Não tem uma conta?{' '}
                <Link to="/cadastro" className="text-blue-600 hover:text-blue-700 font-medium">
                  Cadastre-se
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Container invisível para reCAPTCHA */}
      <div id="recaptcha-container"></div>
    </div>
  );
};

export default Login;
