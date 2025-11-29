import React from 'react';
import { Card } from './ui/Card';
import { Button } from './ui/button';
import { Sparkles, MessageSquare, StickyNote, GitBranch, Brain, Clock } from 'lucide-react';

interface SessaoIACardProps {
  sessao: any;
  expandida: boolean;
  onToggle: () => void;
}

export const SessaoIACard: React.FC<SessaoIACardProps> = ({ sessao, expandida, onToggle }) => {
  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    return `${mins} min`;
  };

  return (
    <Card className="p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-xl font-bold text-[#1E293B] mb-2">{sessao.titulo}</h3>
          <div className="flex items-center gap-4 text-sm text-[#64748B]">
            <span className="flex items-center gap-1">
              <Clock className="w-4 h-4" />
              {formatarTempo(sessao.tempo_em_sessao || 0)}
            </span>
            <span>{new Date(sessao.created_at).toLocaleDateString('pt-PT')}</span>
            {sessao.interacoes && sessao.interacoes.length > 0 && (
              <span className="flex items-center gap-1">
                <MessageSquare className="w-4 h-4" />
                {sessao.interacoes.length} interações
              </span>
            )}
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={onToggle}>
          {expandida ? 'Fechar' : 'Ver Detalhes'}
        </Button>
      </div>

      {expandida && (
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

          {sessao.versoes && sessao.versoes.length > 0 && (
            <div>
              <h4 className="font-semibold text-[#1E293B] mb-3 flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-[#3366FF]" />
                Versões Guardadas:
              </h4>
              <div className="space-y-2">
                {sessao.versoes.map((versao: any, idx: number) => (
                  <div key={idx} className="bg-[#F7FAFF] p-3 rounded-lg text-sm">
                    <div className="font-semibold text-[#1E293B] mb-1">
                      Versão {idx + 1} • {new Date(versao.timestamp).toLocaleString('pt-PT')}
                    </div>
                    <div className="text-[#64748B] text-xs">{versao.caracteres} caracteres</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
};
