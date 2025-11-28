import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/button';
import { useNavigate, Link } from 'react-router-dom';
import { BookOpen, FileText, Brain, Upload, Trophy, BarChart3, Settings, Target, Sparkles } from 'lucide-react';

import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/auth';

export const EstudanteDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({ sessoes: 0, notas: 0, pontos: 0, nivel: 1 });
  const [sessoesIA, setSessoesIA] = useState<any[]>([]);
  const [userName, setUserName] = useState('');


  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const user = await getCurrentUser();
    if (!user) return;
    setUserName(user.user_metadata?.nome || 'Estudante');


    const [sessoesRes, notasRes, pontosRes, sessoesIARes] = await Promise.all([
      supabase.from('sessoes').select('*', { count: 'exact' }).eq('user_id', user.id),
      supabase.from('notas').select('*', { count: 'exact' }).eq('user_id', user.id).then(r => r.error ? { count: 0, data: [] } : r),
      supabase.from('gamificacao_pontos').select('*').eq('user_id', user.id).single().then(r => r.error ? { data: null } : r),
      supabase.from('sessoes').select('*').eq('user_id', user.id).eq('tipo_sessao', 'ia').order('created_at', { ascending: false }).limit(3)
    ]);


    setStats({
      sessoes: sessoesRes.count || 0,
      notas: notasRes.count || 0,
      pontos: pontosRes.data?.pontos_totais || 0,
      nivel: pontosRes.data?.nivel || 1
    });

    setSessoesIA(sessoesIARes.data || []);
  };



  const sidebarItems = [
    { path: '/estudante', label: 'Dashboard', icon: <Target className="w-5 h-5" /> },
    { path: '/escrita-ia', label: 'Escrita com IA', icon: <Sparkles className="w-5 h-5" /> },
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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-[#1E293B] mb-2">Olá, {userName}!</h1>
          <p className="text-[#64748B] mb-8">Bem-vindo ao teu laboratório de escrita crítica.</p>

          {/* CARTÃO MOMENTO DE ESCRITA COM IA - DESTAQUE */}
          <Card className="p-10 mb-10 bg-gradient-to-br from-[#3366FF] via-[#4F7CFF] to-[#6366F1] text-white shadow-2xl border-0">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center mb-3">
                  <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mr-4">
                    <Sparkles className="w-7 h-7 text-white" />
                  </div>
                  <h2 className="text-3xl font-bold">Momento de Escrita com IA</h2>
                </div>
                <p className="text-lg opacity-95 mb-6 max-w-2xl">
                  Pensa devagar, escreve com apoio da IA e reflete sobre o texto. Recebe feedback crítico personalizado.
                </p>
                <Link 
                  to="/escrita-ia"
                  className="inline-block bg-blue-600 text-white font-semibold px-6 py-4 rounded-xl shadow-lg hover:bg-blue-700 transition-all"
                >
                  Iniciar sessão de escrita
                </Link>
              </div>
            </div>
          </Card>



          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#64748B]">Sessões</span>
                <BookOpen className="w-5 h-5 text-[#3366FF]" />
              </div>
              <p className="text-3xl font-bold text-[#1E293B]">{stats.sessoes}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#64748B]">Notas</span>
                <FileText className="w-5 h-5 text-[#3366FF]" />
              </div>
              <p className="text-3xl font-bold text-[#1E293B]">{stats.notas}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#64748B]">Pontos</span>
                <Trophy className="w-5 h-5 text-[#3366FF]" />
              </div>
              <p className="text-3xl font-bold text-[#1E293B]">{stats.pontos}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#64748B]">Nível</span>
                <Target className="w-5 h-5 text-[#3366FF]" />
              </div>
              <p className="text-3xl font-bold text-[#1E293B]">{stats.nivel}</p>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-[#1E293B] mb-4">Ações Rápidas</h2>
              <div className="space-y-3">
                <Button className="w-full justify-start" onClick={() => navigate('/sessao-critica')}>
                  <BookOpen className="w-5 h-5 mr-2" />
                  Nova Sessão Crítica
                </Button>
                <Button variant="secondary" className="w-full justify-start" onClick={() => navigate('/notas')}>
                  <FileText className="w-5 h-5 mr-2" />
                  Criar Nota
                </Button>
                <Button variant="secondary" className="w-full justify-start" onClick={() => navigate('/uploads')}>
                  <Upload className="w-5 h-5 mr-2" />
                  Upload de Ficheiro
                </Button>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-[#1E293B] mb-4 flex items-center justify-between">
                Sessões com IA
                <Sparkles className="w-5 h-5 text-[#3366FF]" />
              </h2>
              {sessoesIA.length > 0 ? (
                <div className="space-y-3">
                  {sessoesIA.map((s, i) => (
                    <div key={i} className="p-3 bg-[#F7FAFF] rounded-xl">
                      <p className="text-sm font-medium text-[#1E293B]">{s.titulo}</p>
                      <p className="text-xs text-[#64748B] mt-1">{new Date(s.created_at).toLocaleDateString()}</p>
                    </div>
                  ))}
                  <Button variant="secondary" className="w-full" onClick={() => navigate('/sessao-critica')}>Ver todas</Button>
                </div>
              ) : (
                <p className="text-sm text-[#64748B]">Ainda não tens sessões com IA. Inicia a tua primeira sessão acima!</p>
              )}
            </Card>
          </div>

        </div>
      </div>
    </div>
  );
};
