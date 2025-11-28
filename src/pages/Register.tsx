import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/Input';
import { Card } from '../components/ui/Card';
import { register } from '../lib/auth';

export const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    password: '',
    tipo: 'estudante' as 'estudante' | 'orientador' | 'docente' | 'admin',
    ciclo: '',
    area_especialidade: ''
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      // Validate required fields based on user type
      if (formData.tipo === 'estudante' && !formData.ciclo) {
        setError('Por favor, seleciona o ciclo de estudos');
        setLoading(false);
        return;
      }

      // Prepare metadata object
      const metadata = {
        nome: formData.nome,
        tipo: formData.tipo,
        ciclo: formData.ciclo || null,
        area_especialidade: formData.area_especialidade || null
      };


      const user = await register(formData.email, formData.password, metadata);
      
      if (user) {
        navigate('/login');
      } else {
        setError('Erro ao criar conta. Por favor, tenta novamente.');
      }
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Erro ao criar conta. Verifica se o email já está registado.');
    } finally {
      setLoading(false);
    }

  };


  return (
    <div className="min-h-screen bg-[#F7FAFF] flex items-center justify-center px-6 py-12">
      <Card className="w-full max-w-md p-8">
        <h1 className="text-3xl font-bold text-[#1E293B] mb-2 text-center">Criar Conta</h1>
        <p className="text-[#64748B] text-center mb-8">Junta-te ao MAF.Lab</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Nome"
            placeholder="O teu nome"
            value={formData.nome}
            onChange={(e) => setFormData({...formData, nome: e.target.value})}
            required
          />
          
          <Input
            type="email"
            label="Email"
            placeholder="seu@email.com"
            value={formData.email}
            onChange={(e) => setFormData({...formData, email: e.target.value})}
            required
          />
          
          <Input
            type="password"
            label="Password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({...formData, password: e.target.value})}
            required
          />

          <div>
            <label className="block text-sm font-medium text-[#1E293B] mb-2">Tipo de Utilizador</label>
            <select
              className="w-full px-4 py-3 bg-[#F6F8FA] rounded-xl text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#3366FF]"
              value={formData.tipo}
              onChange={(e) => setFormData({...formData, tipo: e.target.value as any})}
            >
              <option value="estudante">Estudante</option>
              <option value="orientador">Orientador</option>
              <option value="docente">Docente</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          {formData.tipo === 'estudante' && (
            <div>
              <label className="block text-sm font-medium text-[#1E293B] mb-2">Ciclo</label>
              <select
                className="w-full px-4 py-3 bg-[#F6F8FA] rounded-xl text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#3366FF]"
                value={formData.ciclo}
                onChange={(e) => setFormData({...formData, ciclo: e.target.value})}
              >
                <option value="">Selecionar</option>
                <option value="Undergraduate">Undergraduate</option>
                <option value="Master's">Master's</option>
                <option value="PhD">PhD</option>
              </select>
            </div>
          )}

          {(formData.tipo === 'orientador' || formData.tipo === 'docente') && (
            <Input
              label="Área de Especialidade"
              placeholder="Ex: Estudos Culturais"
              value={formData.area_especialidade}
              onChange={(e) => setFormData({...formData, area_especialidade: e.target.value})}
            />
          )}



          {error && (
            <div className="bg-red-50 border border-[#DC2626] text-[#DC2626] px-4 py-3 rounded-xl text-sm">
              {error}
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'A criar conta...' : 'Criar Conta'}
          </Button>
        </form>

        <p className="mt-6 text-center text-sm text-[#64748B]">
          Já tens conta?{' '}
          <Link to="/login" className="text-[#3366FF] hover:underline font-medium">
            Entrar
          </Link>
        </p>
      </Card>
    </div>
  );
};
