import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Book, Star} from 'lucide-react';
import api from '../api/axios';
import { Link } from 'react-router-dom';
 
const Marketplace = () => {
    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const { data } = await api.get('/notes/all');
                if (data.success) setNotes(data.notes);
            } catch (error) {
                console.error("Failed to fetch notes");
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, []);

    const categories = ["All", ...new Set(notes.map(n => n.subject))].filter(Boolean);

    const filteredNotes = notes.filter(note => 
        (note.title.toLowerCase().includes(search.toLowerCase()) || 
         note.subject?.toLowerCase().includes(search.toLowerCase())) && 
        (category === "All" || note.subject === category)
    );

    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-4 tracking-tighter">Discovery Marketplace</h1>
                <p className="text-slate-500 font-medium">Explore the best premium notes curated by experts and top students.</p>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 items-center justify-between">
                <div className="relative w-full md:w-96 group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-500 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Search by title, subject or author..." 
                        className="w-full pl-16 pr-6 py-4 bg-white border border-slate-100 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 outline-none transition-all font-medium"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-4 w-full md:w-auto overflow-hidden">
                    <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`px-6 py-3 rounded-2xl text-xs font-bold uppercase tracking-widest transition-all whitespace-nowrap ${category === cat ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-white border border-slate-100 text-slate-400 hover:text-indigo-600 hover:bg-slate-50'}`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Grid */}
            {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-[500px] bg-slate-50 animate-pulse rounded-[40px]"></div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
                    <AnimatePresence mode="popLayout">
                        {filteredNotes.map((note: any, i) => (
                            <motion.div
                                key={note._id}
                                layout
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ delay: i * 0.05 }}
                                className="group"
                            >
                                <Link to={`/note/${note._id}`}>
                                    <div className="glass-card h-full p-4 flex flex-col border-white/50 bg-white/40 hover:bg-white/60 transition-all duration-500">
                                        <div className="relative aspect-[3/4] rounded-3xl overflow-hidden mb-6 shadow-2xl group-hover:shadow-indigo-200/50 transition-all duration-500">
                                            <img 
                                                src={note.thumbnail} 
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                                                alt={note.title} 
                                            />

                                            <div className="absolute top-6 right-6 px-4 py-2 bg-white text-indigo-600 rounded-2xl text-sm font-bold shadow-2xl border border-indigo-50">
                                                ₹{note.price}
                                            </div>
                                        </div>

                                        <div className="px-2">
                                            <div className="flex items-center gap-2 mb-4">
                                                <div className="w-6 h-6 bg-slate-900 rounded-full flex items-center justify-center text-[8px] font-bold text-white">N</div>
                                                <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-[0.2em] bg-indigo-50 px-2.5 py-1 rounded-full">
                                                    {note.subject}
                                                </span>
                                            </div>
                                            <h3 className="font-bold text-xl mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors leading-tight">{note.title}</h3>
                                            <p className="text-slate-400 text-sm mb-6 line-clamp-2 font-medium leading-relaxed">{note.description}</p>
                                            
                                            <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-5">
                                                <div className="flex items-center gap-1.5">
                                                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                                                    <span className="text-sm font-bold text-slate-700">Premium</span>
                                                </div>
                                                <div className="flex items-center gap-2 text-slate-400">
                                                    <div className="flex items-center gap-1.5">
                                                        <Book className="w-4 h-4" />
                                                        <span className="text-xs font-bold">{note.totalPages} Pages</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
            {filteredNotes.length === 0 && !loading && (
                <div className="py-32 text-center">
                    <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto mb-6">
                        <Search className="w-8 h-8 text-slate-200" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">No notes found</h3>
                    <p className="text-slate-400 max-w-xs mx-auto">We couldn't find any notes matching your current filters. Try a different search term.</p>
                </div>
            )}
        </div>
    );
};

export default Marketplace;
