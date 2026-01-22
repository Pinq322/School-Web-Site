import React from 'react';
import { User, Lesson } from '../types';
import { MOCK_SUBJECTS, MOCK_LESSONS, MOCK_ASSIGNMENTS, MOCK_GRADES } from '../services/mockData';
import { Book, CheckCircle, Clock, Calendar } from 'lucide-react';

interface StudentDiaryProps {
  user: User;
}

export const StudentDiary: React.FC<StudentDiaryProps> = ({ user }) => {
  // Get current week dates (Mock logic: Oct 23 - Oct 27)
  const weekDates = [
    { date: '2023-10-23', day: 'Monday' },
    { date: '2023-10-24', day: 'Tuesday' },
    { date: '2023-10-25', day: 'Wednesday' },
    { date: '2023-10-26', day: 'Thursday' },
    { date: '2023-10-27', day: 'Friday' },
  ];

  const getDayContent = (dateStr: string) => {
    // Find lessons for this date
    const dayLessons = MOCK_LESSONS.filter(l => l.date === dateStr);
    
    // Map to enrich data
    return dayLessons.map(lesson => {
        const subject = MOCK_SUBJECTS.find(s => s.id === lesson.subjectId);
        const assignment = lesson.homeworkId ? MOCK_ASSIGNMENTS.find(a => a.id === lesson.homeworkId) : null;
        const grade = MOCK_GRADES.find(g => g.studentId === user.id && g.subjectId === lesson.subjectId && g.date === dateStr);
        
        return { lesson, subject, assignment, grade };
    });
  };

  return (
    <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
         <div>
            <h2 className="text-2xl font-bold text-slate-900">My Diary</h2>
            <p className="text-slate-500">Weekly schedule, homework, and grades.</p>
         </div>
         <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-200 shadow-sm">
            <Calendar size={18} className="text-blue-600" />
            <span className="font-semibold text-slate-700">Oct 23 — Oct 29, 2023</span>
         </div>
      </div>

      <div className="space-y-6">
        {weekDates.map((dayInfo) => {
            const items = getDayContent(dayInfo.date);
            const isToday = dayInfo.date === '2023-10-25'; // Mock "today"

            return (
                <div key={dayInfo.date} className={`rounded-xl border ${isToday ? 'border-blue-300 ring-4 ring-blue-50/50' : 'border-slate-200'} overflow-hidden bg-white shadow-sm`}>
                    <div className={`px-6 py-3 border-b ${isToday ? 'bg-blue-50 border-blue-200' : 'bg-slate-50 border-slate-200'} flex justify-between items-center`}>
                        <h3 className={`font-bold ${isToday ? 'text-blue-800' : 'text-slate-700'}`}>
                            {dayInfo.day} <span className="font-normal opacity-70 ml-2">{dayInfo.date}</span>
                        </h3>
                        {isToday && <span className="text-xs font-bold text-blue-600 uppercase tracking-wider bg-white px-2 py-0.5 rounded-full border border-blue-200">Today</span>}
                    </div>
                    
                    {items.length > 0 ? (
                        <div className="divide-y divide-slate-100">
                            {items.map((item, idx) => (
                                <div key={item.lesson.id} className="p-4 sm:grid sm:grid-cols-12 gap-4 items-center hover:bg-slate-50/50 transition-colors">
                                    {/* Time & Subject */}
                                    <div className="sm:col-span-3 mb-2 sm:mb-0">
                                        <div className="flex items-center gap-2 text-slate-500 text-xs mb-1">
                                            <Clock size={12} />
                                            <span>{idx + 1} Period</span>
                                        </div>
                                        <div className="font-bold text-slate-900">{item.subject?.name}</div>
                                        <div className="text-xs text-slate-500">{item.subject?.room}</div>
                                    </div>

                                    {/* Topic */}
                                    <div className="sm:col-span-4 mb-2 sm:mb-0">
                                        <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Lesson Topic</div>
                                        <div className="text-sm text-slate-800 font-medium">{item.lesson.topic}</div>
                                    </div>

                                    {/* Homework */}
                                    <div className="sm:col-span-3 mb-2 sm:mb-0">
                                        {item.assignment ? (
                                            <div className="bg-orange-50 p-2 rounded-lg border border-orange-100">
                                                <div className="flex items-center gap-1.5 text-orange-700 font-bold text-xs mb-1">
                                                    <Book size={12} /> Homework
                                                </div>
                                                <p className="text-xs text-slate-700 line-clamp-2">{item.assignment.title}</p>
                                            </div>
                                        ) : (
                                            <span className="text-xs text-slate-400 italic">No homework</span>
                                        )}
                                    </div>

                                    {/* Grade */}
                                    <div className="sm:col-span-2 flex justify-end">
                                        {item.grade ? (
                                            <div className="text-center">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg font-bold border-2 ${item.grade.score >= 90 ? 'border-green-200 bg-green-50 text-green-700' : 'border-blue-200 bg-blue-50 text-blue-700'}`}>
                                                    {item.grade.score}
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="w-10 h-10 rounded-lg border-2 border-slate-100 bg-slate-50 flex items-center justify-center">
                                                <span className="text-slate-300 text-xl">·</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="p-8 text-center text-slate-400 italic">No classes scheduled.</div>
                    )}
                </div>
            );
        })}
      </div>
    </div>
  );
};