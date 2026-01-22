import React, { useState, useEffect } from 'react';
import { Assignment, Subject } from '../types';
import { MOCK_ASSIGNMENTS, MOCK_SUBJECTS, updateAssignmentStatus } from '../services/mockData';
import { Book, Clock, CheckCircle2, Filter, Calendar, X, AlertCircle } from 'lucide-react';

export const StudentHomework: React.FC = () => {
  const [filter, setFilter] = useState<'ALL' | 'OPEN' | 'CLOSED'>('ALL');
  const [subjectFilter, setSubjectFilter] = useState<string>('ALL');
  const [refresh, setRefresh] = useState(0);
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  // Re-fetch assignments when refresh changes
  const filteredAssignments = MOCK_ASSIGNMENTS.filter(a => {
      const statusMatch = filter === 'ALL' || a.status === filter;
      const subjectMatch = subjectFilter === 'ALL' || a.subjectId === subjectFilter;
      return statusMatch && subjectMatch;
  }).sort((a, b) => a.dueDate.localeCompare(b.dueDate));

  const getSubjectName = (id: string) => MOCK_SUBJECTS.find(s => s.id === id)?.name || 'Unknown Subject';

  const handleMarkDone = (id: string) => {
      updateAssignmentStatus(id, 'CLOSED');
      setRefresh(prev => prev + 1);
      if (selectedAssignment && selectedAssignment.id === id) {
          setSelectedAssignment(prev => prev ? {...prev, status: 'CLOSED'} : null);
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900">Homework Hub</h2>
          <p className="text-slate-500">Manage all your assignments in one place</p>
        </div>
        <div className="flex gap-2">
            <select 
                value={subjectFilter}
                onChange={(e) => setSubjectFilter(e.target.value)}
                className="px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm text-slate-700 focus:outline-none focus:border-blue-500"
            >
                <option value="ALL">All Subjects</option>
                {MOCK_SUBJECTS.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                ))}
            </select>
            <div className="bg-white border border-slate-200 rounded-lg p-1 flex">
                <button 
                    onClick={() => setFilter('ALL')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${filter === 'ALL' ? 'bg-slate-100 text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    All
                </button>
                <button 
                    onClick={() => setFilter('OPEN')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${filter === 'OPEN' ? 'bg-blue-50 text-blue-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Pending
                </button>
                <button 
                    onClick={() => setFilter('CLOSED')}
                    className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${filter === 'CLOSED' ? 'bg-green-50 text-green-700' : 'text-slate-500 hover:text-slate-700'}`}
                >
                    Done
                </button>
            </div>
        </div>
      </div>

      <div className="grid gap-4">
          {filteredAssignments.length > 0 ? (
              filteredAssignments.map(assign => {
                  const isOverdue = new Date(assign.dueDate) < new Date() && assign.status === 'OPEN';
                  return (
                    <div key={assign.id} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-6 hover:shadow-md transition-shadow">
                        <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                                <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                                    {getSubjectName(assign.subjectId)}
                                </span>
                                {isOverdue && <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Overdue</span>}
                            </div>
                            <h3 className={`text-lg font-bold ${assign.status === 'CLOSED' ? 'text-slate-500 line-through' : 'text-slate-900'}`}>
                                {assign.title}
                            </h3>
                            <p className="text-slate-500 text-sm mt-1 line-clamp-2">{assign.description}</p>
                            
                            <div className="flex items-center gap-6 mt-4 text-sm">
                                <div className="flex items-center gap-2 text-slate-500">
                                    <Calendar size={16} />
                                    <span>Assigned: {assign.assignedDate}</span>
                                </div>
                                <div className={`flex items-center gap-2 font-medium ${isOverdue ? 'text-red-600' : 'text-orange-600'}`}>
                                    <Clock size={16} />
                                    <span>Due: {assign.dueDate}</span>
                                </div>
                            </div>
                        </div>

                        <div className="flex md:flex-col items-center justify-center border-t md:border-t-0 md:border-l border-slate-100 md:pl-6 pt-4 md:pt-0 gap-3">
                            {assign.status === 'OPEN' ? (
                                <button 
                                    onClick={() => handleMarkDone(assign.id)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:border-green-500 hover:text-green-600 hover:bg-green-50 transition-all text-sm font-medium w-full md:w-auto justify-center whitespace-nowrap"
                                >
                                    <CheckCircle2 size={18} /> Mark Done
                                </button>
                            ) : (
                                <div className="flex items-center gap-2 text-green-600 font-bold bg-green-50 px-4 py-2 rounded-lg whitespace-nowrap">
                                    <CheckCircle2 size={20} /> Completed
                                </div>
                            )}
                            <button 
                                onClick={() => setSelectedAssignment(assign)}
                                className="text-sm text-blue-600 hover:underline whitespace-nowrap"
                            >
                                View Details
                            </button>
                        </div>
                    </div>
                  );
              })
          ) : (
              <div className="text-center py-16 bg-white rounded-xl border border-slate-200 border-dashed">
                  <div className="inline-flex p-4 rounded-full bg-slate-50 text-slate-300 mb-3">
                      <Book size={32} />
                  </div>
                  <h3 className="text-lg font-medium text-slate-900">No assignments found</h3>
                  <p className="text-slate-500">Adjust filters or enjoy your free time!</p>
              </div>
          )}
      </div>

      {/* Assignment Details Modal */}
      {selectedAssignment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
            <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-start">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className="px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold">
                                {getSubjectName(selectedAssignment.subjectId)}
                            </span>
                            {selectedAssignment.status === 'CLOSED' && (
                                <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">Completed</span>
                            )}
                            {new Date(selectedAssignment.dueDate) < new Date() && selectedAssignment.status === 'OPEN' && (
                                <span className="text-xs font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Overdue</span>
                            )}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">{selectedAssignment.title}</h3>
                    </div>
                    <button onClick={() => setSelectedAssignment(null)} className="text-slate-400 hover:text-slate-600">
                        <X size={24} />
                    </button>
                </div>
                
                <div className="p-6 space-y-4">
                    <div className="flex items-center gap-6 text-sm">
                        <div className="flex flex-col gap-1">
                            <span className="text-slate-500 text-xs uppercase tracking-wider font-bold">Assigned</span>
                            <div className="flex items-center gap-2 font-medium text-slate-700">
                                <Calendar size={16} /> {selectedAssignment.assignedDate}
                            </div>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-slate-500 text-xs uppercase tracking-wider font-bold">Due Date</span>
                            <div className="flex items-center gap-2 font-medium text-orange-600">
                                <Clock size={16} /> {selectedAssignment.dueDate}
                            </div>
                        </div>
                    </div>

                    <div className="bg-slate-50 p-4 rounded-lg border border-slate-100">
                        <h4 className="text-sm font-bold text-slate-800 mb-2">Instructions</h4>
                        <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                            {selectedAssignment.description}
                        </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex gap-3">
                        <AlertCircle className="text-blue-600 shrink-0 mt-0.5" size={18} />
                        <div className="text-xs text-blue-800 leading-relaxed">
                            <p className="font-bold mb-1">Teacher's Note:</p>
                            Please submit your work before the deadline. Late submissions may result in grade deductions.
                        </div>
                    </div>
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50 flex justify-end gap-3">
                    <button 
                        onClick={() => setSelectedAssignment(null)}
                        className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                        Close
                    </button>
                    {selectedAssignment.status === 'OPEN' ? (
                        <button 
                            onClick={() => handleMarkDone(selectedAssignment.id)}
                            className="flex items-center gap-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium shadow-sm shadow-green-200"
                        >
                            <CheckCircle2 size={18} /> Mark as Done
                        </button>
                    ) : (
                        <button 
                            disabled
                            className="flex items-center gap-2 px-6 py-2 bg-slate-100 text-green-600 rounded-lg text-sm font-bold opacity-70 cursor-not-allowed"
                        >
                            <CheckCircle2 size={18} /> Completed
                        </button>
                    )}
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
