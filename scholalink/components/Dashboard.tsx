import React, { useEffect, useState } from 'react';
import { User, UserRole, Subject, Student } from '../types';
import { MOCK_SUBJECTS, MOCK_STUDENTS, getClassAverage, getStudentAverage } from '../services/mockData';
import { Users, BookOpen, TrendingUp, Calendar, ArrowRight, Star, Clock, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { generateLessonPlanIdea } from '../services/geminiService';
import { AdminDashboard } from './AdminDashboard';
import { ParentDashboard } from './ParentDashboard';

interface DashboardProps {
  user: User;
}

export const Dashboard: React.FC<DashboardProps> = ({ user }) => {
  const navigate = useNavigate();

  if (user.role === UserRole.TEACHER) {
    return <TeacherDashboard user={user} navigate={navigate} />;
  } else if (user.role === UserRole.STUDENT) {
    return <StudentDashboard user={user} navigate={navigate} />;
  } else if (user.role === UserRole.ADMIN) {
    return <AdminDashboard />;
  } else if (user.role === UserRole.PARENT) {
    return <ParentDashboard user={user} />;
  }
  return <div className="text-center p-10 text-slate-500">Dashboard not found.</div>;
};

const TeacherDashboard: React.FC<{ user: User, navigate: any }> = ({ user, navigate }) => {
  const mySubjects = MOCK_SUBJECTS.filter(s => s.teacherId === user.id);
  const [aiTip, setAiTip] = useState<string>('');
  const [loadingTip, setLoadingTip] = useState(false);

  useEffect(() => {
      // Load an initial AI tip for the first subject
      if (mySubjects.length > 0) {
          setLoadingTip(true);
          generateLessonPlanIdea(mySubjects[0].name.split(' ')[0], 'Introduction').then(tip => {
              setAiTip(tip);
              setLoadingTip(false);
          });
      }
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Classes Grid - Moved to Top */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <BookOpen className="text-blue-600" size={24} /> 
            My Classes
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {mySubjects.map(subject => (
            <div 
              key={subject.id}
              onClick={() => navigate(`/class/${subject.id}`)}
              className="group bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:shadow-blue-900/5 hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden"
            >
              <div className="h-2 bg-gradient-to-r from-blue-500 to-indigo-500 group-hover:h-3 transition-all duration-300" />
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <div>
                        <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                            {subject.name}
                        </h3>
                        <div className="flex items-center gap-2 text-slate-500 mt-2 text-sm font-medium">
                            <Clock size={16} />
                            <span>{subject.schedule}</span>
                        </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-xs font-bold border ${
                    getClassAverage(subject.id) > 80 
                        ? 'bg-green-50 text-green-700 border-green-100' 
                        : 'bg-yellow-50 text-yellow-700 border-yellow-100'
                    }`}>
                        Avg: {getClassAverage(subject.id)}%
                    </div>
                </div>
                
                <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-100">
                    <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-lg">
                        {subject.room}
                    </span>
                    <span className="flex items-center text-sm font-bold text-blue-600 group-hover:translate-x-1 transition-transform">
                        Manage Class <ArrowRight size={16} className="ml-1" />
                    </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Row - Moved below Classes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-lg shadow-slate-200/50 flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300">
          <div className="p-4 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-md shadow-blue-500/30">
            <BookOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Active Classes</p>
            <p className="text-3xl font-bold text-slate-800">{mySubjects.length}</p>
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-lg shadow-slate-200/50 flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300">
          <div className="p-4 bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-xl shadow-md shadow-emerald-500/30">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Total Students</p>
            <p className="text-3xl font-bold text-slate-800">124</p>
          </div>
        </div>
        <div className="bg-white/60 backdrop-blur-sm p-6 rounded-2xl border border-white/50 shadow-lg shadow-slate-200/50 flex items-center gap-5 hover:scale-[1.02] transition-transform duration-300">
          <div className="p-4 bg-gradient-to-br from-violet-500 to-violet-600 text-white rounded-xl shadow-md shadow-violet-500/30">
            <TrendingUp size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-slate-500">Avg Performance</p>
            <p className="text-3xl font-bold text-slate-800">84%</p>
          </div>
        </div>
      </div>

       {/* AI Insight Card - Reduced and Simplified */}
       <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow">
            <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
                <Star size={16} />
            </div>
            <div className="flex-1 flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 overflow-hidden">
                <span className="text-xs font-bold text-indigo-700 uppercase tracking-wider shrink-0 bg-indigo-50 px-2 py-0.5 rounded">Daily AI Tip</span>
                <p className="text-slate-600 text-sm truncate italic">
                    {loadingTip ? "Generating insight..." : `"${aiTip}"`}
                </p>
            </div>
       </div>
    </div>
  );
};

const StudentDashboard: React.FC<{ user: User, navigate: any }> = ({ user, navigate }) => {
  const overallAvg = getStudentAverage(user.id);
  const subjects = MOCK_SUBJECTS; // Simplified: assume student takes all subjects

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Overview Card */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-indigo-700 rounded-3xl shadow-xl text-white p-8 md:p-10">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-cyan-400/20 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-lg">
                <h2 className="text-3xl md:text-4xl font-bold leading-tight">
                    Welcome back, <br/>{user.name.split(' ')[0]}! 👋
                </h2>
                <p className="text-blue-100 text-lg">
                    You have <span className="font-bold text-white bg-white/20 px-2 py-0.5 rounded">2</span> upcoming assignments due this week. Stay on top of your game!
                </p>
                <div className="flex gap-3 pt-2">
                    <button 
                        onClick={() => navigate('/diary')}
                        className="px-6 py-2.5 bg-white text-blue-700 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors shadow-lg"
                    >
                        Open Digital Diary
                    </button>
                    <button 
                        onClick={() => navigate('/grades')}
                        className="px-6 py-2.5 bg-blue-800/50 text-white border border-blue-400/30 rounded-xl text-sm font-bold hover:bg-blue-800/70 transition-colors"
                    >
                        View Grades
                    </button>
                </div>
            </div>
            
            <div className="flex items-center gap-6 bg-white/10 backdrop-blur-sm p-6 rounded-2xl border border-white/20">
                <div className="text-right">
                    <p className="text-sm font-medium text-blue-100 uppercase tracking-wider">Overall GPA</p>
                    <p className="text-4xl font-bold text-white tracking-tight">{overallAvg}%</p>
                </div>
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center shadow-lg">
                    <TrendingUp className="text-white w-8 h-8" />
                </div>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Subject Performance */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
            <Star className="text-yellow-500 fill-yellow-500" size={20} />
            Subject Performance
          </h3>
          <div className="grid gap-4">
            {subjects.map(subject => {
              const avg = getStudentAverage(user.id, subject.id);
              return (
                <div key={subject.id} className="group bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center text-slate-700 font-bold text-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                      {subject.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 group-hover:text-blue-700 transition-colors">{subject.name}</p>
                      <p className="text-xs text-slate-500 font-medium">{subject.teacherId === 'u1' ? 'Ms. Wilson' : 'Mr. Brown'}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="w-32 h-2.5 bg-slate-100 rounded-full overflow-hidden hidden sm:block">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${avg >= 90 ? 'bg-green-500' : avg >= 80 ? 'bg-blue-500' : 'bg-yellow-500'}`} 
                        style={{ width: `${avg}%` }} 
                      />
                    </div>
                    <span className={`font-bold text-lg w-14 text-right ${avg >= 80 ? 'text-green-600' : 'text-slate-700'}`}>{avg}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick Actions / Timeline */}
        <div className="bg-white/80 backdrop-blur-sm p-6 rounded-2xl border border-slate-200 shadow-sm h-fit">
          <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
            <Clock size={20} className="text-slate-400" /> Recent Activity
          </h3>
          <div className="space-y-8 relative before:absolute before:left-[19px] before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-100">
            {[
                { title: "Math Homework Graded", sub: "Score: 95/100 • Yesterday", color: "bg-green-500", icon: CheckCircle },
                { title: "Physics Quiz Upcoming", sub: "Tomorrow, 10:00 AM", color: "bg-blue-500", icon: Calendar },
                { title: "History Class", sub: "Attended • 2 days ago", color: "bg-slate-300", icon: BookOpen }
            ].map((item, idx) => (
                <div key={idx} className="relative pl-12 group">
                    <span className={`absolute left-0 top-0 w-10 h-10 rounded-full border-4 border-white ${item.color} flex items-center justify-center text-white shadow-sm z-10`}>
                        <item.icon size={16} strokeWidth={2.5} />
                    </span>
                    <div className="py-1">
                        <p className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors">{item.title}</p>
                        <p className="text-xs text-slate-500 mt-1 font-medium">{item.sub}</p>
                    </div>
                </div>
            ))}
          </div>
          <button className="w-full mt-8 py-2.5 text-sm font-bold text-slate-600 bg-slate-50 rounded-xl hover:bg-slate-100 transition-colors">
              View Full Timeline
          </button>
        </div>
      </div>
    </div>
  );
};