import { supabase, isSupabaseConfigured } from './supabase';

// Point values for different actions
export const PONTOS = {
  INICIAR_SESSAO: 10,
  FEEDBACK_IA: 20,
  GUARDAR_SESSAO: 30,
  SALVAR_VERSAO: 5,
  REFLEXAO: 15
};

// Calculate level based on total points
export function calcularNivel(pontosTotais: number): number {
  return Math.floor(pontosTotais / 100) + 1;
}

// Award points to a user
export async function atribuirPontos(userId: string, pontos: number): Promise<boolean> {
  if (!isSupabaseConfigured) {
    console.warn('Supabase not configured - skipping gamification');
    return false;
  }

  try {
    const { data: current, error: fetchError } = await supabase
      .from('gamificacao_pontos')
      .select('*')
      .eq('user_id', userId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      console.error('Error fetching points:', fetchError);
      return false;
    }

    const novosPontos = (current?.pontos_totais || 0) + pontos;
    const novoNivel = calcularNivel(novosPontos);

    if (current) {
      const { error: updateError } = await supabase
        .from('gamificacao_pontos')
        .update({
          pontos_totais: novosPontos,
          nivel: novoNivel,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId);

      if (updateError) {
        console.error('Error updating points:', updateError);
        return false;
      }
    } else {
      const { error: insertError } = await supabase
        .from('gamificacao_pontos')
        .insert({
          user_id: userId,
          pontos_totais: novosPontos,
          nivel: novoNivel
        });

      if (insertError) {
        console.error('Error inserting points:', insertError);
        return false;
      }
    }

    return true;
  } catch (error) {
    console.error('Error in atribuirPontos:', error);
    return false;
  }
}
