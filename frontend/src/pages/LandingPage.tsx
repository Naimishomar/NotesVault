import { motion } from 'framer-motion';
import { BookOpen, Zap, Shield, Star, ArrowRight, IndianRupee, Users } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axios';

const LandingPage = () => {
    const [notes, setNotes] = useState<any[]>([]);

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
            <section className="relative min-h-screen flex flex-col pt-[140px] px-6 overflow-hidden">
                <div className="max-w-7xl mx-auto w-full relative">
                    {/* Top Headlines Row */}
                    <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-4 z-50 relative">
                        {/* Top Left Headline */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-left pt-2"
                        >
                            <h1 className="text-4xl font-bold uppercase text-slate-900">
                                Your Daily Ritual <br />
                                <span className="text-slate-400">Perfectly Crafted</span>
                            </h1>
                            <p className="text-slate-500 text-[10px] font-medium leading-relaxed mt-4 max-w-[320px] uppercase tracking-wider">
                                Elevating academic excellence through precision-crafted knowledge exchanges. Every note is a blueprint for your future success, meticulously curated to ensure clarity, depth, and total mastery over complex subjects.
                            </p>
                        </motion.div>

                        {/* Top Right Headline */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="text-right pt-2"
                        >
                            <h2 className="text-4xl font-bold uppercase text-slate-300">
                                The Future of <br />
                                <span className="text-slate-900">Knowledge Exchange</span>
                            </h2>
                            <p className="text-slate-500 text-[10px] font-medium leading-relaxed mt-4 max-w-[320px] uppercase tracking-wider ml-auto">
                                A global ecosystem of shared insights. Join a community of dedicated scholars trading high-fidelity resources in real-time, transforming the way we consume and distribute academic wisdom.
                            </p>
                        </motion.div>
                    </div>

                    {/* Floating Study Icons - Ritual Atmosphere */}
                    <motion.div 
                        animate={{ y: [0, -15, 0], rotate: [0, 10, 0] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/4 left-[15%] text-slate-100 -z-10"
                    >
                        <BookOpen className="w-24 h-24" />
                    </motion.div>
                    <motion.div 
                        animate={{ y: [0, 15, 0], rotate: [0, -10, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                        className="absolute bottom-1/4 right-[15%] text-slate-100 -z-10"
                    >
                        <Zap className="w-32 h-32" />
                    </motion.div>
                    <motion.div 
                        animate={{ scale: [1, 1.1, 1], opacity: [0.1, 0.2, 0.1] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-slate-50 -z-20"
                    >
                        <div className="w-[800px] h-[800px] border border-slate-100 rounded-full flex items-center justify-center">
                            <div className="w-[600px] h-[600px] border border-slate-100 rounded-full flex items-center justify-center">
                                <div className="w-[400px] h-[400px] border border-slate-100 rounded-full"></div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Center Image Stack (ANIMATED MASSIVE) */}
                    <div className="flex-1 relative flex items-center justify-center mt-12 z-10">
                        <div className="relative w-full h-full flex items-center justify-center">
                            <motion.img 
                                src="https://i.pinimg.com/1200x/f7/d3/88/f7d38819e47f16b144eb775aee1a882c.jpg" 
                                className="absolute w-[90%] max-h-[65vh] object-contain rounded-3xl -rotate-[20deg]"
                                animate={{ x: [-40, -224, -40], y: [80, 80, 80] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.img 
                                src="https://i.pinimg.com/736x/e3/03/15/e303150e74e780ea9a8543394ef1a918.jpg" 
                                className="absolute w-[95%] max-h-[70vh] object-contain rounded-3xl -rotate-12"
                                animate={{ x: [-20, -160, -20], y: [64, 64, 64] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.img 
                                src="https://i.pinimg.com/736x/e2/e5/68/e2e5687b8e2f2bf44aa99823abf2c655.jpg" 
                                className="absolute w-[90%] max-h-[65vh] object-contain rounded-3xl rotate-[20deg]"
                                animate={{ x: [40, 224, 40], y: [80, 80, 80] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.img 
                                src="https://i.pinimg.com/736x/be/8d/38/be8d38a77ae4e297845f721b599de52d.jpg" 
                                className="absolute w-[95%] max-h-[70vh] object-contain rounded-3xl rotate-12"
                                animate={{ x: [20, 160, 20], y: [64, 64, 64] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            />
                            <motion.img 
                                src="https://i.pinimg.com/736x/0b/ce/25/0bce25aaed50981b7e0a51ab4d2b9c47.jpg" 
                                className="absolute w-[100%] max-h-[85vh] object-contain rounded-[40px] z-20"
                                animate={{ y: [40, 20, 40] }}
                                transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                            />
                        </div>
                    </div>

                    {/* Bottom Features Row (Static) */}
                    <div className="flex justify-between items-end mt-20 pb-12 z-50 relative">
                        {/* Rating Component */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex flex-col gap-4"
                        >
                            <div className="flex -space-x-3">
                                {[1,2,3,4].map(i => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden shadow-sm hover:translate-y-[-2px] transition-transform">
                                        <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-full h-full object-cover" />
                                    </div>
                                ))}
                                <div className="w-10 h-10 rounded-full border-2 border-white bg-black flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                                    50k+
                                </div>
                            </div>
                            <div>
                                <p className="text-xl font-bold tracking-tighter text-slate-900 leading-none">Successful Students</p>
                                <div className="flex items-center gap-2 mt-1">
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
                            animate={{ opacity: 1, y: 0 }}
                            className="text-right flex flex-col items-end gap-6"
                        >
                            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 max-w-[200px]">
                                Handcrafted Notes Made From Carefully Selected Academic Resources
                            </p>
                            <Link to="/marketplace" className="group relative inline-flex items-center gap-4 bg-black text-white px-8 py-4 rounded-full overflow-hidden transition-all hover:pr-12">
                                <span className="relative z-10 font-bold tracking-widest text-xs uppercase">Browse Notes</span>
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-2 transition-transform" />
                                <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                            </Link>
                        </motion.div>
                    </div>
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
            <section className="py-6 px-6 bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-4xl font-bold mb-2">Trending Masterpieces</h2>
                            <p className="text-slate-500">The most admired knowledge this week.</p>
                        </div>
                    </div>

                    {notes.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {notes.map((note, i) => (
                                <Link to={`/note/${note._id}`} key={note._id}>
                                    <motion.div whileHover={{ y: -10 }} className="group cursor-pointer">
                                        <div className="aspect-[4/5] rounded-[32px] overflow-hidden mb-6 relative shadow-2xl">
                                            <img src={note.thumbnail} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={note.title} />
                                            <div className="absolute top-4 right-4 glass px-4 py-2 rounded-full text-sm font-bold text-black">₹{note.price}</div>
                                        </div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-6 h-6 rounded-full bg-slate-900 flex items-center justify-center text-[8px] text-white font-bold">N</div>
                                            <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest bg-indigo-50 px-2 py-0.5 rounded-full">{note.subject}</span>
                                        </div>
                                        <h3 className="text-xl font-bold mb-2 group-hover:text-slate-700 transition-colors">{note.title}</h3>
                                        <div className="flex items-center gap-4 text-xs font-bold text-slate-400">
                                            <span className="flex items-center gap-1"><Star className="w-3 h-3 fill-current text-yellow-400" /> 4.9</span>
                                            <span>Verified Content</span>
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
