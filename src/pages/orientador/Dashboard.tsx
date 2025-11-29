import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Card } from '../../components/ui/Card';
import { Users, UserPlus, FileText, Target, Mail, Clock, Activity } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/auth';
import { useNavigate } from 'react-router-dom';

interface EstudanteComStats {
  id: string;
  estudante: {
    id: string;
    nome: string;
    email: string;
    ciclo: string;
  };
  sessoes_count: number;
  ultima_atividade: string | null;
  status: string;
}

export const OrientadorDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [estudantes, setEstudantes] = useState<EstudanteComStats[]>([]);
  const [stats, setStats] = useState({ total: 0, ativos: 0, sessoesSemana: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadEstudantes();
  }, []);

  const loadEstudantes = async () => {
    setLoading(true);
    const user = await getCurrentUser();
    if (!user) {
      setLoading(false);
      return;
    }

    // Get students assigned to this advisor
    const { data: relacoes } = await supabase
      .from('orientadores_estudantes')
      .select('*')
      .eq('orientador_id', user.id)
      .eq('status', 'ativo');

    if (!relacoes || relacoes.length === 0) {
      setLoading(false);
      return;
    }

    // Get sessions count and last activity for each student
    const estudantesComStats: EstudanteComStats[] = [];
    let totalSessoesSemana = 0;
    const umaSemanaAtras = new Date();
    umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);

    for (const relacao of relacoes) {
      // Count sessions
      const { count: sessoesCount } = await supabase
        .from('sessoes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', relacao.estudante_id);

      // Get last activity
      const { data: ultimaSessao } = await supabase
        .from('sessoes')
        .select('created_at')
        .eq('user_id', relacao.estudante_id)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

      // Count sessions this week
      const { count: sessoesSemana } = await supabase
        .from('sessoes')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', relacao.estudante_id)
        .gte('created_at', umaSemanaAtras.toISOString());

      totalSessoesSemana += sessoesSemana || 0;

      estudantesComStats.push({
        id: relacao.id,
        estudante: {
          id: relacao.estudante_id,
          nome: relacao.estudante_nome || 'Estudante',
          email: relacao.estudante_email || '',
          ciclo: relacao.estudante_ciclo || 'N/A'
        },
        sessoes_count: sessoesCount || 0,
        ultima_atividade: ultimaSessao?.created_at || null,
        status: relacao.status
      });
    }



    setEstudantes(estudantesComStats);
    setStats({
      total: estudantesComStats.length,
      ativos: estudantesComStats.filter(e => e.status === 'ativo').length,
      sessoesSemana: totalSessoesSemana
    });
    setLoading(false);
  };

  const sidebarItems = [
    { path: '/orientador', label: 'Dashboard', icon: <Target className="w-5 h-5" /> },
    { path: '/orientador/estudantes', label: 'Estudantes', icon: <Users className="w-5 h-5" /> },
    { path: '/orientador/convites', label: 'Convites', icon: <Mail className="w-5 h-5" /> },
    { path: '/orientador/peer-review', label: 'Peer Review', icon: <FileText className="w-5 h-5" /> }
  ];

  const formatUltimaAtividade = (data: string | null) => {
    if (!data) return 'Sem atividade';
    const diff = Date.now() - new Date(data).getTime();
    const dias = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (dias === 0) return 'Hoje';
    if (dias === 1) return 'Ontem';
    if (dias < 7) return `Há ${dias} dias`;
    return new Date(data).toLocaleDateString('pt-PT');
  };

  return (
    <div className="flex min-h-screen bg-[#F7FAFF]">
      <Sidebar items={sidebarItems} />
      
      <div className="ml-64 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-4xl font-bold text-[#1E293B] mb-8">Dashboard Orientador</h1>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#64748B]">Total Estudantes</span>
                <Users className="w-5 h-5 text-[#3366FF]" />
              </div>
              <p className="text-3xl font-bold text-[#1E293B]">{stats.total}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#64748B]">Ativos</span>
                <Target className="w-5 h-5 text-[#16A34A]" />
              </div>
              <p className="text-3xl font-bold text-[#1E293B]">{stats.ativos}</p>
            </Card>

            <Card className="p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#64748B]">Sessões Esta Semana</span>
                <FileText className="w-5 h-5 text-[#3366FF]" />
              </div>
              <p className="text-3xl font-bold text-[#1E293B]">{stats.sessoesSemana}</p>
            </Card>
          </div>

          <Card className="p-6">
            <h2 className="text-2xl font-bold text-[#1E293B] mb-6">Estudantes</h2>
            
            {loading ? (
              <div className="text-center py-12">
                <p className="text-[#64748B]">A carregar...</p>
              </div>
            ) : (
              <div className="space-y-3">
                {estudantes.map((est) => (
                  <div
                    key={est.id}
                    onClick={() => navigate(`/orientador/estudante/${est.estudante.id}`)}
                    className="flex items-center justify-between p-4 bg-[#F7FAFF] rounded-xl hover:bg-gray-100 cursor-pointer transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3366FF] to-[#2952CC] flex items-center justify-center text-white font-bold">
                        {est.estudante.nome.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium text-[#1E293B]">{est.estudante.nome}</p>
                        <p className="text-sm text-[#64748B]">{est.estudante.ciclo}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-center">
                        <p className="text-xs text-[#64748B] mb-1">Sessões</p>
                        <p className="text-lg font-bold text-[#3366FF]">{est.sessoes_count}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-xs text-[#64748B] mb-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Última atividade
                        </p>
                        <p className="text-sm font-medium text-[#1E293B]">
                          {formatUltimaAtividade(est.ultima_atividade)}
                        </p>
                      </div>
                      <button className="px-4 py-2 bg-[#3366FF] text-white rounded-lg hover:bg-[#2952CC] transition-colors text-sm font-medium">
                        Ver Detalhes
                      </button>
                    </div>
                  </div>
                ))}

                {estudantes.length === 0 && (
                  <div className="text-center py-12">
                    <Users className="w-16 h-16 text-[#64748B] mx-auto mb-4" />
                    <p className="text-[#64748B]">Ainda não tens estudantes associados</p>
                  </div>
                )}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
};

