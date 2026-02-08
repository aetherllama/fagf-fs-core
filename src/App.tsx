import React, { useState, useEffect } from 'react';
import {
  Shield,
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
  Cpu,
  BarChart3,
  CreditCard,
  FileText,
  Sparkles,
  Info,
  Terminal,
  LayoutDashboard,
  Wallet,
  ShieldCheck,
  Settings,
  TrendingUp,
  Clock,
  Target,
  PieChart,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GovernanceValidator } from './core/validator';
import { DEFAULT_MAS_MANDATES } from './core/mandates';
import {
  FinancialMandates,
  GovernanceEnvelope,
  ValidationResult
} from './core/types';

type ScenarioId = 'routine_saas' | 'high_value_travel' | 'blocked_crypto' | 'hitl_subscription' | 'none';

interface Scenario {
  id: ScenarioId;
  label: string;
  amount: number;
  merchant: string;
  category: string;
  reasoning: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: 'routine_saas',
    label: 'Cloud Infrastructure (Routine)',
    amount: 15.00,
    merchant: 'AWS Cloud Services',
    category: 'SaaS / API',
    reasoning: 'Automated scaled-down of dev instances for cost optimization.'
  },
  {
    id: 'high_value_travel',
    label: 'Travel Booking (High Value)',
    amount: 1250.00,
    merchant: 'Singapore Airlines',
    category: 'Travel / Logistics',
    reasoning: 'Urgent relocation of key talent for project high-criticality phase.'
  },
  {
    id: 'blocked_crypto',
    label: 'Forbidden Exchange (Blocked)',
    amount: 50.00,
    merchant: 'Binance / Global',
    category: 'Ungoverned Gambling',
    reasoning: 'Attempting yield-generation on unverified digital asset portal.'
  },
  {
    id: 'hitl_subscription',
    label: 'New SaaS Tool (HITL)',
    amount: 49.00,
    merchant: 'Cursor Pro AI',
    category: 'Productivity Tool',
    reasoning: 'First-time subscription for AI-native code editor for the core team.'
  }
];

