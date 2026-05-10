import { motion } from 'framer-motion';
import { Mail, MessageSquare, Globe, ArrowRight } from 'lucide-react';

const ContactPage = () => {
    return (
        <div className="min-h-screen bg-[#FDFDFD] pt-32 pb-20 px-6 relative overflow-hidden">
            {/* Geometric Accents */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-slate-50 rounded-full blur-[120px] -z-10 translate-x-1/2 -translate-y-1/2"></div>
            
            <div className="max-w-7xl mx-auto">
                <div className="grid lg:grid-cols-2 gap-20">
                    {/* Left Column - Headline */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                    >
                        <h1 className="text-sm font-bold uppercase tracking-[0.4em] text-slate-400 mb-6">Get In Touch</h1>
                        <h2 className="text-6xl font-black tracking-tighter text-slate-900 leading-none mb-8">
                            Start The <br />
                            <span className="text-slate-300">Conversation.</span>
                        </h2>
                        <p className="text-slate-500 text-sm font-medium leading-relaxed max-w-md uppercase tracking-wider mb-12">
                            Whether you're a scholar looking for resources or an author ready to publish, our team is here to ensure your journey is seamless. Reach out through any channel.
                        </p>

                        <div className="space-y-8">
                            {[
                                { icon: Mail, label: "Direct Support", detail: "support@notesvault.io" },
                                { icon: MessageSquare, label: "Live Chat", detail: "Available 24/7 for premium members" },
                                { icon: Globe, label: "Global Offices", detail: "London / New York / Mumbai" }
                            ].map((item, i) => (
                                <div key={i} className="flex items-center gap-6 group">
                                    <div className="w-12 h-12 bg-white border border-slate-100 rounded-2xl flex items-center justify-center text-slate-300 group-hover:bg-slate-900 group-hover:text-white transition-all shadow-sm">
                                        <item.icon className="w-5 h-5" />
                                    </div>
                                    <div>
                                        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">{item.label}</p>
                                        <p className="font-bold text-slate-900">{item.detail}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Right Column - Contact Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass-card p-12 bg-white/50 backdrop-blur-xl"
                    >
                        <form className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Full Name</label>
                                    <input type="text" placeholder="John Doe" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-slate-900/5 transition-all font-medium" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Email Address</label>
                                    <input type="email" placeholder="john@example.com" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-slate-900/5 transition-all font-medium" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Subject</label>
                                <select className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-slate-900/5 transition-all font-medium appearance-none">
                                    <option>General Inquiry</option>
                                    <option>Technical Support</option>
                                    <option>Partnership</option>
                                    <option>Other</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-400 ml-1">Your Message</label>
                                <textarea rows={5} placeholder="How can we help you?" className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-6 py-4 outline-none focus:ring-4 focus:ring-slate-900/5 transition-all font-medium"></textarea>
                            </div>
                            <button className="w-full btn-primary py-5 flex items-center justify-center gap-3 group">
                                Send Message <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </form>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default ContactPage;
