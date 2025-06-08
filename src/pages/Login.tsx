
import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { 
  getAuth, 
  signInWithPopup,
  GoogleAuthProvider,
  User as FirebaseAuthUser 
} from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";

const Login = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const auth = getAuth();
  const db = getFirestore();

  // Executar Google Login automaticamente quando a página carregar
  useEffect(() => {
    handleGoogleLogin();
  }, []);

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      
      // Verificar se o usuário já existe no Firestore
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // Usuário já existe, redirecionar para o perfil correto
        const userData = userDocSnap.data();
        if (userData.tipo === 'paciente') {
          navigate("/perfil-paciente");
        } else if (userData.tipo === 'medico') {
          navigate("/perfil-medico");
        } else {
          // Usuário existe mas sem tipo definido, ir para escolha
          navigate("/escolha-perfil");
        }
      } else {
        // Novo usuário, salvar dados básicos e ir para escolha de perfil
        await setDoc(userDocRef, {
          uid: user.uid,
          email: user.email,
          nome: user.displayName || '',
          foto: user.photoURL || '',
          provider: 'google',
          criadoEm: new Date(),
          // tipo será definido na próxima etapa
        });
        
        navigate("/escolha-perfil");
      }

      toast({
        title: "Login realizado com sucesso!",
        description: `Bem-vindo, ${user.displayName || user.email}`,
        variant: "default",
      });

    } catch (error: any) {
      console.error("Erro no Google Login:", error);
      
      let errorMessage = "Erro ao fazer login com Google";
      if (error.code === 'auth/popup-closed-by-user') {
        errorMessage = "Login cancelado pelo usuário";
      } else if (error.code === 'auth/popup-blocked') {
        errorMessage = "Popup bloqueado. Permita popups para este site";
      }

      toast({
        title: "Erro no Login",
        description: errorMessage,
        variant: "destructive",
      });

      // Redirecionar de volta para home em caso de erro
      navigate("/");
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
              Entrando...
            </CardTitle>
            <p className="text-gray-600">Conectando com sua conta Google</p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">
                Aguarde enquanto redirecionamos você para o login do Google...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;
