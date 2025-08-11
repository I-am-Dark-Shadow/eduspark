import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Modal from '../../components/common/Modal';
import AddStudentModal from '../../components/teacher/AddStudentModal';
import Spinner from '../../components/common/Spinner';
import { LuBadgePlus, LuEye, LuMail } from 'react-icons/lu';

const StudentsListPage = () => {
  const [students, setStudents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const { data } = await api.get('/api/users/students');
        setStudents(data);
      } catch (error) {
        console.error("Failed to fetch students", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStudents();
  }, []);

  const handleStudentAdded = (newStudent) => {
    setStudents(prev => [newStudent, ...prev]);
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64"><Spinner size="12" /></div>;
  }

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold">Your Students</h2>
        <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-orange-600 transition-colors">
          <LuBadgePlus /> Add Student
        </button>
      </div>

      <div className="bg-surface rounded-xl shadow-lg">
        {/* Mobile View: List of Cards */}
        <div className="md:hidden">
          {students.map(student => (
            <div key={student._id} className="p-4 border-b border-border-color last:border-b-0">
              <div className="flex items-center gap-4">
                <img src={student.profilePicture} alt={student.name} className="w-12 h-12 rounded-full object-cover flex-shrink-0"/>
                {/* THIS IS THE FIX for mobile */}
                <div className="flex-grow min-w-0">
                  <p className="font-bold text-on-surface truncate" title={student.name}>{student.name}</p>
                  <p className="text-sm text-slate-500 flex items-center gap-1 truncate" title={student.email}><LuMail size={14} />{student.email}</p>
                </div>
                <Link to={`/teacher/student/${student._id}`} className="p-2 text-primary rounded-full hover:bg-background flex-shrink-0">
                  <LuEye size={20} />
                </Link>
              </div>
            </div>
          ))}
        </div>
        
        {/* Desktop View: Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50 border-b border-border-color">
              <tr>
                <th className="p-4 font-bold">Name</th>
                <th className="p-4 font-bold">Email</th>
                <th className="p-4 font-bold text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map(student => (
                <tr key={student._id} className="border-b border-border-color last:border-b-0 hover:bg-slate-50">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                        <img src={student.profilePicture} alt={student.name} className="w-10 h-10 rounded-full object-cover"/>
                        {/* THIS IS THE FIX for desktop */}
                        <span className="truncate" title={student.name}>{student.name}</span>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 truncate" title={student.email}>{student.email}</td>
                  <td className="p-4 text-center">
                    <Link to={`/teacher/student/${student._id}`} className="inline-flex items-center gap-1 text-primary hover:underline">
                      <LuEye /> View Progress
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Student">
        <AddStudentModal onClose={() => setIsModalOpen(false)} onStudentAdded={handleStudentAdded} />
      </Modal>
    </div>
  );
};

export default StudentsListPage;