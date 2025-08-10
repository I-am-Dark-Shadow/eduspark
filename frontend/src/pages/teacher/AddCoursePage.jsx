import { useState } from 'react';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { LuUpload } from 'react-icons/lu';

const AddCoursePage = () => {
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState('');
    const [videoUrl, setVideoUrl] = useState('');
    const [status, setStatus] = useState('available');
    const [thumbnail, setThumbnail] = useState(null);
    const [thumbnailPreview, setThumbnailPreview] = useState('');
    const [isUploading, setIsUploading] = useState(false);

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setThumbnail(file);
            setThumbnailPreview(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!thumbnail) {
            toast.error("Please upload a thumbnail image.");
            return;
        }

        setIsUploading(true);
        let thumbnailUrl = '';
        const formData = new FormData();
        formData.append('image', thumbnail);

        try {
            // 1. Upload thumbnail to Cloudinary
            const uploadRes = await api.post('/api/upload', formData);
            thumbnailUrl = uploadRes.data.imageUrl;

            // 2. Save course data to the database
            const courseData = { title, duration, videoUrl, status, thumbnail: thumbnailUrl };
            await api.post('/api/courses', courseData);
            
            toast.success("Course added successfully!");
            // Reset form
            setTitle('');
            setDuration('');
            setVideoUrl('');
            setStatus('available');
            setThumbnail(null);
            setThumbnailPreview('');

        } catch (error) {
            toast.error(error.response?.data?.message || "Failed to add course.");
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="bg-surface p-8 rounded-2xl shadow-sm space-y-6">
                <h2 className="text-2xl font-bold text-on-surface border-b border-border-color pb-4">Add New Course</h2>
                
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-on-surface-secondary mb-1">Course Title</label>
                    <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} required className="w-full px-4 py-2 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="duration" className="block text-sm font-medium text-on-surface-secondary mb-1">Duration (e.g., 5h 30m)</label>
                        <input type="text" id="duration" value={duration} onChange={e => setDuration(e.target.value)} required className="w-full px-4 py-2 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
                    </div>
                    <div>
                        <label htmlFor="status" className="block text-sm font-medium text-on-surface-secondary mb-1">Status</label>
                        <select id="status" value={status} onChange={e => setStatus(e.target.value)} className="w-full px-4 py-2 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary">
                            <option value="available">Available</option>
                            <option value="coming-soon">Coming Soon</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label htmlFor="videoUrl" className="block text-sm font-medium text-on-surface-secondary mb-1">YouTube Video URL</label>
                    <input type="url" id="videoUrl" value={videoUrl} onChange={e => setVideoUrl(e.target.value)} required placeholder="https://www.youtube.com/watch?v=..." className="w-full px-4 py-2 border border-border-color rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
                </div>

                <div>
                    <label className="block text-sm font-medium text-on-surface-secondary mb-1">Thumbnail</label>
                    <div className="mt-2 flex items-center justify-center w-full">
                        <label htmlFor="thumbnail-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-border-color border-dashed rounded-lg cursor-pointer bg-background hover:bg-gray-100">
                            {thumbnailPreview ? (
                                <img src={thumbnailPreview} alt="Thumbnail Preview" className="w-full h-full object-cover rounded-lg" />
                            ) : (
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <LuUpload className="w-8 h-8 mb-4 text-on-surface-secondary" />
                                    <p className="mb-2 text-sm text-on-surface-secondary"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                                    <p className="text-xs text-on-surface-secondary">PNG, JPG, JPEG</p>
                                </div>
                            )}
                            <input id="thumbnail-upload" type="file" className="hidden" onChange={handleThumbnailChange} accept="image/*" />
                        </label>
                    </div> 
                </div>

                <div className="flex justify-end pt-4">
                    <button type="submit" disabled={isUploading} className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-orange-700 transition-colors disabled:bg-orange-300">
                        {isUploading ? 'Saving...' : 'Add Course'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddCoursePage;