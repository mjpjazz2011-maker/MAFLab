import { supabase, isSupabaseConfigured } from "./supabase";

export interface User {
  id: string;
  email: string;
  user_metadata: {
    tipo?: 'estudante' | 'orientador' | 'docente' | 'admin';
    nome?: string;
    ciclo?: string;
    area_especialidade?: string;
  };
}

export async function getCurrentUser(): Promise<User | null> {
  if (!isSupabaseConfigured) return null;

  // Obter o utilizador diretamente (mais fiável que getSession, especialmente no Safari)
  const { data, error } = await supabase.auth.getUser();

  if (error || !data?.user) return null;

  return {
    id: data.user.id,
    email: data.user.email ?? "",
    user_metadata: data.user.user_metadata ?? {}
  };
}

export async function login(email: string, password: string): Promise<User | null> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não está configurado. Configure as variáveis de ambiente.');
  }

  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('Utilizador não encontrado');

  return {
    id: data.user.id,
    email: data.user.email ?? "",
    user_metadata: data.user.user_metadata ?? {}
  };
}

export async function register(email: string, password: string, metadata: any): Promise<User | null> {
  if (!isSupabaseConfigured) {
    throw new Error('Supabase não está configurado. Configure as variáveis de ambiente.');
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: metadata }
  });

  if (error) throw new Error(error.message);
  if (!data.user) throw new Error('Erro ao criar utilizador');

  return {
    id: data.user.id,
    email: data.user.email ?? "",
    user_metadata: data.user.user_metadata ?? {}
  };
}

export async function logout() {
  await supabase.auth.signOut();
}
