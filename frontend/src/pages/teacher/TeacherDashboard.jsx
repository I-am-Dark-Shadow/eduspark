import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import AddStudentModal from '../../components/teacher/AddStudentModal';
import { LuUsers, LuFilePlus2, LuBell, LuPlus , LuBadgeHelp , LuClock } from 'react-icons/lu';
import { format } from 'date-fns';

const TeacherDashboard = () => {
    const { user } = useAuthStore();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        studentCount: 0,
        examCount: 0,
        pendingRetakes: 0,
        pendingViewRequests: 0,
        recentExams: []
    });
    const [isLoading, setIsLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);

    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            const { data } = await api.get('/api/dashboard/teacher');
            setStats(data);
        } catch (error) {
            console.error("Failed to fetch dashboard data", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStudentAdded = () => { fetchDashboardData(); };

    if (isLoading) return <div className="flex justify-center items-center h-64"><Spinner size="12" /></div>;

    return (
        <div className="space-y-8">
            <h2 className="text-2xl md:text-3xl font-bold text-on-surface">Welcome, {user?.name}!</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<LuUsers size={24} />} label="Total Students" value={stats.studentCount} />
                <StatCard icon={<LuFilePlus2 size={24} />} label="Exams Created" value={stats.examCount} />
                <StatCard icon={<LuBell size={24} />} label="Pending Retakes" value={stats.pendingRetakes} />
                <StatCard icon={<LuBadgeHelp  size={24} />} label="Pending View Requests" value={stats.pendingViewRequests} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-surface p-6 rounded-2xl shadow-sm">
                    <h3 className="text-xl font-bold mb-4 text-on-surface">Quick Actions</h3>
                    <div className="space-y-3">
                        <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition-colors">
                            <LuPlus  /> Add New Student
                        </button>
                        <button onClick={() => navigate('/teacher/create-exam')} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 transition-colors">
                            <LuFilePlus2 /> Create New Exam
                        </button>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-surface p-6 rounded-2xl shadow-sm">
                    <h3 className="text-xl font-bold mb-4 text-on-surface">Recently Created Exams</h3>
                    {stats.recentExams.length > 0 ? (
                        <ul className="space-y-3">
                            {stats.recentExams.map(exam => (
                                <li key={exam._id} className="flex justify-between items-center p-3 bg-background rounded-lg">
                                    <span className="font-semibold text-on-surface">{exam.title}</span>
                                    <span className="text-sm text-on-surface-secondary flex items-center gap-1.5"><LuClock size={14} /> {format(new Date(exam.createdAt), 'PP')}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-on-surface-secondary text-center py-8">You have not created any exams yet.</p>
                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Student">
                <AddStudentModal onClose={() => setIsModalOpen(false)} onStudentAdded={handleStudentAdded} />
            </Modal>
        </div>
    );
};

const StatCard = ({ icon, label, value }) => (
     <div className="bg-surface p-6 rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
            <div className="bg-primary/10 text-primary p-3 rounded-xl">{icon}</div>
            <p className="font-semibold text-on-surface-secondary">{label}</p>
        </div>
        <p className="text-4xl font-bold text-on-surface mt-4">{value}</p>
    </div>
);

export default TeacherDashboard;