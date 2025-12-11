import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import Layout from '../components/Layout';
import { AccountType } from '../types';

const Accounts: React.FC = () => {
  const { accounts, addAccount, deleteAccount } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [newAccount, setNewAccount] = useState({ name: '', type: AccountType.BANK, balance: 0, currency: 'TWD' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addAccount(newAccount);
    setShowModal(false);
    setNewAccount({ name: '', type: AccountType.BANK, balance: 0, currency: 'TWD' });
  };

  const getGradient = (type: AccountType) => {
    switch (type) {
        case AccountType.BANK: return 'from-blue-400 to-indigo-500 shadow-blue-500/30';
        case AccountType.CASH: return 'from-emerald-400 to-teal-500 shadow-emerald-500/30';
        case AccountType.INVESTMENT: return 'from-violet-400 to-purple-500 shadow-violet-500/30';
        default: return 'from-slate-400 to-slate-500 shadow-slate-500/30';
    }
  }

  return (
    <Layout title="My Wallets">
      <div className="flex justify-end mb-8">
        <button 
          onClick={() => setShowModal(true)}
          className="bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-full flex items-center space-x-2 transition-all shadow-xl shadow-slate-500/20 hover:shadow-slate-500/40 transform hover:-translate-y-1"
        >
          <div className="bg-white/20 rounded-full w-6 h-6 flex items-center justify-center">
             <i className="fas fa-plus text-xs"></i>
          </div>
          <span className="font-bold">Add Wallet</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {accounts.map(acc => (
          <div key={acc.id} className={`bg-gradient-to-br ${getGradient(acc.type)} rounded-[2rem] shadow-2xl p-6 relative group overflow-hidden h-48 flex flex-col justify-between transition-transform hover:-translate-y-2`}>
             {/* Decorative circles */}
             <div className="absolute -top-10 -right-10 w-32 h-32 bg-white/10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500"></div>
             
             <div className="flex justify-between items-start z-10">
               <div>
                 <span className="inline-block px-3 py-1 rounded-full text-[10px] font-bold bg-black/20 text-white/90 backdrop-blur-sm uppercase tracking-wide border border-white/10">{acc.type}</span>
               </div>
               <button onClick={() => deleteAccount(acc.id)} className="text-white/50 hover:text-white bg-black/10 hover:bg-red-500/80 w-8 h-8 rounded-full flex items-center justify-center transition-colors backdrop-blur-md">
                 <i className="fas fa-trash text-xs"></i>
               </button>
             </div>
             
             <div className="z-10">
                <p className="text-white/80 text-sm font-medium mb-1">Current Balance</p>
                <h3 className="text-3xl font-extrabold text-white tracking-tight">{acc.currency} {acc.balance.toLocaleString()}</h3>
                <p className="text-white/60 text-sm font-bold mt-2 flex items-center">
                   <span className="w-2 h-2 rounded-full bg-green-400 mr-2 animate-pulse"></span>
                   {acc.name}
                </p>
             </div>
          </div>
        ))}
        
        {/* Empty State Add Button Card */}
        <button onClick={() => setShowModal(true)} className="border-4 border-dashed border-slate-200 rounded-[2rem] h-48 flex flex-col items-center justify-center text-slate-400 hover:border-pink-300 hover:text-pink-400 hover:bg-pink-50/50 transition-all group">
            <div className="w-16 h-16 rounded-full bg-slate-100 group-hover:bg-pink-100 flex items-center justify-center mb-3 transition-colors">
                <i className="fas fa-plus text-xl"></i>
            </div>
            <span className="font-bold">Add New Account</span>
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl animate-bounce-in">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-extrabold text-slate-800">New Wallet</h2>
                <p className="text-slate-400 text-sm">Let's track some more money!</p>
            </div>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Account Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Piggy Bank"
                  className="w-full px-5 py-3 border-2 border-slate-100 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all font-semibold text-slate-700"
                  value={newAccount.name}
                  onChange={e => setNewAccount({...newAccount, name: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Type</label>
                   <select
                    className="w-full px-4 py-3 border-2 border-slate-100 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all font-semibold text-slate-700 bg-white"
                    value={newAccount.type}
                    onChange={e => setNewAccount({...newAccount, type: e.target.value as AccountType})}
                   >
                     {Object.values(AccountType).map(t => <option key={t} value={t}>{t}</option>)}
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Currency</label>
                   <select
                    className="w-full px-4 py-3 border-2 border-slate-100 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all font-semibold text-slate-700 bg-white"
                    value={newAccount.currency}
                    onChange={e => setNewAccount({...newAccount, currency: e.target.value})}
                   >
                     <option value="TWD">TWD</option>
                     <option value="USD">USD</option>
                     <option value="EUR">EUR</option>
                     <option value="JPY">JPY</option>
                   </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Initial Balance</label>
                <div className="relative">
                    <span className="absolute left-4 top-3.5 text-slate-400 font-bold">$</span>
                    <input
                      type="number"
                      required
                      className="w-full pl-8 pr-5 py-3 border-2 border-slate-100 rounded-2xl focus:border-pink-400 focus:ring-4 focus:ring-pink-100 outline-none transition-all font-bold text-slate-700 text-lg"
                      value={newAccount.balance}
                      onChange={e => setNewAccount({...newAccount, balance: Number(e.target.value)})}
                    />
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-8 pt-4 border-t border-slate-50">
                <button 
                  type="button" 
                  onClick={() => setShowModal(false)}
                  className="px-6 py-3 text-slate-500 hover:text-slate-700 font-bold rounded-xl hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-8 py-3 bg-slate-900 text-white rounded-xl hover:bg-slate-800 font-bold shadow-lg shadow-slate-500/20 transform hover:scale-105 transition-all"
                >
                  Create
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Accounts;
