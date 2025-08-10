import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { LuArrowLeft } from 'react-icons/lu'; // Import an icon for the back button

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { user, login } = useAuthStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      const homePath = user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
      navigate(homePath);
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post('/api/users/login', { email, password });
      login(data);
      toast.success(`Welcome, ${data.name}!`);
      const homePath = data.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard';
      navigate(homePath);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 to-emerald-100 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        // Added relative positioning to contain the back button
        className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl p-6 md:p-8 space-y-6"
      >
        {/* --- THIS IS THE NEW BUTTON --- */}
        <Link 
            to="/" 
            className="absolute top-4 left-4 p-2 text-on-surface-secondary hover:text-on-surface hover:bg-border-color rounded-full transition-colors"
            aria-label="Back to Home"
        >
            <LuArrowLeft size={20} />
        </Link>
        
        <div className="text-center pt-8">
          <img
            src="/logo.png"
            alt="Logo"
            className="w-28 h-28 md:w-40 md:h-40 mx-auto"
          />
          <p className="text-slate-500 mt-2">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="relative">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="peer w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary placeholder-transparent"
              placeholder="Email address"
              required
            />
            <label
              htmlFor="email"
              className="absolute left-4 -top-6 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3.5 peer-focus:-top-6 peer-focus:text-primary peer-focus:text-sm"
            >
              Email address
            </label>
          </div>

          <div className="relative">
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="peer w-full px-4 py-3 border border-slate-300 rounded-lg text-slate-900 focus:outline-none focus:ring-2 focus:ring-primary placeholder-transparent"
              placeholder="Password"
              required
            />
             <label
              htmlFor="password"
              className="absolute left-4 -top-6 text-slate-500 text-sm transition-all peer-placeholder-shown:text-base peer-placeholder-shown:text-slate-400 peer-placeholder-shown:top-3.5 peer-focus:-top-6 peer-focus:text-primary peer-focus:text-sm"
            >
              Password
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-primary text-white font-bold py-3 px-4 rounded-lg hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all duration-300 disabled:bg-orange-300"
          >
            {isLoading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default LoginPage;