export default function App() {
  const [activeTab, setActiveTab] = useState<'simulator' | 'vault' | 'compliance'>('simulator');
  const [selectedScenario, setSelectedScenario] = useState<ScenarioId>('none');
  const [history, setHistory] = useState<GovernanceEnvelope[]>([]);
  const [pendingRequest, setPendingRequest] = useState<GovernanceEnvelope | null>(null);
  const [lastResult, setLastResult] = useState<ValidationResult | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showGuide, setShowGuide] = useState(true);
  const [guideStep, setGuideStep] = useState(0);

  const simulate = async (id: ScenarioId) => {
    if (id === 'none' || isProcessing) return;
    const scenario = SCENARIOS.find(s => s.id === id);
    if (!scenario) return;

    const envelope: GovernanceEnvelope = {
      transaction: {
        amount: scenario.amount,
        destination: scenario.id,
        merchantName: scenario.merchant,
        category: scenario.category,
        timestamp: Date.now(),
        paymentMethod: 'Corporate Card'
      },
      reasoning: scenario.reasoning,
      context: {
        isNewMerchant: scenario.id === 'hitl_subscription',
        historyDepth: scenario.id === 'routine_saas' ? 12 : 0,
        riskScore: id === 'blocked_crypto' ? 5 : id === 'high_value_travel' ? 2 : 1
      }
    };

    setIsProcessing(true);
    setLastResult(null);
    setPendingRequest(null);

    await new Promise(r => setTimeout(r, 1800));

    const result = GovernanceValidator.validate(envelope, DEFAULT_MAS_MANDATES, history);
    setLastResult(result);
    setIsProcessing(false);

    if (result.allowed && !result.requiresApproval) {
      setHistory([envelope, ...history]);
      if (guideStep === 1) setGuideStep(2);
    } else if (result.requiresApproval) {
      setPendingRequest(envelope);
      if (guideStep === 1) setGuideStep(2);
    }
  };

  const stats = {
    totalTransactions: history.length,
    successRate: history.length > 0 ? 100 : 0,
    avgLatency: '1.2s',
    hitlRate: '12%'
  };

  return (
    <div className="flex h-screen bg-[#0a0d14] text-[#f8fafc] font-sans mesh-gradient overflow-hidden">
      {/* Sidebar */}
      <motion.aside
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4 }}
        className="w-72 glass-sidebar flex flex-col p-6 space-y-8 z-20 relative"
      >
        <div className="flex items-center gap-3 px-2">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="p-2.5 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl glow-blue"
          >
            <Shield size={24} className="text-white" />
          </motion.div>
          <div>
            <span className="text-xl font-black tracking-tight">FAGF-FS</span>
            <p className="text-[10px] font-bold text-blue-400 uppercase tracking-wider">Pro Dashboard</p>
          </div>
        </div>

        <nav className="flex-1 space-y-2">
          {[
            { id: 'simulator', icon: <Zap size={18} />, label: 'Live Simulator', badge: 'Active' },
            { id: 'vault', icon: <Database size={18} />, label: 'Audit Vault', count: history.length },
            { id: 'compliance', icon: <ShieldCheck size={18} />, label: 'Compliance', badge: 'Beta' },
            { id: 'settings', icon: <Settings size={18} />, label: 'Settings' },
          ].map((item, idx) => (
            <motion.button
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: idx * 0.05 + 0.2 }}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl font-semibold text-sm transition-all group ${activeTab === item.id
                  ? 'bg-gradient-to-r from-blue-600/20 to-blue-500/10 text-blue-400 border border-blue-500/30 shadow-lg'
                  : 'text-slate-400 hover:text-white hover:bg-white/5'
                }`}
            >
              <div className="flex items-center gap-3">
                {item.icon}
                <span>{item.label}</span>
              </div>
              {item.badge && <span className="badge-premium bg-blue-500/10 text-blue-400 border-blue-500/20 text-[10px] px-2 py-0.5">{item.badge}</span>}
              {item.count !== undefined && item.count > 0 && (
                <span className="badge-premium bg-emerald-500/10 text-emerald-400 border-emerald-500/20 text-[10px] px-2 py-0.5">{item.count}</span>
              )}
            </motion.button>
          ))}
        </nav>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="p-5 rounded-2xl border border-white/5 bg-gradient-to-br from-slate-800/40 to-slate-900/40 space-y-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 pulse-indicator" />
            <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">System Health</span>
          </div>
          <div className="space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span className="font-medium">Node Status</span>
              <span className="text-emerald-400 font-bold">ONLINE</span>
            </div>
            <div className="flex justify-between text-slate-400">
              <span className="font-medium">Uptime</span>
              <span className="text-slate-300 font-mono">99.99%</span>
            </div>
          </div>
        </motion.div>
      </motion.aside>

      {/* Main Area */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {/* Header */}
        <motion.header
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="h-20 glass-header flex items-center justify-between px-10 z-10"
        >
          <div className="flex items-center gap-8">
            <div>
              <h1 className="text-2xl font-black tracking-tight capitalize">{activeTab}</h1>
              <p className="text-xs text-slate-500 font-medium mt-0.5">Real-time agentic governance control center</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <motion.div
              whileHover={{ scale: 1.02 }}
              className="flex items-center gap-3 px-4 py-2.5 rounded-xl glass-premium"
            >
              <div className="flex items-center gap-2">
                <Activity size={14} className="text-emerald-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">FAGF-1.0.9</span>
              </div>
            </motion.div>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center text-white font-bold shadow-lg glow-blue">
              <UserCheck size={20} />
            </div>
          </div>
        </motion.header>

        {/* Content */}
        <div className="flex-1 overflow-auto p-10 space-y-8">

          {activeTab === 'simulator' && (
            <>
              {/* Top Stats Row */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="grid grid-cols-4 gap-6"
              >
                {[
                  { label: 'Total Validated', value: stats.totalTransactions, icon: <Target className="text-blue-500" />, trend: '+12%' },
                  { label: 'Success Rate', value: `${stats.successRate}%`, icon: <TrendingUp className="text-emerald-500" />, trend: '+2.3%' },
                  { label: 'Avg Latency', value: stats.avgLatency, icon: <Clock className="text-amber-500" /> },
                  { label: 'HITL Rate', value: stats.hitlRate, icon: <PieChart className="text-indigo-500" /> }
                ].map((stat, idx) => (
                  <motion.div
                    key={stat.label}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3 + idx * 0.05 }}
                    className="glass-premium p-6 rounded-2xl hover-lift group"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="p-2.5 bg-white/5 rounded-lg group-hover:scale-110 transition-transform">
                        {stat.icon}
                      </div>
                      {stat.trend && (
                        <span className="text-xs font-bold text-emerald-400">{stat.trend}</span>
                      )}
                    </div>
                    <div className="space-y-1">
                      <p className="text-3xl font-black tracking-tight">{stat.value}</p>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{stat.label}</p>
                    </div>
                  </motion.div>
                ))}
              </motion.div>

              {/* Scenario Selector */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="glass-premium p-8 rounded-3xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-500/10 rounded-xl border border-blue-500/20">
                      <LayoutDashboard size={24} className="text-blue-500" />
                    </div>
                    <div>
                      <h3 className="text-xl font-black tracking-tight">Simulation Control</h3>
                      <p className="text-sm text-slate-400 font-medium mt-0.5">Select a payment profile to test governance logic</p>
                    </div>
                  </div>
                  <select
                    value={selectedScenario}
                    onChange={(e) => {
                      const val = e.target.value as ScenarioId;
                      setSelectedScenario(val);
                      simulate(val);
                      if (guideStep === 0) setGuideStep(1);
                    }}
                    className="dropdown-premium min-w-[340px] outline-none font-semibold"
                  >
                    <option value="none">Select a scenario...</option>
                    {SCENARIOS.map(s => (
                      <option key={s.id} value={s.id}>{s.label}</option>
                    ))}
                  </select>
                </div>

                {/* Result Display */}
                <AnimatePresence mode="wait">
                  {isProcessing ? (
                    <motion.div
                      key="processing"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="flex flex-col items-center justify-center py-20 space-y-6"
                    >
                      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
                        <RefreshCw size={48} className="text-blue-500" />
                      </motion.div>
                      <div className="text-center space-y-2">
                        <h4 className="text-xl font-black uppercase tracking-widest">Processing Governance</h4>
                        <p className="text-slate-400 font-medium">Running mandate evaluation pipeline...</p>
                      </div>
                    </motion.div>
                  ) : lastResult ? (
                    <motion.div
                      key="result"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`p-10 rounded-2xl flex items-center gap-10 ${lastResult.allowed ? 'result-success' : 'result-danger'} border border-white/5`}
                    >
                      <div className={`p-6 rounded-3xl ${lastResult.allowed ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'}`}>
                        {lastResult.allowed ? <CheckCircle size={72} strokeWidth={2.5} /> : <XCircle size={72} strokeWidth={2.5} />}
                      </div>
                      <div className="flex-1 space-y-4">
                        <h3 className={`text-4xl font-black uppercase tracking-tighter ${lastResult.allowed ? 'text-emerald-400' : 'text-rose-400'}`}>
                          {lastResult.allowed ? 'VALIDATED' : 'BLOCKED'}
                        </h3>
                        <p className="text-xl font-semibold leading-tight text-white/90">{lastResult.reason}</p>
                        <div className="flex gap-3 pt-2">
                          {lastResult.triggeredMandates.map(m => (
                            <span key={m} className={`badge-premium ${lastResult.allowed ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'}`}>
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  ) : pendingRequest ? (
                    <motion.div
                      key="hitl"
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className="p-10 rounded-2xl result-warning border border-amber-500/20"
                    >
                      <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-6">
                          <div className="p-5 bg-amber-500/20 text-amber-500 rounded-2xl pulse-indicator">
                            <UserCheck size={40} />
                          </div>
                          <div>
                            <h3 className="text-3xl font-black uppercase tracking-tight text-amber-400">HITL Required</h3>
                            <p className="text-amber-500/70 font-semibold text-sm tracking-wide uppercase mt-1">Human Authorization Requested</p>
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <button onClick={() => setPendingRequest(null)} className="px-8 py-3.5 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl border border-white/10 text-sm transition-all uppercase tracking-wider">
                            DENY
                          </button>
                          <button onClick={() => { setHistory([pendingRequest, ...history]); setPendingRequest(null); }} className="px-10 py-3.5 bg-amber-600 hover:bg-amber-500 text-white font-black rounded-xl text-base shadow-xl glow-amber transition-all active:scale-95 uppercase tracking-wider">
                            APPROVE
                          </button>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-6 pt-6 border-t border-amber-500/10">
                        <div className="space-y-2">
                          <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Agent Reasoning</p>
                          <p className="text-base font-medium text-white/80 leading-snug">"{pendingRequest.reasoning}"</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Transaction Details</p>
                        <div className="flex items-baseline gap-3">
                          <p className="text-3xl font-black">${pendingRequest.transaction.amount}</p>
                          <ArrowRight size={16} className="text-slate-600" />
                          <p className="text-lg font-bold text-blue-400">{pendingRequest.transaction.merchantName}</p>
                        </div>
                      </div>
                    </div>
                    </motion.div>
              ) : (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex flex-col items-center justify-center py-24 text-center space-y-6 opacity-40"
              >
                <div className="p-8 bg-slate-800/50 rounded-full border-2 border-dashed border-slate-700">
                  <Plus size={64} className="text-slate-600" />
                </div>
                <div className="space-y-2 max-w-md">
                  <h4 className="text-lg font-bold uppercase tracking-widest text-slate-500">Awaiting Input</h4>
                  <p className="text-slate-500 leading-relaxed font-medium">Select a simulation profile from the dropdown above to initiate governance validation.</p>
                </div>
              </motion.div>
                  )}
            </AnimatePresence>
        </motion.div>
      </>
          )}

      {activeTab === 'vault' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-premium rounded-3xl overflow-hidden"
        >
          <div className="p-8 border-b border-white/5 bg-gradient-to-r from-slate-800/20 to-transparent flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                <Database size={24} className="text-emerald-500" />
              </div>
              <div>
                <h3 className="text-2xl font-black tracking-tight">Cryptographic Audit Vault</h3>
                <p className="text-sm text-slate-400 font-medium mt-1">Immutable record of all validated transactions</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-sm font-mono text-emerald-400 font-bold flex items-center gap-2">
                <Lock size={14} />
                VERIFIED_STREAM
              </div>
            </div>
          </div>

          <div className="p-8 space-y-4 max-h-[600px] overflow-auto">
            {history.length > 0 ? (
              history.map((tx, idx) => (
                <motion.div
                  key={tx.transaction.timestamp}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="p-6 rounded-2xl bg-gradient-to-r from-emerald-500/5 to-transparent border border-emerald-500/10 flex items-center justify-between hover-lift group"
                >
                  <div className="flex items-center gap-6">
                    <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      <CheckCircle size={24} />
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-4">
                        <p className="text-2xl font-black">${tx.transaction.amount.toFixed(2)}</p>
                        <ArrowRight size={18} className="text-slate-600" />
                        <p className="text-lg font-bold text-slate-300">{tx.transaction.merchantName}</p>
                      </div>
                      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                        {new Date(tx.transaction.timestamp).toLocaleString()} · {tx.transaction.category}
                      </p>
                    </div>
                  </div>
                  <div className="badge-premium bg-emerald-500/10 text-emerald-400 border-emerald-500/20">
                    VERIFIED
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center py-32 opacity-30 space-y-6">
                <Terminal size={100} className="mx-auto text-slate-700" />
                <div className="space-y-2">
                  <p className="text-2xl font-black uppercase tracking-[0.4em] text-slate-600">Vault Empty</p>
                  <p className="text-slate-600 font-medium">No transactions have been validated yet.</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>

        {/* Integrated Smart Guide */ }
  <AnimatePresence>
    {showGuide && (
      <motion.div
        initial={{ x: 400, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: 400, opacity: 0 }}
        transition={{ type: "spring", damping: 25 }}
        className="fixed right-8 bottom-8 w-96 glass-premium rounded-3xl p-8 shadow-2xl z-50 border-2 border-blue-500/30"
      >
        <button
          onClick={() => setShowGuide(false)}
          className="absolute top-4 right-4 text-slate-500 hover:text-white transition-colors"
        >
          <XCircle size={20} />
        </button>

        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl glow-blue">
            <Sparkles size={24} className="text-white" />
          </div>
          <div>
            <h4 className="text-xl font-black tracking-tight">Smart Guide</h4>
            <p className="text-xs text-blue-400 font-semibold uppercase tracking-wider">Step {guideStep + 1} of 3</p>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          {guideStep === 0 && (
            <div className="space-y-3">
              <h5 className="text-lg font-bold text-white">Welcome to FAGF-FS</h5>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                This dashboard governs autonomous AI agent spending through deterministic mandates. Select a <span className="text-blue-400 font-bold">simulation profile</span> from the dropdown to begin.
              </p>
            </div>
          )}
          {guideStep === 1 && (
            <div className="space-y-3">
              <h5 className="text-lg font-bold text-white">Governance in Action</h5>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                The validator is now checking this transaction against all active mandates. Watch for the result: <span className="text-emerald-400 font-bold">VALIDATED</span>, <span className="text-rose-400 font-bold">BLOCKED</span>, or <span className="text-amber-400 font-bold">HITL</span>.
              </p>
            </div>
          )}
          {guideStep === 2 && (
            <div className="space-y-3">
              <h5 className="text-lg font-bold text-white">Audit Trail</h5>
              <p className="text-sm text-slate-300 leading-relaxed font-medium">
                All validated transactions are cryptographically committed to the <span className="text-emerald-400 font-bold">Audit Vault</span>. Navigate there to see the immutable ledger.
              </p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-white/5">
          <div className="flex gap-1.5">
            {[0, 1, 2].map(i => (
              <div key={i} className={`h-1.5 w-8 rounded-full transition-colors ${i === guideStep ? 'bg-blue-500' : 'bg-white/10'}`} />
            ))}
          </div>
          {guideStep < 2 ? (
            <button
              onClick={() => setGuideStep(guideStep + 1)}
              className="text-sm font-bold text-blue-400 hover:text-blue-300 transition-colors flex items-center gap-1 uppercase tracking-wider"
            >
              Skip <ChevronRight size={14} />
            </button>
          ) : (
            <button
              onClick={() => setShowGuide(false)}
              className="px-6 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-lg transition-all text-sm uppercase tracking-wider"
            >
              Got It
            </button>
          )}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
      </main >
    </div >
  );
}
