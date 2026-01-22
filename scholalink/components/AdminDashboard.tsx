import React, { useState, useEffect } from 'react';
import { MOCK_USERS, MOCK_SUBJECTS, MOCK_STUDENTS, addUser, addSubject } from '../services/mockData';
import { UserRole, Subject, User } from '../types';
import { exportToCSV } from '../services/exportService';
import { 
    Users, 
    BookOpen, 
    School, 
    Settings, 
    Plus, 
    TrendingUp, 
    AlertTriangle, 
    Search,
    Filter,
    MoreVertical,
    Download,
    X,
    Send
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'classes'>('overview');
  const [userFilter, setUserFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Used to force re-render
  
  // Modals state
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isAlertModalOpen, setIsAlertModalOpen] = useState(false);

  const forceRefresh = () => setRefreshTrigger(prev => prev + 1);

  // Filter users based on tab and search
  const filteredUsers = MOCK_USERS.concat(
      // Add students to the main user list for display if they aren't already there in mockData
      MOCK_STUDENTS.filter(s => !MOCK_USERS.find(u => u.id === s.id))
  ).filter(u => {
      const matchesSearch = u.name.toLowerCase().includes(searchQuery.toLowerCase()) || u.email.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesRole = userFilter === 'ALL' || u.role === userFilter;
      return matchesSearch && matchesRole;
  });

  const handleExportUsers = () => {
      const exportData = filteredUsers.map(u => ({
          ID: u.id,
          Name: u.name,
          Email: u.email,
          Role: u.role,
          Status: 'Active'
      }));
      exportToCSV(exportData, 'School_Users_Export');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Modals */}
      <CreateUserModal isOpen={isUserModalOpen} onClose={() => { setIsUserModalOpen(false); forceRefresh(); }} />
      <CreateClassModal isOpen={isClassModalOpen} onClose={() => { setIsClassModalOpen(false); forceRefresh(); }} />
      <SendAlertModal isOpen={isAlertModalOpen} onClose={() => setIsAlertModalOpen(false)} />

      {/* Admin Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
            <h2 className="text-2xl font-bold text-slate-900">Administration</h2>
            <p className="text-slate-500">School management control panel</p>
        </div>
        <div className="flex gap-2">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg hover:bg-slate-50 transition-colors text-sm font-medium">
                <Settings size={18} /> Settings
            </button>
            <button 
                onClick={() => setIsUserModalOpen(true)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium shadow-sm"
            >
                <Plus size={18} /> New User
            </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-slate-200">
        <nav className="flex space-x-8">
            {[
                { id: 'overview', label: 'Overview' },
                { id: 'users', label: 'User Management' },
                { id: 'classes', label: 'Classes & Subjects' },
            ].map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`
                        py-4 px-1 border-b-2 font-medium text-sm transition-colors
                        ${activeTab === tab.id 
                            ? 'border-slate-900 text-slate-900' 
                            : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}
                    `}
                >
                    {tab.label}
                </button>
            ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
          {activeTab === 'overview' && (
              <OverviewTab 
                onOpenUserModal={() => setIsUserModalOpen(true)} 
                onOpenClassModal={() => setIsClassModalOpen(true)} 
                onOpenAlertModal={() => setIsAlertModalOpen(true)}
              />
          )}
          {activeTab === 'users' && (
              <UsersTab 
                users={filteredUsers} 
                filter={userFilter} 
                setFilter={setUserFilter} 
                search={searchQuery} 
                setSearch={setSearchQuery} 
                onExport={handleExportUsers}
              />
          )}
          {activeTab === 'classes' && <ClassesTab subjects={MOCK_SUBJECTS} />}
      </div>
    </div>
  );
};

// --- Sub-components for Tabs ---

const OverviewTab: React.FC<{ onOpenUserModal: () => void, onOpenClassModal: () => void, onOpenAlertModal: () => void }> = ({ onOpenUserModal, onOpenClassModal, onOpenAlertModal }) => (
    <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
                { label: 'Total Users', val: MOCK_USERS.length + MOCK_STUDENTS.length - 2, icon: Users, color: 'blue' }, // Approximate calc
                { label: 'Active Classes', val: MOCK_SUBJECTS.length.toString(), icon: BookOpen, color: 'emerald' },
                { label: 'Avg Attendance', val: '94%', icon: School, color: 'violet' },
                { label: 'System Health', val: '100%', icon: TrendingUp, color: 'orange' }
            ].map((stat, i) => (
                <div key={i} className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
                    <div className={`p-3 rounded-lg bg-${stat.color}-50 text-${stat.color}-600`}>
                        <stat.icon size={24} />
                    </div>
                    <div>
                        <p className="text-sm font-medium text-slate-500">{stat.label}</p>
                        <p className="text-2xl font-bold text-slate-900">{stat.val}</p>
                    </div>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Recent System Activities</h3>
                </div>
                <div className="divide-y divide-slate-100">
                    {[
                        { action: 'New User Registered', detail: 'Student: Emily Davis', time: '2 hours ago' },
                        { action: 'Grade Report Generated', detail: 'Class: Mathematics 101', time: '5 hours ago' },
                        { action: 'System Update', detail: 'Security patch v2.4 applied', time: '1 day ago' },
                    ].map((act, i) => (
                        <div key={i} className="p-4 flex items-center justify-between hover:bg-slate-50">
                            <div>
                                <p className="text-sm font-semibold text-slate-900">{act.action}</p>
                                <p className="text-xs text-slate-500">{act.detail}</p>
                            </div>
                            <span className="text-xs text-slate-400">{act.time}</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-fit">
                <div className="p-6 border-b border-slate-100">
                    <h3 className="font-bold text-slate-900">Quick Actions</h3>
                </div>
                <div className="p-6 grid grid-cols-2 gap-4">
                    <button 
                        onClick={onOpenUserModal}
                        className="flex flex-col items-center justify-center gap-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all group"
                    >
                        <div className="p-3 bg-blue-50 text-blue-600 rounded-full group-hover:scale-110 transition-transform"><Plus size={24} /></div>
                        <span className="font-medium text-slate-700">Add Student</span>
                    </button>
                    <button 
                        onClick={onOpenClassModal}
                        className="flex flex-col items-center justify-center gap-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all group"
                    >
                        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-full group-hover:scale-110 transition-transform"><BookOpen size={24} /></div>
                        <span className="font-medium text-slate-700">Create Class</span>
                    </button>
                    <button 
                        onClick={onOpenAlertModal}
                        className="flex flex-col items-center justify-center gap-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all group"
                    >
                        <div className="p-3 bg-orange-50 text-orange-600 rounded-full group-hover:scale-110 transition-transform"><AlertTriangle size={24} /></div>
                        <span className="font-medium text-slate-700">Send Alert</span>
                    </button>
                    <button className="flex flex-col items-center justify-center gap-3 p-4 border border-slate-200 rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-all group">
                        <div className="p-3 bg-green-50 text-green-600 rounded-full group-hover:scale-110 transition-transform"><School size={24} /></div>
                        <span className="font-medium text-slate-700">Events</span>
                    </button>
                </div>
            </div>
        </div>
    </div>
);

const UsersTab: React.FC<{ users: any[], filter: string, setFilter: any, search: string, setSearch: any, onExport: () => void }> = ({ users, filter, setFilter, search, setSearch, onExport }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
        <div className="p-4 border-b border-slate-200 flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex gap-2 w-full md:w-auto overflow-x-auto">
                {['ALL', 'TEACHER', 'STUDENT', 'PARENT', 'ADMIN'].map(role => (
                    <button 
                        key={role}
                        onClick={() => setFilter(role)}
                        className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                            filter === role ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                        {role.toLowerCase()}s
                    </button>
                ))}
            </div>
            <div className="flex items-center gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    <input 
                        type="text" 
                        placeholder="Search users..." 
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                    />
                </div>
                <button 
                    onClick={onExport}
                    className="flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg text-sm font-medium hover:bg-slate-200 transition-colors"
                >
                    <Download size={16} />
                </button>
            </div>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-left">
                <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">User</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Role</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Status</th>
                        <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Last Login</th>
                        <th className="px-6 py-3 text-right">Action</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {users.map(u => (
                        <tr key={u.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-3">
                                    <img src={u.avatarUrl || `https://ui-avatars.com/api/?name=${u.name}`} className="w-8 h-8 rounded-full bg-slate-200" alt="" />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900">{u.name}</p>
                                        <p className="text-xs text-slate-500">{u.email}</p>
                                    </div>
                                </div>
                            </td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                                    u.role === 'TEACHER' ? 'bg-purple-100 text-purple-700' :
                                    u.role === 'STUDENT' ? 'bg-blue-100 text-blue-700' :
                                    u.role === 'ADMIN' ? 'bg-slate-100 text-slate-700' : 'bg-orange-100 text-orange-700'
                                }`}>
                                    {u.role}
                                </span>
                            </td>
                            <td className="px-6 py-4">
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                                    Active
                                </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-500">
                                2 hours ago
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="p-1 text-slate-400 hover:text-slate-600 rounded">
                                    <MoreVertical size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div>
);

const ClassesTab: React.FC<{ subjects: Subject[] }> = ({ subjects }) => (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden animate-in fade-in duration-300">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
            <h3 className="font-semibold text-slate-900">Active Subjects & Classes</h3>
            <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">
                <Download size={16} /> Export
            </button>
        </div>
        <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Subject Name</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Teacher</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Schedule</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Room</th>
                    <th className="px-6 py-3 text-xs font-bold text-slate-500 uppercase">Students</th>
                    <th className="px-6 py-3 text-right">Action</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
                {subjects.map(s => {
                    const teacher = MOCK_USERS.find(u => u.id === s.teacherId);
                    const studentCount = MOCK_STUDENTS.filter(student => student.gradeLevel === s.gradeLevel).length;
                    return (
                        <tr key={s.id} className="hover:bg-slate-50">
                            <td className="px-6 py-4">
                                <p className="text-sm font-semibold text-slate-900">{s.name}</p>
                                <p className="text-xs text-slate-500">Grade {s.gradeLevel}</p>
                            </td>
                            <td className="px-6 py-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-xs font-bold text-slate-600">
                                        {teacher?.name.charAt(0) || '?'}
                                    </div>
                                    <span className="text-sm text-slate-700">{teacher?.name || 'Unassigned'}</span>
                                </div>
                            </td>
                            <td className="px-6 py-4 text-sm text-slate-600">{s.schedule}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">{s.room}</td>
                            <td className="px-6 py-4 text-sm text-slate-600">
                                {studentCount} Enrolled
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">Edit</button>
                            </td>
                        </tr>
                    )
                })}
            </tbody>
        </table>
    </div>
);

// --- Modals ---

const CreateUserModal: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [role, setRole] = useState<UserRole>(UserRole.STUDENT);
    const [gradeLevel, setGradeLevel] = useState(10);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newUser: User = {
            id: `u-${Date.now()}`,
            name,
            email,
            role,
            avatarUrl: `https://ui-avatars.com/api/?name=${name}`
        };
        
        addUser(newUser, role === UserRole.STUDENT ? gradeLevel : undefined);
        
        onClose();
        setName('');
        setEmail('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Create New User</h3>
                    <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
                </div>
                <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border border-slate-300 rounded-lg text-sm" 
                            placeholder="John Doe" 
                            required 
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                        <input 
                            type="email" 
                            className="w-full p-2 border border-slate-300 rounded-lg text-sm" 
                            placeholder="john@school.com" 
                            required 
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                        <select 
                            className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                            value={role}
                            onChange={e => setRole(e.target.value as UserRole)}
                        >
                            <option value="STUDENT">Student</option>
                            <option value="TEACHER">Teacher</option>
                            <option value="PARENT">Parent</option>
                            <option value="ADMIN">Admin</option>
                        </select>
                    </div>
                    
                    {role === UserRole.STUDENT && (
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Grade Level</label>
                            <select 
                                className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                                value={gradeLevel}
                                onChange={e => setGradeLevel(parseInt(e.target.value))}
                            >
                                <option value={9}>9th Grade</option>
                                <option value={10}>10th Grade</option>
                                <option value={11}>11th Grade</option>
                                <option value={12}>12th Grade</option>
                            </select>
                            <p className="text-xs text-slate-500 mt-1">This student will be automatically enrolled in classes of this grade.</p>
                        </div>
                    )}

                    <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800">Create User</button>
                </form>
            </div>
        </div>
    );
}

const CreateClassModal: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    const [name, setName] = useState('');
    const [teacherId, setTeacherId] = useState('');
    const [room, setRoom] = useState('');
    const [gradeLevel, setGradeLevel] = useState(10);
    const [schedule, setSchedule] = useState('');

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newSubject: Subject = {
            id: `s-${Date.now()}`,
            name,
            teacherId,
            room,
            gradeLevel,
            schedule: schedule || 'TBA'
        };
        addSubject(newSubject);
        onClose();
        setName('');
        setRoom('');
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center">
                    <h3 className="font-bold text-slate-900">Create New Class</h3>
                    <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
                </div>
                <form className="p-6 space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Class Name</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border border-slate-300 rounded-lg text-sm" 
                            placeholder="Mathematics 101" 
                            required 
                            value={name}
                            onChange={e => setName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Teacher</label>
                        <select 
                            className="w-full p-2 border border-slate-300 rounded-lg text-sm"
                            value={teacherId}
                            onChange={e => setTeacherId(e.target.value)}
                            required
                        >
                            <option value="">Select a teacher...</option>
                            {MOCK_USERS.filter(u => u.role === UserRole.TEACHER).map(t => (
                                <option key={t.id} value={t.id}>{t.name}</option>
                            ))}
                        </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                         <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Room</label>
                            <input 
                                type="text" 
                                className="w-full p-2 border border-slate-300 rounded-lg text-sm" 
                                placeholder="Room 301" 
                                value={room}
                                onChange={e => setRoom(e.target.value)}
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-700 mb-1">Grade Level</label>
                            <input 
                                type="number" 
                                className="w-full p-2 border border-slate-300 rounded-lg text-sm" 
                                placeholder="10" 
                                value={gradeLevel}
                                onChange={e => setGradeLevel(parseInt(e.target.value))}
                            />
                        </div>
                    </div>
                     <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Schedule</label>
                        <input 
                            type="text" 
                            className="w-full p-2 border border-slate-300 rounded-lg text-sm" 
                            placeholder="Mon, Wed 10:00 AM" 
                            value={schedule}
                            onChange={e => setSchedule(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="w-full bg-slate-900 text-white py-2 rounded-lg text-sm font-medium hover:bg-slate-800">Create Class</button>
                </form>
            </div>
        </div>
    );
}

const SendAlertModal: React.FC<{ isOpen: boolean, onClose: () => void }> = ({ isOpen, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md animate-in fade-in zoom-in duration-200">
                <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-orange-50">
                    <div className="flex items-center gap-2 text-orange-700">
                        <AlertTriangle size={20} />
                        <h3 className="font-bold">Send System Announcement</h3>
                    </div>
                    <button onClick={onClose}><X size={20} className="text-slate-400" /></button>
                </div>
                <form className="p-6 space-y-4" onSubmit={(e) => { e.preventDefault(); onClose(); alert('Announcement Sent!'); }}>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
                        <input type="text" className="w-full p-2 border border-slate-300 rounded-lg text-sm" placeholder="e.g., School Closure" required />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Recipients</label>
                        <select className="w-full p-2 border border-slate-300 rounded-lg text-sm">
                            <option value="ALL">All Users</option>
                            <option value="PARENTS">All Parents</option>
                            <option value="TEACHERS">All Teachers</option>
                            <option value="STUDENTS">All Students</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                        <textarea rows={4} className="w-full p-2 border border-slate-300 rounded-lg text-sm resize-none" placeholder="Enter your message here..." required />
                    </div>
                    <button type="submit" className="w-full bg-orange-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-orange-700 flex items-center justify-center gap-2">
                        <Send size={16} /> Broadcast Message
                    </button>
                </form>
            </div>
        </div>
    );
}
