import useAuthStore from '../../store/authStore';
import useNotificationStore from '../../store/notificationStore'; // Import notification store
import { LuMenu, LuBell } from 'react-icons/lu';
import { Link } from 'react-router-dom'; // Import Link

const Header = ({ title, toggleSidebar }) => {
  const { user } = useAuthStore();
  const { totalPending } = useNotificationStore(); // Get total pending count

  return (
    <header className="bg-background p-4 sm:p-6 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <button onClick={toggleSidebar} className="lg:hidden text-on-surface">
          <LuMenu size={24} />
        </button>
        <h1 className="text-xl md:text-2xl font-bold text-on-surface">{title}</h1>
      </div>
      <div className="flex items-center space-x-4 md:space-x-6">
        {user?.role === 'teacher' && (
            <Link to="/teacher/notifications" className="relative text-on-surface-secondary hover:text-on-surface transition-colors">
                <LuBell size={24} />
                {/* NEW: Conditionally render the notification dot */}
                {totalPending > 0 && (
                    <span className="absolute top-0 right-0 block h-2.5 w-2.5 rounded-full bg-primary ring-2 ring-background"></span>
                )}
            </Link>
        )}

        <div className="flex items-center space-x-2 md:space-x-4">
            <div className="hidden sm:block text-right">
              <p className="font-semibold text-on-surface text-sm">{user?.name}</p>
              <p className="text-xs text-on-surface-secondary capitalize">{user?.role}</p>
            </div>
            <img
              src={user?.profilePicture}
              alt="Profile"
              className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover"
            />
        </div>
      </div>
    </header>
  );
};

export default Header;