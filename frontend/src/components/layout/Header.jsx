import useAuthStore from '../../store/authStore';
import { LuMenu } from 'react-icons/lu';

// We receive a prop to handle opening the mobile sidebar
// eslint-disable-next-line no-unused-vars
const Header = ({ title, toggleSidebar }) => {
  const { user } = useAuthStore();

  return (
    <header className="bg-surface shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        {/* Responsive Change: Hamburger menu button, only visible on mobile/tablet */}
        <button onClick={toggleSidebar} className="lg:hidden text-on-surface">
          <LuMenu size={24} />
        </button>
        {/* Responsive Change: Text size smaller on mobile */}
        {/* <h1 className="text-sm md:text-2xl font-bold text-on-surface">{title}</h1> */}
      </div>
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Responsive Change: User's name/role is hidden on very small screens */}
        <div className="hidden sm:block text-right">
          <p className="font-semibold text-on-surface">{user?.name}</p>
          <p className="text-sm text-slate-500 capitalize">{user?.role}</p>
        </div>
        <img
          src={user?.profilePicture}
          alt="Profile"
          className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover border-2 border-primary"
        />
      </div>
    </header>
  );
};

export default Header;