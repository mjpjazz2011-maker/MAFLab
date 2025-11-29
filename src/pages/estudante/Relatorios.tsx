import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Card } from '../../components/ui/Card';
import { BookOpen, FileText, Brain, Upload, Trophy, BarChart3, Settings, Target, TrendingUp } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/auth';

export const Relatorios: React.FC = () => {
  const [stats, setStats] = useState({
    sessoesEstaSemana: 0,
    notasEstaSemana: 0,
    totalSessoes: 0,
    totalNotas: 0,
    tempoTotal: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    const umaSemanaAtras = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

    const [sessoesTotal, sessoesRecentes, notasTotal, notasRecentes] = await Promise.all([
      supabase.from('sessoes').select('*', { count: 'exact' }).eq('user_id', user.id),
      supabase.from('sessoes').select('*', { count: 'exact' }).eq('user_id', user.id).gte('created_at', umaSemanaAtras),
      supabase.from('notas').select('*', { count: 'exact' }).eq('user_id', user.id),
      supabase.from('notas').select('*', { count: 'exact' }).eq('user_id', user.id).gte('created_at', umaSemanaAtras)
    ]);

    setStats({
      sessoesEstaSemana: sessoesRecentes.count || 0,
      notasEstaSemana: notasRecentes.count || 0,
      totalSessoes: sessoesTotal.count || 0,
      totalNotas: notasTotal.count || 0,
      tempoTotal: 0
    });
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
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[#1E293B] mb-8">Relatórios</h1>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-[#1E293B] mb-6">Esta Semana</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#F7FAFF] rounded-xl">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-[#3366FF]" />
                    <span className="text-[#1E293B]">Sessões Críticas</span>
                  </div>
                  <span className="text-2xl font-bold text-[#1E293B]">{stats.sessoesEstaSemana}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#F7FAFF] rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#3366FF]" />
                    <span className="text-[#1E293B]">Notas Criadas</span>
                  </div>
                  <span className="text-2xl font-bold text-[#1E293B]">{stats.notasEstaSemana}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-[#1E293B] mb-6">Total Acumulado</h2>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#F7FAFF] rounded-xl">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-[#3366FF]" />
                    <span className="text-[#1E293B]">Total Sessões</span>
                  </div>
                  <span className="text-2xl font-bold text-[#1E293B]">{stats.totalSessoes}</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-[#F7FAFF] rounded-xl">
                  <div className="flex items-center gap-3">
                    <FileText className="w-5 h-5 text-[#3366FF]" />
                    <span className="text-[#1E293B]">Total Notas</span>
                  </div>
                  <span className="text-2xl font-bold text-[#1E293B]">{stats.totalNotas}</span>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-xl font-bold text-[#1E293B] mb-4">Progresso Semanal</h2>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-[#64748B]">Atividade</span>
                  <span className="text-[#1E293B] font-medium">
                    {stats.sessoesEstaSemana + stats.notasEstaSemana} ações esta semana
                  </span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#3366FF] to-[#16A34A]"
                    style={{ width: `${Math.min(((stats.sessoesEstaSemana + stats.notasEstaSemana) / 10) * 100, 100)}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
