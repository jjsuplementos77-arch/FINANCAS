
import React from 'react';
import { Tab } from '../types';

interface NavigationProps {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const Navigation: React.FC<NavigationProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="absolute bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 flex justify-around items-center h-20 px-4 z-40 transition-colors">
      <button 
        onClick={() => onTabChange(Tab.Inventory)}
        className={`flex flex-col items-center justify-center gap-1 w-20 py-1 transition-all rounded-xl ${activeTab === Tab.Inventory ? 'text-green-600' : 'text-slate-400 dark:text-slate-500'}`}
      >
        <div className={`p-1 rounded-lg ${activeTab === Tab.Inventory ? 'bg-green-100 dark:bg-green-900/30' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wide">Estoque</span>
      </button>
      
      <button 
        onClick={() => onTabChange(Tab.Sales)}
        className={`flex flex-col items-center justify-center gap-1 w-20 py-1 transition-all rounded-xl ${activeTab === Tab.Sales ? 'text-green-600' : 'text-slate-400 dark:text-slate-500'}`}
      >
        <div className={`p-1 rounded-lg ${activeTab === Tab.Sales ? 'bg-green-100 dark:bg-green-900/30' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wide">Vendas</span>
      </button>

      <button 
        onClick={() => onTabChange(Tab.Reports)}
        className={`flex flex-col items-center justify-center gap-1 w-20 py-1 transition-all rounded-xl ${activeTab === Tab.Reports ? 'text-green-600' : 'text-slate-400 dark:text-slate-500'}`}
      >
        <div className={`p-1 rounded-lg ${activeTab === Tab.Reports ? 'bg-green-100 dark:bg-green-900/30' : ''}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wide">Relatórios</span>
      </button>
    </nav>
  );
};

export default Navigation;
