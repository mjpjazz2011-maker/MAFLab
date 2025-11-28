import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/Input';
import { BookOpen, FileText, Brain, Upload, Trophy, BarChart3, Settings, Target, Plus } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/auth';

export const MapaCognitivo: React.FC = () => {
  const [mapas, setMapas] = useState<any[]>([]);
  const [selectedMapa, setSelectedMapa] = useState<any>(null);
  const [novoNo, setNovoNo] = useState('');

  useEffect(() => {
    loadMapas();
  }, []);

  const loadMapas = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    const { data } = await supabase
      .from('mapas_cognitivos')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      setMapas(data);
      setSelectedMapa(data[0]);
    }
  };

  const criarMapa = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    const { data } = await supabase
      .from('mapas_cognitivos')
      .insert({
        user_id: user.id,
        titulo: 'Novo Mapa Cognitivo',
        nos: [],
        relacoes: []
      })
      .select()
      .single();

    if (data) {
      setMapas([data, ...mapas]);
      setSelectedMapa(data);
    }
  };

  const adicionarNo = async () => {
    if (!novoNo || !selectedMapa) return;

    const novosNos = [...(selectedMapa.nos || []), { id: Date.now(), label: novoNo }];
    
    await supabase
      .from('mapas_cognitivos')
      .update({ nos: novosNos })
      .eq('id', selectedMapa.id);

    setSelectedMapa({ ...selectedMapa, nos: novosNos });
    setNovoNo('');
    loadMapas();
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
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-[#1E293B]">Mapa Cognitivo</h1>
              <p className="text-[#64748B]">Visualiza as tuas conexões conceituais</p>
            </div>
            <Button onClick={criarMapa}>
              <Plus className="w-5 h-5 mr-2" />
              Novo Mapa
            </Button>
          </div>

          {selectedMapa ? (
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="p-6">
                <h2 className="text-xl font-bold text-[#1E293B] mb-4">Conceitos</h2>
                <div className="flex gap-2 mb-4">
                  <Input
                    placeholder="Novo conceito..."
                    value={novoNo}
                    onChange={(e) => setNovoNo(e.target.value)}
                  />
                  <Button onClick={adicionarNo}>
                    <Plus className="w-5 h-5" />
                  </Button>
                </div>
                <div className="space-y-2">
                  {(selectedMapa.nos || []).map((no: any) => (
                    <div key={no.id} className="p-3 bg-[#F7FAFF] rounded-xl">
                      <p className="text-[#1E293B] font-medium">{no.label}</p>
                    </div>
                  ))}
                  {(!selectedMapa.nos || selectedMapa.nos.length === 0) && (
                    <p className="text-center text-[#64748B] py-8">Adiciona o primeiro conceito</p>
                  )}
                </div>
              </Card>

              <Card className="p-6">
                <h2 className="text-xl font-bold text-[#1E293B] mb-4">Relações</h2>
                <p className="text-[#64748B] text-center py-8">
                  Editor visual em desenvolvimento
                </p>
              </Card>
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Brain className="w-16 h-16 text-[#64748B] mx-auto mb-4" />
              <p className="text-[#64748B] mb-4">Ainda não tens mapas cognitivos</p>
              <Button onClick={criarMapa}>Criar Primeiro Mapa</Button>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
