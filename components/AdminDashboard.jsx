import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, Edit3, Trash2, ArrowLeft, ArrowRight, ArrowUp, ArrowDown,
  ChevronsUp, ChevronsDown, Shuffle, Move,
  Save, Sparkles, Eye, Check, ShieldAlert, LogOut, ExternalLink, RefreshCw, Star, MessageSquare,
  Upload, Settings, AlertCircle
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { projectsService } from "../services/projectsService";
import { statsService } from "../services/statsService";
import { solutionsService } from "../services/solutionsService";
import { pricingService } from "../services/pricingService";
import { testimonialsService } from "../services/testimonialsService";
import { signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../services/firebase";
import { compressImage, fileToBase64, uploadToCloudinaryWithRetry } from "../utils/imageOptimizer";

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

  // Global loader state
  const [isLoading, setIsLoading] = useState(true);
  
  // Datasets states
  const [projects, setProjects] = useState([]);
  const [leads, setLeads] = useState([]);
  const [stats, setStats] = useState([]);
  const [solutions, setSolutions] = useState([]);
  const [pricing, setPricing] = useState({ projectTypes: [], features: [] });
  const [testimonials, setTestimonials] = useState([]);
  
  // Tab control
  const [activeTab, setActiveTab] = useState("showcases");
  
  // Modal toggle states
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isStatFormOpen, setIsStatFormOpen] = useState(false);
  const [isSolutionFormOpen, setIsSolutionFormOpen] = useState(false);
  const [isPricingFormOpen, setIsPricingFormOpen] = useState(false);
  const [isTestimonialFormOpen, setIsTestimonialFormOpen] = useState(false);

  // Editing pointers
  const [editingProject, setEditingProject] = useState(null);
  const [editingStat, setEditingStat] = useState(null);
  const [editingSolution, setEditingSolution] = useState(null);
  const [editingPricingItem, setEditingPricingItem] = useState(null);
  const [editingTestimonial, setEditingTestimonial] = useState(null);

  // Form Field States
  // 1. Projects
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [link, setLink] = useState("");
  const [tags, setTags] = useState("");
  const [highlightColor, setHighlightColor] = useState("from-blue-500 to-indigo-500");
  const [featured, setFeatured] = useState(false);
  const [placementPosition, setPlacementPosition] = useState("end"); // 'start' | 'end'
  const [isSavingOrder, setIsSavingOrder] = useState(false);
  const [orderSyncStatus, setOrderSyncStatus] = useState("");

  // 2. Stats
  const [statValue, setStatValue] = useState("");
  const [statLabel, setStatLabel] = useState("");
  const [statDescription, setStatDescription] = useState("");
  const [statIcon, setStatIcon] = useState("");
  const [statColor, setStatColor] = useState("");

  // 3. Solutions
  const [solTitle, setSolTitle] = useState("");
  const [solTagline, setSolTagline] = useState("");
  const [solDescription, setSolDescription] = useState("");
  const [solFullDescription, setSolFullDescription] = useState("");
  const [solIcon, setSolIcon] = useState("");
  const [solBenefits, setSolBenefits] = useState("");
  const [solAccent, setSolAccent] = useState("");

  // 4. Pricing (Consolidated)
  const [pricingItemType, setPricingItemType] = useState("projectType"); // 'projectType' | 'feature'
  const [priceId, setPriceId] = useState("");
  const [priceName, setPriceName] = useState("");
  const [priceCost, setPriceCost] = useState("");
  const [priceDays, setPriceDays] = useState("");
  const [priceDesc, setPriceDesc] = useState("");
  const [priceIcon, setPriceIcon] = useState("");

  // 5. Testimonials
  const [testName, setTestName] = useState("");
  const [testRole, setTestRole] = useState("");
  const [testText, setTestText] = useState("");
  const [testRating, setTestRating] = useState(5);
  const [testAvatar, setTestAvatar] = useState("");

  // Real-time Firestore status indicator
  const [isCloudSync, setIsCloudSync] = useState(false);

  // Cloudinary credentials and upload status
  const [cloudinaryCloudName, setCloudinaryCloudName] = useState(() => {
    return import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || localStorage.getItem("haroon_cloudinary_cloud_name") || "";
  });
  const [cloudinaryUploadPreset, setCloudinaryUploadPreset] = useState(() => {
    return import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || localStorage.getItem("haroon_cloudinary_upload_preset") || "";
  });
  const [isCloudinaryConfigOpen, setIsCloudinaryConfigOpen] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState("");
  const [imageUploadError, setImageUploadError] = useState("");
  const [lastSelectedFile, setLastSelectedFile] = useState(null);

  const handleCloudinaryUpload = async (file) => {
    if (!file) return;
    setLastSelectedFile(file);
    
    if (!cloudinaryCloudName || !cloudinaryUploadPreset) {
      setImageUploadError("Cloudinary Cloud Name and Upload Preset are required. Click 'Cloudinary Settings' to enter them, or use the 1-Click Compressed Base64 fallback.");
      setIsCloudinaryConfigOpen(true);
      return;
    }
    
    setIsUploadingImage(true);
    setImageUploadError("");
    setImageUploadProgress("Compressing & preparing image...");
    
    try {
      const result = await uploadToCloudinaryWithRetry(
        file,
        cloudinaryCloudName,
        cloudinaryUploadPreset,
        (statusMsg) => setImageUploadProgress(statusMsg),
        3
      );
      
      if (result && result.url) {
        setImage(result.url);
        setImageUploadProgress("Upload successful!");
        setTimeout(() => setImageUploadProgress(""), 3500);
      }
    } catch (error) {
      console.error("Cloudinary upload error:", error);
      const isNetwork = error.message?.includes("Network") || error.message?.includes("fetch");
      setImageUploadError(
        isNetwork
          ? `Network interrupted during upload: ${error.message}. You can retry or click 'Use Optimized Image' below.`
          : `Upload failed: ${error.message}`
      );
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleFallbackBase64 = async () => {
    if (!lastSelectedFile) return;
    setIsUploadingImage(true);
    setImageUploadProgress("Generating optimized inline image...");
    try {
      const base64Data = await fileToBase64(lastSelectedFile, 1280, 0.82);
      setImage(base64Data);
      setImageUploadError("");
      setImageUploadProgress("Optimized image attached successfully!");
      setTimeout(() => setImageUploadProgress(""), 3500);
    } catch (err) {
      setImageUploadError("Failed to convert image to base64.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleSaveCloudinaryConfig = (cloudName, preset) => {
    setCloudinaryCloudName(cloudName);
    setCloudinaryUploadPreset(preset);
    localStorage.setItem("haroon_cloudinary_cloud_name", cloudName);
    localStorage.setItem("haroon_cloudinary_upload_preset", preset);
  };

  // Check login state on mount using Firebase Auth
  useEffect(() => {
    if (!auth) {
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

  // Fetch all administrative lists once authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [projList, statsList, solList, pricingConfig, testList] = await Promise.all([
          projectsService.getProjects(),
          statsService.getStats(),
          solutionsService.getSolutions(),
          pricingService.getPricing(),
          testimonialsService.getTestimonials()
        ]);
        
        setProjects(projList || []);
        setStats(statsList || []);
        setSolutions(solList || []);
        setPricing(pricingConfig || { projectTypes: [], features: [] });
        setTestimonials(testList || []);
        
        const isFirebase = import.meta.env.VITE_FIREBASE_API_KEY && import.meta.env.VITE_FIREBASE_PROJECT_ID;
        setIsCloudSync(!!isFirebase);
      } catch (err) {
        console.error("Error loading administration data: ", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();

    // Load Estimator Leads
    const savedQuotes = JSON.parse(localStorage.getItem('haroon_dev_quotes') || '[]');
    setLeads(savedQuotes);
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

  // Leads CRM Handlers
  const handleDeleteLead = (leadId) => {
    if (!window.confirm("Are you sure you want to delete this project lead?")) return;
    const updated = leads.filter(l => l.id !== leadId);
    localStorage.setItem('haroon_dev_quotes', JSON.stringify(updated));
    setLeads(updated);
  };

  const handleToggleLeadStatus = (leadId) => {
    const updated = leads.map(l => {
      if (l.id === leadId) {
        return { ...l, status: l.status === 'contacted' ? 'pending' : 'contacted' };
      }
      return l;
    });
    localStorage.setItem('haroon_dev_quotes', JSON.stringify(updated));
    setLeads(updated);
  };

  // Projects CRUD Open Triggers
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
    setPlacementPosition("end");
    setIsFormOpen(true);
  };

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

  // Stats Open Triggers
  const handleOpenAddStat = () => {
    setEditingStat(null);
    setStatValue("");
    setStatLabel("");
    setStatDescription("");
    setStatIcon("Trophy");
    setStatColor("from-indigo-500 to-purple-500");
    setIsStatFormOpen(true);
  };

  const handleOpenEditStat = (s) => {
    setEditingStat(s);
    setStatValue(s.value);
    setStatLabel(s.label);
    setStatDescription(s.description);
    setStatIcon(s.icon);
    setStatColor(s.color || "from-indigo-500 to-purple-500");
    setIsStatFormOpen(true);
  };

  // Solutions Open Triggers
  const handleOpenAddSolution = () => {
    setEditingSolution(null);
    setSolTitle("");
    setSolTagline("");
    setSolDescription("");
    setSolFullDescription("");
    setSolIcon("Cpu");
    setSolBenefits("");
    setSolAccent("text-indigo-400 bg-indigo-500/10 border-indigo-500/10 hover:border-indigo-500/30");
    setIsSolutionFormOpen(true);
  };

  const handleOpenEditSolution = (s) => {
    setEditingSolution(s);
    setSolTitle(s.title);
    setSolTagline(s.tagline);
    setSolDescription(s.description);
    setSolFullDescription(s.fullDescription || "");
    setSolIcon(s.icon);
    setSolBenefits(Array.isArray(s.benefits) ? s.benefits.join(", ") : s.benefits);
    setSolAccent(s.accent || "text-indigo-400 bg-indigo-500/10 border-indigo-500/10 hover:border-indigo-500/30");
    setIsSolutionFormOpen(true);
  };

  // Pricing Open Triggers
  const handleOpenAddPricingItem = (type) => {
    setEditingPricingItem(null);
    setPricingItemType(type);
    setPriceId("");
    setPriceName("");
    setPriceCost("");
    setPriceDays("");
    setPriceDesc("");
    setPriceIcon("Laptop");
    setIsPricingFormOpen(true);
  };

  const handleOpenEditPricingItem = (type, item) => {
    setEditingPricingItem(item);
    setPricingItemType(type);
    setPriceId(item.id);
    setPriceName(item.name);
    setPriceCost(type === "projectType" ? item.basePrice : item.price);
    setPriceDays(type === "projectType" ? item.baseDays : item.days);
    setPriceDesc(type === "projectType" ? item.description : item.desc);
    setPriceIcon(type === "projectType" ? item.icon : "Laptop");
    setIsPricingFormOpen(true);
  };

  // Testimonial Open Triggers
  const handleOpenAddTestimonial = () => {
    setEditingTestimonial(null);
    setTestName("");
    setTestRole("");
    setTestText("");
    setTestRating(5);
    setTestAvatar("https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80");
    setIsTestimonialFormOpen(true);
  };

  const handleOpenEditTestimonial = (t) => {
    setEditingTestimonial(t);
    setTestName(t.name);
    setTestRole(t.role);
    setTestText(t.text);
    setTestRating(t.rating || 5);
    setTestAvatar(t.avatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80");
    setIsTestimonialFormOpen(true);
  };

  // SAVE HANDLERS
  // 1. Projects
  const handleSave = async (e) => {
    e.preventDefault();
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
        const updated = await projectsService.updateProject(editingProject.id, projectPayload);
        setProjects(prev => prev.map(p => p.id === editingProject.id ? { ...p, ...updated } : p));
      } else {
        const created = await projectsService.addProject(projectPayload, placementPosition);
        if (placementPosition === "start") {
          setProjects(prev => [created, ...prev.map((p, idx) => ({ ...p, order: idx + 1 }))]);
        } else {
          setProjects(prev => [...prev, created]);
        }
      }
      setIsFormOpen(false);
    } catch (error) {
      console.error("Failed to save project:", error);
      alert("Error saving project.");
    } finally {
      setIsLoading(false);
    }
  };

  // 1b. Projects Directional Shuffle & Reordering Handlers
  const handleMoveProject = async (fromIndex, toIndex) => {
    if (
      fromIndex === toIndex ||
      fromIndex < 0 ||
      toIndex < 0 ||
      fromIndex >= projects.length ||
      toIndex >= projects.length
    ) {
      return;
    }

    const updated = [...projects];
    const [movedItem] = updated.splice(fromIndex, 1);
    updated.splice(toIndex, 0, movedItem);

    // Optimistic UI state update
    setProjects(updated);
    setIsSavingOrder(true);
    setOrderSyncStatus(`Moved "${movedItem.title}" to position #${toIndex + 1}. Syncing...`);

    try {
      await projectsService.reorderProjects(updated);
      setOrderSyncStatus(`Position synced live across all visitors!`);
      setTimeout(() => setOrderSyncStatus(""), 3500);
    } catch (err) {
      console.error("Failed to sync project order:", err);
      setOrderSyncStatus("Failed to sync order. Please check network connection.");
    } finally {
      setIsSavingOrder(false);
    }
  };

  const handleMoveLeft = (index) => {
    handleMoveProject(index, Math.max(0, index - 1));
  };

  const handleMoveRight = (index) => {
    handleMoveProject(index, Math.min(projects.length - 1, index + 1));
  };

  const handleMoveUp = (index) => {
    // In a 3-column desktop layout, move up 1 row (-3), or directly to top (0)
    const target = index >= 3 ? index - 3 : 0;
    handleMoveProject(index, target);
  };

  const handleMoveDown = (index) => {
    // In a 3-column desktop layout, move down 1 row (+3), or directly to bottom
    const target = index + 3 < projects.length ? index + 3 : projects.length - 1;
    handleMoveProject(index, target);
  };

  const handleMoveToTop = (index) => {
    handleMoveProject(index, 0);
  };

  const handleMoveToBottom = (index) => {
    handleMoveProject(index, projects.length - 1);
  };

  const handleShuffleAll = async () => {
    if (projects.length <= 1) return;
    if (!window.confirm("Shuffle all projects randomly? Changes will reflect live across the portfolio for all visitors.")) return;

    const shuffled = [...projects];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setProjects(shuffled);
    setIsSavingOrder(true);
    setOrderSyncStatus("Randomizing and syncing positions...");
    try {
      await projectsService.reorderProjects(shuffled);
      setOrderSyncStatus("Portfolio shuffled and live for all visitors!");
      setTimeout(() => setOrderSyncStatus(""), 3500);
    } catch (err) {
      console.error(err);
      setOrderSyncStatus("Shuffle failed to sync.");
    } finally {
      setIsSavingOrder(false);
    }
  };

  // 2. Stats
  const handleSaveStat = async (e) => {
    e.preventDefault();
    if (!statValue || !statLabel || !statDescription || !statIcon) {
      alert("Please fill in all required stat fields.");
      return;
    }
    const payload = {
      value: statValue,
      label: statLabel,
      description: statDescription,
      icon: statIcon,
      color: statColor || "from-indigo-500 to-purple-500"
    };

    setIsLoading(true);
    try {
      if (editingStat) {
        const updated = await statsService.updateStat(editingStat.id, payload);
        setStats(prev => prev.map(s => s.id === editingStat.id ? { ...s, ...updated } : s));
      } else {
        const created = await statsService.addStat(payload);
        setStats(prev => [...prev, created]);
      }
      setIsStatFormOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error saving statistic.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Solutions
  const handleSaveSolution = async (e) => {
    e.preventDefault();
    if (!solTitle || !solTagline || !solDescription || !solIcon) {
      alert("Please fill in all required solution fields.");
      return;
    }
    const payload = {
      title: solTitle,
      tagline: solTagline,
      description: solDescription,
      fullDescription: solFullDescription,
      icon: solIcon,
      benefits: solBenefits,
      accent: solAccent || "text-indigo-400 bg-indigo-500/10 border-indigo-500/10 hover:border-indigo-500/30"
    };

    setIsLoading(true);
    try {
      if (editingSolution) {
        const updated = await solutionsService.updateSolution(editingSolution.id, payload);
        setSolutions(prev => prev.map(s => s.id === editingSolution.id ? { ...s, ...updated } : s));
      } else {
        const created = await solutionsService.addSolution(payload);
        setSolutions(prev => [...prev, created]);
      }
      setIsSolutionFormOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error saving specialty.");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Pricing (Consolidated)
  const handleSavePricingItem = async (e) => {
    e.preventDefault();
    if (!priceId || !priceName) {
      alert("ID and Name are required.");
      return;
    }

    const itemPayload = {
      id: priceId,
      name: priceName,
    };

    if (pricingItemType === "projectType") {
      itemPayload.basePrice = Number(priceCost) || 0;
      itemPayload.baseDays = Number(priceDays) || 0;
      itemPayload.icon = priceIcon || "Laptop";
      itemPayload.description = priceDesc;
    } else {
      itemPayload.price = Number(priceCost) || 0;
      itemPayload.days = Number(priceDays) || 0;
      itemPayload.desc = priceDesc;
    }

    const updatedConfig = { ...pricing };

    if (pricingItemType === "projectType") {
      const arr = [...(updatedConfig.projectTypes || [])];
      if (editingPricingItem) {
        const idx = arr.findIndex(item => item.id === editingPricingItem.id);
        if (idx !== -1) arr[idx] = itemPayload;
      } else {
        arr.push(itemPayload);
      }
      updatedConfig.projectTypes = arr;
    } else {
      const arr = [...(updatedConfig.features || [])];
      if (editingPricingItem) {
        const idx = arr.findIndex(item => item.id === editingPricingItem.id);
        if (idx !== -1) arr[idx] = itemPayload;
      } else {
        arr.push(itemPayload);
      }
      updatedConfig.features = arr;
    }

    setIsLoading(true);
    try {
      await pricingService.updatePricing(updatedConfig);
      setPricing(updatedConfig);
      setIsPricingFormOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error updating pricing config.");
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Testimonials
  const handleSaveTestimonial = async (e) => {
    e.preventDefault();
    if (!testName || !testRole || !testText) {
      alert("Please fill in all required testimonial fields.");
      return;
    }
    const payload = {
      name: testName,
      role: testRole,
      text: testText,
      rating: Number(testRating) || 5,
      avatar: testAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80"
    };

    setIsLoading(true);
    try {
      if (editingTestimonial) {
        const updated = await testimonialsService.updateTestimonial(editingTestimonial.id, payload);
        setTestimonials(prev => prev.map(t => t.id === editingTestimonial.id ? { ...t, ...updated } : t));
      } else {
        const created = await testimonialsService.addTestimonial(payload);
        setTestimonials(prev => [...prev, created]);
      }
      setIsTestimonialFormOpen(false);
    } catch (err) {
      console.error(err);
      alert("Error saving testimonial.");
    } finally {
      setIsLoading(false);
    }
  };

  // DELETE HANDLERS
  // 1. Projects
  const handleDelete = async (id, title) => {
    if (!window.confirm(`Are you absolutely sure you want to delete "${title}"?`)) return;
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

  // 2. Stats
  const handleDeleteStat = async (id, label) => {
    if (!window.confirm(`Are you sure you want to delete "${label}"?`)) return;
    setIsLoading(true);
    try {
      await statsService.deleteStat(id);
      setStats(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting statistic.");
    } finally {
      setIsLoading(false);
    }
  };

  // 3. Solutions
  const handleDeleteSolution = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete the specialty "${title}"?`)) return;
    setIsLoading(true);
    try {
      await solutionsService.deleteSolution(id);
      setSolutions(prev => prev.filter(s => s.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting specialty.");
    } finally {
      setIsLoading(false);
    }
  };

  // 4. Pricing (Consolidated)
  const handleDeletePricingItem = async (type, itemId) => {
    if (!window.confirm("Are you sure you want to delete this pricing option?")) return;
    const updatedConfig = { ...pricing };
    if (type === "projectType") {
      updatedConfig.projectTypes = (updatedConfig.projectTypes || []).filter(item => item.id !== itemId);
    } else {
      updatedConfig.features = (updatedConfig.features || []).filter(item => item.id !== itemId);
    }

    setIsLoading(true);
    try {
      await pricingService.updatePricing(updatedConfig);
      setPricing(updatedConfig);
    } catch (err) {
      console.error(err);
      alert("Error deleting pricing option.");
    } finally {
      setIsLoading(false);
    }
  };

  // 5. Testimonials
  const handleDeleteTestimonial = async (id, name) => {
    if (!window.confirm(`Are you sure you want to delete the testimonial from "${name}"?`)) return;
    setIsLoading(true);
    try {
      await testimonialsService.deleteTestimonial(id);
      setTestimonials(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
      alert("Error deleting testimonial.");
    } finally {
      setIsLoading(false);
    }
  };

  // Verification Screen loader
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
              Sign in with your Firebase admin credentials to manage systems.
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
            <div className="text-left">
              <div className="flex items-center space-x-2">
                <h1 className="text-xl font-black text-white tracking-tight">Portfolio Admin Panel</h1>
                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[9px] font-mono font-bold tracking-widest uppercase ${
                  isCloudSync ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20" : "bg-amber-500/15 text-amber-400 border border-amber-500/20"
                }`}>
                  <RefreshCw size={8} className={`mr-1 ${isCloudSync ? '' : 'animate-spin'}`} />
                  {isCloudSync ? "Live Firestore" : "Local Sync Mode"}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">Add, update, or remove live assets dynamically</p>
            </div>
          </div>

          <div className="flex items-center gap-3 self-end md:self-auto">
            {activeTab === "showcases" && (
              <button
                onClick={handleOpenAdd}
                className="py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition duration-300 flex items-center space-x-1.5 cursor-pointer shadow-md shadow-indigo-500/10 font-mono uppercase"
              >
                <Plus size={14} />
                <span>Create Project</span>
              </button>
            )}

            {activeTab === "stats" && (
              <button
                onClick={handleOpenAddStat}
                className="py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition duration-300 flex items-center space-x-1.5 cursor-pointer shadow-md shadow-indigo-500/10 font-mono uppercase"
              >
                <Plus size={14} />
                <span>Add Stat</span>
              </button>
            )}

            {activeTab === "solutions" && (
              <button
                onClick={handleOpenAddSolution}
                className="py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition duration-300 flex items-center space-x-1.5 cursor-pointer shadow-md shadow-indigo-500/10 font-mono uppercase"
              >
                <Plus size={14} />
                <span>Add Specialty</span>
              </button>
            )}

            {activeTab === "testimonials" && (
              <button
                onClick={handleOpenAddTestimonial}
                className="py-2 px-4 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition duration-300 flex items-center space-x-1.5 cursor-pointer shadow-md shadow-indigo-500/10 font-mono uppercase"
              >
                <Plus size={14} />
                <span>Add Review</span>
              </button>
            )}
            
            <button
              onClick={handleLogout}
              className="p-2 bg-slate-900 hover:bg-red-500/15 hover:text-red-400 border border-white/5 hover:border-red-500/25 rounded-xl transition text-slate-400 cursor-pointer"
              title="Lock Admin Control"
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>

        {/* Tab Selectors */}
        <div className="flex flex-wrap border-b border-white/5 gap-6 pb-1">
          {[
            { id: "showcases", label: "Projects", count: projects.length },
            { id: "leads", label: "Leads Inquiries", count: leads.length },
            { id: "stats", label: "Stats Section", count: stats.length },
            { id: "solutions", label: "Solutions Specialties", count: solutions.length },
            { id: "pricing", label: "Quote Prices", count: (pricing.projectTypes?.length || 0) + (pricing.features?.length || 0) },
            { id: "testimonials", label: "Testimonials", count: testimonials.length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-3 text-[10px] sm:text-xs font-black tracking-widest uppercase transition-all relative cursor-pointer ${
                activeTab === tab.id ? "text-indigo-400 text-shadow-glow" : "text-slate-400 hover:text-white"
              }`}
            >
              {tab.label} ({tab.count})
              {activeTab === tab.id && (
                <motion.div layoutId="adminTabBorder" className="absolute bottom-0 inset-x-0 h-[2px] bg-indigo-500" />
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Section Contents */}
        {activeTab === "showcases" && (
          <>
            {/* Reorder and Shuffle Toolbar */}
            <div className="bg-[#0d1425]/70 border border-white/5 rounded-2xl p-4 sm:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-left">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="p-1.5 rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                    <Move size={14} />
                  </span>
                  <h3 className="text-sm sm:text-base font-bold text-white flex items-center gap-2">
                    Portfolio Hierarchy & Position Shuffling
                    <span className="text-[10px] font-mono font-normal text-indigo-300 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                      {projects.length} Showcases
                    </span>
                  </h3>
                </div>
                <p className="text-slate-400 text-xs">
                  The sequence below directly dictates how clients see your projects on the live site. Use <span className="text-indigo-300 font-mono font-bold">←</span> / <span className="text-indigo-300 font-mono font-bold">→</span> (step left/right), <span className="text-indigo-300 font-mono font-bold">↑</span> / <span className="text-indigo-300 font-mono font-bold">↓</span> (row up/down), or the position dropdown to arrange any project.
                </p>
              </div>

              <div className="flex items-center gap-2.5 w-full md:w-auto justify-end">
                {orderSyncStatus && (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 border shadow-sm ${
                      isSavingOrder 
                        ? "bg-indigo-500/10 text-indigo-300 border-indigo-500/30"
                        : "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                    }`}
                  >
                    {isSavingOrder ? (
                      <RefreshCw size={12} className="animate-spin text-indigo-400" />
                    ) : (
                      <Check size={12} className="text-emerald-400" />
                    )}
                    <span className="text-[11px] truncate max-w-[200px] sm:max-w-xs">{orderSyncStatus}</span>
                  </motion.div>
                )}

                <button
                  type="button"
                  onClick={handleShuffleAll}
                  disabled={isSavingOrder || projects.length <= 1}
                  className="px-3.5 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-300 border border-indigo-500/25 rounded-xl text-xs font-bold transition flex items-center gap-1.5 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-sm"
                  title="Randomly shuffle projects across portfolio"
                >
                  <Shuffle size={13} className={isSavingOrder ? "animate-spin" : ""} />
                  <span>Smart Shuffle</span>
                </button>
              </div>
            </div>

            {isLoading && projects.length === 0 ? (
              <div className="min-h-[400px] flex flex-col items-center justify-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
                <span className="text-sm text-slate-400 font-mono">Synchronizing projects repository...</span>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {projects.map((proj, index) => (
                  <motion.div
                    key={proj.id}
                    layout
                    className="group relative bg-[#0d1425]/60 border border-white/5 hover:border-indigo-500/20 rounded-2xl overflow-hidden shadow-lg flex flex-col justify-between h-full transition text-left"
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
                        
                        {/* Position Pill */}
                        <div className="absolute top-3 left-3 flex items-center gap-1.5">
                          <span className="px-2.5 py-1 bg-slate-950/90 backdrop-blur-md text-[10px] font-black text-indigo-300 rounded-full border border-indigo-500/30 flex items-center gap-1 shadow-md">
                            <Move size={10} className="text-indigo-400" />
                            <span>#{index + 1}</span>
                          </span>
                          <span className="px-2 py-0.5 bg-slate-950/80 backdrop-blur-md text-[9px] font-black text-slate-400 rounded-full uppercase tracking-wider border border-white/5">
                            {proj.category}
                          </span>
                        </div>
                        
                        {proj.featured && (
                          <span className="absolute top-3 right-3 px-2 py-0.5 bg-yellow-500 text-slate-950 text-[9px] font-black rounded-full uppercase tracking-wider flex items-center space-x-0.5 shadow-md">
                            <Sparkles size={8} />
                            <span>Featured Hero</span>
                          </span>
                        )}
                      </div>

                      {/* Body Content */}
                      <div className="p-5 space-y-3">
                        <div className="flex items-center justify-between">
                          <h3 className="text-base font-bold text-white group-hover:text-indigo-400 transition-colors">
                            {proj.title}
                          </h3>
                        </div>
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

                    <div>
                      {/* Directional Shuffle & Ordering Bar */}
                      <div className="px-3.5 py-2.5 bg-slate-950/80 border-t border-b border-white/5 flex flex-wrap items-center justify-between gap-2 select-none">
                        <div className="flex items-center gap-1">
                          <span className="text-[9px] text-slate-500 font-mono uppercase tracking-wider font-bold mr-1">
                            Shuffle:
                          </span>
                          {/* Move Left */}
                          <button
                            type="button"
                            onClick={() => handleMoveLeft(index)}
                            disabled={index === 0 || isSavingOrder}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-300 border border-white/5 hover:border-indigo-500/30 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move Left (1 position earlier)"
                          >
                            <ArrowLeft size={11} />
                          </button>

                          {/* Move Right */}
                          <button
                            type="button"
                            onClick={() => handleMoveRight(index)}
                            disabled={index === projects.length - 1 || isSavingOrder}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-300 border border-white/5 hover:border-indigo-500/30 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move Right (1 position later)"
                          >
                            <ArrowRight size={11} />
                          </button>

                          {/* Move Up 1 Row */}
                          <button
                            type="button"
                            onClick={() => handleMoveUp(index)}
                            disabled={index === 0 || isSavingOrder}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-300 border border-white/5 hover:border-indigo-500/30 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move Up (1 row up)"
                          >
                            <ArrowUp size={11} />
                          </button>

                          {/* Move Down 1 Row */}
                          <button
                            type="button"
                            onClick={() => handleMoveDown(index)}
                            disabled={index === projects.length - 1 || isSavingOrder}
                            className="p-1.5 rounded-lg bg-slate-900 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-300 border border-white/5 hover:border-indigo-500/30 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Move Down (1 row down)"
                          >
                            <ArrowDown size={11} />
                          </button>
                        </div>

                        {/* Direct Position Jump */}
                        <div className="flex items-center gap-1.5">
                          <span className="text-[9px] text-slate-500 font-mono">Pos:</span>
                          <select
                            value={index}
                            onChange={(e) => handleMoveProject(index, Number(e.target.value))}
                            disabled={isSavingOrder}
                            className="bg-slate-900 border border-white/10 text-indigo-300 text-[10px] font-mono font-bold rounded-md px-1.5 py-1 focus:outline-none focus:border-indigo-500/50 cursor-pointer disabled:opacity-40"
                          >
                            {projects.map((_, pIdx) => (
                              <option key={pIdx} value={pIdx} className="bg-slate-900 text-white">
                                #{pIdx + 1} {pIdx === 0 ? "★ Top" : pIdx === projects.length - 1 ? "⤓ End" : ""}
                              </option>
                            ))}
                          </select>

                          {/* Move directly to Top */}
                          <button
                            type="button"
                            onClick={() => handleMoveToTop(index)}
                            disabled={index === 0 || isSavingOrder}
                            className="p-1 rounded-md bg-slate-900 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-300 border border-white/5 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Jump directly to Top (#1)"
                          >
                            <ChevronsUp size={11} />
                          </button>

                          {/* Move directly to Bottom */}
                          <button
                            type="button"
                            onClick={() => handleMoveToBottom(index)}
                            disabled={index === projects.length - 1 || isSavingOrder}
                            className="p-1 rounded-md bg-slate-900 hover:bg-indigo-500/20 text-slate-400 hover:text-indigo-300 border border-white/5 transition cursor-pointer disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Jump directly to End"
                          >
                            <ChevronsDown size={11} />
                          </button>
                        </div>
                      </div>

                      {/* Actions Footer */}
                      <div className="p-4 bg-slate-900/40 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-mono max-w-[120px] truncate" title={proj.id}>
                          Order: #{index + 1}
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
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === "leads" && (
          <div className="space-y-6 text-left">
            {leads.length === 0 ? (
              <div className="min-h-[300px] flex flex-col items-center justify-center border border-dashed border-white/10 rounded-3xl p-8 text-center space-y-3 bg-[#0d1425]/10">
                <span className="text-3xl">📥</span>
                <h3 className="text-base font-bold text-white">No Lead Inquiries Yet</h3>
                <p className="text-slate-500 text-xs font-light max-w-sm">
                  Once prospective clients submit requirements inside the Instant Quote Configurator, their specifications and quotes will appear here in real-time.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {leads.map((lead) => {
                  const leadWhatsappUrl = lead.clientPhone 
                    ? `https://api.whatsapp.com/send?phone=${lead.clientPhone.replace(/\D/g, '')}&text=${encodeURIComponent(`Hi ${lead.clientName}, I reviewed your brief for a ${lead.projectType} estimated at $${lead.estimatedPrice}. Let's discuss!`)}`
                    : null;
                  
                  return (
                    <motion.div
                      key={lead.id}
                      layout
                      className={`p-6 rounded-2xl border bg-[#0d1425]/60 flex flex-col justify-between space-y-4 relative overflow-hidden transition-all duration-300 ${
                        lead.status === 'contacted' ? 'border-emerald-500/20 opacity-70' : 'border-white/5'
                      }`}
                    >
                      <div className={`absolute top-0 inset-x-0 h-1 ${
                        lead.status === 'contacted' ? 'bg-emerald-500' : 'bg-amber-500'
                      }`} />

                      <div className="space-y-3">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-white text-base flex items-center gap-2">
                              {lead.clientName}
                              {lead.status === 'contacted' && (
                                <span className="text-[9px] bg-emerald-500/10 text-emerald-400 font-bold px-2 py-0.5 rounded-full border border-emerald-500/20">
                                  CONTACTED
                                </span>
                              )}
                            </h3>
                            <p className="text-[10px] text-slate-500 font-mono mt-0.5">
                              {new Date(lead.createdAt).toLocaleString()}
                            </p>
                          </div>
                          
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleToggleLeadStatus(lead.id)}
                              className={`p-1.5 rounded-lg border text-[10px] font-bold cursor-pointer transition ${
                                lead.status === 'contacted' 
                                  ? 'bg-amber-500/10 border-amber-500/20 text-amber-400 hover:bg-amber-500/20' 
                                  : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 hover:bg-emerald-500/20'
                              }`}
                            >
                              <Check size={12} className="inline mr-1" />
                              {lead.status === 'contacted' ? 'Reset' : 'Done'}
                            </button>

                            <button
                              onClick={() => handleDeleteLead(lead.id)}
                              className="p-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/20 rounded-lg cursor-pointer transition"
                            >
                              <Trash2 size={12} />
                            </button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-xs bg-slate-900/40 p-3 rounded-xl border border-white/[0.03]">
                          <div>
                            <span className="text-[9px] text-slate-500 block font-mono">PROJECT TYPE</span>
                            <span className="text-slate-300 font-semibold">{lead.projectType}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-500 block font-mono">TIMELINE SELECTION</span>
                            <span className="text-slate-300 font-semibold">{lead.speedPreference}</span>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-500 block font-mono">EMAIL ADDRESS</span>
                            <a href={`mailto:${lead.clientEmail}`} className="text-indigo-400 hover:underline truncate block">
                              {lead.clientEmail}
                            </a>
                          </div>
                          <div>
                            <span className="text-[9px] text-slate-500 block font-mono">PHONE NUMBER</span>
                            <span className="text-slate-300 block truncate">{lead.clientPhone || 'None Provided'}</span>
                          </div>
                        </div>

                        {lead.featuresSelected && lead.featuresSelected.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[9px] text-slate-500 font-mono">ADDONS INTEGRATIONS</span>
                            <div className="flex flex-wrap gap-1">
                              {lead.featuresSelected.map((feat, idx) => (
                                <span key={idx} className="text-[9px] px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 rounded-md">
                                  {feat}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {lead.clientMessage && (
                          <div className="space-y-1">
                            <span className="text-[9px] text-slate-500 font-mono">CLIENT BRIEF NOTES</span>
                            <p className="text-xs text-slate-400 leading-normal bg-slate-950/40 p-2.5 rounded-lg border border-white/[0.02] italic">
                              "{lead.clientMessage}"
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="pt-3 border-t border-white/5 flex justify-between items-center bg-slate-900/20 -mx-6 -mb-6 p-6 rounded-b-2xl mt-4">
                        <div className="flex items-baseline gap-2">
                          <span className="text-xs text-slate-500">Appraisal:</span>
                          <span className="text-sm font-mono font-black text-amber-400">${lead.estimatedPrice}</span>
                          <span className="text-[10px] text-slate-500 font-mono">({lead.estimatedDays} days)</span>
                        </div>

                        {leadWhatsappUrl && (
                          <a
                            href={leadWhatsappUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-[11px] font-bold flex items-center gap-1.5 transition-all shadow-md shadow-emerald-600/10"
                          >
                            <MessageSquare size={12} />
                            <span>Reply WhatsApp</span>
                          </a>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === "stats" && (
          <div className="space-y-6">
            {isLoading && stats.length === 0 ? (
              <div className="min-h-[200px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                  <div key={stat.id || idx} className="p-6 rounded-2xl bg-[#0d1425]/60 border border-white/5 flex flex-col justify-between text-left relative overflow-hidden">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-2xl font-black text-indigo-400">{stat.value}</span>
                        <span className="text-slate-500 text-xs font-mono">{stat.icon}</span>
                      </div>
                      <h4 className="text-xs font-bold uppercase text-white tracking-wider">{stat.label}</h4>
                      <p className="text-slate-400 text-xs font-light leading-relaxed">{stat.description}</p>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditStat(stat)}
                        className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-400 rounded-lg transition border border-indigo-500/20 cursor-pointer"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteStat(stat.id, stat.label)}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 rounded-lg transition border border-red-500/20 cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "solutions" && (
          <div className="space-y-6">
            {isLoading && solutions.length === 0 ? (
              <div className="min-h-[200px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-rose-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {solutions.map((sol, idx) => (
                  <div key={sol.id || idx} className="p-6 rounded-2xl bg-[#0d1425]/60 border border-white/5 flex flex-col justify-between text-left">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-mono font-extrabold text-slate-500 tracking-wider uppercase">{sol.tagline}</span>
                        <span className="text-xs font-mono text-indigo-400">{sol.icon}</span>
                      </div>
                      <h3 className="text-base font-bold text-white">{sol.title}</h3>
                      <p className="text-slate-400 text-xs font-light leading-relaxed line-clamp-3">{sol.description}</p>
                      <div className="flex flex-wrap gap-2 items-center pt-1">
                        {sol.fullDescription ? (
                          <span className="text-[9px] px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/10 rounded-full font-mono font-bold uppercase tracking-wider">
                            ✓ Has Custom Detail Page
                          </span>
                        ) : (
                          <span className="text-[9px] px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 rounded-full font-mono font-bold uppercase tracking-wider">
                            ⚙ Dynamic Fallback Page
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-1.5 pt-2">
                        {(sol.benefits || []).map((b, bIdx) => (
                          <span key={bIdx} className="text-[9px] px-2 py-0.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/10 rounded-full">
                            {b}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditSolution(sol)}
                        className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-400 rounded-lg transition border border-indigo-500/20 cursor-pointer"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteSolution(sol.id, sol.title)}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 rounded-lg transition border border-red-500/20 cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "pricing" && (
          <div className="space-y-8 text-left">
            {/* Project Types */}
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase">Project Architectures</h3>
                <button
                  onClick={() => handleOpenAddPricingItem("projectType")}
                  className="py-1 px-3 bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 rounded-lg text-xs font-bold hover:bg-indigo-500 hover:text-white transition cursor-pointer font-mono"
                >
                  + Add Type
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(pricing.projectTypes || []).map((type) => (
                  <div key={type.id} className="p-5 rounded-xl bg-slate-900/40 border border-white/5 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="font-bold text-white text-sm">{type.name}</h4>
                        <span className="text-xs font-mono font-black text-indigo-400 flex-shrink-0">${type.basePrice} | {type.baseDays}d</span>
                      </div>
                      <p className="text-slate-400 text-xs font-light leading-relaxed line-clamp-2">{type.description}</p>
                      <span className="text-[10px] text-slate-500 font-mono block">Icon: {type.icon} | ID: {type.id}</span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5 flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditPricingItem("projectType", type)}
                        className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-400 border border-indigo-500/20 rounded-lg transition cursor-pointer"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeletePricingItem("projectType", type.id)}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/20 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Feature Addons */}
            <div className="space-y-4 pt-6 border-t border-white/5">
              <div className="flex items-center justify-between border-b border-white/5 pb-2">
                <h3 className="text-xs font-black tracking-widest text-slate-400 uppercase">Feature Add-On Upgrades</h3>
                <button
                  onClick={() => handleOpenAddPricingItem("feature")}
                  className="py-1 px-3 bg-indigo-500/15 text-indigo-400 border border-indigo-500/25 rounded-lg text-xs font-bold hover:bg-indigo-500 hover:text-white transition cursor-pointer font-mono"
                >
                  + Add Upgrade
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(pricing.features || []).map((feat) => (
                  <div key={feat.id} className="p-5 rounded-xl bg-slate-900/40 border border-white/5 flex flex-col justify-between">
                    <div className="space-y-2">
                      <div className="flex justify-between items-start gap-4">
                        <h4 className="font-bold text-white text-sm">{feat.name}</h4>
                        <span className="text-xs font-mono font-black text-indigo-400 flex-shrink-0">+${feat.price} | +{feat.days}d</span>
                      </div>
                      <p className="text-slate-400 text-xs font-light leading-relaxed line-clamp-2">{feat.desc}</p>
                      <span className="text-[10px] text-slate-500 font-mono block">ID: {feat.id}</span>
                    </div>
                    <div className="mt-4 pt-3 border-t border-white/5 flex justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditPricingItem("feature", feat)}
                        className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-400 border border-indigo-500/20 rounded-lg transition cursor-pointer"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeletePricingItem("feature", feat.id)}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 border border-red-500/20 rounded-lg transition cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "testimonials" && (
          <div className="space-y-6">
            {isLoading && testimonials.length === 0 ? (
              <div className="min-h-[200px] flex items-center justify-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500" />
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {testimonials.map((test, idx) => (
                  <div key={test.id || idx} className="p-6 rounded-2xl bg-[#0d1425]/60 border border-white/5 flex flex-col justify-between text-left">
                    <div className="space-y-4">
                      <div className="flex gap-1 text-amber-400">
                        {[...Array(test.rating || 5)].map((_, rIdx) => (
                          <Star size={12} fill="currentColor" key={rIdx} className="text-amber-400" />
                        ))}
                      </div>
                      <p className="text-slate-300 text-xs leading-relaxed italic">"{test.text}"</p>
                      <div className="flex items-center gap-3 pt-2">
                        {test.avatar && (
                          <img src={test.avatar} alt={test.name} className="w-9 h-9 rounded-full object-cover border border-white/10" />
                        )}
                        <div>
                          <h4 className="font-bold text-white text-xs">{test.name}</h4>
                          <p className="text-slate-500 text-[10px]">{test.role}</p>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleOpenEditTestimonial(test)}
                        className="p-1.5 bg-indigo-500/10 hover:bg-indigo-500/25 text-indigo-400 rounded-lg transition border border-indigo-500/20 cursor-pointer"
                      >
                        <Edit3 size={12} />
                      </button>
                      <button
                        onClick={() => handleDeleteTestimonial(test.id, test.name)}
                        className="p-1.5 bg-red-500/10 hover:bg-red-500/25 text-red-400 rounded-lg transition border border-red-500/20 cursor-pointer"
                      >
                        <Trash2 size={12} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>

      {/* MODALS CORNER */}
      <AnimatePresence>
        {/* 1. Projects Editor Modal */}
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsFormOpen(false)}
              className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm"
            />
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
                  <h2 className="text-lg sm:text-xl font-bold text-white text-left">
                    {editingProject ? "Modify Portfolio Project" : "Add Brand New Showcase"}
                  </h2>
                </div>
                <button onClick={() => setIsFormOpen(false)} className="p-1 rounded-lg hover:bg-white/5 text-slate-400 hover:text-white transition cursor-pointer">✕</button>
              </div>

              <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Project Title *</label>
                    <input 
                      type="text" required placeholder="e.g. Trendwave Store" value={title} onChange={(e) => setTitle(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:border-indigo-500/40 focus:outline-none transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Category *</label>
                    <input 
                      type="text" required placeholder="e.g. Boutique Shop, SaaS, E-Commerce" value={category} onChange={(e) => setCategory(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:border-indigo-500/40 focus:outline-none transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Technologies * (comma-separated)</label>
                    <input 
                      type="text" required placeholder="React, Express, MongoDB" value={tags} onChange={(e) => setTags(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:border-indigo-500/40 focus:outline-none transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Live URL Link</label>
                    <input 
                      type="text" placeholder="https://example.com or #" value={link} onChange={(e) => setLink(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:border-indigo-500/40 focus:outline-none transition"
                    />
                  </div>
                  <div className="space-y-2 p-3 bg-slate-900/30 border border-white/5 rounded-2xl">
                    <div className="flex items-center justify-between">
                      <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider font-bold">Project Image *</label>
                      <button 
                        type="button" 
                        onClick={() => setIsCloudinaryConfigOpen(!isCloudinaryConfigOpen)}
                        className="text-[10px] text-slate-400 hover:text-indigo-400 flex items-center gap-1 transition"
                      >
                        <Settings size={11} />
                        <span>Cloudinary Settings</span>
                      </button>
                    </div>

                    {isCloudinaryConfigOpen && (
                      <div className="p-3 bg-slate-950/80 rounded-xl border border-white/5 space-y-2 text-xs">
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="text-[9px] text-slate-400 font-mono block mb-1">Cloud Name</label>
                            <input 
                              type="text" 
                              placeholder="e.g. haroon_dev" 
                              value={cloudinaryCloudName} 
                              onChange={(e) => handleSaveCloudinaryConfig(e.target.value, cloudinaryUploadPreset)}
                              className="w-full px-2 py-1 bg-slate-900 border border-white/5 rounded-lg text-white text-[11px] focus:outline-none focus:border-indigo-500/40"
                            />
                          </div>
                          <div>
                            <label className="text-[9px] text-slate-400 font-mono block mb-1">Upload Preset (Unsigned)</label>
                            <input 
                              type="text" 
                              placeholder="e.g. portfolio_preset" 
                              value={cloudinaryUploadPreset} 
                              onChange={(e) => handleSaveCloudinaryConfig(cloudinaryCloudName, e.target.value)}
                              className="w-full px-2 py-1 bg-slate-900 border border-white/5 rounded-lg text-white text-[11px] focus:outline-none focus:border-indigo-500/40"
                            />
                          </div>
                        </div>
                        <p className="text-[9px] text-slate-500 leading-normal">
                          Credentials are automatically saved locally. Ensure your Cloudinary upload preset is set to <strong>Unsigned</strong> in your Cloudinary Dashboard Settings under Upload.
                        </p>
                      </div>
                    )}

                    {/* Drag and Drop / File Input */}
                    <div className="relative">
                      <label 
                        className={`flex flex-col items-center justify-center p-4 border-2 border-dashed rounded-xl cursor-pointer transition ${
                          isUploadingImage 
                            ? "border-indigo-500/50 bg-indigo-500/5" 
                            : "border-white/10 hover:border-indigo-500/30 hover:bg-white/[0.02]"
                        }`}
                      >
                        <input 
                          type="file" 
                          accept="image/*" 
                          className="hidden" 
                          onChange={(e) => {
                            if (e.target.files && e.target.files[0]) {
                              handleCloudinaryUpload(e.target.files[0]);
                            }
                          }}
                          disabled={isUploadingImage}
                        />
                        {isUploadingImage ? (
                          <div className="flex flex-col items-center space-y-1">
                            <RefreshCw size={16} className="text-indigo-400 animate-spin" />
                            <span className="text-[11px] text-slate-300 font-medium">{imageUploadProgress}</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center space-y-1 text-center">
                            <Upload size={16} className="text-slate-400" />
                            <span className="text-[11px] text-slate-300 font-medium">Click to upload project photo</span>
                            <span className="text-[9px] text-slate-500">Auto-optimizes & uploads to Cloudinary</span>
                          </div>
                        )}
                      </label>
                    </div>

                    {/* Image Preview if available */}
                    {image && (
                      <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-slate-950 flex items-center justify-center group">
                        <img src={image} alt="Project Preview" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-950/60 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setImage("")}
                            className="px-2.5 py-1 bg-red-500/80 hover:bg-red-500 text-white rounded-lg text-[10px] font-bold transition"
                          >
                            Remove Image
                          </button>
                        </div>
                      </div>
                    )}

                    {imageUploadError && (
                      <div className="space-y-2">
                        <div className="flex items-start gap-1.5 text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl leading-normal">
                          <AlertCircle size={13} className="flex-shrink-0 mt-0.5" />
                          <span>{imageUploadError}</span>
                        </div>

                        {lastSelectedFile && (
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => handleCloudinaryUpload(lastSelectedFile)}
                              className="flex-1 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <RefreshCw size={10} />
                              <span>Retry Upload</span>
                            </button>
                            <button
                              type="button"
                              onClick={handleFallbackBase64}
                              className="flex-1 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg text-[10px] font-bold transition flex items-center justify-center gap-1 cursor-pointer"
                            >
                              <Sparkles size={10} />
                              <span>Use Optimized Image</span>
                            </button>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Direct link input */}
                    <div className="space-y-1">
                      <label className="text-[9px] text-slate-500 font-mono uppercase tracking-wider block">Or Paste Direct URL</label>
                      <input 
                        type="text" required placeholder="https://res.cloudinary.com/..." value={image} onChange={(e) => setImage(e.target.value)}
                        className="w-full px-3 py-1.5 bg-slate-900 border border-white/5 rounded-xl text-white text-xs focus:border-indigo-500/40 focus:outline-none transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-4 flex flex-col justify-between">
                  <div className="space-y-1.5">
                    <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Highlight Glow Theme Accent</label>
                    <div className="grid grid-cols-2 gap-2">
                      {PRESET_GRADIENTS.map((g) => (
                        <button
                          key={g.name} type="button" onClick={() => setHighlightColor(g.class)}
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
                      required rows={4} placeholder="Highlight conversion factors, user statistics, or key tech insights..."
                      value={description} onChange={(e) => setDescription(e.target.value)}
                      className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:border-indigo-500/40 focus:outline-none transition resize-none"
                    />
                  </div>
                  <div className="flex items-center space-x-3 p-3 bg-slate-900/50 border border-white/5 rounded-xl">
                    <input 
                      type="checkbox" id="featured" checked={featured} onChange={(e) => setFeatured(e.target.checked)}
                      className="w-4 h-4 text-indigo-500 border-slate-700 bg-slate-800 rounded focus:ring-indigo-500/30 cursor-pointer"
                    />
                    <label htmlFor="featured" className="text-xs text-slate-300 font-semibold cursor-pointer select-none text-left">
                      Feature on Hero 3D Showcase (recommended for top products)
                    </label>
                  </div>

                  {/* Initial Position option when creating a new project */}
                  {!editingProject && (
                    <div className="space-y-1.5 p-3 bg-indigo-500/5 border border-indigo-500/15 rounded-xl">
                      <label className="text-[10px] text-indigo-300 font-mono uppercase tracking-wider block font-bold">
                        Initial Placement in Portfolio
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setPlacementPosition("start")}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition text-left cursor-pointer ${
                            placementPosition === "start"
                              ? "bg-indigo-500/20 border-indigo-400 text-white"
                              : "bg-slate-900 border-white/5 text-slate-400 hover:text-white"
                          }`}
                        >
                          <span className="block font-bold">⭐ Top (Position #1)</span>
                          <span className="text-[10px] text-slate-500 block">First showcase visitors see</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setPlacementPosition("end")}
                          className={`px-3 py-2 rounded-xl text-xs font-semibold border transition text-left cursor-pointer ${
                            placementPosition === "end"
                              ? "bg-indigo-500/20 border-indigo-400 text-white"
                              : "bg-slate-900 border-white/5 text-slate-400 hover:text-white"
                          }`}
                        >
                          <span className="block font-bold">📋 End (Position #{projects.length + 1})</span>
                          <span className="text-[10px] text-slate-500 block">Add to bottom of portfolio</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                <div className="col-span-1 md:col-span-2 pt-4 border-t border-white/5 flex items-center justify-end gap-3">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="py-2 px-4 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white text-xs font-bold rounded-xl transition cursor-pointer">Cancel</button>
                  <button type="submit" className="py-2 px-5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl transition cursor-pointer flex items-center space-x-1.5 shadow-md shadow-indigo-500/10"><Save size={13} /><span>Save changes</span></button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* 2. Stats Editor Modal */}
        {isStatFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsStatFormOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-[#0d1425] border border-white/10 p-6 rounded-3xl shadow-2xl space-y-6 z-10 text-left">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="font-bold text-white text-lg">{editingStat ? "Edit Statistic" : "Add Statistic"}</h3>
                <button onClick={() => setIsStatFormOpen(false)} className="p-1 hover:bg-white/5 rounded-lg text-slate-400">✕</button>
              </div>
              <form onSubmit={handleSaveStat} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Value * (e.g. 120+, sub-0.8s)</label>
                  <input type="text" required placeholder="120+" value={statValue} onChange={(e) => setStatValue(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Label * (e.g. Projects Completed)</label>
                  <input type="text" required placeholder="Projects Completed" value={statLabel} onChange={(e) => setStatLabel(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Lucide Icon name * (e.g. Trophy, Zap, Users)</label>
                  <input type="text" required placeholder="Trophy" value={statIcon} onChange={(e) => setStatIcon(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Glow Color class (e.g. from-indigo-500 to-purple-500)</label>
                  <input type="text" placeholder="from-indigo-500 to-purple-500" value={statColor} onChange={(e) => setStatColor(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Short Description *</label>
                  <textarea required rows={3} placeholder="Describe the significance of this metric..." value={statDescription} onChange={(e) => setStatDescription(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50 resize-none" />
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsStatFormOpen(false)} className="py-2 px-4 bg-slate-900 text-slate-300 text-xs font-bold rounded-xl">Cancel</button>
                  <button type="submit" className="py-2 px-5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"><Save size={13} /><span>Save</span></button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* 3. Solutions Editor Modal */}
        {isSolutionFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsSolutionFormOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-[#0d1425] border border-white/10 p-6 rounded-3xl shadow-2xl space-y-6 z-10 text-left">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="font-bold text-white text-lg">{editingSolution ? "Edit Specialty Specialty" : "Add Specialty Specialty"}</h3>
                <button onClick={() => setIsSolutionFormOpen(false)} className="p-1 hover:bg-white/5 rounded-lg text-slate-400">✕</button>
              </div>
              <form onSubmit={handleSaveSolution} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Title * (e.g. MERN Stack Applications)</label>
                  <input type="text" required placeholder="MERN Stack Applications" value={solTitle} onChange={(e) => setSolTitle(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Tagline * (e.g. FULL-STACK PRODUCTIVITY)</label>
                  <input type="text" required placeholder="FULL-STACK PRODUCTIVITY" value={solTagline} onChange={(e) => setSolTagline(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Lucide Icon name * (e.g. Cpu, ShoppingBag, Layout)</label>
                  <input type="text" required placeholder="Cpu" value={solIcon} onChange={(e) => setSolIcon(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Core Bullet Benefits * (comma-separated)</label>
                  <input type="text" required placeholder="Dynamic Carts, Secured Payments" value={solBenefits} onChange={(e) => setSolBenefits(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Custom CSS styling accents (Optional)</label>
                  <input type="text" placeholder="text-indigo-400 bg-indigo-500/10 border-indigo-500/10" value={solAccent} onChange={(e) => setSolAccent(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Description * (Short tagline/intro summary)</label>
                  <textarea required rows={3} placeholder="Elaborate on why this specialty is highly valued..." value={solDescription} onChange={(e) => setSolDescription(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50 resize-none" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Detailed Description (Optional - full page description/markdown)</label>
                  <textarea rows={6} placeholder="Describe the full scope, who it is for, typical features, our process, tech stack, and and more details..." value={solFullDescription} onChange={(e) => setSolFullDescription(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50 resize-y" />
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsSolutionFormOpen(false)} className="py-2 px-4 bg-slate-900 text-slate-300 text-xs font-bold rounded-xl">Cancel</button>
                  <button type="submit" className="py-2 px-5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"><Save size={13} /><span>Save</span></button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* 4. Pricing Item Editor Modal */}
        {isPricingFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsPricingFormOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-[#0d1425] border border-white/10 p-6 rounded-3xl shadow-2xl space-y-6 z-10 text-left">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="font-bold text-white text-lg">
                  {editingPricingItem ? `Edit ${pricingItemType === "projectType" ? "Project Architecture" : "Feature Addon"}` : `Add ${pricingItemType === "projectType" ? "Project Architecture" : "Feature Addon"}`}
                </h3>
                <button onClick={() => setIsPricingFormOpen(false)} className="p-1 hover:bg-white/5 rounded-lg text-slate-400">✕</button>
              </div>
              <form onSubmit={handleSavePricingItem} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Unique Item ID * (no spaces, e.g. landing, auth)</label>
                  <input type="text" required disabled={!!editingPricingItem} placeholder="landing" value={priceId} onChange={(e) => setPriceId(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50 disabled:opacity-40" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Option Name *</label>
                  <input type="text" required placeholder="e.g. User Authentication" value={priceName} onChange={(e) => setPriceName(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono uppercase">Base Cost ($) *</label>
                    <input type="number" required placeholder="199" value={priceCost} onChange={(e) => setPriceCost(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50" />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono uppercase">Delivery Timeline (Days) *</label>
                    <input type="number" required placeholder="5" value={priceDays} onChange={(e) => setPriceDays(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50" />
                  </div>
                </div>
                {pricingItemType === "projectType" && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-slate-400 font-mono uppercase">Lucide Icon name * (e.g. Zap, Laptop, ShoppingBag)</label>
                    <input type="text" required placeholder="Zap" value={priceIcon} onChange={(e) => setPriceIcon(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50" />
                  </div>
                )}
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Description Brief *</label>
                  <textarea required rows={3} placeholder="Describe what is covered under this cost valuation..." value={priceDesc} onChange={(e) => setPriceDesc(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50 resize-none" />
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsPricingFormOpen(false)} className="py-2 px-4 bg-slate-900 text-slate-300 text-xs font-bold rounded-xl">Cancel</button>
                  <button type="submit" className="py-2 px-5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"><Save size={13} /><span>Save Option</span></button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {/* 5. Testimonial Editor Modal */}
        {isTestimonialFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setIsTestimonialFormOpen(false)} className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm" />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative w-full max-w-md bg-[#0d1425] border border-white/10 p-6 rounded-3xl shadow-2xl space-y-6 z-10 text-left">
              <div className="flex items-center justify-between border-b border-white/5 pb-3">
                <h3 className="font-bold text-white text-lg">{editingTestimonial ? "Edit Client Review" : "Add Client Review"}</h3>
                <button onClick={() => setIsTestimonialFormOpen(false)} className="p-1 hover:bg-white/5 rounded-lg text-slate-400">✕</button>
              </div>
              <form onSubmit={handleSaveTestimonial} className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Client Name *</label>
                  <input type="text" required placeholder="Faiza K." value={testName} onChange={(e) => setTestName(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Designation & Business * (e.g. Owner, Salon)</label>
                  <input type="text" required placeholder="Founder, Agribusiness" value={testRole} onChange={(e) => setTestRole(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Rating (1 to 5 Stars) *</label>
                  <input type="number" required min={1} max={5} placeholder="5" value={testRating} onChange={(e) => setTestRating(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Avatar Image Link</label>
                  <input type="text" placeholder="https://images.unsplash.com/..." value={testAvatar} onChange={(e) => setTestAvatar(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50" />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] text-slate-400 font-mono uppercase">Review Statement Text *</label>
                  <textarea required rows={3} placeholder="Working with Haroon was an absolute game-changer..." value={testText} onChange={(e) => setTestText(e.target.value)} className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:outline-none focus:border-indigo-500/50 resize-none" />
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-end gap-3">
                  <button type="button" onClick={() => setIsTestimonialFormOpen(false)} className="py-2 px-4 bg-slate-900 text-slate-300 text-xs font-bold rounded-xl">Cancel</button>
                  <button type="submit" className="py-2 px-5 bg-indigo-500 hover:bg-indigo-600 text-white text-xs font-bold rounded-xl flex items-center gap-1.5"><Save size={13} /><span>Save Review</span></button>
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
