import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

const CreateExamPage = () => {
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState(75);
    const [questionsJson, setQuestionsJson] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const placeholderJson = `[
  {
    "id": 1,
    "question": "What is the capital of France?",
    "options": ["Berlin", "Madrid", "Paris", "Rome"],
    "correct": 2
  },
  {
    "id": 2,
    "question": "What is 2 + 2?",
    "options": ["3", "4", "5", "6"],
    "correct": 1
  }
]`;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        let parsedQuestions;
        try {
            parsedQuestions = JSON.parse(questionsJson);
            if (!Array.isArray(parsedQuestions) || parsedQuestions.length === 0) {
                throw new Error("JSON must be a non-empty array.");
            }
        } catch (error) {
            toast.error("Invalid JSON format. Please check your data.");
            setIsLoading(false);
            return;
        }

        try {
            await api.post('/api/exams', { title, duration, questions: parsedQuestions });
            toast.success('Exam created successfully!');
            setTitle('');
            setDuration(75);
            setQuestionsJson('');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to create exam.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="max-w-4xl mx-auto"
        >
            {/* Responsive Change: Padding adjusted for mobile */}
            <form onSubmit={handleSubmit} className="bg-surface p-6 md:p-8 rounded-2xl shadow-lg space-y-6">
                {/* Responsive Change: Text size adjusted for mobile */}
                <h2 className="text-2xl md:text-3xl font-bold text-on-surface border-b pb-4">Create a New Exam</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="title" className="block text-sm font-medium text-slate-600 mb-1">Exam Title</label>
                        <input
                            type="text"
                            id="title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-slate-600 mb-1">Duration (minutes)</label>
                        <input
                            type="number"
                            id="duration"
                            value={duration}
                            onChange={(e) => setDuration(Number(e.target.value))}
                            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                            required
                        />
                    </div>
                </div>

                <div>
                    <label htmlFor="questions" className="block text-sm font-medium text-slate-600 mb-1">Questions (JSON Format)</label>
                    <textarea
                        id="questions"
                        rows="15"
                        value={questionsJson}
                        onChange={(e) => setQuestionsJson(e.target.value)}
                        className="w-full px-4 py-2 font-mono text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                        placeholder={placeholderJson}
                        required
                    ></textarea>
                </div>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors duration-300 disabled:bg-indigo-300"
                    >
                        {isLoading ? 'Creating...' : 'Create Exam'}
                    </button>
                </div>
            </form>
        </motion.div>
    );
};

export default CreateExamPage;