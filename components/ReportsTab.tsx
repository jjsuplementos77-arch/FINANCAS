
import React, { useMemo } from 'react';
import { Sale, ActivityLog } from '../types';
import { MONTHS } from '../constants';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, AreaChart, Area, LabelList } from 'recharts';

interface ReportsTabProps {
  allSales: Sale[];
  logs: ActivityLog[];
  month: number;
  year: number;
}

const ReportsTab: React.FC<ReportsTabProps> = ({ allSales, logs, month, year }) => {
  const filteredSales = useMemo(() => {
    return allSales.filter(sale => {
      const d = new Date(sale.date);
      return d.getMonth() === month && d.getFullYear() === year;
    });
  }, [allSales, month, year]);

  const stats = useMemo(() => {
    const revenueReal = filteredSales.reduce((sum, sale) => sum + sale.totalPrice, 0);
    const investmentTotal = filteredSales.reduce((sum, sale) => sum + sale.totalCost, 0);

    return {
      revenue: revenueReal,
      investment: investmentTotal,
      profit: revenueReal - investmentTotal,
      count: filteredSales.length
    };
  }, [filteredSales]);

  const monthlyData = useMemo(() => {
    return MONTHS.map((m, index) => {
      const monthSales = allSales.filter(sale => {
        const d = new Date(sale.date);
        return d.getMonth() === index && d.getFullYear() === year;
      });
      const total = monthSales.reduce((sum, s) => sum + s.totalPrice, 0);
      return {
        name: m.substring(0, 3),
        vendas: total
      };
    });
  }, [allSales, year]);

  const topProducts = useMemo(() => {
    const productSales: Record<string, { name: string, quantity: number }> = {};
    filteredSales.forEach(sale => {
      if (!productSales[sale.productId]) {
        productSales[sale.productId] = { name: sale.productName, quantity: 0 };
      }
      productSales[sale.productId].quantity += sale.quantity;
    });

    return Object.values(productSales)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, 5);
  }, [filteredSales]);

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-10">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100 tracking-tight">Relatórios</h2>
          <p className="text-slate-400 dark:text-slate-500 text-xs font-bold uppercase tracking-widest">{MONTHS[month]} {year}</p>
        </div>
      </div>

      {/* Cards de Métricas Principais */}
      <div className="grid grid-cols-1 gap-3">
        <div className="bg-green-600 rounded-3xl p-6 shadow-xl shadow-green-500/20 text-white overflow-hidden relative">
          <div className="relative z-10">
            <span className="text-[10px] font-black uppercase tracking-widest opacity-80">Lucro Líquido Real</span>
            <div className="text-3xl font-black mt-1">R$ {stats.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
            <div className="mt-4 flex items-center gap-2">
              <span className="bg-white/20 px-2 py-1 rounded-lg text-[10px] font-bold">Resumo do Período</span>
              <span className="text-[10px] font-bold">{stats.count} registros de venda</span>
            </div>
          </div>
          <div className="absolute -right-4 -bottom-4 opacity-10">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 14h-2v-2h2v2zm0-4h-2V7h2v5z"/>
            </svg>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tight">Faturamento</span>
            <div className="text-lg font-black text-green-600 dark:text-green-500 mt-0.5">R$ {stats.revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
            <span className="text-[9px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-tight">Custo Investido</span>
            <div className="text-lg font-black text-red-500 dark:text-red-400 mt-0.5">R$ {stats.investment.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
          </div>
        </div>
      </div>

      {/* Gráfico de Evolução Mensal */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
        <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 mb-4 uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-4 bg-blue-500 rounded-full"></div>
          Vendas em {year} (R$)
        </h3>
        <div className="h-40 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={monthlyData}>
              <defs>
                <linearGradient id="colorVendas" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis dataKey="name" tick={{fontSize: 9, fontWeight: 700, fill: '#94a3b8'}} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ 
                  borderRadius: '12px', 
                  border: 'none', 
                  fontSize: '10px',
                  backgroundColor: '#0f172a',
                  color: '#f1f5f9'
                }}
                itemStyle={{ color: '#3b82f6' }}
                formatter={(value: any) => [`R$ ${value.toFixed(2)}`, 'Total']}
              />
              <Area type="monotone" dataKey="vendas" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorVendas)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Histórico de Atividades (Logs) */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
        <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 mb-4 uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-4 bg-orange-500 rounded-full"></div>
          Histórico de Atividades
        </h3>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 no-scrollbar">
          {logs.length > 0 ? (
            logs.map(log => (
              <div key={log.id} className="flex gap-3 items-start p-2 border-b border-slate-50 dark:border-slate-800/50">
                <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 ${log.type === 'sale' ? 'bg-green-500' : log.type === 'product' ? 'bg-blue-500' : 'bg-slate-400'}`}></div>
                <div className="flex-1">
                  <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 leading-tight">{log.action}</p>
                  <p className="text-[9px] text-slate-400 font-medium mt-0.5">{new Date(log.timestamp).toLocaleString('pt-BR')}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-[10px] text-slate-400 text-center py-4 uppercase font-bold tracking-widest">Nenhuma atividade registrada</p>
          )}
        </div>
      </div>

      {/* Gráfico de Mais Vendidos */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-100 dark:border-slate-800 shadow-sm transition-colors">
        <h3 className="text-xs font-black text-slate-800 dark:text-slate-100 mb-4 uppercase tracking-widest flex items-center gap-2">
          <div className="w-1.5 h-4 bg-green-500 rounded-full"></div>
          Mais Vendidos (Unidades)
        </h3>
        {topProducts.length > 0 ? (
          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ left: -20, right: 30 }}>
                <XAxis type="number" hide />
                <YAxis dataKey="name" type="category" tick={{ fontSize: 9, fontWeight: 800, fill: '#94a3b8' }} width={80} />
                <Tooltip 
                  cursor={{ fill: '#f1f5f9' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', fontSize: '10px' }}
                />
                <Bar dataKey="quantity" name="Quantidade" radius={[0, 4, 4, 0]} barSize={20} fill="#16a34a">
                  <LabelList dataKey="quantity" position="right" style={{ fontSize: '10px', fontWeight: 'bold', fill: '#64748b' }} formatter={(value: any) => `${value} un`} />
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="h-32 flex flex-col items-center justify-center text-slate-300">
            <span className="text-[10px] font-bold uppercase">Sem vendas registradas</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReportsTab;
