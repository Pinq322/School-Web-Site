import React, { useState, useEffect } from 'react';
import { Subject, Student, Lesson, Grade, Attendance } from '../types';
import { MOCK_STUDENTS, MOCK_LESSONS, MOCK_GRADES, MOCK_ATTENDANCE, addNewLesson } from '../services/mockData';
import { Calendar, ChevronLeft, ChevronRight, Info, Plus, ExternalLink } from 'lucide-react';
import { LessonModal } from './LessonModal';
import { LessonDetailModal } from './LessonDetailModal';

interface TeacherJournalProps {
  subject: Subject;
}

export const TeacherJournal: React.FC<TeacherJournalProps> = ({ subject }) => {
  // Local state to trigger re-renders
  const [updateTrigger, setUpdateTrigger] = useState(0);
  
  const [lessons, setLessons] = useState<Lesson[]>(
    MOCK_LESSONS.filter(l => l.subjectId === subject.id).sort((a, b) => a.date.localeCompare(b.date))
  );
  
  // Filter students enrolled in this subject's grade
  const enrolledStudents = MOCK_STUDENTS.filter(s => s.gradeLevel === subject.gradeLevel);

  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);

  // Refresh data when modals close
  useEffect(() => {
     setLessons(MOCK_LESSONS.filter(l => l.subjectId === subject.id).sort((a, b) => a.date.localeCompare(b.date)));
  }, [updateTrigger, subject.id]);

  const getCellData = (studentId: string, lesson: Lesson) => {
    // We read directly from MOCK arrays to get the latest data after updates
    const grade = MOCK_GRADES.find(g => g.studentId === studentId && g.subjectId === subject.id && g.date === lesson.date);
    const att = MOCK_ATTENDANCE.find(a => a.studentId === studentId && a.subjectId === subject.id && a.date === lesson.date);
    return { grade, att };
  };

  const handleLessonHeaderClick = (lesson: Lesson) => {
    setSelectedLesson(lesson);
  };

  const handleModalClose = () => {
      setSelectedLesson(null);
      setUpdateTrigger(prev => prev + 1); // Force re-render of journal grid
  };

  const handleAddLesson = (newLessonData: { 
      date: string; 
      topic: string; 
      hasHomework: boolean; 
      homeworkTitle?: string; 
      status: Lesson['status'];
      notes?: string; 
  }) => {
      const newLesson: Lesson = {
          id: `l-new-${Date.now()}`,
          subjectId: subject.id,
          date: newLessonData.date,
          topic: newLessonData.topic,
          homeworkId: newLessonData.hasHomework ? `as-new-${Date.now()}` : undefined,
          status: newLessonData.status,
          notes: newLessonData.notes,
      };
      
      addNewLesson(newLesson);
      setUpdateTrigger(prev => prev + 1);
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-300">
      <LessonModal 
        isOpen={isLessonModalOpen} 
        onClose={() => setIsLessonModalOpen(false)} 
        onSave={handleAddLesson}
      />
      
      <LessonDetailModal 
        isOpen={!!selectedLesson}
        onClose={handleModalClose}
        lesson={selectedLesson}
        subject={subject}
        students={enrolledStudents}
      />

      <div className="flex items-center justify-between mb-4">
         <div>
            <h3 className="text-lg font-bold text-slate-800">Electronic Journal: {subject.name}</h3>
            <p className="text-sm text-slate-500">October 2023</p>
         </div>
         <div className="flex items-center gap-4">
            <button 
                onClick={() => setIsLessonModalOpen(true)}
                className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm shadow-blue-200 transition-colors"
            >
                <Plus size={16} /> Plan Lesson
            </button>
         </div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-x-auto">
        <table className="w-full border-collapse min-w-[800px]">
          <thead>
            <tr>
              <th className="sticky left-0 z-10 bg-slate-50 border-b border-r border-slate-200 p-3 text-left w-48 font-semibold text-slate-600 text-sm shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                Student Name
              </th>
              {lessons.map(lesson => (
                <th 
                    key={lesson.id} 
                    onClick={() => handleLessonHeaderClick(lesson)}
                    className="border-b border-r border-slate-200 p-2 min-w-[100px] bg-slate-50 group relative cursor-pointer hover:bg-blue-50 transition-colors"
                >
                   <div className="flex flex-col items-center" title={`Topic: ${lesson.topic}`}>
                      <div className="flex items-center gap-1 mb-1">
                          <span className="text-xs font-bold text-slate-800">{new Date(lesson.date).toLocaleDateString('en-US', { day: '2-digit', month: 'short' })}</span>
                          <ExternalLink size={10} className="text-slate-400 group-hover:text-blue-500" />
                      </div>
                      <span className="text-[10px] text-slate-500 font-normal truncate max-w-[90px]">{lesson.topic}</span>
                      {lesson.homeworkId && <div className="absolute top-1 right-1 w-1.5 h-1.5 bg-orange-400 rounded-full" title="Homework Assigned"></div>}
                   </div>
                </th>
              ))}
              <th className="border-b border-slate-200 p-2 bg-slate-50 text-center text-xs font-bold text-slate-600 min-w-[60px]">Avg</th>
            </tr>
          </thead>
          <tbody>
            {enrolledStudents.length > 0 ? enrolledStudents.map((student, idx) => {
               // Calculate mock average for row
               const studentGrades = MOCK_GRADES.filter(g => g.studentId === student.id && g.subjectId === subject.id);
               const avg = studentGrades.length ? Math.round(studentGrades.reduce((a, b) => a + (b.score/b.maxScore)*100, 0) / studentGrades.length) : '-';

               return (
                <tr key={student.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/30'}>
                  <td className="sticky left-0 z-10 bg-inherit border-b border-r border-slate-200 p-3 text-sm font-medium text-slate-700 hover:text-blue-600 cursor-pointer shadow-[2px_0_5px_-2px_rgba(0,0,0,0.05)]">
                    {student.name}
                  </td>
                  {lessons.map(lesson => {
                    const { grade, att } = getCellData(student.id, lesson);
                    
                    return (
                      <td 
                        key={lesson.id} 
                        className={`border-b border-r border-slate-200 p-0 text-center relative`}
                      >
                        <div className="h-10 w-full flex items-center justify-center">
                           {grade ? (
                               <span className={`font-bold ${grade.score >= 90 ? 'text-green-600' : 'text-blue-600'}`}>
                                   {grade.score}
                               </span>
                           ) : att ? (
                               <span className="text-xs font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">
                                   {att.status === 'ABSENT' ? 'NB' : att.status === 'LATE' ? 'L' : att.status.substring(0, 1)}
                               </span>
                           ) : (
                               <span className="text-slate-300 text-lg opacity-0 hover:opacity-100">·</span>
                           )}
                        </div>
                      </td>
                    );
                  })}
                  <td className="border-b border-slate-200 p-2 text-center text-sm font-bold text-slate-800">
                     <span className={`px-2 py-0.5 rounded-full ${avg !== '-' && +avg >= 80 ? 'bg-green-100 text-green-700' : 'bg-slate-100'}`}>
                        {avg}
                     </span>
                  </td>
                </tr>
               )
            }) : (
                <tr>
                    <td colSpan={lessons.length + 2} className="p-8 text-center text-slate-500 italic bg-white">
                        No students enrolled in this class (Grade {subject.gradeLevel}).
                    </td>
                </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="bg-blue-50 p-4 rounded-lg flex items-start gap-3 border border-blue-100">
         <Info className="text-blue-600 shrink-0 mt-0.5" size={18} />
         <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Journal Instructions:</p>
            <ul className="list-disc list-inside space-y-1 opacity-90">
                <li>Click a <strong>lesson date/header</strong> to start the lesson, take attendance, and grade students collectively.</li>
                <li>Click <strong>+ Plan Lesson</strong> to add a new column for today's class.</li>
                <li>Cells with orange dots indicate homework was assigned.</li>
            </ul>
         </div>
      </div>
    </div>
  );
};