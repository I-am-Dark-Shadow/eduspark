import { Link } from 'react-router-dom';
import useNotificationStore from '../../store/notificationStore';
import Spinner from '../../components/common/Spinner';
import { LuBell, LuBadgeHelp, LuMailQuestion, LuCheckCheck } from 'react-icons/lu';

const NotificationsPage = () => {
    const { retakeCount, viewCount, paymentCount, totalPending, isLoading } = useNotificationStore();

    if (isLoading) {
        return <div className="flex justify-center items-center h-64"><Spinner size="12" /></div>;
    }

    return (
        <div>
            <h2 className="text-2xl md:text-3xl font-bold mb-6 text-on-surface">Notifications</h2>

            {totalPending === 0 && (
                <div className="text-center py-10 mb-10 bg-surface rounded-2xl shadow-sm">
                     <LuCheckCheck className="mx-auto text-secondary mb-4" size={48} />
                    <p className="text-2xl font-bold text-secondary">You're all caught up!</p>
                    <p className="text-on-surface-secondary mt-2">There are no pending requests right now.</p>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <NotificationCard
                    title="Retake Requests"
                    count={retakeCount}
                    linkTo="/teacher/retakes"
                    icon={<LuBell size={24} />}
                />
                <NotificationCard
                    title="View Detail Requests"
                    count={viewCount}
                    linkTo="/teacher/view-requests"
                    icon={<LuBadgeHelp size={24} />}
                />
                <NotificationCard
                    title="Payment Requests"
                    count={paymentCount}
                    linkTo="/teacher/payment-requests"
                    icon={<LuMailQuestion size={24} />}
                />
            </div>
        </div>
    );
};

// Reusable card component for the notifications page
const NotificationCard = ({ title, count, linkTo, icon }) => {
    const hasPending = count > 0;

    return (
        // NEW DESIGN: Add a pulsing animation if there are pending requests
        <Link 
            to={linkTo} 
            className={`
                bg-surface p-6 rounded-2xl shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between
                ${hasPending ? 'ring-2 ring-primary/50 animate-pulse-slow' : ''}
            `}
            style={{ animationIterationCount: hasPending ? 3 : 0 }} // Limit pulse animation
        >
            <div className="flex items-start justify-between">
                <div className="bg-primary/10 text-primary p-3 rounded-xl inline-block">
                    {icon}
                </div>
                {hasPending && (
                    <span className="bg-primary text-white text-sm font-bold rounded-full h-7 w-7 flex items-center justify-center">
                        {count}
                    </span>
                )}
            </div>
            <div>
                <h3 className="text-lg font-bold text-on-surface mt-4">{title}</h3>
                {/* NEW DESIGN: Show an explicit message about the pending count */}
                <p className="text-sm text-on-surface-secondary mt-1">
                    {hasPending ? `You have ${count} pending requests.` : 'No pending requests.'}
                </p>
            </div>
        </Link>
    );
};

export default NotificationsPage;