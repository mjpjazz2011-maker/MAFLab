import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Card } from '../../components/ui/Card';
import { BarChart3, Users, BookOpen, TrendingUp, Target } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const DocenteDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    totalEstudantes: 0,
    totalSessoes: 0,
    totalNotas: 0,
    mediaPontos: 0
  });

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    const [estudantesRes, sessoesRes, notasRes] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact' }).eq('tipo_utilizador', 'estudante'),
      supabase.from('sessoes').select('*', { count: 'exact' }),
      supabase.from('notas').select('*', { count: 'exact' })
    ]);

    setStats({
      totalEstudantes: estudantesRes.count || 0,
      totalSessoes: sessoesRes.count || 0,
      totalNotas: notasRes.count || 0,
      mediaPontos: 0
    });
  };

  const sidebarItems = [
    { path: '/docente', label: 'Dashboard', icon: <Target className="w-5 h-5" /> },
    { path: '/docente/analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> }
  ];

  return (
    <div className="flex min-h-screen bg-[#F7FAFF]">
      <Sidebar items={sidebarItems} />
      
      <div className="ml-64 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-[#1E293B] mb-2">Dashboard Docente</h1>
          <p className="text-[#64748B] mb-8">Dados agregados e padrões de aprendizagem</p>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#64748B]">Total Estudantes</span>
                <Users className="w-5 h-5 text-[#3366FF]" />
              </div>
              <p className="text-3xl font-bold text-[#1E293B]">{stats.totalEstudantes}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#64748B]">Sessões Críticas</span>
                <BookOpen className="w-5 h-5 text-[#3366FF]" />
              </div>
              <p className="text-3xl font-bold text-[#1E293B]">{stats.totalSessoes}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#64748B]">Notas Criadas</span>
                <BookOpen className="w-5 h-5 text-[#3366FF]" />
              </div>
              <p className="text-3xl font-bold text-[#1E293B]">{stats.totalNotas}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#64748B]">Engajamento</span>
                <TrendingUp className="w-5 h-5 text-[#16A34A]" />
              </div>
              <p className="text-3xl font-bold text-[#1E293B]">Alto</p>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-[#1E293B] mb-4">Atividade por Ciclo</h2>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#64748B]">Licenciatura</span>
                    <span className="text-[#1E293B] font-medium">45%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#3366FF]" style={{ width: '45%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#64748B]">Mestrado</span>
                    <span className="text-[#1E293B] font-medium">35%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#3366FF]" style={{ width: '35%' }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="text-[#64748B]">Doutoramento</span>
                    <span className="text-[#1E293B] font-medium">20%</span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div className="h-full bg-[#3366FF]" style={{ width: '20%' }} />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-[#1E293B] mb-4">Padrões de Escrita</h2>
              <div className="space-y-3">
                <div className="p-3 bg-[#F7FAFF] rounded-xl">
                  <p className="text-sm font-medium text-[#1E293B]">Média de tempo por sessão</p>
                  <p className="text-2xl font-bold text-[#3366FF] mt-1">45 min</p>
                </div>
                <div className="p-3 bg-[#F7FAFF] rounded-xl">
                  <p className="text-sm font-medium text-[#1E293B]">Sessões por semana</p>
                  <p className="text-2xl font-bold text-[#3366FF] mt-1">3.2</p>
                </div>
                <div className="p-3 bg-[#F7FAFF] rounded-xl">
                  <p className="text-sm font-medium text-[#1E293B]">Taxa de conclusão</p>
                  <p className="text-2xl font-bold text-[#16A34A] mt-1">87%</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
