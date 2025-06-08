
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Stethoscope, ArrowRight } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, updateDoc } from "firebase/firestore";
import { useToast } from "@/components/ui/use-toast";

const EscolhaPerfil = () => {
  const [selectedTipo, setSelectedTipo] = useState<'paciente' | 'medico' | ''>('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const auth = getAuth();
  const db = getFirestore();

  const handleConfirmarEscolha = async () => {
    if (!selectedTipo) {
      toast({
        title: "Seleção obrigatória",
        description: "Por favor, escolha um tipo de perfil.",
        variant: "destructive",
      });
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      toast({
        title: "Erro",
        description: "Usuário não autenticado. Faça login novamente.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setLoading(true);
    
    try {
      // Atualizar o documento do usuário com o tipo selecionado
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        tipo: selectedTipo,
        perfilCompleto: false, // Pode ser usado para indicar que precisa completar dados específicos
        atualizadoEm: new Date(),
      });

      toast({
        title: "Perfil definido!",
        description: `Você foi cadastrado como ${selectedTipo}.`,
        variant: "default",
      });

      // Redirecionar para o perfil correto
      if (selectedTipo === 'paciente') {
        navigate("/perfil-paciente");
      } else {
        navigate("/perfil-medico");
      }

    } catch (error) {
      console.error("Erro ao salvar tipo de perfil:", error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar sua escolha. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4 flex items-center justify-center">
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
              Escolha seu Perfil
            </CardTitle>
            <p className="text-gray-600">Como você gostaria de usar o AgendarBrasil?</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Opções de Perfil */}
            <div className="grid md:grid-cols-2 gap-6">
              {/* Paciente */}
              <Card 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedTipo === 'paciente' 
                    ? 'ring-2 ring-blue-500 bg-blue-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedTipo('paciente')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-8 h-8 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Sou Paciente</h3>
                  <p className="text-gray-600 text-sm">
                    Quero encontrar médicos e agendar consultas
                  </p>
                  <ul className="text-sm text-gray-500 mt-4 space-y-1">
                    <li>• Buscar especialistas</li>
                    <li>• Agendar consultas</li>
                    <li>• Avaliar médicos</li>
                    <li>• Histórico médico</li>
                  </ul>
                </CardContent>
              </Card>

              {/* Médico */}
              <Card 
                className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                  selectedTipo === 'medico' 
                    ? 'ring-2 ring-green-500 bg-green-50' 
                    : 'hover:bg-gray-50'
                }`}
                onClick={() => setSelectedTipo('medico')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Stethoscope className="w-8 h-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold mb-2">Sou Médico</h3>
                  <p className="text-gray-600 text-sm">
                    Quero gerenciar minha agenda e atender pacientes
                  </p>
                  <ul className="text-sm text-gray-500 mt-4 space-y-1">
                    <li>• Gerenciar agenda</li>
                    <li>• Receber pacientes</li>
                    <li>• Teleconsultas</li>
                    <li>• Dashboard médico</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Botão de Confirmação */}
            <div className="flex justify-center pt-6">
              <Button 
                onClick={handleConfirmarEscolha}
                disabled={!selectedTipo || loading}
                className="w-full max-w-md h-12 text-lg bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600 disabled:opacity-50"
              >
                {loading ? (
                  "Salvando..."
                ) : (
                  <>
                    Continuar
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </>
                )}
              </Button>
            </div>

            {/* Informação adicional */}
            <div className="text-center text-sm text-gray-500 pt-4">
              <p>Você poderá alterar essas configurações depois em seu perfil.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EscolhaPerfil;
