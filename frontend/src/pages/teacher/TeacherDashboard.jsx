import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';
import useAuthStore from '../../store/authStore';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import AddStudentModal from '../../components/teacher/AddStudentModal';
import { LuUsers, LuFilePlus2, LuBell, LuBadgePlus , LuBadgeHelp , LuClock } from 'react-icons/lu';
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

    const handleStudentAdded = () => {
        fetchDashboardData();
    };

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Spinner size="12" /></div>;
    }

    return (
        <div>
            {/* Responsive Change: Text size smaller on mobile */}
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Welcome, {user?.name}!</h2>

            {/* Responsive Change: Grid stacks to 1 column on mobile, 2 on tablet, 4 on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard icon={<LuUsers size={32} />} label="Total Students" value={stats.studentCount} colorClass="text-primary bg-blue-100" />
                <StatCard icon={<LuFilePlus2 size={32} />} label="Exams Created" value={stats.examCount} colorClass="text-secondary bg-green-100" />
                <StatCard icon={<LuBell size={32} />} label="Pending Retakes" value={stats.pendingRetakes} colorClass="text-danger bg-red-100" />
                <StatCard icon={<LuBadgeHelp  size={32} />} label="Pending View Requests" value={stats.pendingViewRequests} colorClass="text-amber-600 bg-amber-100" />
            </div>

            {/* Responsive Change: Grid stacks vertically on mobile/tablet */}
            <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 bg-surface p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                        <button onClick={() => setIsModalOpen(true)} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-primary text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition-colors">
                            <LuBadgePlus  /> Add New Student
                        </button>
                        <button onClick={() => navigate('/teacher/create-exam')} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-secondary text-white font-semibold rounded-lg shadow-md hover:bg-emerald-700 transition-colors">
                            <LuFilePlus2 /> Create New Exam
                        </button>
                    </div>
                </div>
                <div className="lg:col-span-2 bg-surface p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl font-bold mb-4">My Created Exams</h3>
                    {stats.recentExams.length > 0 ? (
                        <ul className="space-y-3">
                            {stats.recentExams.map(exam => (
                                <li key={exam._id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-3 bg-slate-50 rounded-lg">
                                    <span className="font-semibold text-slate-700">{exam.title}</span>
                                    <span className="text-sm text-slate-500 flex items-center gap-1"><LuClock size={14} /> {format(new Date(exam.createdAt), 'PP')}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-slate-500 text-center py-8">You have not created any exams yet.</p>
                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Register New Student">
                <AddStudentModal onClose={() => setIsModalOpen(false)} onStudentAdded={handleStudentAdded} />
            </Modal>
        </div>
    );
};

const StatCard = ({ icon, label, value, colorClass }) => (
    <div className="bg-surface p-6 rounded-2xl shadow-lg flex items-center gap-4">
        <div className={`${colorClass} p-3 md:p-4 rounded-full`}>{icon}</div>
        <div>
            <h3 className="font-bold text-slate-500 text-sm md:text-base">{label}</h3>
            <p className={`text-3xl md:text-4xl font-extrabold mt-1`}>{value}</p>
        </div>
    </div>
);

export default TeacherDashboard;