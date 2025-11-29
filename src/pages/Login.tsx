import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { login } from '../lib/auth';

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await login(email, password);
      if (user) {
        const routes: Record<string, string> = {
          estudante: '/estudante',
          orientador: '/orientador',
          docente: '/docente',
          admin: '/admin'
        };
        const route = routes[user.user_metadata?.tipo || 'estudante'] || '/estudante';

        navigate(route);
      } else {
        setError('Email ou password incorretos');
      }
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Erro ao fazer login');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#F7FAFF] flex items-center justify-center px-6">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-[#1E293B] mb-2 text-center">Bem-vindo ao MAF.Lab</h1>
        <p className="text-[#64748B] text-center mb-8">Inicia sessão para continuar</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            type="email"
            label="Email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && (
            <div className="bg-red-50 border border-[#DC2626] text-[#DC2626] px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'A entrar...' : 'Entrar'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[#64748B]">
          Não tens conta?{' '}
          <Link to="/register" className="text-[#3366FF] hover:underline font-medium">
            Criar conta
          </Link>
        </p>
      </Card>
    </div>
  );
};
