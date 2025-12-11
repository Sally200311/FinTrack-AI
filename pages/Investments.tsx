import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import Layout from '../components/Layout';
import { Stock } from '../types';

const Investments: React.FC = () => {
  const { stocks, addStock, deleteStock, updateStockPrices, isUpdatingStocks } = useFinance();
  const [showModal, setShowModal] = useState(false);
  const [newStock, setNewStock] = useState<Omit<Stock, 'id'>>({
    symbol: '',
    name: '',
    quantity: 1,
    avgCost: 0,
    currentPrice: 0,
    currency: 'TWD'
  });

  const calculateReturn = (stock: Stock) => {
    const cost = stock.avgCost * stock.quantity;
    const value = stock.currentPrice * stock.quantity;
    const diff = value - cost;
    const percent = cost === 0 ? 0 : (diff / cost) * 100;
    return { diff, percent };
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addStock({ ...newStock, currentPrice: newStock.avgCost }); // Init current price same as cost
    setShowModal(false);
    setNewStock({ symbol: '', name: '', quantity: 1, avgCost: 0, currentPrice: 0, currency: 'TWD' });
  };

  return (
    <Layout title="Portfolio">
      <div className="flex justify-between mb-8">
        <button 
          onClick={updateStockPrices}
          disabled={isUpdatingStocks}
          className={`px-6 py-3 rounded-full flex items-center space-x-2 transition-all font-bold shadow-lg ${isUpdatingStocks ? 'bg-slate-300 text-white cursor-not-allowed' : 'bg-white text-indigo-600 hover:bg-indigo-50 shadow-indigo-200'}`}
        >
          <i className={`fas fa-sync ${isUpdatingStocks ? 'fa-spin' : ''}`}></i>
          <span>{isUpdatingStocks ? 'Updating...' : 'Sync Prices'}</span>
        </button>

        <button 
          onClick={() => setShowModal(true)}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-full flex items-center space-x-2 transition-all shadow-xl shadow-indigo-500/30 hover:-translate-y-1"
        >
          <i className="fas fa-plus"></i>
          <span className="font-bold">Add Holding</span>
        </button>
      </div>
      
      {/* Disclaimer */}
      <div className="mb-6 bg-blue-50 p-4 rounded-2xl border border-blue-100 flex items-start space-x-3">
         <div className="bg-blue-200 text-blue-600 rounded-full w-6 h-6 flex-shrink-0 flex items-center justify-center mt-0.5">
             <i className="fas fa-info text-xs"></i>
         </div>
         <p className="text-sm text-blue-800 font-medium">
             Market prices are powered by AI Search. They might be slightly delayed—always double-check with your broker! 🚀
         </p>
      </div>

      <div className="bg-white rounded-[2rem] shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-500 text-sm border-b border-slate-100">
              <tr>
                <th className="p-6 font-extrabold rounded-tl-[2rem]">Symbol</th>
                <th className="p-6 font-extrabold">Name</th>
                <th className="p-6 font-extrabold text-right">Shares</th>
                <th className="p-6 font-extrabold text-right">Avg Cost</th>
                <th className="p-6 font-extrabold text-right">Price</th>
                <th className="p-6 font-extrabold text-right">Value</th>
                <th className="p-6 font-extrabold text-right">Return</th>
                <th className="p-6 font-extrabold text-center rounded-tr-[2rem]"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {stocks.map(stock => {
                const { diff, percent } = calculateReturn(stock);
                const isPositive = diff >= 0;
                return (
                  <tr key={stock.id} className="hover:bg-indigo-50/30 transition-colors group">
                    <td className="p-6">
                        <span className="font-extrabold text-slate-800 bg-slate-100 px-3 py-1 rounded-lg group-hover:bg-white transition-colors">{stock.symbol}</span>
                    </td>
                    <td className="p-6 font-bold text-slate-600">{stock.name}</td>
                    <td className="p-6 text-right font-semibold text-slate-700">{stock.quantity}</td>
                    <td className="p-6 text-right text-slate-500 font-medium">{stock.currency} {stock.avgCost.toFixed(2)}</td>
                    <td className="p-6 text-right font-bold text-slate-700">
                        {stock.currency} {stock.currentPrice.toFixed(2)}
                        {stock.lastUpdated && <span className="block text-[10px] text-slate-400 font-normal">Updated just now</span>}
                    </td>
                    <td className="p-6 text-right font-extrabold text-slate-800">{stock.currency} {(stock.currentPrice * stock.quantity).toLocaleString()}</td>
                    <td className="p-6 text-right">
                       <div className={`text-sm font-extrabold px-3 py-1 rounded-full inline-block ${isPositive ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'}`}>
                         {isPositive ? '+' : ''}{diff.toFixed(2)} <span className="text-[10px] opacity-80">({percent.toFixed(1)}%)</span>
                       </div>
                    </td>
                    <td className="p-6 text-center">
                      <button onClick={() => deleteStock(stock.id)} className="w-8 h-8 rounded-full bg-slate-100 text-slate-400 hover:bg-red-100 hover:text-red-500 transition-colors flex items-center justify-center">
                        <i className="fas fa-trash text-xs"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
              {stocks.length === 0 && (
                <tr>
                   <td colSpan={8} className="p-12 text-center text-slate-400 font-medium">
                       <div className="inline-block p-4 rounded-full bg-slate-50 mb-2">
                           <i className="fas fa-seedling text-2xl text-slate-300"></i>
                       </div>
                       <p>Your portfolio is empty. Time to plant some seeds!</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

       {showModal && (
        <div className="fixed inset-0 bg-slate-900/40 flex items-center justify-center z-50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-[2.5rem] w-full max-w-md p-8 shadow-2xl">
            <h2 className="text-2xl font-extrabold text-slate-800 mb-6">Add Stock</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Symbol</label>
                   <input
                     type="text"
                     placeholder="2330.TW"
                     required
                     className="w-full px-4 py-3 border-2 border-slate-100 rounded-2xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-semibold"
                     value={newStock.symbol}
                     onChange={e => setNewStock({...newStock, symbol: e.target.value})}
                   />
                </div>
                <div>
                   <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Currency</label>
                   <select
                     className="w-full px-4 py-3 border-2 border-slate-100 rounded-2xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-semibold bg-white"
                     value={newStock.currency}
                     onChange={e => setNewStock({...newStock, currency: e.target.value})}
                   >
                      <option value="TWD">TWD</option>
                      <option value="USD">USD</option>
                   </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Company Name</label>
                <input
                  type="text"
                  required
                  placeholder="TSMC"
                  className="w-full px-4 py-3 border-2 border-slate-100 rounded-2xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-semibold"
                  value={newStock.name}
                  onChange={e => setNewStock({...newStock, name: e.target.value})}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Quantity</label>
                    <input
                      type="number"
                      required
                      step="any"
                      className="w-full px-4 py-3 border-2 border-slate-100 rounded-2xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-semibold"
                      value={newStock.quantity}
                      onChange={e => setNewStock({...newStock, quantity: Number(e.target.value)})}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">Avg Cost</label>
                    <input
                      type="number"
                      required
                      step="any"
                      className="w-full px-4 py-3 border-2 border-slate-100 rounded-2xl focus:border-indigo-400 focus:ring-4 focus:ring-indigo-100 outline-none transition-all font-semibold"
                      value={newStock.avgCost}
                      onChange={e => setNewStock({...newStock, avgCost: Number(e.target.value)})}
                    />
                  </div>
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
                  className="px-8 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-500/20 transform hover:scale-105 transition-all"
                >
                  Save Stock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Investments;
