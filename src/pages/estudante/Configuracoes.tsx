import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/Input';
import { BookOpen, FileText, Brain, Upload, Trophy, BarChart3, Settings, Target } from 'lucide-react';
import { getCurrentUser } from '../../lib/auth';
import { supabase } from '../../lib/supabase';

export const Configuracoes: React.FC = () => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [ciclo, setCiclo] = useState('');
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    const user = await getCurrentUser();
    if (user) {
      setNome(user.nome);
      setEmail(user.email);
      setCiclo(user.ciclo || '');
    }
  };

  const handleSave = async () => {
    const userId = localStorage.getItem('maflab_user_id');
    if (!userId) return;

    await supabase
      .from('users')
      .update({ nome, email, ciclo })
      .eq('id', userId);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const sidebarItems = [
    { path: '/estudante', label: 'Dashboard', icon: <Target className="w-5 h-5" /> },
    { path: '/sessao-critica', label: 'Sessão Crítica', icon: <BookOpen className="w-5 h-5" /> },
    { path: '/notas', label: 'Notas', icon: <FileText className="w-5 h-5" /> },
    { path: '/mapa-cognitivo', label: 'Mapa Cognitivo', icon: <Brain className="w-5 h-5" /> },
    { path: '/uploads', label: 'Uploads', icon: <Upload className="w-5 h-5" /> },
    { path: '/gamificacao', label: 'Gamificação', icon: <Trophy className="w-5 h-5" /> },
    { path: '/relatorios', label: 'Relatórios', icon: <BarChart3 className="w-5 h-5" /> },
    { path: '/configuracoes', label: 'Configurações', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <div className="flex min-h-screen bg-[#F7FAFF]">
      <Sidebar items={sidebarItems} />
      
      <div className="ml-64 flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-3xl font-bold text-[#1E293B] mb-8">Configurações</h1>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-[#1E293B] mb-6">Perfil</h2>
            <div className="space-y-4">
              <Input
                label="Nome"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
              />
              
              <Input
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <div>
                <label className="block text-sm font-medium text-[#1E293B] mb-2">Ciclo</label>
                <select
                  className="w-full px-4 py-3 bg-[#F6F8FA] rounded-xl text-[#1E293B] focus:outline-none focus:ring-2 focus:ring-[#3366FF]"
                  value={ciclo}
                  onChange={(e) => setCiclo(e.target.value)}
                >
                  <option value="">Selecionar</option>
                  <option value="licenciatura">Licenciatura</option>
                  <option value="mestrado">Mestrado</option>
                  <option value="doutoramento">Doutoramento</option>
                </select>
              </div>

              <Button onClick={handleSave} className="w-full">
                {saved ? 'Guardado!' : 'Guardar Alterações'}
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
