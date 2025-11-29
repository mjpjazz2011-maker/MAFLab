import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/Input';
import { BookOpen, FileText, Brain, Upload, Trophy, BarChart3, Settings, Target, Plus, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/auth';

interface Note {
  id: string;
  titulo: string;
  conteudo: string;
  created_at: string;
}

export const Notas: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');

  useEffect(() => {
    loadNotes();
  }, []);

  useEffect(() => {
    if (selectedNote) {
      setTitulo(selectedNote.titulo);
      setConteudo(selectedNote.conteudo);
    }
  }, [selectedNote]);

  const loadNotes = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    const { data } = await supabase
      .from('notas')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setNotes(data);
  };

  const handleSave = async () => {
    const user = await getCurrentUser();
    if (!user || !titulo) return;

    if (selectedNote) {
      await supabase.from('notas').update({
        titulo,
        conteudo,
        updated_at: new Date().toISOString()
      }).eq('id', selectedNote.id);
    } else {
      const { data } = await supabase.from('notas').insert({
        user_id: user.id,
        titulo,
        conteudo
      }).select().single();
      
      if (data) setSelectedNote(data);
    }

    loadNotes();
  };

  const handleNewNote = () => {
    setSelectedNote(null);
    setTitulo('');
    setConteudo('');
  };

  const filteredNotes = notes.filter(note =>
    note.titulo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    note.conteudo.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      
      <div className="ml-64 flex-1 flex">
        <div className="w-80 bg-white border-r border-gray-200 p-4">
          <div className="flex items-center gap-2 mb-4">
            <Button size="sm" onClick={handleNewNote} className="flex-1">
              <Plus className="w-4 h-4 mr-2" />
              Nova Nota
            </Button>
          </div>

          <div className="mb-4">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-[#64748B]" />
              <input
                type="text"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#F6F8FA] rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#3366FF]"
              />
            </div>
          </div>

          <div className="space-y-2">
            {filteredNotes.map(note => (
              <div
                key={note.id}
                onClick={() => setSelectedNote(note)}
                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                  selectedNote?.id === note.id ? 'bg-[#3366FF] text-white' : 'hover:bg-gray-50'
                }`}
              >
                <p className="font-medium text-sm truncate">{note.titulo}</p>
                <p className={`text-xs mt-1 truncate ${selectedNote?.id === note.id ? 'text-blue-100' : 'text-[#64748B]'}`}>
                  {note.conteudo || 'Sem conteúdo'}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div className="flex-1 p-8">
          <div className="max-w-4xl mx-auto">
            <div className="mb-6">
              <Input
                placeholder="Título da nota"
                value={titulo}
                onChange={(e) => setTitulo(e.target.value)}
                className="text-2xl font-bold border-0 bg-transparent px-0 focus:ring-0"
              />
            </div>

            <Card className="p-0 overflow-hidden">
              <textarea
                value={conteudo}
                onChange={(e) => setConteudo(e.target.value)}
                onBlur={handleSave}
                placeholder="Escreve aqui..."
                className="w-full h-[600px] p-8 text-[#1E293B] bg-white resize-none focus:outline-none leading-relaxed"
              />
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
