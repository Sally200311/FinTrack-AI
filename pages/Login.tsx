import React, { useState } from 'react';
import { useFinance } from '../context/FinanceContext';
import { useNavigate } from 'react-router-dom';

const Login: React.FC = () => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const { login } = useFinance();
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !email) return;
    
    login(username, email);
    navigate('/');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-indigo-200 via-purple-200 to-pink-200 p-4 font-sans relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-white/30 rounded-full blur-2xl"></div>
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-pink-300/40 rounded-full blur-3xl"></div>

      <div className="bg-white/80 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] w-full max-w-md p-10 border border-white/50 relative z-10">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-400 to-violet-500 rounded-3xl mb-6 shadow-xl shadow-pink-500/20 transform rotate-3 hover:rotate-6 transition-transform">
            <i className="fas fa-wallet text-3xl text-white"></i>
          </div>
          <h1 className="text-4xl font-extrabold text-slate-800 tracking-tight">FinTrack AI</h1>
          <p className="text-slate-500 mt-2 font-medium">Let's grow your wealth together! ✨</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-pink-300 focus:ring-4 focus:ring-pink-100 outline-none transition-all font-semibold text-slate-700 placeholder-slate-400"
              placeholder="Pick a cute username"
              required
            />
          </div>
          
          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700 ml-2">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-2 border-transparent focus:bg-white focus:border-pink-300 focus:ring-4 focus:ring-pink-100 outline-none transition-all font-semibold text-slate-700 placeholder-slate-400"
              placeholder="name@example.com"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-pink-500 to-violet-500 hover:from-pink-600 hover:to-violet-600 text-white font-bold py-4 rounded-2xl transition-all shadow-xl shadow-pink-500/30 transform hover:scale-[1.02] active:scale-95"
          >
            {isRegistering ? 'Start My Journey' : 'Welcome Back'}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button
            onClick={() => setIsRegistering(!isRegistering)}
            className="text-sm text-slate-500 hover:text-pink-600 font-bold transition-colors"
          >
            {isRegistering ? 'Already have an account? Sign In' : 'New here? Create Account'}
          </button>
        </div>
        
        <div className="mt-8 pt-6 border-t border-slate-100 text-center text-xs text-slate-400 font-medium">
           ✨ Demo Mode: Enter any name to start playing!
        </div>
      </div>
    </div>
  );
};

export default Login;
