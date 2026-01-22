import React, { useState, useEffect } from 'react';
import { UserRole } from '../types';
import { BookOpen, ArrowRight, Loader2, Sparkles } from 'lucide-react';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [loading, setLoading] = useState(false);
  const [role, setRole] = useState<UserRole>(UserRole.TEACHER);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      onLogin(role);
    }, 800);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-900 overflow-hidden">
      {/* Left Panel - Branding & Parallax */}
      <div className="md:w-1/2 relative overflow-hidden flex flex-col justify-between p-8 md:p-12 z-10">
        {/* Parallax Background Layers */}
        <div 
            className="absolute inset-0 bg-blue-600 transition-transform duration-100 ease-out"
            style={{ transform: `scale(1.1) translate(${mousePos.x * -1}px, ${mousePos.y * -1}px)` }}
        >
             <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-1.2.1&auto=format&fit=crop&w=1950&q=80')] opacity-20 bg-cover bg-center mix-blend-overlay" />
             <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-indigo-900/90" />
        </div>
        
        {/* Floating Elements */}
        <div 
            className="absolute top-20 right-20 w-32 h-32 bg-yellow-400/20 rounded-full blur-3xl"
            style={{ transform: `translate(${mousePos.x * 2}px, ${mousePos.y * 2}px)` }}
        />
        <div 
            className="absolute bottom-20 left-20 w-64 h-64 bg-cyan-400/20 rounded-full blur-3xl"
            style={{ transform: `translate(${mousePos.x * 1.5}px, ${mousePos.y * 1.5}px)` }}
        />

        {/* Content */}
        <div className="relative z-10">
            <div className="flex items-center gap-3 text-white mb-8 animate-in slide-in-from-left duration-700">
                <div className="p-2 bg-white/10 backdrop-blur-md rounded-lg border border-white/20">
                    <BookOpen size={28} />
                </div>
                <span className="text-2xl font-bold tracking-tight">ScholaLink</span>
            </div>
            
            <div className="space-y-6">
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight animate-in slide-in-from-bottom duration-700 delay-100">
                    Future of <br/>
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">Education</span>
                </h1>
                <p className="text-blue-100 text-lg max-w-md leading-relaxed animate-in slide-in-from-bottom duration-700 delay-200">
                    Experience a seamless connection between teachers, students, and parents with our AI-powered portal.
                </p>
            </div>
        </div>

        <div className="relative z-10 text-sm text-blue-200/60 animate-in fade-in duration-1000 delay-500">
            © 2024 ScholaLink Education Systems
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="md:w-1/2 flex items-center justify-center bg-slate-50 relative">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
             <div className="absolute -top-[20%] -right-[10%] w-[50%] h-[50%] bg-blue-200/20 rounded-full blur-3xl" />
             <div className="absolute -bottom-[10%] -left-[10%] w-[40%] h-[40%] bg-indigo-200/20 rounded-full blur-3xl" />
        </div>

        <div className="w-full max-w-md space-y-8 bg-white/80 backdrop-blur-xl p-8 md:p-12 rounded-3xl shadow-2xl border border-white/50 relative z-10 mx-4">
          <div className="text-center space-y-2">
            <div className="inline-flex p-3 bg-blue-50 rounded-full text-blue-600 mb-2">
                <Sparkles size={24} />
            </div>
            <h2 className="text-3xl font-bold text-slate-900">Welcome Back</h2>
            <p className="text-slate-500">Access your dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-4">
                {/* Role Selector */}
                <div className="p-1.5 bg-slate-100 rounded-xl flex gap-1">
                    {[UserRole.TEACHER, UserRole.STUDENT, UserRole.ADMIN].map((r) => (
                        <button
                            key={r}
                            type="button"
                            onClick={() => setRole(r)}
                            className={`flex-1 py-2.5 text-xs md:text-sm font-semibold rounded-lg transition-all duration-200 ${
                                role === r 
                                ? 'bg-white text-blue-600 shadow-sm scale-[1.02]' 
                                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50'
                            }`}
                        >
                            {r.charAt(0) + r.slice(1).toLowerCase()}
                        </button>
                    ))}
                </div>

                <div className="space-y-4">
                    <div className="group">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Email</label>
                        <input 
                            type="email" 
                            required
                            defaultValue="demo@school.com"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
                            placeholder="name@school.com"
                        />
                    </div>
                    <div className="group">
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1.5 ml-1">Password</label>
                        <input 
                            type="password" 
                            required
                            defaultValue="password"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all font-medium text-slate-900"
                            placeholder="••••••••"
                        />
                    </div>
                </div>
            </div>

            <div className="flex items-center justify-between text-sm">
                <label className="flex items-center gap-2 text-slate-600 cursor-pointer select-none">
                    <input type="checkbox" className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500" />
                    Remember me
                </label>
                <a href="#" className="text-blue-600 hover:text-blue-700 font-semibold">Forgot password?</a>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/40 transform hover:-translate-y-0.5 transition-all font-bold text-base flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>Sign In <ArrowRight size={20} /></>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};