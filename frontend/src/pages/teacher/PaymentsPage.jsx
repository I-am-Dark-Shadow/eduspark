import { useState, useEffect } from 'react';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import { LuChevronLeft, LuChevronRight, LuCheckCheck, LuClock, LuCalendarX } from 'react-icons/lu';
import { format, getYear, setMonth, setYear, isBefore, getMonth } from 'date-fns';

const PaymentsPage = () => {
    const [paymentData, setPaymentData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedStudent, setSelectedStudent] = useState(null);

    useEffect(() => {
        api.get('/api/payments/students')
            .then(res => {
                setPaymentData(res.data);
                if (res.data.length > 0) {
                    setSelectedStudent(res.data[0]);
                }
            })
            .catch(err => console.error(err))
            .finally(() => setIsLoading(false));
    }, []);

    const changeYear = (amount) => {
        setCurrentDate(prev => setYear(prev, getYear(prev) + amount));
    };

    if (isLoading) return <div className="flex justify-center items-center h-64"><Spinner size="12" /></div>;

    const today = new Date();
    const pastMonthBoundary = new Date(getYear(today), getMonth(today) - 1);

    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1 bg-surface p-4 rounded-2xl shadow-lg">
                <h3 className="font-bold text-lg mb-2 px-2">Select Student</h3>
                <ul className="space-y-1 max-h-[70vh] overflow-y-auto">
                    {paymentData.map(data => (
                        <li key={data.studentId}>
                            <button 
                                onClick={() => setSelectedStudent(data)}
                                className={`w-full text-left p-2 rounded-md font-semibold transition-colors ${selectedStudent?.studentId === data.studentId ? 'bg-primary text-white' : 'hover:bg-slate-100'}`}
                            >
                                {data.studentName}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="lg:col-span-3 bg-surface p-4 md:p-6 rounded-2xl shadow-lg">
                {selectedStudent ? (
                    <>
                        <div className="flex justify-between items-center mb-6 px-2">
                            <button onClick={() => changeYear(-1)} className="p-2 rounded-full hover:bg-slate-200 transition-colors"><LuChevronLeft size={24}/></button>
                            <h2 className="text-2xl md:text-3xl font-bold text-on-surface">{getYear(currentDate)}</h2>
                            <button onClick={() => changeYear(1)} className="p-2 rounded-full hover:bg-slate-200 transition-colors"><LuChevronRight size={24}/></button>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-4">
                            {Array.from({ length: 12 }).map((_, index) => {
                                const monthDate = new Date(getYear(currentDate), index);
                                const monthName = format(monthDate, 'MMMM');
                                const payment = selectedStudent.payments.find(p => p.month === index + 1 && p.year === getYear(currentDate));
                                const isPastAndUnpaid = isBefore(monthDate, pastMonthBoundary) && !payment;

                                let styleClasses = 'bg-slate-100 text-slate-700'; // Default
                                let StatusIcon = null;

                                if (payment) {
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
                                        StatusIcon = <LuCalendarX className="absolute top-2 right-2" />;
                                    }
                                } else if (isPastAndUnpaid) {
                                    styleClasses = 'bg-red-100 text-red-800 opacity-70';
                                    StatusIcon = <LuCalendarX className="absolute top-2 right-2" />;
                                }
                                
                                return (
                                    // New Design: Smaller, colored background, and an icon
                                    <div key={index} className={`relative aspect-square flex flex-col items-center justify-center p-2 rounded-2xl shadow-sm cursor-default ${styleClasses}`}>
                                        {StatusIcon}
                                        <p className="text-base md:text-lg font-bold">{monthName}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                ) : (
                    <p className="text-center py-10">Select a student to view their payment status.</p>
                )}
            </div>
        </div>
    );
};

export default PaymentsPage;