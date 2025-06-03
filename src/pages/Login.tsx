
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { Link } from "react-router-dom";

const loginSchema = z.object({
  email: z.string().email("E-mail inválido"),
  senha: z.string().min(1, "Senha é obrigatória"),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => {
    console.log('Dados do login:', data);
    // Aqui você implementaria a lógica de autenticação
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

              <div className="flex items-center justify-between">
                <Link 
                  to="/esqueci-senha" 
                  className="text-sm text-blue-600 hover:text-blue-700 transition-colors"
                >
                  Esqueci minha senha
                </Link>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 text-lg bg-gradient-to-r from-blue-600 to-green-500 hover:from-blue-700 hover:to-green-600"
              >
                Entrar
              </Button>
            </form>

            <div className="text-center">
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
