import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
    Upload, 
    FileText, 
    IndianRupee, 
    Type, 
    FileUp, 
    Loader2, 
    ArrowLeft, 
    Image as ImageIcon,
    BookOpen,
    CheckCircle2
} from 'lucide-react';
import api from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate, useLocation } from 'react-router-dom';

const UploadNote = () => {
    const [loading, setLoading] = useState(false);
    const [file, setFile] = useState<File | null>(null);
    const [thumbnail, setThumbnail] = useState<File | null>(null);
    const location = useLocation();
    const navigate = useNavigate();
    const editMode = location.state?.editMode || false;
    const existingNote = location.state?.note || null;

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        price: '',
        totalPages: '',
        subject: ''
    });

    useEffect(() => {
        if (editMode && existingNote) {
            setFormData({
                title: existingNote.title,
                description: existingNote.description,
                price: existingNote.price.toString(),
                totalPages: existingNote.totalPages.toString(),
                subject: existingNote.subject || ''
            });
        }
    }, [editMode, existingNote]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation: Files are only required in create mode
        if (!editMode) {
            if (!file) return toast.error("Please select a PDF file");
            if (!thumbnail) return toast.error("Please upload a thumbnail image");
        }

        setLoading(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('totalPages', formData.totalPages);
        data.append('subject', formData.subject);
        
        if (file) data.append('pdf', file);
        if (thumbnail) data.append('thumbnail', thumbnail);

        try {
            const url = editMode ? `/notes/update/${existingNote._id}` : '/notes/upload';
            const method = editMode ? 'put' : 'post';
            
            const res = await api[method](url, data, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            if (res.data.success) {
                toast.success(editMode ? "Note updated successfully!" : "Note uploaded successfully!");
                navigate('/admin');
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Operation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="pt-32 pb-20 px-6 max-w-3xl mx-auto">
            <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-slate-500 hover:text-indigo-600 mb-8 font-bold transition-colors">
                <ArrowLeft className="w-5 h-5" /> Back to Portal
            </button>

            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-10 relative overflow-hidden"
            >
                {/* Visual Accent */}
                <div className={`absolute top-0 left-0 w-full h-2 ${editMode ? 'bg-blue-500' : 'bg-indigo-600'}`}></div>

                <div className="text-center mb-10">
                    <div className={`w-16 h-16 ${editMode ? 'bg-blue-50' : 'bg-indigo-50'} ${editMode ? 'text-blue-600' : 'text-indigo-600'} rounded-2xl flex items-center justify-center mx-auto mb-4`}>
                        {editMode ? <BookOpen className="w-8 h-8" /> : <Upload className="w-8 h-8" />}
                    </div>
                    <h1 className="text-3xl font-bold mb-2">{editMode ? 'Update Note Details' : 'Upload New Note'}</h1>
                    <p className="text-slate-500">{editMode ? `Editing: ${existingNote?.title}` : 'Share your knowledge with the student community.'}</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Note Title</label>
                        <div className="relative">
                            <Type className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="e.g. Advanced Calculus - Unit 1" 
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10"
                                value={formData.title}
                                onChange={(e) => setFormData({...formData, title: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Description</label>
                        <textarea 
                            placeholder="What's inside this note?" 
                            rows={4}
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 resize-none"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700 ml-1">Subject / Topic</label>
                        <div className="relative">
                            <BookOpen className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                            <input 
                                type="text" 
                                placeholder="e.g. Mathematics, History, Physics" 
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10"
                                value={formData.subject}
                                onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                required
                            />
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Price (INR)</label>
                            <div className="relative">
                                <IndianRupee className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                <input 
                                    type="number" 
                                    placeholder="49" 
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10"
                                    value={formData.price}
                                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">Total Pages</label>
                            <div className="relative">
                                <FileText className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                <input 
                                    type="number" 
                                    placeholder="e.g. 42" 
                                    className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10"
                                    value={formData.totalPages}
                                    onChange={(e) => setFormData({...formData, totalPages: e.target.value})}
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">
                                {editMode ? 'Update PDF (Optional)' : 'Upload PDF'}
                            </label>
                            <div className="relative">
                                <FileUp className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                <input 
                                    type="file" 
                                    accept=".pdf"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 file:hidden cursor-pointer"
                                    required={!editMode}
                                />
                                <span className="absolute right-4 top-3.5 text-[10px] font-bold text-slate-400 uppercase">
                                    {file ? file.name : (editMode ? "Keep current" : "Select PDF")}
                                </span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-bold text-slate-700 ml-1">
                                {editMode ? 'Update Thumbnail (Optional)' : 'Note Thumbnail'}
                            </label>
                            <div className="relative">
                                <ImageIcon className="absolute left-4 top-3.5 w-5 h-5 text-slate-400" />
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                                    className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 file:hidden cursor-pointer"
                                    required={!editMode}
                                />
                                <span className="absolute right-4 top-3.5 text-[10px] font-bold text-slate-400 uppercase">
                                    {thumbnail ? thumbnail.name : (editMode ? "Keep current" : "Select Image")}
                                </span>
                            </div>
                        </div>
                    </div>

                    <button 
                        disabled={loading}
                        className={`w-full py-4 flex items-center justify-center gap-2 mt-8 rounded-2xl font-bold transition-all active:scale-[0.98] ${editMode ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200' : 'btn-primary'}`}
                    >
                        {loading ? (
                            <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                            <>
                                {editMode ? 'Save Changes' : 'Upload & Publish'} 
                                {editMode ? <CheckCircle2 className="w-5 h-5" /> : <Upload className="w-5 h-5" />}
                            </>
                        )}
                    </button>
                </form>
            </motion.div>
        </div>
    );
};

export default UploadNote;
