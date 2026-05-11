import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Mail, Lock, User, UserCircle, ArrowRight, Loader2, Shield } from 'lucide-react';

const AuthPage = () => {
    const [isLogin, setIsLogin] = useState(true);
    const [loading, setLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        otp: ''
    });

    const handleSendOTP = async () => {
        if (!formData.email) return toast.error("Please enter email");
        setLoading(true);
        try {
            const { data } = await api.post('/auth/send-otp', { email: formData.email });
            if (data.success) {
                toast.success("OTP sent to your email!");
                setOtpSent(true);
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to send OTP");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const { data } = await api.post(endpoint, formData);
            
            if (data.success) {
                toast.success(isLogin ? "Login successful!" : "Account created!");
                login(data.accessToken);
                navigate('/dashboard');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Auth failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 md:p-6 bg-white selection:bg-black selection:text-white relative overflow-hidden pt-28 pb-10 mt-20">
            {/* Ambient Background Elements */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-slate-50 rounded-full blur-[120px] opacity-50 -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-slate-50 rounded-full blur-[120px] opacity-50 -ml-20 -mb-20"></div>

            <motion.div 
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="max-w-6xl w-full flex flex-col md:flex-row bg-white rounded-[40px] md:rounded-[56px] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.12)] border border-slate-100 overflow-hidden relative z-10 min-h-[500px] md:min-h-[600px]"
            >
                {/* Visual Side: Cinematic Background */}
                <div className="w-full md:w-[45%] bg-black p-10 text-white flex flex-col justify-between relative overflow-hidden border-r border-slate-900">
                    {/* Background Hero Image */}
                    <div className="absolute inset-0 z-0">
                        <motion.img 
                            src="https://i.pinimg.com/1200x/b9/e3/63/b9e36309ae7d99f686023d198d67365e.jpg" 
                            className="absolute inset-0 w-full h-full object-cover opacity-60 scale-110"
                            animate={{ scale: [1.1, 1.2, 1.1], x: [-10, 10, -10] }}
                            transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                    </div>

                    <div className="relative z-10">
                        {/* Content removed for a cleaner look */}
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3, 4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-black bg-slate-800 overflow-hidden">
                                        <img src={`https://i.pravatar.cc/100?u=${i+20}`} alt="User" />
                                    </div>
                                ))}
                            </div>
                            <div className="flex flex-col">
                                <span className="text-xs font-bold text-white tracking-tight">50k+ Scholars</span>
                                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Active Community</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Side: Clean & Ritual */}
                <div className="flex-1 p-6 md:p-10 pb-16 md:pb-24 flex flex-col justify-center relative bg-white">
                    <div className="max-w-md mx-auto w-full">
                        <div className="mb-6 text-center md:text-left mt-15">
                            <h3 className="text-3xl font-bold text-slate-900 mb-3 tracking-tight">
                                {isLogin ? "Welcome Back" : "Create Account"}
                            </h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">
                                {isLogin ? "New to the ritual?" : "Already a member?"} 
                                <button 
                                    onClick={() => {setIsLogin(!isLogin); setOtpSent(false);}}
                                    className="text-black ml-2 hover:underline transition-all"
                                >
                                    {isLogin ? "Join now" : "Sign in here"}
                                </button>
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <AnimatePresence mode="wait">
                                {!isLogin && (
                                    <motion.div 
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        exit={{ opacity: 0, height: 0 }}
                                        className="space-y-6 overflow-hidden"
                                    >
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Full Name</label>
                                            <div className="relative group">
                                                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                                                <input 
                                                    type="text" 
                                                    placeholder="John Doe" 
                                                    className="w-full pl-14 pr-5 py-3 bg-slate-50 border border-slate-100 rounded-[20px] focus:ring-4 focus:ring-black/5 outline-none transition-all font-medium"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Username</label>
                                            <div className="relative group">
                                                <UserCircle className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                                                <input 
                                                    type="text" 
                                                    placeholder="scholars_id" 
                                                    className="w-full pl-14 pr-5 py-3 bg-slate-50 border border-slate-100 rounded-[20px] focus:ring-4 focus:ring-black/5 outline-none transition-all font-medium"
                                                    value={formData.username}
                                                    onChange={(e) => setFormData({...formData, username: e.target.value.replace(/\s/g, '').toLowerCase()})}
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                                    <input 
                                        type="email" 
                                        placeholder="you@ritual.com" 
                                        className="w-full pl-14 pr-5 py-3 bg-slate-50 border border-slate-100 rounded-[20px] focus:ring-4 focus:ring-black/5 outline-none transition-all font-medium"
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            {!isLogin && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Authentication OTP</label>
                                    <div className="flex gap-4">
                                        <div className="relative flex-1 group">
                                            <Shield className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                                            <input 
                                                type="text" 
                                                placeholder="Enter Code" 
                                                className="w-full pl-14 pr-5 py-3 bg-slate-50 border border-slate-100 rounded-[20px] focus:ring-4 focus:ring-black/5 outline-none transition-all font-medium"
                                                value={formData.otp}
                                                onChange={(e) => setFormData({...formData, otp: e.target.value})}
                                                disabled={!otpSent}
                                                required={!isLogin}
                                            />
                                        </div>
                                        <button 
                                            type="button"
                                            onClick={handleSendOTP}
                                            disabled={loading || otpSent}
                                            className="px-6 py-3 bg-black text-white rounded-[20px] font-bold text-[10px] uppercase tracking-widest hover:bg-slate-800 transition-all disabled:opacity-50 flex items-center justify-center min-w-[120px] shadow-lg shadow-black/5 cursor-pointer"
                                        >
                                            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (otpSent ? "Verified" : "Get OTP")}
                                        </button>
                                    </div>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] ml-1">Secure Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-black transition-colors" />
                                    <input 
                                        type="password" 
                                        placeholder="••••••••" 
                                        className="w-full pl-14 pr-5 py-3 bg-slate-50 border border-slate-100 rounded-[20px] focus:ring-4 focus:ring-black/5 outline-none transition-all font-medium"
                                        value={formData.password}
                                        onChange={(e) => setFormData({...formData, password: e.target.value})}
                                        required
                                    />
                                </div>
                            </div>

                            <button 
                                disabled={loading || (!isLogin && !otpSent)}
                                type="submit"
                                className="group relative w-full flex items-center justify-center gap-4 bg-black text-white py-5 rounded-[24px] overflow-hidden transition-all hover:scale-[1.02] active:scale-95 shadow-xl shadow-black/10 mt-4 cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed disabled:scale-100"
                            >
                                <span className="relative z-10 font-bold tracking-[0.2em] text-[10px] uppercase">
                                    {isLogin ? "Login" : "Register Now"}
                                </span>
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin relative z-10" />
                                ) : (
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform relative z-10" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                            </button>
                        </form>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
