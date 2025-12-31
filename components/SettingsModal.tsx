
import React, { useRef } from 'react';
import { Product, Sale, ActivityLog } from '../types';

interface SettingsModalProps {
  onClose: () => void;
  products: Product[];
  sales: Sale[];
  logs: ActivityLog[];
  isFirstOpen?: boolean;
  onImport: (data: { products: Product[], sales: Sale[], logs: ActivityLog[] }) => void;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ onClose, products, sales, logs, isFirstOpen, onImport }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const exportData = () => {
    const data = {
      products,
      sales,
      logs,
      exportDate: new Date().toISOString(),
      appName: "Gestão Pro PDV"
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `gestao_pro_backup_${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleFileImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const json = JSON.parse(event.target?.result as string);
        if (json.products && json.sales) {
          if (confirm('Isso irá substituir todos os dados atuais por este backup. Deseja continuar?')) {
            onImport({ products: json.products, sales: json.sales, logs: json.logs || [] });
            onClose();
          }
        } else {
          alert('Arquivo de backup inválido.');
        }
      } catch (err) {
        alert('Erro ao ler o arquivo.');
      }
    };
    reader.readAsText(file);
  };

  const linkFolder = async () => {
    if ('showDirectoryPicker' in window) {
      try {
        // @ts-ignore
        await window.showDirectoryPicker();
        alert('Pasta vinculada para salvamento! (Simulação de vínculo do Sistema de Arquivos)');
      } catch (e) {
        console.log('Cancelado.');
      }
    } else {
      alert('⚠️ No celular, o sistema salva tudo automaticamente na Memória Interna do Navegador.\n\nPara segurança extra, use o botão "EXPORTAR BACKUP" para gravar o arquivo na sua pasta de preferência (Google Drive, iCloud ou Documentos).');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900/60 dark:bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4 animate-in fade-in duration-300">
      <div className="bg-white dark:bg-slate-900 rounded-3xl w-full max-w-sm shadow-2xl overflow-hidden flex flex-col transition-colors border border-slate-100 dark:border-slate-800">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
          <h3 className="text-xl font-black text-slate-800 dark:text-slate-100 tracking-tight">
            {isFirstOpen ? 'Configurar App' : 'Configurações'}
          </h3>
          {!isFirstOpen && (
            <button onClick={onClose} className="p-2 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors text-slate-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <div className="p-6 space-y-6 overflow-y-auto max-h-[70vh] no-scrollbar">
          {isFirstOpen && (
            <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-900/30 rounded-2xl mb-2">
              <p className="text-xs font-bold text-green-700 dark:text-green-400 leading-relaxed text-center italic">
                "Olá! Seus dados são salvos em tempo real na memória do celular. Para garantir segurança, escolha uma pasta para backup ou importe seus dados antigos abaixo."
              </p>
            </div>
          )}

          <section>
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Pasta de Destino & Backup</h4>
            <div className="space-y-3">
              <button 
                onClick={linkFolder}
                className="w-full flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all border border-transparent hover:border-blue-200 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-slate-700 dark:text-slate-200 text-sm">Vincular Pasta Celular</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">Onde gravar histórico e fotos</div>
                </div>
              </button>

              <button 
                onClick={exportData}
                className="w-full flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-green-50 dark:hover:bg-green-900/20 transition-all border border-transparent hover:border-green-200 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-green-100 dark:bg-green-900/40 text-green-600 dark:text-green-400 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-slate-700 dark:text-slate-200 text-sm">Exportar Backup (.json)</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">Copia os dados para seu celular</div>
                </div>
              </button>

              <button 
                onClick={() => fileInputRef.current?.click()}
                className="w-full flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-2xl hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all border border-transparent hover:border-orange-200 text-left"
              >
                <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-900/40 text-orange-600 dark:text-orange-400 flex items-center justify-center shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
                <div>
                  <div className="font-bold text-slate-700 dark:text-slate-200 text-sm">Restaurar do Celular</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500">Carregar arquivo de backup</div>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept=".json"
                  onChange={handleFileImport}
                />
              </button>
            </div>
          </section>

          <section>
            <h4 className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-4">Estado da Memória</h4>
            <div className="p-4 bg-slate-900 text-white rounded-2xl space-y-2">
              <div className="flex justify-between text-[10px] font-bold">
                <span className="opacity-60">Produtos Salvos</span>
                <span>{products.length}</span>
              </div>
              <div className="flex justify-between text-[10px] font-bold">
                <span className="opacity-60">Vendas Salvas</span>
                <span>{sales.length}</span>
              </div>
              <div className="w-full h-1 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-green-500 w-[100%]"></div>
              </div>
              <div className="text-[8px] opacity-40 italic mt-1">Atualizado automaticamente a cada segundo.</div>
            </div>
          </section>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-800/50 flex flex-col items-center">
          <button 
            onClick={onClose}
            className="w-full py-4 bg-slate-800 dark:bg-slate-700 text-white font-black rounded-2xl transition-transform active:scale-95 uppercase text-xs tracking-widest"
          >
            {isFirstOpen ? 'Começar a Usar' : 'Fechar'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
