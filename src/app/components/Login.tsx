import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router';
import { toast } from 'sonner';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export function Login() {
  const navigate = useNavigate();
  const { signIn, signUp } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!email || !password) {
        toast.error('Por favor, preencha todos os campos');
        setIsLoading(false);
        return;
      }

      if (isSignUp) {
        await signUp(email, password);
        toast.success('Cadastro realizado! Verifique seu email para confirmar a conta.');
        setEmail('');
        setPassword('');
        setIsSignUp(false);
      } else {
        await signIn(email, password);
        toast.success('Login realizado com sucesso!');
        navigate('/');
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Erro ao autenticar';
      if (errorMessage.includes('Invalid login credentials')) {
        toast.error('Email ou senha incorretos');
      } else if (errorMessage.includes('Email not confirmed')) {
        toast.error('Email ainda não foi confirmado. Verifique sua caixa de entrada.');
      } else {
        toast.error(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card backdrop-blur-xl rounded-3xl p-8 shadow-xl shadow-primary/5 border border-border/50">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-card-foreground mb-2">Finanças App</h1>
            <p className="text-muted-foreground">
              {isSignUp ? 'Crie sua conta' : 'Faça login na sua conta'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Input */}
            <div className="relative">
              <Mail className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
              <input
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-secondary/10 border border-border/50 rounded-xl text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                disabled={isLoading}
              />
            </div>

            {/* Password Input */}
            <div className="relative">
              <Lock className="absolute left-3 top-3.5 text-muted-foreground" size={18} />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Sua senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 bg-secondary/10 border border-border/50 rounded-xl text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-muted-foreground hover:text-card-foreground transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2.5 bg-primary text-primary-foreground rounded-xl font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-primary/30"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  Aguarde...
                </span>
              ) : isSignUp ? (
                'Criar Conta'
              ) : (
                'Entrar'
              )}
            </button>
          </form>

          {/* Toggle Form */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground text-sm">
              {isSignUp ? 'Já tem uma conta?' : 'Não tem uma conta?'}{' '}
              <button
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setEmail('');
                  setPassword('');
                }}
                className="text-primary font-medium hover:underline transition-colors"
              >
                {isSignUp ? 'Faça login' : 'Cadastre-se'}
              </button>
            </p>
          </div>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 h-px bg-border/30" />
            <span className="text-xs text-muted-foreground">OU</span>
            <div className="flex-1 h-px bg-border/30" />
          </div>

          {/* Info Box */}
          <div className="bg-primary/5 border border-primary/10 rounded-xl p-4">
            <p className="text-xs text-muted-foreground">
              {isSignUp
                ? 'Ao se cadastrar, você concorda com nossos Termos de Serviço e Política de Privacidade.'
                : 'Use uma conta de email válida. Você receberá um email de confirmação.'}
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
          <p className="text-xs text-muted-foreground">
            © 2024 Finanças App. Todos os direitos reservados.
          </p>
        </div>
      </div>
    </div>
  );
}
