import { useEffect, useCallback } from 'react';
import { supabase } from '../../utils/supabase';
import { DespesaFixa, Cartao, GastoVariavel, Meta } from '../context/FinanceContext';

export function useSupabaseSync(
  mesAtualSelecionado: string,
  onDespesasFixasUpdate: (despesas: DespesaFixa[]) => void,
  onCartoesUpdate: (cartoes: Cartao[]) => void,
  onGastosVariaveisUpdate: (gastos: GastoVariavel[]) => void,
  onMetasUpdate: (metas: Meta[]) => void
) {
  // Fetch despesas fixas
  const fetchDespesasFixas = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('despesas_fixas')
        .select('*')
        .eq('mes_ano', mesAtualSelecionado);

      if (error) throw error;
      if (data) {
        onDespesasFixasUpdate(
          data.map((d: any) => ({
            id: d.id,
            nome: d.nome,
            valor: d.valor,
            vencimento: d.vencimento,
            categoria: d.categoria,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching despesas fixas:', error);
    }
  }, [mesAtualSelecionado, onDespesasFixasUpdate]);

  // Fetch cartões
  const fetchCartoes = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('cartoes')
        .select('*')
        .eq('mes_ano', mesAtualSelecionado);

      if (error) throw error;
      if (data) {
        onCartoesUpdate(
          data.map((c: any) => ({
            id: c.id,
            apelido: c.apelido,
            bandeira: c.bandeira,
            valor: c.valor,
            vencimento: c.vencimento,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching cartões:', error);
    }
  }, [mesAtualSelecionado, onCartoesUpdate]);

  // Fetch gastos variáveis
  const fetchGastosVariaveis = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('gastos_variaveis')
        .select('*')
        .eq('mes_ano', mesAtualSelecionado)
        .order('created_at', { ascending: false });

      if (error) throw error;
      if (data) {
        onGastosVariaveisUpdate(
          data.map((g: any) => ({
            id: g.id,
            nome: g.nome,
            valor: g.valor,
            createdAt: new Date(g.created_at),
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching gastos variáveis:', error);
    }
  }, [mesAtualSelecionado, onGastosVariaveisUpdate]);

  // Fetch metas
  const fetchMetas = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('metas')
        .select('*')
        .eq('mes_ano', mesAtualSelecionado);

      if (error) throw error;
      if (data) {
        onMetasUpdate(
          data.map((m: any) => ({
            id: m.id,
            descricao: m.descricao,
            valorTotal: m.valor_total,
            valorMensal: m.valor_mensal,
          }))
        );
      }
    } catch (error) {
      console.error('Error fetching metas:', error);
    }
  }, [mesAtualSelecionado, onMetasUpdate]);

  // Subscribe to real-time updates
  useEffect(() => {
    fetchDespesasFixas();
    fetchCartoes();
    fetchGastosVariaveis();
    fetchMetas();

    // Real-time subscriptions
    const despesasChannel = supabase
      .channel(`despesas_fixas:mes_ano=eq.${mesAtualSelecionado}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'despesas_fixas',
          filter: `mes_ano=eq.${mesAtualSelecionado}`,
        },
        () => fetchDespesasFixas()
      )
      .subscribe();

    const cartoesChannel = supabase
      .channel(`cartoes:mes_ano=eq.${mesAtualSelecionado}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'cartoes',
          filter: `mes_ano=eq.${mesAtualSelecionado}`,
        },
        () => fetchCartoes()
      )
      .subscribe();

    const gastosChannel = supabase
      .channel(`gastos_variaveis:mes_ano=eq.${mesAtualSelecionado}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'gastos_variaveis',
          filter: `mes_ano=eq.${mesAtualSelecionado}`,
        },
        () => fetchGastosVariaveis()
      )
      .subscribe();

    const metasChannel = supabase
      .channel(`metas:mes_ano=eq.${mesAtualSelecionado}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'metas',
          filter: `mes_ano=eq.${mesAtualSelecionado}`,
        },
        () => fetchMetas()
      )
      .subscribe();

    return () => {
      despesasChannel.unsubscribe();
      cartoesChannel.unsubscribe();
      gastosChannel.unsubscribe();
      metasChannel.unsubscribe();
    };
  }, [mesAtualSelecionado, fetchDespesasFixas, fetchCartoes, fetchGastosVariaveis, fetchMetas]);

  return {
    fetchDespesasFixas,
    fetchCartoes,
    fetchGastosVariaveis,
    fetchMetas,
  };
}
