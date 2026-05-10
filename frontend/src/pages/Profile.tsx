import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
    User as UserIcon, 
    Camera, 
    Save, 
    ArrowLeft, 
    Loader2, 
    Mail, 
    Settings as SettingsIcon,
    Key,
    Bell,
    Shield,
    Lock
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Profile = () => {
    const { user, refreshProfile } = useAuth();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'security'>('profile');
    const [name, setName] = useState(user?.name || '');
    const [profileImage, setProfileImage] = useState<File | null>(null);
    const [preview, setPreview] = useState(user?.profileImage || '');
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const navigate = useNavigate();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileImage(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    const handlePasswordSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwords.newPassword !== passwords.confirmPassword) {
            return toast.error("New passwords do not match");
        }
        setLoading(true);
        try {
            const { data } = await api.put('/user/change-password', {
                currentPassword: passwords.currentPassword,
                newPassword: passwords.newPassword
            });
            if (data.success) {
                toast.success("Password updated successfully!");
                setPasswords({ currentPassword: '', newPassword: '', confirmPassword: '' });
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update password");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData();
        formData.append('name', name);
        if (profileImage) {
            formData.append('profileImage', profileImage);
        }

        try {
            const { data } = await api.put('/user/update-profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (data.success) {
                toast.success("Profile updated successfully!");
                await refreshProfile();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to update profile");
        } finally {
            setLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <div className="flex flex-col lg:flex-row gap-12">
                {/* Sidebar */}
                <div className="w-full lg:w-80 space-y-8">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="flex items-center gap-2 text-slate-500 hover:text-black font-bold transition-colors group"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back
                    </button>

                    <div className="glass-card p-4 space-y-2">
                        <SidebarItem 
                            icon={UserIcon} 
                            label="Profile Overview" 
                            active={activeTab === 'profile'} 
                            onClick={() => setActiveTab('profile')}
                        />
                        <SidebarItem 
                            icon={SettingsIcon} 
                            label="Account Settings" 
                            active={activeTab === 'settings'} 
                            onClick={() => setActiveTab('settings')}
                        />
                        <SidebarItem 
                            icon={Key} 
                            label="Password & Security" 
                            active={activeTab === 'security'} 
                            onClick={() => setActiveTab('security')}
                        />
                        <div className="pt-4 border-t border-slate-50 opacity-50 cursor-not-allowed">
                            <SidebarItem icon={Bell} label="Notifications" />
                        </div>
                    </div>

                    <div className="glass-card p-8 bg-black text-white border-none overflow-hidden relative">
                        <div className="relative z-10">
                            <h4 className="font-bold mb-2">Need Help?</h4>
                            <p className="text-slate-400 text-xs mb-4">Our support team is available 24/7 for premium members.</p>
                            <button className="text-xs font-bold underline underline-offset-4">Contact Support</button>
                        </div>
                        <Shield className="absolute -right-4 -bottom-4 w-24 h-24 text-white/10 rotate-12" />
                    </div>
                </div>

                {/* Content Area */}
                <div className="flex-1">
                    <AnimatePresence mode="wait">
                        {activeTab === 'profile' && (
                            <motion.div
                                key="profile"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="space-y-8"
                            >
                                <div className="glass-card p-10 flex flex-col md:flex-row items-center gap-10">
                                    <div className="relative w-40 h-40 group">
                                        <div className="w-full h-full rounded-[40px] overflow-hidden border-4 border-slate-50 shadow-2xl bg-slate-100">
                                            {user.profileImage ? (
                                                <img src={user.profileImage} className="w-full h-full object-cover" alt={user.name} />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-5xl font-bold text-slate-300">
                                                    {user.name.charAt(0)}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-center md:text-left flex-1">
                                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-4">
                                            <h1 className="text-4xl font-bold">{user.name}</h1>
                                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-bold uppercase tracking-widest border border-indigo-100">
                                                Verified Student
                                            </span>
                                        </div>
                                        <p className="text-slate-500 font-medium text-lg mb-6">@{user.username}</p>
                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Joined Date</p>
                                                <p className="font-bold text-slate-900">{new Date(user.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <div>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Account Type</p>
                                                <p className="font-bold text-slate-900">{user.isAdmin ? 'Administrator' : 'Premium Student'}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="glass-card p-8">
                                        <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                                        <div className="space-y-4">
                                            <div className="flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center">
                                                    <Mail className="w-5 h-5 text-slate-400" />
                                                </div>
                                                <div>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Email Address</p>
                                                    <p className="font-bold text-slate-900">{user.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="glass-card p-8">
                                        <h3 className="text-xl font-bold mb-6">Library Stats</h3>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="bg-slate-50 p-4 rounded-2xl">
                                                <p className="text-2xl font-bold text-black">{user.purchases?.length || 0}</p>
                                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Purchased Notes</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'settings' && (
                            <motion.div
                                key="settings"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <div className="glass-card p-10">
                                    <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                        <SettingsIcon className="w-6 h-6 text-slate-400" /> Account Settings
                                    </h3>

                                    <form onSubmit={handleSubmit} className="space-y-8">
                                        <div className="flex flex-col md:flex-row gap-10 items-start">
                                            <div className="relative group">
                                                <div className="w-32 h-32 rounded-[32px] overflow-hidden border-4 border-slate-50 shadow-xl bg-slate-100">
                                                    {preview ? (
                                                        <img src={preview} className="w-full h-full object-cover" alt="Preview" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-4xl font-bold text-slate-300">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                    )}
                                                </div>
                                                <label className="absolute -bottom-2 -right-2 w-10 h-10 bg-black text-white rounded-2xl flex items-center justify-center cursor-pointer shadow-lg hover:scale-110 transition-transform border-4 border-white">
                                                    <Camera className="w-4 h-4" />
                                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                                </label>
                                            </div>
                                            <div className="flex-1 space-y-6 w-full">
                                                <div className="space-y-2">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Full Name</label>
                                                    <input 
                                                        type="text" 
                                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 transition-all font-medium"
                                                        value={name}
                                                        onChange={(e) => setName(e.target.value)}
                                                        required
                                                    />
                                                </div>
                                                <div className="space-y-2 opacity-60">
                                                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Username</label>
                                                    <input 
                                                        type="text" 
                                                        className="w-full px-5 py-4 bg-slate-100 border border-slate-100 rounded-2xl outline-none cursor-not-allowed font-medium"
                                                        value={user.username}
                                                        readOnly
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="pt-8 border-t border-slate-50 flex justify-end">
                                            <button 
                                                type="submit"
                                                disabled={loading}
                                                className="btn-primary min-w-[200px]"
                                            >
                                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Save Changes</>}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'security' && (
                            <motion.div
                                key="security"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                            >
                                <div className="glass-card p-10">
                                    <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                                        <Key className="w-6 h-6 text-slate-400" /> Password & Security
                                    </h3>

                                    <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-xl">
                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Current Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-5 top-4 w-5 h-5 text-slate-300" />
                                                <input 
                                                    type="password" 
                                                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 transition-all font-medium"
                                                    value={passwords.currentPassword}
                                                    onChange={(e) => setPasswords({...passwords, currentPassword: e.target.value})}
                                                    placeholder="Enter current password"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">New Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-5 top-4 w-5 h-5 text-slate-300" />
                                                <input 
                                                    type="password" 
                                                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 transition-all font-medium"
                                                    value={passwords.newPassword}
                                                    onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})}
                                                    placeholder="Minimum 6 characters"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-5 top-4 w-5 h-5 text-slate-300" />
                                                <input 
                                                    type="password" 
                                                    className="w-full pl-14 pr-5 py-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-black/5 transition-all font-medium"
                                                    value={passwords.confirmPassword}
                                                    onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})}
                                                    placeholder="Repeat new password"
                                                    required
                                                />
                                            </div>
                                        </div>

                                        <div className="pt-6 border-t border-slate-50">
                                            <button 
                                                type="submit"
                                                disabled={loading}
                                                className="btn-primary w-full md:w-fit px-12"
                                            >
                                                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <><Save className="w-5 h-5" /> Update Password</>}
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: any) => (
    <button 
        onClick={onClick}
        className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-sm font-bold transition-all ${
            active 
                ? 'bg-black text-white shadow-xl shadow-slate-200' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-black cursor-pointer'
        }`}
    >
        <Icon className={`w-5 h-5 ${active ? 'text-white' : 'text-slate-400'}`} />
        {label}
    </button>
);

export default Profile;
