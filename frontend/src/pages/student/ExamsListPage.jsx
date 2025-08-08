import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import Spinner from '../../components/common/Spinner';
import Modal from '../../components/common/Modal';
import RequestRetakeModal from '../student/RequestRetakeModal';
import { LuBookOpen, LuRefreshCw, LuCheckCheck, LuX } from 'react-icons/lu';
import toast from 'react-hot-toast';

const ExamsListPage = () => {
    const [exams, setExams] = useState([]);
    const [resultsMap, setResultsMap] = useState(new Map());
    const [retakeStatusMap, setRetakeStatusMap] = useState(new Map());
    const [isLoading, setIsLoading] = useState(true);
    const [isRetakeModalOpen, setIsRetakeModalOpen] = useState(false);
    const [selectedExamForRetake, setSelectedExamForRetake] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const [examsRes, resultsRes, retakesRes] = await Promise.all([
                api.get('/api/exams'),
                api.get('/api/results/my-results'),
                api.get('/api/retakes/my-requests') // Fetching retake statuses
            ]);
            setExams(examsRes.data);
            
            const resultsDataMap = new Map();
            resultsRes.data.forEach(r => resultsDataMap.set(r.exam._id, r));
            setResultsMap(resultsDataMap);

            const retakeDataMap = new Map();
            retakesRes.data.forEach(r => retakeDataMap.set(r.exam, r.status));
            setRetakeStatusMap(retakeDataMap);
            
        } catch (error) {
            toast.error("Failed to fetch exam data.");
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleOpenRetakeModal = (examId) => {
        setSelectedExamForRetake(examId);
        setIsRetakeModalOpen(true);
    };

    const handleCloseRetakeModal = () => {
        setSelectedExamForRetake(null);
        setIsRetakeModalOpen(false);
    };
    
    const handleRetakeRequested = (examId) => {
      // Update the status locally to 'pending' immediately for better UX
      setRetakeStatusMap(prev => new Map(prev).set(examId, 'pending'));
    };

    if (isLoading) return <div className="flex justify-center items-center h-64"><Spinner size="12" /></div>;
    
    // This is the new function that decides which button/message to show
    const renderActionArea = (exam) => {
        const result = resultsMap.get(exam._id);
        const isCompleted = result && result.submitted;
        const retakeStatus = retakeStatusMap.get(exam._id);

        if (!isCompleted) {
            const hasStartedButNotFinished = result && !result.submitted;
            return (
                <Link 
                    to={`/exam/${exam._id}`} 
                    className={`w-full text-center block font-bold py-3 px-4 rounded-lg transition-colors ${
                        hasStartedButNotFinished 
                        ? 'bg-orange-500 text-white hover:bg-orange-600'
                        : 'bg-primary text-white hover:bg-indigo-700'
                    }`}
                >
                    {hasStartedButNotFinished ? 'Continue Exam' : 'Start Exam'}
                </Link>
            );
        }

        // --- Logic for Completed Exams ---
        if (retakeStatus === 'approved') {
            return (
                <div className="text-center w-full">
                    <p className="text-sm font-semibold text-green-600 flex items-center justify-center gap-1 mb-2"><LuCheckCheck/> Retake Approved!</p>
                    <Link 
                        to={`/exam/${exam._id}`} 
                        state={{ isRetake: true }} // Pass retake flag to ExamPage
                        className="w-full text-center block font-bold py-3 px-4 rounded-lg bg-secondary text-white hover:bg-emerald-700"
                    >
                       Start Retake
                    </Link>
                </div>
            );
        }

        if (retakeStatus === 'denied') {
            return <div className="w-full text-center font-bold text-danger flex items-center justify-center gap-2"><LuX/> Retake Denied</div>;
        }

        return (
            <>
                <span className="font-bold text-secondary">Completed</span>
                <button 
                    onClick={() => handleOpenRetakeModal(exam._id)}
                    disabled={retakeStatus === 'pending'}
                    className="flex items-center gap-2 px-3 py-2 bg-amber-100 text-amber-700 font-semibold rounded-lg hover:bg-amber-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <LuRefreshCw size={16}/> {retakeStatus === 'pending' ? 'Requested' : 'Retake'}
                </button>
            </>
        );
    }


    return (
        <div>
            <h2 className="text-3xl font-bold mb-6">Available Exams</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {exams.map(exam => (
                    <div key={exam._id} className="bg-surface p-6 rounded-2xl shadow-lg transition-all flex flex-col">
                        <div className="flex items-center gap-4 mb-3">
                            <div className="bg-indigo-100 text-primary p-3 rounded-full"><LuBookOpen size={24}/></div>
                            <h3 className="text-xl font-bold text-on-surface">{exam.title}</h3>
                        </div>
                        <p className="text-slate-500 mb-1">Duration: {exam.duration} minutes</p>
                        <p className="text-slate-500 mb-4">Questions: {exam.questions.length}</p>
                        
                        <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between gap-2">
                            {renderActionArea(exam)}
                        </div>
                    </div>
                ))}
            </div>

            {selectedExamForRetake && (
                <Modal isOpen={isRetakeModalOpen} onClose={handleCloseRetakeModal} title="Request an Exam Retake">
                    <RequestRetakeModal 
                        examId={selectedExamForRetake} 
                        onClose={handleCloseRetakeModal}
                        onRetakeRequested={handleRetakeRequested}
                    />
                </Modal>
            )}
        </div>
    );
};
export default ExamsListPage;