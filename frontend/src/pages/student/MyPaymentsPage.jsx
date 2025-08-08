import { useState, useEffect } from 'react';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import { format, getYear, setMonth, setYear, isBefore, getMonth } from 'date-fns';
import { LuChevronLeft, LuChevronRight, LuUpload, LuCheckCheck, LuClock, LuCalendarX  } from 'react-icons/lu';
import toast from 'react-hot-toast';

const QR_CODE_URL = '/qr_code.jpg';

const MyPaymentsPage = () => {
    const [payments, setPayments] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedMonth, setSelectedMonth] = useState(null);

    useEffect(() => {
        fetchHistory();
    }, []);

    const fetchHistory = () => {
        api.get('/api/payments/my-history')
           .then(res => setPayments(res.data))
           .catch(() => toast.error("Could not fetch payment history."))
           .finally(() => setIsLoading(false));
    };

    const openPaymentModal = (monthIndex) => {
        setSelectedMonth(monthIndex);
        setIsModalOpen(true);
    };
    
    const onPaymentRequested = (newPayment) => {
        setPayments(prev => [...prev, newPayment]);
    };

    if (isLoading) return <div className="flex justify-center items-center h-64"><Spinner size="12" /></div>;

    const today = new Date();
    const pastMonthBoundary = new Date(getYear(today), getMonth(today) - 1);

    return (
        <div>
            <div className="bg-surface p-4 md:p-6 rounded-2xl shadow-lg">
                <div className="flex justify-between items-center mb-6 px-2">
                    <button onClick={() => setCurrentDate(prev => setYear(prev, getYear(prev) - 1))} className="p-2 rounded-full hover:bg-slate-200 transition-colors"><LuChevronLeft size={24} /></button>
                    <h2 className="text-2xl md:text-3xl font-bold text-on-surface">{getYear(currentDate)}</h2>
                    <button onClick={() => setCurrentDate(prev => setYear(prev, getYear(prev) + 1))} className="p-2 rounded-full hover:bg-slate-200 transition-colors"><LuChevronRight size={24} /></button>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                    {Array.from({ length: 12 }).map((_, index) => {
                        const monthDate = new Date(getYear(currentDate), index);
                        const monthName = format(monthDate, 'MMMM');
                        const payment = payments.find(p => p.month === index + 1 && p.year === getYear(currentDate));
                        const isPastAndUnpaid = isBefore(monthDate, pastMonthBoundary) && !payment;

                        let styleClasses = 'bg-slate-100 text-slate-700 hover:bg-slate-200'; // Default
                        let isDisabled = false;
                        let StatusIcon = null;

                        if (payment) {
                            isDisabled = true;
                            if (payment.status === 'approved') {
                                styleClasses = 'bg-green-100 text-green-800';
                                StatusIcon = <LuCheckCheck className="absolute top-2 right-2" />;
                            }
                            if (payment.status === 'pending') {
                                styleClasses = 'bg-yellow-100 text-yellow-800';
                                StatusIcon = <LuClock className="absolute top-2 right-2" />;
                            }
                            if (payment.status === 'denied') {
                                styleClasses = 'bg-red-200 text-red-800';
                                StatusIcon = <LuCalendarX  className="absolute top-2 right-2" />;
                            }
                        } else if (isPastAndUnpaid) {
                            isDisabled = true;
                            styleClasses = 'bg-red-100 text-red-800 opacity-70';
                            StatusIcon = <LuCalendarX  className="absolute top-2 right-2" />;
                        }

                        return (
                            <button 
                                key={index} 
                                disabled={isDisabled}
                                onClick={() => openPaymentModal(index + 1)}
                                // New Design: Smaller, colored background, and an icon
                                className={`relative aspect-square flex flex-col items-center justify-center p-2 rounded-2xl shadow-sm transition-all disabled:cursor-not-allowed ${styleClasses}`}
                            >
                                {StatusIcon}
                                <p className="text-base md:text-lg font-bold">{monthName}</p>
                            </button>
                        );
                    })}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={`Payment for ${format(new Date(getYear(currentDate), selectedMonth - 1), 'MMMM yyyy')}`}>
                <PaymentForm 
                    month={selectedMonth} 
                    year={getYear(currentDate)} 
                    onClose={() => setIsModalOpen(false)}
                    onPaymentRequested={onPaymentRequested}
                />
            </Modal>
        </div>
    );
};

// ... (The PaymentForm sub-component code remains unchanged)
const PaymentForm = ({ month, year, onClose, onPaymentRequested }) => {
    const [paymentMethod, setPaymentMethod] = useState('hand-cash');
    const [bill, setBill] = useState(null);
    const [isUploading, setIsUploading] = useState(false);

    const handleFileChange = (e) => {
        setBill(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsUploading(true);
        let billScreenshot = null;

        if (paymentMethod === 'online') {
            if (!bill) {
                toast.error("Please upload a bill screenshot for online payment.");
                setIsUploading(false);
                return;
            }
            const formData = new FormData();
            formData.append('image', bill);
            try {
                const { data } = await api.post('/api/upload', formData);
                billScreenshot = data.imageUrl;
            } catch (error) {
                toast.error("Image upload failed.");
                setIsUploading(false);
                return;
            }
        }

        try {
            const { data } = await api.post('/api/payments/request', { month, year, paymentMethod, billScreenshot });
            toast.success("Payment request sent!");
            onPaymentRequested(data);
            onClose();
        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to send request.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center">
                <p>Please scan the QR code for online payment.</p>
                <img src={QR_CODE_URL} alt="Payment QR Code" className="w-48 h-48 mx-auto my-4 border rounded-lg"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-600 mb-1">Payment Method</label>
                <select value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                    <option value="hand-cash">Hand Cash</option>
                    <option value="online">Online</option>
                </select>
            </div>
            {paymentMethod === 'online' && (
                <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Upload Bill Screenshot</label>
                    <label htmlFor="bill-upload" className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 font-semibold rounded-lg shadow-sm hover:bg-slate-200 transition-colors cursor-pointer">
                        <LuUpload /> Select File
                    </label>
                    <input id="bill-upload" type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
                    {bill && <p className="text-sm text-slate-500 mt-1 text-center">{bill.name}</p>}
                </div>
            )}
            <div className="flex justify-end pt-4 gap-3">
                <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300">Cancel</button>
                <button type="submit" disabled={isUploading} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300">
                    {isUploading ? 'Submitting...' : 'Send Request'}
                </button>
            </div>
        </form>
    );
};

export default MyPaymentsPage;