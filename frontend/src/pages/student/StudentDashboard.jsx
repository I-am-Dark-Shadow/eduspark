import { useState, useEffect } from 'react';
import api from '../../services/api';
import ChartComponent from '../../components/common/ChartComponent';
import Spinner from '../../components/common/Spinner';
import { format } from 'date-fns';
import { LuBook, LuRepeat, LuStar, LuTrendingUp } from 'react-icons/lu';

// Helper function to calculate stats for a given set of results
const calculateStats = (results) => {
    if (!results || results.length === 0) {
        return { count: 0, avgScore: 0, highScore: 0, chartData: [] };
    }
    
    const scores = results.map(r => (r.score / r.totalMarks) * 100);
    const count = results.length;
    const avgScore = (scores.reduce((acc, score) => acc + score, 0) / count).toFixed(2);
    const highScore = Math.max(...scores).toFixed(2);
    
    const chartData = results.map(r => ({
        name: format(new Date(r.createdAt), 'MMM d'),
        Score: ((r.score / r.totalMarks) * 100).toFixed(2)
    }));
    
    return { count, avgScore, highScore, chartData };
};

const StatCard = ({ icon, label, value, colorClass }) => (
    <div className={`bg-surface p-6 rounded-2xl shadow-lg flex items-center gap-6`}>
        <div className={`${colorClass.bg} ${colorClass.text} p-4 rounded-full`}>{icon}</div>
        <div>
            <h3 className="font-bold text-slate-500">{label}</h3>
            <p className={`text-4xl font-extrabold ${colorClass.text} mt-1`}>{value}</p>
        </div>
    </div>
);

const StudentDashboard = () => {
    const [firstTimeStats, setFirstTimeStats] = useState(null);
    const [retakeStats, setRetakeStats] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchAndProcessResults = async () => {
            try {
                const { data: allResults } = await api.get('/api/results/my-results');
                
                const firstTimeResults = allResults.filter(r => !r.isRetake);
                const retakeResults = allResults.filter(r => r.isRetake);

                setFirstTimeStats(calculateStats(firstTimeResults));
                setRetakeStats(calculateStats(retakeResults));
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchAndProcessResults();
    }, []);

    if (isLoading) return <div className="flex justify-center items-center h-64"><Spinner size="12" /></div>;

    return (
        <div className="space-y-10">
            {/* First-Time Exam Performance */}
            <div>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3"><LuBook /> First-Time Exam Performance</h2>
                {firstTimeStats.count > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <StatCard icon={<LuBook size={32}/>} label="Exams Taken" value={firstTimeStats.count} colorClass={{bg: 'bg-blue-100', text: 'text-primary'}} />
                            <StatCard icon={<LuTrendingUp size={32}/>} label="Average Score" value={`${firstTimeStats.avgScore}%`} colorClass={{bg: 'bg-green-100', text: 'text-secondary'}}/>
                            <StatCard icon={<LuStar size={32}/>} label="Highest Score" value={`${firstTimeStats.highScore}%`} colorClass={{bg: 'bg-yellow-100', text: 'text-yellow-500'}}/>
                        </div>
                        <div className="bg-surface p-6 rounded-2xl shadow-lg">
                            <h3 className="text-2xl font-bold mb-4">Score Over Time (%)</h3>
                            <ChartComponent type="line" data={firstTimeStats.chartData} dataKey="Score" nameKey="name" />
                        </div>
                    </>
                ) : (
                    <p className="text-slate-500 bg-surface p-8 rounded-2xl text-center">You have not completed any exams for the first time yet.</p>
                )}
            </div>

            {/* Retake Exam Performance */}
            <div>
                <h2 className="text-3xl font-bold mb-6 flex items-center gap-3"><LuRepeat /> Retake Exam Performance</h2>
                {retakeStats.count > 0 ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <StatCard icon={<LuRepeat size={32}/>} label="Retakes Taken" value={retakeStats.count} colorClass={{bg: 'bg-blue-100', text: 'text-primary'}} />
                            <StatCard icon={<LuTrendingUp size={32}/>} label="Average Score" value={`${retakeStats.avgScore}%`} colorClass={{bg: 'bg-green-100', text: 'text-secondary'}}/>
                            <StatCard icon={<LuStar size={32}/>} label="Highest Score" value={`${retakeStats.highScore}%`} colorClass={{bg: 'bg-yellow-100', text: 'text-yellow-500'}}/>
                        </div>
                        <div className="bg-surface p-6 rounded-2xl shadow-lg">
                            <h3 className="text-2xl font-bold mb-4">Retake Score Over Time (%)</h3>
                            <ChartComponent type="bar" data={retakeStats.chartData} dataKey="Score" nameKey="name" />
                        </div>
                    </>
                ) : (
                    <p className="text-slate-500 bg-surface p-8 rounded-2xl text-center">You have not completed any retake exams.</p>
                )}
            </div>
        </div>
    );
};
export default StudentDashboard;