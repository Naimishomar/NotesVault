import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { Mail, Lock, User, UserCircle, ArrowRight, Loader2 } from 'lucide-react';

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
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute top-0 right-0 w-96 h-96 bg-purple-200 rounded-full blur-3xl opacity-20 -mr-20 -mt-20"></div>
            <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-200 rounded-full blur-3xl opacity-20 -ml-20 -mb-20"></div>

            <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-5xl w-full glass rounded-[40px] overflow-hidden flex flex-col md:flex-row shadow-2xl min-h-[650px]"
            >
                {/* Visual Side */}
                <div className="w-full md:w-1/2 bg-gradient-to-br from-slate-900 via-slate-800 to-black p-12 text-white flex flex-col justify-between relative overflow-hidden">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center text-2xl font-bold mb-8">N</div>
                        <h2 className="text-4xl font-bold mb-4 leading-tight">
                            {isLogin ? "Welcome Back to NotesVault" : "Join the Future of Learning"}
                        </h2>
                        <p className="text-slate-300 leading-relaxed max-w-xs">
                            {isLogin 
                                ? "Access your library of premium notes and continue your journey to excellence." 
                                : "Start your journey today and get access to thousands of premium study materials."}
                        </p>
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center gap-4 mb-8">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map(i => <img key={i} src={`https://i.pravatar.cc/100?u=${i+10}`} className="w-10 h-10 rounded-full border-2 border-white/20" />)}
                            </div>
                            <span className="text-sm font-medium text-slate-300">Joined by 500+ students today</span>
                        </div>
                    </div>

                    {/* Animated Shapes */}
                    <motion.div 
                        animate={{ rotate: 360 }} 
                        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                        className="absolute -right-20 top-20 w-64 h-64 border-8 border-white/5 rounded-[60px]"
                    />
                    <motion.div 
                        animate={{ y: [0, 50, 0] }} 
                        transition={{ duration: 10, repeat: Infinity }}
                        className="absolute -left-10 bottom-20 w-40 h-40 bg-white/5 rounded-full"
                    />
                </div>

                {/* Form Side */}
                <div className="w-full md:w-1/2 p-12 bg-white flex flex-col justify-center">
                    <div className="mb-10 text-center md:text-left">
                        <h3 className="text-2xl font-bold mb-2">{isLogin ? "Sign In" : "Create Account"}</h3>
                        <p className="text-slate-500 text-sm">
                            {isLogin ? "New here?" : "Already have an account?"} 
                            <button 
                                onClick={() => {setIsLogin(!isLogin); setOtpSent(false);}}
                                className="text-black font-bold ml-1 hover:underline"
                            >
                                {isLogin ? "Create an account" : "Sign in instead"}
                            </button>
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <AnimatePresence mode="wait">
                            {!isLogin && (
                                <motion.div 
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    className="space-y-5"
                                >
                                    <div className="relative">
                                        <User className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Full Name" 
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                            value={formData.name}
                                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                                            required
                                        />
                                    </div>
                                    <div className="relative">
                                        <UserCircle className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                        <input 
                                            type="text" 
                                            placeholder="Username" 
                                            className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-black/10 outline-none transition-all"
                                            value={formData.username}
                                            onChange={(e) => setFormData({...formData, username: e.target.value.replace(/\s/g, '').toLowerCase()})}
                                            required
                                        />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>

                        <div className="relative">
                            <Mail className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                            <input 
                                type="email" 
                                placeholder="Email Address" 
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                value={formData.email}
                                onChange={(e) => setFormData({...formData, email: e.target.value})}
                                required
                            />
                        </div>

                        {!isLogin && (
                            <div className="flex gap-3">
                                <div className="relative flex-1">
                                    <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                    <input 
                                        type="text" 
                                        placeholder="OTP" 
                                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
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
                                    className="px-6 py-3 bg-black text-white rounded-2xl font-bold text-sm hover:bg-slate-900 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center min-w-[110px]"
                                >
                                    {loading ? (
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                    ) : (
                                        otpSent ? "Sent" : "Get OTP"
                                    )}
                                </button>
                            </div>
                        )}

                        <div className="relative">
                            <Lock className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                            <input 
                                type="password" 
                                placeholder="Password" 
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                                value={formData.password}
                                onChange={(e) => setFormData({...formData, password: e.target.value})}
                                required
                            />
                        </div>

                        {(isLogin || otpSent) && (
                            <button 
                                disabled={loading}
                                className="w-full btn-primary py-4 flex items-center justify-center gap-2 group"
                            >
                                {loading ? (
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                ) : (
                                    <>
                                        {isLogin ? "Sign In" : "Register Now"}
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        )}
                    </form>
                </div>
            </motion.div>
        </div>
    );
};

export default AuthPage;
