import React, { useState } from 'react';
import api from '../../services/api'; // your axios instance

const AddExamForm = () => {
    const [title, setTitle] = useState('');
    const [questionsJson, setQuestionsJson] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        try {
            // Basic JSON validation on the frontend
            JSON.parse(questionsJson);
            
            // Send to backend API
            await api.post('/api/exams', { title, questions: questionsJson });
            setSuccess('Exam created successfully!');
            setTitle('');
            setQuestionsJson('');
        } catch (err) {
            setError('Failed to create exam. Please check the JSON format and try again.');
        }
    };
    
    // Example JSON structure to guide the teacher
    const placeholderJson = `[
  {
    "id": 1,
    "question": "Sample Question?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "correct": 0
  }
]`;

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-lg shadow-md">
            <h2 className="text-2xl font-bold">Create New Exam</h2>
            {error && <div className="text-red-500">{error}</div>}
            {success && <div className="text-green-500">{success}</div>}
            <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Exam Title</label>
                <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm"
                    required
                />
            </div>
            <div>
                <label htmlFor="questions" className="block text-sm font-medium text-gray-700">Questions (JSON Format)</label>
                <textarea
                    id="questions"
                    rows="10"
                    value={questionsJson}
                    onChange={(e) => setQuestionsJson(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm font-mono"
                    placeholder={placeholderJson}
                    required
                ></textarea>
            </div>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                Create Exam
            </button>
        </form>
    );
};

export default AddExamForm;