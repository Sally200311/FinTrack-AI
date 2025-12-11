import React from 'react';
import { useFinance } from '../context/FinanceContext';
import Layout from '../components/Layout';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TransactionType } from '../types';

// Cute Pastel Colors
const COLORS = ['#fb7185', '#34d399', '#fbf8cc', '#60a5fa', '#a78bfa', '#f472b6', '#818cf8'];

const Reports: React.FC = () => {
  const { transactions } = useFinance();

  // Prepare Expense Data by Category
  const expenseTx = transactions.filter(t => t.type === TransactionType.EXPENSE);
  const expenseByCategory = expenseTx.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {} as Record<string, number>);

  const expenseData = Object.keys(expenseByCategory).map(key => ({
    name: key,
    value: expenseByCategory[key]
  }));

  // Prepare Income vs Expense Total
  const totalIncome = transactions.filter(t => t.type === TransactionType.INCOME).reduce((sum, t) => sum + t.amount, 0);
  const totalExpense = transactions.filter(t => t.type === TransactionType.EXPENSE).reduce((sum, t) => sum + t.amount, 0);
  
  const comparisonData = [
    { name: 'Income', value: totalIncome },
    { name: 'Expenses', value: totalExpense }
  ];

  const renderLabel = ({ name, percent }: any) => {
    return `${name} ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <Layout title="Analytics">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Expense Breakdown */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center">
          <div className="w-full flex justify-between items-center mb-6">
             <h3 className="text-xl font-extrabold text-slate-800">Spending Habits</h3>
             <div className="bg-rose-100 text-rose-500 p-2 rounded-xl">
               <i className="fas fa-shopping-bag"></i>
             </div>
          </div>
          
          <div className="h-80 w-full relative">
            {expenseData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={expenseData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={renderLabel}
                    outerRadius={110}
                    innerRadius={60}
                    paddingAngle={5}
                    dataKey="value"
                    cornerRadius={8}
                  >
                    {expenseData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="none" />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value: number) => `$${value.toLocaleString()}`} 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.1)'}}
                  />
                </PieChart>
              </ResponsiveContainer>
            ) : (
               <div className="h-full flex flex-col items-center justify-center text-slate-300">
                  <i className="fas fa-cookie-bite text-4xl mb-2"></i>
                  <p className="font-medium">No spending data yet!</p>
               </div>
            )}
            {/* Center Text for Donut */}
             {expenseData.length > 0 && <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <span className="text-sm font-bold text-slate-400">Total<br/>Expenses</span>
             </div>}
          </div>
        </div>

        {/* Income vs Expense */}
        <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-slate-100 flex flex-col items-center">
           <div className="w-full flex justify-between items-center mb-6">
             <h3 className="text-xl font-extrabold text-slate-800">In vs Out</h3>
             <div className="bg-emerald-100 text-emerald-500 p-2 rounded-xl">
               <i className="fas fa-balance-scale"></i>
             </div>
          </div>

           <div className="h-80 w-full">
            {(totalIncome > 0 || totalExpense > 0) ? (
               <ResponsiveContainer width="100%" height="100%">
               <PieChart>
                 <Pie
                   data={comparisonData}
                   cx="50%"
                   cy="50%"
                   innerRadius={0}
                   outerRadius={110}
                   dataKey="value"
                 >
                   <Cell fill="#34d399" />
                   <Cell fill="#fb7185" />
                 </Pie>
                 <Tooltip 
                    formatter={(value: number) => `$${value.toLocaleString()}`} 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 8px 16px -4px rgba(0,0,0,0.1)'}}
                 />
                 <Legend verticalAlign="bottom" height={36} iconType="circle"/>
               </PieChart>
             </ResponsiveContainer>
            ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-300">
                  <i className="fas fa-ghost text-4xl mb-2"></i>
                  <p className="font-medium">Ghost town here...</p>
               </div>
            )}
           </div>
        </div>

      </div>
    </Layout>
  );
};

export default Reports;
