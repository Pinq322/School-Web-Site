import React, { useState, useEffect } from 'react';
import { Lesson, Student, Subject, Attendance, Grade } from '../types';
import { MOCK_GRADES, MOCK_ATTENDANCE, getStudentAverage, updateStudentGrade, updateStudentAttendance } from '../services/mockData';
import { X, User as UserIcon, Save, Check, Clock, AlertCircle, XCircle, CheckCircle2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface LessonDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  lesson: Lesson | null;
  subject: Subject;
  students: Student[];
}

export const LessonDetailModal: React.FC<LessonDetailModalProps> = ({
  isOpen, onClose, lesson, subject, students
}) => {
  const navigate = useNavigate();
  const [studentData, setStudentData] = useState<any[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (lesson && isOpen) {
      // Initialize data for the lesson
      const data = students.map(student => {
        // Find existing data
        const existingGrade = MOCK_GRADES.find(g => g.studentId === student.id && g.subjectId === subject.id && g.date === lesson.date);
        const existingAtt = MOCK_ATTENDANCE.find(a => a.studentId === student.id && a.subjectId === subject.id && a.date === lesson.date);
        const average = getStudentAverage(student.id, subject.id);

        return {
          student,
          average,
          attendance: existingAtt ? existingAtt.status : 'PRESENT', // Default to present
          score: existingGrade ? existingGrade.score.toString() : '',
          feedback: existingGrade ? existingGrade.feedback : ''
        };
      });
      setStudentData(data);
    }
  }, [lesson, isOpen, students, subject]);

  if (!isOpen || !lesson) return null;

  const handleAttendanceChange = (studentId: string, status: Attendance['status']) => {
    setStudentData(prev => prev.map(d => d.student.id === studentId ? { ...d, attendance: status } : d));
  };

  const handleScoreChange = (studentId: string, score: string) => {
    setStudentData(prev => prev.map(d => d.student.id === studentId ? { ...d, score } : d));
  };

  const handleSave = () => {
    setIsSaving(true);
    
    // Simulate API save and update mock data
    setTimeout(() => {
        studentData.forEach(d => {
            // Update attendance
            updateStudentAttendance(d.student.id, subject.id, lesson.date, d.attendance);
            
            // Update grade if score exists
            if (d.score && d.score !== '') {
                updateStudentGrade(d.student.id, subject.id, lesson.date, parseInt(d.score));
            }
        });

      setIsSaving(false);
      onClose(); // This will trigger re-render in parent if parent state depends on mock data
    }, 600);
  };

  const getAttendanceColor = (status: Attendance['status']) => {
      switch (status) {
          case 'PRESENT': return 'bg-green-100 text-green-700 border-green-200';
          case 'ABSENT': return 'bg-red-100 text-red-700 border-red-200';
          case 'LATE': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
          case 'EXCUSED': return 'bg-blue-100 text-blue-700 border-blue-200';
          default: return 'bg-slate-100 text-slate-700';
      }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-4xl h-[90vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b border-slate-200 flex justify-between items-start bg-slate-50">
          <div>
            <div className="flex items-center gap-3 mb-1">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${lesson.status === 'COMPLETED' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                    {lesson.status}
                </span>
                <span className="text-slate-500 text-sm font-medium">{new Date(lesson.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{lesson.topic}</h2>
            <p className="text-slate-500 text-sm mt-1">{subject.name} • {subject.room}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full text-slate-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Toolbar */}
        <div className="p-4 border-b border-slate-200 flex justify-between items-center bg-white sticky top-0 z-10">
            <div className="flex items-center gap-4">
                <div className="text-sm font-medium text-slate-700">
                    Students: <span className="font-bold">{students.length}</span>
                </div>
                <div className="h-4 w-px bg-slate-300"></div>
                <div className="text-sm font-medium text-slate-700">
                    Avg Grade: <span className="font-bold text-blue-600">
                        {Math.round(studentData.reduce((acc, curr) => acc + (parseInt(curr.score) || 0), 0) / (studentData.filter(d => d.score).length || 1))}%
                    </span>
                </div>
            </div>
            <button 
                onClick={handleSave}
                disabled={isSaving}
                className="flex items-center gap-2 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all shadow-sm shadow-blue-200 disabled:opacity-70"
            >
                {isSaving ? 'Saving...' : <><Save size={18} /> Save & Finish</>}
            </button>
        </div>

        {/* Content - Student List */}
        <div className="flex-1 overflow-y-auto p-0">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 sticky top-0 z-10 shadow-sm">
                <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase w-1/3">Student</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center w-1/6">Avg Grade</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center w-1/3">Attendance</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-center w-1/6">Lesson Grade</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {studentData.map((data) => (
                    <tr key={data.student.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                            <div 
                                onClick={() => { onClose(); navigate(`/student/${data.student.id}`); }}
                                className="flex items-center gap-3 cursor-pointer group"
                            >
                                <img src={data.student.avatarUrl} alt="" className="w-10 h-10 rounded-full object-cover border border-slate-200 bg-slate-100" />
                                <div>
                                    <p className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{data.student.name}</p>
                                    <p className="text-xs text-slate-500">Grade {data.student.gradeLevel}</p>
                                </div>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-center">
                            <span className={`inline-block px-2 py-1 rounded-md text-sm font-bold ${data.average >= 80 ? 'bg-green-50 text-green-700' : data.average >= 70 ? 'bg-blue-50 text-blue-700' : 'bg-yellow-50 text-yellow-700'}`}>
                                {data.average}%
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex justify-center gap-1">
                                {[
                                    { val: 'PRESENT', icon: CheckCircle2, title: 'Present' },
                                    { val: 'ABSENT', icon: XCircle, title: 'Absent' },
                                    { val: 'LATE', icon: Clock, title: 'Late' },
                                    { val: 'EXCUSED', icon: AlertCircle, title: 'Excused' }
                                ].map(opt => (
                                    <button
                                        key={opt.val}
                                        onClick={() => handleAttendanceChange(data.student.id, opt.val as any)}
                                        className={`p-2 rounded-lg transition-all ${
                                            data.attendance === opt.val 
                                            ? getAttendanceColor(opt.val as any) + ' ring-2 ring-offset-1 ring-slate-100 scale-110' 
                                            : 'text-slate-300 hover:bg-slate-100 hover:text-slate-500'
                                        }`}
                                        title={opt.title}
                                    >
                                        <opt.icon size={20} strokeWidth={2.5} />
                                    </button>
                                ))}
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex justify-center">
                                <input 
                                    type="text" 
                                    value={data.score}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val === '' || (/^\d+$/.test(val) && parseInt(val) <= 100)) {
                                            handleScoreChange(data.student.id, val);
                                        }
                                    }}
                                    placeholder="-"
                                    className="w-16 h-10 text-center border bg-white border-slate-200 text-slate-900 rounded-lg text-sm font-bold focus:outline-none focus:ring-2 focus:ring-blue-500/50"
                                />
                            </div>
                        </td>
                    </tr>
                ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};