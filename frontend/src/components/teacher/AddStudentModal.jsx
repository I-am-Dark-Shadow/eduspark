import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const AddStudentModal = ({ onClose, onStudentAdded }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await api.post('/api/users/register-student', { name, email, password });
      toast.success(`${data.name} has been registered.`);
      onStudentAdded(data);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Student Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Student Email</label>
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-600 mb-1">Password</label>
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary" />
      </div>
      <div className="flex justify-end pt-4">
        <button type="button" onClick={onClose} className="px-6 py-2 text-slate-700 mr-2">Cancel</button>
        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300">
          {isLoading ? 'Adding...' : 'Add Student'}
        </button>
      </div>
    </form>
  );
};

export default AddStudentModal;