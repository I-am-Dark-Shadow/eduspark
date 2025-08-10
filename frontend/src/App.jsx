import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import useAuthStore from './store/authStore';

// Import Layouts
import Layout from './components/layout/Layout'; // Your existing dashboard layout
import HomeNavbar from './components/home/HomeNavbar'; // The new public navbar
import Footer from './components/home/Footer'; // The new public footer

// Import Pages
import ProtectedRoute from './components/common/ProtectedRoute';
import HomePage from './pages/public/HomePage'; // The new homepage
import LoginPage from './pages/auth/LoginPage';
// ... (your existing page imports)
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
import PaymentsPage from './pages/teacher/PaymentsPage';
import PaymentRequestsPage from './pages/teacher/PaymentRequestsPage';
import MyPaymentsPage from './pages/student/MyPaymentsPage';
import NotificationsPage from './pages/teacher/NotificationsPage';
import AddCoursePage from './pages/teacher/AddCoursePage';
import CoursesPage from './pages/public/CoursesPage';

// A new layout for public-facing pages like the homepage
const PublicLayout = () => (
  <>
    <HomeNavbar />
    <Outlet />
    <Footer />
  </>
);

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/courses" element={<CoursesPage />} />
        </Route>
        
        <Route path="/login" element={<LoginPage />} />

        {/* Catch-all for logged-in users trying to access root */}
        <Route path="/home" element={
          user ? (
            user.role === 'teacher' ? <Navigate to="/teacher/dashboard" /> : <Navigate to="/student/dashboard" />
          ) : (
            <Navigate to="/login" />
          )
        }/>

        {/* Teacher Routes (inside the dashboard layout) */}
        <Route element={<Layout />}>
          <Route path="/teacher/dashboard" element={<ProtectedRoute allowedRoles={['teacher']}><TeacherDashboard /></ProtectedRoute>} />
          <Route path="/teacher/create-exam" element={<ProtectedRoute allowedRoles={['teacher']}><CreateExamPage /></ProtectedRoute>} />
          <Route path="/teacher/students" element={<ProtectedRoute allowedRoles={['teacher']}><StudentsListPage /></ProtectedRoute>} />
          <Route path="/teacher/student/:id" element={<ProtectedRoute allowedRoles={['teacher']}><StudentDetailPage /></ProtectedRoute>} />
          <Route path="/teacher/retakes" element={<ProtectedRoute allowedRoles={['teacher']}><RetakeRequestsPage /></ProtectedRoute>} />
          <Route path="/teacher/view-requests" element={<ProtectedRoute allowedRoles={['teacher']}><ViewRequestsPage /></ProtectedRoute>} />
          <Route path="/teacher/payments" element={<ProtectedRoute allowedRoles={['teacher']}><PaymentsPage /></ProtectedRoute>} />
          <Route path="/teacher/payment-requests" element={<ProtectedRoute allowedRoles={['teacher']}><PaymentRequestsPage /></ProtectedRoute>} />
          <Route path="/teacher/notifications" element={<ProtectedRoute allowedRoles={['teacher']}><NotificationsPage /></ProtectedRoute>} />
          <Route path="/teacher/add-course" element={<ProtectedRoute allowedRoles={['teacher']}><AddCoursePage /></ProtectedRoute>} />
        </Route>

        {/* Student Routes (inside the dashboard layout) */}
        <Route element={<Layout />}>
          <Route path="/student/dashboard" element={<ProtectedRoute allowedRoles={['student']}><StudentDashboard /></ProtectedRoute>} />
          <Route path="/student/exams" element={<ProtectedRoute allowedRoles={['student']}><ExamsListPage /></ProtectedRoute>} />
          <Route path="/student/results" element={<ProtectedRoute allowedRoles={['student']}><MyResultsPage /></ProtectedRoute>} />
          <Route path="/student/result/:id" element={<ProtectedRoute allowedRoles={['student']}><ResultDetailPage /></ProtectedRoute>} />
          <Route path="/student/profile" element={<ProtectedRoute allowedRoles={['student']}><ProfilePage /></ProtectedRoute>} />
          <Route path="/student/payments" element={<ProtectedRoute allowedRoles={['student']}><MyPaymentsPage /></ProtectedRoute>} />
        </Route>
        
        {/* Exam taking page is outside the main layout */}
        <Route path="/exam/:id" element={<ProtectedRoute allowedRoles={['student']}><ExamPage /></ProtectedRoute>} />

      </Routes>
    </Router>
  );
}

export default App;