import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';

const RequestRetakeModal = ({ examId, onClose, onRetakeRequested }) => {
  const [reason, setReason] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!reason.trim()) {
        toast.error("Please provide a reason for the retake request.");
        return;
    }
    setIsLoading(true);
    try {
      await api.post('/api/retakes/request', { examId, reason });
      toast.success("Retake request submitted successfully!");
      onRetakeRequested(examId);
      onClose();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to submit request.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="reason" className="block text-sm font-medium text-slate-600 mb-1">
          Please provide a brief reason for your request:
        </label>
        <textarea 
            id="reason"
            value={reason} 
            onChange={(e) => setReason(e.target.value)} 
            required 
            rows="4"
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="e.g., I had a technical issue during the exam."
        />
      </div>
      <div className="flex justify-end pt-4 gap-3">
        <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-200 text-slate-800 font-semibold rounded-lg hover:bg-slate-300">
            Cancel
        </button>
        <button type="submit" disabled={isLoading} className="px-6 py-2 bg-primary text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300">
          {isLoading ? 'Submitting...' : 'Submit Request'}
        </button>
      </div>
    </form>
  );
};

export default RequestRetakeModal;