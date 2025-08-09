import { Link } from 'react-router-dom';

const UpcomingLesson = ({ upcomingExams }) => {
    // Show the next 2 upcoming exams
    const nextExams = upcomingExams.slice(0, 2);

    return (
        <div className="bg-surface p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-on-surface text-xl mb-4">Upcoming Exams</h3>
            <div className="space-y-4">
                 {nextExams.length > 0 ? nextExams.map(exam => (
                     <div key={exam._id} className="flex items-center justify-between p-4 bg-background rounded-xl">
                        <div>
                            <p className="font-bold text-on-surface">{exam.title}</p>
                            <p className="text-sm text-on-surface-secondary">{exam.duration} mins</p>
                        </div>
                        <Link to={`/exam/${exam._id}`} className="bg-primary text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-orange-700 transition-colors">
                            Start
                        </Link>
                     </div>
                 )) : (
                    <p className="text-on-surface-secondary text-center py-8">You're all caught up!</p>
                 )}
            </div>
        </div>
    );
};

export default UpcomingLesson;