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
  CreditCard
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
  const [mandates, setMandates] = useState<FinancialMandates>(DEFAULT_MAS_MANDATES);
  const [history, setHistory] = useState<GovernanceEnvelope[]>([]);
  const [pendingRequest, setPendingRequest] = useState<GovernanceEnvelope | null>(null);
  const [lastResult, setLastResult] = useState<ValidationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [history]);

  // --- Simulation Logic ---

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

    // Step-by-step processing animation
    setIsProcessing(true);
    setLastResult(null);
    setPendingRequest(null);

    for (let i = 1; i <= 4; i++) {
      setProcessingStep(i);
      await new Promise(r => setTimeout(r, 600));
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
    <div className="min-h-screen bg-[#020617] text-slate-200">
      {/* Dynamic Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden opacity-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-800 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 p-6 lg:p-10 space-y-8 max-w-[1600px] mx-auto">
        {/* Modern Header */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-8 pb-8 border-b border-white/5">
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ rotate: -20, scale: 0.8 }}
                animate={{ rotate: 0, scale: 1 }}
                className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg glow-blue"
              >
                <Shield size={32} className="text-white" />
              </motion.div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
                  FAGF-FS <span className="text-blue-500 tracking-widest font-mono text-sm align-middle px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-lg">CORE</span>
                </h1>
                <p className="text-slate-400 font-medium text-sm mt-1">
                  Foundational Agentic Governance Framework for Financial Services
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <div className="flex -space-x-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="w-8 h-8 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center overflow-hidden">
                  <img src={`https://i.pravatar.cc/100?u=${i}`} alt="user" className="w-full h-full object-cover opacity-80" />
                </div>
              ))}
            </div>
            <div className="h-8 w-px bg-white/10 hidden md:block" />
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 px-4 py-2 bg-emerald-500/10 text-emerald-400 text-[10px] font-bold rounded-lg border border-emerald-500/20 uppercase tracking-widest leading-none">
                <CheckCircle size={12} />
                MAS Compliant
              </span>
              <span className="flex items-center gap-2 px-4 py-2 bg-slate-500/10 text-slate-400 text-[10px] font-bold rounded-lg border border-slate-500/20 uppercase tracking-widest leading-none">
                <Lock size={12} />
                AP2 Immutable
              </span>
            </div>
          </div>
        </header>

        <main className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">

          {/* Left Column: Simulation & Flow */}
          <div className="xl:col-span-4 space-y-8">

            {/* Agent Simulator */}
            <section className="glass rounded-3xl p-8 border border-white/5 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-3">
                  <Zap size={22} className="text-amber-400" />
                  Agent Payload Simulator
                </h2>
                <div className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              </div>

              <div className="grid grid-cols-1 gap-4">
                {[
                  { id: 'routine', label: 'FairPrice Procurement', icon: <CheckCircle className="text-emerald-500" />, desc: 'Trusted Merchant • $25.00' },
                  { id: 'high_value', label: 'Apple Store SG', icon: <UserCheck className="text-blue-500" />, desc: 'Hardware Upgrade • $150.00' },
                  { id: 'new_merchant', label: 'Neighborhood Hawker', icon: <AlertTriangle className="text-amber-500" />, desc: 'New Entity • $15.00' },
                  { id: 'blocked', label: 'HighRollers Crypto', icon: <XCircle className="text-rose-500" />, desc: 'Forbidden Category • $10.00' }
                ].map((btn) => (
                  <button
                    key={btn.id}
                    disabled={isProcessing}
                    onClick={() => simulateTransaction(btn.id as any)}
                    className="group relative w-full p-4 glass-light rounded-2xl hover:bg-white/5 border border-white/5 text-left transition-all overflow-hidden"
                  >
                    <div className="relative z-10 flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-3 bg-white/5 rounded-xl group-hover:bg-white/10 transition-colors">
                          {btn.icon}
                        </div>
                        <div>
                          <p className="font-bold text-slate-200 group-hover:text-white transition-colors">{btn.label}</p>
                          <p className="text-[10px] text-slate-500 font-medium uppercase tracking-wider mt-0.5">{btn.desc}</p>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-slate-600 group-hover:text-slate-300 transition-all group-hover:translate-x-1" />
                    </div>
                  </button>
                ))}
              </div>
            </section>

            {/* Validation Lifecycle Visualization */}
            <section className="glass rounded-3xl p-8 border border-white/5 space-y-6 overflow-hidden">
              <h2 className="text-lg font-bold text-white flex items-center gap-3">
                <RefreshCw size={18} className="text-indigo-400" />
                Validation Lifecycle
              </h2>

              <div className="relative space-y-8 pl-4 border-l border-white/5">
                {[
                  { step: 1, label: 'Standardize Payload', desc: 'Wrapping in Governance Envelope', icon: <Database /> },
                  { step: 2, label: 'Context Retrieval', desc: 'Querying State Layer (History/Risk)', icon: <Activity /> },
                  { step: 3, label: 'Mandate Evaluation', desc: 'Running Deterministic Rules', icon: <Shield /> },
                  { step: 4, label: 'Validation Outcome', desc: 'Block / Pass / Escalate', icon: <CheckCircle /> }
                ].map((s) => (
                  <div key={s.step} className={`relative flex items-center gap-4 transition-all duration-500 ${processingStep >= s.step ? 'opacity-100 translate-x-1' : 'opacity-30'}`}>
                    <div className="absolute left-[-23px] w-3 h-3 rounded-full border-2 border-[#020617] bg-slate-800 flex items-center justify-center">
                      {processingStep > s.step && <div className="w-1.5 h-1.5 rounded-full bg-blue-500" />}
                      {processingStep === s.step && <div className="w-full h-full rounded-full bg-blue-500 animate-ping opacity-75" />}
                    </div>
                    <div className={`p-2 rounded-lg ${processingStep === s.step ? 'bg-blue-500/20 text-blue-400' : 'bg-white/5 text-slate-500'}`}>
                      {React.cloneElement(s.icon as React.ReactElement, { size: 16 })}
                    </div>
                    <div>
                      <p className={`text-xs font-bold leading-tight ${processingStep === s.step ? 'text-white' : 'text-slate-400'}`}>{s.label}</p>
                      <p className="text-[10px] text-slate-500 mt-1 uppercase tracking-tight font-mono">{s.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          {/* Center/Right Column: Live Result & Mandates */}
          <div className="xl:col-span-8 space-y-8">

            {/* Real-time Result / HITL */}
            <div className="min-h-[200px] flex flex-col justify-center">
              <AnimatePresence mode="wait">
                {pendingRequest ? (
                  <motion.div
                    key="hitl"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="p-1 rounded-[2rem] bg-gradient-to-br from-amber-500/40 to-orange-600/40 border border-amber-500/20 shadow-2xl"
                  >
                    <div className="glass rounded-[1.9rem] p-8 space-y-8">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                          <div className="p-4 bg-amber-500/20 rounded-2xl text-amber-500 ring-1 ring-amber-500/30">
                            <UserCheck size={32} />
                          </div>
                          <div>
                            <h2 className="text-2xl font-black text-white uppercase tracking-tighter italic">HITL Intervention Required</h2>
                            <p className="text-amber-500/80 font-bold text-xs uppercase tracking-widest mt-1">Foundational Safety Override Triggered</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <button onClick={handleReject} className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all uppercase text-sm tracking-widest">
                            Deny
                          </button>
                          <button onClick={handleApprove} className="px-8 py-3 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-2xl shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all uppercase text-sm tracking-widest active:scale-95">
                            Grant Approval
                          </button>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-light p-6 rounded-2xl border border-white/5 space-y-4">
                          <div className="flex items-center gap-3 text-slate-400">
                            <CreditCard size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Proposal</span>
                          </div>
                          <div>
                            <p className="text-2xl font-bold text-white">${pendingRequest.transaction.amount.toFixed(2)}</p>
                            <p className="text-sm font-medium text-slate-400">{pendingRequest.transaction.merchantName}</p>
                          </div>
                        </div>
                        <div className="glass-light p-6 rounded-2xl border border-white/5 space-y-4">
                          <div className="flex items-center gap-3 text-slate-400">
                            <ArrowRight size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Reasoning</span>
                          </div>
                          <p className="text-xs font-medium text-slate-300 italic leading-relaxed">"{pendingRequest.reasoning}"</p>
                        </div>
                        <div className="glass-light p-6 rounded-2xl border border-white/5 space-y-4">
                          <div className="flex items-center gap-3 text-slate-400">
                            <AlertTriangle size={14} />
                            <span className="text-[10px] font-black uppercase tracking-widest">Violation</span>
                          </div>
                          <div className="space-y-2">
                            {lastResult?.triggeredMandates.map(id => (
                              <div key={id} className="text-[10px] font-bold text-amber-500 uppercase tracking-tight">{id} Violation Detected</div>
                            ))}
                            <p className="text-[11px] font-medium text-slate-400">{lastResult?.mitigationRisk}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : lastResult ? (
                  <motion.div
                    key="result"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-10 rounded-3xl border ${lastResult.allowed ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'} flex items-center justify-between gap-8`}
                  >
                    <div className="flex items-center gap-8">
                      <div className={`p-5 rounded-2xl ${lastResult.allowed ? 'bg-emerald-500/20 text-emerald-400 ring-1 ring-emerald-500/30' : 'bg-rose-500/20 text-rose-400 ring-1 ring-rose-500/30'}`}>
                        {lastResult.allowed ? <CheckCircle size={40} /> : <XCircle size={40} />}
                      </div>
                      <div>
                        <h3 className={`text-2xl font-bold ${lastResult.allowed ? 'text-emerald-400' : 'text-rose-400'} uppercase tracking-tighter`}>
                          {lastResult.allowed ? 'Autonomous Execution Approved' : 'Rule-Based Block Encountered'}
                        </h3>
                        <p className="text-slate-400 text-sm font-medium mt-1 leading-relaxed max-w-lg">{lastResult.reason}</p>
                        {!lastResult.allowed && (
                          <p className="text-[10px] font-bold text-rose-500/80 uppercase tracking-widest mt-3 flex items-center gap-2">
                            <Shield size={12} />
                            Risk Mitigated: {lastResult.mitigationRisk}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-1">Validator Node</div>
                      <div className="font-mono text-xs text-slate-300">FAGF-NODE-017 / SG-MAS</div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="glass rounded-3xl p-16 flex flex-col items-center justify-center text-center space-y-6"
                  >
                    <div className="p-6 rounded-full bg-white/5 border border-white/5 animate-pulse">
                      <Shield size={48} className="text-slate-700" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-xl font-bold text-slate-400">Validator Standing By</h3>
                      <p className="text-slate-600 font-medium text-sm">Waiting for Agent Proposals from the Execution Layer</p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Bottom Grid: Mandates & History */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Mandate Board */}
              <div className="glass rounded-3xl border border-white/5 overflow-hidden">
                <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/[0.02]">
                  <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                    <Settings size={14} className="text-slate-500" />
                    Active Mandates
                  </h2>
                  <span className="text-[8px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold uppercase tracking-widest">Stable</span>
                </div>
                <div className="divide-y divide-white/5 h-[400px] overflow-auto">
                  {Object.entries(mandates).map(([key, mandate]) => (
                    <div key={key} className="p-5 hover:bg-white/5 transition-all group">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors uppercase tracking-tight">{mandate.id}</h3>
                        <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${mandate.severity === 'high' ? 'bg-rose-500/20 text-rose-500 border border-rose-500/20' :
                            mandate.severity === 'medium' ? 'bg-amber-500/20 text-amber-500 border border-amber-500/20' :
                              'bg-blue-500/20 text-blue-500 border border-blue-500/20'
                          }`}>
                          {mandate.severity} Impact
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium leading-relaxed">{mandate.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Historical Ledger */}
              <div className="glass rounded-3xl border border-white/5 overflow-hidden flex flex-col">
                <div className="p-6 border-b border-white/5 flex items-center bg-white/[0.02]">
                  <h2 className="text-sm font-black uppercase tracking-widest flex items-center gap-3">
                    <History size={14} className="text-slate-500" />
                    Immutable Audit Ledger
                  </h2>
                </div>
                <div ref={scrollRef} className="p-6 space-y-4 flex-1 overflow-auto h-[400px]">
                  <AnimatePresence initial={false}>
                    {history.length > 0 ? (
                      history.map((tx, idx) => (
                        <motion.div
                          key={tx.transaction.timestamp}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className="p-4 rounded-2xl bg-white/[0.03] border border-white/5 flex items-center justify-between group hover:bg-white/[0.06] transition-all"
                        >
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center border border-emerald-500/20">
                              <CheckCircle size={18} />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-white">${tx.transaction.amount.toFixed(2)} — {tx.transaction.merchantName}</div>
                              <div className="text-[9px] text-slate-500 font-black uppercase tracking-widest mt-0.5">
                                {new Date(tx.transaction.timestamp).toLocaleTimeString()} • {tx.transaction.paymentMethod}
                              </div>
                            </div>
                          </div>
                          <div className="text-[9px] font-black px-2.5 py-1 bg-white/[0.05] border border-white/5 rounded-lg text-slate-400 uppercase tracking-widest group-hover:border-blue-500/30 group-hover:text-blue-400 transition-all">
                            {tx.transaction.category}
                          </div>
                        </motion.div>
                      ))
                    ) : (
                      <div className="h-full flex flex-col items-center justify-center text-slate-600 space-y-4 py-20 grayscale opacity-40">
                        <Terminal size={32} />
                        <p className="text-[10px] font-black uppercase tracking-[0.2em]">Audit Log Empty</p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </div>

            {/* Bottom Banner */}
            <div className="p-8 rounded-[2rem] bg-gradient-to-r from-blue-600 to-indigo-700 overflow-hidden relative group">
              <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10" />
              <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-6">
                  <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20">
                    <Cpu size={32} className="text-white" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white uppercase tracking-tighter italic">Foundational Engine Integrated</h3>
                    <p className="text-white/70 text-sm font-bold uppercase tracking-widest leading-none mt-1">Ready for Multi-Project Scaling</p>
                  </div>
                </div>
                <button className="px-8 py-4 bg-white text-blue-600 font-black rounded-2xl shadow-xl hover:scale-105 active:scale-95 transition-all uppercase text-sm tracking-widest">
                  Export Configuration
                </button>
              </div>
            </div>

          </div>
        </main>

        <footer className="pt-12 pb-6 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
          <div className="flex items-center gap-8">
            <span className="flex items-center gap-2"><BarChart3 size={12} /> System OK</span>
            <span className="flex items-center gap-2"><Lock size={12} /> Mandates Enforced</span>
            <span className="flex items-center gap-2"><Activity size={12} /> MAS Profile V1.2</span>
          </div>
          <div>
            © Agentic Financial Standards Org 2026
          </div>
        </footer>
      </div>
    </div>
  );
}
