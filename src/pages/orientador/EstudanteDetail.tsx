import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Sidebar } from '../../components/Sidebar';
import { Card } from '../../components/ui/Card';
import { Users, UserPlus, FileText, Target, Mail, BookOpen, Brain, Sparkles, MessageSquare, StickyNote, GitBranch, Clock } from 'lucide-react';

import { supabase } from '../../lib/supabase';


export const EstudanteDetail: React.FC = () => {
  const { id } = useParams();
  const [estudante, setEstudante] = useState<any>(null);
  const [sessoes, setSessoes] = useState<any[]>([]);
  const [sessoesIA, setSessoesIA] = useState<any[]>([]);
  const [notas, setNotas] = useState<any[]>([]);
  const [sessaoExpandida, setSessaoExpandida] = useState<string | null>(null);


  useEffect(() => {
    if (id) loadEstudanteData();
  }, [id]);

  const loadEstudanteData = async () => {
    const { data: userData } = await supabase
      .from('users')
      .select('*')
      .eq('id', id)
      .single();

    if (userData) setEstudante(userData);

    const { data: sessoesData } = await supabase
      .from('sessoes')
      .select('*')
      .eq('user_id', id)
      .eq('partilhada', true)
      .order('created_at', { ascending: false });

    if (sessoesData) setSessoes(sessoesData);

    // Carregar sessões IA (todas as sessões do estudante)
    const { data: sessoesIAData } = await supabase
      .from('sessoes')
      .select('*')
      .eq('user_id', id)
      .order('created_at', { ascending: false });

    if (sessoesIAData) setSessoesIA(sessoesIAData);

    const { data: notasData } = await supabase
      .from('notas')
      .select('*')
      .eq('user_id', id)
      .eq('partilhada', true)
      .order('created_at', { ascending: false });

    if (notasData) setNotas(notasData);

  };

  const sidebarItems = [
    { path: '/orientador', label: 'Dashboard', icon: <Target className="w-5 h-5" /> },
    { path: '/orientador/estudantes', label: 'Estudantes', icon: <Users className="w-5 h-5" /> },
    { path: '/orientador/convites', label: 'Convites', icon: <Mail className="w-5 h-5" /> },
    { path: '/orientador/peer-review', label: 'Peer Review', icon: <FileText className="w-5 h-5" /> }
  ];

  if (!estudante) {
    return (
      <div className="flex min-h-screen bg-[#F7FAFF]">
        <Sidebar items={sidebarItems} />
        <div className="ml-64 flex-1 p-8">
          <p className="text-[#64748B]">A carregar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7FAFF]">
      <Sidebar items={sidebarItems} />
      
      <div className="ml-64 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <Card className="p-6 mb-8">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3366FF] to-[#2952CC] flex items-center justify-center text-white text-3xl font-bold">
                {estudante.nome.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-[#1E293B]">{estudante.nome}</h1>
                <p className="text-[#64748B]">{estudante.ciclo} • {estudante.email}</p>
              </div>
            </div>
          </Card>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <BookOpen className="w-6 h-6 text-[#3366FF]" />
                <h2 className="text-xl font-bold text-[#1E293B]">Sessões Partilhadas</h2>
              </div>
              <div className="space-y-3">
                {sessoes.map(sessao => (
                  <div key={sessao.id} className="p-4 bg-[#F7FAFF] rounded-xl">
                    <p className="text-sm text-[#64748B] mb-2">
                      {new Date(sessao.created_at).toLocaleDateString('pt-PT')}
                    </p>
                    <p className="text-[#1E293B] line-clamp-2">{sessao.conteudo}</p>
                  </div>
                ))}
                {sessoes.length === 0 && (
                  <p className="text-center text-[#64748B] py-8">Sem sessões partilhadas</p>
                )}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="w-6 h-6 text-[#3366FF]" />
                <h2 className="text-xl font-bold text-[#1E293B]">Notas Partilhadas</h2>
              </div>
              <div className="space-y-3">
                {notas.map(nota => (
                  <div key={nota.id} className="p-4 bg-[#F7FAFF] rounded-xl">
                    <p className="font-medium text-[#1E293B] mb-1">{nota.titulo}</p>
                    <p className="text-sm text-[#64748B]">
                      {new Date(nota.created_at).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                ))}
                {notas.length === 0 && (
                  <p className="text-center text-[#64748B] py-8">Sem notas partilhadas</p>
                )}
              </div>
            </Card>
          </div>

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-6 h-6 text-[#3366FF]" />
              <h2 className="text-2xl font-bold text-[#1E293B]">Sessões com IA</h2>
            </div>
            {sessoesIA.length === 0 ? (
              <Card className="p-8 text-center">
                <p className="text-[#64748B]">Nenhuma sessão com IA registada</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {sessoesIA.map(sessao => (
                  <Card key={sessao.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-[#1E293B] mb-2">
                          Sessão de {new Date(sessao.created_at).toLocaleDateString('pt-PT')}
                        </h3>
                        <div className="flex items-center gap-4 text-sm text-[#64748B]">
                          <span className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            {Math.floor((sessao.tempo_total || 0) / 60)} min
                          </span>
                          <span>{new Date(sessao.created_at).toLocaleTimeString('pt-PT')}</span>
                          {sessao.interacoes && sessao.interacoes.length > 0 && (
                            <span className="flex items-center gap-1">
                              <MessageSquare className="w-4 h-4" />
                              {sessao.interacoes.length} interações
                            </span>
                          )}
                          {sessao.versoes && sessao.versoes.length > 0 && (
                            <span className="flex items-center gap-1">
                              <GitBranch className="w-4 h-4" />
                              {sessao.versoes.length} versões
                            </span>
                          )}
                        </div>
                      </div>
                      <button 
                        className="px-4 py-2 text-sm border border-[#E2E8F0] rounded-lg hover:bg-[#F7FAFF] transition-colors"
                        onClick={() => setSessaoExpandida(sessaoExpandida === sessao.id ? null : sessao.id)}
                      >
                        {sessaoExpandida === sessao.id ? 'Fechar' : 'Ver Detalhes'}
                      </button>
                    </div>


                    {sessaoExpandida === sessao.id && (
                      <div className="mt-6 space-y-6 border-t pt-6">
                        <div>
                          <h4 className="font-semibold text-[#1E293B] mb-2">Conteúdo:</h4>
                          <div className="bg-[#F7FAFF] p-4 rounded-lg text-sm text-[#1E293B] whitespace-pre-wrap">
                            {sessao.conteudo || 'Sem conteúdo'}
                          </div>
                        </div>

                        {sessao.feedback_ia && (
                          <div>
                            <h4 className="font-semibold text-[#1E293B] mb-2 flex items-center gap-2">
                              <Sparkles className="w-4 h-4 text-[#3366FF]" />
                              Feedback da IA:
                            </h4>
                            <div className="bg-gradient-to-br from-[#3366FF] to-[#6366F1] text-white p-4 rounded-lg text-sm">
                              {sessao.feedback_ia}
                            </div>
                          </div>
                        )}

                        {sessao.reflexao_estudante && (
                          <div>
                            <h4 className="font-semibold text-[#1E293B] mb-2 flex items-center gap-2">
                              <Brain className="w-4 h-4 text-[#3366FF]" />
                              Reflexão:
                            </h4>
                            <div className="bg-[#F7FAFF] p-4 rounded-lg text-sm text-[#1E293B]">
                              {sessao.reflexao_estudante}
                            </div>
                          </div>
                        )}

                        {sessao.notas_rapidas && (
                          <div>
                            <h4 className="font-semibold text-[#1E293B] mb-2 flex items-center gap-2">
                              <StickyNote className="w-4 h-4 text-[#3366FF]" />
                              Notas:
                            </h4>
                            <div className="bg-[#FFF7ED] p-4 rounded-lg text-sm text-[#1E293B]">
                              {sessao.notas_rapidas}
                            </div>
                          </div>
                        )}

                        {sessao.interacoes && sessao.interacoes.length > 0 && (
                          <div>
                            <h4 className="font-semibold text-[#1E293B] mb-3 flex items-center gap-2">
                              <MessageSquare className="w-4 h-4 text-[#3366FF]" />
                              Histórico de Interações:
                            </h4>
                            <div className="space-y-3">
                              {sessao.interacoes.map((int: any, idx: number) => (
                                <div 
                                  key={idx}
                                  className={`p-3 rounded-lg text-sm ${
                                    int.role === 'estudante' 
                                      ? 'bg-[#F7FAFF] text-[#1E293B] ml-8' 
                                      : 'bg-gradient-to-br from-[#3366FF] to-[#6366F1] text-white mr-8'
                                  }`}
                                >
                                  <div className="font-semibold mb-1 text-xs opacity-70">
                                    {int.role === 'estudante' ? 'Estudante' : 'IA'} • {new Date(int.timestamp).toLocaleTimeString('pt-PT')}
                                  </div>
                                  <div>{int.mensagem}</div>
                                </div>
                              ))}
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

          {/* Placeholders for Future Reports */}
          <div className="grid md:grid-cols-3 gap-6 mb-6">
            <Card className="p-6 border-2 border-dashed border-[#E2E8F0]">
              <div className="text-center">
                <FileText className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
                <h3 className="font-semibold text-[#64748B] mb-2">Relatório P5</h3>
                <p className="text-sm text-[#94A3B8]">Em breve</p>
              </div>
            </Card>

            <Card className="p-6 border-2 border-dashed border-[#E2E8F0]">
              <div className="text-center">
                <FileText className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
                <h3 className="font-semibold text-[#64748B] mb-2">Relatório C1</h3>
                <p className="text-sm text-[#94A3B8]">Em breve</p>
              </div>
            </Card>

            <Card className="p-6 border-2 border-dashed border-[#E2E8F0]">
              <div className="text-center">
                <FileText className="w-12 h-12 text-[#94A3B8] mx-auto mb-3" />
                <h3 className="font-semibold text-[#64748B] mb-2">Relatório C2</h3>
                <p className="text-sm text-[#94A3B8]">Em breve</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};


