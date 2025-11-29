import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/button';
import { Users, FileText, BarChart3, Settings, Target, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState({
    estudantes: 0,
    orientadores: 0,
    docentes: 0,
    sessoes: 0
  });

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    const [estudantesRes, orientadoresRes, docentesRes, sessoesRes] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact' }).eq('tipo_utilizador', 'estudante'),
      supabase.from('users').select('*', { count: 'exact' }).eq('tipo_utilizador', 'orientador'),
      supabase.from('users').select('*', { count: 'exact' }).eq('tipo_utilizador', 'docente'),
      supabase.from('sessoes').select('*', { count: 'exact' })
    ]);

    setStats({
      estudantes: estudantesRes.count || 0,
      orientadores: orientadoresRes.count || 0,
      docentes: docentesRes.count || 0,
      sessoes: sessoesRes.count || 0
    });
  };

  const gerarRelatorio = async () => {
    const relatorio = {
      data_geracao: new Date().toISOString(),
      estatisticas: stats,
      periodo: 'Últimas 2 semanas'
    };

    await supabase.from('admin_relatorios').insert({
      titulo: 'Relatório Quinzenal',
      periodo_inicio: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      periodo_fim: new Date().toISOString().split('T')[0],
      conteudo: relatorio,
      gerado_por: localStorage.getItem('maflab_user_id')
    });

    alert('Relatório gerado com sucesso!');
  };

  const sidebarItems = [
    { path: '/admin', label: 'Dashboard', icon: <Target className="w-5 h-5" /> },
    { path: '/admin/utilizadores', label: 'Utilizadores', icon: <Users className="w-5 h-5" /> },
    { path: '/admin/relatorios', label: 'Relatórios', icon: <FileText className="w-5 h-5" /> },
    { path: '/admin/analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { path: '/admin/configuracao', label: 'Configuração', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <div className="flex min-h-screen bg-[#F7FAFF]">
      <Sidebar items={sidebarItems} />
      
      <div className="ml-64 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold text-[#1E293B]">Admin Dashboard</h1>
              <p className="text-[#64748B]">Gestão do sistema MAF.Lab</p>
            </div>
            <Button onClick={gerarRelatorio}>
              <Download className="w-5 h-5 mr-2" />
              Gerar Relatório Quinzenal
            </Button>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#64748B]">Estudantes</span>
                <Users className="w-5 h-5 text-[#3366FF]" />
              </div>
              <p className="text-3xl font-bold text-[#1E293B]">{stats.estudantes}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#64748B]">Orientadores</span>
                <Users className="w-5 h-5 text-[#3366FF]" />
              </div>
              <p className="text-3xl font-bold text-[#1E293B]">{stats.orientadores}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#64748B]">Docentes</span>
                <Users className="w-5 h-5 text-[#3366FF]" />
              </div>
              <p className="text-3xl font-bold text-[#1E293B]">{stats.docentes}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#64748B]">Total Sessões</span>
                <FileText className="w-5 h-5 text-[#3366FF]" />
              </div>
              <p className="text-3xl font-bold text-[#1E293B]">{stats.sessoes}</p>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card className="p-6">
              <h2 className="text-xl font-bold text-[#1E293B] mb-4">Atividade Recente</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#F7FAFF] rounded-xl">
                  <span className="text-sm text-[#1E293B]">Novos utilizadores hoje</span>
                  <span className="text-sm font-bold text-[#3366FF]">0</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#F7FAFF] rounded-xl">
                  <span className="text-sm text-[#1E293B]">Sessões criadas hoje</span>
                  <span className="text-sm font-bold text-[#3366FF]">0</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#F7FAFF] rounded-xl">
                  <span className="text-sm text-[#1E293B]">Uploads hoje</span>
                  <span className="text-sm font-bold text-[#3366FF]">0</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h2 className="text-xl font-bold text-[#1E293B] mb-4">Sistema</h2>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl border border-green-200">
                  <span className="text-sm text-[#1E293B]">Status do Sistema</span>
                  <span className="text-sm font-bold text-[#16A34A]">Operacional</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#F7FAFF] rounded-xl">
                  <span className="text-sm text-[#1E293B]">Última atualização</span>
                  <span className="text-sm text-[#64748B]">Hoje</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#F7FAFF] rounded-xl">
                  <span className="text-sm text-[#1E293B]">Versão</span>
                  <span className="text-sm text-[#64748B]">1.0.0</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
