import React, { useState } from 'react';
import { X, Calendar, BookOpen, FileText, CheckCircle2, MessageSquare } from 'lucide-react';
import { Lesson } from '../types';

interface LessonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (lesson: { date: string; topic: string; hasHomework: boolean; homeworkTitle?: string; status: Lesson['status']; notes?: string }) => void;
}

export const LessonModal: React.FC<LessonModalProps> = ({ isOpen, onClose, onSave }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [topic, setTopic] = useState('');
  const [status, setStatus] = useState<Lesson['status']>('PLANNED');
  const [notes, setNotes] = useState('');
  const [hasHomework, setHasHomework] = useState(false);
  const [homeworkTitle, setHomeworkTitle] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ date, topic, hasHomework, homeworkTitle, status, notes });
    onClose();
    // Reset form
    setTopic('');
    setHasHomework(false);
    setHomeworkTitle('');
    setStatus('PLANNED');
    setNotes('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Plan / Edit Lesson</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
            <X size={20} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Date</label>
                <div className="relative">
                    <Calendar className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input 
                    type="date" 
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>
            </div>
             <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                <div className="relative">
                    <select 
                        value={status} 
                        onChange={(e) => setStatus(e.target.value as any)}
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    >
                        <option value="PLANNED">Planned</option>
                        <option value="COMPLETED">Completed</option>
                        <option value="CANCELLED">Cancelled</option>
                    </select>
                </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Lesson Topic</label>
            <div className="relative">
                <BookOpen className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <input 
                type="text" 
                required
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                placeholder="e.g., Intro to Thermodynamics"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Lesson Notes (Optional)</label>
            <div className="relative">
                <MessageSquare className="absolute left-3 top-2.5 text-slate-400" size={18} />
                <textarea 
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Brief summary of what was covered..."
                    className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
                />
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 mt-2">
            <label className="flex items-center gap-2 cursor-pointer mb-2 mt-2">
                <input 
                    type="checkbox" 
                    checked={hasHomework} 
                    onChange={(e) => setHasHomework(e.target.checked)}
                    className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-slate-700">Assign Homework</span>
            </label>
            
            {hasHomework && (
                <div className="animate-in slide-in-from-top-2 duration-200">
                     <div className="relative">
                        <FileText className="absolute left-3 top-2.5 text-slate-400" size={18} />
                        <input 
                        type="text" 
                        required={hasHomework}
                        value={homeworkTitle}
                        onChange={(e) => setHomeworkTitle(e.target.value)}
                        placeholder="Homework description..."
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                        />
                    </div>
                </div>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button 
              type="button" 
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="px-6 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-sm shadow-blue-200 transition-colors"
            >
              Save Lesson
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};