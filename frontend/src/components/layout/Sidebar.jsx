import { NavLink, useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { 
  LuLayoutDashboard, 
  LuBook, 
  LuUsers, 
  LuClipboardList,
  LuBell, 
  LuUser, 
  LuLogOut, 
  LuFilePlus2,
  LuBadgeHelp , 
  LuX, 
  LuIndianRupee,
} from "react-icons/lu";

// We receive props to control the mobile sidebar's state
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
    { icon: <LuIndianRupee />, text: 'Payments', path: '/teacher/payments' },
    { icon: <LuIndianRupee />, text: 'Payment Requests', path: '/teacher/payment-requests' },
  ];

  const studentLinks = [
    { icon: <LuLayoutDashboard />, text: 'Dashboard', path: '/student/dashboard' },
    { icon: <LuBook />, text: 'Exams', path: '/student/exams' },
    { icon: <LuClipboardList />, text: 'My Results', path: '/student/results' },
    { icon: <LuUser />, text: 'Profile', path: '/student/profile' },
    { icon: <LuIndianRupee />, text: 'My Payments', path: '/student/payments' },
  ];

  const links = user?.role === 'teacher' ? teacherLinks : studentLinks;
  const linkClass = "flex items-center px-4 py-3 text-slate-200 hover:bg-slate-700 rounded-lg transition-colors duration-200";
  const activeLinkClass = "bg-primary text-white";

  return (
    // Responsive Change: The entire aside is now responsive.
    // It's a fixed panel on mobile that slides in/out, and a static panel on desktop.
    <aside 
      className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-slate-800 text-white flex-col p-4 
        transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:flex
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      <div className="flex justify-between items-center mb-6 pb-4 border-b border-slate-700">
        <div className="text-2xl font-bold text-center">EduSpark</div>
        {/* Responsive Change: Close button only visible on mobile/tablet */}
        <button onClick={toggleSidebar} className="lg:hidden p-2 text-slate-300 hover:text-white">
          <LuX size={24} />
        </button>
      </div>

      <nav className="flex-grow">
        <ul className="space-y-2">
          {links.map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.path}
                onClick={toggleSidebar} // Close sidebar on link click on mobile
                className={({ isActive }) => `${linkClass} ${isActive ? activeLinkClass : ''}`}
              >
                <span className="text-xl">{link.icon}</span>
                <span className="ml-4 font-medium">{link.text}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className="mt-6 pt-4 border-t border-slate-700">
        <button onClick={handleLogout} className={`${linkClass} w-full`}>
          <span className="text-xl"><LuLogOut /></span>
          <span className="ml-4 font-medium">Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;