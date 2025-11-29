import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/button';
import { BookOpen, FileText, Brain, Upload, Trophy, BarChart3, Settings, Target, Sparkles, History, Clock, MessageSquare, GitBranch, StickyNote } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/auth';

interface Sessao {
  id: string;
  tipo_sessao: string;
  conteudo: string;
  texto: string;
  interacoes: any[];
  versoes: any[];
  notas_rapidas: string;
  reflexao_estudante: string;
  feedback_ia: string;
  perguntas_ia: string[];
  tempo_total: number;
  data_inicio: string;
  data_fim: string;
  created_at: string;
}

export const HistoricoIA: React.FC = () => {
  const [sessoes, setSessoes] = useState<Sessao[]>([]);
  const [loading, setLoading] = useState(true);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<Sessao | null>(null);

  const sidebarItems = [
    { path: '/estudante', label: 'Dashboard', icon: <Target className="w-5 h-5" /> },
    { path: '/sessao-critica', label: 'Sessão Crítica', icon: <BookOpen className="w-5 h-5" /> },
    { path: '/escrita-ia', label: 'Escrita com IA', icon: <Sparkles className="w-5 h-5" /> },

    { path: '/historico-ia', label: 'Histórico IA', icon: <History className="w-5 h-5" /> },
    { path: '/notas', label: 'Notas', icon: <FileText className="w-5 h-5" /> },
    { path: '/mapa-cognitivo', label: 'Mapa Cognitivo', icon: <Brain className="w-5 h-5" /> },
    { path: '/uploads', label: 'Uploads', icon: <Upload className="w-5 h-5" /> },
    { path: '/gamificacao', label: 'Gamificação', icon: <Trophy className="w-5 h-5" /> },
    { path: '/relatorios', label: 'Relatórios', icon: <BarChart3 className="w-5 h-5" /> },
    { path: '/configuracoes', label: 'Configurações', icon: <Settings className="w-5 h-5" /> }
  ];

  useEffect(() => {
    carregarSessoes();
  }, []);

  const carregarSessoes = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('sessoes')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (!error && data) {
      setSessoes(data);
    }
    setLoading(false);
  };

  const formatarTempo = (segundos: number) => {
    const minutos = Math.floor(segundos / 60);
    return `${minutos} min`;
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-PT', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="flex min-h-screen bg-[#F7FAFF]">
      <Sidebar items={sidebarItems} />
      
      <div className="ml-64 flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-[#1E293B]">Histórico de Sessões IA</h1>
            <p className="text-[#64748B] mt-1">Revê todas as tuas sessões de escrita com IA.</p>
          </div>

          {loading ? (
            <Card className="p-8 text-center">
              <p className="text-[#64748B]">A carregar...</p>
            </Card>
          ) : sessoes.length === 0 ? (
            <Card className="p-8 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-[#3366FF]" />
              <p className="text-[#64748B]">Ainda não tens sessões de escrita com IA.</p>
            </Card>
          ) : (
            <div className="grid gap-6">
              {sessoes.map((sessao) => (
                <Card key={sessao.id} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Sparkles className="w-5 h-5 text-[#3366FF]" />
                        <h3 className="font-bold text-[#1E293B]">
                          Sessão de {formatarData(sessao.created_at)}
                        </h3>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-[#64748B]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          {formatarTempo(sessao.tempo_total || 0)}
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-4 h-4" />
                          {sessao.interacoes?.length || 0} interações
                        </span>
                        <span className="flex items-center gap-1">
                          <GitBranch className="w-4 h-4" />
                          {sessao.versoes?.length || 0} versões
                        </span>
                      </div>
                    </div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setSessaoSelecionada(sessaoSelecionada?.id === sessao.id ? null : sessao)}
                    >
                      {sessaoSelecionada?.id === sessao.id ? 'Fechar' : 'Ver Detalhes'}
                    </Button>
                  </div>

                  {sessao.conteudo && (
                    <div className="mb-4">
                      <p className="text-sm text-[#64748B] line-clamp-3">
                        {sessao.conteudo}
                      </p>
                    </div>
                  )}

                  {sessaoSelecionada?.id === sessao.id && (
                    <div className="mt-6 pt-6 border-t border-[#E2E8F0] space-y-6">
                      {sessao.conteudo && (
                        <div>
                          <h4 className="font-semibold text-[#1E293B] mb-2">Texto Completo</h4>
                          <div className="bg-[#F8FAFC] p-4 rounded-lg">
                            <p className="text-sm text-[#475569] whitespace-pre-wrap">{sessao.conteudo}</p>
                          </div>
                        </div>
                      )}

                      {sessao.feedback_ia && (
                        <div>
                          <h4 className="font-semibold text-[#1E293B] mb-2 flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-[#3366FF]" />
                            Feedback da IA
                          </h4>
                          <div className="bg-gradient-to-br from-[#3366FF]/10 to-[#6366F1]/10 p-4 rounded-lg">
                            <p className="text-sm text-[#475569]">{sessao.feedback_ia}</p>
                          </div>
                        </div>
                      )}

                      {sessao.perguntas_ia && sessao.perguntas_ia.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-[#1E293B] mb-2">Perguntas da IA</h4>
                          <ul className="space-y-2">
                            {sessao.perguntas_ia.map((p, i) => (
                              <li key={i} className="text-sm text-[#475569] pl-4 border-l-2 border-[#3366FF]">
                                {p}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {sessao.interacoes && sessao.interacoes.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-[#1E293B] mb-3 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4" />
                            Histórico de Interações
                          </h4>
                          <div className="space-y-3">
                            {sessao.interacoes.map((int: any, i: number) => (
                              <div key={i} className={`p-3 rounded-lg ${
                                int.role === 'estudante' 
                                  ? 'bg-[#F8FAFC] border-l-4 border-[#3366FF]' 
                                  : 'bg-gradient-to-br from-[#3366FF]/10 to-[#6366F1]/10'
                              }`}>
                                <div className="text-xs text-[#64748B] mb-1">
                                  {int.role === 'estudante' ? 'Tu' : 'IA'} • {formatarData(int.timestamp)}
                                </div>
                                <p className="text-sm text-[#475569]">
                                  {int.mensagem || int.resposta}
                                </p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {sessao.versoes && sessao.versoes.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-[#1E293B] mb-3 flex items-center gap-2">
                            <GitBranch className="w-4 h-4" />
                            Versões Guardadas
                          </h4>
                          <div className="space-y-2">
                            {sessao.versoes.map((v: any, i: number) => (
                              <div key={i} className="bg-[#F8FAFC] p-3 rounded-lg">
                                <div className="text-xs text-[#64748B] mb-1">
                                  Versão {i + 1} • {formatarData(v.timestamp)} • {v.caracteres} caracteres
                                </div>
                                <p className="text-sm text-[#475569] line-clamp-2">{v.texto}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {sessao.notas_rapidas && (
                        <div>
                          <h4 className="font-semibold text-[#1E293B] mb-2 flex items-center gap-2">
                            <StickyNote className="w-4 h-4" />
                            Notas da Sessão
                          </h4>
                          <div className="bg-[#FEF3C7] p-4 rounded-lg">
                            <p className="text-sm text-[#92400E] whitespace-pre-wrap">{sessao.notas_rapidas}</p>
                          </div>
                        </div>
                      )}

                      {sessao.reflexao_estudante && (
                        <div>
                          <h4 className="font-semibold text-[#1E293B] mb-2 flex items-center gap-2">
                            <Brain className="w-4 h-4 text-[#3366FF]" />
                            Reflexão Final
                          </h4>
                          <div className="bg-[#F8FAFC] p-4 rounded-lg border-l-4 border-[#3366FF]">
                            <p className="text-sm text-[#475569] whitespace-pre-wrap">{sessao.reflexao_estudante}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
