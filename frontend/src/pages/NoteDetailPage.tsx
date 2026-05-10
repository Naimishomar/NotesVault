import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
    Download, 
    FileText, 
    ArrowLeft,
    ShoppingBag,
    ShieldCheck,
    Loader2
} from 'lucide-react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const NoteDetailPage = () => {
    const { id } = useParams();
    const [note, setNote] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [buying, setBuying] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);
    const { user, refreshProfile } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNote = async () => {
            try {
                // In a real app, we'd have a specific endpoint for single note
                const { data } = await api.get('/notes/all');
                if (data.success) {
                    const foundNote = data.notes.find((n: any) => n._id === id);
                    setNote(foundNote);
                }
            } catch (error) {
                toast.error("Failed to load note details");
            } finally {
                setLoading(false);
            }
        };
        fetchNote();
    }, [id]);

    const handleBuy = async () => {
        if (!user) {
            toast.error("Please login to purchase");
            return navigate('/auth');
        }

        setBuying(true);
        try {
            // 1. Create order on backend
            const { data: orderData } = await api.post('/purchase/create-order', { noteId: note._id });
            
            if (orderData.success) {
                const options = {
                    key: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_RipeosWeZjGxlD',
                    amount: orderData.order.amount,
                    currency: "INR",
                    name: "NotesVault",
                    description: `Purchase ${note.title}`,
                    order_id: orderData.order.id,
                    handler: async function (response: any) {
                        // 2. Verify payment on backend
                        try {
                            const { data: verifyData } = await api.post('/purchase/verify-payment', {
                                razorpay_order_id: response.razorpay_order_id,
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_signature: response.razorpay_signature
                            });

                            if (verifyData.success) {
                                toast.success("Payment successful! Note added to your profile.");
                                await refreshProfile();
                                navigate('/dashboard');
                            }
                        } catch (error) {
                            toast.error("Payment verification failed");
                        }
                    },
                    prefill: {
                        name: user.name,
                        email: user.email
                    },
                    theme: { color: "#6366f1" }
                };

                const rzp = new (window as any).Razorpay(options);
                rzp.open();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Purchase failed");
        } finally {
            setBuying(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        </div>
    );

    if (!note) return <div className="pt-40 text-center">Note not found</div>;

    const isPurchased = user?.purchases?.some((p: any) => p.note?._id === note._id || p.note === note._id);

    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <button 
                onClick={() => navigate(-1)} 
                className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 transition-colors mb-10 group"
            >
                <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" /> Back to Marketplace
            </button>

            <div className="grid lg:grid-cols-12 gap-12">
                {/* Preview Side */}
                <div className="lg:col-span-7">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="glass-card p-2 aspect-[4/5] relative overflow-hidden"
                    >
                        <img 
                            src={note.thumbnail} 
                            className="w-full h-full object-cover rounded-[20px]" 
                            alt={note.title}
                        />
                    </motion.div>
                </div>

                {/* Info Side */}
                <div className="lg:col-span-5">
                    <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="sticky top-32"
                    >
                        <div className="flex items-center gap-2 mb-6">
                            <span className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded-lg text-xs font-bold uppercase tracking-widest">{note.subject}</span>
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-xs font-bold uppercase tracking-widest">Verified Content</span>
                        </div>
                        
                        <h1 className="text-4xl font-bold mb-4 leading-tight">{note.title}</h1>
                        
                        <div className="flex items-center gap-6 mb-8">
                            <div className="flex items-center gap-2 text-slate-500">
                                <FileText className="w-5 h-5" />
                                <span className="text-sm font-medium">{note.totalPages || 0} Pages</span>
                            </div>
                        </div>

                        <div className="relative">
                            <div className={`text-slate-600 leading-relaxed text-lg transition-all duration-300 ${!isExpanded ? 'line-clamp-3' : 'max-h-[300px] overflow-y-auto pr-4 custom-scrollbar'}`}>
                                {note.description}
                            </div>
                            {note.description.length > 150 && (
                                <button 
                                    onClick={() => setIsExpanded(!isExpanded)}
                                    className="text-indigo-600 font-bold text-sm mt-4 hover:text-indigo-700 transition-colors flex items-center gap-1 cursor-pointer"
                                >
                                    {isExpanded ? 'Show Less' : 'Show More'}
                                </button>
                            )}
                        </div>

                        <div className="glass-card bg-slate-50/50 p-8 mb-10">
                            <div className="flex items-end justify-between mb-8">
                                <div>
                                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-1">One-time payment</p>
                                    <h2 className="text-5xl font-bold text-slate-900">₹{note.price}</h2>
                                </div>
                            </div>

                            {isPurchased ? (
                                <button 
                                    className="w-full btn-primary py-5 flex items-center justify-center gap-3"
                                    onClick={() => window.open(note.url, '_blank')}
                                >
                                    <Download className="w-6 h-6" /> Download Now
                                </button>
                            ) : (
                                <button 
                                    disabled={buying}
                                    onClick={handleBuy}
                                    className="w-full btn-primary py-5 flex items-center justify-center gap-3 relative overflow-hidden group"
                                >
                                    {buying ? (
                                        <Loader2 className="w-6 h-6 animate-spin" />
                                    ) : (
                                        <>
                                            <ShoppingBag className="w-6 h-6 group-hover:scale-110 transition-transform" /> 
                                            Buy Note Now
                                        </>
                                    )}
                                </button>
                            )}
                            
                            <p className="text-[10px] text-center text-slate-400 mt-6 font-medium flex items-center justify-center gap-1 uppercase tracking-widest">
                                <ShieldCheck className="w-3 h-3" /> Secure checkout powered by Razorpay
                            </p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default NoteDetailPage;
