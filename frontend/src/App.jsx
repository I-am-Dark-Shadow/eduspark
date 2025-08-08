import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import useAuthStore from './store/authStore';

// Layout and Protected Route
import Layout from './components/layout/Layout';
import ProtectedRoute from './components/common/ProtectedRoute';

// Pages
import LoginPage from './pages/auth/LoginPage';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import CreateExamPage from './pages/teacher/CreateExamPage';
import StudentsListPage from './pages/teacher/StudentsListPage';
import StudentDetailPage from './pages/teacher/StudentDetailPage';
import RetakeRequestsPage from './pages/teacher/RetakeRequestsPage';
import StudentDashboard from './pages/student/StudentDashboard';
import ExamsListPage from './pages/student/ExamsListPage';
import ExamPage from './pages/student/ExamPage';
import MyResultsPage from './pages/student/MyResultsPage';
import ResultDetailPage from './pages/student/ResultDetailPage';
import ProfilePage from './pages/student/ProfilePage';
import ViewRequestsPage from './pages/teacher/ViewRequestsPage';

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Catch-all route for authenticated users */}
        <Route path="/" element={
          user ? (
            user.role === 'teacher' ? <Navigate to="/teacher/dashboard" /> : <Navigate to="/student/dashboard" />
          ) : (
            <Navigate to="/login" />
          )
        }/>

        {/* Teacher Routes */}
        <Route element={<Layout />}>
          <Route path="/teacher/dashboard" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/teacher/create-exam" element={<ProtectedRoute allowedRoles={['teacher']}><CreateExamPage /></ProtectedRoute>} />
          <Route path="/teacher/students" element={<ProtectedRoute allowedRoles={['teacher']}><StudentsListPage /></ProtectedRoute>} />
          <Route path="/teacher/student/:id" element={<ProtectedRoute allowedRoles={['teacher']}><StudentDetailPage /></ProtectedRoute>} />
          <Route path="/teacher/retakes" element={<ProtectedRoute allowedRoles={['teacher']}><RetakeRequestsPage /></ProtectedRoute>} />
          <Route path="/teacher/view-requests" element={<ProtectedRoute allowedRoles={['teacher']}><ViewRequestsPage /></ProtectedRoute>} />
        </Route>

        {/* Student Routes */}
        <Route element={<Layout />}>
          <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/exams" element={<ProtectedRoute allowedRoles={['student']}><ExamsListPage /></ProtectedRoute>} />
          <Route path="/student/results" element={<ProtectedRoute allowedRoles={['student']}><MyResultsPage /></ProtectedRoute>} />
          <Route path="/student/result/:id" element={<ProtectedRoute allowedRoles={['student']}><ResultDetailPage /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><ProfilePage /></ProtectedRoute>} />
        </Route>
        
        {/* Exam taking page is outside the main layout */}
        <Route path="/exam/:id" element={<ProtectedRoute allowedRoles={['student']}><ExamPage /></ProtectedRoute>} />

      </Routes>
    </Router>
  );
}

export default App;