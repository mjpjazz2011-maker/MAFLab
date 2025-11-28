import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Card } from '../../components/ui/Card';
import { BookOpen, FileText, Brain, Upload, Trophy, BarChart3, Settings, Target, Award, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/auth';

export const Gamificacao: React.FC = () => {
  const [pontos, setPontos] = useState(0);
  const [nivel, setNivel] = useState(1);
  const [badges, setBadges] = useState<any[]>([]);
  const [missoes, setMissoes] = useState<any[]>([]);

  useEffect(() => {
    loadGamificationData();
  }, []);

  const loadGamificationData = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    const { data: pontosData } = await supabase
      .from('gamificacao_pontos')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (pontosData) {
      setPontos(pontosData.pontos_totais);
      setNivel(pontosData.nivel);
    }

    const { data: badgesData } = await supabase
      .from('gamificacao_badges')
      .select('*')
      .eq('user_id', user.id);

    if (badgesData) setBadges(badgesData);
  };

  const pontosParaProximoNivel = nivel * 1000;
  const progressoNivel = (pontos % 1000) / 10;

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
          <h1 className="text-3xl font-bold text-[#1E293B] mb-8">Gamificação</h1>

          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <p className="text-sm text-[#64748B] mb-1">Nível Atual</p>
                  <p className="text-5xl font-bold text-[#1E293B]">{nivel}</p>
                </div>
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#3366FF] to-[#2952CC] flex items-center justify-center">
                  <Trophy className="w-10 h-10 text-white" />
                </div>
              </div>
              <div className="mb-2">
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-[#64748B]">Progresso</span>
                  <span className="text-[#1E293B] font-medium">{pontos} / {pontosParaProximoNivel} XP</span>
                </div>
                <div className="w-full h-3 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-[#3366FF] to-[#2952CC] transition-all duration-500"
                    style={{ width: `${progressoNivel}%` }}
                  />
                </div>
              </div>
            </Card>

            <Card className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center">
                  <Star className="w-8 h-8 text-yellow-500" />
                </div>
                <div>
                  <p className="text-sm text-[#64748B]">Total de Pontos</p>
                  <p className="text-4xl font-bold text-[#1E293B]">{pontos}</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Sessões Críticas</span>
                  <span className="text-[#1E293B] font-medium">+50 XP cada</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Notas Criadas</span>
                  <span className="text-[#1E293B] font-medium">+25 XP cada</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#64748B]">Missões Completadas</span>
                  <span className="text-[#1E293B] font-medium">+100 XP cada</span>
                </div>
              </div>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-2xl font-bold text-[#1E293B] mb-4">Badges Desbloqueados</h2>
              <Card className="p-6">
                {badges.length === 0 ? (
                  <p className="text-center text-[#64748B] py-8">Ainda não tens badges. Continua a trabalhar!</p>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {badges.map(badge => (
                      <div key={badge.id} className="text-center">
                        <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#3366FF] to-[#2952CC] flex items-center justify-center mx-auto mb-2">
                          <Award className="w-8 h-8 text-white" />
                        </div>
                        <p className="text-xs font-medium text-[#1E293B]">{badge.badge_nome}</p>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#1E293B] mb-4">Missões da Semana</h2>
              <Card className="p-6">
                <div className="space-y-4">
                  <div className="p-4 bg-[#F7FAFF] rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-[#1E293B]">3 Sessões Críticas</p>
                        <p className="text-sm text-[#64748B]">Completa 3 sessões esta semana</p>
                      </div>
                      <span className="text-xs font-bold text-[#3366FF]">+100 XP</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#3366FF]" style={{ width: '0%' }} />
                    </div>
                  </div>

                  <div className="p-4 bg-[#F7FAFF] rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-[#1E293B]">5 Notas Criadas</p>
                        <p className="text-sm text-[#64748B]">Cria 5 novas notas</p>
                      </div>
                      <span className="text-xs font-bold text-[#3366FF]">+100 XP</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#3366FF]" style={{ width: '0%' }} />
                    </div>
                  </div>

                  <div className="p-4 bg-[#F7FAFF] rounded-xl">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <p className="font-medium text-[#1E293B]">Atualizar Mapa Cognitivo</p>
                        <p className="text-sm text-[#64748B]">Adiciona 5 novos conceitos</p>
                      </div>
                      <span className="text-xs font-bold text-[#3366FF]">+150 XP</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-[#3366FF]" style={{ width: '0%' }} />
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
