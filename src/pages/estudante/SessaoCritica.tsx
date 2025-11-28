import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/button';
import { BookOpen, FileText, Brain, Upload, Trophy, BarChart3, Settings, Target, Save, Lightbulb } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/auth';

const reflexionPrompts = [
  "O que estou realmente a tentar dizer?",
  "Que evidências sustentam esta ideia?",
  "Que perspectivas alternativas existem?",
  "Como é que isto se relaciona com o contexto mais amplo?",
  "Que pressupostos estou a fazer?"
];

export const SessaoCritica: React.FC = () => {
  const [content, setContent] = useState('');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [startTime] = useState(Date.now());
  const [saved, setSaved] = useState(false);
  const [prompt, setPrompt] = useState(reflexionPrompts[0]);

  useEffect(() => {
    const interval = setInterval(() => {
      setPrompt(reflexionPrompts[Math.floor(Math.random() * reflexionPrompts.length)]);
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const autoSave = setInterval(() => {
      if (content) handleSave();
    }, 60000);
    return () => clearInterval(autoSave);
  }, [content]);

  const handleSave = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);

    if (sessionId) {
      await supabase.from('sessoes').update({
        conteudo: content,
        tempo_em_sessao: timeSpent,
        data_fim: new Date().toISOString()
      }).eq('id', sessionId);
    } else {
      const { data } = await supabase.from('sessoes').insert({
        user_id: user.id,
        conteudo: content,
        tempo_em_sessao: timeSpent,
        data_inicio: new Date().toISOString()
      }).select().single();
      
      if (data) setSessionId(data.id);
    }

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
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-[#1E293B]">Sessão Crítica</h1>
              <p className="text-[#64748B]">Escreve devagar. Pensa com clareza.</p>
            </div>
            <Button onClick={handleSave}>
              <Save className="w-5 h-5 mr-2" />
              {saved ? 'Guardado!' : 'Guardar'}
            </Button>
          </div>

          <Card className="p-4 mb-6 bg-blue-50 border-blue-200">
            <div className="flex items-start gap-3">
              <Lightbulb className="w-5 h-5 text-[#3366FF] mt-1" />
              <div>
                <p className="text-sm font-medium text-[#1E293B] mb-1">Reflexão Guiada</p>
                <p className="text-sm text-[#64748B]">{prompt}</p>
              </div>
            </div>
          </Card>

          <Card className="p-0 overflow-hidden">
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Começa a escrever..."
              className="w-full h-[600px] p-8 text-[#1E293B] bg-white resize-none focus:outline-none text-lg leading-relaxed"
              style={{ fontFamily: 'Inter, system-ui, sans-serif' }}
            />
          </Card>
        </div>
      </div>
    </div>
  );
};
