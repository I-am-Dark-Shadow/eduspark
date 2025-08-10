import { lazy, Suspense } from 'react'; // Import lazy and Suspense
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import useAuthStore from './store/authStore';

// Import Layouts and static components
import Layout from './components/layout/Layout';
import HomeNavbar from './components/home/HomeNavbar';
import Footer from './components/home/Footer';
import ProtectedRoute from './components/common/ProtectedRoute';
import Spinner from './components/common/Spinner';

// --- LAZY-LOADED PAGES ---
// Public
const HomePage = lazy(() => import('./pages/public/HomePage'));
const CoursesPage = lazy(() => import('./pages/public/CoursesPage'));
// Auth
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
// Teacher
const TeacherDashboard = lazy(() => import('./pages/teacher/TeacherDashboard'));
const AddCoursePage = lazy(() => import('./pages/teacher/AddCoursePage'));
const CreateExamPage = lazy(() => import('./pages/teacher/CreateExamPage'));
const StudentsListPage = lazy(() => import('./pages/teacher/StudentsListPage'));
const StudentDetailPage = lazy(() => import('./pages/teacher/StudentDetailPage'));
const RetakeRequestsPage = lazy(() => import('./pages/teacher/RetakeRequestsPage'));
const ViewRequestsPage = lazy(() => import('./pages/teacher/ViewRequestsPage'));
const PaymentsPage = lazy(() => import('./pages/teacher/PaymentsPage'));
const PaymentRequestsPage = lazy(() => import('./pages/teacher/PaymentRequestsPage'));
const NotificationsPage = lazy(() => import('./pages/teacher/NotificationsPage'));
// Student
const StudentDashboard = lazy(() => import('./pages/student/StudentDashboard'));
const ExamsListPage = lazy(() => import('./pages/student/ExamsListPage'));
const ExamPage = lazy(() => import('./pages/student/ExamPage'));
const MyResultsPage = lazy(() => import('./pages/student/MyResultsPage'));
const ResultDetailPage = lazy(() => import('./pages/student/ResultDetailPage'));
const ProfilePage = lazy(() => import('./pages/student/ProfilePage'));
const MyPaymentsPage = lazy(() => import('./pages/student/MyPaymentsPage'));


// A new layout for public-facing pages like the homepage
const PublicLayout = () => (
  <>
    <HomeNavbar />
    <Outlet />
    <Footer />
  </>
);

const FullScreenLoader = () => (
  <div className="flex justify-center items-center h-screen">
    <Spinner size="16" />
  </div>
);

function App() {
  const { user } = useAuthStore();

  return (
    <Router>
      {/* Suspense is a loading boundary for lazy-loaded components */}
      <Suspense fallback={<FullScreenLoader />}>
        <Routes>
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
          } />

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
      </Suspense>
    </Router>
  );
}

export default App;