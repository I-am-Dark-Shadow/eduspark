import { useState, useEffect } from 'react';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';

// Import the new widget components we will create
import RecentEnrolledExam from '../../components/student/dashboard/RecentEnrolledExam';
import YourResources from '../../components/student/dashboard/YourResources';
import DashboardCalendar from '../../components/student/dashboard/DashboardCalendar';
import MarksBarChart from '../../components/student/dashboard/MarksBarChart';
import PerformanceGauge from '../../components/student/dashboard/PerformanceGauge';
import RecentClasses from '../../components/student/dashboard/RecentClasses';
import UpcomingLesson from '../../components/student/dashboard/UpcomingLesson';

const StudentDashboard = () => {
    const { user } = useAuthStore();
    const [dashboardData, setDashboardData] = useState({
        results: [],
        exams: [],
        payments: []
    });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                // Fetch all data in parallel for a faster load time
                const [resultsRes, examsRes, paymentsRes] = await Promise.all([
                    api.get('/api/results/my-results'),
                    api.get('/api/exams'),
                    api.get('/api/payments/my-history')
                ]);

                setDashboardData({
                    results: resultsRes.data,
                    exams: examsRes.data,
                    payments: paymentsRes.data
                });
            } catch (error) {
                console.error("Failed to fetch dashboard data", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (isLoading) {
        return <div className="flex justify-center items-center h-screen"><Spinner size="16" /></div>;
    }

    const completedResults = dashboardData.results.filter(r => r.submitted);
    const completedExamIds = new Set(completedResults.map(r => r.exam._id));
    const upcomingExams = dashboardData.exams.filter(exam => !completedExamIds.has(exam._id));

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-3xl md:text-4xl font-bold text-on-surface">Hello {user?.name.split(' ')[0]} 👋</h2>
                <p className="text-on-surface-secondary mt-1">Let's learn something new today!</p>
            </div>

            {/* Top Row Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                <div className="lg:col-span-2"><RecentEnrolledExam results={completedResults} /></div>
                <div className="lg:col-span-3"><YourResources results={completedResults} /></div>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                {/* Left Column (Main Content) */}
                <div className="lg:col-span-2 space-y-8">
                    <MarksBarChart results={completedResults} />
                    <RecentClasses results={completedResults} />
                    <UpcomingLesson upcomingExams={upcomingExams} />
                    
                </div>

                {/* Right Column (Sidebar Content) */}
                <div className="lg:col-span-1 space-y-8">
                    <PerformanceGauge results={completedResults} />
                    <DashboardCalendar payments={dashboardData.payments} />
                    
                </div>
            </div>
        </div>
    );
};

export default StudentDashboard;