import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';
import { LuCheckCheck, LuX } from "react-icons/lu";
import { format } from 'date-fns';

const ViewRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState('pending'); // 'pending' or 'history'

    useEffect(() => {
        fetchRequests();
    }, [view]);

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const params = view === 'history' ? { history: true } : {};
            const { data } = await api.get('/api/view-requests', { params });
            setRequests(data);
        } catch (error) {
            toast.error("Failed to fetch view requests.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateRequest = async (requestId, status) => {
        try {
            await api.put(`/api/view-requests/${requestId}`, { status });
            setRequests(prev => prev.filter(req => req._id !== requestId));
            toast.success(`Request has been ${status}.`);
        } catch (error) {
            toast.error("Failed to update request status.");
        }
    };
    
    const TabButton = ({ tabName, label }) => (
        <button 
            onClick={() => setView(tabName)}
            className={`px-4 md:px-6 py-2 font-semibold rounded-t-lg border-b-4 transition-colors ${view === tabName ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-primary'}`}
        >
            {label}
        </button>
    );

    return (
        <div>
            <div className="flex border-b border-slate-200 mb-6">
                <TabButton tabName="pending" label="Pending Requests" />
                <TabButton tabName="history" label="History" />
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64"><Spinner size="12" /></div>
            ) : requests.length === 0 ? (
                <div className="text-center py-16 bg-surface rounded-2xl shadow-lg">
                    <p className="text-xl font-bold text-slate-700">No {view} requests found.</p>
                </div>
            ) : (
                 // Responsive Change: Card list for mobile
                <div className="space-y-4 md:hidden">
                    {requests.map(req => (
                        <div key={req._id} className="bg-surface p-4 rounded-lg shadow-md space-y-3">
                            <div>
                                <p className="font-bold text-on-surface">{req.student.name}</p>
                                <p className="text-sm text-slate-600">{req.result.exam.title}</p>
                            </div>
                            <p className="text-sm font-semibold text-primary">Score: {req.result.score}/{req.result.totalMarks}</p>
                            <div className="pt-2 border-t">
                                {view === 'pending' ? (
                                    <div className="flex justify-end items-center gap-3">
                                        <button onClick={() => handleUpdateRequest(req._id, 'denied')} className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 font-semibold rounded-lg text-sm">
                                            <LuX /> Deny
                                        </button>
                                        <button onClick={() => handleUpdateRequest(req._id, 'approved')} className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 font-semibold rounded-lg text-sm">
                                            <LuCheckCheck /> Approve
                                        </button>
                                    </div>
                                ) : (
                                    <div className="flex justify-end">
                                        <span className={`font-bold capitalize px-3 py-1 rounded-full text-sm ${req.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                            {req.status}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            
            {!isLoading && requests.length > 0 && (
                // Responsive Change: Table for desktop
                <div className="hidden md:block bg-surface rounded-xl shadow-lg overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 border-b border-slate-200">
                            <tr>
                                <th className="p-4 font-bold">Student</th>
                                <th className="p-4 font-bold">Exam</th>
                                <th className="p-4 font-bold">Score</th>
                                <th className="p-4 font-bold text-center">Status/Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map(req => (
                                <tr key={req._id} className="border-b border-slate-100 hover:bg-slate-50">
                                    <td className="p-4 font-medium">{req.student.name}</td>
                                    <td className="p-4 text-slate-600">{req.result.exam.title}</td>
                                    <td className="p-4 text-slate-600">{req.result.score}/{req.result.totalMarks}</td>
                                    <td className="p-4 text-center">
                                        {view === 'pending' ? (
                                            <div className="flex justify-center items-center gap-3">
                                                <button onClick={() => handleUpdateRequest(req._id, 'approved')} className="flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 font-semibold rounded-lg hover:bg-green-200">
                                                    <LuCheckCheck /> Approve
                                                </button>
                                                <button onClick={() => handleUpdateRequest(req._id, 'denied')} className="flex items-center gap-2 px-3 py-1 bg-red-100 text-red-700 font-semibold rounded-lg hover:bg-red-200">
                                                    <LuX /> Deny
                                                </button>
                                            </div>
                                        ) : (
                                            <span className={`font-bold capitalize px-3 py-1 rounded-full text-sm ${req.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {req.status}
                                            </span>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default ViewRequestsPage;