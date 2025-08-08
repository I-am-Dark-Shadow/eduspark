import { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { motion } from 'framer-motion';

const getTitleFromPathname = (pathname) => {
  const parts = pathname.split('/').filter(Boolean);
  if (parts.length < 2) return "Dashboard";
  let title = parts.pop().replace(/-/g, ' ');
  if (parts.includes('student') && !isNaN(title)) return "Student Details";
  if (parts.includes('result') && !isNaN(title)) return "Result Details";
  return title.charAt(0).toUpperCase() + title.slice(1);
};

const Layout = () => {
  const location = useLocation();
  const title = getTitleFromPathname(location.pathname);
  
  // Responsive Change: State to manage sidebar visibility on mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  return (
    // Responsive Change: On mobile, the sidebar is a fixed overlay. On desktop, it's part of the flex layout.
    <div className="relative min-h-screen lg:flex">
      {/* Overlay for mobile when sidebar is open */}
      {isSidebarOpen && (
          <div 
              onClick={toggleSidebar} 
              className="fixed inset-0 bg-black opacity-50 z-30 lg:hidden"
          ></div>
      )}

      <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex-1 flex flex-col">
        <Header title={title} toggleSidebar={toggleSidebar} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto p-4 sm:p-6 md:p-8">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default Layout;