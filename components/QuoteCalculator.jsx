import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as Icons from 'lucide-react';
import { ArrowLeft, ArrowRight, Check, Calendar, Zap, Send, DollarSign } from 'lucide-react';
import { pricingService } from '../services/pricingService';

const QuoteCalculator = () => {
  const [projectTypes, setProjectTypes] = useState([]);
  const [features, setFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const [step, setStep] = useState(1);
  const [projectType, setProjectType] = useState(null);
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [timelineSpeed, setTimelineSpeed] = useState('standard'); // 'standard' | 'express' (+25% cost, -30% time)
  
  // Contact details
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        const data = await pricingService.getPricing();
        setProjectTypes(data.projectTypes || []);
        setFeatures(data.features || []);
        if (data.projectTypes && data.projectTypes.length > 0) {
          setProjectType(data.projectTypes[0]);
        }
      } catch (err) {
        console.error("Failed to load pricing config:", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPricing();
  }, []);

  // Math calculations
  const calculateTotal = () => {
    if (!projectType) return 0;
    let price = Number(projectType.basePrice) || 0;
    selectedFeatures.forEach(fid => {
      const feature = features.find(f => f.id === fid);
      if (feature) price += Number(feature.price) || 0;
    });

    if (timelineSpeed === 'express') {
      price = Math.round(price * 1.25);
    }
    return price;
  };

  const calculateDays = () => {
    if (!projectType) return 0;
    let days = Number(projectType.baseDays) || 0;
    selectedFeatures.forEach(fid => {
      const feature = features.find(f => f.id === fid);
      if (feature) days += Number(feature.days) || 0;
    });

    if (timelineSpeed === 'express') {
      days = Math.max(2, Math.round(days * 0.7));
    }
    return days;
  };

  const toggleFeature = (id) => {
    if (selectedFeatures.includes(id)) {
      setSelectedFeatures(prev => prev.filter(fid => fid !== id));
    } else {
      setSelectedFeatures(prev => [...prev, id]);
    }
  };

  const handleNextStep = () => {
    if (step < 4) setStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(prev => prev - 1);
  };

  const handleSubmitQuote = async (e) => {
    e.preventDefault();
    if (!contactName || !contactEmail) {
      alert("Please enter at least your name and email so I can contact you!");
      return;
    }

    setIsSubmitting(true);

    const quoteData = {
      id: "quote_" + Date.now(),
      clientName: contactName,
      clientEmail: contactEmail,
      clientPhone: contactPhone,
      clientMessage: contactMessage,
      projectType: projectType ? projectType.name : '',
      featuresSelected: selectedFeatures.map(fid => features.find(f => f.id === fid)?.name).filter(Boolean),
      speedPreference: timelineSpeed === 'express' ? 'Express Delivery' : 'Standard Delivery',
      estimatedPrice: calculateTotal(),
      estimatedDays: calculateDays(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };

    // Store in localStorage for the Admin Dashboard to read
    try {
      const existingQuotes = JSON.parse(localStorage.getItem('haroon_dev_quotes') || '[]');
      existingQuotes.unshift(quoteData);
      localStorage.setItem('haroon_dev_quotes', JSON.stringify(existingQuotes));
      
      // Let's simulate submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      setIsSuccess(true);
    } catch (err) {
      console.error("Local storage sync error: ", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setStep(1);
    if (projectTypes && projectTypes.length > 0) {
      setProjectType(projectTypes[0]);
    }
    setSelectedFeatures([]);
    setTimelineSpeed('standard');
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setContactMessage('');
    setIsSuccess(false);
  };

  if (isLoading || !projectType) {
    return (
      <div className="py-24 bg-[#0a0f1d] flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500" />
      </div>
    );
  }

  return (
    <section id="quote-configurator" className="py-24 bg-[#0a0f1d] border-t border-white/5 relative overflow-hidden">
      {/* Background visual flourishes */}
      <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-amber-500/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-0 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 md:px-8 relative z-10">
        
        {/* Title Block */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <span className="text-xs font-black tracking-[0.3em] text-amber-400 uppercase">
            ESTIMATE YOUR BRIEF
          </span>
          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">
            Get an Instant Quote
          </h2>
          <p className="text-slate-400 text-sm md:text-base font-light">
            Select your requirements below. Our interactive calculator compiles the projected budget and timeline instantly. No guesswork.
          </p>
        </div>

        {/* Configurator Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Form Area (Left) */}
          <div className="lg:col-span-8 bg-[#0d1425]/70 border border-white/5 rounded-3xl p-6 md:p-8 backdrop-blur-xl min-h-[460px] flex flex-col justify-between">
            
            <AnimatePresence mode="wait">
              {isSuccess ? (
                <motion.div
                  key="success-card"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="text-center py-12 space-y-6 flex flex-col items-center justify-center h-full"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mb-2">
                    <Check size={32} className="animate-bounce" />
                  </div>
                  <div className="space-y-2 max-w-md">
                    <h3 className="text-2xl font-bold text-white">Project Brief Submitted!</h3>
                    <p className="text-slate-400 text-sm leading-relaxed font-light">
                      Thank you, <strong className="text-white">{contactName}</strong>! Your estimation of <strong>${calculateTotal()}</strong> has been locked in. I will review your specifications and contact you at <strong className="text-white">{contactEmail}</strong> within 12 hours.
                    </p>
                  </div>
                  <button
                    onClick={handleReset}
                    className="px-6 py-2.5 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
                  >
                    Estimate Another Project
                  </button>
                </motion.div>
              ) : (
                <div className="space-y-6">
                  {/* Step Progress Header */}
                  <div className="flex justify-between items-center text-xs font-semibold text-slate-500 border-b border-white/5 pb-4">
                    <span>STEP {step} OF 4</span>
                    <span className="text-indigo-400">
                      {step === 1 && 'Select Project Architecture'}
                      {step === 2 && 'Choose Added Features'}
                      {step === 3 && 'Execution Timeline'}
                      {step === 4 && 'Handover details'}
                    </span>
                  </div>

                  {/* STEP 1: PROJECT TYPES */}
                  {step === 1 && (
                    <motion.div
                      key="step-1"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4"
                    >
                      <h3 className="text-lg font-bold text-slate-200 text-left">Choose your project style:</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {projectTypes.map(type => {
                          const Icon = Icons[type.icon] || Icons.Laptop;
                          const isSelected = projectType.id === type.id;
                          return (
                            <button
                              key={type.id}
                              onClick={() => setProjectType(type)}
                              className={`p-5 rounded-2xl border text-left transition-all duration-300 flex gap-4 cursor-pointer hover:bg-white/[0.02] ${
                                isSelected 
                                  ? 'bg-indigo-600/10 border-indigo-500/50 shadow-lg shadow-indigo-500/5' 
                                  : 'bg-slate-900/30 border-white/5'
                              }`}
                            >
                              <div className={`p-3 rounded-xl flex-shrink-0 flex items-center justify-center h-12 w-12 ${
                                isSelected ? 'bg-indigo-500 text-white' : 'bg-white/5 text-slate-400'
                              }`}>
                                <Icon size={20} />
                              </div>
                              <div className="space-y-1">
                                <h4 className="text-sm font-bold text-white">{type.name}</h4>
                                <p className="text-[11px] text-slate-400 leading-normal line-clamp-2 font-light">
                                  {type.description}
                                </p>
                                <span className="inline-block text-xs font-mono text-indigo-400 font-bold pt-1">
                                  Starts from ${type.basePrice}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 2: FEATURES ADDONS */}
                  {step === 2 && (
                    <motion.div
                      key="step-2"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4 text-left"
                    >
                      <h3 className="text-lg font-bold text-slate-200">Select desired feature integrations:</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                        {features.map(feat => {
                          const isSelected = selectedFeatures.includes(feat.id);
                          return (
                            <button
                              key={feat.id}
                              onClick={() => toggleFeature(feat.id)}
                              className={`p-4 rounded-xl border text-left transition-all duration-300 flex items-center justify-between cursor-pointer ${
                                isSelected 
                                  ? 'bg-indigo-600/10 border-indigo-500/40' 
                                  : 'bg-slate-900/20 border-white/5'
                              }`}
                            >
                              <div className="space-y-1 max-w-[80%]">
                                <h4 className="text-xs font-bold text-white flex items-center gap-1.5">
                                  {feat.name}
                                  {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />}
                                </h4>
                                <p className="text-[10px] text-slate-500 leading-normal line-clamp-1">
                                  {feat.desc}
                                </p>
                                <span className="text-[10px] text-indigo-400 font-mono font-bold">
                                  +${feat.price} | +{feat.days}d
                                </span>
                              </div>
                              <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${
                                isSelected ? 'bg-indigo-500 border-indigo-400 text-white' : 'border-white/10'
                              }`}>
                                {isSelected && <Icons.Check size={12} />}
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 3: SPEED TIMELINE */}
                  {step === 3 && (
                    <motion.div
                      key="step-3"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-6 text-left"
                    >
                      <h3 className="text-lg font-bold text-slate-200">Execution Timeline & Speed:</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={() => setTimelineSpeed('standard')}
                          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                            timelineSpeed === 'standard' 
                              ? 'bg-indigo-600/10 border-indigo-500/50' 
                              : 'bg-slate-900/20 border-white/5'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-white text-sm">Standard Delivery</h4>
                            <Calendar size={16} className="text-slate-400" />
                          </div>
                          <p className="text-slate-400 text-[11px] font-light leading-normal mb-2">
                            Paced, secure, and fully optimized development cycle following strict schema and speed checkmarks.
                          </p>
                          <span className="text-xs text-indigo-400 font-mono font-bold">
                            Base Price Rates (Takes ~{projectType.baseDays + selectedFeatures.reduce((acc, fid) => acc + (FEATURES.find(f => f.id === fid)?.days || 0), 0)} days)
                          </span>
                        </button>

                        <button
                          onClick={() => setTimelineSpeed('express')}
                          className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                            timelineSpeed === 'express' 
                              ? 'bg-rose-600/10 border-rose-500/50' 
                              : 'bg-slate-900/20 border-white/5'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-2">
                            <h4 className="font-bold text-white text-sm flex items-center gap-1.5">
                              Express Delivery
                              <span className="text-[8px] bg-rose-500 text-white font-black px-1.5 py-0.5 rounded uppercase">RUSH</span>
                            </h4>
                            <Zap size={16} className="text-rose-400 animate-pulse" />
                          </div>
                          <p className="text-slate-400 text-[11px] font-light leading-normal mb-2">
                            Priority engineering cycle. Double-teamed efforts to cut overall development time by 30%.
                          </p>
                          <span className="text-xs text-rose-400 font-mono font-bold">
                            +25% Cost Rate | -30% Dev Duration
                          </span>
                        </button>
                      </div>
                    </motion.div>
                  )}

                  {/* STEP 4: CONTACT & SUMMARY */}
                  {step === 4 && (
                    <motion.div
                      key="step-4"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      className="space-y-4 text-left"
                    >
                      <h3 className="text-lg font-bold text-slate-200">Tell us about your business:</h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Your Full Name *</label>
                          <input 
                            type="text" 
                            required
                            placeholder="John Doe"
                            value={contactName}
                            onChange={(e) => setContactName(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:border-indigo-500/40 focus:outline-none transition"
                          />
                        </div>

                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Email Address *</label>
                          <input 
                            type="email" 
                            required
                            placeholder="john@example.com"
                            value={contactEmail}
                            onChange={(e) => setContactEmail(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:border-indigo-500/40 focus:outline-none transition"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Phone / WhatsApp Number (Optional)</label>
                          <input 
                            type="text" 
                            placeholder="+92 300 1234567"
                            value={contactPhone}
                            onChange={(e) => setContactPhone(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:border-indigo-500/40 focus:outline-none transition"
                          />
                        </div>

                        <div className="space-y-1 sm:col-span-2">
                          <label className="text-[10px] text-slate-400 font-mono uppercase tracking-wider">Additional Project Notes / Message</label>
                          <textarea 
                            rows={3}
                            placeholder="Describe any particular features, links, or visual preferences you would like to incorporate..."
                            value={contactMessage}
                            onChange={(e) => setContactMessage(e.target.value)}
                            className="w-full px-3 py-2 bg-slate-900 border border-white/5 rounded-xl text-white text-sm focus:border-indigo-500/40 focus:outline-none transition resize-none"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </div>
              )}
            </AnimatePresence>

            {/* Navigation buttons */}
            {!isSuccess && (
              <div className="flex items-center justify-between border-t border-white/5 pt-6 mt-6">
                <button
                  disabled={step === 1}
                  onClick={handlePrevStep}
                  className={`px-4 py-2 text-xs font-bold text-slate-400 hover:text-white transition-colors flex items-center gap-1.5 cursor-pointer select-none ${
                    step === 1 ? 'opacity-30 cursor-not-allowed' : ''
                  }`}
                >
                  <ArrowLeft size={14} />
                  <span>Back</span>
                </button>

                {step < 4 ? (
                  <button
                    onClick={handleNextStep}
                    className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/20 transition-all transform hover:-translate-y-0.5 cursor-pointer"
                  >
                    <span>Next step</span>
                    <ArrowRight size={14} />
                  </button>
                ) : (
                  <button
                    onClick={handleSubmitQuote}
                    disabled={isSubmitting}
                    className={`px-7 py-3 bg-gradient-to-r from-rose-600 to-amber-600 text-white font-bold rounded-xl text-xs flex items-center gap-2 shadow-lg shadow-rose-600/20 transition-all transform hover:-translate-y-0.5 cursor-pointer ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-1" />
                        <span>Estimating brief...</span>
                      </>
                    ) : (
                      <>
                        <Send size={13} />
                        <span>Submit Project Brief</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            )}

          </div>

          {/* Real-time Invoice Summary (Right) */}
          <div className="lg:col-span-4 bg-slate-950/60 border border-white/10 rounded-3xl p-6 relative overflow-hidden backdrop-blur-sm self-stretch flex flex-col justify-between">
            {/* Stamp decoration */}
            <div className="absolute top-4 right-4 text-[9px] font-mono border border-indigo-500/20 text-indigo-400/40 px-2 py-0.5 rounded transform rotate-6 uppercase select-none">
              LIVE APPRAISAL
            </div>

            <div className="space-y-6">
              <div className="border-b border-white/5 pb-4">
                <h3 className="font-bold text-white text-base">Brief Breakdown</h3>
                <p className="text-[10px] text-slate-500 font-mono uppercase tracking-widest mt-1">Estimations</p>
              </div>

              {/* Items List */}
              <div className="space-y-4 text-left">
                {/* Base Project Type */}
                <div className="flex justify-between items-start gap-3">
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold text-slate-300 block">{projectType.name}</span>
                    <span className="text-[9px] text-slate-500 font-mono">Base implementation package</span>
                  </div>
                  <span className="text-xs font-mono font-bold text-white">${projectType.basePrice}</span>
                </div>

                {/* Selected Features */}
                {selectedFeatures.length > 0 && (
                  <div className="space-y-2.5 pt-2.5 border-t border-white/5">
                    {selectedFeatures.map(fid => {
                      const feat = features.find(f => f.id === fid);
                      if (!feat) return null;
                      return (
                        <div key={feat.id} className="flex justify-between items-center text-xs">
                          <span className="text-slate-400 font-light flex items-center gap-1.5">
                            <span className="w-1 h-1 rounded-full bg-indigo-500" />
                            {feat.name}
                          </span>
                          <span className="text-slate-300 font-mono">${feat.price}</span>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Speed Premium */}
                {timelineSpeed === 'express' && (
                  <div className="flex justify-between items-center text-xs pt-2.5 border-t border-white/5 text-rose-400">
                    <span className="font-medium">Express Speed Premium (+25%)</span>
                    <span className="font-mono font-bold">+${Math.round((projectType.basePrice + selectedFeatures.reduce((acc, fid) => acc + (features.find(f => f.id === fid)?.price || 0), 0)) * 0.25)}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Grand Totals */}
            <div className="pt-6 border-t border-white/10 mt-8 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-xs text-slate-400 flex items-center gap-1.5 font-light">
                  <Calendar size={13} />
                  Timeline Delivery
                </span>
                <span className="text-sm font-bold text-white font-mono">
                  {calculateDays()} Days
                </span>
              </div>

              <div className="flex justify-between items-center p-3 bg-white/5 border border-white/5 rounded-2xl">
                <span className="text-xs text-slate-300 font-bold flex items-center gap-1.5">
                  <DollarSign size={13} className="text-amber-400" />
                  Estimated Cost
                </span>
                <span className="text-xl font-black text-amber-400 font-mono">
                  ${calculateTotal()}
                </span>
              </div>

              <p className="text-[10px] text-slate-500 text-center leading-normal italic">
                * Estimated quotes exclude any subscription costs. Complete system handover with all files and domain configuration included.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
};

export default QuoteCalculator;
