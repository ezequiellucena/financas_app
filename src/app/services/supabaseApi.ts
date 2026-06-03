import { supabase } from '../../utils/supabase';
import { DespesaFixa, Cartao, GastoVariavel, Meta } from '../context/FinanceContext';

// ============ DESPESAS FIXAS ============

export async function createDespesaFixa(despesa: Omit<DespesaFixa, 'id'> & { mes_ano: string; user_id: string }) {
  const { data, error } = await supabase
    .from('despesas_fixas')
    .insert([{
      nome: despesa.nome,
      valor: despesa.valor,
      vencimento: despesa.vencimento,
      categoria: despesa.categoria,
      mes_ano: despesa.mes_ano,
      user_id: despesa.user_id,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateDespesaFixa(id: string, despesa: Partial<Omit<DespesaFixa, 'id'>>) {
  const { data, error } = await supabase
    .from('despesas_fixas')
    .update({
      nome: despesa.nome,
      valor: despesa.valor,
      vencimento: despesa.vencimento,
      categoria: despesa.categoria,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteDespesaFixa(id: string) {
  const { error } = await supabase
    .from('despesas_fixas')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getDespesasFixas(mesAno: string, userId: string) {
  const { data, error } = await supabase
    .from('despesas_fixas')
    .select('*')
    .eq('mes_ano', mesAno)
    .eq('user_id', userId)
    .order('vencimento', { ascending: true });

  if (error) throw error;
  return data || [];
}

// ============ CARTÕES ============

export async function createCartao(cartao: Omit<Cartao, 'id'> & { mes_ano: string; user_id: string }) {
  const { data, error } = await supabase
    .from('cartoes')
    .insert([{
      apelido: cartao.apelido,
      bandeira: cartao.bandeira,
      valor: cartao.valor,
      vencimento: cartao.vencimento,
      mes_ano: cartao.mes_ano,
      user_id: cartao.user_id,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateCartao(id: string, cartao: Partial<Omit<Cartao, 'id'>>) {
  const { data, error } = await supabase
    .from('cartoes')
    .update({
      apelido: cartao.apelido,
      bandeira: cartao.bandeira,
      valor: cartao.valor,
      vencimento: cartao.vencimento,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteCartao(id: string) {
  const { error } = await supabase
    .from('cartoes')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getCartoes(mesAno: string, userId: string) {
  const { data, error } = await supabase
    .from('cartoes')
    .select('*')
    .eq('mes_ano', mesAno)
    .eq('user_id', userId)
    .order('vencimento', { ascending: true });

  if (error) throw error;
  return data || [];
}

// ============ GASTOS VARIÁVEIS ============

export async function createGastoVariavel(gasto: Omit<GastoVariavel, 'id' | 'createdAt'> & { mes_ano: string; user_id: string }) {
  const { data, error } = await supabase
    .from('gastos_variaveis')
    .insert([{
      nome: gasto.nome,
      valor: gasto.valor,
      mes_ano: gasto.mes_ano,
      user_id: gasto.user_id,
    }])
    .select()
    .single();

  if (error) throw error;
  return {
    ...data,
    createdAt: new Date(data.created_at),
  };
}

export async function updateGastoVariavel(id: string, gasto: Partial<Omit<GastoVariavel, 'id' | 'createdAt'>>) {
  const { data, error } = await supabase
    .from('gastos_variaveis')
    .update({
      nome: gasto.nome,
      valor: gasto.valor,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return {
    ...data,
    createdAt: new Date(data.created_at),
  };
}

export async function deleteGastoVariavel(id: string) {
  const { error } = await supabase
    .from('gastos_variaveis')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getGastosVariaveis(mesAno: string, userId: string) {
  const { data, error } = await supabase
    .from('gastos_variaveis')
    .select('*')
    .eq('mes_ano', mesAno)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return (data || []).map(g => ({
    ...g,
    createdAt: new Date(g.created_at),
  }));
}

// ============ METAS ============

export async function createMeta(meta: Omit<Meta, 'id'> & { mes_ano: string; user_id: string }) {
  const { data, error } = await supabase
    .from('metas')
    .insert([{
      descricao: meta.descricao,
      valor_total: meta.valorTotal,
      valor_mensal: meta.valorMensal,
      mes_ano: meta.mes_ano,
      user_id: meta.user_id,
    }])
    .select()
    .single();

  if (error) throw error;
  return {
    ...data,
    valorTotal: data.valor_total,
    valorMensal: data.valor_mensal,
  };
}

export async function deleteMeta(id: string) {
  const { error } = await supabase
    .from('metas')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getMetas(mesAno: string, userId: string) {
  const { data, error } = await supabase
    .from('metas')
    .select('*')
    .eq('mes_ano', mesAno)
    .eq('user_id', userId);

  if (error) throw error;
  return (data || []).map(m => ({
    ...m,
    valorTotal: m.valor_total,
    valorMensal: m.valor_mensal,
  }));
}

// ============ SALÁRIO ============

export async function updateSalario(mesAno: string, userId: string, valor: number) {
  // First try to update existing
  const { data: existing, error: selectError } = await supabase
    .from('salarios')
    .select('*')
    .eq('mes_ano', mesAno)
    .eq('user_id', userId)
    .single();

  if (selectError && selectError.code !== 'PGRST116') { // PGRST116 = not found
    throw selectError;
  }

  if (existing) {
    // Update existing
    const { data, error } = await supabase
      .from('salarios')
      .update({ valor })
      .eq('id', existing.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  } else {
    // Create new
    const { data, error } = await supabase
      .from('salarios')
      .insert([{
        valor,
        mes_ano: mesAno,
        user_id: userId,
      }])
      .select()
      .single();

    if (error) throw error;
    return data;
  }
}

export async function getSalario(mesAno: string, userId: string) {
  const { data, error } = await supabase
    .from('salarios')
    .select('*')
    .eq('mes_ano', mesAno)
    .eq('user_id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = not found
    throw error;
  }

  return data?.valor || 0;
}

// ============ RELATÓRIOS ============

export async function createRelatorio(relatorio: {
  dataExportacao: Date;
  periodo: string;
  totalDespesas: number;
  totalReceitas: number;
  saldo: number;
  userId: string;
}) {
  const { data, error } = await supabase
    .from('relatorios_exportados')
    .insert([{
      data_exportacao: relatorio.dataExportacao.toISOString(),
      periodo: relatorio.periodo,
      total_despesas: relatorio.totalDespesas,
      total_receitas: relatorio.totalReceitas,
      saldo: relatorio.saldo,
      user_id: relatorio.userId,
    }])
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getRelatorios(userId: string) {
  const { data, error } = await supabase
    .from('relatorios_exportados')
    .select('*')
    .eq('user_id', userId)
    .order('data_exportacao', { ascending: false });

  if (error) throw error;
  return data || [];
}

export async function deleteRelatorio(id: string) {
  const { error } = await supabase
    .from('relatorios_exportados')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
