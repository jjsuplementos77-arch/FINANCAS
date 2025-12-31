
import React, { useState } from 'react';
import { Sale, Product } from '../types';
import SaleModal from './SaleModal';
import { PAYMENT_METHODS } from '../constants';

interface SalesTabProps {
  sales: Sale[];
  products: Product[];
  onRegisterSale: (sale: Sale) => void;
  onUpdateSale: (sale: Sale) => void;
  onDeleteSale: (id: string) => void;
}

const SalesTab: React.FC<SalesTabProps> = ({ sales, products, onRegisterSale, onUpdateSale, onDeleteSale }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSale, setEditingSale] = useState<Sale | null>(null);

  const sortedSales = [...sales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleOpenEdit = (sale: Sale) => {
    setEditingSale(sale);
    setIsModalOpen(true);
  };

  const handleOpenNew = () => {
    setEditingSale(null);
    setIsModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    onDeleteSale(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Vendas</h2>
          <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">{sales.length} registros no mês</p>
        </div>
        <button 
          onClick={handleOpenNew}
          className="bg-green-600 hover:bg-green-700 text-white font-black py-2.5 px-5 rounded-2xl shadow-lg shadow-green-100 dark:shadow-green-900/20 transition-transform active:scale-95 flex items-center gap-2 text-sm"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z" />
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd" />
          </svg>
          Vender
        </button>
      </div>

      <div className="space-y-3">
        {sortedSales.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-slate-300 dark:text-slate-700 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <p className="font-bold text-slate-400 dark:text-slate-500">Nenhuma venda encontrada</p>
          </div>
        ) : (
          sortedSales.map(sale => (
            <div 
              key={sale.id} 
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center justify-between group active:bg-slate-50 dark:active:bg-slate-800 transition-colors"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className="w-10 h-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center flex-shrink-0 text-slate-400 dark:text-slate-600 border border-slate-100 dark:border-slate-800">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 truncate text-sm leading-tight">{sale.productName}</h4>
                  <div className="flex items-center gap-1.5 text-[9px] mt-1 font-bold uppercase tracking-tight">
                    <span className="text-slate-400 dark:text-slate-500">{new Date(sale.date).toLocaleDateString('pt-BR')}</span>
                    <span className="w-1 h-1 bg-slate-200 dark:bg-slate-700 rounded-full"></span>
                    <span className="text-slate-400 dark:text-slate-500 truncate max-w-[80px]">{sale.customerName || 'Avulso'}</span>
                    <span className={`px-1.5 py-0.5 rounded-md ${PAYMENT_METHODS.find(pm => pm.value === sale.paymentMethod)?.color.replace('bg-', 'dark:bg-opacity-20 bg-')} dark:text-opacity-90`}>
                      {sale.paymentMethod}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <div className="font-black text-green-600 dark:text-green-500 text-sm">R$ {sale.totalPrice.toFixed(2)}</div>
                  <div className="text-[9px] font-bold text-slate-300 dark:text-slate-600 uppercase">{sale.quantity} un.</div>
                </div>
                <div className="flex flex-col gap-1">
                  <button 
                    onClick={() => handleOpenEdit(sale)}
                    className="p-2 text-slate-300 dark:text-slate-600 hover:text-blue-500 dark:hover:text-blue-400 transition-colors bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                  </button>
                  <button 
                    onClick={(e) => handleDelete(e, sale.id)}
                    className="p-2 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors bg-slate-50 dark:bg-slate-800 rounded-lg"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <SaleModal 
          products={products}
          saleToEdit={editingSale}
          onSave={(s) => {
            if (editingSale) onUpdateSale(s);
            else onRegisterSale(s);
            setIsModalOpen(false);
          }}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
};

export default SalesTab;
