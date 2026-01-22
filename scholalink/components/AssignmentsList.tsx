import React, { useState } from 'react';
import { Assignment, Subject } from '../types';
import { MOCK_ASSIGNMENTS } from '../services/mockData';
import { Plus, Calendar, CheckCircle, Clock } from 'lucide-react';

export const AssignmentsList: React.FC<{ subject: Subject }> = ({ subject }) => {
    const assignments = MOCK_ASSIGNMENTS.filter(a => a.subjectId === subject.id);
    const [showForm, setShowForm] = useState(false);

    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-bold text-slate-800">Assignments</h3>
                <button 
                    onClick={() => setShowForm(!showForm)}
                    className="flex items-center gap-2 px-3 py-1.5 text-sm bg-blue-50 text-blue-600 rounded-lg font-medium hover:bg-blue-100 transition-colors"
                >
                    <Plus size={16} /> New Assignment
                </button>
            </div>

            {showForm && (
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-4">
                    <p className="text-sm text-slate-500 mb-2">Create new assignment (Mock Form)</p>
                    <input type="text" placeholder="Title" className="w-full p-2 mb-2 rounded border border-slate-300 text-sm" />
                    <div className="flex justify-end gap-2">
                         <button onClick={() => setShowForm(false)} className="text-xs text-slate-500 px-3 py-1">Cancel</button>
                         <button onClick={() => setShowForm(false)} className="text-xs bg-blue-600 text-white px-3 py-1 rounded">Create</button>
                    </div>
                </div>
            )}

            <div className="grid gap-4">
                {assignments.length > 0 ? assignments.map(assign => (
                    <div key={assign.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <div className={`p-3 rounded-xl ${assign.status === 'OPEN' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
                                <Book size={20} />
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900">{assign.title}</h4>
                                <p className="text-sm text-slate-600 mt-1 max-w-xl">{assign.description}</p>
                                <div className="flex items-center gap-4 mt-3 text-xs text-slate-500">
                                    <span className="flex items-center gap-1"><Calendar size={12} /> Assigned: {assign.assignedDate}</span>
                                    <span className="flex items-center gap-1 text-orange-600 font-medium"><Clock size={12} /> Due: {assign.dueDate}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center gap-2 md:flex-col md:items-end">
                            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${
                                assign.status === 'OPEN' ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                            }`}>
                                {assign.status}
                            </span>
                            <button className="text-sm text-blue-600 font-medium hover:underline">View Submissions</button>
                        </div>
                    </div>
                )) : (
                    <div className="text-center py-10 bg-white rounded-xl border border-slate-200 border-dashed">
                        <p className="text-slate-400">No assignments created yet.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

import { Book } from 'lucide-react';