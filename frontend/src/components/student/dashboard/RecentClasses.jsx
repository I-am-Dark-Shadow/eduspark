import { Link } from 'react-router-dom';
import { format } from 'date-fns';

const RecentClasses = ({ results }) => {
    // Show the 2 most recently completed exams
    const recentResults = results.slice(0, 2);

    return (
        <div className="bg-surface p-6 rounded-2xl shadow-sm">
            <h3 className="font-bold text-on-surface text-xl mb-4">Recent Exams</h3>
            <div className="space-y-4">
                {recentResults.length > 0 ? recentResults.map(result => (
                    <div key={result._id} className="border border-border-color p-4 rounded-xl">
                        <p className={`font-bold text-lg ${result.score > result.totalMarks / 2 ? 'text-secondary' : 'text-danger'}`}>{result.exam.title}</p>
                        <div className="flex items-center justify-between mt-2 text-sm text-on-surface-secondary">
                           <span>Completed on {format(new Date(result.createdAt), 'PP')}</span>
                           <span>Marks: {result.score}/{result.totalMarks}</span>
                        </div>
                    </div>
                )) : (
                    <p className="text-center text-on-surface-secondary py-8">No exams completed yet.</p>
                )}
            </div>
        </div>
    );
};

export default RecentClasses;