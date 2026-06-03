import { ReactNode, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useFinance } from '../context/FinanceContext';
import { useAuth } from '../hooks/useAuth';
import { MonthCarousel } from './MonthCarousel';
import {
  Home,
  CreditCard,
  PiggyBank,
  DollarSign,
  Menu,
  X,
  LogOut,
  Settings
} from 'lucide-react';
import { toast } from 'sonner';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const mainMenuItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/despesas-fixas', icon: CreditCard, label: 'Despesas' },
    { path: '/cartoes', icon: CreditCard, label: 'Cartões' },
    { path: '/gastos-variaveis', icon: DollarSign, label: 'Gastos' },
  ];

  const allMenuItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/despesas-fixas', label: 'Despesas Fixas' },
    { path: '/cartoes', label: 'Cartões' },
    { path: '/poupanca', label: 'Poupança' },
    { path: '/gastos-variaveis', label: 'Gastos Variáveis' },
    { path: '/relatorios', label: 'Relatórios' },
    { path: '/vencimentos', label: 'Vencimentos' },
    { path: '/configuracoes', label: 'Configurações' },
  ];

  const getPageTitle = () => {
    const currentPage = allMenuItems.find(item => item.path === location.pathname);
    return currentPage?.label || 'Controle Financeiro';
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success('Logout realizado com sucesso');
      navigate('/login');
    } catch (error) {
      toast.error('Erro ao fazer logout');
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Floating Menu Button */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="fixed top-4 left-4 z-30 p-3 bg-card/40 backdrop-blur-xl border border-border/50 rounded-2xl shadow-lg shadow-primary/10 hover:bg-card/60 transition-all duration-200 text-foreground"
      >
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Logout Button - Top Right */}
      <button
        onClick={handleLogout}
        disabled={isLoggingOut}
        className="fixed top-4 right-4 z-30 p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 rounded-2xl shadow-lg transition-all duration-200 text-red-600 hover:text-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        title="Logout"
      >
        <LogOut size={20} />
        <span className="text-sm font-medium hidden sm:inline">Sair</span>
      </button>

      {/* User Info - Top Center */}
      <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-30 text-center">
        <p className="text-xs text-muted-foreground">Conectado como</p>
        <p className="text-sm font-medium text-foreground truncate max-w-xs">{user?.email}</p>
      </div>

      {/* Header with Month Carousel */}
      <header className="sticky top-0 z-10">
        <MonthCarousel pageTitle={getPageTitle()} />
      </header>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="bg-card/95 backdrop-blur-xl border-b border-border/50 shadow-xl z-20">
          <nav className="px-4 py-2">
            {allMenuItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setMenuOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 rounded-2xl mb-1 transition-all duration-200 ${
                    isActive
                      ? 'bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/20'
                      : 'text-foreground hover:bg-accent'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            
            {/* Separator */}
            <div className="my-2 h-px bg-border/30" />

            {/* Settings Option */}
            <button
              onClick={() => {
                navigate('/configuracoes');
                setMenuOpen(false);
              }}
              className={`w-full text-left px-4 py-3 rounded-2xl mb-1 transition-all duration-200 flex items-center gap-2 ${
                location.pathname === '/configuracoes'
                  ? 'bg-primary text-primary-foreground font-medium shadow-lg shadow-primary/20'
                  : 'text-foreground hover:bg-accent'
              }`}
            >
              <Settings size={18} />
              Configurações
            </button>

            {/* Logout Option */}
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full text-left px-4 py-3 rounded-2xl mb-1 transition-all duration-200 flex items-center gap-2 text-red-600 hover:bg-red-500/10 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <LogOut size={18} />
              {isLoggingOut ? 'Saindo...' : 'Sair'}
            </button>
          </nav>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="p-4">
          {children}
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/40 backdrop-blur-xl border-t border-border/50 px-4 py-3 z-10 shadow-lg">
        <div className="flex justify-around items-center max-w-lg mx-auto">
          {mainMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex flex-col items-center gap-1 p-3 rounded-2xl transition-all duration-200 ${
                  isActive
                    ? 'text-primary-foreground bg-primary shadow-lg shadow-primary/30'
                    : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }`}
              >
                <Icon size={22} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
