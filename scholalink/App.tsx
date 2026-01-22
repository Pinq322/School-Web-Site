import React, { useState } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Login } from './components/Login';
import { Layout } from './components/Layout';
import { Dashboard } from './components/Dashboard';
import { ClassDetail } from './components/ClassDetail';
import { StudentProfile } from './components/StudentProfile';
import { Schedule } from './components/Schedule';
import { Settings } from './components/Settings';
import { StudentDiary } from './components/StudentDiary';
import { AdminDashboard } from './components/AdminDashboard';
import { Messages } from './components/Messages';
import { StudentHomework } from './components/StudentHomework';
import { NotificationsPage } from './components/NotificationsPage';
import { User, UserRole } from './types';
import { MOCK_USERS, updateMockUser } from './services/mockData';

export default function App() {
  const [user, setUser] = useState<User | null>(null);

  const handleLogin = (role: UserRole) => {
    // In a real app, this would validate credentials
    const mockUser = MOCK_USERS.find(u => u.role === role) || MOCK_USERS[0];
    setUser(mockUser);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleUpdateUser = (updatedData: Partial<User>) => {
    if (user) {
        const newUser = { ...user, ...updatedData };
        setUser(newUser); // Update local state immediately
        updateMockUser(user.id, updatedData); // Persist to mock DB
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <HashRouter>
      <Layout user={user} onLogout={handleLogout}>
        <Routes>
          <Route path="/" element={<Dashboard user={user} />} />
          <Route path="/class/:id" element={<ClassDetail />} />
          <Route path="/student/:id" element={<StudentProfile />} />
          <Route path="/diary" element={<StudentDiary user={user} />} />
          <Route path="/homework" element={<StudentHomework />} />
          <Route path="/messages" element={<Messages user={user} />} />
          <Route path="/notifications" element={<NotificationsPage user={user} />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/classes" element={<Dashboard user={user} />} />
          <Route path="/grades" element={<Dashboard user={user} />} />
          <Route path="/schedule" element={<Schedule />} />
          <Route path="/settings" element={<Settings user={user} onUpdateUser={handleUpdateUser} />} />
          <Route path="/children" element={<div className="p-8 text-center text-slate-500">Parent portal under construction</div>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
}