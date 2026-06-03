# Supabase Setup Guide for Financas App

This guide will help you set up your Supabase database for the Financas App.

## Prerequisites

- Supabase account (free at [supabase.com](https://supabase.com))
- Your Supabase Project URL and Publishable Key (already in `.env`)

## Step 1: Access Supabase SQL Editor

1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**

## Step 2: Run the Migration

1. Copy the entire SQL migration from `supabase/migrations/001_create_finance_tables.sql`
2. Paste it into the SQL Editor
3. Click **Run** button (or press `Cmd/Ctrl + Enter`)

You should see a success message with "Success. No rows returned" at the bottom.

## Step 3: Verify Tables Created

1. Click **Table Editor** in the left sidebar
2. You should see these 6 new tables:
   - `despesas_fixas` (Fixed Expenses)
   - `cartoes` (Credit Cards)
   - `gastos_variaveis` (Variable Expenses)
   - `metas` (Savings Goals)
   - `salarios` (Salary)
   - `relatorios_exportados` (Exported Reports)

## Step 4: Enable Real-Time (Optional but Recommended)

1. In the left sidebar, go to **Database** → **Replication**
2. Find each table and toggle **Enable Realtime** for:
   - despesas_fixas
   - cartoes
   - gastos_variaveis
   - metas
   - salarios
   - relatorios_exportados

This enables real-time subscriptions so your app syncs instantly across devices.

## Step 5: Check Authentication

For the app to work properly, you need authentication set up:

1. Go to **Authentication** in the left sidebar
2. Click **Providers** and enable **Email** (already enabled by default)
3. Configure email settings if needed

## Step 6: Install Dependencies

Run in your project directory:

```bash
npm install @supabase/supabase-js
```

Your `.env` file should already have:

```
VITE_SUPABASE_URL=https://fektdlpxrelhiqxhiyar.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_LmwpRcBZLoVJb_vUICNHyA_uQkPTOAu
```

## Step 7: Test the Connection

The app will automatically:
- Fetch data from Supabase when you open it
- Subscribe to real-time changes
- Sync all CRUD operations to the database

## Data Structure

### despesas_fixas (Fixed Expenses)
```
- id: UUID (auto-generated)
- nome: Text (expense name)
- valor: Decimal (amount)
- vencimento: Text (due day)
- categoria: Text (category)
- mes_ano: Text (format: YYYY-MM)
- user_id: UUID (your user ID)
```

### cartoes (Credit Cards)
```
- id: UUID
- apelido: Text (nickname)
- bandeira: Text (card brand)
- valor: Decimal (balance)
- vencimento: Text (due day)
- mes_ano: Text (YYYY-MM)
- user_id: UUID
```

### gastos_variaveis (Variable Expenses)
```
- id: UUID
- nome: Text (expense name)
- valor: Decimal (amount)
- mes_ano: Text (YYYY-MM)
- user_id: UUID
```

### metas (Savings Goals)
```
- id: UUID
- descricao: Text (description)
- valor_total: Decimal (total target)
- valor_mensal: Decimal (monthly goal)
- mes_ano: Text (YYYY-MM)
- user_id: UUID
```

### salarios (Salary)
```
- id: UUID
- valor: Decimal (salary amount)
- mes_ano: Text (YYYY-MM)
- user_id: UUID
```

### relatorios_exportados (Exported Reports)
```
- id: UUID
- data_exportacao: Timestamp
- periodo: Text (period description)
- total_despesas: Decimal
- total_receitas: Decimal
- saldo: Decimal
- user_id: UUID
```

## Security Features

All tables have **Row Level Security (RLS)** enabled:
- Users can only see/edit/delete their own data
- `user_id` is automatically matched against `auth.users(id)`
- No cross-user data access possible

## Troubleshooting

### "user_id column not found" error
- Make sure you're authenticated before inserting data
- The app needs to know your user ID from Supabase Auth

### Real-time not working
- Check that Real-time is enabled for each table
- Make sure the subscription filters match your `mes_ano` format

### Permission denied errors
- Verify RLS policies are enabled
- Check that you're using the Supabase client from `utils/supabase.ts`
- Ensure authentication is working

## Next Steps

1. Set up Supabase Authentication (Email/Password, Google, etc.)
2. Update `FinanceContext` to use the `useSupabaseSync` hook
3. Create API functions for CRUD operations
4. Test the app with real Supabase data

For more help, check [Supabase Documentation](https://supabase.com/docs)
