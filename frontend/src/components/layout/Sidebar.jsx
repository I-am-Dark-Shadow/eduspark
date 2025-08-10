import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { 
  LuLayoutDashboard, LuBook, LuUsers, LuClipboardList, LuBell, 
  LuUser, LuLogOut, LuFilePlus2, LuBadgeHelp , LuIndianRupee, LuMailQuestion, LuX, LuVideo
} from "react-icons/lu";

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.post('/api/users/logout');
      logout();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Logout failed');
    }
  };

  const teacherLinks = [
    { icon: <LuLayoutDashboard />, text: 'Dashboard', path: '/teacher/dashboard' },
    { icon: <LuFilePlus2 />, text: 'Create Exam', path: '/teacher/create-exam' },
    { icon: <LuUsers />, text: 'Students', path: '/teacher/students' },
    { icon: <LuBell />, text: 'Retake Requests', path: '/teacher/retakes' },
    { icon: <LuBadgeHelp  />, text: 'View Requests', path: '/teacher/view-requests' },
    { icon: <LuIndianRupee />, text: 'Payment Status', path: '/teacher/payments' },
    { icon: <LuMailQuestion />, text: 'Payment Requests', path: '/teacher/payment-requests' },
    { icon: <LuBell />, text: 'Notifications', path: '/teacher/notifications' },
    { icon: <LuVideo />, text: 'Add Course', path: '/teacher/add-course' },
  ];

  const studentLinks = [
    { icon: <LuLayoutDashboard />, text: 'Dashboard', path: '/student/dashboard' },
    { icon: <LuBook />, text: 'Exams', path: '/student/exams' },
    { icon: <LuClipboardList />, text: 'My Results', path: '/student/results' },
    { icon: <LuIndianRupee />, text: 'My Payments', path: '/student/payments' },
    { icon: <LuUser />, text: 'Profile', path: '/student/profile' },
  ];

  const links = user?.role === 'teacher' ? teacherLinks : studentLinks;
  
  // New Design styles
  const linkClass = "flex items-center px-4 py-3 text-on-surface-secondary font-semibold hover:bg-primary/10 hover:text-primary rounded-lg transition-colors duration-200";
  const activeLinkClass = "bg-primary text-white";

  return (
    <aside 
      className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-surface text-on-surface flex-col p-4 border-r border-border-color
        transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="flex justify-between items-center mb-6 pb-4">
        <div className="flex items-center gap-2">
            <img src="/logo.png" alt="EduSpark Logo" className="w-10 h-10" />
            <span className="text-2xl font-bold text-on-surface">EduSpark</span>
        </div>
        <button onClick={toggleSidebar} className="lg:hidden p-2 text-on-surface-secondary hover:text-on-surface">
          <LuX size={24} />
        </button>
      </div>

      <nav className="flex-grow">
        <ul className="space-y-2">
          {links.map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.path}
                onClick={() => { if (isSidebarOpen) toggleSidebar(); }}
                className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
              >
                <span className="text-xl">{link.icon}</span>
                <span className="ml-4">{link.text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-6 pt-4 border-t border-border-color">
        <button onClick={handleLogout} className={`${linkClass} w-full`}>
          <span className="text-xl"><LuLogOut /></span>
          <span className="ml-4">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;