import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
    Plus, 
    Edit2, 
    Trash2, 
    Search, 
    BookOpen, 
    LayoutDashboard, 
    Loader2, 
    ArrowLeft,
    ExternalLink,
    Eye
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const AdminPortal = () => {
    const [notes, setNotes] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const { user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!user?.isAdmin) {
            navigate('/dashboard');
            return;
        }
        fetchNotes();
    }, [user, navigate]);

    const fetchNotes = async () => {
        try {
            const res = await api.get('/notes/all');
            if (res.data.success) {
                setNotes(res.data.notes);
            }
        } catch (error) {
            toast.error("Failed to fetch notes");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!window.confirm("Are you sure you want to delete this note? This will permanently remove the file from storage.")) return;
        
        try {
            const res = await api.delete(`/notes/delete/${id}`);
            if (res.data.success) {
                toast.success("Note deleted successfully");
                setNotes(notes.filter(n => n._id !== id));
            }
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const filteredNotes = notes.filter(note => 
        note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        note.subject.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="w-12 h-12 text-slate-200 animate-spin" />
            </div>
        );
    }

    return (
        <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                <div>
                    <div className="flex items-center gap-2 text-slate-400 mb-2 font-bold text-[10px] uppercase tracking-[0.2em]">
                        <LayoutDashboard className="w-3 h-3" /> Admin Control Center
                    </div>
                    <h1 className="text-4xl font-bold">Manage Notes</h1>
                </div>
                <Link to="/upload" className="btn-primary">
                    <Plus className="w-5 h-5" /> Add New Note
                </Link>
            </header>

            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <div className="glass-card p-6 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                        <BookOpen className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Total Notes</p>
                        <h3 className="text-2xl font-bold">{notes.length}</h3>
                    </div>
                </div>
                {/* Add more stats here if needed */}
            </div>

            {/* Search and Filters */}
            <div className="relative mb-8">
                <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input 
                    type="text" 
                    placeholder="Search by title or subject..." 
                    className="w-full glass-card py-5 pl-16 pr-8 bg-white border-none focus:ring-4 focus:ring-indigo-500/5 outline-none font-medium"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
            </div>

            {/* Notes Table */}
            <div className="glass-card overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-slate-50">
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Note Details</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Subject</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">Price</th>
                                <th className="px-8 py-5 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <AnimatePresence>
                                {filteredNotes.map((note) => (
                                    <motion.tr 
                                        key={note._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0, x: -20 }}
                                        className="hover:bg-slate-50/50 transition-colors group"
                                    >
                                        <td className="px-8 py-6">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-16 rounded-lg overflow-hidden bg-slate-100 flex-shrink-0 shadow-sm">
                                                    <img src={note.thumbnail} className="w-full h-full object-cover" alt="" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-slate-800 line-clamp-1">{note.title}</h4>
                                                    <p className="text-xs text-slate-400 font-medium">Pages: {note.totalPages}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="text-[10px] font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full uppercase tracking-widest">
                                                {note.subject}
                                            </span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <span className="font-bold text-slate-800">₹{note.price}</span>
                                        </td>
                                        <td className="px-8 py-6">
                                            <div className="flex items-center justify-end gap-2">
                                                <Link 
                                                    to={`/note/${note._id}`}
                                                    className="p-2 text-slate-400 hover:text-black hover:bg-slate-100 rounded-xl transition-all"
                                                    title="View Note"
                                                >
                                                    <Eye className="w-5 h-5" />
                                                </Link>
                                                <button 
                                                    onClick={() => navigate(`/upload`, { state: { editMode: true, note } })}
                                                    className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
                                                    title="Edit Note"
                                                >
                                                    <Edit2 className="w-5 h-5" />
                                                </button>
                                                <button 
                                                    onClick={() => handleDelete(note._id)}
                                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                                                    title="Delete Note"
                                                >
                                                    <Trash2 className="w-5 h-5" />
                                                </button>
                                            </div>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>
                {filteredNotes.length === 0 && (
                    <div className="py-20 text-center">
                        <BookOpen className="w-12 h-12 text-slate-100 mx-auto mb-4" />
                        <p className="text-slate-400 font-bold uppercase tracking-widest text-xs">No notes found matching your search</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminPortal;
