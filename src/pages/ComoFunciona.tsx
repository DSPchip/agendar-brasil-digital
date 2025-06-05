
import { ArrowLeft, Search, Calendar, CheckCircle, Users, Clock, Shield, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";

const ComoFunciona = () => {
  const passosPaciente = [
    {
      numero: 1,
      titulo: "Busque seu médico",
      descricao: "Use nossa busca inteligente para encontrar médicos por especialidade, localização e disponibilidade.",
      icone: <Search className="w-8 h-8 text-blue-600" />
    },
    {
      numero: 2,
      titulo: "Escolha o horário",
      descricao: "Veja os horários disponíveis em tempo real e escolha o que melhor se adapta à sua agenda.",
      icone: <Calendar className="w-8 h-8 text-blue-600" />
    },
    {
      numero: 3,
      titulo: "Confirme sua consulta",
      descricao: "Receba confirmação instantânea e lembretes automáticos da sua consulta.",
      icone: <CheckCircle className="w-8 h-8 text-blue-600" />
    }
  ];

  const passosMedico = [
    {
      numero: 1,
      titulo: "Cadastre-se gratuitamente",
      descricao: "Crie seu perfil profissional com suas especialidades, horários e localização.",
      icone: <Users className="w-8 h-8 text-green-600" />
    },
    {
      numero: 2,
      titulo: "Gerencie sua agenda",
      descricao: "Configure seus horários disponíveis e deixe o sistema gerenciar automaticamente.",
      icone: <Clock className="w-8 h-8 text-green-600" />
    },
    {
      numero: 3,
      titulo: "Receba pacientes",
      descricao: "Atenda mais pacientes com uma agenda organizada e confirmações automáticas.",
      icone: <Star className="w-8 h-8 text-green-600" />
    }
  ];

  const vantagens = [
    {
      titulo: "Gratuito para Pacientes",
      descricao: "Busque e agende consultas sem nenhum custo adicional.",
      icone: <CheckCircle className="w-12 h-12 text-green-500" />
    },
    {
      titulo: "Confirmação Instantânea",
      descricao: "Receba confirmação imediata do seu agendamento.",
      icone: <Clock className="w-12 h-12 text-blue-500" />
    },
    {
      titulo: "Segurança de Dados",
      descricao: "Seus dados estão protegidos com criptografia de ponta.",
      icone: <Shield className="w-12 h-12 text-purple-500" />
    },
    {
      titulo: "Lembretes Automáticos",
      descricao: "Nunca mais esqueça uma consulta com nossos lembretes.",
      icone: <Calendar className="w-12 h-12 text-orange-500" />
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              AgendarBrasil
            </h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <Link to="/para-pacientes" className="text-gray-600 hover:text-blue-600 transition-colors">Para Pacientes</Link>
            <Link to="/para-medicos" className="text-gray-600 hover:text-blue-600 transition-colors">Para Médicos</Link>
            <Link to="/como-funciona" className="text-blue-600 font-medium">Como Funciona</Link>
          </nav>
          <div className="flex space-x-2">
            <Link to="/login">
              <Button variant="outline" className="hidden sm:flex">Entrar</Button>
            </Link>
            <Link to="/cadastro">
              <Button className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600">
                Cadastrar
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Botão Voltar */}
      <div className="container mx-auto px-4 py-6">
        <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Voltar ao início
        </Link>
      </div>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          Como o <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">AgendarBrasil</span> funciona?
        </h2>
        <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
          Conectamos pacientes e médicos de forma simples, rápida e segura. 
          Descubra como nossa plataforma facilita o agendamento de consultas.
        </p>
      </section>

      {/* Para Pacientes */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Para Pacientes</h3>
          <p className="text-lg text-gray-600">Agende sua consulta em 3 passos simples</p>
        </div>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {passosPaciente.map((passo, index) => (
            <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  {passo.icone}
                </div>
                <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  {passo.numero}
                </div>
                <CardTitle className="text-xl">{passo.titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{passo.descricao}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Para Médicos */}
      <section className="bg-gradient-to-r from-green-50 to-blue-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Para Médicos</h3>
            <p className="text-lg text-gray-600">Gerencie sua agenda de forma profissional</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {passosMedico.map((passo, index) => (
              <Card key={index} className="text-center border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    {passo.icone}
                  </div>
                  <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                    {passo.numero}
                  </div>
                  <CardTitle className="text-xl">{passo.titulo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{passo.descricao}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Vantagens */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h3 className="text-3xl font-bold text-gray-900 mb-4">Vantagens do AgendarBrasil</h3>
          <p className="text-lg text-gray-600">Por que escolher nossa plataforma</p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {vantagens.map((vantagem, index) => (
            <Card key={index} className="text-center border-0 shadow-md hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex justify-center mb-4">
                  {vantagem.icone}
                </div>
                <CardTitle className="text-lg">{vantagem.titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{vantagem.descricao}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* FAQ Seção */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Perguntas Frequentes</h3>
          </div>
          
          <div className="max-w-3xl mx-auto space-y-6">
            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">O AgendarBrasil é gratuito?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Sim! Para pacientes, o uso é 100% gratuito. Para médicos, oferecemos um plano gratuito 
                  com funcionalidades básicas e planos premium com recursos avançados.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Como posso cancelar uma consulta?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Você pode cancelar uma consulta diretamente pelo seu perfil na plataforma ou 
                  pelos links nos e-mails de confirmação, respeitando as políticas de cancelamento.
                </p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-md">
              <CardHeader>
                <CardTitle className="text-lg">Meus dados estão seguros?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Absolutamente! Utilizamos criptografia de ponta e seguimos todas as normas da LGPD 
                  para garantir a segurança e privacidade dos seus dados.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-bold mb-6">Pronto para começar?</h3>
          <p className="text-xl text-gray-600 mb-8">
            Junte-se a milhares de usuários que já descobriram a praticidade do AgendarBrasil.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cadastro">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600">
                Começar Agora
              </Button>
            </Link>
            <Link to="/para-pacientes">
              <Button size="lg" variant="outline">
                Saber Mais
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <span className="text-xl font-bold">AgendarBrasil</span>
              </div>
              <p className="text-gray-400">Conectando pacientes e médicos em todo o Brasil.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Para Pacientes</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/como-funciona" className="hover:text-white transition-colors">Como Funciona</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Buscar Médicos</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Minhas Consultas</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Para Médicos</h4>
              <ul className="space-y-2 text-gray-400">
                <li><Link to="/cadastro" className="hover:text-white transition-colors">Cadastre-se</Link></li>
                <li><a href="#" className="hover:text-white transition-colors">Dashboard</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Suporte</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Termos de Uso</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Privacidade (LGPD)</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contato</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 AgendarBrasil. Todos os direitos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ComoFunciona;
