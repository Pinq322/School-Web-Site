import { User, UserRole, Subject, Student, Grade, Attendance, Assignment, Notification, Lesson, Message } from '../types';

// Users
export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'Sarah Wilson', email: 'teacher@school.com', role: UserRole.TEACHER, avatarUrl: 'https://picsum.photos/100/100', bio: 'Passionate mathematics teacher with 10 years of experience.' },
  { id: 'u2', name: 'Alex Johnson', email: 'student@school.com', role: UserRole.STUDENT, avatarUrl: 'https://picsum.photos/101/101', bio: 'Aspiring engineer and physics enthusiast.' },
  { id: 'u3', name: 'Martha Johnson', email: 'parent@school.com', role: UserRole.PARENT, avatarUrl: 'https://picsum.photos/102/102' },
  { id: 'u99', name: 'Principal Skinner', email: 'admin@school.com', role: UserRole.ADMIN, avatarUrl: 'https://picsum.photos/105/105' },
];

export const MOCK_STUDENTS: Student[] = [
  { ...MOCK_USERS[1], gradeLevel: 10, parentId: 'u3' } as Student,
  { id: 'u4', name: 'Emily Davis', email: 'emily@school.com', role: UserRole.STUDENT, gradeLevel: 10, avatarUrl: 'https://picsum.photos/103/103' },
  { id: 'u5', name: 'Michael Brown', email: 'michael@school.com', role: UserRole.STUDENT, gradeLevel: 10, avatarUrl: 'https://picsum.photos/104/104' },
  { id: 'u6', name: 'Jessica Miller', email: 'jessica@school.com', role: UserRole.STUDENT, gradeLevel: 10, avatarUrl: 'https://picsum.photos/105/105' },
  { id: 'u7', name: 'David Wilson', email: 'david@school.com', role: UserRole.STUDENT, gradeLevel: 10, avatarUrl: 'https://picsum.photos/106/106' },
  { id: 'u8', name: 'Sophia Taylor', email: 'sophia@school.com', role: UserRole.STUDENT, gradeLevel: 10, avatarUrl: 'https://picsum.photos/107/107' },
];

// Subjects
export const MOCK_SUBJECTS: Subject[] = [
  { id: 's1', name: 'Mathematics 101', teacherId: 'u1', schedule: 'Mon, Wed, Fri 09:00 AM', room: 'Room 301', gradeLevel: 10 },
  { id: 's2', name: 'Physics 101', teacherId: 'u1', schedule: 'Tue, Thu 10:30 AM', room: 'Lab 2', gradeLevel: 10 },
  { id: 's3', name: 'History', teacherId: 'u8', schedule: 'Mon, Wed 13:00 PM', room: 'Room 105', gradeLevel: 10 },
  { id: 's4', name: 'English Literature', teacherId: 'u1', schedule: 'Tue, Thu 09:00 AM', room: 'Room 204', gradeLevel: 10 },
];

// Lessons (Journal Topics)
export let MOCK_LESSONS: Lesson[] = [
  // Math Lessons
  { id: 'l1', subjectId: 's1', date: '2023-10-23', topic: 'Introduction to Derivatives', status: 'COMPLETED', notes: 'Students grasped the concept well.' }, 
  { id: 'l2', subjectId: 's1', date: '2023-10-25', topic: 'Product Rule', homeworkId: 'as1', status: 'COMPLETED' },
  { id: 'l3', subjectId: 's1', date: '2023-10-27', topic: 'Quotient Rule', status: 'PLANNED' },
  
  // Physics Lessons
  { id: 'l4', subjectId: 's2', date: '2023-10-24', topic: 'Newton\'s Third Law', status: 'COMPLETED' },
  { id: 'l5', subjectId: 's2', date: '2023-10-26', topic: 'Friction and Drag', status: 'PLANNED' },
  
  // English Lessons
  { id: 'l6', subjectId: 's4', date: '2023-10-24', topic: 'Shakespearean Sonnets', status: 'COMPLETED' },
  { id: 'l7', subjectId: 's4', date: '2023-10-26', topic: 'Modern Poetry', status: 'PLANNED' },
];

