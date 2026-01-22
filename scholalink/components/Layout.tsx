import React, { useState, useRef, useEffect } from 'react';
import { User, UserRole, Notification } from '../types';
import { MOCK_NOTIFICATIONS } from '../services/mockData';
import { Calculator } from './Calculator';
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  LogOut, 
  GraduationCap, 
  Bell, 
  Menu,
  X,
  Calendar,
  Settings,
  Shield,
  BookMarked,
  MessageSquare,
  FileText,
  Calculator as CalculatorIcon
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface LayoutProps {
  children: React.ReactNode;
  user: User;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, user, onLogout }) => {
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);
  const navigate = useNavigate();
  const location = useLocation();
  const notificationRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/', roles: [UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT, UserRole.ADMIN] },
    { icon: MessageSquare, label: 'Messages', path: '/messages', roles: [UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT, UserRole.ADMIN] },
    { icon: BookOpen, label: 'Classes', path: '/classes', roles: [UserRole.TEACHER, UserRole.ADMIN] },
    { icon: BookMarked, label: 'My Diary', path: '/diary', roles: [UserRole.STUDENT] },
    { icon: FileText, label: 'Homework', path: '/homework', roles: [UserRole.STUDENT] },
    { icon: GraduationCap, label: 'My Grades', path: '/grades', roles: [UserRole.STUDENT] },
    { icon: Calendar, label: 'Schedule', path: '/schedule', roles: [UserRole.TEACHER, UserRole.STUDENT] },
    { icon: Users, label: 'Children', path: '/children', roles: [UserRole.PARENT] },
    { icon: Shield, label: 'Administration', path: '/admin', roles: [UserRole.ADMIN] },
    { icon: Settings, label: 'Settings', path: '/settings', roles: [UserRole.TEACHER, UserRole.STUDENT, UserRole.PARENT, UserRole.ADMIN] },
  ];

  const filteredNavItems = navItems.filter(item => item.roles.includes(user.role));

  const handleNav = (path: string) => {
    navigate(path);
    setIsSidebarOpen(false);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  return (
    <div className="min-h-screen bg-slate-50 flex overflow-hidden relative selection:bg-blue-100 selection:text-blue-900">
      
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-200/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200/20 rounded-full blur-[120px] animate-pulse" style={{ animationDuration: '10s' }} />
        <div className="absolute top-[40%] left-[40%] w-[30%] h-[30%] bg-purple-200/20 rounded-full blur-[100px] animate-pulse" style={{ animationDuration: '12s' }} />
      </div>

      {/* Sidebar for Desktop */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white/80 backdrop-blur-xl border-r border-white/50 shadow-xl shadow-slate-200/50 transform transition-transform duration-300 ease-in-out md:translate-x-0 md:static md:block ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-full flex flex-col">
          <div className="p-6 flex items-center justify-between">
            <div className="flex items-center gap-3 text-blue-600">
              <div className="p-2 bg-blue-600 rounded-lg shadow-lg shadow-blue-500/30 text-white">
                <BookOpen size={24} strokeWidth={2.5} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-800">ScholaLink</span>
            </div>
            <button onClick={() => setIsSidebarOpen(false)} className="md:hidden text-slate-500">
              <X size={24} />
            </button>
          </div>

          <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <button
                  key={item.path}
                  onClick={() => handleNav(item.path)}
                  className={`w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold rounded-xl transition-all duration-200 group relative overflow-hidden ${
                    isActive 
                      ? 'bg-blue-50 text-blue-600 shadow-sm' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  {isActive && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-r-full" />}
                  <item.icon size={20} className={`transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  {item.label}
                </button>
              );
            })}
          </nav>

          <div className="p-4 border-t border-slate-100 bg-slate-50/50">
            <div className="flex items-center gap-3 mb-4 px-2 p-3 bg-white rounded-xl border border-slate-100 shadow-sm">
              <img 
                src={user.avatarUrl} 
                alt={user.name} 
                className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                <p className="text-xs text-slate-500 truncate capitalize font-medium">{user.role.toLowerCase()}</p>
              </div>
            </div>
            <button 
              onClick={onLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
            >
              <LogOut size={18} />
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-0 overflow-hidden relative z-10">
        {/* Mobile Header */}
        <header className="md:hidden bg-white/80 backdrop-blur-md border-b border-slate-200 flex items-center justify-between px-4 py-3 sticky top-0 z-40">
          <button onClick={() => setIsSidebarOpen(true)} className="text-slate-600">
            <Menu size={24} />
          </button>
          <span className="font-bold text-slate-900">ScholaLink</span>
          <div className="w-6" /> {/* Spacer */}
        </header>

        {/* Top Bar Desktop */}
        <header className="hidden md:flex bg-white/50 backdrop-blur-sm border-b border-white/50 px-8 py-5 items-center justify-between z-20 sticky top-0">
          <div>
              <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
                {navItems.find(i => i.path === location.pathname)?.label || 'Dashboard'}
              </h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Welcome back, {user.name.split(' ')[0]}</p>
          </div>
          
          <div className="flex items-center gap-3">
             {/* Calculator Toggle */}
             <button 
                onClick={() => setShowCalculator(!showCalculator)}
                className={`p-2.5 rounded-full transition-all duration-200 ${showCalculator ? 'bg-white shadow-md text-slate-900' : 'bg-white/50 text-slate-400 hover:text-slate-600 hover:bg-white hover:shadow-sm'}`}
                title="Calculator"
             >
                <CalculatorIcon size={20} />
             </button>

            <div className="relative" ref={notificationRef}>
                <button 
                    onClick={() => setShowNotifications(!showNotifications)}
                    className={`p-2.5 rounded-full relative transition-all duration-200 ${showNotifications ? 'bg-white shadow-md text-blue-600' : 'bg-white/50 text-slate-400 hover:text-slate-600 hover:bg-white hover:shadow-sm'}`}
                >
                    <Bell size={20} />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
                    )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                    <div className="absolute right-0 mt-3 w-80 bg-white/90 backdrop-blur-xl rounded-2xl shadow-xl border border-white/50 overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50 ring-1 ring-slate-900/5">
                        <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h3 className="font-bold text-slate-900">Notifications</h3>
                            {unreadCount > 0 && (
                                <button onClick={markAllRead} className="text-xs text-blue-600 hover:text-blue-700 font-medium">
                                    Mark all read
                                </button>
                            )}
                        </div>
                        <div className="max-h-96 overflow-y-auto custom-scrollbar">
                            {notifications.length > 0 ? (
                                notifications.map(notification => (
                                    <div 
                                        key={notification.id} 
                                        onClick={() => markAsRead(notification.id)}
                                        className={`p-4 border-b border-slate-50 hover:bg-slate-50 transition-colors cursor-pointer relative ${!notification.read ? 'bg-blue-50/40' : ''}`}
                                    >
                                        {!notification.read && <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>}
                                        <div className="flex justify-between items-start mb-1">
                                            <p className={`text-sm font-semibold ${!notification.read ? 'text-slate-900' : 'text-slate-700'}`}>
                                                {notification.title}
                                            </p>
                                            <span className="text-[10px] text-slate-400 font-medium">{notification.date}</span>
                                        </div>
                                        <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{notification.message}</p>
                                    </div>
                                ))
                            ) : (
                                <div className="p-8 text-center text-slate-400 text-sm">
                                    No notifications
                                </div>
                            )}
                        </div>
                        <div className="p-2 border-t border-slate-100 text-center bg-slate-50/30">
                            <button 
                                onClick={() => { setShowNotifications(false); navigate('/notifications'); }}
                                className="text-xs text-slate-500 hover:text-blue-600 font-medium w-full py-1 transition-colors"
                            >
                                View All
                            </button>
                        </div>
                    </div>
                )}
            </div>
          </div>
          
          {/* Floating Calculator */}
          {showCalculator && <Calculator onClose={() => setShowCalculator(false)} />}
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
          <div className="max-w-7xl mx-auto w-full">
             {children}
          </div>
        </main>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}
    </div>
  );
};