import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MOCK_SUBJECTS, MOCK_STUDENTS, MOCK_GRADES, MOCK_ATTENDANCE, getStudentAverage } from '../services/mockData';
import { ArrowLeft, Search, MoreHorizontal, User as UserIcon, Download, Sparkles, Plus, ClipboardList, BookOpen, CalendarCheck, Table2, BarChart2, Loader2, ArrowRight } from 'lucide-react';
import { generateStudentInsight } from '../services/geminiService';
import { exportToCSV } from '../services/exportService';
import { GradeEntryModal } from './GradeEntryModal';
import { AttendanceTracker } from './AttendanceTracker';
import { AssignmentsList } from './AssignmentsList';
import { TeacherJournal } from './TeacherJournal';
import { ClassAnalytics } from './ClassAnalytics';

export const ClassDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const subject = MOCK_SUBJECTS.find(s => s.id === id);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [activeTab, setActiveTab] = useState<'journal' | 'students' | 'assignments' | 'attendance' | 'analytics'>('journal');
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);

  if (!subject) return <div>Class not found</div>;

  // Filter students based on the subject's grade level and search term
  const students = MOCK_STUDENTS.filter(s => 
    s.gradeLevel === subject.gradeLevel && 
    s.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateInsight = async (studentId: string, studentName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedStudent(studentId);
    setLoadingInsight(true);
    setInsight(null);
    
    const studentGrades = MOCK_GRADES.filter(g => g.studentId === studentId && g.subjectId === subject.id);
    const result = await generateStudentInsight(studentName, subject.name, studentGrades);
    setInsight(result);
    setLoadingInsight(false);
  };

  const handleExportReport = () => {
    setIsExporting(true);
    // Simulate generation delay
    setTimeout(() => {
        const reportData = students.map(student => {
            const studentGrades = MOCK_GRADES.filter(g => g.studentId === student.id && g.subjectId === subject.id);
            const studentAttendance = MOCK_ATTENDANCE.filter(a => a.studentId === student.id && a.subjectId === subject.id);
            
            const avg = getStudentAverage(student.id, subject.id);
            const absences = studentAttendance.filter(a => a.status === 'ABSENT').length;
            const lates = studentAttendance.filter(a => a.status === 'LATE').length;

            return {
                StudentId: student.id,
                Name: student.name,
                Email: student.email,
                GradeLevel: student.gradeLevel,
                AverageScore: `${avg}%`,
                Absences: absences,
                Lates: lates,
                LastGradeDate: studentGrades.length > 0 ? studentGrades[studentGrades.length - 1].date : 'N/A'
            };
        });

        exportToCSV(reportData, `${subject.name.replace(/\s+/g, '_')}_Report`);
        setIsExporting(false);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Grade Entry Modal */}
      <GradeEntryModal 
        isOpen={isGradeModalOpen} 
        onClose={() => setIsGradeModalOpen(false)}
        students={students}
        subject={subject}
      />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/')}
            className="p-2 hover:bg-slate-100 rounded-lg text-slate-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-bold text-slate-900">{subject.name}</h2>
            <p className="text-slate-500 text-sm">{subject.schedule} • {subject.room}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
            <button 
                onClick={handleExportReport}
                disabled={isExporting}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-50 disabled:opacity-70 transition-all"
            >
                {isExporting ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                {isExporting ? 'Generating...' : 'Export Report'}
            </button>
            <button 
                onClick={() => setIsGradeModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 shadow-sm shadow-blue-200"
            >
                <Plus size={16} /> Add Grade
            </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-slate-200 overflow-x-auto">
        <nav className="flex space-x-8 min-w-max" aria-label="Tabs">
            {[
                { id: 'journal', label: 'Journal', icon: Table2 },
                { id: 'students', label: 'Students', icon: UserIcon },
                { id: 'assignments', label: 'Assignments', icon: BookOpen },
                { id: 'attendance', label: 'Attendance', icon: CalendarCheck },
                { id: 'analytics', label: 'Analytics', icon: BarChart2 },
            ].map((tab) => {
                const Icon = tab.icon;
                return (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`
                            flex items-center gap-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors whitespace-nowrap
                            ${activeTab === tab.id 
                                ? 'border-blue-500 text-blue-600' 
                                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                        `}
                    >
                        <Icon size={18} />
                        {tab.label}
                    </button>
                )
            })}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {activeTab === 'journal' && (
            <TeacherJournal subject={subject} />
        )}

        {activeTab === 'analytics' && (
            <ClassAnalytics subject={subject} />
        )}

        {activeTab === 'students' && (
            <div className="space-y-4 animate-in fade-in duration-300">
                {/* Search Bar */}
                <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="relative w-full md:w-96">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                        type="text" 
                        placeholder="Search students..." 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Student</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Grade Level</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Attendance</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Current Avg</th>
                        <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {students.length > 0 ? students.map(student => {
                        const avg = getStudentAverage(student.id, subject.id);
                        const isSelected = selectedStudent === student.id;
                        
                        return (
                            <React.Fragment key={student.id}>
                                <tr 
                                    onClick={() => navigate(`/student/${student.id}`)}
                                    className="hover:bg-slate-50/50 transition-colors group cursor-pointer"
                                >
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                    {student.avatarUrl ? (
                                        <img src={student.avatarUrl} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-200" />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-slate-200 flex items-center justify-center text-slate-500">
                                            <UserIcon size={18} />
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-sm font-medium text-slate-900 group-hover:text-blue-600 transition-colors">{student.name}</p>
                                        <p className="text-xs text-slate-500">{student.email}</p>
                                    </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-slate-600">{student.gradeLevel}th Grade</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                    95%
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2">
                                    <span className={`font-semibold ${avg >= 90 ? 'text-green-600' : avg >= 80 ? 'text-blue-600' : 'text-yellow-600'}`}>
                                        {avg}%
                                    </span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button 
                                            onClick={(e) => handleGenerateInsight(student.id, student.name, e)}
                                            className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                                            title="AI Insight"
                                        >
                                            <Sparkles size={18} />
                                        </button>
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); navigate(`/student/${student.id}`); }}
                                            className="p-2 text-slate-400 hover:text-blue-600 hover:bg-slate-100 rounded-lg transition-colors"
                                        >
                                            <ArrowRight size={18} />
                                        </button>
                                    </div>
                                </td>
                                </tr>
                                {isSelected && (
                                    <tr className="bg-indigo-50/30 animate-in fade-in duration-300">
                                        <td colSpan={5} className="px-6 py-4">
                                            <div className="flex items-start gap-4">
                                                <div className="p-2 bg-white rounded-lg border border-indigo-100 shadow-sm text-indigo-600">
                                                    <Sparkles size={20} />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-sm font-semibold text-slate-900 mb-1">AI Performance Analysis for {student.name}</h4>
                                                    <p className="text-sm text-slate-700 leading-relaxed">
                                                        {loadingInsight ? (
                                                            <span className="animate-pulse">Analyzing grades and trends...</span>
                                                        ) : insight}
                                                    </p>
                                                </div>
                                                <button 
                                                    onClick={(e) => { e.stopPropagation(); setSelectedStudent(null); }}
                                                    className="text-slate-400 hover:text-slate-600"
                                                >
                                                    &times;
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        );
                        }) : (
                             <tr>
                                <td colSpan={5} className="px-6 py-12 text-center text-slate-500">
                                    <div className="flex flex-col items-center">
                                        <div className="p-3 bg-slate-100 rounded-full mb-3">
                                            <UserIcon size={24} className="text-slate-400" />
                                        </div>
                                        <p className="font-medium text-slate-900">No students enrolled</p>
                                        <p className="text-sm text-slate-400 mt-1">Add students to Grade {subject.gradeLevel} via the Admin Dashboard.</p>
                                    </div>
                                </td>
                             </tr>
                        )}
                    </tbody>
                    </table>
                </div>
            </div>
        )}

        {activeTab === 'assignments' && (
            <AssignmentsList subject={subject} />
        )}

        {activeTab === 'attendance' && (
            <AttendanceTracker students={students} subjectId={subject.id} />
        )}
      </div>
    </div>
  );
};