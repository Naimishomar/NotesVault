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
import { Link } from 'react-router-dom';

const Dashboard = () => {
    const { user, logout, loading } = useAuth();

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
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-[#FDFDFD] px-6 text-center">
                <Shield className="w-16 h-16 text-red-100 mb-6" />
                <h2 className="text-2xl font-bold mb-2">Session Error</h2>
                <p className="text-slate-500 max-w-xs mb-8">We couldn't verify your session. This is likely due to a temporary server connection issue.</p>
                <button onClick={() => window.location.reload()} className="btn-primary">Retry Connection</button>
            </div>
        );
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
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row gap-8 relative">
            {/* Ambient Background Blobs */}
            <div className="absolute top-20 right-0 w-96 h-96 bg-slate-100 rounded-full blur-[120px] opacity-40 -z-10"></div>
            <div className="absolute bottom-0 left-40 w-96 h-96 bg-slate-100 rounded-full blur-[120px] opacity-40 -z-10"></div>

            {/* Sidebar */}
            <motion.aside 
                initial={{ x: -100, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="hidden lg:flex flex-col w-72 gap-6"
            >
                <div className="glass p-6 rounded-[32px] flex flex-col gap-3 shadow-2xl shadow-slate-200/50">
                    <div className="flex items-center gap-4 mb-6 px-2">
                        <div className="w-12 h-12 rounded-2xl bg-black flex items-center justify-center font-bold text-white text-xl">
                            {user.name?.charAt(0)}
                        </div>
                        <div>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Active User</p>
                            <h4 className="font-bold text-slate-800">{user.name}</h4>
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
            <main className="flex-1 space-y-12">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-bold mb-2">Welcome back, <span className="text-black">{user.name.split(' ')[0]}</span>!</h1>
                        <p className="text-slate-500 font-medium">Manage your library and access your premium notes.</p>
                    </div>
                    {user.isAdmin && (
                        <Link to="/upload" className="btn-primary">
                            <Plus className="w-4 h-4" /> Upload New Note
                        </Link>
                    )}
                </header>

                {/* Profile Overview Card */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="glass-card bg-black text-white border-none p-8 flex flex-col justify-between min-h-[180px]">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Profile Email</p>
                            <h3 className="text-xl font-bold">{user.email}</h3>
                        </div>
                        <div className="flex items-center gap-2 text-slate-400 text-sm font-medium">
                            <span className="w-2 h-2 bg-green-500 rounded-full"></span> Account Verified
                        </div>
                    </div>
                    <div className="glass-card p-8 flex flex-col justify-between min-h-[180px]">
                        <div>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-2">Total Collections</p>
                            <h3 className="text-4xl font-bold text-black">{user.purchases?.length || 0}</h3>
                        </div>
                        <p className="text-slate-500 text-sm font-medium">Premium notes in your vault</p>
                    </div>
                </div>

                {/* Purchased Notes List */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                        <h3 className="text-2xl font-bold">My Digital Vault</h3>
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                            {user.purchases?.length || 0} ITEMS
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {user.purchases && user.purchases.length > 0 ? (
                            user.purchases.map((purchase: any, i: number) => (
                                <motion.div 
                                    key={i} 
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.1 }}
                                    whileHover={{ y: -5 }}
                                    className="glass p-6 rounded-[32px] flex items-center gap-6 group"
                                >
                                    <div className="w-20 h-24 bg-slate-100 rounded-2xl overflow-hidden shadow-lg group-hover:rotate-3 transition-transform">
                                        <img src={purchase.note?.thumbnail} className="w-full h-full object-cover" alt={purchase.note?.title} />
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-[10px] font-bold text-slate-900 uppercase tracking-widest bg-slate-100 px-2 py-0.5 rounded-full">Verified PDF</span>
                                        </div>
                                        <h4 className="font-bold text-lg text-slate-800 mb-4 group-hover:text-black transition-colors">{purchase.note?.title}</h4>
                                        <button 
                                            onClick={() => window.open(purchase.note?.url, '_blank')}
                                            className="flex items-center gap-2 text-sm font-bold text-black hover:translate-x-1 transition-transform cursor-pointer"
                                        >
                                            <Download className="w-4 h-4" /> Download Note
                                        </button>
                                    </div>
                                </motion.div>
                            ))
                        ) : (
                            <div className="col-span-full glass p-20 text-center rounded-[40px]">
                                <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                                    <BookOpen className="w-10 h-10 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">Your vault is empty</h3>
                                <p className="text-slate-500 max-w-xs mx-auto mb-8">Notes you purchase from the marketplace will appear here.</p>
                                <Link to="/marketplace" className="btn-primary mx-auto w-fit">Explore Marketplace</Link>
                            </div>
                        )}
                    </div>
                </div>
            </main>
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
