import React, { useEffect, useState } from 'react';
import { Sidebar } from '../../components/Sidebar';
import { Card } from '../../components/ui/Card';
import { Input } from '../../components/ui/Input';
import { Users, FileText, BarChart3, Settings, Target, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const AdminUtilizadores: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  useEffect(() => {
    loadUsers();
  }, []);

  useEffect(() => {
    let filtered = users;
    
    if (filterType !== 'all') {
      filtered = filtered.filter(u => u.tipo_utilizador === filterType);
    }
    
    if (searchTerm) {
      filtered = filtered.filter(u => 
        u.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredUsers(filtered);
  }, [users, searchTerm, filterType]);

  const loadUsers = async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false });

    if (data) {
      setUsers(data);
      setFilteredUsers(data);
    }
  };

  const sidebarItems = [
    { path: '/admin', label: 'Dashboard', icon: <Target className="w-5 h-5" /> },
    { path: '/admin/utilizadores', label: 'Utilizadores', icon: <Users className="w-5 h-5" /> },
    { path: '/admin/relatorios', label: 'Relatórios', icon: <FileText className="w-5 h-5" /> },
    { path: '/admin/analytics', label: 'Analytics', icon: <BarChart3 className="w-5 h-5" /> },
    { path: '/admin/configuracao', label: 'Configuração', icon: <Settings className="w-5 h-5" /> }
  ];

  return (
    <div className="flex min-h-screen bg-[#F7FAFF]">
      <Sidebar items={sidebarItems} />
      
      <div className="ml-64 flex-1 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-[#1E293B] mb-8">Gestão de Utilizadores</h1>

          <Card className="p-6 mb-6">
            <div className="flex gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="w-5 h-5 absolute left-3 top-3 text-[#64748B]" />
                  <input
                    type="text"
                    placeholder="Pesquisar por nome ou email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-[#F6F8FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3366FF]"
                  />
                </div>
              </div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-3 bg-[#F6F8FA] rounded-xl focus:outline-none focus:ring-2 focus:ring-[#3366FF]"
              >
                <option value="all">Todos</option>
                <option value="estudante">Estudantes</option>
                <option value="orientador">Orientadores</option>
                <option value="docente">Docentes</option>
                <option value="admin">Admins</option>
              </select>
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-3">
              {filteredUsers.map(user => (
                <div key={user.id} className="flex items-center justify-between p-4 bg-[#F7FAFF] rounded-xl">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#3366FF] to-[#2952CC] flex items-center justify-center text-white font-bold">
                      {user.nome.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-[#1E293B]">{user.nome}</p>
                      <p className="text-sm text-[#64748B]">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-[#3366FF] text-white">
                      {user.tipo_utilizador}
                    </span>
                    <p className="text-xs text-[#64748B] mt-1">
                      {new Date(user.created_at).toLocaleDateString('pt-PT')}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
