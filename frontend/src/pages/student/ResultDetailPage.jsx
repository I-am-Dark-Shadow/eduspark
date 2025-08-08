import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import { LuCheck, LuX, LuTriangleAlert  } from 'react-icons/lu';

const ResultDetailPage = () => {
    const { id } = useParams();
    const [result, setResult] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchResult = async () => {
            try {
                const { data } = await api.get(`/api/results/${id}`);
                setResult(data);
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchResult();
    }, [id]);

    if (isLoading) return <div className="flex justify-center items-center h-64"><Spinner size="12" /></div>;
    if (!result) return <div>Result not found.</div>;

    if (result.permissionDenied) {
        return (
            <div className="text-center p-4 py-16 bg-surface rounded-2xl shadow-lg">
                <LuTriangleAlert  className="mx-auto text-amber-500 mb-4" size={48} />
                <h2 className="text-xl md:text-2xl font-bold text-on-surface">Access Denied</h2>
                <p className="text-slate-500 mt-2">You do not have permission to view the detailed results for this exam.</p>
                <Link to="/student/results" className="mt-6 inline-block bg-primary text-white font-bold py-2 px-6 rounded-lg">
                    Back to My Results
                </Link>
            </div>
        )
    }

    const percentage = ((result.score / result.totalMarks) * 100).toFixed(2);
    
    return (
        <div>
            {/* Responsive Change: Text sizes */}
            <h2 className="text-2xl md:text-3xl font-bold mb-6">{result.exam.title} - Detailed Report</h2>
            
            {/* Responsive Change: Padding and text sizes */}
            <div className="bg-surface p-6 md:p-8 rounded-2xl shadow-lg mb-8 text-center">
                <p className="text-base md:text-lg text-slate-600">You Scored</p>
                <p className={`text-6xl md:text-7xl font-extrabold my-2 ${percentage >= 50 ? 'text-secondary' : 'text-danger'}`}>{percentage}%</p>
                <p className="text-xl md:text-2xl font-bold text-on-surface">{result.score} out of {result.totalMarks} correct</p>
            </div>

            <div>
                <h3 className="text-xl md:text-2xl font-bold mb-4">Question Breakdown</h3>
                <div className="space-y-6">
                    {result.exam.questions.map((question, index) => {
                        const userAnswer = result.answers.find(a => a.questionId === question.id);
                        const isCorrect = userAnswer?.isCorrect;
                        
                        return (
                            <div key={question.id} className={`p-4 md:p-6 rounded-xl border-l-8 ${isCorrect ? 'bg-green-50 border-secondary' : 'bg-red-50 border-danger'}`}>
                                <p className="font-bold text-base md:text-lg mb-4">{index + 1}. {question.question}</p>
                                <div className="space-y-2">
                                    {question.options.map((option, optIndex) => {
                                        const isUserChoice = userAnswer?.selectedOption === optIndex;
                                        const isCorrectChoice = question.correct === optIndex;
                                        
                                        return (
                                            <div key={optIndex} className={`flex items-center gap-3 p-3 rounded-lg text-sm md:text-base
                                                ${isCorrectChoice ? 'bg-green-200 font-semibold' : ''}
                                                ${isUserChoice && !isCorrectChoice ? 'bg-red-200' : ''}
                                            `}>
                                                {isCorrectChoice && <LuCheck className="text-green-700 min-w-[20px]"/>}
                                                {isUserChoice && !isCorrectChoice && <LuX className="text-red-700 min-w-[20px]"/>}
                                                {!isCorrectChoice && !isUserChoice && <div className="w-5 min-w-[20px]"></div>}
                                                <span>{option}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};
export default ResultDetailPage;