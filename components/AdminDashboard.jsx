import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Edit3, Trash2, ArrowLeft, Save, Sparkles, 
  Eye, Check, ShieldAlert, LogOut, ExternalLink, RefreshCw 
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { projectsService } from "../services/projectsService";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";

const PRESET_GRADIENTS = [
  { name: "Royal Blue", class: "from-blue-500 to-indigo-500" },
  { name: "Neon Amethyst", class: "from-purple-500 to-pink-500" },
  { name: "Crimson Rose", class: "from-rose-500 to-pink-500" },
  { name: "Emerald Mint", class: "from-emerald-500 to-teal-500" },
  { name: "Solar Orange", class: "from-amber-500 to-orange-500" },
  { name: "Cosmic Indigo", class: "from-indigo-500 to-violet-500" },
];

const AdminDashboard = () => {
  const navigate = useNavigate();
  
  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  const [authError, setAuthError] = useState("");

  // Projects list state
  const [projects, setProjects] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form/Modal states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  
  // Form fields state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [tags, setTags] = useState("");
  const [highlightColor, setHighlightColor] = useState("from-blue-500 to-indigo-500");
  const [featured, setFeatured] = useState(false);
  
  // Real-time Firestore status indicator
  const [isCloudSync, setIsCloudSync] = useState(false);

  // Check login state on mount using Firebase Auth
  useEffect(() => {
    if (!auth) {
      // Fallback to local session storage if Firebase failed to initialize
      const savedAuth = sessionStorage.getItem("admin_portfolio_authorized");
      if (savedAuth === "true") {
        setIsAuthenticated(true);
      }
      setIsAuthChecking(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
      setIsAuthChecking(false);
    });

    return () => unsubscribe();
  }, []);

  // Fetch projects once authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchAll = async () => {
      setIsLoading(true);
      try {
        const list = await projectsService.getProjects();
        setProjects(list);
        
        // Determine if we're connected to real Firebase
        const isFirebase = import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID;
        setIsCloudSync(!!isFirebase);
      } catch (err) {
        console.error("Error loading projects: ", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAll();
  }, [isAuthenticated]);

  // Auth Submit Handlers via Firebase Auth
  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setAuthError("");

    if (!auth) {
      setAuthError("Firebase Auth is not initialized. Please configure it.");
      setIsSubmitting(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (err) {
      console.error("Login failed:", err);
      let errorMsg = "Login failed. Please verify your email and password.";
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        errorMsg = "Invalid email or password. Please try again.";
      } else if (err.code === "auth/too-many-requests") {
        errorMsg = "Too many failed attempts. Please try again later.";
      }
      setAuthError(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    if (auth) {
      try {
        await signOut(auth);
      } catch (err) {
        console.error("Sign out failed:", err);
      }
    } else {
      setIsAuthenticated(false);
      sessionStorage.removeItem("admin_portfolio_authorized");
    }
    setEmail("");
    setPassword("");
  };

  // Open form for adding new project
  const handleOpenAdd = () => {
    setEditingProject(null);
    setTitle("");
    setCategory("");
    setDescription("");
    setImage("https://images.unsplash.com/photo-1550009158-9ebf69173e03?auto=format&fit=crop&w=600&q=70&fm=webp");
    setLink("#");
    setTags("React, Tailwind CSS, Framer Motion");
    setHighlightColor("from-blue-500 to-indigo-500");
    setFeatured(false);
    setIsFormOpen(true);
  };

  // Open form for editing existing project
  const handleOpenEdit = (proj) => {
    setEditingProject(proj);
    setTitle(proj.title);
    setCategory(proj.category);
    setDescription(proj.description);
    setImage(proj.image);
    setLink(proj.link);
    setTags(Array.isArray(proj.tags) ? proj.tags.join(", ") : proj.tags);
    setHighlightColor(proj.highlightColor || "from-blue-500 to-indigo-500");
    setFeatured(proj.featured || false);
    setIsFormOpen(true);
  };

  // Handle Save
  const handleSave = async (e) => {
    e.preventDefault();
    
    // Validate inputs
    if (!title || !category || !description || !image) {
      alert("Please fill in all required fields.");
      return;
    }

    const tagsArray = tags.split(",").map(t => t.trim()).filter(Boolean);

    const projectPayload = {
      title,
      category,
      description,
      image,
      link,
      tags: tagsArray,
      highlightColor,
      featured,
    };

    setIsLoading(true);
    try {
      if (editingProject) {
        // Edit
        const updated = await projectsService.updateProject(editingProject.id, projectPayload);
        setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...updated } : p));
      } else {
        // Add
        const created = await projectsService.addProject(projectPayload);
        setProjects(prev => [...prev, created]);
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Failed to save project:", error);
      alert("Error saving project. Please check console.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle Delete
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you absolutely sure you want to delete "${title}"?`)) {
      return;
    }

    setIsLoading(true);
    try {
      await projectsService.deleteProject(id);
      setProjects(prev => prev.filter(p => p.id !== id));
    } catch (error) {
      console.error("Failed to delete project:", error);
      alert("Error deleting project.");
    } finally {
      setIsLoading(false);
    }
  };

  // Loading/checking session screen
  if (isAuthChecking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
        <span className="text-sm text-slate-400 font-mono mt-4">Verifying session...</span>
      </div>
    );
  }

  // Authentication Guard Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-500/10 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-1/4 left-1/2 -translate-x-1/2 w-80 h-80 bg-purple-500/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md bg-[#0d1425]/70 border border-white/5 backdrop-blur-xl p-8 rounded-3xl shadow-2xl space-y-6 relative z-10"
        >
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-2">
              <ShieldAlert size={22} className="animate-pulse" />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">Admin Gate</h1>
            <p className="text-slate-400 text-sm">
              Sign in with your Firebase admin credentials to manage projects.
            </p>
          </div>

          <form onSubmit={handleAuthSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-mono tracking-wider uppercase">Email Address</label>
              <input 
                type="email"
                required
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-white/5 rounded-xl text-white focus:border-indigo-500/50 focus:outline-none transition text-sm"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-mono tracking-wider uppercase">Password</label>
              <input 
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-slate-900 border border-white/5 rounded-xl text-white focus:border-indigo-500/50 focus:outline-none transition text-sm"
              />
            </div>

            {authError && (
              <motion.p 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-xs text-rose-400 text-center font-medium"
              >
                {authError}
              </motion.p>
            )}

            <button 
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-3 px-4 bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/10 cursor-pointer flex items-center justify-center space-x-2 ${
                isSubmitting ? "opacity-50 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2" />
                  <span>Verifying...</span>
                </>
              ) : (
                <span>Unlock Console</span>
              )}
            </button>
          </form>

          <div className="pt-2 text-center">
            <Link to="/" className="inline-flex items-center space-x-1.5 text-xs text-slate-500 hover:text-indigo-400 transition">
              <ArrowLeft size={12} />
              <span>Back to Portfolio</span>
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 lg:p-8 relative">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-500/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-purple-500/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto space-y-8 relative z-10">
        
        {/* Navigation & Stats Header bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-[#0d1425]/40 border border-white/5 backdrop-blur-md">
          <div className="flex items-center space-x-3">
            <Link 
              to="/" 
              className="p-2 bg-slate-900 hover:bg-slate-800 border border-white/5 rounded-xl transition text-slate-400 hover:text-white"
              title="Return to Main Page"
            >
              <ArrowLeft size={16} />
            </Link>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black text-white tracking-tight">Portfolio Admin Panel</h1>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase ${
                  isCloudSync ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                }`}>
                  <RefreshCw size={8} className={`mr-1 ${isCloudSync ? '' : 'animate-spin'}`} />
                  {isCloudSync ? "Live Firestore" : "Local Sync Mode"}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Add, update, or remove live projects dynamically</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            <button
              onClick={handleOpenAdd}
              className="py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition duration-300 flex items-center space-x-1.5 cursor-pointer shadow-md shadow-indigo-500/10"
            >
              <Plus size={14} />
              <span>Create Project</span>
            </button>
            
            <button
              onClick={handleLogout}
              className="p-2 bg-slate-900 hover:bg-red-500/15 hover:text-red-400 border border-white/5 hover:border-red-500/25 rounded-xl transition text-slate-400 cursor-pointer"
              title="Lock Admin Control"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && projects.length === 0 ? (
          <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
            <span className="text-sm text-slate-400 font-mono">Synchronizing projects repository...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Project List */}
            {projects.map((proj) => (
              <motion.div
                key={proj.id}
                layout
                className="group relative bg-[#0d1425]/60 border border-white/5 hover:border-indigo-500/20 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between h-full transition"
              >
                <div>
                  {/* Image & Header Tags */}
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-900">
                    <div className={`absolute top-0 inset-x-0 h-1 bg-gradient-to-r ${proj.highlightColor || "from-blue-500 to-indigo-500"}`} />
                    <img 
                      src={proj.image} 
                      alt={proj.title}
                      className="w-full h-full object-cover opacity-80"
                    />
                    <span className="absolute top-3 left-3 px-2 py-0.5 bg-slate-950/80 backdrop-blur-md text-[9px] font-black text-indigo-300 rounded-full uppercase tracking-wider border border-white/5">
                      {proj.category}
                    </span>
                    
                    {proj.featured && (
                      <span className="absolute top-3 right-3 px-2 py-0.5 bg-yellow-500 text-slate-950 text-[9px] font-black rounded-full uppercase tracking-wider flex items-center space-x-0.5">
                        <Sparkles size={8} />
                        <span>Featured Hero</span>
                      </span>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-5 space-y-3">
                    <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                      {proj.title}
                    </h3>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                      {proj.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-1 pt-2">
                      {proj.tags && (Array.isArray(proj.tags) ? proj.tags : []).map((t, idx) => (
                        <span key={idx} className="text-[9px] font-medium px-2 py-0.5 bg-slate-900 text-slate-400 rounded-md border border-white/[0.03]">
                          {t}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions Footer */}
                <div className="p-4 bg-slate-900/40 border-t border-white/5 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono max-w-[120px] truncate" title={proj.id}>
                    ID: {proj.id.substring(0, 8)}...
                  </span>
                  
                  <div className="flex items-center space-x-2">
                    {proj.link && proj.link !== "#" && (
                      <a 
                        href={proj.link} 
                        target="_blank" 
                        rel="noreferrer" 
                        className="p-1.5 bg-slate-900 border border-white/5 rounded-lg text-slate-400 hover:text-indigo-400 transition"
                        title="Open Live App"
                      >
                        <ExternalLink size={13} />
                      </a>
                    )}
                    
                    <button
                      onClick={() => handleOpenEdit(proj)}
                      className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-400 rounded-lg transition border border-indigo-500/20 cursor-pointer"
                      title="Edit Details"
                    >
                      <Edit3 size={13} />
                    </button>
                    
                    <button
                      onClick={() => handleDelete(proj.id, proj.title)}
                      className="p-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 rounded-lg transition border border-red-500/20 cursor-pointer"
                      title="Remove Project"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Editor Modal Window */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay Mask */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />

            {/* Modal Body Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-2xl bg-[#0d1425] border border-white/10 p-6 sm:p-8 rounded-3xl shadow-2xl overflow-y-auto max-h-[90vh] space-y-6 z-10"
            >
              <div className="flex items-center justify-between border-b border-white/5 pb-4">
                <div className="flex items-center space-x-2">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/25 text-indigo-400">
                    <Sparkles size={16} />
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-white">
                    {editingProject ? "Modify Portfolio Project" : "Add Brand New Showcase"}
                  </h2>
                </div>
                <button 
                  onClick={() => setIsFormOpen(false)}
                  className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition cursor-pointer"
                >
                  ✕
                </button>
              </div>

              <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                {/* Left Side Inputs */}
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Project Title *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Trendwave Store"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:border-indigo-500/40 focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Category *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="e.g. Boutique Shop, SaaS, E-Commerce"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:border-indigo-500/40 focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Technologies * (comma-separated)</label>
                    <input 
                      type="text" 
                      required
                      placeholder="React, Express, MongoDB"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:border-indigo-500/40 focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Live URL Link</label>
                    <input 
                      type="text" 
                      placeholder="https://example.com or #"
                      value={link}
                      onChange={(e) => setLink(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:border-indigo-500/40 focus:outline-none transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Image Preview URL *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="https://images.unsplash.com/photo-..."
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:border-indigo-500/40 focus:outline-none transition"
                    />
                  </div>
                </div>

                {/* Right Side Inputs */}
                <div className="space-y-4 flex flex-col justify-between">
                  
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Highlight Glow Theme Accent</label>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESET_GRADIENTS.map((g) => (
                        <button
                          key={g.name}
                          type="button"
                          onClick={() => setHighlightColor(g.class)}
                          className={`flex items-center justify-between p-2 rounded-xl text-xs font-semibold bg-slate-900 border transition ${
                            highlightColor === g.class ? "border-indigo-400 text-white" : "border-white/5 text-slate-400 hover:border-white/10"
                          }`}
                        >
                          <span>{g.name}</span>
                          <span className={`w-3 h-3 rounded-full bg-gradient-to-r ${g.class}`} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Project Description *</label>
                    <textarea 
                      required
                      rows={4}
                      placeholder="Highlight conversion factors, user statistics, or key tech insights..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:border-indigo-500/40 focus:outline-none transition resize-none"
                    />
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-slate-900/50 border border-white/5 rounded-xl">
                    <input 
                      type="checkbox"
                      id="featured"
                      checked={featured}
                      onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 text-indigo-500 border-slate-700 bg-slate-800 rounded focus:ring-indigo-500/30 cursor-pointer"
                    />
                    <label htmlFor="featured" className="text-xs text-slate-300 font-semibold cursor-pointer select-none">
                      Feature on Hero 3D Showcase (recommended for top products)
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="col-span-1 md:col-span-2 pt-4 border-t border-white/5 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setIsFormOpen(false)}
                    className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="py-2 px-5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center space-x-1.5 shadow-md shadow-indigo-500/10"
                  >
                    <Save size={13} />
                    <span>{editingProject ? "Update changes" : "Launch Project"}</span>
                  </button>
                </div>

              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminDashboard;
