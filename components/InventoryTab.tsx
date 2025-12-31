
import React, { useState } from 'react';
import { Product } from '../types';
import ProductModal from './ProductModal';

interface InventoryTabProps {
  products: Product[];
  onAdd: (product: Product) => void;
  onUpdate: (product: Product) => void;
  onDelete: (id: string) => void;
}

const InventoryTab: React.FC<InventoryTabProps> = ({ products, onAdd, onUpdate, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const openAddModal = () => {
    setEditingProduct(null);
    setIsModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleDelete = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    e.stopPropagation();
    onDelete(id);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Estoque</h2>
          <p className="text-slate-400 dark:text-slate-500 text-xs font-semibold">{products.length} itens cadastrados</p>
        </div>
        <button 
          onClick={openAddModal}
          className="bg-green-600 hover:bg-green-700 text-white font-black p-3 rounded-2xl shadow-lg shadow-green-100 dark:shadow-green-900/20 transition-transform active:scale-90 flex items-center justify-center"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
          </svg>
        </button>
      </div>

      <div className="space-y-3">
        {products.length === 0 ? (
          <div className="py-20 flex flex-col items-center text-slate-300 dark:text-slate-700 bg-white dark:bg-slate-900 rounded-3xl border-2 border-dashed border-slate-100 dark:border-slate-800 transition-colors">
            <div className="w-16 h-16 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 opacity-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="font-bold text-slate-400 dark:text-slate-500">Estoque vazio</p>
            <p className="text-[10px] uppercase tracking-widest font-bold mt-1 text-slate-400 dark:text-slate-600">Toque no + para começar</p>
          </div>
        ) : (
          products.map(product => (
            <div 
              key={product.id} 
              className="bg-white dark:bg-slate-900 rounded-2xl p-4 shadow-sm border border-slate-100 dark:border-slate-800 flex gap-4 items-center group relative overflow-hidden active:bg-slate-50 dark:active:bg-slate-800 transition-colors"
            >
              <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-800 flex-shrink-0 overflow-hidden border border-slate-100 dark:border-slate-800">
                {product.photo ? (
                  <img src={product.photo} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-200 dark:text-slate-700">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 truncate leading-tight text-sm">{product.name}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-[11px] font-black text-green-600 dark:text-green-500">R$ {product.sellingPrice.toFixed(2)}</span>
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter">Estoque: {product.stock}</span>
                </div>
                {product.stock <= 0 && (
                  <span className="mt-1 inline-block text-[8px] font-black bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-1.5 py-0.5 rounded-md uppercase tracking-widest">Esgotado</span>
                )}
              </div>
              <div className="flex gap-1">
                 <button 
                  onClick={(e) => { e.stopPropagation(); openEditModal(product); }}
                  className="p-3 text-slate-300 dark:text-slate-600 hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button 
                  onClick={(e) => handleDelete(e, product.id)}
                  className="p-3 text-slate-300 dark:text-slate-600 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <ProductModal 
          product={editingProduct} 
          onSave={(p) => {
            if (editingProduct) onUpdate(p);
            else onAdd(p);
            setIsModalOpen(false);
          }} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
};

export default InventoryTab;
