import React, { useState } from 'react';
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
  X,
  Plus,
  Zap,
  Lock,
  Info,
  Ban,
  Clock,
  Activity
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GovernanceValidator } from './core/validator';
import { DEFAULT_MAS_MANDATES } from './core/mandates';
import { FinancialMandates, GovernanceEnvelope, ValidationResult, GovernanceMandate } from './core/types';

const QUICK_SCENARIOS = [
  {
    id: 'routine_retail',
    name: 'Routine Retail',
    amount: 15,
    merchant: 'BrightMart Supplies',
    category: 'Retail Merchant',
    paymentMethod: 'PayNow',
    description: 'Low-value office supplies via PayNow'
  },
  {
    id: 'high_value_purchase',
    name: 'High-Value Purchase',
    amount: 1500,
    merchant: 'TechFlow Electronics',
    category: 'Retail Merchant',
    paymentMethod: 'NETS',
    description: 'Large equipment purchase above threshold'
  },
  {
    id: 'forbidden_crypto',
    name: 'Forbidden Crypto',
    amount: 50,
    merchant: 'CryptoVault Exchange',
    category: 'Ungoverned Gambling',
    paymentMethod: 'FAST',
    description: 'Prohibited category transaction'
  },
  {
    id: 'new_vendor',
    name: 'New Vendor',
    amount: 250,
    merchant: 'GreenLeaf Organics',
    category: 'Retail Merchant',
    paymentMethod: 'PayNow',
    description: 'First-time merchant purchase'
  },
  {
    id: 'sanctioned_entity',
    name: 'Sanctioned Entity',
    amount: 30,
    merchant: 'ShadowFinance Ltd',
    category: 'Retail Merchant',
    paymentMethod: 'FAST',
    description: 'Payment to a watchlisted entity'
  }
];

const getMandateDescription = (key: keyof FinancialMandates, value: any): string => {
  switch (key) {
    case 'confirmationThreshold':
      return `Autonomous payments above S$${value} require explicit user approval.`;
    case 'dailyAggregateLimit':
      return `Hard block if total daily spending exceeds S$${value}.`;
    case 'rateLimitPerHour':
      return `Maximum ${value} autonomous transaction${value !== 1 ? 's' : ''} per hour.`;
    case 'cooldownSeconds':
      return `Minimum ${value}-second delay between consecutive executions.`;
    case 'newMerchantAuth':
      return value
        ? 'Merchants not in the trust list require manual verification.'
        : 'New merchant verification is disabled.';
    case 'sanctionedEntities':
      return 'Transactions to sanctioned entities are permanently blocked.';
    case 'duplicateDetectionWindow':
      return `Flag repeat payments to the same merchant within ${value} seconds.`;
    default:
      return '';
  }
};

