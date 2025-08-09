import { useState } from 'react';
import { format, getYear, setYear, isBefore } from 'date-fns';
import { LuChevronLeft, LuChevronRight, LuCheckCheck, LuClock, LuCalendarX  } from 'react-icons/lu';

const DashboardCalendar = ({ payments }) => {
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

    // This is our fixed cutoff date: June 1, 2025.
    // Any month before this date will be considered for the "overdue" state.
    const cutoffDate = new Date(2025, 5, 1); // Month is 0-indexed, so 5 is June.

    return (
        <div className="bg-surface p-4 rounded-2xl shadow-sm">
            <div className="flex justify-between items-center mb-4 px-2">
                <button 
                    onClick={() => setCurrentYear(y => y - 1)} 
                    className="p-1 rounded-full hover:bg-border-color transition-colors"
                >
                    <LuChevronLeft size={20}/>
                </button>
                <h3 className="font-bold text-on-surface">{currentYear}</h3>
                <button 
                    onClick={() => setCurrentYear(y => y + 1)} 
                    className="p-1 rounded-full hover:bg-border-color transition-colors"
                >
                    <LuChevronRight size={20}/>
                </button>
            </div>
            
            <div className="grid grid-cols-3 gap-3">
                {Array.from({ length: 12 }).map((_, index) => {
                    const monthDate = new Date(currentYear, index);
                    const monthName = format(monthDate, 'MMM'); // Abbreviated month name like "Jan", "Feb"
                    const payment = payments.find(p => p.month === index + 1 && p.year === currentYear);
                    
                    // Check if the month is before our cutoff date
                    const isPastCutoff = isBefore(monthDate, cutoffDate);

                    let styleClasses = 'bg-background text-on-surface-secondary'; // Default for future months
                    let StatusIcon = null;

                    if (payment) {
                        if (payment.status === 'approved') {
                            styleClasses = 'bg-green-100 text-green-800';
                            StatusIcon = <LuCheckCheck />;
                        }
                        if (payment.status === 'pending') {
                            styleClasses = 'bg-yellow-100 text-yellow-800';
                            StatusIcon = <LuClock />;
                        }
                    } else if (isPastCutoff) {
                        // If there is no payment and the month is before June 2025,
                        // mark it as overdue/disabled.
                        styleClasses = 'bg-red-100 text-red-800 opacity-70 cursor-not-allowed';
                        StatusIcon = <LuCalendarX  />;
                    }

                    return (
                        <div key={index} className={`p-3 rounded-lg text-center font-bold transition-colors ${styleClasses}`}>
                            <p>{monthName}</p>
                            <div className="mt-2 flex justify-center items-center h-5">
                                {StatusIcon}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default DashboardCalendar;