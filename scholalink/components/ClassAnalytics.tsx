import React from 'react';
import { Subject, Grade, Student } from '../types';
import { MOCK_GRADES, MOCK_ATTENDANCE, MOCK_STUDENTS } from '../services/mockData';
import { PieChart, BarChart, TrendingUp, Users, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ClassAnalyticsProps {
  subject: Subject;
}

export const ClassAnalytics: React.FC<ClassAnalyticsProps> = ({ subject }) => {
  // 1. Grade Distribution Calculation
  const classGrades = MOCK_GRADES.filter(g => g.subjectId === subject.id);
  const gradeDistribution = {
    A: 0, B: 0, C: 0, D: 0, F: 0
  };

  classGrades.forEach(g => {
    const pct = (g.score / g.maxScore) * 100;
    if (pct >= 90) gradeDistribution.A++;
    else if (pct >= 80) gradeDistribution.B++;
    else if (pct >= 70) gradeDistribution.C++;
    else if (pct >= 60) gradeDistribution.D++;
    else gradeDistribution.F++;
  });

  const totalGrades = classGrades.length || 1;
  const maxBarHeight = Math.max(...Object.values(gradeDistribution));

  // 2. Attendance Summary
  const classAttendance = MOCK_ATTENDANCE.filter(a => a.subjectId === subject.id);
  const presentCount = classAttendance.filter(a => a.status === 'PRESENT').length;
  const absentCount = classAttendance.filter(a => a.status === 'ABSENT').length;
  const lateCount = classAttendance.filter(a => a.status === 'LATE').length;
  const totalAttendance = classAttendance.length || 1;

  // 3. At Risk Students (Simple logic: Avg < 70)
  const atRiskStudents = MOCK_STUDENTS.map(s => {
      const studentGrades = classGrades.filter(g => g.studentId === s.id);
      if (studentGrades.length === 0) return null;
      const avg = studentGrades.reduce((a, b) => a + (b.score/b.maxScore)*100, 0) / studentGrades.length;
      return avg < 70 ? { ...s, avg: Math.round(avg) } : null;
  }).filter(Boolean) as (Student & { avg: number })[];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Grade Distribution Chart */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <BarChart size={20} />
                    </div>
                    <h3 className="font-bold text-slate-900">Grade Distribution</h3>
                </div>
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                    Performance
                </div>
            </div>
            
            <div className="flex items-end justify-between h-48 px-4 border-b border-slate-200 pb-2">
                {Object.entries(gradeDistribution).map(([label, count]) => {
                    const heightPct = maxBarHeight > 0 ? (count / maxBarHeight) * 100 : 0;
                    return (
                        <div key={label} className="flex flex-col items-center gap-2 w-full group cursor-default">
                            <div className="relative w-full px-2 h-full flex items-end justify-center">
                                <div 
                                    style={{ height: `${Math.max(heightPct, 5)}%` }}
                                    className={`w-full max-w-[40px] rounded-t-md transition-all duration-500 relative ${
                                        label === 'A' ? 'bg-emerald-500' :
                                        label === 'B' ? 'bg-blue-500' :
                                        label === 'C' ? 'bg-yellow-500' :
                                        label === 'D' ? 'bg-orange-500' : 'bg-red-500'
                                    }`}
                                >
                                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                                        {count} Students
                                    </div>
                                </div>
                            </div>
                            <span className="text-xs font-bold text-slate-600">{label}</span>
                        </div>
                    );
                })}
            </div>
            <div className="mt-4 flex justify-between items-center text-sm text-slate-500">
                <span>Total Graded: <span className="font-semibold text-slate-900">{totalGrades}</span></span>
                <span className="text-emerald-600 font-medium text-xs bg-emerald-50 px-2 py-1 rounded-full">+4% vs last month</span>
            </div>
        </div>

        {/* Attendance Breakdown */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
             <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                        <PieChart size={20} />
                    </div>
                    <h3 className="font-bold text-slate-900">Attendance Overview</h3>
                </div>
            </div>
            
            <div className="flex items-center justify-center gap-8 py-4">
                {/* Circular Indicator Simulation */}
                <div className="relative w-32 h-32 rounded-full border-8 border-slate-50 flex items-center justify-center">
                     <svg className="absolute inset-0 w-full h-full -rotate-90 text-blue-500" viewBox="0 0 36 36">
                        <path
                            className="text-slate-100"
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        />
                        <path
                            className="text-blue-600"
                            strokeDasharray={`${(presentCount/totalAttendance)*100}, 100`}
                            d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="3"
                        />
                     </svg>
                     <div className="text-center">
                         <span className="block text-2xl font-bold text-slate-900">{Math.round((presentCount/totalAttendance)*100)}%</span>
                         <span className="text-[10px] text-slate-500 uppercase font-bold tracking-wide">Present</span>
                     </div>
                </div>

                <div className="space-y-4">
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-blue-600 ring-4 ring-blue-50"></span>
                        <div className="text-sm">
                            <span className="block font-bold text-slate-700">{presentCount} Present</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-red-500 ring-4 ring-red-50"></span>
                        <div className="text-sm">
                            <span className="block font-bold text-slate-700">{absentCount} Absent</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <span className="w-2 h-2 rounded-full bg-yellow-500 ring-4 ring-yellow-50"></span>
                        <div className="text-sm">
                            <span className="block font-bold text-slate-700">{lateCount} Late</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        {/* At-Risk Students */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm md:col-span-2">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                        <AlertTriangle size={20} />
                    </div>
                    <h3 className="font-bold text-slate-900">Students Needing Attention</h3>
                </div>
                <button className="text-sm text-blue-600 font-medium hover:underline">View Detailed Report</button>
            </div>
            
            {atRiskStudents.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {atRiskStudents.map(student => (
                        <div key={student.id} className="p-4 rounded-xl bg-red-50/50 border border-red-100 flex items-center gap-3 hover:bg-red-50 transition-colors">
                            <img src={student.avatarUrl} alt="" className="w-10 h-10 rounded-full bg-red-100 object-cover border border-red-200" />
                            <div>
                                <p className="font-bold text-slate-900">{student.name}</p>
                                <p className="text-xs text-red-700 font-bold bg-red-100 px-2 py-0.5 rounded-full inline-block mt-1">Avg: {student.avg}%</p>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="p-12 text-center bg-slate-50/50 rounded-xl border border-slate-100 border-dashed">
                    <p className="text-slate-500 flex flex-col items-center justify-center gap-2">
                        <CheckCircle2 size={32} className="text-emerald-500" /> 
                        <span className="font-medium text-slate-900">All students are on track!</span>
                        <span className="text-sm">No students are currently below the 70% threshold.</span>
                    </p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};