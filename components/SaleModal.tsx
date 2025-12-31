
import React, { useState, useMemo, useEffect } from 'react';
import { Product, Sale, PaymentMethod } from '../types';
import { PAYMENT_METHODS } from '../constants';

interface SaleModalProps {
  products: Product[];
  saleToEdit?: Sale | null;
  onSave: (sale: Sale) => void;
  onClose: () => void;
}

const SaleModal: React.FC<SaleModalProps> = ({ products, saleToEdit, onSave, onClose }) => {
  const [selectedProductId, setSelectedProductId] = useState(saleToEdit?.productId || '');
  const [quantity, setQuantity] = useState(saleToEdit?.quantity.toString() || '1');
  const [unitPrice, setUnitPrice] = useState(saleToEdit ? (saleToEdit.totalPrice / saleToEdit.quantity).toString() : '');
  const [customerName, setCustomerName] = useState(saleToEdit?.customerName || '');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(saleToEdit?.paymentMethod || 'PIX');
  const [date, setDate] = useState(saleToEdit ? new Date(saleToEdit.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]);

  const selectedProduct = useMemo(() => {
    return products.find(p => p.id === selectedProductId);
  }, [products, selectedProductId]);

  // Se for uma nova venda, preenche o preço unitário padrão ao selecionar o produto
  useEffect(() => {
    if (selectedProduct && !saleToEdit) {
      setUnitPrice(selectedProduct.sellingPrice.toString());
    }
  }, [selectedProduct, saleToEdit]);

  const totalPrice = useMemo(() => {
    const price = parseFloat(unitPrice || '0');
    const qty = parseInt(quantity || '0');
    return price * qty;
  }, [unitPrice, quantity]);

  const totalCost = useMemo(() => {
    if (!selectedProduct) return 0;
    return selectedProduct.costPrice * parseInt(quantity || '0');
  }, [selectedProduct, quantity]);

  const totalBasePrice = useMemo(() => {
    if (!selectedProduct) return 0;
    return selectedProduct.sellingPrice * parseInt(quantity || '0');
  }, [selectedProduct, quantity]);

  const profit = useMemo(() => {
    return totalPrice - totalCost;
  }, [totalPrice, totalCost]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProductId || !quantity || !unitPrice) {
      alert('Por favor, preencha todos os campos obrigatórios.');
      return;
    }

    // Validação de estoque (considerando o delta na edição)
    if (selectedProduct) {
      const oldQty = saleToEdit?.productId === selectedProductId ? saleToEdit.quantity : 0;
      const neededQty = parseInt(quantity) - oldQty;
      if (selectedProduct.stock < neededQty) {
        alert('Quantidade insuficiente no estoque!');
        return;
      }
    }

    onSave({
      id: saleToEdit?.id || Date.now().toString(),
      productId: selectedProductId,
      productName: selectedProduct?.name || '',
      quantity: parseInt(quantity),
      totalPrice: totalPrice,
      totalCost: totalCost,
      totalBasePrice: totalBasePrice,
      date: new Date(date).toISOString(),
      customerName,
      paymentMethod
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-900/50 dark:bg-black/70 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 transition-all">
      <div className="bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-2xl w-full max-w-md shadow-2xl overflow-hidden animate-in slide-in-from-bottom sm:zoom-in duration-300 max-h-[90vh] flex flex-col transition-colors">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center shrink-0">
          <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100 tracking-tight">
            {saleToEdit ? 'Editar Venda' : 'Nova Venda'}
          </h3>
          <button onClick={onClose} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg text-slate-400 dark:text-slate-500 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4 overflow-y-auto no-scrollbar">
          <div>
            <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Produto *</label>
            <select 
              value={selectedProductId}
              onChange={e => setSelectedProductId(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none appearance-none font-bold"
              required
            >
              <option value="">Selecione um produto</option>
              {products.map(p => {
                const available = p.id === saleToEdit?.productId ? p.stock + saleToEdit.quantity : p.stock;
                return (
                  <option key={p.id} value={p.id} disabled={available <= 0} className="dark:bg-slate-800">
                    {p.name} {available <= 0 ? '(ESGOTADO)' : `(${available} un disponível)`}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Quantidade *</label>
              <input 
                type="number" 
                min="1"
                value={quantity}
                onChange={e => setQuantity(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none font-bold"
                required
              />
            </div>
            <div>
              <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Preço Unitário *</label>
              <div className="relative">
                <span className="absolute left-3 top-3.5 text-slate-400 dark:text-slate-500 text-sm font-bold">R$</span>
                <input 
                  type="number" 
                  step="0.01"
                  value={unitPrice}
                  onChange={e => setUnitPrice(e.target.value)}
                  className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-slate-100 border-2 border-green-100 dark:border-green-900/30 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none font-bold text-green-700 dark:text-green-500"
                  placeholder="0.00"
                  required
                />
              </div>
            </div>
          </div>

          {selectedProduct && (
            <div className="grid grid-cols-2 gap-2">
               <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase">Preço Cadastro</span>
                <span className="text-sm font-bold text-slate-500 dark:text-slate-600 line-through">R$ {selectedProduct.sellingPrice.toFixed(2)}</span>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                <span className="block text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase">Lucro Líquido</span>
                <span className={`text-sm font-bold ${profit >= 0 ? 'text-green-600 dark:text-green-500' : 'text-red-600 dark:text-red-500'}`}>
                  R$ {profit.toFixed(2)}
                </span>
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Cliente e Data</label>
            <div className="flex gap-2">
              <input 
                type="text" 
                value={customerName}
                onChange={e => setCustomerName(e.target.value)}
                className="flex-[2] px-4 py-3 bg-slate-50 dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-sm"
                placeholder="Nome do Cliente"
              />
              <input 
                type="date" 
                value={date}
                onChange={e => setDate(e.target.value)}
                className="flex-1 px-2 py-3 bg-slate-50 dark:bg-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-green-500 outline-none text-[10px] font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1.5">Pagamento</label>
            <div className="grid grid-cols-3 gap-2">
              {PAYMENT_METHODS.map(pm => (
                <button
                  key={pm.value}
                  type="button"
                  onClick={() => setPaymentMethod(pm.value as PaymentMethod)}
                  className={`py-2.5 px-1 rounded-2xl text-[10px] font-black border-2 transition-all uppercase tracking-tighter ${paymentMethod === pm.value ? 'border-green-600 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400' : 'border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-800 text-slate-400 dark:text-slate-600'}`}
                >
                  {pm.label}
                </button>
              ))}
            </div>
          </div>

          <div className="p-5 bg-green-600 rounded-3xl shadow-xl shadow-green-500/20 text-white mt-2">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] font-black uppercase opacity-80 tracking-widest">Total Corrigido</span>
              <span className="text-[10px] font-black uppercase opacity-80 tracking-widest">Valor Custos</span>
            </div>
            <div className="flex justify-between items-end">
              <span className="text-2xl font-black">R$ {totalPrice.toFixed(2)}</span>
              <span className="text-sm font-bold bg-white/20 px-2 py-1 rounded-lg">R$ {totalCost.toFixed(2)}</span>
            </div>
          </div>

          <div className="pt-2 pb-6 flex gap-3 shrink-0">
            <button 
              type="button" 
              onClick={onClose}
              className="flex-1 px-4 py-4 text-slate-400 dark:text-slate-500 font-black rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors uppercase text-xs tracking-widest"
            >
              Cancelar
            </button>
            <button 
              type="submit"
              className="flex-[2] px-4 py-4 bg-slate-900 dark:bg-green-600 text-white font-black rounded-2xl hover:bg-black dark:hover:bg-green-700 shadow-xl transition-transform active:scale-95 uppercase text-xs tracking-widest"
            >
              {saleToEdit ? 'Salvar' : 'Registrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SaleModal;
