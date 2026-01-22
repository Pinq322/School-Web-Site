import React, { useState } from 'react';
import { Student, Attendance } from '../types';
import { Calendar, Save, CheckCircle2, XCircle, Clock, AlertCircle } from 'lucide-react';
import { MOCK_ATTENDANCE, updateStudentAttendance } from '../services/mockData';

interface AttendanceTrackerProps {
  students: Student[];
  subjectId: string;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({ students, subjectId }) => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [attendance, setAttendance] = useState<Record<string, Attendance['status']>>(() => {
    // Initialize with default 'PRESENT' or existing mock data
    const initial: Record<string, Attendance['status']> = {};
    students.forEach(s => {
      const existing = MOCK_ATTENDANCE.find(a => a.studentId === s.id && a.subjectId === subjectId && a.date === date);
      initial[s.id] = existing ? existing.status : 'PRESENT';
    });
    return initial;
  });

  const handleStatusChange = (studentId: string, status: Attendance['status']) => {
    setAttendance(prev => ({ ...prev, [studentId]: status }));
  };

  const handleSave = () => {
    students.forEach(student => {
        const status = attendance[student.id];
        if (status) {
            updateStudentAttendance(student.id, subjectId, date, status);
        }
    });
    alert('Attendance saved successfully!');
  };

  const getStatusColor = (status: Attendance['status']) => {
    switch (status) {
      case 'PRESENT': return 'bg-green-100 text-green-700 border-green-200';
      case 'ABSENT': return 'bg-red-100 text-red-700 border-red-200';
      case 'LATE': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'EXCUSED': return 'bg-blue-100 text-blue-700 border-blue-200';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
            <Calendar size={20} />
          </div>
          <input 
            type="date" 
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="border-none bg-transparent text-lg font-semibold text-slate-900 focus:outline-none cursor-pointer"
          />
        </div>
        
        <div className="flex gap-2">
           <div className="text-sm text-slate-500 flex items-center gap-4 mr-4">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500"></span> Present</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500"></span> Absent</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Late</span>
           </div>
           <button 
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors shadow-sm"
           >
              <Save size={16} /> Save Roll
           </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Student</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-center">Status</th>
              <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Note</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {students.map(student => (
              <tr key={student.id} className="hover:bg-slate-50/50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                     <img src={student.avatarUrl} alt="" className="w-8 h-8 rounded-full object-cover" />
                     <span className="font-medium text-slate-900">{student.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-center gap-2">
                    {[
                      { val: 'PRESENT', icon: CheckCircle2, label: 'Present' },
                      { val: 'ABSENT', icon: XCircle, label: 'Absent' },
                      { val: 'LATE', icon: Clock, label: 'Late' },
                      { val: 'EXCUSED', icon: AlertCircle, label: 'Excused' }
                    ].map((opt) => {
                      const isSelected = attendance[student.id] === opt.val;
                      const Icon = opt.icon;
                      return (
                        <button
                          key={opt.val}
                          onClick={() => handleStatusChange(student.id, opt.val as any)}
                          className={`p-2 rounded-lg transition-all ${
                            isSelected 
                              ? getStatusColor(opt.val as any) + ' ring-2 ring-offset-1 ring-slate-100' 
                              : 'text-slate-400 hover:bg-slate-100'
                          }`}
                          title={opt.label}
                        >
                          <Icon size={20} strokeWidth={isSelected ? 2.5 : 2} />
                        </button>
                      );
                    })}
                  </div>
                </td>
                <td className="px-6 py-4 text-right">
                    <input 
                        type="text" 
                        placeholder="Add note..." 
                        className="text-sm border-b border-transparent focus:border-slate-300 focus:outline-none bg-transparent text-right w-full"
                    />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};