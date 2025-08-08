import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import api from '../../services/api';
import toast from 'react-hot-toast';
import Spinner from '../../components/common/Spinner';
import { motion } from 'framer-motion';
import { LuAlarmClock, LuArrowLeft, LuArrowRight, LuSave, LuSkipForward } from 'react-icons/lu';

const ExamPage = () => {
  const { id: examId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [exam, setExam] = useState(null);
  const [result, setResult] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // --- NEW: useEffect for security features ---
  useEffect(() => {
    // Prevent right-click context menu
    const handleContextMenu = (e) => e.preventDefault();
    document.addEventListener('contextmenu', handleContextMenu);

    // Prevent keyboard shortcuts for developer tools
    const handleKeyDown = (e) => {
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.shiftKey && e.key === 'J') ||
        (e.ctrlKey && e.key === 'U')
      ) {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);

    // This is a cleanup function. It runs when the component unmounts.
    // It's crucial for re-enabling these features on other pages.
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []); // The empty array means this effect runs only once when the page loads.


  // This logic remains the same
  useEffect(() => {
    const startAndFetchExam = async () => {
      try {
        const isRetake = location.state?.isRetake || false;
        const examRes = await api.get(`/api/exams/${examId}`);
        setExam(examRes.data);
        const resultRes = await api.post('/api/results/start-exam', { examId, isRetake });
        setResult(resultRes.data);
        const startTime = new Date(resultRes.data.startTime);
        const now = new Date();
        const elapsedTime = Math.floor((now - startTime) / 1000);
        const initialTimeLeft = (examRes.data.duration * 60) - elapsedTime;
        setTimeLeft(initialTimeLeft > 0 ? initialTimeLeft : 0);
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to start exam.");
        navigate('/student/exams');
      } finally {
        setIsLoading(false);
      }
    };
    startAndFetchExam();
  }, [examId, navigate, location.state]);

  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) {
        if(timeLeft === 0) handleAutoSubmit();
        return;
    };
    const intervalId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const handleSubmitExam = useCallback(async () => {
    if(!result?._id) return;
    try {
      const answersArray = Object.entries(answers).map(([questionId, selectedOption]) => ({
        questionId: Number(questionId),
        selectedOption,
      }));
      const { data } = await api.post('/api/results/submit', {
        resultId: result._id,
        answers: answersArray,
      });
      toast.success("Exam submitted successfully!");
      navigate(`/student/result/${data._id}`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit exam.");
    }
  }, [answers, result, navigate]);

  const handleAutoSubmit = useCallback(() => {
    toast.error("Time's up! Submitting your exam automatically.");
    handleSubmitExam();
  }, [handleSubmitExam]);

  const handleOptionSelect = (questionId, optionIndex) => {
    if (answers[questionId] !== undefined) {
      toast("You've already answered this question.", { icon: '🔒' });
      return;
    }
    setAnswers(prev => ({ ...prev, [questionId]: optionIndex }));
  };
  
  const handleSkip = () => {
    if(currentQuestionIndex < exam.questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  }

  const formatTime = (seconds) => {
    if (seconds < 0) return "00:00:00";
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  if (isLoading || !exam) {
    return <div className="min-h-screen flex items-center justify-center"><Spinner size="16" /></div>;
  }
  
  const currentQuestion = exam.questions[currentQuestionIndex];
  const isAnswered = answers[currentQuestion.id] !== undefined;

  return (
    // NEW: Added `select-none` class to disable text highlighting/copying
    <div className="min-h-screen bg-slate-100 flex flex-col p-2 sm:p-4 md:p-6 select-none">
      <div className="bg-white shadow-md rounded-2xl p-4 mb-6 flex flex-col sm:flex-row justify-between items-center gap-4">
        <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-primary text-center sm:text-left">{exam.title}</h1>
        <div className={`flex items-center gap-2 font-bold text-lg md:text-xl px-4 py-2 rounded-lg ${timeLeft < 300 ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-green-100 text-green-600'}`}>
          <LuAlarmClock />
          <span>{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="flex-grow flex flex-col lg:flex-row gap-6">
        <div className="lg:flex-[1] lg:order-2 bg-white rounded-2xl shadow-lg p-4 md:p-6 flex flex-col">
          <h3 className="text-xl font-bold mb-4 text-center">Question Palette</h3>
          <div className="grid grid-cols-6 sm:grid-cols-7 md:grid-cols-5 gap-2 md:gap-3 mb-6">
            {exam.questions.map((q, index) => (
              <button
                key={q.id}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-10 h-10 md:w-12 md:h-12 rounded-lg font-bold transition-transform hover:scale-110 flex items-center justify-center
                  ${index === currentQuestionIndex ? 'bg-primary text-white ring-2 ring-offset-2 ring-primary' : ''}
                  ${answers[q.id] !== undefined ? 'bg-secondary text-white' : 'bg-slate-200'}
                `}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <div className="mt-auto">
            <button onClick={handleSubmitExam} className="w-full flex items-center justify-center gap-2 text-xl font-bold px-6 py-3 md:py-4 rounded-lg text-white bg-secondary hover:bg-emerald-700 transition-colors">
              <LuSave /> Submit Exam
            </button>
          </div>
        </div>

        <motion.div initial={{opacity: 0, x: -50}} animate={{opacity: 1, x: 0}} className="lg:flex-[3] lg:order-1 bg-white rounded-2xl shadow-lg p-4 md:p-8 flex flex-col">
          <div className="mb-6">
            <span className="text-sm font-bold bg-primary text-white px-3 py-1 rounded-full">
              Question {currentQuestionIndex + 1} of {exam.questions.length}
            </span>
            <h2 className="text-xl md:text-2xl font-semibold mt-4 text-slate-800">{currentQuestion.question}</h2>
          </div>
          
          <div className="space-y-3 md:space-y-4">
            {currentQuestion.options.map((option, index) => {
              const isSelected = answers[currentQuestion.id] === index;
              return (
                <div
                  key={index}
                  onClick={() => handleOptionSelect(currentQuestion.id, index)}
                  className={`p-3 md:p-4 border-2 rounded-xl text-base md:text-lg transition-all duration-200 cursor-pointer flex items-center gap-4
                    ${isAnswered && !isSelected ? 'bg-slate-100 text-slate-500 cursor-not-allowed' : ''}
                    ${isSelected ? 'border-secondary bg-emerald-50 ring-2 ring-secondary' : 'border-slate-200 hover:border-primary'}
                  `}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${isSelected ? 'border-secondary bg-secondary' : 'border-slate-400'}`}>
                    {isSelected && <span className="text-white font-bold">✔</span>}
                  </div>
                  <span>{option}</span>
                </div>
              );
            })}
          </div>

          <div className="mt-auto pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
            <button onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))} disabled={currentQuestionIndex === 0} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-slate-700 bg-slate-200 hover:bg-slate-300 disabled:opacity-50 transition-colors"><LuArrowLeft /> Previous</button>
            {!isAnswered && <button onClick={handleSkip} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white bg-amber-500 hover:bg-amber-600 transition-colors"><LuSkipForward /> Skip</button>}
            <button onClick={() => setCurrentQuestionIndex(prev => Math.min(exam.questions.length - 1, prev + 1))} disabled={currentQuestionIndex === exam.questions.length - 1} className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-lg text-white bg-primary hover:bg-indigo-700 disabled:opacity-50 transition-colors">Next <LuArrowRight /></button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default ExamPage;