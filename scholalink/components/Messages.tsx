import React, { useState } from 'react';
import { User, Message } from '../types';
import { MOCK_USERS, MOCK_MESSAGES, sendSystemMessage } from '../services/mockData';
import { Search, Send, MoreVertical, CheckCheck, MessageCircle } from 'lucide-react';

interface MessagesProps {
  user: User;
}

export const Messages: React.FC<MessagesProps> = ({ user }) => {
  const [selectedContactId, setSelectedContactId] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  // We use this state to force re-renders when a message is sent
  const [chatUpdate, setChatUpdate] = useState(0); 
  
  // Get unique contacts
  const contactIds = Array.from(new Set([
    ...MOCK_MESSAGES.filter(m => m.senderId === user.id).map(m => m.receiverId),
    ...MOCK_MESSAGES.filter(m => m.receiverId === user.id).map(m => m.senderId),
    'u1', 'u3', 'u2' // Force contacts
  ])).filter(id => id !== user.id);

  const contacts = contactIds.map(id => MOCK_USERS.find(u => u.id === id)).filter(Boolean) as User[];
  
  // Filter messages for selected contact (Read directly from MOCK_MESSAGES to get updates)
  const activeMessages = selectedContactId 
    ? MOCK_MESSAGES.filter(m => 
        (m.senderId === user.id && m.receiverId === selectedContactId) || 
        (m.senderId === selectedContactId && m.receiverId === user.id)
      ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
    : [];

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedContactId) return;

    const newMsg: Message = {
        id: `msg-${Date.now()}`,
        senderId: user.id,
        receiverId: selectedContactId,
        content: newMessage,
        timestamp: new Date().toISOString(),
        read: false
    };
    
    // Use helper to push to mock data
    sendSystemMessage(newMsg);
    
    setNewMessage('');
    setChatUpdate(prev => prev + 1); // Trigger re-render
  };

  return (
    <div className="flex h-[calc(100vh-140px)] bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm animate-in fade-in duration-300">
      {/* Sidebar - Contact List */}
      <div className="w-full md:w-80 border-r border-slate-200 flex flex-col">
        <div className="p-4 border-b border-slate-200">
            <h2 className="text-lg font-bold text-slate-900 mb-4">Messages</h2>
            <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                <input 
                    type="text" 
                    placeholder="Search people..." 
                    className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
            </div>
        </div>
        <div className="flex-1 overflow-y-auto">
            {contacts.map(contact => {
                const msgs = MOCK_MESSAGES.filter(m => 
                    (m.senderId === user.id && m.receiverId === contact.id) || 
                    (m.senderId === contact.id && m.receiverId === user.id)
                );
                const lastMsg = msgs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];
                const hasSentMessage = msgs.some(m => m.senderId === contact.id);

                return (
                    <div 
                        key={contact.id}
                        onClick={() => setSelectedContactId(contact.id)}
                        className={`p-4 flex gap-3 hover:bg-slate-50 cursor-pointer transition-colors border-b border-slate-50 ${selectedContactId === contact.id ? 'bg-blue-50/50' : ''}`}
                    >
                        <div className="relative">
                            <img src={contact.avatarUrl} alt="" className="w-10 h-10 rounded-full bg-slate-200 object-cover" />
                            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                            {/* Emoji indicator for people who have written */}
                            {hasSentMessage && (
                                <span className="absolute -top-1 -left-1 flex items-center justify-center w-5 h-5 bg-white rounded-full shadow-sm text-xs border border-slate-100">
                                    💬
                                </span>
                            )}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start mb-0.5">
                                <h3 className="text-sm font-semibold text-slate-900 truncate">{contact.name}</h3>
                                {lastMsg && <span className="text-xs text-slate-400">{new Date(lastMsg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>}
                            </div>
                            <p className="text-xs text-slate-500 truncate">{lastMsg ? lastMsg.content : 'Start a conversation'}</p>
                        </div>
                    </div>
                );
            })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-slate-50/30">
        {selectedContactId ? (
            <>
                {/* Chat Header */}
                <div className="p-4 border-b border-slate-200 bg-white flex justify-between items-center shadow-sm z-10">
                    <div className="flex items-center gap-3">
                        <img 
                            src={contacts.find(c => c.id === selectedContactId)?.avatarUrl} 
                            alt="" 
                            className="w-9 h-9 rounded-full bg-slate-200 object-cover" 
                        />
                        <div>
                            <h3 className="text-sm font-bold text-slate-900">{contacts.find(c => c.id === selectedContactId)?.name}</h3>
                            <p className="text-xs text-slate-500 capitalize">{contacts.find(c => c.id === selectedContactId)?.role.toLowerCase()}</p>
                        </div>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600"><MoreVertical size={20} /></button>
                </div>

                {/* Messages Feed */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    {activeMessages.length > 0 ? (
                        activeMessages.map(msg => {
                            const isMe = msg.senderId === user.id;
                            return (
                                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${
                                        isMe 
                                            ? 'bg-blue-600 text-white rounded-tr-none' 
                                            : 'bg-white text-slate-800 border border-slate-200 rounded-tl-none'
                                    }`}>
                                        <p>{msg.content}</p>
                                        <div className={`text-[10px] mt-1 flex items-center justify-end gap-1 ${isMe ? 'text-blue-200' : 'text-slate-400'}`}>
                                            {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            {isMe && <CheckCheck size={12} />}
                                        </div>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-400">
                            <p className="text-sm">No messages yet.</p>
                            <p className="text-xs">Say hello!</p>
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="p-4 bg-white border-t border-slate-200">
                    <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input 
                            type="text" 
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..." 
                            className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                        <button 
                            type="submit" 
                            disabled={!newMessage.trim()}
                            className="p-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            <Send size={18} />
                        </button>
                    </form>
                </div>
            </>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 text-slate-300">
                    <MessageCircle size={32} />
                </div>
                <h3 className="text-lg font-semibold text-slate-700">Your Messages</h3>
                <p className="text-sm">Select a contact to start chatting</p>
            </div>
        )}
      </div>
    </div>
  );
};