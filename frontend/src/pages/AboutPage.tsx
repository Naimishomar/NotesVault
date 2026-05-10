import { motion } from 'framer-motion';
import { BookOpen, Zap, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    return (
        <div className="min-h-screen bg-[#FDFDFD] pt-32 pb-20 px-6 overflow-hidden relative">
            {/* Background Ritual Elements */}
            <motion.div 
                animate={{ scale: [1, 1.1, 1], opacity: [0.05, 0.1, 0.05] }}
                transition={{ duration: 5, repeat: Infinity }}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 -z-10"
            >
                <div className="w-[1000px] h-[1000px] border border-slate-200 rounded-full flex items-center justify-center">
                    <div className="w-[800px] h-[800px] border border-slate-200 rounded-full flex items-center justify-center">
                        <div className="w-[600px] h-[600px] border border-slate-200 rounded-full"></div>
                    </div>
                </div>
            </motion.div>

            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-20 items-center">
                    {/* Left Column - Hero Content */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-sm font-bold uppercase tracking-[0.4em] text-slate-400 mb-6">Our Philosophy</h1>
                        <h2 className="text-6xl font-black tracking-tighter text-slate-900 leading-none mb-8">
                            Curating The <br />
                            <span className="text-slate-300">Intellectual</span> <br />
                            Vault.
                        </h2>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-md uppercase tracking-wider mb-10">
                            NotesVault was born from a simple observation: knowledge is the most valuable currency in the modern world. We built a high-fidelity ecosystem where premium insights are shared, traded, and elevated.
                        </p>
                        <div className="flex gap-12">
                            <div>
                                <h3 className="text-4xl font-bold mb-1">50k+</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Scholars</p>
                            </div>
                            <div>
                                <h3 className="text-4xl font-bold mb-1">850k</h3>
                                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Exchanges</p>
                            </div>
                        </div>
                    </motion.div>

                    {/* Right Column - Visual Stack */}
                    <div className="relative aspect-square">
                        <motion.div 
                            animate={{ y: [0, -20, 0] }}
                            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                            className="absolute inset-0 flex items-center justify-center"
                        >
                            <div className="relative w-full h-full flex items-center justify-center">
                                {/* Overlapping Editorial Cards */}
                                <div className="absolute w-[60%] h-[80%] bg-slate-900 rounded-[40px] rotate-[-6deg] shadow-2xl flex items-end p-8 overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full"></div>
                                    <p className="text-white font-bold text-lg leading-tight relative z-10">High Fidelity <br /> Knowledge.</p>
                                </div>
                                <div className="absolute w-[60%] h-[80%] bg-white border border-slate-100 rounded-[40px] rotate-[6deg] shadow-2xl flex flex-col justify-between p-8">
                                    <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-slate-300" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-xl mb-2">Verified Content</h4>
                                        <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">Meticulously Curated</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {/* Values Section */}
                <div className="mt-32 grid md:grid-cols-3 gap-12">
                    {[
                        { title: "Precision", icon: Zap, desc: "Every byte of information is verified for accuracy and clarity." },
                        { title: "Community", icon: BookOpen, desc: "A peer-to-peer ecosystem built on shared academic success." },
                        { title: "Security", icon: Shield, desc: "Your intellectual property and transactions are guarded with encryption." }
                    ].map((value, i) => (
                        <motion.div 
                            key={i}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.2 }}
                            className="glass-card p-10 group hover:bg-slate-900 transition-colors duration-500"
                        >
                            <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-300 mb-8 group-hover:bg-slate-800 transition-colors">
                                <value.icon className="w-8 h-8" />
                            </div>
                            <h4 className="text-xl font-bold mb-4 group-hover:text-white transition-colors">{value.title}</h4>
                            <p className="text-slate-500 text-sm leading-relaxed group-hover:text-slate-400 transition-colors">
                                {value.desc}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AboutPage;
