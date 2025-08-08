import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { LuEye, LuBadgeHelp , LuCheck, LuX } from 'react-icons/lu';

const MyResultsPage = () => {
    const [results, setResults] = useState([]);
    const [viewStatuses, setViewStatuses] = useState(new Map());
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);
    
    const fetchData = async () => {
        try {
            const [resultsRes, statusesRes] = await Promise.all([
                api.get('/api/results/my-results'),
                api.get('/api/view-requests/my-statuses')
            ]);
            setResults(resultsRes.data);
            const statusMap = new Map();
            statusesRes.data.forEach(s => statusMap.set(s.result, s.status));
            setViewStatuses(statusMap);
        } catch (error) {
            toast.error("Failed to fetch results.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleRequestView = async (resultId) => {
        try {
            await api.post('/api/view-requests/request', { resultId });
            toast.success("Request sent to your teacher!");
            setViewStatuses(prev => new Map(prev).set(resultId, 'pending'));
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send request.");
        }
    };

    const renderActionButton = (result) => {
        const status = viewStatuses.get(result._id);

        if (status === 'approved') {
            return <Link to={`/student/result/${result._id}`} className="inline-flex items-center gap-1 text-primary hover:underline font-semibold"><LuEye /> View Details</Link>;
        }
        if (status === 'pending') {
            return <span className="inline-flex items-center gap-1 text-amber-600 font-semibold"><LuBadgeHelp /> Pending Approval</span>;
        }
        if (status === 'denied') {
            return <span className="inline-flex items-center gap-1 text-danger font-semibold"><LuX/> Denied</span>;
        }
        return <button onClick={() => handleRequestView(result._id)} className="inline-flex items-center gap-1 text-blue-600 hover:underline font-semibold"><LuBadgeHelp /> Request to View</button>;
    };

    if (isLoading) return <div className="flex justify-center items-center h-64"><Spinner size="12" /></div>;

    return (
        <div>
            {/* Responsive Change: Text size */}
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Your Exam Results</h2>
            
            {/* Responsive Change: Mobile Card View */}
            <div className="space-y-4 md:hidden">
                {results.map(result => (
                    <div key={result._id} className="bg-surface p-4 rounded-lg shadow-md space-y-3">
                        <div>
                           <p className="font-bold text-on-surface">{result.exam.title}</p>
                           <p className="text-sm text-slate-500">{format(new Date(result.createdAt), 'PP')}</p>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t">
                            <p className="font-bold text-primary text-lg">{result.score}/{result.totalMarks}</p>
                            <div>{renderActionButton(result)}</div>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* Responsive Change: Desktop Table View */}
            <div className="hidden md:block bg-surface rounded-xl shadow-lg overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="p-4 font-bold">Exam Title</th>
                            <th className="p-4 font-bold">Date</th>
                            <th className="p-4 font-bold">Score</th>
                            <th className="p-4 font-bold text-center">Details</th>
                        </tr>
                    </thead>
                    <tbody>
                        {results.map(result => (
                            <tr key={result._id} className="border-b border-slate-100 hover:bg-slate-50">
                                <td className="p-4 font-medium">{result.exam.title}</td>
                                <td className="p-4 text-slate-600">{format(new Date(result.createdAt), 'PPpp')}</td>
                                <td className="p-4 font-bold text-primary">{result.score}/{result.totalMarks}</td>
                                <td className="p-4 text-center">{renderActionButton(result)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default MyResultsPage;