import React, { useState } from 'react';
import { User, Notification } from '../types';
import { MOCK_NOTIFICATIONS } from '../services/mockData';
import { Bell, Check, Filter, BookOpen, AlertCircle, Info } from 'lucide-react';

interface NotificationsPageProps {
  user: User;
}

export const NotificationsPage: React.FC<NotificationsPageProps> = ({ user }) => {
  const [filter, setFilter] = useState<'ALL' | 'UNREAD' | 'GRADE' | 'ASSIGNMENT' | 'SYSTEM'>('ALL');
  const [notifications, setNotifications] = useState<Notification[]>(MOCK_NOTIFICATIONS);

  const filteredNotifications = notifications.filter(n => {
    if (filter === 'ALL') return true;
    if (filter === 'UNREAD') return !n.read;
    return n.type === filter;
  });

  const markAllRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const getIcon = (type: Notification['type']) => {
    switch (type) {
        case 'GRADE': return <BookOpen size={20} className="text-blue-600" />;
        case 'ASSIGNMENT': return <AlertCircle size={20} className="text-orange-600" />;
        case 'SYSTEM': return <Info size={20} className="text-purple-600" />;
        default: return <Bell size={20} className="text-slate-600" />;
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Notifications</h2>
          <p className="text-slate-500">Stay updated with grades, tasks, and announcements.</p>
        </div>
        <div className="flex items-center gap-3">
             <button 
                onClick={markAllRead}
                className="text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors"
             >
                Mark all as read
             </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Filters */}
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex flex-wrap gap-2">
            {[
                { label: 'All', val: 'ALL' },
                { label: 'Unread', val: 'UNREAD' },
                { label: 'Grades', val: 'GRADE' },
                { label: 'Assignments', val: 'ASSIGNMENT' },
                { label: 'System', val: 'SYSTEM' },
            ].map(f => (
                <button
                    key={f.val}
                    onClick={() => setFilter(f.val as any)}
                    className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors border ${
                        filter === f.val 
                        ? 'bg-white border-slate-300 text-slate-900 shadow-sm' 
                        : 'bg-transparent border-transparent text-slate-500 hover:bg-slate-200/50'
                    }`}
                >
                    {f.label}
                </button>
            ))}
        </div>

        {/* List */}
        <div className="divide-y divide-slate-100">
            {filteredNotifications.length > 0 ? (
                filteredNotifications.map(notification => (
                    <div 
                        key={notification.id}
                        onClick={() => markAsRead(notification.id)}
                        className={`p-5 flex gap-4 hover:bg-slate-50 transition-colors cursor-pointer group ${!notification.read ? 'bg-blue-50/20' : ''}`}
                    >
                        <div className={`mt-1 p-2 rounded-lg bg-white border border-slate-100 shadow-sm h-fit ${!notification.read ? 'ring-2 ring-blue-100' : ''}`}>
                            {getIcon(notification.type)}
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <h4 className={`text-sm font-semibold ${!notification.read ? 'text-slate-900' : 'text-slate-600'}`}>
                                    {notification.title}
                                </h4>
                                <span className="text-xs text-slate-400 whitespace-nowrap ml-2">{notification.date}</span>
                            </div>
                            <p className="text-sm text-slate-600 mt-1 leading-relaxed">
                                {notification.message}
                            </p>
                        </div>
                        {!notification.read && (
                            <div className="self-center">
                                <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                            </div>
                        )}
                    </div>
                ))
            ) : (
                <div className="p-12 text-center text-slate-400">
                    <div className="inline-flex p-4 rounded-full bg-slate-50 mb-3 text-slate-300">
                        <Bell size={32} />
                    </div>
                    <p>No notifications found matching your filter.</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};