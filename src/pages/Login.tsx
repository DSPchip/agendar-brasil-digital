
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, EyeOff, Fingerprint } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { 
  getAuth, 
  signInWithEmailAndPassword,
  User as FirebaseAuthUser 
} from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido").optional().or(z.literal("")), 
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres.").optional().or(z.literal("")),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState<'email' | 'biometric'>('email');
  const navigate = useNavigate();
  const { toast } = useToast();
  const auth = getAuth();
  const db = getFirestore();

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
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

  // Lógica de login com biometria
  const handleBiometricLogin = async () => {
    if (!window.PublicKeyCredential) {
      toast({
        title: "Não suportado",
        description: "Seu navegador não suporta autenticação biométrica.",
        variant: "destructive",
      });
      return;
    }

    try {
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: new Uint8Array(32),
          rp: {
            name: "AgendarBrasil",
            id: window.location.hostname,
          },
          user: {
            id: new Uint8Array(16),
            name: "user@example.com",
            displayName: "Usuário",
          },
          pubKeyCredParams: [{
            type: "public-key",
            alg: -7,
          }],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required",
          },
          timeout: 60000,
          attestation: "direct"
        }
      });

      if (credential) {
        toast({
          title: "Sucesso!",
          description: "Autenticação biométrica realizada com sucesso.",
          variant: "default",
        });
        // Aqui você implementaria a validação do credential com seu backend
        navigate("/perfil-paciente"); // Redirecionamento temporário
      }
    } catch (error: any) {
      console.error("Erro na autenticação biométrica:", error);
      toast({
        title: "Erro",
        description: "Falha na autenticação biométrica. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (data: LoginFormData) => {
    if (loginMethod === 'email') {
      await onEmailPasswordSubmit(data);
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
                onClick={() => setLoginMethod('email')}
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
                onClick={() => setLoginMethod('biometric')}
                className={`flex-1 py-2 px-4 rounded-md transition-all ${
                  loginMethod === 'biometric'
                    ? 'bg-white text-blue-600 shadow-sm'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                Biometria
              </button>
            </div>

            {loginMethod === 'email' && (
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

                <Button 
                  type="submit" 
                  className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600"
                >
                  Entrar
                </Button>
              </form>
            )}

            {loginMethod === 'biometric' && (
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Fingerprint className="w-16 h-16 mx-auto text-blue-600 mb-4" />
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Autenticação Biométrica
                  </h3>
                  <p className="text-gray-600 mb-6">
                    Use sua impressão digital ou reconhecimento facial para fazer login
                  </p>
                  <Button 
                    onClick={handleBiometricLogin}
                    className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600"
                  >
                    <Fingerprint className="w-5 h-5 mr-2" />
                    Autenticar com Biometria
                  </Button>
                </div>
              </div>
            )}

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
    </div>
  );
};

export default Login;
