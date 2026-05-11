import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { 
    LayoutDashboard, 
    BookOpen,
    DollarSign, 
    Users, 
    Clock, 
    Plus,
    Download,
    Settings,
    Loader2,
    Shield,
    LogOut
} from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Dashboard = () => {
    const { user, logout, loading } = useAuth();
    const [downloadingId, setDownloadingId] = useState<string | null>(null);

    const handleDownload = async (noteId: string) => {
        setDownloadingId(noteId);
        try {
            const { data } = await api.get(`/notes/download/${noteId}`);
            if (data.success && data.downloadUrl) {
                const link = document.createElement('a');
                link.href = data.downloadUrl;
                link.target = '_blank';
                link.rel = 'noopener noreferrer';
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to generate download link");
        } finally {
            setDownloadingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#FDFDFD]">
                <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                >
                    <Loader2 className="w-12 h-12 text-slate-200" />
                </motion.div>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/auth" />;
    }

    const stats = [
        { label: "Total Purchased", value: user.purchases?.length || 0, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
        { label: "Learning Hours", value: "128h", icon: Clock, color: "text-purple-600", bg: "bg-purple-50" },
        { label: "Points Earned", value: "2,450", icon: Star, color: "text-yellow-600", bg: "bg-yellow-50" },
    ];

    if (user.isAdmin) {
        stats.push(
            { label: "Total Revenue", value: "₹12,450", icon: DollarSign, color: "text-green-600", bg: "bg-green-50" },
            { label: "Total Customers", value: "450", icon: Users, color: "text-cyan-600", bg: "bg-cyan-50" }
        );
    }

    return (
        <div className="pt-24 lg:pt-32 pb-24 lg:pb-20 px-4 md:px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 relative">
            {/* Ambient Background Blobs */}
            <div className="absolute top-20 right-0 w-64 md:w-96 h-64 md:h-96 bg-slate-100 rounded-full blur-[80px] md:blur-[120px] opacity-40 -z-10"></div>
            <div className="absolute bottom-0 left-10 md:left-40 w-64 md:w-96 h-64 md:h-96 bg-slate-100 rounded-full blur-[80px] md:blur-[120px] opacity-40 -z-10"></div>

            {/* Desktop Sidebar */}
            <motion.aside 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="hidden lg:flex flex-col w-72 gap-6 sticky top-32 h-fit"
            >
                <div className="glass p-6 rounded-[32px] flex flex-col gap-3 shadow-2xl shadow-slate-200/50">
                    <div className="flex items-center gap-4 mb-6 px-2">
                        <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center font-bold text-white text-xl overflow-hidden shadow-lg">
                            {user.profileImage ? (
                                <img src={user.profileImage} className="w-full h-full object-cover" alt={user.name} />
                            ) : (
                                user.name?.charAt(0)
                            )}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active User</p>
                            <h4 className="font-bold text-slate-800 line-clamp-1">{user.name}</h4>
                            <p className="text-[10px] text-slate-400 font-medium">@{user.username}</p>
                        </div>
                    </div>
                    <SidebarLink icon={LayoutDashboard} label="Overview" to="/dashboard" active />
                    <SidebarLink icon={Settings} label="Profile Settings" to="/profile" />
                    <button 
                        onClick={logout}
                        className="flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold text-red-500 hover:bg-red-50 transition-all mt-4 border border-red-100/50"
                    >
                        <LogOut className="w-5 h-5" />
                        Sign Out
                    </button>
                </div>
            </motion.aside>

            {/* Main Content */}
            <main className="flex-1 space-y-8 md:space-y-12">
                <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-center sm:text-left">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">Welcome back, <span className="text-black">{user.name.split(' ')[0]}</span>!</h1>
                        <p className="text-slate-500 font-medium text-sm md:text-base">Manage your library and access your premium notes.</p>
                    </div>
                    {user.isAdmin && (
                        <Link to="/upload" className="btn-primary w-full sm:w-fit justify-center py-4">
                            <Plus className="w-5 h-5" /> Upload New Note
                        </Link>
                    )}
                </header>

                {/* Profile Overview Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    <div className="glass-card bg-black text-white border-none p-6 md:p-8 flex flex-col justify-between min-h-[140px] md:min-h-[180px] overflow-hidden relative group">
                        <div className="relative z-10">
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Profile Email</p>
                            <h3 className="text-lg md:text-xl font-bold truncate">{user.email}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium relative z-10">
                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span> Account Verified
                        </div>
                        <Shield className="absolute -right-4 -bottom-4 w-24 h-24 text-white/5 rotate-12" />
                    </div>
                    <div className="glass-card p-6 md:p-8 flex flex-col justify-between min-h-[140px] md:min-h-[180px]">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Total Collections</p>
                            <h3 className="text-4xl md:text-5xl font-bold text-black">{user.purchases?.length || 0}</h3>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Premium notes in your vault</p>
                    </div>
                </div>

                {/* Purchased Notes List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <h3 className="text-xl md:text-2xl font-bold">My Digital Vault</h3>
                        <div className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {user.purchases?.length || 0} ITEMS
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-2 gap-4 md:gap-6">
                        {user.purchases && user.purchases.length > 0 ? (
                            user.purchases.map((purchase: any, i: number) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    className="glass p-4 md:p-6 rounded-[28px] md:rounded-[32px] flex items-center gap-4 md:gap-6 group relative overflow-hidden"
                                >
                                    <div className="w-16 h-20 md:w-20 md:h-24 bg-slate-100 rounded-xl md:rounded-2xl overflow-hidden shadow-lg group-hover:scale-105 transition-transform shrink-0">
                                        <img src={purchase.note?.thumbnail} className="w-full h-full object-cover" alt={purchase.note?.title} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-2 mb-1 md:mb-2">
                                            <span className="text-[8px] md:text-[10px] font-bold text-slate-900 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-full">Verified PDF</span>
                                        </div>
                                        <h4 className="font-bold text-base md:text-lg text-slate-800 mb-2 md:mb-4 truncate">{purchase.note?.title}</h4>
                                        <button 
                                            disabled={downloadingId === purchase.note?._id}
                                            onClick={() => handleDownload(purchase.note?._id)}
                                            className="flex items-center gap-2 text-xs md:text-sm font-bold text-black hover:translate-x-1 transition-transform cursor-pointer"
                                        >
                                            {downloadingId === purchase.note?._id ? (
                                                <Loader2 className="w-3 h-3 md:w-4 md:h-4 animate-spin" />
                                            ) : (
                                                <Download className="w-3 h-3 md:w-4 md:h-4" />
                                            )}
                                            {downloadingId === purchase.note?._id ? 'Securing...' : 'Download Note'}
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full glass p-10 md:p-20 text-center rounded-[32px] md:rounded-[40px]">
                                <div className="w-16 h-16 md:w-20 md:h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <BookOpen className="w-8 h-8 md:w-10 md:h-10 text-slate-300" />
                                </div>
                                <h3 className="text-lg md:text-xl font-bold mb-2">Your vault is empty</h3>
                                <p className="text-slate-500 text-sm max-w-xs mx-auto mb-8">Notes you purchase from the marketplace will appear here.</p>
                                <Link to="/marketplace" className="btn-primary mx-auto w-fit px-8 py-4">Explore Marketplace</Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Mobile Bottom Navigation */}
            <div className="lg:hidden fixed bottom-6 left-1/2 -translate-x-1/2 w-[calc(100%-48px)] max-w-md glass bg-white/80 backdrop-blur-xl border border-slate-100 shadow-2xl rounded-full p-2 flex items-center justify-around z-50">
                <Link to="/dashboard" className="flex flex-col items-center gap-1 p-3 rounded-full text-black bg-slate-50 shadow-inner">
                    <LayoutDashboard className="w-6 h-6" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Home</span>
                </Link>
                <Link to="/profile" className="flex flex-col items-center gap-1 p-3 text-slate-400">
                    <Settings className="w-6 h-6" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Profile</span>
                </Link>
                {user.isAdmin && (
                    <Link to="/upload" className="flex flex-col items-center gap-1 p-3 text-slate-400">
                        <Plus className="w-6 h-6" />
                        <span className="text-[8px] font-bold uppercase tracking-widest">Upload</span>
                    </Link>
                )}
                <button onClick={logout} className="flex flex-col items-center gap-1 p-3 text-red-400">
                    <LogOut className="w-6 h-6" />
                    <span className="text-[8px] font-bold uppercase tracking-widest">Exit</span>
                </button>
            </div>
        </div>
    );
};

const SidebarLink = ({ icon: Icon, label, to, active = false }: any) => (
    <Link 
        to={to}
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all ${
            active 
                ? 'bg-black text-white shadow-lg shadow-slate-200' 
                : 'text-slate-500 hover:bg-slate-50 hover:text-black cursor-pointer'
        }`}
    >
        <Icon className="w-5 h-5" />
        {label}
    </Link>
);

const Star = ({ className }: any) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
);

export default Dashboard;
