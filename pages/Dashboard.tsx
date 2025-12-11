import React from 'react';
import { useFinance } from '../context/FinanceContext';
import Layout from '../components/Layout';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, CartesianGrid } from 'recharts';
import { AccountType, TransactionType } from '../types';

const Dashboard: React.FC = () => {
  const { accounts, stocks, transactions } = useFinance();

  // Calculations
  const totalCash = accounts.reduce((sum, acc) => {
      const val = acc.currency === 'USD' ? acc.balance * 30 : acc.balance;
      return sum + val;
  }, 0);

  const totalInvestment = stocks.reduce((sum, stock) => {
      const val = stock.currentPrice * stock.quantity;
      return sum + (stock.currency === 'USD' ? val * 30 : val);
  }, 0);

  const netWorth = totalCash + totalInvestment;

  // Recent Activity Data for Chart
  const recentTx = transactions.slice(0, 7).reverse(); // Last 7
  const chartData = recentTx.map(t => ({
    name: new Date(t.date).toLocaleDateString(undefined, {month:'short', day:'numeric'}),
    amount: t.amount,
    type: t.type
  }));

  return (
    <Layout title="Dashboard">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Summary Cards */}
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 rounded-3xl shadow-xl shadow-indigo-500/20 p-6 text-white relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
             <i className="fas fa-sack-dollar text-9xl transform rotate-12"></i>
          </div>
          <div className="relative z-10">
            <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
               <i className="fas fa-sack-dollar text-2xl"></i>
            </div>
            <span className="text-indigo-100 text-sm font-bold uppercase tracking-wider">Net Worth (Est. TWD)</span>
            <h2 className="text-3xl font-extrabold mt-1">${netWorth.toLocaleString()}</h2>
            <div className="mt-4 bg-white/10 inline-flex px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
               <i className="fas fa-arrow-up mr-1 text-green-300"></i> Total Assets
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl shadow-xl shadow-pink-500/20 p-6 text-white relative overflow-hidden group">
          <div className="absolute -bottom-4 -right-4 opacity-10 group-hover:scale-110 transition-transform">
             <i className="fas fa-wallet text-9xl transform -rotate-12"></i>
          </div>
          <div className="relative z-10">
            <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
               <i className="fas fa-university text-2xl"></i>
            </div>
            <span className="text-pink-100 text-sm font-bold uppercase tracking-wider">Cash Balance</span>
            <h2 className="text-3xl font-extrabold mt-1">${totalCash.toLocaleString()}</h2>
            <div className="mt-4 bg-white/10 inline-flex px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
               Across {accounts.length} accounts
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-amber-400 to-orange-500 rounded-3xl shadow-xl shadow-orange-500/20 p-6 text-white relative overflow-hidden group">
          <div className="absolute top-4 -right-4 opacity-10 group-hover:scale-110 transition-transform">
             <i className="fas fa-chart-line text-9xl"></i>
          </div>
          <div className="relative z-10">
            <div className="bg-white/20 w-12 h-12 rounded-2xl flex items-center justify-center mb-4 backdrop-blur-sm">
               <i className="fas fa-chart-pie text-2xl"></i>
            </div>
            <span className="text-orange-100 text-sm font-bold uppercase tracking-wider">Investments</span>
            <h2 className="text-3xl font-extrabold mt-1">${totalInvestment.toLocaleString()}</h2>
            <div className="mt-4 bg-white/10 inline-flex px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
               Holding {stocks.length} positions
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Transactions Chart */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-slate-800">Recent Activity</h3>
              <div className="bg-slate-100 p-2 rounded-xl">
                 <i className="fas fa-chart-bar text-slate-400"></i>
              </div>
           </div>
           <div className="h-64">
             <ResponsiveContainer width="100%" height="100%">
               <BarChart data={chartData}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="name" tick={{fontSize: 12, fill: '#94a3b8'}} axisLine={false} tickLine={false} dy={10} />
                 <YAxis hide />
                 <Tooltip 
                    cursor={{fill: '#f8fafc', radius: 8}}
                    contentStyle={{borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', padding: '12px'}}
                 />
                 <Bar dataKey="amount" radius={[8, 8, 8, 8]}>
                    {chartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.type === TransactionType.INCOME ? '#34d399' : '#fb7185'} />
                    ))}
                 </Bar>
               </BarChart>
             </ResponsiveContainer>
           </div>
        </div>

        {/* Accounts List Mini */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-extrabold text-slate-800">Your Accounts</h3>
              <button className="text-sm font-bold text-pink-500 hover:text-pink-600">See All</button>
           </div>
           <div className="space-y-4">
              {accounts.slice(0, 4).map(acc => (
                <div key={acc.id} className="flex justify-between items-center p-4 hover:bg-slate-50 rounded-2xl transition-all border border-slate-50 group">
                   <div className="flex items-center space-x-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white shadow-md transform group-hover:scale-105 transition-transform
                        ${acc.type === AccountType.BANK ? 'bg-blue-400' : 
                          acc.type === AccountType.CASH ? 'bg-emerald-400' : 'bg-violet-400'}`}>
                          <i className={`fas ${acc.type === AccountType.BANK ? 'fa-university' : acc.type === AccountType.CASH ? 'fa-wallet' : 'fa-chart-line'} text-lg`}></i>
                      </div>
                      <div>
                        <p className="font-bold text-slate-800">{acc.name}</p>
                        <p className="text-xs font-semibold text-slate-400">{acc.type}</p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="font-extrabold text-slate-700">{acc.currency} {acc.balance.toLocaleString()}</p>
                   </div>
                </div>
              ))}
              {accounts.length === 0 && <div className="text-center text-slate-400 py-4">No accounts yet!</div>}
           </div>
        </div>
      </div>
    </Layout>
  );
};

export default Dashboard;
