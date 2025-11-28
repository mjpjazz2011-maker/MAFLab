import React, { useState, useEffect } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/button';
import { BookOpen, FileText, Brain, Upload as UploadIcon, Trophy, BarChart3, Settings, Target, File } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/auth';

export const Uploads: React.FC = () => {
  const [uploads, setUploads] = useState<any[]>([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadUploads();
  }, []);

  const loadUploads = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    const { data } = await supabase
      .from('uploads')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setUploads(data);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const user = await getCurrentUser();
    if (!user) return;

    const fileName = `${user.id}/${Date.now()}_${file.name}`;
    const { data: uploadData, error } = await supabase.storage
      .from('uploads')
      .upload(fileName, file);

    if (!error && uploadData) {
      const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(fileName);
      
      await supabase.from('uploads').insert({
        user_id: user.id,
        nome_arquivo: file.name,
        tipo_arquivo: file.type,
        url: urlData.publicUrl,
        tamanho: file.size
      });

      loadUploads();
    }

    setUploading(false);
  };

  const sidebarItems = [
    { path: '/estudante', label: 'Dashboard', icon: <Target className="w-5 h-5" /> },
    { path: '/sessao-critica', label: 'Sessão Crítica', icon: <BookOpen className="w-5 h-5" /> },
    { path: '/notas', label: 'Notas', icon: <FileText className="w-5 h-5" /> },
    { path: '/mapa-cognitivo', label: 'Mapa Cognitivo', icon: <Brain className="w-5 h-5" /> },
    { path: '/uploads', label: 'Uploads', icon: <UploadIcon className="w-5 h-5" /> },
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
              <h1 className="text-3xl font-bold text-[#1E293B]">Uploads</h1>
              <p className="text-[#64748B]">Gere os teus ficheiros</p>
            </div>
            <label>
              <input type="file" onChange={handleFileUpload} className="hidden" />
              <Button as="span" disabled={uploading}>
                <UploadIcon className="w-5 h-5 mr-2" />
                {uploading ? 'A carregar...' : 'Upload Ficheiro'}
              </Button>
            </label>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {uploads.map(upload => (
              <Card key={upload.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-[#F7FAFF] flex items-center justify-center flex-shrink-0">
                    <File className="w-6 h-6 text-[#3366FF]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-[#1E293B] truncate">{upload.nome_arquivo}</p>
                    <p className="text-sm text-[#64748B] mt-1">
                      {new Date(upload.created_at).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {uploads.length === 0 && (
            <Card className="p-12 text-center">
              <UploadIcon className="w-16 h-16 text-[#64748B] mx-auto mb-4" />
              <p className="text-[#64748B]">Ainda não tens ficheiros. Faz o upload do primeiro!</p>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};
