import React, { useState, useEffect } from 'react';
import {
  Shield,
  Settings,
  Play,
  RotateCcw,
  CheckCircle,
  XCircle,
  AlertTriangle,
  DollarSign,
  Store,
  Tag,
  X,
  Plus,
  Zap,
  Lock,
  UserCheck,
  Info
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GovernanceValidator } from './core/validator';
import { DEFAULT_MAS_MANDATES } from './core/mandates';
import { FinancialMandates, GovernanceEnvelope, ValidationResult, GovernanceMandate } from './core/types';

interface CustomMandates extends FinancialMandates {
  // Additional custom properties for the playground
}

const QUICK_SCENARIOS = [
  {
    id: 'routine_retail',
    name: 'Routine Retail',
    amount: 15,
    merchant: 'BrightMart Supplies',
    category: 'Retail Merchant',
    description: 'Low-value office supplies purchase'
  },
  {
    id: 'high_value_purchase',
    name: 'High-Value Purchase',
    amount: 1500,
    merchant: 'TechFlow Electronics',
    category: 'Retail Merchant',
    description: 'Large equipment purchase above threshold'
  },
  {
    id: 'forbidden_crypto',
    name: 'Forbidden Crypto',
    amount: 50,
    merchant: 'CryptoVault Exchange',
    category: 'Ungoverned Gambling',
    description: 'Prohibited category transaction'
  },
  {
    id: 'new_vendor',
    name: 'New Vendor',
    amount: 250,
    merchant: 'GreenLeaf Organics',
    category: 'Retail Merchant',
    description: 'First-time merchant purchase'
  }
];

