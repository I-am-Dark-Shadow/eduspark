import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import ChartComponent from '../../components/common/ChartComponent';
import Spinner from '../../components/common/Spinner';
import { format } from 'date-fns';
import { LuBook, LuRepeat } from 'react-icons/lu';

const StudentDetailPage = () => {
    const { id } = useParams();
    const [student, setStudent] = useState(null);
    const [firstTimeResults, setFirstTimeResults] = useState([]);
    const [retakeResults, setRetakeResults] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [studentRes, resultsRes] = await Promise.all([
                    api.get(`/api/users/students/${id}`),
                    api.get(`/api/results/student/${id}`)
                ]);
                setStudent(studentRes.data);
                setFirstTimeResults(resultsRes.data.filter(r => !r.isRetake));
                setRetakeResults(resultsRes.data.filter(r => r.isRetake));

            } catch (error) {
                console.error("Failed to fetch student data", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (isLoading) return <div className="flex justify-center items-center h-64"><Spinner size="12" /></div>;
    if (!student) return <div>Student not found.</div>;

    const firstTimeChartData = firstTimeResults.map(r => ({
        name: r.exam.title.substring(0, 15) + '...',
        Score: ((r.score / r.totalMarks) * 100).toFixed(2)
    }));
    
    const retakeChartData = retakeResults.map(r => ({
        name: r.exam.title.substring(0, 15) + '...',
        Score: ((r.score / r.totalMarks) * 100).toFixed(2)
    }));

    const pieChartData = [
        { name: 'First-Time Exams', value: firstTimeResults.length },
        { name: 'Retake Exams', value: retakeResults.length },
    ].filter(item => item.value > 0);

    return (
        <div className="space-y-8">
            {/* Responsive Change: Stacks on mobile, centered text */}
            <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                <img src={student.profilePicture} alt={student.name} className="w-24 h-24 rounded-full object-cover border-4 border-primary"/>
                <div>
                    <h2 className="text-3xl sm:text-4xl font-bold">{student.name}</h2>
                    <p className="text-slate-500">{student.email}</p>
                </div>
            </div>
            
            {pieChartData.length > 0 && (
                 <div className="bg-surface p-4 md:p-6 rounded-2xl shadow-lg">
                    <h3 className="text-xl md:text-2xl font-bold mb-4 text-center">Exam Attempt Distribution</h3>
                    <ChartComponent type="pie" data={pieChartData} dataKey="value" nameKey="name" />
                </div>
            )}
            
            <ResultsSection 
                title="First-Time Exam Performance"
                icon={<LuBook />}
                results={firstTimeResults}
                chartData={firstTimeChartData}
            />

            <ResultsSection 
                title="Retake Exam Performance"
                icon={<LuRepeat />}
                results={retakeResults}
                chartData={retakeChartData}
            />
        </div>
    );
};

const ResultsSection = ({ title, icon, results, chartData }) => {
    if (results.length === 0) return null;

    return (
        <div className="bg-surface p-4 md:p-6 rounded-2xl shadow-lg">
            <h3 className="text-xl md:text-2xl font-bold mb-4 flex items-center gap-2">{icon} {title}</h3>
            <div className="mb-8">
                <ChartComponent type="line" data={chartData} dataKey="Score" nameKey="name" />
            </div>
            {/* Responsive Change: Card-based list for mobile */}
            <div className="space-y-3 md:hidden">
                {results.map(result => (
                    <div key={result._id} className="p-3 bg-slate-50 rounded-lg">
                        <p className="font-bold">{result.exam.title}</p>
                        <div className="flex justify-between items-center text-sm mt-1">
                            <p className="text-slate-500">{format(new Date(result.createdAt), 'PP')}</p>
                            <p className="font-bold text-primary">{((result.score / result.totalMarks) * 100).toFixed(2)}% ({result.score}/{result.totalMarks})</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="hidden md:block overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50">
                        <tr className="border-b border-slate-200">
                            <th className="p-3 font-semibold">Exam Title</th>
                            <th className="p-3 font-semibold">Date Taken</th>
                            <th className="p-3 font-semibold">Score</th>
                            <th className="p-3 font-semibold">Percentage</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(result => (
                            <tr key={result._id} className="border-b border-slate-100">
                                <td className="p-3">{result.exam.title}</td>
                                <td className="p-3">{format(new Date(result.createdAt), 'PP')}</td>
                                <td className="p-3">{result.score} / {result.totalMarks}</td>
                                <td className="p-3 font-bold text-primary">
                                    {((result.score / result.totalMarks) * 100).toFixed(2)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default StudentDetailPage;