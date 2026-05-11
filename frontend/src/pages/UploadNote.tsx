import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
    CheckCircle2,
    ChevronDown,
    Check
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
        subject: [] as string[]
    });

    useEffect(() => {
        if (editMode && existingNote) {
            setFormData({
                title: existingNote.title,
                description: existingNote.description,
                price: existingNote.price.toString(),
                totalPages: existingNote.totalPages.toString(),
                subject: Array.isArray(existingNote.subject) ? existingNote.subject : [existingNote.subject].filter(Boolean)
            });
        }
    }, [editMode, existingNote]);

    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const categories = [
        "JEE", "NEET", "Btech", "Mtech", "MBBS", 
        "Class 10", "Class 12", "CUET", "UPSC", 
        "GATE", "CAT", "LAW", "Commerce", "Arts", "Science", "Other"
    ];

    const toggleCategory = (cat: string) => {
        setFormData(prev => {
            const current = Array.isArray(prev.subject) ? prev.subject : [prev.subject].filter(Boolean);
            const next = current.includes(cat) 
                ? current.filter(c => c !== cat)
                : [...current, cat];
            return { ...prev, subject: next };
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validation: Files are only required in create mode
        if (!editMode) {
            if (!file) return toast.error("Please select a PDF file");
            if (!thumbnail) return toast.error("Please upload a thumbnail image");
        }

        if (!formData.subject || formData.subject.length === 0) {
            return toast.error("Please select at least one category");
        }

        setLoading(true);
        const data = new FormData();
        data.append('title', formData.title);
        data.append('description', formData.description);
        data.append('price', formData.price);
        data.append('totalPages', formData.totalPages);
        
        // Append multiple categories
        const subjects = Array.isArray(formData.subject) ? formData.subject : [formData.subject];
        subjects.forEach(s => data.append('subject', s));
        
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
                className="glass-card p-10 relative overflow-visible"
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
                                className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 font-medium"
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
                            className="w-full p-4 bg-slate-50 border border-slate-100 rounded-2xl outline-none focus:ring-4 focus:ring-indigo-500/10 resize-none font-medium"
                            value={formData.description}
                            onChange={(e) => setFormData({...formData, description: e.target.value})}
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-sm font-bold text-slate-700">Categories</label>
                            <span className="text-[10px] font-bold text-slate-400 uppercase">Tick multiple options</span>
                        </div>
                        
                        <div className="relative">
                            <button
                                type="button"
                                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl flex items-center justify-between group hover:border-indigo-200 transition-all"
                            >
                                <div className="flex items-center gap-3 overflow-hidden">
                                    <BookOpen className="w-5 h-5 text-slate-400 group-hover:text-indigo-600 transition-colors" />
                                    <span className={`text-sm font-semibold truncate ${formData.subject.length > 0 ? 'text-slate-900' : 'text-slate-400'}`}>
                                        {formData.subject.length > 0 
                                            ? `${formData.subject.length} Categories Selected: ${formData.subject.join(", ")}` 
                                            : "Choose academic tracks..."}
                                    </span>
                                </div>
                                <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform duration-300 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            <AnimatePresence>
                                {isDropdownOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        className="absolute z-[100] top-full left-0 right-0 mt-3 bg-white border border-slate-100 rounded-[32px] shadow-2xl shadow-slate-200/50 p-4 max-h-72 overflow-y-auto scrollbar-hide grid grid-cols-1 sm:grid-cols-2 gap-2"
                                    >
                                        {categories.map(cat => {
                                            const isSelected = formData.subject.includes(cat);
                                            return (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    onClick={() => toggleCategory(cat)}
                                                    className={`flex items-center justify-between px-4 py-3 rounded-2xl text-[11px] font-bold uppercase tracking-wider transition-all ${isSelected ? 'bg-indigo-50 text-indigo-600' : 'bg-white text-slate-400 hover:bg-slate-50 hover:text-slate-600'}`}
                                                >
                                                    {cat}
                                                    {isSelected && <Check className="w-4 h-4 text-indigo-600" />}
                                                </button>
                                            );
                                        })}
                                    </motion.div>
                                )}
                            </AnimatePresence>
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

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 ml-1">
                                {editMode ? 'Update PDF (Optional)' : 'Upload PDF'}
                            </label>
                            <div className="relative group">
                                <input 
                                    type="file" 
                                    accept=".pdf"
                                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    required={!editMode}
                                />
                                <div className={`w-full p-6 border-2 border-dashed rounded-[32px] transition-all flex flex-col items-center justify-center gap-3 ${file ? 'border-green-400 bg-green-50/30' : 'border-slate-200 bg-slate-50/50 group-hover:border-indigo-300'}`}>
                                    {file ? (
                                        <>
                                            <div className="w-12 h-12 bg-green-100 text-green-600 rounded-2xl flex items-center justify-center">
                                                <FileText className="w-6 h-6" />
                                            </div>
                                            <div className="text-center">
                                                <p className="text-xs font-bold text-green-700 truncate max-w-[150px]">{file.name}</p>
                                                <p className="text-[10px] font-bold text-green-500 uppercase mt-1 tracking-wider">PDF Ready</p>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-indigo-600 transition-colors">
                                                <FileUp className="w-6 h-6" />
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select PDF Document</p>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-sm font-bold text-slate-700 ml-1">
                                {editMode ? 'Update Thumbnail (Optional)' : 'Note Thumbnail'}
                            </label>
                            <div className="relative group">
                                <input 
                                    type="file" 
                                    accept="image/*"
                                    onChange={(e) => setThumbnail(e.target.files?.[0] || null)}
                                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                                    required={!editMode}
                                />
                                <div className={`w-full p-2 border-2 border-dashed rounded-[32px] transition-all flex flex-col items-center justify-center min-h-[140px] ${thumbnail ? 'border-indigo-400 bg-indigo-50/30' : 'border-slate-200 bg-slate-50/50 group-hover:border-indigo-300'}`}>
                                    {thumbnail ? (
                                        <div className="relative w-full h-full flex flex-col items-center gap-2">
                                            <img 
                                                src={URL.createObjectURL(thumbnail)} 
                                                className="w-full h-24 object-cover rounded-[24px] shadow-lg shadow-indigo-100" 
                                                alt="Preview" 
                                            />
                                            <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest">Cover Preview</p>
                                        </div>
                                    ) : (
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-slate-400 group-hover:text-indigo-600 transition-colors">
                                                <ImageIcon className="w-6 h-6" />
                                            </div>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Select Cover Image</p>
                                        </div>
                                    )}
                                </div>
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
