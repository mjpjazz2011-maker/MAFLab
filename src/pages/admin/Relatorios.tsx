import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/button';
import { Users, FileText, BarChart3, Settings, Target, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const AdminRelatorios: React.FC = () => {
  const [relatorios, setRelatorios] = useState<any[]>([]);

  useEffect(() => {
    loadRelatorios();
  }, []);

  const loadRelatorios = async () => {
    const { data } = await supabase
      .from('admin_relatorios')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) setRelatorios(data);
  };

  const gerarRelatorio = async () => {
    const hoje = new Date();
    const duasSemanasAtras = new Date(hoje.getTime() - 14 * 24 * 60 * 60 * 1000);

    const [estudantes, sessoes, notas, uploads] = await Promise.all([
      supabase.from('users').select('*', { count: 'exact' }).eq('tipo_utilizador', 'estudante'),
      supabase.from('sessoes').select('*', { count: 'exact' }).gte('created_at', duasSemanasAtras.toISOString()),
      supabase.from('notas').select('*', { count: 'exact' }).gte('created_at', duasSemanasAtras.toISOString()),
      supabase.from('uploads').select('*', { count: 'exact' }).gte('created_at', duasSemanasAtras.toISOString())
    ]);

    const conteudo = {
      periodo: `${duasSemanasAtras.toLocaleDateString('pt-PT')} - ${hoje.toLocaleDateString('pt-PT')}`,
      estatisticas: {
        total_estudantes: estudantes.count,
        sessoes_criadas: sessoes.count,
        notas_criadas: notas.count,
        uploads_realizados: uploads.count
      },
      padroes: {
        media_sessoes_por_estudante: estudantes.count ? (sessoes.count || 0) / estudantes.count : 0,
        engajamento: sessoes.count && sessoes.count > 10 ? 'Alto' : 'Médio'
      }
    };

    await supabase.from('admin_relatorios').insert({
      titulo: `Relatório Quinzenal - ${hoje.toLocaleDateString('pt-PT')}`,
      periodo_inicio: duasSemanasAtras.toISOString().split('T')[0],
      periodo_fim: hoje.toISOString().split('T')[0],
      conteudo,
      gerado_por: localStorage.getItem('maflab_user_id')
    });

    loadRelatorios();
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
            <h1 className="text-3xl font-bold text-[#1E293B]">Relatórios</h1>
            <Button onClick={gerarRelatorio}>
              <Download className="w-5 h-5 mr-2" />
              Gerar Relatório Quinzenal
            </Button>
          </div>

          <div className="space-y-4">
            {relatorios.map(relatorio => (
              <Card key={relatorio.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#1E293B] mb-2">{relatorio.titulo}</h3>
                    <p className="text-sm text-[#64748B] mb-4">
                      Gerado em {new Date(relatorio.created_at).toLocaleDateString('pt-PT')}
                    </p>
                    
                    {relatorio.conteudo && (
                      <div className="grid md:grid-cols-4 gap-4 mt-4">
                        <div className="p-3 bg-[#F7FAFF] rounded-xl">
                          <p className="text-xs text-[#64748B] mb-1">Estudantes</p>
                          <p className="text-2xl font-bold text-[#1E293B]">
                            {relatorio.conteudo.estatisticas?.total_estudantes || 0}
                          </p>
                        </div>
                        <div className="p-3 bg-[#F7FAFF] rounded-xl">
                          <p className="text-xs text-[#64748B] mb-1">Sessões</p>
                          <p className="text-2xl font-bold text-[#1E293B]">
                            {relatorio.conteudo.estatisticas?.sessoes_criadas || 0}
                          </p>
                        </div>
                        <div className="p-3 bg-[#F7FAFF] rounded-xl">
                          <p className="text-xs text-[#64748B] mb-1">Notas</p>
                          <p className="text-2xl font-bold text-[#1E293B]">
                            {relatorio.conteudo.estatisticas?.notas_criadas || 0}
                          </p>
                        </div>
                        <div className="p-3 bg-[#F7FAFF] rounded-xl">
                          <p className="text-xs text-[#64748B] mb-1">Engajamento</p>
                          <p className="text-2xl font-bold text-[#16A34A]">
                            {relatorio.conteudo.padroes?.engajamento || 'N/A'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}

            {relatorios.length === 0 && (
              <Card className="p-12 text-center">
                <FileText className="w-16 h-16 text-[#64748B] mx-auto mb-4" />
                <p className="text-[#64748B] mb-4">Ainda não foram gerados relatórios</p>
                <Button onClick={gerarRelatorio}>Gerar Primeiro Relatório</Button>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