export default function App() {
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
  const [transactionHistory, setTransactionHistory] = useState<GovernanceEnvelope[]>([]);

  const [customAmount, setCustomAmount] = useState(100);
  const [customMerchant, setCustomMerchant] = useState('');
  const [customCategory, setCustomCategory] = useState('SaaS / API');

  const [lastResult, setLastResult] = useState<{
    scenario: any;
    result: ValidationResult;
    config: FinancialMandates;
    envelope: GovernanceEnvelope;
  } | null>(null);

  const hasPendingChanges = JSON.stringify(activeMandates) !== JSON.stringify(pendingMandates);

  // Derive dropdown options from deployed policy so they stay in sync
  const BASE_CATEGORIES = ['SaaS / API', 'Travel / Logistics', 'Office Supplies', 'Marketing', 'Retail Merchant'];
  const categoryOptions = [...new Set([
    ...BASE_CATEGORIES,
    ...(activeMandates.blockedCategories.parameter as string[])
  ])];

  const paymentMethodOptions = [...new Set([
    ...(activeMandates.allowedMethods.parameter as string[]),
    'Corporate Card', 'Wire Transfer', 'Cryptocurrency'
  ])];

  const deployChanges = () => {
    setIsDeploying(true);
    setTimeout(() => {
      setActiveMandates(pendingMandates);
      setIsDeploying(false);
      setShowDeploySuccess(true);
      setTimeout(() => setShowDeploySuccess(false), 3000);
    }, 800);
  };

  const [customPaymentMethod, setCustomPaymentMethod] = useState('Corporate Card');

  const testScenario = (scenario: typeof QUICK_SCENARIOS[0] | null, isCustom = false) => {
    const amount = isCustom ? customAmount : scenario!.amount;
    const merchant = isCustom ? customMerchant : scenario!.merchant;
    const category = isCustom ? customCategory : scenario!.category;
    const paymentMethod = isCustom ? customPaymentMethod : scenario!.paymentMethod;

    const envelope: GovernanceEnvelope = {
      transaction: {
        amount,
        destination: merchant.toLowerCase().replace(/\s+/g, '_'),
        merchantName: merchant,
        category,
        timestamp: Date.now(),
        paymentMethod
      },
      reasoning: isCustom ? 'Custom test scenario' : scenario!.description,
      context: {
        isNewMerchant: !trustedMerchants.includes(merchant),
        historyDepth: trustedMerchants.includes(merchant) ? 50 : 0,
        riskScore: activeMandates.blockedCategories.parameter.includes(category) ? 5 : amount > 1000 ? 2 : 1
      }
    };

    const result = GovernanceValidator.validate(envelope, activeMandates, transactionHistory);
    setLastResult({ scenario, result, config: activeMandates, envelope });
    if (result.allowed) {
      setTransactionHistory(prev => [envelope, ...prev]);
    }
  };

  const updateMandate = (key: keyof FinancialMandates, updates: Partial<GovernanceMandate<any>>) => {
    setPendingMandates(prev => ({
      ...prev,
      [key]: { ...prev[key], ...updates }
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
    setTransactionHistory([]);
  };

  return (
    <div className="app-layout">
      {/* ── Header ─────────────────────────────────────────── */}
      <header className="app-header">
        <div className="header-brand">
          <div className="header-brand-icon">
            <Shield size={16} />
          </div>
          <span className="header-brand-name">FAGF-FS</span>
          <span className="header-brand-sub">Governance Playground</span>
        </div>
        <div className="header-status">
          <div className="header-status-live">
            <div className="header-status-dot" />
            Live
          </div>
          {hasPendingChanges && (
            <div className="header-undeployed">
              <AlertTriangle size={12} />
              Undeployed
            </div>
          )}
          <span className="header-version">v1.0.0</span>
        </div>
      </header>

      {/* ── Body ───────────────────────────────────────────── */}
      <div className="app-body">

        {/* ── Left Panel: Configuration ──────────────────── */}
        <div className="panel panel-left">
          <div className="panel-header">
            <div className="panel-header-row">
              <div className="panel-title-group">
                <Settings size={18} className="panel-title-icon" />
                <div>
                  <div className="panel-title">Policy Configuration</div>
                  <div className="panel-subtitle">Configure active governance mandates</div>
                </div>
              </div>
              <button onClick={resetToDefaults} className="btn btn-secondary btn-sm">
                <RotateCcw size={14} />
                Reset
              </button>
            </div>

            {/* Deploy Banner */}
            <AnimatePresence>
              {hasPendingChanges && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  style={{ overflow: 'hidden' }}
                >
                  <div className="deploy-banner">
                    <div className="deploy-banner-label">
                      <AlertTriangle size={14} className="deploy-banner-icon" />
                      Changes pending deployment
                    </div>
                    <button
                      onClick={deployChanges}
                      disabled={isDeploying}
                      className={`btn ${isDeploying ? 'btn-deploy btn-deploy-loading' : 'btn-deploy'}`}
                    >
                      {isDeploying ? (
                        <>
                          <RotateCcw size={14} className="animate-spin" />
                          Deploying...
                        </>
                      ) : (
                        <>
                          <Zap size={14} />
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
                  initial={{ opacity: 0, y: 8, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                  className="deploy-success mt-3"
                >
                  <CheckCircle size={14} />
                  Policy deployed successfully
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="panel-content">
            <div className="space-y-6">

              {/* ── Financial Limits ──────────────────────── */}
              <div>
                <div className="section-header">
                  <DollarSign size={15} />
                  Financial Limits
                </div>

                <div className="card">
                  <div className="card-title-row">
                    <label className="card-label">Auto-Approve Threshold</label>
                    <span className="badge badge-success">{pendingMandates.confirmationThreshold.id}</span>
                  </div>
                  <div className="slider-container">
                    <input
                      type="range" min="0" max="500" step="25"
                      value={pendingMandates.confirmationThreshold.parameter}
                      onChange={(e) => updateMandate('confirmationThreshold', { parameter: Number(e.target.value) })}
                      className="slider"
                      style={{ '--value': `${(pendingMandates.confirmationThreshold.parameter / 500) * 100}%` } as any}
                    />
                    <div className="slider-value">
                      <span>$0</span>
                      <span className="slider-value-current">${pendingMandates.confirmationThreshold.parameter}</span>
                      <span>$500</span>
                    </div>
                  </div>
                  <p className="control-description">{getMandateDescription('confirmationThreshold', pendingMandates.confirmationThreshold.parameter)}</p>
                </div>

                <div className="card">
                  <div className="card-title-row">
                    <label className="card-label">Daily Spending Limit</label>
                    <span className="badge badge-danger">{pendingMandates.dailyAggregateLimit.id}</span>
                  </div>
                  <div className="slider-container">
                    <input
                      type="range" min="100" max="5000" step="100"
                      value={pendingMandates.dailyAggregateLimit.parameter}
                      onChange={(e) => updateMandate('dailyAggregateLimit', { parameter: Number(e.target.value) })}
                      className="slider slider-danger"
                      style={{ '--value': `${((pendingMandates.dailyAggregateLimit.parameter - 100) / 4900) * 100}%` } as any}
                    />
                    <div className="slider-value">
                      <span>$100</span>
                      <span className="slider-value-current slider-value-current-danger">${pendingMandates.dailyAggregateLimit.parameter}</span>
                      <span>$5,000</span>
                    </div>
                  </div>
                  <p className="control-description">{getMandateDescription('dailyAggregateLimit', pendingMandates.dailyAggregateLimit.parameter)}</p>
                </div>
              </div>

              {/* ── Authorization & Trust ─────────────────── */}
              <div>
                <div className="section-header">
                  <Store size={15} />
                  Authorization & Trust
                </div>

                <div className="card">
                  <div className="card-title-row">
                    <div className="card-label-row">
                      <label className="card-label">New Merchant Review</label>
                      <span className="badge badge-warning">{pendingMandates.newMerchantAuth.id}</span>
                    </div>
                    <label className="toggle">
                      <input
                        type="checkbox"
                        checked={pendingMandates.newMerchantAuth.parameter === true}
                        onChange={(e) => updateMandate('newMerchantAuth', { parameter: e.target.checked })}
                      />
                      <span className="toggle-track"></span>
                    </label>
                  </div>
                  <p className="control-description">{getMandateDescription('newMerchantAuth', pendingMandates.newMerchantAuth.parameter)}</p>
                </div>

                <div className="card">
                  <label className="section-label">Trusted Merchants</label>
                  <div className="input-row mb-2">
                    <input
                      type="text"
                      value={merchantInput}
                      onChange={(e) => setMerchantInput(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && addTrustedMerchant()}
                      placeholder="Add trusted vendor..."
                      className="input-field"
                    />
                    <button onClick={addTrustedMerchant} className="btn btn-primary btn-icon">
                      <Plus size={14} />
                    </button>
                  </div>
                  <div className="tag-list">
                    {trustedMerchants.map(merchant => (
                      <div key={merchant} className="tag">
                        <span>{merchant}</span>
                        <X size={12} className="tag-remove" onClick={() => removeTrustedMerchant(merchant)} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── Financial Crime Prevention ─────────────── */}
              <div>
                <div className="section-header">
                  <Shield size={15} />
                  Financial Crime Prevention
                </div>

                <div className="card">
                  <div className="card-title-row">
                    <label className="card-label">Blocked Categories</label>
                    <span className="badge badge-danger">{pendingMandates.blockedCategories.id}</span>
                  </div>
                  <div className="tag-list mb-3">
                    {(pendingMandates.blockedCategories.parameter as string[]).map(cat => (
                      <div key={cat} className="tag tag-danger">
                        <Lock size={10} />
                        <span>{cat}</span>
                        <X size={12} className="tag-remove" onClick={() => {
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
                    placeholder="Type & press Enter to add..."
                    className="input-field"
                  />
                  <p className="control-description">Transactions matching these categories are hard-blocked.</p>
                </div>

                <div className="card">
                  <div className="card-title-row">
                    <label className="card-label">Sanctions Watchlist</label>
                    <span className="badge badge-danger">{pendingMandates.sanctionedEntities.id}</span>
                  </div>
                  <div className="tag-list mb-3">
                    {(pendingMandates.sanctionedEntities.parameter as string[]).map(entity => (
                      <div key={entity} className="tag tag-danger">
                        <Ban size={10} />
                        <span>{entity}</span>
                        <X size={12} className="tag-remove" onClick={() => {
                          const current = pendingMandates.sanctionedEntities.parameter as string[];
                          updateMandate('sanctionedEntities', { parameter: current.filter(e => e !== entity) });
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
                          const current = pendingMandates.sanctionedEntities.parameter as string[];
                          if (!current.includes(val)) {
                            updateMandate('sanctionedEntities', { parameter: [...current, val] });
                            (e.target as HTMLInputElement).value = '';
                          }
                        }
                      }
                    }}
                    placeholder="Add sanctioned entity..."
                    className="input-field"
                  />
                  <p className="control-description">{getMandateDescription('sanctionedEntities', pendingMandates.sanctionedEntities.parameter)}</p>
                </div>
              </div>

              {/* ── Velocity & System Integrity ─────────────── */}
              <div>
                <div className="section-header">
                  <Activity size={15} />
                  Velocity & System Integrity
                </div>
                <div className="space-y-3">
                  <div className="card">
                    <div className="card-title-row">
                      <label className="card-label">Rate Limit</label>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--brand)' }}>
                        {pendingMandates.rateLimitPerHour.parameter} ops/hr
                      </span>
                    </div>
                    <input
                      type="range" min="1" max="100"
                      value={pendingMandates.rateLimitPerHour.parameter}
                      onChange={(e) => updateMandate('rateLimitPerHour', { parameter: Number(e.target.value) })}
                      className="slider"
                      style={{ '--value': `${(pendingMandates.rateLimitPerHour.parameter / 100) * 100}%` } as any}
                    />
                    <p className="control-description">{getMandateDescription('rateLimitPerHour', pendingMandates.rateLimitPerHour.parameter)}</p>
                  </div>

                  <div className="card">
                    <div className="card-title-row">
                      <label className="card-label">Cooldown Period</label>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--brand)' }}>
                        {pendingMandates.cooldownSeconds.parameter}s
                      </span>
                    </div>
                    <input
                      type="range" min="0" max="300" step="5"
                      value={pendingMandates.cooldownSeconds.parameter}
                      onChange={(e) => updateMandate('cooldownSeconds', { parameter: Number(e.target.value) })}
                      className="slider"
                      style={{ '--value': `${(pendingMandates.cooldownSeconds.parameter / 300) * 100}%` } as any}
                    />
                    <p className="control-description">{getMandateDescription('cooldownSeconds', pendingMandates.cooldownSeconds.parameter)}</p>
                  </div>

                  <div className="card">
                    <div className="card-title-row">
                      <label className="card-label">Duplicate Detection Window</label>
                      <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px', fontWeight: 600, color: 'var(--brand)' }}>
                        {pendingMandates.duplicateDetectionWindow.parameter}s
                      </span>
                    </div>
                    <input
                      type="range" min="0" max="600" step="10"
                      value={pendingMandates.duplicateDetectionWindow.parameter}
                      onChange={(e) => updateMandate('duplicateDetectionWindow', { parameter: Number(e.target.value) })}
                      className="slider"
                      style={{ '--value': `${(pendingMandates.duplicateDetectionWindow.parameter / 600) * 100}%` } as any}
                    />
                    <p className="control-description">{getMandateDescription('duplicateDetectionWindow', pendingMandates.duplicateDetectionWindow.parameter)}</p>
                  </div>

                  <div className="card">
                    <div className="card-title-row">
                      <label className="card-label">Payment Methods</label>
                      <span className="badge badge-success">{pendingMandates.allowedMethods.id}</span>
                    </div>
                    <div className="tag-list mb-2">
                      {(pendingMandates.allowedMethods.parameter as string[]).map(method => (
                        <div key={method} className="tag">
                          <span>{method}</span>
                          <X size={12} className="tag-remove" onClick={() => {
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
                      className="input-field"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Right Panel: Testing ──────────────────────── */}
        <div className="panel panel-right">
          <div className="panel-header">
            <div className="panel-title-group">
              <Play size={18} className="panel-title-icon" />
              <div>
                <div className="panel-title">Test Scenarios</div>
                <div className="panel-subtitle">Validate transactions against your active policy</div>
              </div>
            </div>
          </div>

          <div className="panel-content">
            {/* Quick Tests */}
            <div className="mb-6">
              <div className="section-label">Quick Tests</div>
              <div className="scenario-grid">
                {QUICK_SCENARIOS.map(scenario => (
                  <button
                    key={scenario.id}
                    onClick={() => testScenario(scenario)}
                    className="scenario-card"
                  >
                    <div className="scenario-card-header">
                      <span className="scenario-card-name">{scenario.name}</span>
                      <span className="scenario-card-amount">${scenario.amount}</span>
                    </div>
                    <div className="scenario-card-merchant">{scenario.merchant}</div>
                    <div className="scenario-card-desc">{scenario.description}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Scenario */}
            <div className="mb-6">
              <div className="section-label">Custom Scenario</div>
              <div className="card">
                <div className="form-row mb-3">
                  <div className="form-group">
                    <label className="field-label">Amount ($)</label>
                    <input
                      type="number"
                      value={customAmount}
                      onChange={(e) => setCustomAmount(Number(e.target.value))}
                      className="input-field"
                      placeholder="100"
                    />
                  </div>
                  <div className="form-group">
                    <label className="field-label">Category</label>
                    <select
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className="select-field"
                    >
                      {categoryOptions.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="form-row mb-3">
                  <div className="form-group">
                    <label className="field-label">Merchant Name</label>
                    <input
                      type="text"
                      value={customMerchant}
                      onChange={(e) => setCustomMerchant(e.target.value)}
                      className="input-field"
                      placeholder="Enter merchant name..."
                    />
                  </div>
                  <div className="form-group">
                    <label className="field-label">Payment Method</label>
                    <select
                      value={customPaymentMethod}
                      onChange={(e) => setCustomPaymentMethod(e.target.value)}
                      className="select-field"
                    >
                      {paymentMethodOptions.map(method => (
                        <option key={method} value={method}>{method}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <button
                  onClick={() => testScenario(null, true)}
                  disabled={!customMerchant}
                  className="btn btn-primary btn-full"
                >
                  <Play size={14} />
                  Test Custom Scenario
                </button>
              </div>
            </div>

            {/* Results */}
            <AnimatePresence mode="wait">
              {lastResult && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 24, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -16 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="section-label">Validation Result</div>

                  <div className={`result-card ${
                    lastResult.result.allowed
                      ? 'result-approved'
                      : lastResult.result.requiresApproval
                        ? 'result-hitl'
                        : 'result-blocked'
                  }`}>
                    <div className="result-verdict">
                      <div className="result-verdict-icon">
                        {lastResult.result.allowed ? (
                          <CheckCircle size={28} color="var(--success)" strokeWidth={2} />
                        ) : lastResult.result.requiresApproval ? (
                          <AlertTriangle size={28} color="var(--warning)" strokeWidth={2} />
                        ) : (
                          <XCircle size={28} color="var(--danger)" strokeWidth={2} />
                        )}
                      </div>
                      <div>
                        <div className="result-verdict-title">
                          {lastResult.result.allowed
                            ? 'APPROVED'
                            : lastResult.result.requiresApproval
                              ? 'REVIEW REQUIRED'
                              : 'BLOCKED'}
                        </div>
                        <div className="result-verdict-reason">{lastResult.result.reason}</div>
                      </div>
                    </div>

                    <div className="result-details">
                      <div>
                        <div className="result-detail-label">Amount</div>
                        <div className="result-detail-value result-detail-value-amount">
                          ${lastResult.envelope.transaction.amount}
                        </div>
                      </div>
                      <div>
                        <div className="result-detail-label">Merchant</div>
                        <div className="result-detail-value">
                          {lastResult.envelope.transaction.merchantName}
                        </div>
                      </div>
                      <div>
                        <div className="result-detail-label">Category</div>
                        <div className="result-detail-value">
                          {lastResult.envelope.transaction.category}
                        </div>
                      </div>
                      <div>
                        <div className="result-detail-label">Payment Method</div>
                        <div className="result-detail-value">
                          {lastResult.envelope.transaction.paymentMethod}
                        </div>
                      </div>
                    </div>

                    {lastResult.result.triggeredMandates.length > 0 && (
                      <div className="result-mandates">
                        <div className="result-mandates-label">Policies Flagged</div>
                        <div className="result-mandates-list">
                          {lastResult.result.triggeredMandates.map(m => (
                            <span
                              key={m}
                              className={`badge ${
                                lastResult.result.allowed
                                  ? 'badge-success'
                                  : lastResult.result.requiresApproval
                                    ? 'badge-warning'
                                    : 'badge-danger'
                              }`}
                            >
                              <Shield size={10} />
                              {m}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="result-enforcement">
                      <div>AUTH_LIMIT: <span className="result-enforcement-value">${lastResult.config.confirmationThreshold.parameter}</span></div>
                      <div>DAILY_REMAINING: <span className="result-enforcement-value">
                        ${Math.max(0, lastResult.config.dailyAggregateLimit.parameter - transactionHistory.reduce((sum, h) => sum + h.transaction.amount, 0))}
                      </span></div>
                    </div>
                  </div>

                  <div className="info-card">
                    <Info size={18} className="info-card-icon" />
                    <div>
                      <div className="info-card-title">Understanding This Result</div>
                      <div className="info-card-body">
                        {lastResult.result.allowed && !lastResult.result.requiresApproval && (
                          <p>This transaction passed all mandate checks and was approved automatically. The amount is within your auto-approve threshold and no blocking rules were triggered.</p>
                        )}
                        {lastResult.result.requiresApproval && (
                          <p>This transaction requires <strong>Human-in-the-Loop (HITL)</strong> approval because it exceeded your configured thresholds or involved a new merchant.</p>
                        )}
                        {!lastResult.result.allowed && !lastResult.result.requiresApproval && (
                          <p>This transaction was <strong>hard-blocked</strong> due to a categorical restriction. This is a safety measure that cannot be overridden without changing the policy.</p>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {!lastResult && (
              <div className="empty-state">
                <Shield size={48} className="empty-state-icon" />
                <div className="empty-state-title">No tests run yet</div>
                <div className="empty-state-desc">
                  Select a quick scenario or build a custom one to see validation results
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