export default function App() {
  // Mandate Configuration State
  // Mandate Configuration State (Active vs Pending for "Deploy" workflow)
  const [activeMandates, setActiveMandates] = useState<FinancialMandates>(DEFAULT_MAS_MANDATES);
  const [pendingMandates, setPendingMandates] = useState<FinancialMandates>(DEFAULT_MAS_MANDATES);
  const [isDeploying, setIsDeploying] = useState(false);
  const [showDeploySuccess, setShowDeploySuccess] = useState(false);
  const [trustedMerchants, setTrustedMerchants] = useState<string[]>([
    'BrightMart Supplies',
    'TechFlow Electronics',
    'UrbanStyle Apparel'
  ]);
  const [merchantInput, setMerchantInput] = useState('');
  const [forbiddenCategories, setForbiddenCategories] = useState<string[]>([
    'Ungoverned Gambling',
    'Cryptocurrency Exchange'
  ]);

  // No active tab needed for unified view

  // Scenario State
  const [customAmount, setCustomAmount] = useState(100);
  const [customMerchant, setCustomMerchant] = useState('');
  const [customCategory, setCustomCategory] = useState('SaaS / API');

  // Result State
  const [lastResult, setLastResult] = useState<{
    scenario: any;
    result: ValidationResult;
    config: FinancialMandates;
  } | null>(null);

  // Check if there are undeployed changes
  const hasPendingChanges = JSON.stringify(activeMandates) !== JSON.stringify(pendingMandates);

  const deployChanges = () => {
    setIsDeploying(true);
    // Simulate a secure deployment process
    setTimeout(() => {
      setActiveMandates(pendingMandates);
      setIsDeploying(false);
      setShowDeploySuccess(true);
      setTimeout(() => setShowDeploySuccess(false), 3000);
    }, 800);
  };

  const testScenario = (scenario: typeof QUICK_SCENARIOS[0] | null, isCustom = false) => {
    const amount = isCustom ? customAmount : scenario!.amount;
    const merchant = isCustom ? customMerchant : scenario!.merchant;
    const category = isCustom ? customCategory : scenario!.category;

    const envelope: GovernanceEnvelope = {
      transaction: {
        amount,
        destination: merchant.toLowerCase().replace(/\s+/g, '_'),
        merchantName: merchant,
        category,
        timestamp: Date.now(),
        paymentMethod: 'Corporate Card'
      },
      reasoning: isCustom ? 'Custom test scenario' : scenario!.description,
      context: {
        isNewMerchant: !trustedMerchants.includes(merchant),
        historyDepth: trustedMerchants.includes(merchant) ? 50 : 0,
        riskScore: forbiddenCategories.includes(category) ? 5 : amount > 1000 ? 2 : 1
      }
    };

    const result = GovernanceValidator.validate(envelope, activeMandates, []);

    setLastResult({
      scenario,
      result,
      config: activeMandates
    });
  };

  const updateMandate = (key: keyof FinancialMandates, updates: Partial<GovernanceMandate<any>>) => {
    setPendingMandates(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        ...updates
      }
    }));
  };

  const addTrustedMerchant = () => {
    if (merchantInput && !trustedMerchants.includes(merchantInput)) {
      setTrustedMerchants([...trustedMerchants, merchantInput]);
      setMerchantInput('');
    }
  };

  const removeTrustedMerchant = (name: string) => {
    setTrustedMerchants(trustedMerchants.filter(m => m !== name));
  };

  const resetToDefaults = () => {
    setPendingMandates(DEFAULT_MAS_MANDATES);
    setActiveMandates(DEFAULT_MAS_MANDATES);
    setTrustedMerchants(['BrightMart Supplies', 'TechFlow Electronics', 'UrbanStyle Apparel']);
    setLastResult(null);
  };

  return (
    <div className="playground-layout">
      {/* LEFT PANEL: Configuration */}
      <div className="panel panel-left">
        <div className="panel-header">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Shield size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black text-white">Governance Control</h1>
                <p className="text-sm text-muted">Unified active policy management</p>
              </div>
            </div>
            <button onClick={resetToDefaults} className="btn btn-secondary btn-sm">
              <RotateCcw size={16} />
              Reset
            </button>
          </div>

          {/* Deployment Panel - Unified Header Action */}
          <div className="flex flex-col gap-2">
            <AnimatePresence>
              {hasPendingChanges && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden mb-2"
                >
                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-lg">
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 text-amber-500 text-[10px] font-black tracking-widest uppercase">
                        <AlertTriangle size={14} />
                        Undeployed Policy
                      </div>
                    </div>
                    <button
                      onClick={deployChanges}
                      disabled={isDeploying}
                      className={`w-full py-3 rounded-lg font-black text-sm flex items-center justify-center gap-2 transition-all ${isDeploying
                        ? 'bg-amber-500/20 text-amber-500/50 cursor-not-allowed'
                        : 'bg-[#f59e0b] text-[#0a0e1a] hover:bg-[#d97706] shadow-lg shadow-amber-500/20'
                        }`}
                    >
                      {isDeploying ? (
                        <>
                          <RotateCcw size={16} className="animate-spin" />
                          Deploying...
                        </>
                      ) : (
                        <>
                          <Zap size={16} />
                          Deploy Changes
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <AnimatePresence>
              {showDeploySuccess && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mb-2 p-2 bg-emerald-500/20 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-emerald-400 text-xs font-bold"
                >
                  <CheckCircle size={14} />
                  Governance Policy Deployed!
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="panel-content scrollbar-thin">
          <div className="space-y-8 pb-12">

            {/* Category: Financial Limits */}
            <div className="control-group">
              <label className="control-label flex items-center gap-2 text-indigo-400 mb-4">
                <DollarSign size={18} />
                Financial Limits
              </label>

              <div className="card mb-4">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-white">Auto-Approve Threshold</label>
                  <span className="badge badge-success text-[10px] py-0">{pendingMandates.confirmationThreshold.id}</span>
                </div>
                <div className="slider-container">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    step="25"
                    value={pendingMandates.confirmationThreshold.parameter}
                    onChange={(e) => updateMandate('confirmationThreshold', { parameter: Number(e.target.value) })}
                    className="slider"
                    style={{ '--value': `${(pendingMandates.confirmationThreshold.parameter / 500) * 100}%` } as any}
                  />
                  <div className="slider-value">
                    <span className="text-muted text-[10px]">$0</span>
                    <span className="slider-value-current text-indigo-400">${pendingMandates.confirmationThreshold.parameter}</span>
                    <span className="text-muted text-[10px]">$500</span>
                  </div>
                </div>
                <p className="control-description text-[11px] mt-2 opacity-70">{pendingMandates.confirmationThreshold.description}</p>
              </div>

              <div className="card">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-bold text-white">Hard Block Threshold</label>
                  <span className="badge badge-danger text-[10px] py-0">{pendingMandates.dailyAggregateLimit.id}</span>
                </div>
                <div className="slider-container">
                  <input
                    type="range"
                    min="100"
                    max="5000"
                    step="100"
                    value={pendingMandates.dailyAggregateLimit.parameter}
                    onChange={(e) => updateMandate('dailyAggregateLimit', { parameter: Number(e.target.value) })}
                    className="slider slider-danger"
                    style={{ '--value': `${((pendingMandates.dailyAggregateLimit.parameter - 100) / 4900) * 100}%` } as any}
                  />
                  <div className="slider-value">
                    <span className="text-muted text-[10px]">$100</span>
                    <span className="slider-value-current text-rose-400">${pendingMandates.dailyAggregateLimit.parameter}</span>
                    <span className="text-muted text-[10px]">$5,000</span>
                  </div>
                </div>
                <p className="control-description text-[11px] mt-2 opacity-70">{pendingMandates.dailyAggregateLimit.description}</p>
              </div>
            </div>

            {/* Category: Authorization & Trust */}
            <div className="control-group">
              <label className="control-label flex items-center gap-2 text-emerald-400 mb-4">
                <Store size={18} />
                Authorization & Trust
              </label>

              <div className="card mb-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <label className="text-sm font-bold text-white">New Merchant Review</label>
                    <span className="badge badge-warning text-[10px] py-0">{pendingMandates.newMerchantAuth.id}</span>
                  </div>
                  <label className="toggle">
                    <input
                      type="checkbox"
                      checked={pendingMandates.newMerchantAuth.parameter === true}
                      onChange={(e) => updateMandate('newMerchantAuth', { parameter: e.target.checked })}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
                <p className="control-description text-[11px] mt-2 opacity-70">{pendingMandates.newMerchantAuth.description}</p>
              </div>

              <div className="card">
                <label className="text-xs font-black uppercase tracking-widest text-muted mb-3 block">Trusted Merchants (Bypass)</label>
                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={merchantInput}
                    onChange={(e) => setMerchantInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addTrustedMerchant()}
                    placeholder="Search/Add trusted vendor..."
                    className="input-field text-xs py-1"
                  />
                  <button onClick={addTrustedMerchant} className="btn btn-primary btn-sm px-2">
                    <Plus size={14} />
                  </button>
                </div>
                <div className="tag-list">
                  {trustedMerchants.map(merchant => (
                    <div key={merchant} className="tag text-[10px]">
                      <span>{merchant}</span>
                      <X size={10} className="tag-remove" onClick={() => removeTrustedMerchant(merchant)} />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Category: Safety & Compliance */}
            <div className="control-group">
              <label className="control-label flex items-center gap-2 text-rose-400 mb-4">
                <Shield size={18} />
                Safety & Compliance
              </label>

              {/* Blocked Categories */}
              <div className="card mb-4">
                <div className="flex items-center justify-between mb-3 border-b border-white/5 pb-2">
                  <label className="text-sm font-bold text-white uppercase tracking-tight">Blocked Categories</label>
                  <span className="badge badge-danger text-[10px] py-0 px-2 font-mono">{pendingMandates.blockedCategories.id}</span>
                </div>
                <div className="tag-list mb-3">
                  {(pendingMandates.blockedCategories.parameter as string[]).map(cat => (
                    <div key={cat} className="tag bg-rose-500/10 border-rose-500/20 text-rose-400 text-[10px] font-bold">
                      <Lock size={10} />
                      <span>{cat}</span>
                      <X size={10} className="tag-remove" onClick={() => {
                        const current = pendingMandates.blockedCategories.parameter as string[];
                        updateMandate('blockedCategories', { parameter: current.filter(c => c !== cat) });
                      }} />
                    </div>
                  ))}
                </div>
                <input
                  type="text"
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const val = (e.target as HTMLInputElement).value;
                      if (val) {
                        const current = pendingMandates.blockedCategories.parameter as string[];
                        if (!current.includes(val)) {
                          updateMandate('blockedCategories', { parameter: [...current, val] });
                          (e.target as HTMLInputElement).value = '';
                        }
                      }
                    }
                  }}
                  placeholder="Add restricted category..."
                  className="input-field text-[11px] py-1 h-8"
                />
              </div>

              {/* Velocity Controls */}
              <div className="space-y-4">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted block">Velocity & Metadata</label>

                {/* Rate Limit */}
                <div className="card">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-white uppercase">{pendingMandates.rateLimitPerHour.id}</label>
                    <span className="text-indigo-400 font-black text-xs">{pendingMandates.rateLimitPerHour.parameter} ops/hr</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={pendingMandates.rateLimitPerHour.parameter}
                    onChange={(e) => updateMandate('rateLimitPerHour', { parameter: Number(e.target.value) })}
                    className="slider slider-sm"
                    style={{ '--value': `${(pendingMandates.rateLimitPerHour.parameter / 100) * 100}%` } as any}
                  />
                  <p className="text-[10px] text-muted mt-2">{pendingMandates.rateLimitPerHour.description}</p>
                </div>

                {/* Cooldown */}
                <div className="card">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-white uppercase">{pendingMandates.cooldownSeconds.id}</label>
                    <span className="text-indigo-400 font-black text-xs">{pendingMandates.cooldownSeconds.parameter}s</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    step="5"
                    value={pendingMandates.cooldownSeconds.parameter}
                    onChange={(e) => updateMandate('cooldownSeconds', { parameter: Number(e.target.value) })}
                    className="slider slider-sm"
                    style={{ '--value': `${(pendingMandates.cooldownSeconds.parameter / 300) * 100}%` } as any}
                  />
                  <p className="text-[10px] text-muted mt-2">{pendingMandates.cooldownSeconds.description}</p>
                </div>

                {/* Allowed Methods */}
                <div className="card">
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-white uppercase">Payment Methods</label>
                    <span className="badge badge-success text-[10px] py-0">{pendingMandates.allowedMethods.id}</span>
                  </div>
                  <div className="tag-list mb-2">
                    {(pendingMandates.allowedMethods.parameter as string[]).map(method => (
                      <div key={method} className="tag text-[9px] bg-indigo-500/10 border-indigo-500/20 text-indigo-400 uppercase font-black">
                        <span>{method}</span>
                        <X size={10} className="tag-remove" onClick={() => {
                          const current = pendingMandates.allowedMethods.parameter as string[];
                          updateMandate('allowedMethods', { parameter: current.filter(m => m !== method) });
                        }} />
                      </div>
                    ))}
                  </div>
                  <input
                    type="text"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        const val = (e.target as HTMLInputElement).value;
                        if (val) {
                          const current = pendingMandates.allowedMethods.parameter as string[];
                          if (!current.includes(val)) {
                            updateMandate('allowedMethods', { parameter: [...current, val] });
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }
                    }}
                    placeholder="Add allowed method..."
                    className="input-field text-[11px] py-1 h-8"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL: Testing */}
      <div className="panel">
        <div className="panel-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-emerald-600 rounded-lg">
                <Play size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black">Test Scenarios</h1>
                <p className="text-sm text-muted">Try different transactions to see how your mandates respond</p>
              </div>
            </div>

            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded text-emerald-500 text-[10px] font-black uppercase tracking-widest">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Governance Active
              </div>
              {hasPendingChanges && (
                <div className="flex items-center gap-1 text-amber-500 text-[9px] font-bold uppercase">
                  <AlertTriangle size={10} />
                  Pending Deployment
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="panel-content">
          {/* Quick Scenarios */}
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-secondary mb-4">Quick Tests</h3>
            <div className="grid grid-cols-2 gap-4">
              {QUICK_SCENARIOS.map(scenario => (
                <button
                  key={scenario.id}
                  onClick={() => testScenario(scenario)}
                  className="card card-hover text-left"
                >
                  <div className="flex items-start justify-between mb-3">
                    <h4 className="font-bold text-white">{scenario.name}</h4>
                    <span className="text-lg font-black text-indigo-400">${scenario.amount}</span>
                  </div>
                  <p className="text-xs text-secondary mb-2">{scenario.merchant}</p>
                  <p className="text-xs text-muted">{scenario.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Custom Scenario Builder */}
          <div className="mb-6">
            <h3 className="text-sm font-bold uppercase tracking-wider text-secondary mb-4">Custom Scenario</h3>
            <div className="card">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-semibold mb-2 block">Amount ($)</label>
                  <input
                    type="number"
                    value={customAmount}
                    onChange={(e) => setCustomAmount(Number(e.target.value))}
                    className="input-field"
                    placeholder="100"
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold mb-2 block">Category</label>
                  <select
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    className="select-field"
                  >
                    <option value="SaaS / API">SaaS / API</option>
                    <option value="Travel / Logistics">Travel / Logistics</option>
                    <option value="Office Supplies">Office Supplies</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Ungoverned Gambling">Ungoverned Gambling</option>
                    <option value="Cryptocurrency Exchange">Cryptocurrency Exchange</option>
                  </select>
                </div>
              </div>
              <div className="mb-4">
                <label className="text-sm font-semibold mb-2 block">Merchant Name</label>
                <input
                  type="text"
                  value={customMerchant}
                  onChange={(e) => setCustomMerchant(e.target.value)}
                  className="input-field"
                  placeholder="Enter merchant name..."
                />
              </div>
              <button
                onClick={() => testScenario(null, true)}
                disabled={!customMerchant}
                className="btn btn-primary w-full"
              >
                <Zap size={16} />
                Test Custom Scenario
              </button>
            </div>
          </div>

          {/* Results Display */}
          <AnimatePresence mode="wait">
            {lastResult && (
              <motion.div
                key="result"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <h3 className="text-sm font-bold uppercase tracking-wider text-secondary mb-4">Validation Result</h3>

                <div className={`result-card ${lastResult.result.allowed
                  ? 'result-approved'
                  : lastResult.result.requiresApproval
                    ? 'result-hitl'
                    : 'result-blocked'
                  }`}>
                  <div className="flex items-center gap-4 mb-6">
                    {lastResult.result.allowed ? (
                      <CheckCircle size={48} className="text-emerald-500" strokeWidth={2.5} />
                    ) : lastResult.result.requiresApproval ? (
                      <AlertTriangle size={48} className="text-amber-500" strokeWidth={2.5} />
                    ) : (
                      <XCircle size={48} className="text-rose-500" strokeWidth={2.5} />
                    )}
                    <div className="flex-1">
                      <h4 className="text-3xl font-black mb-1">
                        {lastResult.result.allowed
                          ? '✅ APPROVED'
                          : lastResult.result.requiresApproval
                            ? '⏸️ HITL REQUIRED'
                            : '🚫 BLOCKED'}
                      </h4>
                      <p className="text-lg font-semibold text-secondary">{lastResult.result.reason}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-black/20 rounded-lg mb-4">
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-muted mb-1">Amount</p>
                        <p className="font-bold text-lg">${lastResult.scenario.amount}</p>
                      </div>
                      <div>
                        <p className="text-muted mb-1">Merchant</p>
                        <p className="font-semibold">{lastResult.scenario.merchantName}</p>
                      </div>
                      <div>
                        <p className="text-muted mb-1">Category</p>
                        <p className="font-semibold">{lastResult.scenario.category}</p>
                      </div>
                    </div>
                  </div>

                  {lastResult.result.triggeredMandates.length > 0 && (
                    <div className="mb-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-secondary mb-2">Triggered Mandates</p>
                      <div className="flex flex-wrap gap-2">
                        {lastResult.result.triggeredMandates.map(m => (
                          <span
                            key={m}
                            className={`badge ${lastResult.result.allowed
                              ? 'badge-success'
                              : lastResult.result.requiresApproval
                                ? 'badge-warning'
                                : 'badge-danger'
                              }`}
                          >
                            <Shield size={12} />
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="pt-4 border-t border-white/5">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted mb-2">Enforcement Context</p>
                    <div className="flex gap-4 text-[10px] font-mono text-muted">
                      <div>AUTH_LIMIT: <span className="text-white">${lastResult.config.confirmationThreshold.parameter}</span></div>
                      <div>HARD_BLOCK: <span className="text-white">${lastResult.config.dailyAggregateLimit.parameter}</span></div>
                    </div>
                  </div>
                </div>

                <div className="card mt-4">
                  <div className="flex items-start gap-3">
                    <Info size={20} className="text-indigo-400 mt-0.5" />
                    <div className="flex-1">
                      <h5 className="font-bold mb-2">Understanding This Result</h5>
                      <div className="text-sm text-secondary space-y-2">
                        {lastResult.result.allowed && !lastResult.result.requiresApproval && (
                          <p>This transaction passed all mandate checks and was approved automatically. The amount is within your auto-approve threshold and no blocking rules were triggered.</p>
                        )}
                        {lastResult.result.requiresApproval && (
                          <p>This transaction requires <strong>Human-in-the-Loop (HITL)</strong> approval because it exceeded your configured thresholds or involved a new merchant.</p>
                        )}
                        {!lastResult.result.allowed && (
                          <p>This transaction was <strong>hard-blocked</strong> due to a categorical restriction. This is a safety measure that cannot be overridden without changing the policy.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {!lastResult && (
            <div className="card text-center py-12 opacity-50">
              <Shield size={64} className="mx-auto mb-4 text-slate-600" />
              <p className="text-secondary font-semibold">No tests run yet</p>
              <p className="text-muted text-sm mt-2">Select a quick scenario or build a custom one to see validation results</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
