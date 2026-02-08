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
  const [mandates, setMandates] = useState<FinancialMandates>(DEFAULT_MAS_MANDATES);
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

  // Tab State
  const [activeTab, setActiveTab] = useState<'config' | 'mandates'>('config');

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

  // Derive current configuration for validation
  const currentMandates: FinancialMandates = mandates;

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

    const result = GovernanceValidator.validate(envelope, currentMandates, []);

    setLastResult({
      scenario,
      result,
      config: currentMandates
    });
  };

  const updateMandate = (key: keyof FinancialMandates, updates: Partial<GovernanceMandate<any>>) => {
    setMandates(prev => ({
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
    setMandates(DEFAULT_MAS_MANDATES);
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
                <p className="text-sm text-muted">Configure and explore mandates</p>
              </div>
            </div>
            {activeTab === 'config' && (
              <button onClick={resetToDefaults} className="btn btn-secondary btn-sm">
                <RotateCcw size={16} />
                Reset
              </button>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('config')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${activeTab === 'config'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-transparent text-secondary hover:bg-white/5'
                }`}
            >
              <Settings size={16} className="inline mr-2" />
              Configuration
            </button>
            <button
              onClick={() => setActiveTab('mandates')}
              className={`flex-1 px-4 py-2 rounded-lg font-semibold text-sm transition-all ${activeTab === 'mandates'
                  ? 'bg-indigo-600 text-white'
                  : 'bg-transparent text-secondary hover:bg-white/5'
                }`}
            >
              <Shield size={16} className="inline mr-2" />
              Mandates
            </button>
          </div>
        </div>

        <div className="panel-content">
          {activeTab === 'config' && (
            <>
              {/* Value Limits */}
              <div className="control-group">
                <label className="control-label flex items-center gap-2">
                  <DollarSign size={16} className="text-indigo-400" />
                  Value Limits
                </label>

                <div className="card mb-4">
                  <label className="text-sm font-semibold mb-2 block text-white">Auto-Approve Threshold</label>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="0"
                      max="500"
                      step="25"
                      value={mandates.confirmationThreshold.parameter}
                      onChange={(e) => updateMandate('confirmationThreshold', { parameter: Number(e.target.value) })}
                      className="slider"
                      style={{ '--value': `${(mandates.confirmationThreshold.parameter / 500) * 100}%` } as any}
                    />
                    <div className="slider-value">
                      <span className="text-muted">$0</span>
                      <span className="slider-value-current">${mandates.confirmationThreshold.parameter}</span>
                      <span className="text-muted">$500</span>
                    </div>
                  </div>
                  <p className="control-description">
                    Transactions below this amount are approved automatically (if other rules pass).
                  </p>
                </div>

                <div className="card">
                  <label className="text-sm font-semibold mb-2 block text-white">HITL Threshold</label>
                  <div className="slider-container">
                    <input
                      type="range"
                      min="100"
                      max="5000"
                      step="100"
                      value={mandates.dailyAggregateLimit.parameter}
                      onChange={(e) => updateMandate('dailyAggregateLimit', { parameter: Number(e.target.value) })}
                      className="slider"
                      style={{ '--value': `${((mandates.dailyAggregateLimit.parameter - 100) / 4900) * 100}%` } as any}
                    />
                    <div className="slider-value">
                      <span className="text-muted">$100</span>
                      <span className="slider-value-current">${mandates.dailyAggregateLimit.parameter}</span>
                      <span className="text-muted">$5,000</span>
                    </div>
                  </div>
                  <p className="control-description">
                    Transactions above this amount require human approval.
                  </p>
                </div>
              </div>

              {/* Merchant Allowlist */}
              <div className="control-group">
                <label className="control-label flex items-center gap-2">
                  <Store size={16} className="text-emerald-400" />
                  Trusted Merchants
                </label>

                <div className="card">
                  <div className="flex gap-2 mb-3">
                    <input
                      type="text"
                      value={merchantInput}
                      onChange={(e) => setMerchantInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTrustedMerchant()}
                      placeholder="Add merchant name..."
                      className="input-field"
                    />
                    <button onClick={addTrustedMerchant} className="btn btn-primary">
                      <Plus size={16} />
                    </button>
                  </div>

                  <div className="tag-list">
                    {trustedMerchants.length > 0 ? (
                      trustedMerchants.map(merchant => (
                        <div key={merchant} className="tag">
                          <span>{merchant}</span>
                          <X
                            size={14}
                            className="tag-remove"
                            onClick={() => removeTrustedMerchant(merchant)}
                          />
                        </div>
                      ))
                    ) : (
                      <p className="text-muted text-sm italic">No trusted merchants added</p>
                    )}
                  </div>

                  <p className="control-description mt-3">
                    Merchants on this list bypass certain restrictions for routine transactions.
                  </p>
                </div>
              </div>

              {/* Category Restrictions */}
              <div className="control-group">
                <label className="control-label flex items-center gap-2">
                  <Tag size={16} className="text-rose-400" />
                  Forbidden Categories
                </label>

                <div className="card">
                  <div className="tag-list">
                    {forbiddenCategories.map(cat => (
                      <div key={cat} className="tag" style={{ borderColor: '#ef4444', background: 'rgba(239, 68, 68, 0.1)' }}>
                        <Lock size={14} />
                        <span>{cat}</span>
                      </div>
                    ))}
                  </div>
                  <p className="control-description mt-3">
                    Transactions in these categories are always blocked, no exceptions.
                  </p>
                </div>
              </div>

              {/* HITL Triggers */}
              <div className="control-group">
                <label className="control-label flex items-center gap-2">
                  <UserCheck size={16} className="text-amber-400" />
                  HITL Triggers
                </label>

                <div className="card">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-sm font-semibold text-white">New Merchant Review</p>
                      <p className="text-xs text-muted">Require approval for first-time vendors</p>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={mandates.newMerchantAuth.parameter === true}
                        onChange={(e) => updateMandate('newMerchantAuth', { parameter: e.target.checked })}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === 'mandates' && (
            <div className="space-y-4">
              <p className="text-sm text-secondary mb-6">
                These mandates define the governance rules that protect against various risks. Each mandate has specific parameters and enforcement levels.
              </p>

              {Object.keys(mandates).map((key) => {
                const mandate = mandates[key as keyof FinancialMandates];
                return (
                  <div key={mandate.id} className="card">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`p-2 rounded-lg ${mandate.category === 'spending_limit' ? 'bg-indigo-600/20' :
                          mandate.category === 'authorization' ? 'bg-emerald-600/20' :
                            mandate.category === 'velocity' ? 'bg-amber-600/20' :
                              'bg-rose-600/20'
                        }`}>
                        {mandate.category === 'spending_limit' ? <DollarSign size={20} className="text-indigo-400" /> :
                          mandate.category === 'authorization' ? <UserCheck size={20} className="text-emerald-400" /> :
                            mandate.category === 'velocity' ? <Zap size={20} className="text-amber-400" /> :
                              <Lock size={20} className="text-rose-400" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1 justify-between">
                          <h3 className="font-bold text-lg text-white">
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </h3>
                          <span className={`badge ${mandate.severity === 'high' ? 'badge-danger' :
                              mandate.severity === 'medium' ? 'badge-warning' :
                                'badge-success'
                            } text-xs`}>{mandate.id}</span>
                        </div>

                        <p className="text-sm text-secondary mb-3">{mandate.description}</p>

                        <div className="p-3 bg-rose-900/10 rounded-lg border border-rose-500/20 mb-3">
                          <p className="text-xs font-bold text-rose-400 mb-1">🛡️ GUARDS AGAINST:</p>
                          <p className="text-sm text-secondary">{mandate.riskDisclosure}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs text-muted block mb-1 uppercase font-bold">Enforcement</label>
                            <select
                              value={mandate.enforcement}
                              onChange={(e) => updateMandate(key as keyof FinancialMandates, { enforcement: e.target.value as any })}
                              className="select-field text-xs py-1 h-8"
                            >
                              <option value="none">IGNORE (BYPASS)</option>
                              <option value="soft_warning">SOFT WARNING</option>
                              <option value="approval_required">APPROVAL REQUIRED</option>
                              <option value="block">BLOCK (REJECT)</option>
                            </select>
                          </div>
                          <div>
                            <label className="text-xs text-muted block mb-1 uppercase font-bold">Parameter</label>
                            {typeof mandate.parameter === 'number' ? (
                              <input
                                type="number"
                                value={mandate.parameter}
                                onChange={(e) => updateMandate(key as keyof FinancialMandates, { parameter: Number(e.target.value) })}
                                className="input-field text-xs py-1 h-8"
                              />
                            ) : typeof mandate.parameter === 'boolean' ? (
                              <select
                                value={mandate.parameter ? 'true' : 'false'}
                                onChange={(e) => updateMandate(key as keyof FinancialMandates, { parameter: e.target.value === 'true' })}
                                className="select-field text-xs py-1 h-8"
                              >
                                <option value="true">ENABLED</option>
                                <option value="false">DISABLED</option>
                              </select>
                            ) : (
                              <div className="text-xs bg-white/5 rounded px-2 py-1 border border-white/10 text-muted h-8 flex items-center italic">
                                Array/Complex
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: Testing */}
      <div className="panel">
        <div className="panel-header">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-600 rounded-lg">
              <Play size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black">Test Scenarios</h1>
              <p className="text-sm text-muted">Try different transactions to see how your mandates respond</p>
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
                    <div>
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
