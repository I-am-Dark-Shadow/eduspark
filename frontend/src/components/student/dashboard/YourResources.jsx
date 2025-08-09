import { Link } from 'react-router-dom';
import { LuCheckCheck, LuFileX2 } from 'react-icons/lu'; // CORRECTED: Replaced LuFileX2 with LuFileX2

const YourResources = ({ results }) => {
    return (
        <div className="bg-surface p-6 rounded-2xl shadow-sm h-full flex flex-col">
            <h3 className="font-bold text-on-surface text-xl mb-4">Your All Exams</h3>
            {/* CORRECTED: Changed max-h-48 to h-56 for a fixed height that matches the design */}
            <div className="space-y-3 h-30 overflow-y-auto pr-2 custom-scrollbar">
                {results.length > 0 ? results.map(result => {
                    const isPass = result.score > result.totalMarks / 2;
                    const percentage = ((result.score / result.totalMarks) * 100).toFixed(0);

                    return (
                        <div key={result._id} className="flex items-center justify-between p-3 bg-background rounded-lg">
                            <div className="flex items-center gap-3">
                                <div className={`w-2 h-8 rounded-full ${isPass ? 'bg-secondary' : 'bg-danger'}`}></div>
                                <div>
                                    <p className="font-semibold text-on-surface text-sm">{result.exam.title}</p>
                                    <p className="text-xs text-on-surface-secondary">Score: {result.score}/{result.totalMarks}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <span className={`font-semibold text-xs px-2 py-1 rounded-md ${isPass ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                    {percentage}%
                                </span>
                                <span className={`flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-md ${isPass ? 'bg-green-100 text-secondary' : 'bg-red-100 text-danger'}`}>
                                    {isPass ? <LuCheckCheck size={14} /> : <LuFileX2 size={14} />}
                                    {isPass ? 'Pass' : 'Fail'}
                                </span>
                            </div>
                        </div>
                    )
                }) : (
                    <p className="text-center text-on-surface-secondary pt-16">No exam results to show.</p>
                )}
            </div>
             <div className="text-center mt-auto pt-4">
                 <Link to="/student/results" className="text-primary font-semibold hover:underline text-sm">
                    See more
                 </Link>
            </div>
        </div>
    );
};

export default YourResources;