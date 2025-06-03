
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, Stethoscope, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import type { CadastroFormData } from "@/types/user";

const cadastroSchema = z.object({
  tipo: z.enum(['paciente', 'medico']),
  nomeCompleto: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(6, "Senha deve ter pelo menos 6 caracteres"),
  confirmarSenha: z.string(),
  telefone: z.string().min(10, "Telefone inválido"),
  dataNascimento: z.date().optional(),
  genero: z.enum(['masculino', 'feminino', 'outro', 'prefiro-nao-informar']).optional(),
  historicoMedico: z.string().optional(),
  planoSaude: z.string().optional(),
  crm: z.string().optional(),
  especialidade: z.string().optional(),
  anosExperiencia: z.number().optional(),
  biografia: z.string().optional(),
}).refine((data) => data.senha === data.confirmarSenha, {
  message: "Senhas não coincidem",
  path: ["confirmarSenha"],
});

const Cadastro = () => {
  const [tipoUsuario, setTipoUsuario] = useState<'paciente' | 'medico'>('paciente');
  
  const { register, handleSubmit, formState: { errors }, setValue, watch } = useForm<CadastroFormData>({
    resolver: zodResolver(cadastroSchema),
    defaultValues: {
      tipo: 'paciente'
    }
  });

  const onSubmit = (data: CadastroFormData) => {
    console.log('Dados do cadastro:', data);
    // Aqui você implementaria a lógica de cadastro
  };

  const handleTipoChange = (tipo: 'paciente' | 'medico') => {
    setTipoUsuario(tipo);
    setValue('tipo', tipo);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 py-12 px-4">
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
              Criar Conta
            </CardTitle>
            <p className="text-gray-600">Escolha o tipo de conta e preencha seus dados</p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Seleção do tipo de usuário */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Tipo de conta</Label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => handleTipoChange('paciente')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    tipoUsuario === 'paciente'
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                >
                  <User className={`w-8 h-8 mx-auto mb-2 ${
                    tipoUsuario === 'paciente' ? 'text-blue-500' : 'text-gray-400'
                  }`} />
                  <p className="font-medium">Paciente</p>
                  <p className="text-sm text-gray-500">Agendar consultas</p>
                </button>

                <button
                  type="button"
                  onClick={() => handleTipoChange('medico')}
                  className={`p-4 border-2 rounded-lg transition-all ${
                    tipoUsuario === 'medico'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <Stethoscope className={`w-8 h-8 mx-auto mb-2 ${
                    tipoUsuario === 'medico' ? 'text-green-500' : 'text-gray-400'
                  }`} />
                  <p className="font-medium">Médico</p>
                  <p className="text-sm text-gray-500">Gerenciar agenda</p>
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Campos comuns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nomeCompleto">Nome completo</Label>
                  <Input
                    id="nomeCompleto"
                    {...register('nomeCompleto')}
                    className="mt-1"
                  />
                  {errors.nomeCompleto && (
                    <p className="text-sm text-red-500 mt-1">{errors.nomeCompleto.message}</p>
                  )}
                </div>

                <div>
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    {...register('telefone')}
                    placeholder="(11) 99999-9999"
                    className="mt-1"
                  />
                  {errors.telefone && (
                    <p className="text-sm text-red-500 mt-1">{errors.telefone.message}</p>
                  )}
                </div>
              </div>

              <div>
                <Label htmlFor="email">E-mail</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="mt-1"
                />
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
                    {...register('senha')}
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
                    {...register('confirmarSenha')}
                    className="mt-1"
                  />
                  {errors.confirmarSenha && (
                    <p className="text-sm text-red-500 mt-1">{errors.confirmarSenha.message}</p>
                  )}
                </div>
              </div>

              {/* Campos específicos do paciente */}
              {tipoUsuario === 'paciente' && (
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-semibold text-blue-600">Informações do Paciente</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="dataNascimento">Data de nascimento</Label>
                      <Input
                        id="dataNascimento"
                        type="date"
                        {...register('dataNascimento', { valueAsDate: true })}
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label>Gênero</Label>
                      <Select onValueChange={(value) => setValue('genero', value as any)}>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Selecione" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="masculino">Masculino</SelectItem>
                          <SelectItem value="feminino">Feminino</SelectItem>
                          <SelectItem value="outro">Outro</SelectItem>
                          <SelectItem value="prefiro-nao-informar">Prefiro não informar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="planoSaude">Plano de saúde (opcional)</Label>
                    <Input
                      id="planoSaude"
                      {...register('planoSaude')}
                      placeholder="Ex: Unimed, Bradesco Saúde"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="historicoMedico">Histórico médico (opcional)</Label>
                    <Textarea
                      id="historicoMedico"
                      {...register('historicoMedico')}
                      placeholder="Descreva condições médicas relevantes, alergias, medicamentos em uso..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>
                </div>
              )}

              {/* Campos específicos do médico */}
              {tipoUsuario === 'medico' && (
                <div className="space-y-4 border-t pt-6">
                  <h3 className="text-lg font-semibold text-green-600">Informações Profissionais</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="crm">CRM</Label>
                      <Input
                        id="crm"
                        {...register('crm')}
                        placeholder="Ex: CRM/SP 123456"
                        className="mt-1"
                      />
                    </div>

                    <div>
                      <Label htmlFor="especialidade">Especialidade</Label>
                      <Input
                        id="especialidade"
                        {...register('especialidade')}
                        placeholder="Ex: Cardiologia"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="anosExperiencia">Anos de experiência</Label>
                    <Input
                      id="anosExperiencia"
                      type="number"
                      {...register('anosExperiencia', { valueAsNumber: true })}
                      className="mt-1"
                      min="0"
                      max="60"
                    />
                  </div>

                  <div>
                    <Label htmlFor="biografia">Biografia (opcional)</Label>
                    <Textarea
                      id="biografia"
                      {...register('biografia')}
                      placeholder="Descreva sua formação, especializações, experiência..."
                      className="mt-1"
                      rows={4}
                    />
                  </div>
                </div>
              )}

              <Button 
                type="submit" 
                className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600"
              >
                Criar Conta
              </Button>
            </form>

            <div className="text-center">
              <p className="text-gray-600">
                Já tem uma conta?{' '}
                <Link to="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                  Faça login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Cadastro;