// Grades
export let MOCK_GRADES: Grade[] = [
  // Math Grades
  { id: 'g1', studentId: 'u2', subjectId: 's1', score: 85, maxScore: 100, type: 'HOMEWORK', title: 'Algebra Worksheet', date: '2023-10-01' },
  { id: 'g2', studentId: 'u2', subjectId: 's1', score: 92, maxScore: 100, type: 'QUIZ', title: 'Quadratic Equations', date: '2023-10-05' },
  { id: 'g3', studentId: 'u2', subjectId: 's1', score: 78, maxScore: 100, type: 'EXAM', title: 'Midterm', date: '2023-10-15' },
  
  // Grades for diary view
  { id: 'g8', studentId: 'u2', subjectId: 's1', score: 90, maxScore: 100, type: 'QUIZ', date: '2023-10-23' },
  
  { id: 'g4', studentId: 'u4', subjectId: 's1', score: 95, maxScore: 100, type: 'HOMEWORK', title: 'Algebra Worksheet', date: '2023-10-01' },
  { id: 'g5', studentId: 'u4', subjectId: 's1', score: 88, maxScore: 100, type: 'QUIZ', title: 'Quadratic Equations', date: '2023-10-05' },
  
  // Physics Grades
  { id: 'g6', studentId: 'u2', subjectId: 's2', score: 88, maxScore: 100, type: 'HOMEWORK', title: 'Motion Laws', date: '2023-10-02' },
  { id: 'g7', studentId: 'u2', subjectId: 's2', score: 95, maxScore: 100, type: 'PROJECT', title: 'Bridge Building', date: '2023-10-10' },
];

// Attendance
export let MOCK_ATTENDANCE: Attendance[] = [
  { id: 'a1', studentId: 'u2', subjectId: 's1', date: '2023-10-01', status: 'PRESENT' },
  { id: 'a2', studentId: 'u2', subjectId: 's1', date: '2023-10-03', status: 'PRESENT' },
  { id: 'a3', studentId: 'u2', subjectId: 's1', date: '2023-10-05', status: 'ABSENT' },
  { id: 'a4', studentId: 'u4', subjectId: 's1', date: '2023-10-05', status: 'LATE' },
  { id: 'a5', studentId: 'u2', subjectId: 's1', date: '2023-10-25', status: 'ABSENT' },
];

// Assignments
export const MOCK_ASSIGNMENTS: Assignment[] = [
  { id: 'as1', subjectId: 's1', title: 'Calculus Intro Problems', description: 'Complete pages 45-47, exercises 1-10.', assignedDate: '2023-10-20', dueDate: '2023-10-25', status: 'OPEN' },
  { id: 'as2', subjectId: 's1', title: 'Group Project: Statistics', description: 'Collect data and present findings.', assignedDate: '2023-10-15', dueDate: '2023-10-30', status: 'OPEN' },
  { id: 'as3', subjectId: 's2', title: 'Lab Report: Pendulum', description: 'Submit PDF format.', assignedDate: '2023-10-18', dueDate: '2023-10-22', status: 'CLOSED' },
];

// Notifications
export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', userId: 'u2', title: 'New Grade: Physics', message: 'You received 95/100 on Project: Bridge Building', date: '2 mins ago', read: false, type: 'GRADE' },
  { id: 'n2', userId: 'u2', title: 'Assignment Due Soon', message: 'Calculus Intro Problems is due tomorrow', date: '1 hour ago', read: false, type: 'ASSIGNMENT' },
  { id: 'n3', userId: 'u2', title: 'School Announcement', message: 'Parent-Teacher conferences next Tuesday', date: '1 day ago', read: true, type: 'SYSTEM' },
];

