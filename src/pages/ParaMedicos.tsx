
import { useState } from "react";
import { 
  Calendar, 
  Users, 
  Clock, 
  TrendingUp, 
  Shield, 
  Smartphone, 
  CheckCircle,
  ArrowRight,
  Star,
  BarChart3,
  MessageSquare,
  CreditCard
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";

const ParaMedicos = () => {
  const beneficios = [
    {
      icon: Users,
      titulo: "Mais Pacientes",
      descricao: "Alcance milhares de pacientes que procuram por sua especialidade em toda sua região."
    },
    {
      icon: Calendar,
      titulo: "Gestão de Agenda",
      descricao: "Controle total da sua agenda com sistema inteligente de agendamentos e lembretes automáticos."
    },
    {
      icon: TrendingUp,
      titulo: "Aumente sua Receita",
      descricao: "Maximize seus horários disponíveis e reduza faltas com confirmações automáticas."
    },
    {
      icon: Clock,
      titulo: "Economize Tempo",
      descricao: "Reduza ligações e administração manual. Foque no que importa: cuidar dos pacientes."
    },
    {
      icon: Shield,
      titulo: "Segurança Total",
      descricao: "Plataforma em conformidade com LGPD e normas do CFM para proteção de dados médicos."
    },
    {
      icon: BarChart3,
      titulo: "Relatórios Detalhados",
      descricao: "Acompanhe métricas importantes: pacientes atendidos, receita, horários de maior demanda."
    }
  ];

  const comoFunciona = [
    {
      numero: "01",
      titulo: "Cadastre-se",
      descricao: "Complete seu perfil médico com CRM, especialidades e informações profissionais."
    },
    {
      numero: "02",
      titulo: "Configure sua Agenda",
      descricao: "Defina seus horários disponíveis, duração das consultas e locais de atendimento."
    },
    {
      numero: "03",
      titulo: "Receba Agendamentos",
      descricao: "Pacientes encontram você e agendam consultas automaticamente nos seus horários livres."
    },
    {
      numero: "04",
      titulo: "Atenda e Fature",
      descricao: "Receba lembretes, atenda seus pacientes e acompanhe sua receita em tempo real."
    }
  ];

  const recursos = [
    {
      icon: Smartphone,
      titulo: "App Mobile",
      descricao: "Gerencie sua agenda pelo celular, receba notificações e confirme consultas."
    },
    {
      icon: MessageSquare,
      titulo: "Comunicação",
      descricao: "Chat integrado com pacientes para esclarecimentos e orientações pré-consulta."
    },
    {
      icon: CreditCard,
      titulo: "Pagamentos",
      descricao: "Receba pagamentos online com segurança e acompanhe sua receita mensal."
    },
    {
      icon: Star,
      titulo: "Avaliações",
      descricao: "Construa sua reputação online com avaliações verificadas de pacientes reais."
    }
  ];

  const planos = [
    {
      nome: "Básico",
      preco: "Gratuito",
      descricao: "Para médicos iniciantes",
      recursos: [
        "Até 50 agendamentos/mês",
        "Perfil básico",
        "Agenda online",
        "Suporte por email"
      ],
      destaque: false
    },
    {
      nome: "Profissional",
      preco: "R$ 89/mês",
      descricao: "Mais popular entre médicos",
      recursos: [
        "Agendamentos ilimitados",
        "Perfil completo com fotos",
        "Relatórios detalhados",
        "Chat com pacientes",
        "Suporte prioritário",
        "Integração com calendário"
      ],
      destaque: true
    },
    {
      nome: "Clínica",
      preco: "R$ 149/mês",
      descricao: "Para clínicas e consultórios",
      recursos: [
        "Múltiplos médicos",
        "Gestão de equipe",
        "Relatórios avançados",
        "API personalizada",
        "Suporte 24/7",
        "Treinamento incluído"
      ],
      destaque: false
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-green-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">
              AgendarBrasil
            </h1>
          </Link>
          <nav className="hidden md:flex space-x-6">
            <Link to="/para-pacientes" className="text-gray-600 hover:text-blue-600 transition-colors">Para Pacientes</Link>
            <Link to="/para-medicos" className="text-blue-600 font-semibold">Para Médicos</Link>
            <Link to="/como-funciona" className="text-gray-600 hover:text-blue-600 transition-colors">Como Funciona</Link>
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

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Para <span className="bg-gradient-to-r from-blue-600 to-green-500 bg-clip-text text-transparent">Médicos</span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Transforme sua prática médica com nossa plataforma. Mais pacientes, agenda organizada e gestão simplificada.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cadastro">
              <Button size="lg" className="bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600">
                Começar Gratuitamente
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline">
              Agendar Demonstração
            </Button>
          </div>
        </div>
      </section>

      {/* Benefícios */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Por que escolher o AgendarBrasil?</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {beneficios.map((beneficio, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <beneficio.icon className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-xl">{beneficio.titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{beneficio.descricao}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Como Funciona */}
      <section className="bg-white py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Como Funciona</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {comoFunciona.map((passo, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-xl">{passo.numero}</span>
                </div>
                <h4 className="text-xl font-semibold mb-2">{passo.titulo}</h4>
                <p className="text-gray-600">{passo.descricao}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Recursos */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Recursos Exclusivos</h3>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {recursos.map((recurso, index) => (
            <Card key={index} className="text-center hover:shadow-lg transition-shadow duration-300 border-0 shadow-md">
              <CardHeader>
                <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <recurso.icon className="w-8 h-8 text-blue-600" />
                </div>
                <CardTitle className="text-lg">{recurso.titulo}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm">{recurso.descricao}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Planos e Preços */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-center mb-12">Planos e Preços</h3>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {planos.map((plano, index) => (
              <Card key={index} className={`relative ${plano.destaque ? 'border-2 border-blue-500 shadow-xl' : 'border-0 shadow-md'}`}>
                {plano.destaque && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-500 text-white px-4 py-1">Mais Popular</Badge>
                  </div>
                )}
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plano.nome}</CardTitle>
                  <div className="text-3xl font-bold text-blue-600 mt-2">{plano.preco}</div>
                  <p className="text-gray-600">{plano.descricao}</p>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-2">
                    {plano.recursos.map((recurso, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{recurso}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    className={`w-full ${plano.destaque 
                      ? 'bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600' 
                      : 'bg-gray-600 hover:bg-gray-700'
                    }`}
                  >
                    Escolher Plano
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container mx-auto px-4 py-16">
        <h3 className="text-3xl font-bold text-center mb-12">Perguntas Frequentes</h3>
        <div className="max-w-3xl mx-auto space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Preciso pagar para usar a plataforma?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Oferecemos um plano gratuito com funcionalidades básicas. Para recursos avançados, temos planos pagos a partir de R$ 89/mês.
              </p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Como funciona o processo de verificação?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Verificamos seu CRM junto ao Conselho Federal de Medicina para garantir a autenticidade do seu registro profissional.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-500" />
                Posso cancelar meu plano a qualquer momento?
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Sim, você pode cancelar seu plano a qualquer momento sem multas ou taxas de cancelamento.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-gradient-to-r from-blue-600 to-green-500 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl font-bold mb-6">Pronto para transformar sua prática médica?</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de médicos que já descobriram uma forma mais inteligente de gerenciar consultas.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/cadastro">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Começar Gratuitamente
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
              Falar com Consultor
            </Button>
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
                <li><Link to="/para-pacientes" className="hover:text-white transition-colors">Como Funciona</Link></li>
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

export default ParaMedicos;
