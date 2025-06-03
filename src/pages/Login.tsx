import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, User as FirebaseAuthUser } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido").optional().or(z.literal("")), 
  senha: z.string().min(6, "A senha deve ter pelo menos 6 caracteres.").optional().or(z.literal("")),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const auth = getAuth();
  const db = getFirestore();

  const { register, handleSubmit, formState: { errors }, reset } = useForm<LoginFormData>({
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
          // Tipo de usuário desconhecido, redirecionar para completar perfil
          console.error("Tipo de usuário desconhecido no Firestore:", userData.tipo);
          toast({
            title: "Perfil incompleto",
            description: "Por favor, complete seu cadastro para continuar.",
            variant: "default",
          });
          navigate("/cadastro"); // Redireciona para o cadastro para completar
        }
      } else {
        // Documento do usuário existe, mas não tem o campo 'tipo'. Redirecionar para completar perfil.
        console.error("Documento do usuário sem campo 'tipo' no Firestore.");
         toast({
            title: "Perfil incompleto",
            description: "Por favor, complete seu cadastro para continuar.",
            variant: "default",
          });
        navigate("/cadastro"); // Redireciona para o cadastro para completar
      }
    } else {
      // Documento do usuário não encontrado no Firestore após login. Erro no cadastro inicial via Google.
      console.error("Documento do usuário não encontrado no Firestore após login Google.");
       toast({
          title: "Erro",
          description: "Ocorreu um erro ao buscar seus dados de perfil.",
          variant: "destructive",
        });
      navigate("/"); // Redireciona para o início como fallback
    }
  };

  // Lógica de login com E-mail e Senha
  const onEmailPasswordSubmit = async (data: LoginFormData) => {
    if (!data.email || !data.senha) {
        toast({
            title: "Erro",
            description: "Por favor, insira e-mail e senha para login ou use o Login com Google.",
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

  // Lógica de login com Google
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Verificar se o documento do usuário existe no Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
         const userData = userDocSnap.data();
         // Se o documento existe MAS o tipo está faltando ou é inválido, redirecionar para cadastro.
         if (!userData || (userData.tipo !== 'paciente' && userData.tipo !== 'medico')) {
            console.warn("Documento do usuário Google existe, mas tipo está faltando/inválido. Redirecionando para cadastro.", userData);
             toast({
               title: "Perfil incompleto",
               description: "Por favor, complete seu cadastro para continuar.",
               variant: "default",
             });
             navigate("/cadastro"); // Redireciona para o cadastro para completar
         } else {
            // Documento existe E tem um tipo válido, buscar dados e redirecionar normalmente
            toast({
              title: "Sucesso!",
              description: "Login com Google realizado com sucesso.",
              variant: "default",
            });
            await fetchUserAndRedirect(user); // Esta função vai verificar o tipo novamente e redirecionar
         }

      } else {
        // Documento não existe, é o primeiro login com Google. Salvar dados básicos e redirecionar para cadastro.
        console.log("Primeiro login com Google. Criando documento básico no Firestore.");
        try {
           await setDoc(userDocRef, {
             uid: user.uid,
             email: user.email,
             nomeCompleto: user.displayName || 'Nome não informado', // Usar displayName do Google se disponível
             tipo: null, // Definir como null inicialmente para indicar que precisa completar o perfil
             createdAt: new Date(),
           });

           toast({
             title: "Bem-vindo!",
             description: "Por favor, complete seu cadastro para continuar.",
             variant: "default",
           });
           // Redirecionar para a página de cadastro para completar o perfil
           navigate("/cadastro"); 

        } catch (firestoreError: any) {
           console.error("Erro ao criar documento do usuário no Firestore após login Google:", firestoreError.message);
            toast({
              title: "Erro",
              description: "Ocorreu um erro ao configurar seu perfil. Tente novamente.",
              variant: "destructive",
            });
           navigate("/"); // Redirecionar para o início em caso de erro no Firestore
        }
      }

    } catch (error: any) {
      console.error("Erro no login com Google:", error.message);
      let errorMessage = "Ocorreu um erro ao fazer login com Google.";
      
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Login com Google cancelado.";
      } else if (error.code === 'auth/cancelled-popup-request') {
        errorMessage = "Uma solicitação de login com Google já está em andamento.";
      } else {
         errorMessage = `Erro: ${error.message}`;
      }

      toast({
        title: "Erro no Login com Google",
        description: errorMessage,
        variant: "destructive",
      });
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
            <form onSubmit={handleSubmit(onEmailPasswordSubmit)} className="space-y-4">
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

              {/* Pode adicionar um link para "Esqueceu a senha?" aqui se tiver a rota implementada */}

              <Button 
                type="submit" 
                className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600"
              >
                Entrar
              </Button>
            </form>

            {/* Implementação básica de login com Google */}
            <div className="relative mt-6">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-gray-300"></span>
              </div>
              <div className="relative flex justify-center text-sm uppercase">
                <span className="bg-white px-2 text-gray-500">Ou entre com</span>
              </div>
            </div>
            <Button 
              variant="outline" 
              className="w-full h-12 flex items-center justify-center gap-2"
              onClick={handleGoogleLogin} // Chamar a função de login com Google
            >
              {/* Ícone do Google aqui - você pode adicionar um SVG ou uma imagem */}
              Login com Google
            </Button>

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
