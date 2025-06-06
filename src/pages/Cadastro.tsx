import { useState } from "react";
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Shield,
  ArrowRight,
  Check
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link, useNavigate } from "react-router-dom";

const Cadastro = () => {
  const [tipoUsuario, setTipoUsuario] = useState<"paciente" | "medico" | null>(null);
  const [etapa, setEtapa] = useState(1);
  const navigate = useNavigate();

  const handleCriarConta = () => {
    // Aqui seria a lógica de criação da conta
    console.log("Criando conta para:", tipoUsuario);
    
    // Redireciona para a página de perfil apropriada após o cadastro
    if (tipoUsuario === "paciente") {
      navigate("/perfil-paciente");
    } else if (tipoUsuario === "medico") {
      navigate("/perfil-medico");
    }
  };

  const beneficiosPaciente = [
    "Agendamento gratuito de consultas",
    "Busca por médicos verificados",
    "Histórico médico organizado",
    "Lembretes automáticos",
    "Avaliações de outros pacientes"
  ];

  const beneficiosMedico = [
    "Gestão completa da agenda",
    "Aumento da base de pacientes",
    "Relatórios detalhados",
    "Pagamentos seguros",
    "Suporte especializado"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              AgendarBrasil
            </h1>
          </Link>
          <div className="flex items-center space-x-4">
            <span className="text-gray-600">Já tem conta?</span>
            <Link to="/login">
              <Button variant="outline">Entrar</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-16">
        {!tipoUsuario ? (
          /* Seleção do Tipo de Usuário */
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Como você quer usar o <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">AgendarBrasil</span>?
            </h2>
            <p className="text-xl text-gray-600 mb-12">
              Escolha o tipo de conta que melhor se adequa às suas necessidades.
            </p>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Card Paciente */}
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-blue-500" 
                    onClick={() => setTipoUsuario("paciente")}>
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-100 to-blue-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <User className="w-10 h-10 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl">Sou Paciente</CardTitle>
                  <p className="text-gray-600">Quero agendar consultas médicas</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {beneficiosPaciente.map((beneficio, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-sm">{beneficio}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800">
                    Cadastrar como Paciente
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>

              {/* Card Médico */}
              <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer border-2 hover:border-green-500" 
                    onClick={() => setTipoUsuario("medico")}>
                <CardHeader className="text-center pb-4">
                  <div className="w-20 h-20 bg-gradient-to-r from-green-100 to-green-200 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Shield className="w-10 h-10 text-green-600" />
                  </div>
                  <CardTitle className="text-2xl">Sou Médico</CardTitle>
                  <p className="text-gray-600">Quero gerenciar minha agenda e pacientes</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    {beneficiosMedico.map((beneficio, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <Check className="w-5 h-5 text-green-500" />
                        <span className="text-sm">{beneficio}</span>
                      </div>
                    ))}
                  </div>
                  <Button className="w-full bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800">
                    Cadastrar como Médico
                    <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        ) : (
          /* Formulário de Cadastro */
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Cadastro como {tipoUsuario === "paciente" ? "Paciente" : "Médico"}
              </h2>
              <p className="text-gray-600">
                Preencha seus dados para criar sua conta
              </p>
            </div>

            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    {tipoUsuario === "paciente" ? <User className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                    Dados Pessoais
                  </CardTitle>
                  <Badge variant="secondary">Etapa {etapa} de 2</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {etapa === 1 && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Nome Completo</label>
                        <Input placeholder="Seu nome completo" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Data de Nascimento</label>
                        <Input type="date" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">E-mail</label>
                      <Input type="email" placeholder="seu@email.com" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Telefone</label>
                      <Input placeholder="(11) 99999-9999" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Senha</label>
                      <Input type="password" placeholder="Crie uma senha segura" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Confirmar Senha</label>
                      <Input type="password" placeholder="Confirme sua senha" />
                    </div>
                  </div>
                )}

                {etapa === 2 && tipoUsuario === "paciente" && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">Endereço</label>
                      <Input placeholder="Rua, número, bairro" />
                    </div>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">Cidade</label>
                        <Input placeholder="Sua cidade" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Estado</label>
                        <Input placeholder="SP" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Plano de Saúde (opcional)</label>
                      <Input placeholder="Nome do plano de saúde" />
                    </div>
                  </div>
                )}

                {etapa === 2 && tipoUsuario === "medico" && (
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">CRM</label>
                        <Input placeholder="123456" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">Estado do CRM</label>
                        <Input placeholder="SP" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Especialidade Principal</label>
                      <Input placeholder="Ex: Cardiologia" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Local de Atendimento</label>
                      <Input placeholder="Endereço do consultório" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Valor da Consulta</label>
                      <Input placeholder="R$ 200,00" />
                    </div>
                  </div>
                )}

                <div className="flex gap-4">
                  {etapa === 2 && (
                    <Button variant="outline" onClick={() => setEtapa(1)} className="flex-1">
                      Voltar
                    </Button>
                  )}
                  {etapa === 1 ? (
                    <Button onClick={() => setEtapa(2)} className="flex-1 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600">
                      Próximo
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  ) : (
                    <Button onClick={handleCriarConta} className="flex-1 bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600">
                      Criar Conta
                      <Check className="w-4 h-4 ml-2" />
                    </Button>
                  )}
                </div>

                <div className="text-center pt-4 border-t">
                  <Button variant="link" onClick={() => setTipoUsuario(null)}>
                    Escolher outro tipo de conta
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cadastro;
