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
import { FinancialMandates, GovernanceEnvelope, ValidationResult } from './core/types';

interface CustomMandates extends FinancialMandates {
  // Additional custom properties for the playground
}

const QUICK_SCENARIOS = [
  {
    id: 'routine_saas',
    name: 'Routine SaaS',
    amount: 15,
    merchant: 'AWS Cloud Services',
    category: 'SaaS / API',
    description: 'Low-value cloud infrastructure payment'
  },
  {
    id: 'high_value_travel',
    name: 'High-Value Travel',
    amount: 1500,
    merchant: 'Singapore Airlines',
    category: 'Travel / Logistics',
    description: 'Business flight booking above threshold'
  },
  {
    id: 'forbidden_crypto',
    name: 'Forbidden Crypto',
    amount: 50,
    merchant: 'Binance Exchange',
    category: 'Ungoverned Gambling',
    description: 'Prohibited category transaction'
  },
  {
    id: 'new_vendor',
    name: 'New Vendor',
    amount: 250,
    merchant: 'Unknown Startup Inc',
    category: 'SaaS / API',
    description: 'First-time merchant purchase'
  }
];

export default function App() {
  // Mandate Configuration State
  const [autoApproveLimit, setAutoApproveLimit] = useState(100);
  const [hitlLimit, setHitlLimit] = useState(1000);
  const [trustedMerchants, setTrustedMerchants] = useState<string[]>([
    'AWS Cloud Services',
    'Google Cloud',
    'Microsoft Azure'
  ]);
  const [merchantInput, setMerchantInput] = useState('');
  const [forbiddenCategories, setForbiddenCategories] = useState<string[]>([
    'Ungoverned Gambling',
    'Cryptocurrency Exchange'
  ]);
  const [requireHitlForNewMerchants, setRequireHitlForNewMerchants] = useState(true);

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

  // Build current mandate configuration
  const currentMandates: FinancialMandates = {
    ...DEFAULT_MAS_MANDATES,
    confirmationThreshold: {
      ...DEFAULT_MAS_MANDATES.confirmationThreshold,
      parameter: autoApproveLimit
    },
    dailyAggregateLimit: {
      ...DEFAULT_MAS_MANDATES.dailyAggregateLimit,
      parameter: hitlLimit
    },
    blockedCategories: {
      ...DEFAULT_MAS_MANDATES.blockedCategories,
      parameter: forbiddenCategories
    },
    newMerchantAuth: {
      ...DEFAULT_MAS_MANDATES.newMerchantAuth,
      parameter: requireHitlForNewMerchants
    }
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

    const result = GovernanceValidator.validate(envelope, currentMandates, []);

    setLastResult({
      scenario: { name: isCustom ? 'Custom Scenario' : scenario!.name, ...envelope.transaction },
      result,
      config: { ...currentMandates }
    });
  };

  const addTrustedMerchant = () => {
    if (merchantInput.trim() && !trustedMerchants.includes(merchantInput.trim())) {
      setTrustedMerchants([...trustedMerchants, merchantInput.trim()]);
      setMerchantInput('');
    }
  };

  const removeTrustedMerchant = (merchant: string) => {
    setTrustedMerchants(trustedMerchants.filter(m => m !== merchant));
  };

  const resetToDefaults = () => {
    setAutoApproveLimit(100);
    setHitlLimit(1000);
    setTrustedMerchants(['AWS Cloud Services', 'Google Cloud', 'Microsoft Azure']);
    setRequireHitlForNewMerchants(true);
    setLastResult(null);
  };

  return (
    <div className="playground-layout">
      {/* LEFT PANEL: Configuration */}
      <div className="panel panel-left">
        <div className="panel-header">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-600 rounded-lg">
                <Settings size={24} className="text-white" />
              </div>
              <div>
                <h1 className="text-xl font-black">Mandate Configuration</h1>
                <p className="text-sm text-muted">Customize your governance rules</p>
              </div>
            </div>
            <button onClick={resetToDefaults} className="btn btn-secondary btn-sm">
              <RotateCcw size={16} />
              Reset
            </button>
          </div>
        </div>

        <div className="panel-content">
          {/* Value Limits */}
          <div className="control-group">
            <label className="control-label flex items-center gap-2">
              <DollarSign size={16} className="text-indigo-400" />
              Value Limits
            </label>

            <div className="card mb-4">
              <label className="text-sm font-semibold mb-2 block">Auto-Approve Threshold</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="0"
                  max="500"
                  step="25"
                  value={autoApproveLimit}
                  onChange={(e) => setAutoApproveLimit(Number(e.target.value))}
                  className="slider"
                  style={{ '--value': `${(autoApproveLimit / 500) * 100}%` } as any}
                />
                <div className="slider-value">
                  <span className="text-muted">$0</span>
                  <span className="slider-value-current">${autoApproveLimit}</span>
                  <span className="text-muted">$500</span>
                </div>
              </div>
              <p className="control-description">
                Transactions below this amount are approved automatically (if other rules pass).
              </p>
            </div>

            <div className="card">
              <label className="text-sm font-semibold mb-2 block">HITL Threshold</label>
              <div className="slider-container">
                <input
                  type="range"
                  min="100"
                  max="5000"
                  step="100"
                  value={hitlLimit}
                  onChange={(e) => setHitlLimit(Number(e.target.value))}
                  className="slider"
                  style={{ '--value': `${((hitlLimit - 100) / 4900) * 100}%` } as any}
                />
                <div className="slider-value">
                  <span className="text-muted">$100</span>
                  <span className="slider-value-current">${hitlLimit}</span>
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
                  <p className="text-sm font-semibold">New Merchant Review</p>
                  <p className="text-xs text-muted">Require approval for first-time vendors</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={requireHitlForNewMerchants}
                    onChange={(e) => setRequireHitlForNewMerchants(e.target.checked)}
                  />
                  <span className="toggle-slider"></span>
                </label>
              </div>
            </div>
          </div>
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
                    <h4 className="font-bold">{scenario.name}</h4>
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
