import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import Layout from '../components/Layout';
import { TransactionType } from '../types';
import { CATEGORIES } from '../constants';

const Transactions: React.FC = () => {
  const { transactions, accounts, addTransaction, deleteTransaction } = useFinance();
  const [showModal, setShowModal] = useState(false);
  
  const [newTx, setNewTx] = useState({
    accountId: accounts[0]?.id || '',
    date: new Date().toISOString().split('T')[0],
    amount: 0,
    type: TransactionType.EXPENSE,
    category: CATEGORIES[TransactionType.EXPENSE][0],
    note: ''
  });

  const handleTypeChange = (type: TransactionType) => {
    setNewTx(prev => ({
      ...prev,
      type,
      category: CATEGORIES[type][0]
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addTransaction(newTx);
    setShowModal(false);
    setNewTx(prev => ({ ...prev, amount: 0, note: '' }));
  };

  // Sort by date desc
  const sortedTx = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <Layout title="Transactions">
      <div className="flex justify-end mb-8">
         <button 
          onClick={() => setShowModal(true)}
          className="bg-pink-500 hover:bg-pink-600 text-white px-6 py-3 rounded-full flex items-center space-x-2 transition-all shadow-xl shadow-pink-500/30 hover:-translate-y-1"
        >
          <i className="fas fa-plus"></i>
          <span className="font-bold">Record New</span>
        </button>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
           <thead className="bg-slate-50/50 text-slate-500 text-sm border-b border-slate-100">
             <tr>
               <th className="p-6 font-extrabold rounded-tl-[2rem]">Date</th>
               <th className="p-6 font-extrabold">Account</th>
               <th className="p-6 font-extrabold">Category</th>
               <th className="p-6 font-extrabold">Note</th>
               <th className="p-6 font-extrabold text-right">Amount</th>
               <th className="p-6 font-extrabold text-center rounded-tr-[2rem]"></th>
             </tr>
           </thead>
           <tbody className="divide-y divide-slate-50">
             {sortedTx.map(tx => {
                const acc = accounts.find(a => a.id === tx.accountId);
                return (
                  <tr key={tx.id} className="hover:bg-pink-50/30 transition-colors group">
                     <td className="p-6 text-slate-500 font-bold text-sm">{new Date(tx.date).toLocaleDateString(undefined, {month:'short', day: 'numeric'})}</td>
                     <td className="p-6 font-bold text-slate-700 text-sm">{acc?.name || 'Unknown'}</td>
                     <td className="p-6 text-sm">
                        <span className={`px-3 py-1.5 rounded-xl text-xs font-bold border 
                          ${tx.type === TransactionType.INCOME 
                            ? 'bg-green-50 text-green-600 border-green-100' 
                            : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
                          {tx.category}
                        </span>
                     </td>
                     <td className="p-6 text-slate-400 text-sm font-medium">{tx.note || '-'}</td>
                     <td className={`p-6 text-right font-extrabold text-sm ${tx.type === TransactionType.INCOME ? 'text-green-500' : 'text-slate-700'}`}>
                        {tx.type === TransactionType.EXPENSE ? '-' : '+'}{tx.amount.toLocaleString()}
                     </td>
                     <td className="p-6 text-center">
                        <button onClick={() => deleteTransaction(tx.id)} className="w-8 h-8 rounded-full text-slate-300 hover:text-red-500 hover:bg-red-50 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                          <i className="fas fa-trash text-xs"></i>
                        </button>
                     </td>
                  </tr>
                );
             })}
           </tbody>
        </table>
        {sortedTx.length === 0 && <div className="p-12 text-center text-slate-400 font-medium">
             <div className="inline-block p-4 rounded-full bg-slate-50 mb-2">
                 <i className="fas fa-receipt text-2xl text-slate-300"></i>
             </div>
             <p>No transactions yet. Clean slate! ✨</p>
        </div>}
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-6">New Record</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Type Switcher */}
              <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-6">
                 {[TransactionType.EXPENSE, TransactionType.INCOME].map(type => (
                   <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeChange(type)}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${newTx.type === type ? 'bg-white shadow-md text-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                   >
                     {type === TransactionType.INCOME ? '💰 Income' : '💸 Expense'}
                   </button>
                 ))}
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Date</label>
                    <input
                      type="date"
                      required
                      className="w-full px-4 py-3 border-2 border-slate-100 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all font-semibold text-slate-600"
                      value={newTx.date}
                      onChange={e => setNewTx({...newTx, date: e.target.value})}
                    />
                  </div>
                  <div>
                     <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Amount</label>
                     <input
                      type="number"
                      required
                      min="0"
                      className="w-full px-4 py-3 border-2 border-slate-100 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all font-bold text-slate-800"
                      value={newTx.amount === 0 ? '' : newTx.amount}
                      onChange={e => setNewTx({...newTx, amount: Number(e.target.value)})}
                     />
                  </div>
              </div>

              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Account</label>
                 <select
                   className="w-full px-4 py-3 border-2 border-slate-100 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all font-semibold text-slate-700 bg-white"
                   value={newTx.accountId}
                   onChange={e => setNewTx({...newTx, accountId: e.target.value})}
                 >
                   {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name} ({acc.currency})</option>)}
                 </select>
              </div>

              <div>
                 <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Category</label>
                 <select
                   className="w-full px-4 py-3 border-2 border-slate-100 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all font-semibold text-slate-700 bg-white"
                   value={newTx.category}
                   onChange={e => setNewTx({...newTx, category: e.target.value})}
                 >
                   {CATEGORIES[newTx.type].map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Note</label>
                <input
                  type="text"
                  placeholder="What was this for?"
                  className="w-full px-4 py-3 border-2 border-slate-100 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all font-semibold"
                  value={newTx.note}
                  onChange={e => setNewTx({...newTx, note: e.target.value})}
                />
              </div>

              <div className="flex justify-end space-x-3 mt-8 pt-4">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 text-slate-500 hover:text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 bg-pink-500 text-white rounded-xl hover:bg-pink-600 font-bold shadow-lg shadow-pink-500/30 transform hover:scale-105 transition-all"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Transactions;
