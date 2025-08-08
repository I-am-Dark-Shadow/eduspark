import { useState, useEffect } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';
import { LuCheckCheck, LuX, LuDownload } from "react-icons/lu";
import { format } from 'date-fns';

const PaymentRequestsPage = () => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [view, setView] = useState('pending'); // 'pending' or 'history'

    useEffect(() => {
        fetchRequests();
    }, [view]);

    const fetchRequests = async () => {
        setIsLoading(true);
        try {
            const params = { history: view === 'history' };
            const { data } = await api.get('/api/payments/requests', { params });
            setRequests(data);
        } catch (error) {
            toast.error("Failed to fetch payment requests.");
        } finally {
            setIsLoading(false);
        }
    };

    const handleUpdateRequest = async (requestId, status) => {
        try {
            await api.put(`/api/payments/request/${requestId}`, { status });
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
                <TabButton tabName="pending" label="Pending" />
                <TabButton tabName="history" label="History" />
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64"><Spinner size="12" /></div>
            ) : requests.length === 0 ? (
                <div className="text-center py-16 bg-surface rounded-2xl shadow-lg">
                    <p className="text-xl font-bold text-slate-700">No {view} payment requests found.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {requests.map(req => (
                        <div key={req._id} className="bg-surface p-4 rounded-lg shadow-md">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                                <div className="flex-grow">
                                    <p className="font-bold text-on-surface">{req.student.name}</p>
                                    <p className="text-sm text-slate-600">For: <span className="font-medium">{format(new Date(req.year, req.month - 1), 'MMMM yyyy')}</span></p>
                                    <p className="text-sm text-slate-500">Method: <span className="font-semibold capitalize">{req.paymentMethod.replace('-', ' ')}</span></p>
                                </div>
                                {req.billScreenshot && (
                                    <a href={req.billScreenshot} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-blue-600 hover:underline text-sm font-semibold py-1 px-2 rounded-md bg-blue-100 hover:bg-blue-200 self-start sm:self-center">
                                        <LuDownload size={14} /> View Bill
                                    </a>
                                )}
                            </div>
                            <div className="pt-3 border-t mt-3">
                                {view === 'pending' ? (
                                    <div className="flex justify-end items-center gap-3">
                                        <button onClick={() => handleUpdateRequest(req._id, 'denied')} className="flex items-center gap-1 px-3 py-1 bg-red-100 text-red-700 font-semibold rounded-lg text-sm hover:bg-red-200">
                                            <LuX /> Deny
                                        </button>
                                        <button onClick={() => handleUpdateRequest(req._id, 'approved')} className="flex items-center gap-1 px-3 py-1 bg-green-100 text-green-700 font-semibold rounded-lg text-sm hover:bg-green-200">
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
        </div>
    );
};

export default PaymentRequestsPage;