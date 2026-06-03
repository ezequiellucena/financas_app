-- Despesas Fixas (Fixed Expenses)
CREATE TABLE despesas_fixas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  vencimento TEXT NOT NULL,
  categoria TEXT NOT NULL,
  mes_ano TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cartões de Crédito (Credit Cards)
CREATE TABLE cartoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  apelido TEXT NOT NULL,
  bandeira TEXT NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  vencimento TEXT NOT NULL,
  mes_ano TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Gastos Variáveis (Variable Expenses)
CREATE TABLE gastos_variaveis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT NOT NULL,
  valor DECIMAL(10, 2) NOT NULL,
  mes_ano TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Metas (Savings Goals)
CREATE TABLE metas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  descricao TEXT NOT NULL,
  valor_total DECIMAL(10, 2) NOT NULL,
  valor_mensal DECIMAL(10, 2) NOT NULL,
  mes_ano TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Salário (Salary)
CREATE TABLE salarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  valor DECIMAL(10, 2) NOT NULL,
  mes_ano TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Relatórios Exportados (Exported Reports)
CREATE TABLE relatorios_exportados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  data_exportacao TIMESTAMP WITH TIME ZONE NOT NULL,
  periodo TEXT NOT NULL,
  total_despesas DECIMAL(10, 2) NOT NULL,
  total_receitas DECIMAL(10, 2) NOT NULL,
  saldo DECIMAL(10, 2) NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_despesas_fixas_mes_ano ON despesas_fixas(mes_ano);
CREATE INDEX idx_despesas_fixas_user_id ON despesas_fixas(user_id);
CREATE INDEX idx_cartoes_mes_ano ON cartoes(mes_ano);
CREATE INDEX idx_cartoes_user_id ON cartoes(user_id);
CREATE INDEX idx_gastos_variaveis_mes_ano ON gastos_variaveis(mes_ano);
CREATE INDEX idx_gastos_variaveis_user_id ON gastos_variaveis(user_id);
CREATE INDEX idx_metas_mes_ano ON metas(mes_ano);
CREATE INDEX idx_metas_user_id ON metas(user_id);
CREATE INDEX idx_salarios_mes_ano ON salarios(mes_ano);
CREATE INDEX idx_salarios_user_id ON salarios(user_id);
CREATE INDEX idx_relatorios_user_id ON relatorios_exportados(user_id);

-- Enable Real-Time subscriptions
ALTER TABLE despesas_fixas REPLICA IDENTITY FULL;
ALTER TABLE cartoes REPLICA IDENTITY FULL;
ALTER TABLE gastos_variaveis REPLICA IDENTITY FULL;
ALTER TABLE metas REPLICA IDENTITY FULL;
ALTER TABLE salarios REPLICA IDENTITY FULL;
ALTER TABLE relatorios_exportados REPLICA IDENTITY FULL;

-- Row Level Security Policies
ALTER TABLE despesas_fixas ENABLE ROW LEVEL SECURITY;
ALTER TABLE cartoes ENABLE ROW LEVEL SECURITY;
ALTER TABLE gastos_variaveis ENABLE ROW LEVEL SECURITY;
ALTER TABLE metas ENABLE ROW LEVEL SECURITY;
ALTER TABLE salarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE relatorios_exportados ENABLE ROW LEVEL SECURITY;

-- Despesas Fixas RLS
CREATE POLICY "Users can view their own despesas_fixas" ON despesas_fixas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own despesas_fixas" ON despesas_fixas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own despesas_fixas" ON despesas_fixas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own despesas_fixas" ON despesas_fixas
  FOR DELETE USING (auth.uid() = user_id);

-- Cartões RLS
CREATE POLICY "Users can view their own cartoes" ON cartoes
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own cartoes" ON cartoes
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cartoes" ON cartoes
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own cartoes" ON cartoes
  FOR DELETE USING (auth.uid() = user_id);

-- Gastos Variáveis RLS
CREATE POLICY "Users can view their own gastos_variaveis" ON gastos_variaveis
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own gastos_variaveis" ON gastos_variaveis
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own gastos_variaveis" ON gastos_variaveis
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own gastos_variaveis" ON gastos_variaveis
  FOR DELETE USING (auth.uid() = user_id);

-- Metas RLS
CREATE POLICY "Users can view their own metas" ON metas
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own metas" ON metas
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own metas" ON metas
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own metas" ON metas
  FOR DELETE USING (auth.uid() = user_id);

-- Salários RLS
CREATE POLICY "Users can view their own salarios" ON salarios
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own salarios" ON salarios
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own salarios" ON salarios
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own salarios" ON salarios
  FOR DELETE USING (auth.uid() = user_id);

-- Relatórios RLS
CREATE POLICY "Users can view their own relatorios" ON relatorios_exportados
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own relatorios" ON relatorios_exportados
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own relatorios" ON relatorios_exportados
  FOR DELETE USING (auth.uid() = user_id);
