import React, { ReactNode } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useFinance } from '../context/FinanceContext';

interface LayoutProps {
  children: ReactNode;
  title: string;
}

const Layout: React.FC<LayoutProps> = ({ children, title }) => {
  const { user, logout } = useFinance();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { name: 'Dashboard', path: '/', icon: 'fa-chart-line' },
    { name: 'Accounts', path: '/accounts', icon: 'fa-university' },
    { name: 'Transactions', path: '/transactions', icon: 'fa-list' },
    { name: 'Investments', path: '/investments', icon: 'fa-chart-pie' },
    { name: 'Reports', path: '/reports', icon: 'fa-file-invoice-dollar' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-72 bg-white/80 backdrop-blur-xl border-r border-pink-100 shadow-[0_0_40px_-10px_rgba(0,0,0,0.05)] m-4 rounded-3xl z-10">
        <div className="p-8 flex items-center space-x-3">
          <div className="bg-gradient-to-tr from-pink-500 to-violet-500 p-3 rounded-2xl shadow-lg shadow-pink-500/30 transform rotate-3">
            <i className="fas fa-wallet text-white text-xl"></i>
          </div>
          <span className="text-2xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-violet-600">
            FinTrack
          </span>
        </div>
        
        <div className="px-6 mb-6">
           <div className="bg-gradient-to-r from-violet-100 to-pink-100 rounded-2xl p-4 flex items-center space-x-3 border border-white/50 shadow-sm">
              <div className="h-10 w-10 rounded-full bg-white flex items-center justify-center text-lg font-bold text-violet-600 shadow-sm border-2 border-white">
                {user?.username.charAt(0).toUpperCase()}
              </div>
              <div className="overflow-hidden">
                <p className="font-bold text-slate-700 text-sm truncate">Hi, {user?.username}!</p>
                <p className="text-xs text-slate-500 truncate">{user?.email}</p>
              </div>
           </div>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-6 py-3.5 rounded-2xl transition-all duration-300 group ${
                  isActive
                    ? 'bg-gradient-to-r from-pink-500 to-violet-500 text-white shadow-lg shadow-pink-500/30 translate-x-1'
                    : 'text-slate-500 hover:bg-pink-50 hover:text-pink-600'
                }`
              }
            >
              <i className={`fas ${item.icon} w-6 text-center text-lg transition-transform group-hover:scale-110 ${({isActive}:any) => isActive ? 'text-white' : 'text-pink-400'}`}></i>
              <span className="font-bold">{item.name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="p-6">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-6 py-3.5 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-2xl transition-colors font-bold group"
          >
            <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-red-100 transition-colors">
                 <i className="fas fa-sign-out-alt text-sm"></i>
            </div>
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        {/* Decorative Blobs */}
        <div className="absolute top-0 left-0 w-64 h-64 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-violet-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-64 h-64 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        {/* Mobile Header */}
        <header className="md:hidden bg-white/90 backdrop-blur-md p-4 flex justify-between items-center shadow-sm z-20 mx-4 mt-4 rounded-2xl">
           <div className="flex items-center space-x-2">
             <div className="bg-pink-500 p-1.5 rounded-lg">
                <i className="fas fa-wallet text-white"></i>
             </div>
             <span className="font-extrabold text-slate-800">FinTrack</span>
           </div>
           <button onClick={handleLogout} className="text-slate-400 hover:text-red-500">
             <i className="fas fa-sign-out-alt text-xl"></i>
           </button>
        </header>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-4 md:p-8 z-10">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8 flex flex-col md:flex-row md:items-end md:justify-between">
                    <div>
                        <h1 className="text-4xl font-extrabold text-slate-800 mb-2 tracking-tight">{title}</h1>
                         <p className="text-slate-500 font-medium">
                            {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                        </p>
                    </div>
                </div>
                {children}
            </div>
        </div>
        
        {/* Mobile Nav Bottom */}
        <nav className="md:hidden bg-white border-t border-gray-100 flex justify-around p-2 pb-safe shadow-[0_-10px_40px_-15px_rgba(0,0,0,0.1)] rounded-t-2xl z-20">
           {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex flex-col items-center p-2 rounded-xl text-xs font-bold transition-all ${
                  isActive ? 'text-pink-600 bg-pink-50' : 'text-gray-400'
                }`
              }
            >
              <i className={`fas ${item.icon} text-xl mb-1`}></i>
              <span>{item.name}</span>
            </NavLink>
          ))}
        </nav>
      </main>
    </div>
  );
};

export default Layout;
