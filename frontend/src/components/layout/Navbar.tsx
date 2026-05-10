import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, LayoutDashboard } from 'lucide-react';
import { useState } from 'react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.nav 
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            className="fixed top-0 left-0 right-0 z-50 px-6 py-4"
        >
            <div className="max-w-7xl mx-auto glass rounded-full px-8 py-3 flex items-center justify-between">
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg shadow-orange-100 group-hover:scale-110 transition-transform duration-500">
                        <img src="https://i.pinimg.com/1200x/e1/07/99/e10799e9cd6007364e48cdf3a3665707.jpg" alt="NotesVault Logo" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-heading font-bold text-xl tracking-tighter text-slate-800">NotesVault</span>
                </Link>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    <Link to="/marketplace" className="text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-black transition-colors">Marketplace</Link>
                    <Link to="/about" className="text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-black transition-colors">About</Link>
                    <Link to="/contact" className="text-[10px] font-bold uppercase tracking-widest text-slate-600 hover:text-black transition-colors">Contact Us</Link>
                </div>

                <div className="hidden md:flex items-center gap-4">
                    {user ? (
                        <div className="flex items-center gap-6">
                            {user.isAdmin && (
                            <Link to="/admin" className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-600 hover:text-black transition-all">
                                <LayoutDashboard className="w-5 h-5" /> Admin Portal
                            </Link>
                        )}
                        <Link to="/dashboard" className="flex items-center gap-3 pl-4 border-l border-slate-100 group">
                            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center font-bold text-white text-sm overflow-hidden border-2 border-transparent group-hover:border-black transition-all">
                                {user.profileImage ? (
                                    <img src={user.profileImage} className="w-full h-full object-cover" alt={user.name} />
                                ) : (
                                    user.name?.charAt(0)
                                )}
                            </div>
                            <div className="hidden md:block">
                                <p className="text-xs font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{user.name.split(' ')[0]}</p>
                                <p className="text-[10px] text-slate-400 font-medium">Dashboard</p>
                            </div>
                        </Link>               </div>
                    ) : (
                        <div className="flex items-center gap-4">
                            <Link to="/auth" className="btn-ghost">Sign In</Link>
                            <Link to="/auth" className="btn-primary px-6 py-2.5 text-sm">Get Started</Link>
                        </div>
                    )}
                </div>

                {/* Mobile Toggle */}
                <button className="md:hidden p-2" onClick={() => setIsOpen(!isOpen)}>
                    {isOpen ? <X /> : <Menu />}
                </button>
            </div>

            {/* Mobile Menu */}
            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="md:hidden absolute top-24 left-6 right-6 glass rounded-3xl p-6 flex flex-col gap-4"
                >
                    <Link to="/marketplace" onClick={() => setIsOpen(false)}>Marketplace</Link>
                    {user ? (
                        <>
                            <Link to="/dashboard" onClick={() => setIsOpen(false)}>Dashboard</Link>
                            <button onClick={logout} className="text-left text-red-500">Logout</button>
                        </>
                    ) : (
                        <Link to="/auth" onClick={() => setIsOpen(false)}>Sign In</Link>
                    )}
                </motion.div>
            )}
        </motion.nav>
    );
};

export default Navbar;
