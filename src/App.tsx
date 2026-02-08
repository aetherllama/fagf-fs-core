import React, { useState, useEffect, useRef } from 'react';
import {
  Shield,
  Settings,
  Activity,
  CheckCircle,
  XCircle,
  AlertTriangle,
  UserCheck,
  Zap,
  History,
  ArrowRight,
  Database,
  Lock,
  ChevronRight,
  RefreshCw,
  Terminal,
  Cpu,
  BarChart3,
  CreditCard,
  FileText,
  List,
  Info,
  PlayCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GovernanceValidator } from './core/validator';
import { DEFAULT_MAS_MANDATES } from './core/mandates';
import {
  FinancialMandates,
  GovernanceEnvelope,
  ValidationResult
} from './core/types';

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'specification' | 'ledger'>('simulator');
  const [mandates, setMandates] = useState<FinancialMandates>(DEFAULT_MAS_MANDATES);
  const [history, setHistory] = useState<GovernanceEnvelope[]>([]);
  const [pendingRequest, setPendingRequest] = useState<GovernanceEnvelope | null>(null);
  const [lastResult, setLastResult] = useState<ValidationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);

  // Guided Mode Logic
  const [isGuidedMode, setIsGuidedMode] = useState(false);
  const [guidedStep, setGuidedStep] = useState(0);

  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current && activeTab === 'ledger') {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history, activeTab]);

  // --- Simulation Logic ---

  const guidedScenarios = [
    {
      title: "1. Intent Capture",
      desc: "The AI agent proposes a payment. We wrap this in a 'Governance Envelope' containing the transaction and the agent's reasoning.",
      action: "simulate",
      scenario: 'routine'
    },
    {
      title: "2. Contextual Lookup",
      desc: "FAGF-FS queries the State Layer to find merchant history and past risk metrics. This provides 'Identity Context'.",
      action: "show_trace",
      step: 2
    },
    {
      title: "3. Mandate Suite",
      desc: "The Validator runs the Governance Mandates (Spending Limits, Velocity, Merchant Reputation). This is deterministic.",
      action: "show_trace",
      step: 3
    },
    {
      title: "4. Execution & Audit",
      desc: "If cleared, the transaction is cryptographically signed and committed to the ledger for finality and audit.",
      action: "show_result"
    }
  ];

  const handleGuidedNext = async () => {
    if (guidedStep === 0) {
      await simulateTransaction('routine');
    }
    if (guidedStep < guidedScenarios.length - 1) {
      setGuidedStep(guidedStep + 1);
    } else {
      setIsGuidedMode(false);
      setGuidedStep(0);
    }
  };

  const simulateTransaction = async (scenario: 'routine' | 'high_value' | 'blocked' | 'new_merchant') => {
    if (isProcessing) return;

    let envelope: GovernanceEnvelope;

    switch (scenario) {
      case 'routine':
        envelope = {
          transaction: {
            amount: 25,
            destination: 'merch_001',
            merchantName: 'FairPrice SG',
            category: 'Groceries',
            timestamp: Date.now(),
            paymentMethod: 'PayNow'
          },
          reasoning: 'Routine office supplies procurement within autonomous threshold.',
          context: { isNewMerchant: false, historyDepth: 12, riskScore: 1 }
        };
        break;
      case 'high_value':
        envelope = {
          transaction: {
            amount: 150,
            destination: 'merch_002',
            merchantName: 'Apple Store SG',
            category: 'Electronics',
            timestamp: Date.now(),
            paymentMethod: 'DBS PayLah!'
          },
          reasoning: 'Urgent replacement of broken peripheral for development team.',
          context: { isNewMerchant: false, historyDepth: 5, riskScore: 2 }
        };
        break;
      case 'new_merchant':
        envelope = {
          transaction: {
            amount: 15,
            destination: 'merch_999',
            merchantName: 'Nasi Lemak Stall #4',
            category: 'Food',
            timestamp: Date.now(),
            paymentMethod: 'DBS PayLah!'
          },
          reasoning: 'First-time snack purchase from local neighborhood vendor.',
          context: { isNewMerchant: true, historyDepth: 0, riskScore: 3 }
        };
        break;
      case 'blocked':
        envelope = {
          transaction: {
            amount: 10,
            destination: 'scam_888',
            merchantName: 'HighRollers Crypto',
            category: 'Gambling',
            timestamp: Date.now(),
            paymentMethod: 'DBS PayLah!'
          },
          reasoning: 'High-yield allocation attempt via unverified gambling portal.',
          context: { isNewMerchant: true, historyDepth: 0, riskScore: 5 }
        };
        break;
    }

    setIsProcessing(true);
    setLastResult(null);
    setPendingRequest(null);

    // In guided mode, we don't auto-advance steps too fast
    const delay = isGuidedMode ? 200 : 600;

    for (let i = 1; i <= 4; i++) {
      setProcessingStep(i);
      await new Promise(r => setTimeout(r, delay));
    }

    const result = GovernanceValidator.validate(envelope, mandates, history);
    setLastResult(result);
    setIsProcessing(false);
    setProcessingStep(0);

    if (result.allowed && !result.requiresApproval) {
      setHistory([envelope, ...history]);
    } else if (result.requiresApproval) {
      setPendingRequest(envelope);
    }
  };

  const handleApprove = () => {
    if (pendingRequest) {
      setHistory([pendingRequest, ...history]);
      setPendingRequest(null);
      setLastResult(null);
    }
  };

  const handleReject = () => {
    setPendingRequest(null);
    setLastResult(null);
  };

  return (
    <div className="min-h-screen bg-[#020617] text-slate-100 selection:bg-blue-500/30">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-800 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 p-6 lg:p-10 space-y-8 max-w-[1600px] mx-auto">
        {/* Modern Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-6 border-b border-white/5">
          <div className="space-y-4">
            <div className="flex items-center gap-5">
              <motion.div
                initial={{ rotate: -20, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                className="p-4 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl shadow-2xl glow-blue"
              >
                <Shield size={44} className="text-white" />
              </motion.div>
              <div>
                <h1 className="text-4xl font-black tracking-tighter text-white flex items-center gap-3">
                  FAGF-FS <span className="text-blue-400 tracking-[0.2em] font-mono text-xs align-middle px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg uppercase">Validator v1</span>
                </h1>
                <p className="text-slate-400 font-bold text-base mt-1 flex items-center gap-2">
                  <Activity size={18} className="text-blue-500" />
                  Foundational Agentic Governance Framework
                </p>
              </div>
            </div>
          </div>

          <nav className="flex items-center gap-2 p-1.5 bg-white/5 rounded-2xl border border-white/5 backdrop-blur-2xl">
            {[
              { id: 'simulator', label: 'Simulator', icon: <Zap size={18} /> },
              { id: 'specification', label: 'Specification', icon: <FileText size={18} /> },
              { id: 'ledger', label: 'Audit Ledger', icon: <List size={18} /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => { setActiveTab(tab.id as any); setIsGuidedMode(false); }}
                className={`flex items-center gap-3 px-8 py-3.5 rounded-xl text-sm font-black uppercase tracking-widest transition-all ${activeTab === tab.id
                    ? 'tab-active'
                    : 'text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>
        </header>

        <main className="min-h-[72vh]">
          <AnimatePresence mode="wait">
            {activeTab === 'simulator' && (
              <motion.div
                key="simulator"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-start"
              >
                {/* Simulator Controls */}
                <div className="xl:col-span-4 space-y-8">
                  <section className="glass rounded-[2.5rem] p-10 space-y-10 relative overflow-hidden">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <h2 className="text-3xl font-black text-white flex items-center gap-3">
                          <Zap size={28} className="text-amber-400" />
                          Simulator
                        </h2>
                        <p className="text-slate-400 text-base font-bold">Inject a transaction to test the mandates.</p>
                      </div>
                      {!isGuidedMode && (
                        <button
                          onClick={() => { setIsGuidedMode(true); setGuidedStep(0); }}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600/20 text-blue-400 rounded-xl border border-blue-500/30 font-black text-xs uppercase tracking-widest hover:bg-blue-600 hover:text-white transition-all"
                        >
                          <PlayCircle size={14} /> Guided Tour
                        </button>
                      )}
                    </div>

                    {isGuidedMode ? (
                      <div className="p-8 bg-blue-500/5 rounded-3xl border-2 border-blue-500/20 space-y-6">
                        <div className="flex items-center gap-4 text-blue-400">
                          <Info size={24} />
                          <h3 className="text-xl font-black uppercase tracking-tight">{guidedScenarios[guidedStep].title}</h3>
                        </div>
                        <p className="text-slate-200 text-lg font-medium leading-relaxed">
                          {guidedScenarios[guidedStep].desc}
                        </p>
                        <button
                          onClick={handleGuidedNext}
                          disabled={isProcessing}
                          className="w-full py-5 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl flex items-center justify-center gap-3 shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98]"
                        >
                          {isProcessing ? <RefreshCw className="animate-spin" /> : (guidedStep === guidedScenarios.length - 1 ? 'Finish Tour' : 'Next Step')}
                          <ChevronRight />
                        </button>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 gap-5">
                        {[
                          { id: 'routine', label: 'FairPrice Proc.', icon: <CheckCircle className="text-emerald-500" />, desc: 'Trusted • $25.00', color: 'bg-emerald-500/5' },
                          { id: 'high_value', label: 'Apple Store SG', icon: <UserCheck className="text-blue-500" />, desc: 'High Value • $150.00', color: 'bg-blue-500/5' },
                          { id: 'new_merchant', label: 'Neighborhood Hawker', icon: <AlertTriangle className="text-amber-500" />, desc: 'Untrusted • $15.00', color: 'bg-amber-500/5' },
                          { id: 'blocked', label: 'Forbidden Portal', icon: <XCircle className="text-rose-500" />, desc: 'Blacklisted • $10.00', color: 'bg-rose-500/5' }
                        ].map((btn) => (
                          <button
                            key={btn.id}
                            disabled={isProcessing}
                            onClick={() => simulateTransaction(btn.id as any)}
                            className={`group relative w-full p-6 rounded-3xl border border-white/5 text-left transition-all hover:border-white/20 hover:translate-x-1 active:scale-[0.98] ${btn.color}`}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-6">
                                <div className="p-4 bg-white/5 rounded-2xl group-hover:bg-white/10 transition-colors">
                                  {btn.icon}
                                </div>
                                <div>
                                  <p className="text-xl font-black text-white">{btn.label}</p>
                                  <p className="text-sm text-slate-400 font-bold uppercase tracking-widest mt-1">{btn.desc}</p>
                                </div>
                              </div>
                              <ArrowRight size={24} className="text-slate-600 group-hover:text-blue-400 transition-all opacity-0 group-hover:opacity-100 group-hover:translate-x-2" />
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </section>

                  <section className="glass rounded-[2.5rem] p-10 space-y-8">
                    <h2 className="text-xl font-black text-white uppercase tracking-widest flex items-center gap-3 border-b border-white/5 pb-5">
                      <RefreshCw size={24} className="text-indigo-400" />
                      Trace Log
                    </h2>
                    <div className="relative space-y-12 pl-6 border-l-2 border-white/10">
                      {[
                        { step: 1, label: 'Normalization', desc: 'Crafting Governance Envelope' },
                        { step: 2, label: 'Contextualization', desc: 'State Lookup (Merchant/Risk)' },
                        { step: 3, label: 'Evaluations', desc: 'Running Mandate Engine' },
                        { step: 4, label: 'Enforcement', desc: 'Policy-Based Commit/Kill' }
                      ].map((s) => (
                        <div key={s.step} className={`relative flex flex-col transition-all duration-700 ${processingStep >= s.step ? 'opacity-100 translate-x-2' : 'opacity-15'}`}>
                          <div className="absolute left-[-32px] top-1.5 w-5 h-5 rounded-full border-4 border-[#020617] bg-slate-800 flex items-center justify-center">
                            {processingStep > s.step && <div className="w-2 h-2 rounded-full bg-blue-400 shadow-[0_0_15px_#60a5fa]" />}
                            {processingStep === s.step && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse shadow-[0_0_20px_#3b82f6]" />}
                          </div>
                          <p className={`text-base font-black uppercase tracking-widest ${processingStep === s.step ? 'text-blue-400' : 'text-white'}`}>{s.label}</p>
                          <p className="text-sm text-slate-400 font-bold mt-1.5 uppercase opacity-60 tracking-tight">{s.desc}</p>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* Right Area: Results & HITL */}
                <div className="xl:col-span-8 space-y-10">
                  <div className="min-h-[440px] flex flex-col">
                    <AnimatePresence mode="wait">
                      {pendingRequest ? (
                        <motion.div
                          key="hitl"
                          initial={{ opacity: 0, scale: 0.98 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          className="flex-1 glass rounded-[3.5rem] border-2 border-amber-500/20 p-12 flex flex-col justify-between shadow-ghost-amber"
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-10">
                            <div className="flex items-center gap-10">
                              <div className="p-8 bg-amber-500/10 rounded-[2.5rem] text-amber-500 ring-2 ring-amber-500/20 animate-pulse">
                                <UserCheck size={64} />
                              </div>
                              <div>
                                <h3 className="text-5xl font-black text-white tracking-tighter italic uppercase">HITL INTERVENTION</h3>
                                <p className="text-amber-500 font-black text-base tracking-[0.2em] uppercase mt-3 italic">Policy Override Requested by FAGF-FS Engine</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-6">
                              <button onClick={handleReject} className="px-12 py-6 bg-white/5 hover:bg-white/10 text-white font-black rounded-[2rem] border border-white/10 transition-all uppercase text-base tracking-widest active:scale-95">
                                REJECT
                              </button>
                              <button onClick={handleApprove} className="px-12 py-6 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-[2rem] shadow-[0_0_50px_rgba(245,158,11,0.4)] transition-all uppercase text-base tracking-widest active:scale-95">
                                AUTHORIZE
                              </button>
                            </div>
                          </div>

                          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 mt-16">
                            <div className="glass-light p-10 rounded-[2.5rem] space-y-5 border border-white/5">
                              <div className="flex items-center gap-4 text-slate-400">
                                <CreditCard size={20} />
                                <span className="text-sm font-black uppercase tracking-[0.2em]">Proposal</span>
                              </div>
                              <div>
                                <p className="text-4xl font-black text-white tracking-tighter">${pendingRequest.transaction.amount.toFixed(2)}</p>
                                <p className="text-xl font-bold text-blue-400 mt-2">{pendingRequest.transaction.merchantName}</p>
                              </div>
                            </div>
                            <div className="glass-light p-10 rounded-[2.5rem] space-y-5 border border-white/5">
                              <div className="flex items-center gap-4 text-slate-400">
                                <ArrowRight size={20} />
                                <span className="text-sm font-black uppercase tracking-[0.2em]">Context</span>
                              </div>
                              <p className="text-lg font-bold text-slate-200 leading-relaxed italic">"{pendingRequest.reasoning}"</p>
                            </div>
                            <div className="glass-light p-10 rounded-[2.5rem] space-y-5 border border-white/5">
                              <div className="flex items-center gap-4 text-slate-400">
                                <Shield size={20} />
                                <span className="text-sm font-black uppercase tracking-[0.2em]">Mandates</span>
                              </div>
                              <div className="space-y-4">
                                {lastResult?.triggeredMandates.map(id => (
                                  <div key={id} className="text-xs font-black text-amber-500 bg-amber-500/10 px-4 py-2.5 rounded-xl border border-amber-500/20 uppercase tracking-widest w-fit">{id} Flagged</div>
                                ))}
                                <p className="text-base font-bold text-slate-400 mt-2">{lastResult?.mitigationRisk}</p>
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ) : lastResult ? (
                        <motion.div
                          key="result"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          className={`flex-1 flex flex-col justify-center p-14 rounded-[3.5rem] border-2 shadow-2xl ${lastResult.allowed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'}`}
                        >
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-12">
                            <div className="flex items-center gap-12">
                              <div className={`p-10 rounded-[3rem] ${lastResult.allowed ? 'bg-emerald-500/20 text-emerald-400 ring-2 ring-emerald-500/20 shadow-ghost-emerald' : 'bg-rose-500/20 text-rose-400 ring-2 ring-rose-500/20 shadow-ghost-rose'}`}>
                                {lastResult.allowed ? <CheckCircle size={84} /> : <XCircle size={84} />}
                              </div>
                              <div className="space-y-4">
                                <h3 className={`text-5xl font-black ${lastResult.allowed ? 'text-emerald-400' : 'text-rose-400'} uppercase tracking-tight`}>
                                  {lastResult.allowed ? 'EXECUTION APPROVED' : 'TRANSACTION REJECTED'}
                                </h3>
                                <p className="text-white text-2xl font-black max-w-3xl leading-tight">{lastResult.reason}</p>
                                {!lastResult.allowed && (
                                  <div className="inline-flex items-center gap-4 px-6 py-3 bg-rose-500/10 text-rose-400 rounded-2xl border border-rose-500/20 mt-6 shadow-lg shadow-rose-950/20">
                                    <Shield size={22} />
                                    <span className="font-black text-base uppercase tracking-widest">Enforcement: {lastResult.mitigationRisk}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                            <div className="text-right space-y-3 opacity-30 group hover:opacity-100 transition-all">
                              <p className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">Governance Node</p>
                              <p className="font-mono text-base text-white font-black">VALIDATOR_NODE_07X</p>
                              <div className="flex items-center justify-end gap-2 text-emerald-400 font-mono text-xs">
                                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> SIGNED_OFF
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      ) : (
                        <motion.div
                          key="idle"
                          className="flex-1 glass rounded-[3.5rem] flex flex-col items-center justify-center p-24 text-center space-y-10 border border-white/[0.03] shadow-inner"
                        >
                          <div className="p-12 rounded-full bg-white/5 border border-white/5 animate-pulse-slow">
                            <Shield size={80} className="text-slate-600" />
                          </div>
                          <div className="space-y-4">
                            <h3 className="text-3xl font-black text-white uppercase tracking-[0.4em] opacity-80">System Ready</h3>
                            <p className="text-slate-400 text-xl font-bold max-w-md mx-auto">Select a scenario to trigger the autonomous governance lifecycle.</p>
                          </div>
                          {!isGuidedMode && (
                            <button
                              onClick={() => { setIsGuidedMode(true); setGuidedStep(0); }}
                              className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white font-black rounded-2xl flex items-center gap-3 transition-all active:scale-95"
                            >
                              <PlayCircle size={20} /> Start Guided Experience
                            </button>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'specification' && (
              <motion.div
                key="specification"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="max-w-6xl mx-auto glass rounded-[3.5rem] p-16 border border-white/10 shadow-3xl overflow-hidden relative"
              >
                {/* Decorative Background Spec Elements */}
                <div className="absolute top-0 right-0 p-12 opacity-10 font-mono text-[140px] font-black pointer-events-none select-none italic text-blue-500">
                  FAGF_v1
                </div>

                <div className="prose relative z-10 max-w-none">
                  <div className="flex items-center gap-6 mb-16">
                    <div className="px-5 py-2.5 bg-blue-500/10 text-blue-400 border border-blue-500/20 rounded-2xl font-black uppercase text-sm tracking-[0.2em] flex items-center gap-3">
                      <Database size={18} /> FAGF-FS Standard v1.0.0-Stable
                    </div>
                  </div>

                  <h1 className="text-6xl font-black tracking-tight mb-10 text-white">Foundational Agentic Governance Framework</h1>

                  <h2 className="text-3xl">1. Abstract</h2>
                  <p className="text-xl">FAGF-FS establishes a deterministic validation layer for AI-driven transactions. Unlike traditional payments, it enforces safety at the <strong>Logic Layer</strong> before any commitment is made to the <strong>Rail Layer</strong>.</p>

                  <h2 className="text-3xl">2. Core Architectural Pillars</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-10 mb-16">
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                      <Lock className="text-blue-400 mb-4" size={32} />
                      <h4 className="text-xl font-black text-white mb-2 uppercase">Immutability</h4>
                      <p className="text-slate-400 text-sm font-medium">Policy is codified and cannot be bypassed by agentic hallucinations.</p>
                    </div>
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                      <Activity className="text-emerald-400 mb-4" size={32} />
                      <h4 className="text-xl font-black text-white mb-2 uppercase">Interpretability</h4>
                      <p className="text-slate-400 text-sm font-medium">Every decision has a semantic trace linking intent to execution.</p>
                    </div>
                    <div className="p-8 bg-white/5 rounded-3xl border border-white/10">
                      <UserCheck className="text-amber-400 mb-4" size={32} />
                      <h4 className="text-xl font-black text-white mb-2 uppercase">HITL Rails</h4>
                      <p className="text-slate-400 text-sm font-medium">Graceful escalation for high-stakes or ambiguous scenarios.</p>
                    </div>
                  </div>

                  <h2 className="text-3xl">3. Mandate Taxonomy</h2>
                  <p className="text-lg">The framework categorizes all safety rules into four primary buckets for regulatory alignment:</p>

                  <table className="w-full text-lg mt-8">
                    <thead>
                      <tr>
                        <th className="text-xl">Mandate Type</th>
                        <th className="text-xl">Regulatory Focus</th>
                        <th className="text-xl">Safety Outcome</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td><strong>AuthZ</strong></td>
                        <td>Anti-Fraud / AML</td>
                        <td>Prevents unauthorized merchant interactions.</td>
                      </tr>
                      <tr>
                        <td><strong>Spending</strong></td>
                        <td>Consumer Protection</td>
                        <td>Enforces hard limits on capital movement.</td>
                      </tr>
                      <tr>
                        <td><strong>Velocity</strong></td>
                        <td>Operational Risk</td>
                        <td>Prevents runaway bot behavior.</td>
                      </tr>
                      <tr>
                        <td><strong>Reasoning</strong></td>
                        <td>Interpretability</td>
                        <td>Ensures intent matches actual details.</td>
                      </tr>
                    </tbody>
                  </table>

                  <h2 className="text-3xl mt-16">4. Active Compliance Ruleset</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                    {Object.entries(mandates).map(([key, mandate]) => (
                      <div key={key} className="p-10 bg-white/[0.03] rounded-[2.5rem] border border-white/5 hover:bg-white/[0.06] hover:border-blue-500/20 transition-all group">
                        <div className="flex items-center gap-4 mb-5">
                          <p className="text-xl font-black text-blue-400 group-hover:text-blue-300 transition-colors uppercase tracking-tight">{mandate.id}</p>
                          <span className={`px-4 py-1.5 rounded-xl text-xs font-black uppercase ${mandate.severity === 'high' ? 'bg-rose-500/20 text-rose-400 shadow-lg shadow-rose-950/20' : 'bg-blue-500/20 text-blue-400 shadow-lg shadow-blue-950/20'
                            }`}>{mandate.severity} Impact</span>
                        </div>
                        <p className="text-lg text-slate-300 font-bold leading-relaxed">{mandate.description}</p>
                        <div className="mt-6 pt-6 border-t border-white/5 text-xs font-black text-slate-500 uppercase tracking-widest italic flex items-center gap-3">
                          <Shield size={14} className="text-slate-600" />
                          Mitigation: {mandate.riskDisclosure}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'ledger' && (
              <motion.div
                key="ledger"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                className="max-w-6xl mx-auto space-y-10"
              >
                <div className="glass rounded-[3.5rem] overflow-hidden flex flex-col shadow-3xl shadow-black/50 border border-white/[0.03]">
                  <div className="p-12 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between bg-white/[0.02] gap-10">
                    <div className="space-y-3">
                      <h2 className="text-5xl font-black text-white uppercase tracking-tighter">Audit Ledger</h2>
                      <p className="text-slate-400 text-lg font-black flex items-center gap-3">
                        <Lock size={20} className="text-emerald-500" />
                        CRYPTO-CERTIFIED COMPLIANCE RECORD
                      </p>
                    </div>
                    <div className="text-right p-6 bg-white/5 rounded-[2rem] border border-white/5">
                      <span className="text-sm font-black text-slate-500 uppercase tracking-[0.3em]">Ledger Integrity</span>
                      <div className="flex items-center gap-3 justify-end mt-2 text-emerald-400 font-mono text-base font-black">
                        <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse glow-emerald" />
                        VERIFIED_TX_STREAM
                      </div>
                    </div>
                  </div>

                  <div ref={scrollRef} className="p-12 space-y-8 min-h-[55vh] overflow-auto custom-scrollbar">
                    {history.length > 0 ? (
                      [...history].reverse().map((tx, idx) => (
                        <motion.div
                          key={tx.transaction.timestamp}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="group relative"
                        >
                          <div className="p-10 rounded-[3rem] bg-white/[0.04] border border-white/5 flex flex-col lg:flex-row lg:items-center justify-between hover:bg-white/[0.08] hover:border-blue-500/40 transition-all duration-500 cursor-default shadow-lg group-hover:shadow-blue-900/10">
                            <div className="flex items-center gap-10">
                              <div className="w-20 h-20 rounded-[2rem] bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20 shadow-ghost-emerald">
                                <CheckCircle size={44} />
                              </div>
                              <div className="space-y-4">
                                <div className="flex items-center gap-5">
                                  <p className="text-4xl font-black text-white tracking-tighter">${tx.transaction.amount.toFixed(2)}</p>
                                  <span className="text-slate-600 font-black text-3xl">—</span>
                                  <p className="text-2xl font-black text-slate-200 tracking-tight">{tx.transaction.merchantName}</p>
                                </div>
                                <div className="flex flex-wrap items-center gap-8">
                                  <div className="text-sm font-black text-slate-500 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <History size={16} className="text-blue-500" />
                                    {new Date(tx.transaction.timestamp).toLocaleString()}
                                  </div>
                                  <div className="text-sm font-black text-indigo-400 uppercase tracking-[0.2em] flex items-center gap-3">
                                    <CreditCard size={16} />
                                    {tx.transaction.paymentMethod}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="mt-8 lg:mt-0 text-left lg:text-right space-y-4">
                              <div className="inline-block px-6 py-3 bg-white/[0.08] border border-white/20 rounded-2xl text-white text-sm font-black uppercase tracking-[0.3em] group-hover:text-blue-400 group-hover:border-blue-500/50 transition-all shadow-inner">
                                {tx.transaction.category}
                              </div>
                              <p className="text-xs font-mono text-slate-600 font-black uppercase tracking-widest flex items-center lg:justify-end gap-2">
                                TX_HASH: <span className="text-slate-400">0x{Math.random().toString(16).slice(2, 14)}</span>
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center py-28 grayscale opacity-40 space-y-10">
                        <Terminal size={100} className="text-slate-500" />
                        <div className="text-center space-y-4">
                          <p className="text-3xl font-black text-white uppercase tracking-[0.5em]">Log Vault Empty</p>
                          <p className="text-slate-500 font-black text-lg uppercase tracking-widest">Awaiting cryptographic commits from the logic layer.</p>
                        </div>
                        <button onClick={() => setActiveTab('simulator')} className="px-12 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] text-sm font-black uppercase tracking-[0.3em] hover:bg-white/10 hover:text-white transition-all shadow-xl active:scale-95">
                          Launch First Simulator Sequence
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </main>

        <footer className="pt-16 pb-10 border-t border-white/10 flex flex-col xxl:flex-row items-center justify-between gap-12 text-sm font-black text-slate-500 uppercase tracking-[0.5em]">
          <div className="flex flex-wrap justify-center items-center gap-12">
            <span className="flex items-center gap-4 hover:text-emerald-400 transition-colors cursor-default"><Activity size={20} className="text-emerald-500" /> Infrastructure Node Status: GREEN</span>
            <span className="flex items-center gap-4 hover:text-blue-400 transition-colors cursor-default"><Lock size={20} className="text-blue-500" /> Governance Standard: FAGF-FS-1.0</span>
            <span className="flex items-center gap-4 hover:text-indigo-400 transition-colors cursor-default"><BarChart3 size={20} className="text-indigo-500" /> System Integrity: SIGNED</span>
          </div>
          <div className="flex items-center gap-6 text-slate-700">
            <span>© 2026 Agentic Financial Standards Org</span>
            <div className="w-2 h-2 rounded-full bg-slate-800 shadow-inner" />
            <span className="text-slate-600">PRODUCTION_REFERENCE_v1.4</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
