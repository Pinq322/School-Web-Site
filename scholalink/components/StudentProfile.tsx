import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_STUDENTS, MOCK_GRADES, MOCK_ATTENDANCE, MOCK_SUBJECTS } from '../services/mockData';
import { ArrowLeft, Mail, Phone, MapPin, Calendar, Book, Clock } from 'lucide-react';

export const StudentProfile: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const student = MOCK_STUDENTS.find(s => s.id === id);

  if (!student) return <div>Student not found</div>;

  const studentGrades = MOCK_GRADES.filter(g => g.studentId === student.id);
  const studentAttendance = MOCK_ATTENDANCE.filter(a => a.studentId === student.id);

  // Group grades by subject
  const gradesBySubject = MOCK_SUBJECTS.map(subject => {
      const grades = studentGrades.filter(g => g.subjectId === subject.id);
      const avg = grades.length ? Math.round(grades.reduce((acc, g) => acc + (g.score / g.maxScore) * 100, 0) / grades.length) : 0;
      return { subject, grades, avg };
  }).filter(group => group.grades.length > 0 || group.avg > 0); // Show subjects even if no grades? Let's show active ones.

  const absences = studentAttendance.filter(a => a.status === 'ABSENT').length;
  const lates = studentAttendance.filter(a => a.status === 'LATE').length;

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-500">
      {/* Header Profile Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl shadow-slate-200/50 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 group-hover:scale-[1.02] transition-transform duration-700 ease-out"></div>
        <div className="absolute top-0 left-0 w-full h-32 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20"></div>
        
        <button 
            onClick={() => navigate(-1)}
            className="absolute top-6 left-6 bg-white/20 backdrop-blur-md text-white p-2.5 rounded-full hover:bg-white/30 transition-colors z-10 border border-white/20"
        >
            <ArrowLeft size={20} />
        </button>
        
        <div className="relative flex flex-col md:flex-row items-end md:items-center gap-8 mt-12 px-8 pb-8">
            <div className="relative">
                <img 
                    src={student.avatarUrl} 
                    alt={student.name} 
                    className="w-32 h-32 rounded-full border-[6px] border-white shadow-lg object-cover bg-slate-200"
                />
                <span className="absolute bottom-2 right-2 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></span>
            </div>
            
            <div className="flex-1 mb-2 pt-4 md:pt-0">
                <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{student.name}</h1>
                <div className="flex flex-wrap gap-x-6 gap-y-2 text-slate-500 mt-3 text-sm font-medium">
                    <span className="flex items-center gap-1.5"><Mail size={16} className="text-slate-400" /> {student.email}</span>
                    <span className="flex items-center gap-1.5"><Book size={16} className="text-slate-400" /> Grade {student.gradeLevel}</span>
                    <span className="flex items-center gap-1.5"><Calendar size={16} className="text-slate-400" /> Class of 2025</span>
                </div>
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
                <div className="flex-1 md:flex-none text-center px-8 py-3 bg-red-50 rounded-2xl border border-red-100">
                    <span className="block text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Absences</span>
                    <span className="text-2xl font-bold text-slate-900">{absences}</span>
                </div>
                <div className="flex-1 md:flex-none text-center px-8 py-3 bg-yellow-50 rounded-2xl border border-yellow-100">
                    <span className="block text-xs font-bold text-yellow-600 uppercase tracking-wider mb-1">Lates</span>
                    <span className="text-2xl font-bold text-slate-900">{lates}</span>
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content: Grades */}
        <div className="lg:col-span-2 space-y-8">
            <h2 className="text-xl font-bold text-slate-900 border-l-4 border-blue-600 pl-3">Academic Performance</h2>
            
            {gradesBySubject.map(({ subject, grades, avg }) => (
                <div key={subject.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                    <div className="bg-slate-50/50 px-6 py-4 flex justify-between items-center border-b border-slate-100">
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">
                                {subject.name.charAt(0)}
                            </div>
                            <h3 className="font-bold text-slate-900">{subject.name}</h3>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border ${avg >= 80 ? 'bg-green-50 text-green-700 border-green-100' : 'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                            Average: {avg}%
                        </span>
                    </div>
                    <div className="divide-y divide-slate-100">
                        {grades.length > 0 ? grades.map(grade => (
                            <div key={grade.id} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                                <div>
                                    <p className="font-bold text-slate-800 text-sm">{grade.title || grade.type}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-medium px-2 py-0.5 bg-slate-100 rounded text-slate-500">{grade.type}</span>
                                        <span className="text-xs text-slate-400">{grade.date}</span>
                                    </div>
                                    {grade.feedback && <p className="text-xs text-slate-600 mt-2 bg-blue-50/50 p-2 rounded-lg italic border border-blue-100">"{grade.feedback}"</p>}
                                </div>
                                <div className="text-right">
                                    <span className="block font-bold text-slate-900 text-lg">{grade.score}<span className="text-slate-400 text-sm">/{grade.maxScore}</span></span>
                                    <div className="w-16 h-1.5 bg-slate-100 rounded-full mt-1 ml-auto overflow-hidden">
                                        <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(grade.score/grade.maxScore)*100}%` }}></div>
                                    </div>
                                </div>
                            </div>
                        )) : (
                            <div className="px-6 py-8 text-center text-slate-400 text-sm italic">No grades recorded yet.</div>
                        )}
                    </div>
                </div>
            ))}
        </div>

        {/* Sidebar: Attendance History & Notes */}
        <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
                <h3 className="font-bold text-slate-900 mb-6 flex items-center gap-2">
                    <Clock size={20} className="text-slate-400" /> Recent Attendance
                </h3>
                <div className="space-y-4">
                    {studentAttendance.length > 0 ? studentAttendance.slice(-5).map(att => (
                        <div key={att.id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-slate-50 transition-colors border border-transparent hover:border-slate-100">
                            <div className={`w-3 h-3 rounded-full ring-4 ${att.status === 'PRESENT' ? 'bg-green-500 ring-green-50' : att.status === 'ABSENT' ? 'bg-red-500 ring-red-50' : 'bg-yellow-500 ring-yellow-50'}`} />
                            <div className="flex-1">
                                <p className="text-sm font-bold text-slate-900">{att.date}</p>
                                <p className="text-xs text-slate-500 font-medium">{MOCK_SUBJECTS.find(s => s.id === att.subjectId)?.name}</p>
                            </div>
                            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{att.status}</span>
                        </div>
                    )) : (
                        <p className="text-sm text-slate-400 text-center py-4">No attendance records.</p>
                    )}
                </div>
            </div>
            
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl border border-slate-700 p-6 text-white shadow-lg">
                <h3 className="font-bold text-white mb-4">Teacher's Comments</h3>
                <div className="space-y-4">
                    <div className="p-4 bg-white/10 backdrop-blur-md rounded-xl text-sm text-blue-50 leading-relaxed border border-white/10">
                        "Sarah is showing great improvement in Algebra. She participates actively in class discussions."
                        <div className="text-xs text-blue-200 font-bold mt-3 flex items-center gap-2">
                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-[10px]">W</div>
                            Mr. Wilson
                        </div>
                    </div>
                </div>
                <button className="w-full mt-6 py-2 text-sm text-white font-medium hover:bg-white/10 rounded-lg transition-colors border border-white/20 hover:border-white/40">
                    + Add Comment
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};