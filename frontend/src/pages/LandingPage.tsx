import { motion } from 'framer-motion';
import { BookOpen, Zap, Shield, Star, ArrowRight, ChevronLeft, ChevronRight, Users, IndianRupee } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import api from '../api/axios';

const LandingPage = () => {  
    const navigate = useNavigate();
    const scrollRef = useRef<HTMLDivElement>(null);
    const [notes, setNotes] = useState<any[]>([]);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollRef.current) {
            const { scrollLeft, clientWidth } = scrollRef.current;
            const scrollTo = direction === 'left' ? scrollLeft - clientWidth : scrollLeft + clientWidth;
            scrollRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
        }
    };

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await api.get('/notes/all');
                if (res.data.success) {
                    setNotes(res.data.notes.slice(0, 6)); // Show top 6
                }
            } catch (error) {
                console.error("Error fetching notes:", error);
            }
        };
        fetchNotes();
    }, []);

    return (
        <div className="min-h-screen bg-[#FDFDFD] selection:bg-black selection:text-white">
            {/* Hero Section */}
            <section className="relative min-h-screen md:h-screen flex flex-col pt-[100px] md:pt-0 px-4 md:px-6 overflow-hidden bg-white">
                <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:justify-between relative z-10 py-12 md:py-0 md:pt-[140px] md:pb-8">
                    {/* Top Headlines Row */}
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-start gap-8 text-center md:text-left shrink-0">
                        {/* Top Left Headline */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full md:w-auto"
                        >
                            <h1 className="text-3xl md:text-4xl font-bold uppercase text-slate-900 leading-tight">
                                Your Daily Ritual <br />
                                <span className="text-slate-400">Perfectly Crafted</span>
                            </h1>
                            <p className="text-slate-500 text-[10px] font-medium leading-relaxed mt-4 max-w-[320px] uppercase tracking-wider mx-auto md:mx-0">
                                Elevating academic excellence through precision-crafted knowledge exchanges. Every note is a blueprint for your future success.
                            </p>
                        </motion.div>

                        {/* Top Right Headline */}
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full md:w-auto md:text-right"
                        >
                            <h2 className="text-3xl md:text-4xl font-bold uppercase text-slate-300 leading-tight">
                                The Future of <br />
                                <span className="text-slate-900">Knowledge Exchange</span>
                            </h2>
                            <p className="text-slate-500 text-[10px] font-medium leading-relaxed mt-4 max-w-[320px] uppercase tracking-wider md:ml-auto">
                                A global ecosystem of shared insights. Join a community of dedicated scholars trading high-fidelity resources in real-time.
                            </p>
                        </motion.div>
                    </div>

                    {/* Center Image Stack (Responsive behavior) */}
                    <div className="relative flex-1 flex items-center justify-center my-12 md:my-0 min-h-[300px] md:min-h-0">
                        <div className="relative w-full h-full flex items-center justify-center scale-100 md:scale-115">
                            {/* Background images ONLY on desktop to prevent mobile layout break */}
                            <motion.img 
                                src="https://i.pinimg.com/1200x/f7/d3/88/f7d38819e47f16b144eb775aee1a882c.jpg" 
                                className="hidden md:block absolute w-[250%] h-[200%] object-contain rounded-3xl -rotate-[20deg] opacity-0 md:opacity-60"
                                animate={{ x: [-100, -300, -100], y: [40, 80, 40] }}
                                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.img 
                                src="https://i.pinimg.com/736x/e3/03/15/e303150e74e780ea9a8543394ef1a918.jpg" 
                                className="hidden md:block absolute w-[260%] h-[210%] object-contain rounded-3xl -rotate-12 opacity-50 md:opacity-70"
                                animate={{ x: [-50, -200, -50], y: [20, 64, 20] }}
                                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            />
                            <motion.img 
                                src="https://i.pinimg.com/736x/e2/e5/68/e2e5687b8e2f2bf44aa99823abf2c655.jpg" 
                                className="hidden md:block absolute w-[250%] h-[200%] object-contain rounded-3xl rotate-[20deg] opacity-0 md:opacity-60"
                                animate={{ x: [100, 300, 100], y: [40, 80, 40] }}
                                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.img 
                                src="https://i.pinimg.com/736x/be/8d/38/be8d38a77ae4e297845f721b599de52d.jpg" 
                                className="hidden md:block absolute w-[260%] h-[210%] object-contain rounded-3xl rotate-12 opacity-50 md:opacity-70"
                                animate={{ x: [50, 200, 50], y: [20, 64, 20] }}
                                transition={{ duration: 18, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                            />
                            {/* Main Center Image - Relative on mobile to maintain space, absolute on desktop */}
                            <motion.img 
                                src="https://i.pinimg.com/736x/0b/ce/25/0bce25aaed50981b7e0a51ab4d2b9c47.jpg" 
                                className="relative md:absolute w-full md:w-[75%] max-h-[40vh] md:max-h-[65vh] object-contain rounded-[24px] md:rounded-[32px] z-20"
                                animate={{ y: [15, 0, 15] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>
                    </div>

                    {/* Bottom Features Row (Responsive Stack) */}
                    <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-12 md:gap-0 shrink-0">
                        {/* Rating Component */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="flex flex-col items-center md:items-start gap-4"
                        >
                            <div className="flex -space-x-3">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm">
                                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-black flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                                    50k+
                                </div>
                            </div>
                            <div className="text-center md:text-left">
                                <p className="text-xl font-bold tracking-tighter text-slate-900 leading-none">Successful Students</p>
                                <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                                    <div className="flex text-yellow-400">
                                        {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 fill-current" />)}
                                    </div>
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">4.9 Student Rating</span>
                                </div>
                            </div>
                        </motion.div>

                        {/* CTA Section */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            className="text-center md:text-right flex flex-col items-center md:items-end gap-8"
                        >
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 max-w-[280px] md:max-w-[200px] leading-relaxed">
                                Handcrafted Notes Made From Carefully Selected Academic Resources
                            </p>
                            <Link to="/marketplace" className="group relative inline-flex items-center gap-4 bg-black text-white px-10 py-5 rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-xl shadow-black/10">
                                <span className="relative z-10 font-bold tracking-[0.2em] text-xs uppercase">Browse Collections</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                            </Link>
                        </motion.div>
                    </div>
                </div>

                {/* Floating Study Icons - Ritual Atmosphere (Scale/Hide for Mobile) */}
                <div className="absolute inset-0 overflow-hidden -z-10 pointer-events-none">
                    <motion.div 
                        animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 left-[5%] md:left-[15%] text-slate-100"
                    >
                        <BookOpen className="w-16 h-16 md:w-24 md:h-24 opacity-20 md:opacity-100" />
                    </motion.div>
                    <motion.div 
                        animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className="absolute bottom-1/4 right-[5%] md:right-[15%] text-slate-100"
                    >
                        <Zap className="w-20 h-20 md:w-32 md:h-32 opacity-20 md:opacity-100" />
                    </motion.div>
                    <motion.div 
                        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-50"
                    >
                        <div className="w-[300px] md:w-[800px] h-[300px] md:h-[800px] border border-slate-100 rounded-full flex items-center justify-center">
                            <div className="w-[200px] md:w-[600px] h-[200px] md:h-[600px] border border-slate-100 rounded-full flex items-center justify-center">
                                <div className="w-[100px] md:w-[400px] h-[100px] md:h-[400px] border border-slate-100 rounded-full"></div>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* University Trust Bar (Infinite Moving) */}
            <section className="py-12 border-y border-slate-100 bg-white/50 backdrop-blur-md relative z-40 overflow-hidden">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div 
                        animate={{ x: ['0%', '-50%'] }}
                        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                        className="flex items-center gap-24 whitespace-nowrap w-fit opacity-40 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700"
                    >
                        {/* Set 1 */}
                        <div className="flex items-center gap-24 pr-24">
                            {['STANFORD', 'MIT', 'HARVARD', 'OXFORD', 'YALE', 'CAMBRIDGE', 'PRINCETON', 'CALTECH'].map(uni => (
                                <span key={uni} className="text-xl font-black tracking-tighter text-slate-900">{uni}</span>
                            ))}
                        </div>
                        {/* Set 2 (Duplicate) */}
                        <div className="flex items-center gap-24 pr-24">
                            {['STANFORD', 'MIT', 'HARVARD', 'OXFORD', 'YALE', 'CAMBRIDGE', 'PRINCETON', 'CALTECH'].map(uni => (
                                <span key={uni + '-2'} className="text-xl font-black tracking-tighter text-slate-900">{uni}</span>
                            ))}
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Stats Section */}
            <section className="py-20 px-6 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { label: "Scholars Reached", value: "850k+", icon: Users, color: "from-blue-500 to-indigo-600" },
                            { label: "Community Rating", value: "4.9/5", icon: Star, color: "from-yellow-400 to-orange-500" },
                            { label: "Total Earnings", value: "₹2.4M+", icon: IndianRupee, color: "from-green-500 to-emerald-600" }
                        ].map((stat, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.1, duration: 0.8 }}
                                viewport={{ once: true }}
                                className="relative group"
                            >
                                <div className="absolute inset-0 bg-slate-50 rounded-[40px] scale-95 group-hover:scale-100 transition-transform duration-500 -z-10"></div>
                                <div className="p-12 text-center flex flex-col items-center">
                                    <div className={`w-16 h-16 rounded-2xl bg-gradient-to-tr ${stat.color} p-[1px] mb-8`}>
                                        <div className="w-full h-full bg-white rounded-[15px] flex items-center justify-center">
                                            <stat.icon className="w-6 h-6 text-slate-900" />
                                        </div>
                                    </div>
                                    <h2 className="text-6xl font-black tracking-tighter text-slate-900 mb-3">{stat.value}</h2>
                                    <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">{stat.label}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Trending Masterpieces */}
            <section className="py-24 px-4 md:px-6 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-4xl font-bold mb-2 tracking-tight">Trending Masterpieces</h2>
                            <p className="text-slate-500 font-medium tracking-wide">The most admired knowledge this week.</p>
                        </div>
                        <div className="flex gap-4">
                            <button 
                                onClick={() => scroll('left')}
                                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm active:scale-95"
                            >
                                <ChevronLeft className="w-6 h-6" />
                            </button>
                            <button 
                                onClick={() => navigate('/marketplace')}
                                className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center hover:bg-black hover:text-white transition-all shadow-sm active:scale-95"
                            >
                                <ChevronRight className="w-6 h-6" />
                            </button>
                        </div>
                    </div>

                    {notes.length > 0 ? (
                        <div 
                            ref={scrollRef}
                            className="flex md:grid md:grid-cols-5 overflow-x-auto md:overflow-x-visible gap-4 md:gap-6 pb-12 md:pb-0 snap-x snap-mandatory scrollbar-hide scroll-smooth no-scrollbar"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {notes.slice(0, 5).map((note) => (
                                <Link to={`/note/${note._id}`} key={note._id} className="min-w-[240px] md:min-w-0 snap-start">
                                    <motion.div whileHover={{ y: -10 }} className="group cursor-pointer">
                                        <div className="aspect-[4/5] rounded-[24px] overflow-hidden mb-4 relative shadow-xl">
                                            <img src={note.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={note.title} />
                                            <div className="absolute top-3 right-3 glass px-3 py-1 rounded-full text-xs font-bold text-black">₹{note.price}</div>
                                        </div>
                                        <div className="flex items-center gap-2 mb-2">
                                            <div className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center text-[7px] text-white font-bold uppercase tracking-tighter">NV</div>
                                            <span className="text-[9px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full">{note.subject}</span>
                                        </div>
                                        <h3 className="text-base font-bold mb-1 group-hover:text-slate-700 transition-colors line-clamp-1">{note.title}</h3>
                                        <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400">
                                            <span className="flex items-center gap-1"><Star className="w-2.5 h-2.5 fill-current text-yellow-400" /> 4.9</span>
                                            <span>Verified</span>
                                        </div>
                                    </motion.div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="py-20 text-center glass-card bg-slate-50/50"
                        >
                            <BookOpen className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                            <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No notes available now</p>
                        </motion.div>
                    )}
                </div>
            </section>



            {/* Footer */}
            <footer className="bg-slate-50 pt-24 pb-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-20">
                        <div className="md:col-span-1">
                            <h2 className="text-2xl font-black mb-6">NotesVault</h2>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6">Elevating learning through high-fidelity knowledge exchange. The world's most trusted marketplace for premium notes.</p>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:bg-black hover:text-white transition-all"><BookOpen className="w-5 h-5" /></div>
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:bg-black hover:text-white transition-all"><Zap className="w-5 h-5" /></div>
                                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm cursor-pointer hover:bg-black hover:text-white transition-all"><Shield className="w-5 h-5" /></div>
                            </div>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6">Platform</h4>
                            <ul className="space-y-4 text-sm font-medium text-slate-500">
                                <li><Link to="/marketplace" className="hover:text-black">Marketplace</Link></li>
                                <li><Link to="/upload" className="hover:text-black">Sell Notes</Link></li>
                                <li><Link to="/dashboard" className="hover:text-black">Learning Hub</Link></li>
                                <li className="hover:text-black cursor-pointer">Study Rooms</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6">Support</h4>
                            <ul className="space-y-4 text-sm font-medium text-slate-500">
                                <li className="hover:text-black cursor-pointer">Help Center</li>
                                <li className="hover:text-black cursor-pointer">Terms of Service</li>
                                <li className="hover:text-black cursor-pointer">Privacy Policy</li>
                                <li className="hover:text-black cursor-pointer">Copyright Info</li>
                            </ul>
                        </div>
                        <div>
                            <h4 className="font-bold mb-6">Newsletter</h4>
                            <p className="text-slate-500 text-sm mb-6">Stay updated on the latest trending notes and academic tips.</p>
                            <div className="flex gap-2">
                                <input type="email" placeholder="Email address" className="flex-1 bg-white border border-slate-200 rounded-xl px-4 text-sm outline-none focus:ring-2 focus:ring-black/5" />
                                <button className="p-3 bg-black text-white rounded-xl hover:bg-slate-800 transition-all"><ArrowRight className="w-5 h-5" /></button>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-slate-200 pt-8 flex flex-col md:row items-center justify-between gap-4">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">© 2026 NotesVault. Knowledge Centralized.</p>
                        <div className="flex gap-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            <span className="hover:text-black cursor-pointer">Global Community</span>
                            <span className="hover:text-black cursor-pointer">Terms of Service</span>
                            <span className="hover:text-black cursor-pointer">Privacy Policy</span>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;