// Messages
export let MOCK_MESSAGES: Message[] = [
  { id: 'm1', senderId: 'u1', receiverId: 'u3', content: 'Hello Mrs. Johnson, Alex has been doing great in Algebra lately!', timestamp: '2023-10-24T10:30:00', read: false },
  { id: 'm2', senderId: 'u3', receiverId: 'u1', content: 'Hi Ms. Wilson, that is wonderful to hear. He really enjoys your class.', timestamp: '2023-10-24T11:00:00', read: true },
  { id: 'm3', senderId: 'u1', receiverId: 'u3', content: 'Just a reminder about the parent teacher conference next week.', timestamp: '2023-10-25T09:00:00', read: false },
];

export const getStudentAverage = (studentId: string, subjectId?: string): number => {
  const grades = MOCK_GRADES.filter(g => 
    g.studentId === studentId && (!subjectId || g.subjectId === subjectId)
  );
  if (grades.length === 0) return 0;
  const total = grades.reduce((acc, curr) => acc + (curr.score / curr.maxScore) * 100, 0);
  return Math.round(total / grades.length);
};

export const getClassAverage = (subjectId: string): number => {
  const grades = MOCK_GRADES.filter(g => g.subjectId === subjectId);
  if (grades.length === 0) return 0;
  const total = grades.reduce((acc, curr) => acc + (curr.score / curr.maxScore) * 100, 0);
  return Math.round(total / grades.length);
};

// --- Helper Functions to Modify Mock Data (Simulating Backend) ---

export const updateMockUser = (userId: string, data: Partial<User>) => {
    const userIdx = MOCK_USERS.findIndex(u => u.id === userId);
    if (userIdx !== -1) {
        MOCK_USERS[userIdx] = { ...MOCK_USERS[userIdx], ...data };
    }
    
    // Also update student record if it exists separately
    const studentIdx = MOCK_STUDENTS.findIndex(s => s.id === userId);
    if (studentIdx !== -1) {
        MOCK_STUDENTS[studentIdx] = { ...MOCK_STUDENTS[studentIdx], ...data };
    }
    
    return MOCK_USERS[userIdx];
};

export const addUser = (user: User, gradeLevel?: number) => {
    MOCK_USERS.push(user);
    if (user.role === UserRole.STUDENT && gradeLevel) {
        MOCK_STUDENTS.push({
            ...user,
            gradeLevel,
            // Defaulting parentId for now or it could be passed in
        } as Student);
    }
};

export const addSubject = (subject: Subject) => {
    MOCK_SUBJECTS.push(subject);
};

export const updateStudentGrade = (studentId: string, subjectId: string, date: string, score: number) => {
    const existingIndex = MOCK_GRADES.findIndex(g => g.studentId === studentId && g.subjectId === subjectId && g.date === date);
    if (existingIndex > -1) {
        MOCK_GRADES[existingIndex] = { ...MOCK_GRADES[existingIndex], score };
    } else {
        MOCK_GRADES.push({
            id: `g-new-${Date.now()}-${Math.random()}`,
            studentId,
            subjectId,
            score,
            maxScore: 100,
            type: 'QUIZ', // Default type for lesson grades
            date
        });
    }
};

export const updateStudentAttendance = (studentId: string, subjectId: string, date: string, status: Attendance['status']) => {
    const existingIndex = MOCK_ATTENDANCE.findIndex(a => a.studentId === studentId && a.subjectId === subjectId && a.date === date);
    if (existingIndex > -1) {
        MOCK_ATTENDANCE[existingIndex] = { ...MOCK_ATTENDANCE[existingIndex], status };
    } else {
        MOCK_ATTENDANCE.push({
            id: `a-new-${Date.now()}-${Math.random()}`,
            studentId,
            subjectId,
            date,
            status
        });
    }
};

export const updateAssignmentStatus = (id: string, status: Assignment['status']) => {
    const index = MOCK_ASSIGNMENTS.findIndex(a => a.id === id);
    if (index > -1) {
        MOCK_ASSIGNMENTS[index] = { ...MOCK_ASSIGNMENTS[index], status };
    }
};

export const sendSystemMessage = (message: Message) => {
    MOCK_MESSAGES.push(message);
};

export const addNewLesson = (lesson: Lesson) => {
    MOCK_LESSONS.push(lesson);
};
