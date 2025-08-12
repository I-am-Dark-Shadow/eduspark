import { useState } from 'react';
import useAuthStore from '../../store/authStore';
import api from '../../services/api';
import toast from 'react-hot-toast';
import { LuCamera } from 'react-icons/lu';

const ProfilePage = () => {
    const { user, updateProfile } = useAuthStore();
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);
    const [profilePicture, setProfilePicture] = useState(user.profilePicture);
    const [isUploading, setIsUploading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);
        setIsUploading(true);
        try {
            const { data } = await api.post('/api/upload', formData);
            setProfilePicture(data.imageUrl);
            toast.success("Profile picture updated!");
        } catch (error) {
            console.error(error);
            toast.error("Image upload failed.");
        } finally {
            setIsUploading(false);
        }
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      setIsSaving(true);
      try {
        const { data } = await api.put('/api/users/profile', { name, email, profilePicture });
        updateProfile(data);
        toast.success("Profile updated successfully!");
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to update profile.");
      } finally {
        setIsSaving(false);
      }
    };

    return (
        <div className="max-w-2xl mx-auto">
            {/* Responsive Change: Padding */}
            <form onSubmit={handleSubmit} className="bg-surface p-6 md:p-8 rounded-2xl shadow-lg space-y-6">
                 {/* Responsive Change: Text size */}
                 <h2 className="text-2xl md:text-3xl font-bold text-on-surface border-b pb-4">Your Profile</h2>
                 
                 <div className="flex justify-center">
                    <div className="relative">
                        <img src={profilePicture} alt="Profile" className="w-32 h-32 rounded-full object-cover border-4 border-primary shadow-md"/>
                        <label htmlFor="image-upload" className="absolute bottom-0 right-0 bg-secondary text-white p-2 rounded-full cursor-pointer hover:bg-emerald-700 transition-colors">
                            <LuCamera />
                        </label>
                        <input id="image-upload" type="file" className="hidden" onChange={handleImageUpload} disabled={isUploading}/>
                        {isUploading && <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center"><div className="w-8 h-8 border-4 border-white border-t-transparent rounded-full animate-spin"></div></div>}
                    </div>
                 </div>

                 <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Name</label>
                    <input type="text" value={name} disabled onChange={e => setName(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
                 </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-600 mb-1">Email</label>
                    <input type="email" value={email} disabled onChange={e => setEmail(e.target.value)} className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"/>
                 </div>
                 <div className="flex justify-end">
                    <button type="submit" disabled={isSaving} className="px-8 py-3 bg-primary text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors disabled:bg-indigo-300">
                      {isSaving ? "Saving..." : "Save Changes"}
                    </button>
                 </div>
            </form>
        </div>
    );
};
export default ProfilePage;