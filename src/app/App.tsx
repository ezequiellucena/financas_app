import { BrowserRouter, Routes, Route } from 'react-router';
import { Toaster } from 'sonner';
import { FinanceProvider } from './context/FinanceContext';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { DespesasFixas } from './components/DespesasFixas';
import { Cartoes } from './components/Cartoes';
import { Poupanca } from './components/Poupanca';
import { GastosVariaveis } from './components/GastosVariaveis';
import { Relatorios } from './components/Relatorios';
import { Vencimentos } from './components/Vencimentos';
import { Configuracoes } from './components/Configuracoes';
import { Ajuda } from './components/Ajuda';

function AppRoutes() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/despesas-fixas" element={<DespesasFixas />} />
          <Route path="/cartoes" element={<Cartoes />} />
          <Route path="/poupanca" element={<Poupanca />} />
          <Route path="/gastos-variaveis" element={<GastosVariaveis />} />
          <Route path="/relatorios" element={<Relatorios />} />
          <Route path="/vencimentos" element={<Vencimentos />} />
          <Route path="/configuracoes" element={<Configuracoes />} />
          <Route path="/ajuda" element={<Ajuda />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <FinanceProvider>
      <div className="min-h-screen bg-[#f5f5f5]">
        <AppRoutes />
        <Toaster position="top-center" theme="light" />
      </div>
    </FinanceProvider>
  );
}