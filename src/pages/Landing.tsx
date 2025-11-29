import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/Card';
import { BookOpen, Users, BarChart3, Lightbulb, Trophy, FileText, Brain, AlertCircle } from 'lucide-react';
import { isSupabaseConfigured } from '../lib/supabase';

export const Landing: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#F7FAFF]">
      {/* Config Warning Banner */}
      {!isSupabaseConfigured && (
        <div className="bg-amber-50 border-b border-amber-200 px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-3 text-amber-800">
            <AlertCircle className="w-5 h-5 flex-shrink-0" />
            <p className="text-sm">
              <strong>Modo de desenvolvimento:</strong> Configure VITE_database_URL e VITE_database_ANON_KEY para ativar autenticação.
            </p>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl lg:text-6xl font-bold text-[#1E293B] mb-6 leading-tight">
                MAF.Lab – Pensa devagar. Escreve com clareza.
              </h1>
              <p className="text-xl text-[#64748B] mb-8 leading-relaxed">
                Um laboratório gamificado onde estudantes, orientadores e investigadores constroem, em conjunto, escrita crítica, cultura e conhecimento.
              </p>
              <div className="flex gap-4">
                <Button size="lg" onClick={() => navigate('/login')}>
                  Entrar
                </Button>
                <Button size="lg" variant="secondary" onClick={() => navigate('/register')}>
                  Criar conta
                </Button>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://d64gsuwffb70l.cloudfront.net/69271b9a7a8ef9141cbbc623_1764172270082_65533d45.webp"
                alt="MAF.Lab Interface"
                className="w-full rounded-3xl shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Para quem é? */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#1E293B] text-center mb-16">Para quem é?</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="p-8">
              <BookOpen className="w-12 h-12 text-[#3366FF] mb-4" />
              <h3 className="text-2xl font-bold text-[#1E293B] mb-3">Estudante</h3>
              <p className="text-[#64748B]">
                Desenvolve pensamento crítico através de sessões guiadas, notas estruturadas e gamificação que torna o aprendizado envolvente.
              </p>
            </Card>
            <Card className="p-8">
              <Users className="w-12 h-12 text-[#3366FF] mb-4" />
              <h3 className="text-2xl font-bold text-[#1E293B] mb-3">Orientador / Investigador</h3>
              <p className="text-[#64748B]">
                Acompanha o progresso dos estudantes, oferece feedback estruturado e colabora com outros investigadores.
              </p>
            </Card>
            <Card className="p-8">
              <BarChart3 className="w-12 h-12 text-[#3366FF] mb-4" />
              <h3 className="text-2xl font-bold text-[#1E293B] mb-3">Docente</h3>
              <p className="text-[#64748B]">
                Acede a dados agregados, identifica padrões de aprendizagem e toma decisões baseadas em evidência.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Como funciona? */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-4xl font-bold text-[#1E293B] text-center mb-16">Como funciona?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="p-6">
              <Lightbulb className="w-10 h-10 text-[#3366FF] mb-3" />
              <h3 className="text-xl font-bold text-[#1E293B] mb-2">Sessões Críticas</h3>
              <p className="text-sm text-[#64748B]">
                Editor inteligente com perguntas reflexivas que guiam o pensamento lento e crítico.
              </p>
            </Card>
            <Card className="p-6">
              <Brain className="w-10 h-10 text-[#3366FF] mb-3" />
              <h3 className="text-xl font-bold text-[#1E293B] mb-2">Notas e Mapas Cognitivos</h3>
              <p className="text-sm text-[#64748B]">
                Organiza ideias em notas estruturadas e visualiza conexões conceituais.
              </p>
            </Card>
            <Card className="p-6">
              <Trophy className="w-10 h-10 text-[#3366FF] mb-3" />
              <h3 className="text-xl font-bold text-[#1E293B] mb-2">Gamificação</h3>
              <p className="text-sm text-[#64748B]">
                Ganha pontos, badges e sobe de nível enquanto desenvolves competências académicas.
              </p>
            </Card>
            <Card className="p-6">
              <FileText className="w-10 h-10 text-[#3366FF] mb-3" />
              <h3 className="text-xl font-bold text-[#1E293B] mb-2">Dados e Peer Review</h3>
              <p className="text-sm text-[#64748B]">
                Relatórios detalhados e sistema de revisão por pares para crescimento contínuo.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 py-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-bold text-[#1E293B] mb-4">MAF.Lab</h4>
              <p className="text-sm text-[#64748B]">
                Laboratório de escrita crítica e pensamento lento.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-[#1E293B] mb-4">Produto</h4>
              <ul className="space-y-2 text-sm text-[#64748B]">
                <li><a href="#" className="hover:text-[#3366FF]">Funcionalidades</a></li>
                <li><a href="#" className="hover:text-[#3366FF]">Preços</a></li>
                <li><a href="#" className="hover:text-[#3366FF]">FAQ</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1E293B] mb-4">Suporte</h4>
              <ul className="space-y-2 text-sm text-[#64748B]">
                <li><a href="#" className="hover:text-[#3366FF]">Documentação</a></li>
                <li><a href="#" className="hover:text-[#3366FF]">Contacto</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-[#1E293B] mb-4">Legal</h4>
              <ul className="space-y-2 text-sm text-[#64748B]">
                <li><a href="#" className="hover:text-[#3366FF]">Privacidade</a></li>
                <li><a href="#" className="hover:text-[#3366FF]">Termos</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-200 text-center text-sm text-[#64748B]">
            © 2025 MAF.Lab. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </div>
  );
};
