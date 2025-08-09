import { Link } from 'react-router-dom';

const RecentEnrolledExam = ({ results }) => {
    if (results.length === 0) return null;

    // Find the most recently submitted exam
    const latestResult = results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0];
    const percentage = (latestResult.score / latestResult.totalMarks) * 100;

    return (
        <div className="bg-surface p-6 rounded-2xl shadow-sm h-full">
            <h3 className="font-bold text-on-surface text-xl mb-4">Recent Enrolled Exam</h3>
            <div className="border border-border-color p-4 rounded-xl flex flex-col h-[calc(100%-40px)]">
                <div className="flex items-center gap-4">
                    <div className="bg-primary/10 text-primary p-3 rounded-lg">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                    <div>
                        <p className="font-bold text-on-surface">{latestResult.exam.title}</p>
                        <p className="text-sm text-on-surface-secondary">Latest Score</p>
                    </div>
                </div>
                <div className="mt-auto pt-4">
                    <div className="flex justify-between text-sm font-medium text-on-surface-secondary mb-1">
                        <span>Score</span>
                        <span>{latestResult.score} / {latestResult.totalMarks}</span>
                    </div>
                    <div className="w-full bg-border-color rounded-full h-2">
                        <div className="bg-primary h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RecentEnrolledExam;