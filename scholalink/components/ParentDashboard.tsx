import React from 'react';
import { User, Student } from '../types';
import { MOCK_STUDENTS, getStudentAverage, MOCK_ATTENDANCE } from '../services/mockData';
import { useNavigate } from 'react-router-dom';
import { Users, TrendingUp, Calendar, AlertCircle, ArrowRight, User as UserIcon } from 'lucide-react';

interface ParentDashboardProps {
  user: User;
}

export const ParentDashboard: React.FC<ParentDashboardProps> = ({ user }) => {
  const navigate = useNavigate();
  // Find children associated with this parent
  const myChildren = MOCK_STUDENTS.filter(s => s.parentId === user.id);

  if (myChildren.length === 0) {
    return (
        <div className="flex flex-col items-center justify-center h-64 text-center">
            <div className="p-4 bg-slate-100 rounded-full mb-4 text-slate-400">
                <Users size={32} />
            </div>
            <h2 className="text-xl font-bold text-slate-900">No children linked</h2>
            <p className="text-slate-500 mt-2">Please contact the school administration to link your account.</p>
        </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Parent Portal</h2>
        <p className="text-slate-500">Overview of your children's academic progress</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {myChildren.map(child => {
          const overallAvg = getStudentAverage(child.id);
          const absences = MOCK_ATTENDANCE.filter(a => a.studentId === child.id && a.status === 'ABSENT').length;
          
          return (
            <div key={child.id} className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
               {/* Child Header */}
               <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 text-white relative">
                   <div className="flex items-center gap-4">
                       <img 
                           src={child.avatarUrl} 
                           alt={child.name} 
                           className="w-16 h-16 rounded-full border-2 border-white object-cover bg-slate-200"
                       />
                       <div>
                           <h3 className="text-lg font-bold">{child.name}</h3>
                           <p className="text-blue-100 text-sm">Grade {child.gradeLevel}</p>
                       </div>
                   </div>
                   <button 
                       onClick={() => navigate(`/student/${child.id}`)}
                       className="absolute bottom-6 right-6 p-2 bg-white/20 hover:bg-white/30 rounded-lg backdrop-blur-sm transition-colors"
                       title="View Full Profile"
                   >
                       <ArrowRight size={20} />
                   </button>
               </div>

               {/* Key Stats */}
               <div className="p-6 grid grid-cols-2 gap-4">
                   <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                       <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                           <TrendingUp size={16} className="text-blue-600" />
                           GPA / Avg
                       </div>
                       <div className={`text-2xl font-bold ${overallAvg >= 80 ? 'text-green-600' : 'text-slate-900'}`}>
                           {overallAvg}%
                       </div>
                   </div>
                   <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                        <div className="flex items-center gap-2 text-sm text-slate-500 mb-1">
                            <AlertCircle size={16} className={absences > 0 ? 'text-orange-500' : 'text-green-500'} />
                            Absences
                        </div>
                        <div className="text-2xl font-bold text-slate-900">
                            {absences} <span className="text-xs font-normal text-slate-400">days</span>
                        </div>
                   </div>
               </div>

               {/* Quick Links */}
               <div className="px-6 pb-6 pt-0 space-y-2">
                   <button 
                        onClick={() => navigate(`/student/${child.id}`)}
                        className="w-full flex items-center justify-between p-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100"
                   >
                       <span className="flex items-center gap-2"><Calendar size={16} className="text-slate-400" /> View Attendance</span>
                       <ArrowRight size={14} className="text-slate-400" />
                   </button>
                   <button 
                        onClick={() => navigate(`/student/${child.id}`)}
                        className="w-full flex items-center justify-between p-3 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors border border-transparent hover:border-slate-100"
                   >
                       <span className="flex items-center gap-2"><UserIcon size={16} className="text-slate-400" /> View Teachers</span>
                       <ArrowRight size={14} className="text-slate-400" />
                   </button>
               </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};