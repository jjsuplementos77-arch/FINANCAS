
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Tab, Product, Sale, ActivityLog } from './types';
import InventoryTab from './components/InventoryTab';
import SalesTab from './components/SalesTab';
import ReportsTab from './components/ReportsTab';
import Navigation from './components/Navigation';
import SettingsModal from './components/SettingsModal';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<Tab>(Tab.Inventory);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [logs, setLogs] = useState<ActivityLog[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<number>(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState<number>(new Date().getFullYear());
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'saving' | 'synced'>('synced');
  const [isFirstOpen, setIsFirstOpen] = useState(false);
  
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('gestao_pro_theme');
    return savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });

  const currentYear = new Date().getFullYear();
  const years = useMemo(() => {
    const startYear = 2024;
    const endYear = currentYear + 1;
    const list = [];
    for (let i = startYear; i <= endYear; i++) {
      list.push(i);
    }
    return list;
  }, [currentYear]);

  // Carregamento inicial (Memória Permanente)
  useEffect(() => {
    const savedProducts = localStorage.getItem('gestao_pro_products');
    const savedSales = localStorage.getItem('gestao_pro_sales');
    const savedLogs = localStorage.getItem('gestao_pro_logs');
    const hasConfigured = localStorage.getItem('gestao_pro_configured');

    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedSales) setSales(JSON.parse(savedSales));
    if (savedLogs) setLogs(JSON.parse(savedLogs));
    
    if (!hasConfigured) {
      setIsFirstOpen(true);
      setIsSettingsOpen(true);
      localStorage.setItem('gestao_pro_configured', 'true');
    }
  }, []);

  // Efeito de Tema
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('gestao_pro_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('gestao_pro_theme', 'light');
    }
  }, [isDarkMode]);

  // Persistência em Tempo Real
  useEffect(() => {
    setSyncStatus('saving');
    localStorage.setItem('gestao_pro_products', JSON.stringify(products));
    localStorage.setItem('gestao_pro_sales', JSON.stringify(sales));
    localStorage.setItem('gestao_pro_logs', JSON.stringify(logs));
    
    const timer = setTimeout(() => setSyncStatus('synced'), 500);
    return () => clearTimeout(timer);
  }, [products, sales, logs]);

  const addLog = (action: string, type: ActivityLog['type']) => {
    const newLog: ActivityLog = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      action,
      type
    };
    setLogs(prev => [newLog, ...prev].slice(0, 50)); // Mantém os 50 últimos logs
  };

  const addProduct = (product: Product) => {
    setProducts(prev => [...prev, product]);
    addLog(`Produto "${product.name}" cadastrado com estoque ${product.stock}`, 'product');
  };

  const updateProduct = (updatedProduct: Product) => {
    setProducts(prev => prev.map(p => p.id === updatedProduct.id ? updatedProduct : p));
    addLog(`Produto "${updatedProduct.name}" atualizado`, 'product');
  };

  const deleteProduct = (id: string) => {
    const product = products.find(p => p.id === id);
    if (confirm(`Deseja excluir "${product?.name}"?`)) {
      setProducts(prev => prev.filter(p => p.id !== id));
      addLog(`Produto "${product?.name}" excluído`, 'product');
    }
  };

  const registerSale = (sale: Sale) => {
    setSales(prev => [...prev, sale]);
    setProducts(prev => prev.map(p => {
      if (p.id === sale.productId) {
        return { ...p, stock: Math.max(0, p.stock - sale.quantity) };
      }
      return p;
    }));
    addLog(`Venda de ${sale.quantity}x "${sale.productName}" realizada (R$ ${sale.totalPrice.toFixed(2)})`, 'sale');
  };

  const updateSale = (updatedSale: Sale) => {
    const oldSale = sales.find(s => s.id === updatedSale.id);
    if (!oldSale) return;
    setProducts(prev => prev.map(p => {
      let newStock = p.stock;
      if (p.id === oldSale.productId) newStock += oldSale.quantity;
      if (p.id === updatedSale.productId) newStock -= updatedSale.quantity;
      return { ...p, stock: Math.max(0, newStock) };
    }));
    setSales(prev => prev.map(s => s.id === updatedSale.id ? updatedSale : s));
    addLog(`Venda de "${updatedSale.productName}" editada`, 'sale');
  };

  const deleteSale = (id: string) => {
    const sale = sales.find(s => s.id === id);
    if (!sale) return;
    if (confirm('Deseja cancelar esta venda? O estoque será devolvido.')) {
      setSales(prev => prev.filter(s => s.id !== id));
      setProducts(prev => prev.map(p => {
        if (p.id === sale.productId) return { ...p, stock: p.stock + sale.quantity };
        return p;
      }));
      addLog(`Venda de "${sale.productName}" cancelada`, 'sale');
    }
  };

  const filteredSales = useMemo(() => {
    return sales.filter(sale => {
      const saleDate = new Date(sale.date);
      return saleDate.getMonth() === selectedMonth && saleDate.getFullYear() === selectedYear;
    });
  }, [sales, selectedMonth, selectedYear]);

  const handleImport = (data: { products: Product[], sales: Sale[], logs?: ActivityLog[] }) => {
    setProducts(data.products);
    setSales(data.sales);
    if (data.logs) setLogs(data.logs);
    addLog(`Banco de dados restaurado via importação`, 'system');
  };

  return (
    <div className="w-full max-w-[480px] bg-slate-50 dark:bg-slate-950 min-h-screen shadow-2xl flex flex-col relative overflow-x-hidden transition-colors duration-300">
      <header className="bg-white dark:bg-slate-900 px-5 py-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 z-30 flex flex-col gap-3 shrink-0 transition-colors">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="bg-green-600 text-white p-1.5 rounded-lg text-lg shadow-lg shadow-green-500/20">📊</div>
            <div className="flex flex-col">
              <h1 className="font-bold text-lg text-slate-800 dark:text-slate-100 tracking-tight leading-none">Gestão Pro</h1>
              <div className="flex items-center gap-1 mt-1">
                <div className={`w-1.5 h-1.5 rounded-full ${syncStatus === 'saving' ? 'bg-blue-500 animate-pulse' : 'bg-green-500'}`}></div>
                <span className="text-[8px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-tighter">
                  {syncStatus === 'saving' ? 'Gravando dados...' : 'Memória Sincronizada'}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setIsSettingsOpen(true)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              {isDarkMode ? '☀️' : '🌙'}
            </button>
          </div>
        </div>
        
        <div className="flex gap-2">
           <select 
            className="flex-1 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 rounded-xl px-3 py-2 text-[11px] font-bold outline-none border border-transparent focus:border-green-500"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(Number(e.target.value))}
          >
            {['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map((m, i) => (
              <option key={i} value={i}>{m}</option>
            ))}
          </select>
          <select 
            className="flex-1 bg-slate-100 dark:bg-slate-800 dark:text-slate-300 rounded-xl px-3 py-2 text-[11px] font-bold outline-none border border-transparent focus:border-green-500"
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
          >
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto pb-28 px-5 pt-6 no-scrollbar">
        {activeTab === Tab.Inventory && (
          <InventoryTab products={products} onAdd={addProduct} onUpdate={updateProduct} onDelete={deleteProduct} />
        )}
        {activeTab === Tab.Sales && (
          <SalesTab sales={filteredSales} products={products} onRegisterSale={registerSale} onUpdateSale={updateSale} onDeleteSale={deleteSale} />
        )}
        {activeTab === Tab.Reports && (
          <ReportsTab allSales={sales} logs={logs} month={selectedMonth} year={selectedYear} />
        )}
      </main>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {isSettingsOpen && (
        <SettingsModal 
          onClose={() => { setIsSettingsOpen(false); setIsFirstOpen(false); }} 
          products={products}
          sales={sales}
          logs={logs}
          isFirstOpen={isFirstOpen}
          onImport={handleImport}
        />
      )}
    </div>
  );
};

export default App;
