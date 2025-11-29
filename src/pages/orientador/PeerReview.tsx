import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/button';
import { Users, UserPlus, FileText, Target, Mail } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { getCurrentUser } from '../../lib/auth';

export const PeerReview: React.FC = () => {
  const [trabalhos, setTrabalhos] = useState<any[]>([]);

  useEffect(() => {
    loadTrabalhos();
  }, []);

  const loadTrabalhos = async () => {
    const user = await getCurrentUser();
    if (!user) return;

    const { data } = await supabase
      .from('peer_review_trabalhos')
      .select(`
        *,
        estudante:estudante_id (nome, email)
      `)
      .eq('orientador_id', user.id)
      .order('created_at', { ascending: false });

    if (data) setTrabalhos(data);
  };

  const sidebarItems = [
    { path: '/orientador', label: 'Dashboard', icon: <Target className="w-5 h-5" /> },
    { path: '/orientador/estudantes', label: 'Estudantes', icon: <Users className="w-5 h-5" /> },
    { path: '/orientador/convites', label: 'Convites', icon: <Mail className="w-5 h-5" /> },
    { path: '/orientador/peer-review', label: 'Peer Review', icon: <FileText className="w-5 h-5" /> }
  ];

  return (
    <div className="flex min-h-screen bg-[#F7FAFF]">
      <Sidebar items={sidebarItems} />
      
      <div className="ml-64 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[#1E293B] mb-8">Peer Review</h1>

          <div className="space-y-4">
            {trabalhos.map(trabalho => (
              <Card key={trabalho.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#1E293B] mb-2">{trabalho.titulo}</h3>
                    <p className="text-sm text-[#64748B] mb-2">
                      Estudante: {trabalho.estudante?.nome}
                    </p>
                    <p className="text-sm text-[#64748B]">
                      Submetido em {new Date(trabalho.created_at).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                      trabalho.status === 'concluido' ? 'bg-green-100 text-green-700' :
                      trabalho.status === 'em_revisao' ? 'bg-blue-100 text-blue-700' :
                      'bg-gray-100 text-gray-700'
                    }`}>
                      {trabalho.status}
                    </span>
                    <Button size="sm">Ver Detalhes</Button>
                  </div>
                </div>
              </Card>
            ))}

            {trabalhos.length === 0 && (
              <Card className="p-12 text-center">
                <FileText className="w-16 h-16 text-[#64748B] mx-auto mb-4" />
                <p className="text-[#64748B]">Ainda não há trabalhos para revisão</p>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
