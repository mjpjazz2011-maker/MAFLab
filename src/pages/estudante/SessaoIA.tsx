import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import { BookOpen, FileText, Brain, Upload, Trophy, BarChart3, Settings, Target, Sparkles, Save, StickyNote, History } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/auth';
import { atribuirPontos, PONTOS } from '../../lib/gamification';


interface Interacao {
  role: 'estudante' | 'ia';
  mensagem?: string;
  resposta?: string;
  perguntas?: string[];
  sugestoes?: string[];
  timestamp: string;
}

export const SessaoIA: React.FC = () => {
  const navigate = useNavigate();
  const [texto, setTexto] = useState('');
  const [feedback, setFeedback] = useState('');
  const [perguntas, setPerguntas] = useState<string[]>([]);
  const [sugestoes, setSugestoes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [dataInicio, setDataInicio] = useState<Date>(new Date());
  const [saved, setSaved] = useState(false);
  const [notasRapidas, setNotasRapidas] = useState('');
  const [reflexao, setReflexao] = useState('');
  const [salvandoReflexao, setSalvandoReflexao] = useState(false);

  const [interacoes, setInteracoes] = useState<Interacao[]>([]);
  const [versoes, setVersoes] = useState<any[]>([]);
  const [sessaoId, setSessaoId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [iniciandoSessao, setIniciandoSessao] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);


  useEffect(() => {
    iniciarSessao();
  }, []);


  const logAtividade = async (tipo: string, dados: any) => {
    if (!userId) return;
    try {
      await supabase.from('atividade_logs').insert({
        user_id: userId,
        tipo,
        dados
      });
    } catch (err) {
      console.error('Erro ao registar atividade:', err);
    }
  };

  const iniciarSessao = async () => {
    try {
      setIniciandoSessao(true);
      const user = await getCurrentUser();
      if (!user) {
        navigate('/login');
        return;
      }
      
      setUserId(user.id);

      const inicioSessao = new Date();
      const { data, error } = await supabase.from('sessoes').insert({
        user_id: user.id,
        tipo_sessao: 'ia',
        conteudo: '',
        texto: '',
        data_inicio: inicioSessao.toISOString()
      }).select().single();

      if (error) {
        console.error('Erro ao criar sessão:', error);
        alert('Erro ao iniciar sessão. Por favor, recarrega a página.');
        return;
      }

      if (data) {
        setSessaoId(data.id);
        setDataInicio(inicioSessao);
        await logAtividade('iniciar_sessao_ia', { sessao_id: data.id });
        
        // Award points for starting a session
        await atribuirPontos(user.id, PONTOS.INICIAR_SESSAO);
      }

    } catch (err) {
      console.error('Erro ao iniciar sessão:', err);
      alert('Erro ao iniciar sessão. Por favor, recarrega a página.');
    } finally {
      setIniciandoSessao(false);
    }
  };



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

  const perguntasReflexao = [
    'Qual é a ideia central?',
    'Que evidências sustentam o argumento?',
    'Que contra-argumentos considerar?',
    'Como tornar mais clara esta ideia?',
    'Que pressupostos estou a fazer?'
  ];

  const pedirFeedbackIA = async () => {
    // PROTEÇÃO: Não executar sem sessao_id
    if (!sessaoId) {
      alert('Aguarda a inicialização da sessão...');
      return;
    }

    if (!userId) {
      alert('Erro: utilizador não identificado.');
      return;
    }

    if (texto.trim().length < 50) {
      alert('Escreve pelo menos 50 caracteres.');
      return;
    }

    setLoading(true);

    try {
      // 1. ENVIAR SEMPRE os campos corretos
      const { data, error } = await supabase.functions.invoke('feedback-ia-escrita', {
        body: { 
          sessao_id: sessaoId,
          user_id: userId,
          texto_atual: texto,
          notas: notasRapidas,
          reflexao: reflexao,
          interacoes: interacoes,
          timestamp: new Date().toISOString(),
          tipo_sessao: 'ia'
        }
      });

      if (error) throw error;

      // 2. RECEBER os campos da resposta
      const feedbackIA = data.feedback_ia || '';
      const perguntasIA = data.perguntas || [];
      const sugestoesRevisao = data.sugestoes_revisao || [];
      const interacaoRegistada = data.interacao_registada;

      // Atualizar estados locais
      setFeedback(feedbackIA);
      setPerguntas(perguntasIA);
      setSugestoes(sugestoesRevisao);

      // 3. ATUALIZAR A SESSÃO IMEDIATAMENTE
      const novasInteracoes = interacaoRegistada 
        ? [...interacoes, interacaoRegistada] 
        : interacoes;

      setInteracoes(novasInteracoes);

      // Atualizar na base de dados imediatamente
      const { error: updateError } = await supabase
        .from('sessoes')
        .update({
          interacoes: novasInteracoes,
          perguntas_ia: perguntasIA,
          feedback_ia: feedbackIA
        })
        .eq('id', sessaoId);

      if (updateError) {
        console.error('Erro ao atualizar sessão:', updateError);
      }

      await logAtividade('interacao_ia', { 
        sessao_id: sessaoId,
        caracteres: texto.length,
        num_interacoes: novasInteracoes.length
      });
      
      // Award points for requesting AI feedback
      if (userId) {
        await atribuirPontos(userId, PONTOS.FEEDBACK_IA);
      }

    } catch (err: any) {
      alert('Erro: ' + (err.message || 'Tenta novamente.'));
      await logAtividade('erro', { 
        tipo: 'feedback_ia',
        mensagem: err.message 
      });
    } finally {
      setLoading(false);
    }
  };




  const salvarVersao = async () => {
    const novaVersao = {
      texto: texto,
      notas: notasRapidas,
      reflexao: reflexao,
      timestamp: new Date().toISOString(),
      caracteres: texto.length
    };
    
    const versoesAtualizadas = [...versoes, novaVersao];
    setVersoes(versoesAtualizadas);

    if (sessaoId) {
      await supabase.from('sessoes').update({
        versoes: versoesAtualizadas
      }).eq('id', sessaoId);
    }

    await logAtividade('guardar_versao', { 
      sessao_id: sessaoId,
      versao_numero: versoesAtualizadas.length 
    });
    
    alert('Versão guardada!');
  };

  const guardarSessao = async () => {
    if (!userId || !sessaoId) {
      alert('Erro: Sessão não iniciada corretamente.');
      return;
    }

    try {
      // Calcular tempo total em segundos (diferença entre data_fim e data_inicio)
      const dataFim = new Date();
      const tempoTotal = Math.floor((dataFim.getTime() - dataInicio.getTime()) / 1000);

      // Atualizar TODOS os campos obrigatórios da tabela sessoes
      const { error } = await supabase.from('sessoes').update({
        conteudo: texto,
        texto: texto,
        interacoes: interacoes,
        notas_rapidas: notasRapidas,
        versoes: versoes,
        reflexao_estudante: reflexao,
        feedback_ia: feedback,
        perguntas_ia: perguntas,
        data_fim: dataFim.toISOString(),
        tempo_total: tempoTotal
      }).eq('id', sessaoId);

      if (error) {
        console.error('Erro ao guardar sessão:', error);
        alert('Erro ao guardar sessão: ' + error.message);
        await logAtividade('erro', { 
          tipo: 'guardar_sessao',
          mensagem: error.message 
        });
        return;
      }

      // Sucesso - mostrar modal
      setSaved(true);
      setShowSuccessModal(true);
      
      await logAtividade('guardar_sessao', { 
        sessao_id: sessaoId,
        tempo_total: tempoTotal,
        caracteres: texto.length,
        num_interacoes: interacoes.length,
        num_versoes: versoes.length
      });
      
      // Award points for saving a session
      await atribuirPontos(userId, PONTOS.GUARDAR_SESSAO);


      // Redirecionar após 2 segundos
      setTimeout(() => {
        setShowSuccessModal(false);
        navigate('/estudante');
      }, 2000);
    } catch (err: any) {
      console.error('Erro ao guardar sessão:', err);
      alert('Erro inesperado: ' + err.message);
    }
  };

  const guardarReflexao = async () => {
    // Validações: só funciona com sessão ativa e texto presente
    if (!sessaoId) {
      alert('Erro: Sessão não iniciada.');
      return;
    }

    if (!reflexao.trim()) {
      alert('Escreve algo na reflexão antes de guardar.');
      return;
    }

    setSalvandoReflexao(true);

    try {
      // Atualizar apenas o campo reflexao_estudante na sessão existente
      const { error } = await supabase
        .from('sessoes')
        .update({ reflexao_estudante: reflexao })
        .eq('id', sessaoId);

      if (error) {
        console.error('Erro ao guardar reflexão:', error);
        alert('Erro ao guardar reflexão: ' + error.message);
        return;
      }

      // Adicionar evento em atividade_logs
      await logAtividade('reflexao_estudante', {
        sessao_id: sessaoId,
        caracteres: reflexao.length,
        timestamp: new Date().toISOString()
      });

      alert('Reflexão guardada com sucesso!');
    } catch (err: any) {
      console.error('Erro ao guardar reflexão:', err);
      alert('Erro inesperado: ' + err.message);
    } finally {
      setSalvandoReflexao(false);
    }
  };



  // Mostrar loading enquanto a sessão está sendo criada
  if (iniciandoSessao) {
    return (
      <div className="flex min-h-screen bg-[#F7FAFF]">
        <Sidebar items={sidebarItems} />
        <div className="ml-64 flex-1 p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#3366FF] mx-auto mb-4"></div>
            <p className="text-[#64748B]">A iniciar sessão...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#F7FAFF]">
      <Sidebar items={sidebarItems} />
      
      {/* Modal de Sucesso */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md mx-4 shadow-2xl transform animate-in fade-in zoom-in duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-[#1E293B] mb-2">Sessão Guardada!</h3>
              <p className="text-[#64748B]">Os teus dados foram guardados com sucesso.</p>
            </div>
          </div>
        </div>
      )}

      <div className="ml-64 flex-1 p-8">
        <div className="max-w-7xl mx-auto">
          {sessaoId && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
              Sessão iniciada com sucesso! ID: {sessaoId.substring(0, 8)}...
            </div>
          )}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1E293B]">Momento de Escrita com IA</h1>
              <p className="text-[#64748B] mt-1">Escreve, reflete e recebe análise crítica.</p>
            </div>
            <div className="flex gap-3">
              <Button onClick={salvarVersao} variant="outline" disabled={!sessaoId}>Salvar Versão</Button>
              <Button onClick={guardarSessao} disabled={saved || !sessaoId}>
                <Save className="w-4 h-4 mr-2" />
                {saved ? 'Guardado!' : 'Guardar Sessão'}
              </Button>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">

              <Card className="p-6">
                <textarea
                  value={texto}
                  onChange={(e) => setTexto(e.target.value)}
                  placeholder="Começa a escrever..."
                  className="w-full h-[400px] p-4 border border-[#E2E8F0] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#3366FF] text-[#1E293B]"
                />
                <div className="flex items-center justify-between mt-4">
                  <span className="text-sm text-[#64748B]">{texto.length} caracteres</span>
                  <Button onClick={pedirFeedbackIA} disabled={loading}>
                    <Sparkles className="w-4 h-4 mr-2" />
                    {loading ? 'A analisar...' : 'Pedir Feedback IA'}
                  </Button>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-bold text-[#1E293B] flex items-center">
                    <Brain className="w-5 h-5 mr-2 text-[#3366FF]" />
                    Reflexão Final
                  </h3>
                  <Button 
                    onClick={guardarReflexao}
                    disabled={salvandoReflexao || !sessaoId || !reflexao.trim()}
                    className="bg-[#007AFF] hover:bg-[#0051D5] text-white px-4 py-2 rounded-lg font-medium text-sm transition-all duration-200 shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {salvandoReflexao ? 'A guardar...' : 'Guardar Reflexão'}
                  </Button>
                </div>
                <textarea
                  value={reflexao}
                  onChange={(e) => setReflexao(e.target.value)}
                  placeholder="O que aprendi nesta sessão?"
                  className="w-full h-[120px] p-4 border border-[#E2E8F0] rounded-xl resize-none focus:outline-none focus:ring-2 focus:ring-[#3366FF] text-[#1E293B]"
                />
              </Card>

            </div>

            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="font-bold text-[#1E293B] mb-3 flex items-center">
                  <StickyNote className="w-5 h-5 mr-2 text-[#3366FF]" />
                  Notas da Sessão
                </h3>
                <textarea
                  value={notasRapidas}
                  onChange={(e) => setNotasRapidas(e.target.value)}
                  placeholder="Notas rápidas..."
                  className="w-full h-[200px] p-3 border border-[#E2E8F0] rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#3366FF] text-sm text-[#1E293B]"
                />
              </Card>

              <Card className="p-6">
                <h3 className="font-bold text-[#1E293B] mb-4 flex items-center">
                  <Brain className="w-5 h-5 mr-2 text-[#3366FF]" />
                  Perguntas de Reflexão
                </h3>
                <ul className="space-y-3">
                  {perguntasReflexao.map((p, i) => (
                    <li key={i} className="text-sm text-[#64748B] pl-4 border-l-2 border-[#E2E8F0]">{p}</li>
                  ))}
                </ul>
              </Card>

              {feedback && (
                <Card className="p-6 bg-gradient-to-br from-[#3366FF] to-[#6366F1] text-white">
                  <h3 className="font-bold mb-3 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2" />
                    Feedback da IA
                  </h3>
                  <p className="text-sm mb-4 opacity-90">{feedback}</p>
                  
                  {perguntas.length > 0 && (
                    <>
                      <h4 className="font-semibold text-sm mb-2">Perguntas:</h4>
                      <ul className="space-y-2 mb-4">
                        {perguntas.map((p, i) => (
                          <li key={i} className="text-sm opacity-90">• {p}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  
                  {sugestoes.length > 0 && (
                    <>
                      <h4 className="font-semibold text-sm mb-2">Sugestões:</h4>
                      <ul className="space-y-2">
                        {sugestoes.map((s, i) => (
                          <li key={i} className="text-sm opacity-90">• {s}</li>
                        ))}
                      </ul>
                    </>
                  )}
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
