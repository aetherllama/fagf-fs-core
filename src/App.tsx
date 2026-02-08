import React, { useState } from 'react';
import {
  Bot,
  User,
  Shield,
  CheckCircle,
  XCircle,
  AlertTriangle,
  ArrowRight,
  RotateCcw,
  BookOpen,
  Sparkles,
  DollarSign,
  Lock,
  UserCheck
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { GovernanceValidator } from './core/validator';
import { DEFAULT_MAS_MANDATES } from './core/mandates';
import { GovernanceEnvelope } from './core/types';

type Act = 'intro' | 'act1' | 'act2' | 'act3' | 'act4' | 'finale';
type Scene = string;

interface StoryState {
  act: Act;
  scene: Scene;
  userChoices: Record<string, string>;
  transactions: GovernanceEnvelope[];
}

export default function App() {
  const [story, setStory] = useState<StoryState>({
    act: 'intro',
    scene: 'welcome',
    userChoices: {},
    transactions: []
  });

  const makeChoice = (choiceId: string, value: string) => {
    setStory(prev => ({
      ...prev,
      userChoices: { ...prev.userChoices, [choiceId]: value }
    }));
  };

  const nextScene = (nextAct: Act, nextScene: Scene) => {
    setStory(prev => ({ ...prev, act: nextAct, scene: nextScene }));
  };

  const addTransaction = (tx: GovernanceEnvelope) => {
    setStory(prev => ({ ...prev, transactions: [tx, ...prev.transactions] }));
  };

  const restart = () => {
    setStory({ act: 'intro', scene: 'welcome', userChoices: {}, transactions: [] });
  };

  const currentProgress = {
    intro: 0,
    act1: 1,
    act2: 2,
    act3: 3,
    act4: 4,
    finale: 4
  }[story.act];

  return (
    <div className="story-container">
      {/* Progress Tracker */}
      {story.act !== 'intro' && (
        <div className="progress-tracker">
          {[0, 1, 2, 3, 4].map(i => (
            <div
              key={i}
              className={`progress-dot ${i < currentProgress ? 'complete' : i === currentProgress ? 'active' : ''}`}
            />
          ))}
        </div>
      )}

      <AnimatePresence mode="wait">
        {/* INTRO */}
        {story.act === 'intro' && <IntroScene onStart={() => nextScene('act1', 'setup')} />}

        {/* ACT 1: The Setup - First Autonomous Purchase */}
        {story.act === 'act1' && story.scene === 'setup' && (
          <Act1Setup
            onChoice={(choice) => {
              makeChoice('act1_approach', choice);
              nextScene('act1', 'outcome');
            }}
          />
        )}
        {story.act === 'act1' && story.scene === 'outcome' && (
          <Act1Outcome
            choice={story.userChoices.act1_approach}
            onContinue={() => nextScene('act2', 'challenge')}
            onTransaction={addTransaction}
          />
        )}

        {/* ACT 2: The Challenge - Configuring Policies */}
        {story.act === 'act2' && story.scene === 'challenge' && (
          <Act2Challenge
            onChoice={(choice) => {
              makeChoice('act2_policy', choice);
              nextScene('act2', 'outcome');
            }}
          />
        )}
        {story.act === 'act2' && story.scene === 'outcome' && (
          <Act2Outcome
            choice={story.userChoices.act2_policy}
            onContinue={() => nextScene('act3', 'crisis')}
            onTransaction={addTransaction}
          />
        )}

        {/* ACT 3: The Crisis - Hard Block */}
        {story.act === 'act3' && story.scene === 'crisis' && (
          <Act3Crisis onContinue={() => nextScene('act3', 'outcome')} />
        )}
        {story.act === 'act3' && story.scene === 'outcome' && (
          <Act3Outcome
            onContinue={() => nextScene('act4', 'reflection')}
            onTransaction={addTransaction}
          />
        )}

        {/* ACT 4: The Reflection - Audit Trail */}
        {story.act === 'act4' && (
          <Act4Reflection
            transactions={story.transactions}
            choices={story.userChoices}
            onFinish={() => nextScene('finale', 'end')}
          />
        )}

        {/* FINALE */}
        {story.act === 'finale' && <Finale onRestart={restart} />}
      </AnimatePresence>
    </div>
  );
}

// ============ INTRO ============
function IntroScene({ onStart }: { onStart: () => void }) {
  return (
    <motion.div
      key="intro"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="story-card text-center"
    >
      <div className="flex justify-center mb-8">
        <div className="p-6 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl shadow-2xl">
          <Shield size={64} className="text-white" />
        </div>
      </div>
      <h1 className="text-5xl font-black mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
        AI Guardrails 101
      </h1>
      <p className="dialogue mb-8 max-w-2xl mx-auto">
        Welcome! You're about to learn how to keep AI agents safe through <strong>governance mandates</strong>.
      </p>
      <p className="narrative mb-12 max-w-2xl mx-auto">
        In this interactive story, you'll play as the <strong>CEO of a startup</strong> that uses an AI assistant
        to manage company spending. Through your choices, you'll discover why guardrails matter and how they work.
      </p>
      <button onClick={onStart} className="choice-btn choice-btn-success inline-flex items-center gap-3 w-auto px-12">
        <Sparkles size={24} />
        <span>Start Learning</span>
        <ArrowRight size={24} />
      </button>
    </motion.div>
  );
}

// ============ ACT 1: Setup ============
function Act1Setup({ onChoice }: { onChoice: (choice: string) => void }) {
  return (
    <motion.div
      key="act1-setup"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="story-card"
    >
      <div className="flex items-start gap-6 mb-8">
        <div className="avatar avatar-ai">🤖</div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-2">Your AI Assistant</h3>
          <p className="dialogue">
            "I've identified a cost optimization opportunity. I can reduce our AWS spending by scaling down dev instances.
            This will cost <strong>$15/month</strong>. Should I proceed?"
          </p>
        </div>
      </div>

      <div className="p-6 bg-slate-800/40 rounded-xl border border-white/10 mb-8">
        <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
          <BookOpen size={20} className="text-indigo-400" />
          The Scenario
        </h4>
        <p className="narrative">
          This is a <strong>routine, low-value transaction</strong> from a trusted vendor (AWS).
          You can either let the AI handle it autonomously or review it yourself.
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-xl font-bold mb-4">What do you do?</h4>
        <button onClick={() => onChoice('autonomous')} className="choice-btn w-full">
          <div className="flex items-center gap-3 mb-2">
            <Bot size={24} className="text-indigo-400" />
            <span className="text-xl font-bold">Let AI Decide Autonomously</span>
          </div>
          <p className="text-sm text-slate-400">Trust the AI to handle routine purchases automatically.</p>
        </button>
        <button onClick={() => onChoice('review')} className="choice-btn choice-btn-warning w-full">
          <div className="flex items-center gap-3 mb-2">
            <UserCheck size={24} className="text-amber-400" />
            <span className="text-xl font-bold">Review Before Approving</span>
          </div>
          <p className="text-sm text-slate-400">Manually approve every transaction, even small ones.</p>
        </button>
      </div>
    </motion.div>
  );
}

function Act1Outcome({ choice, onContinue, onTransaction }: {
  choice: string;
  onContinue: () => void;
  onTransaction: (tx: GovernanceEnvelope) => void;
}) {
  const envelope: GovernanceEnvelope = {
    transaction: {
      amount: 15,
      destination: 'aws_devops',
      merchantName: 'AWS Cloud Services',
      category: 'SaaS / API',
      timestamp: Date.now(),
      paymentMethod: 'Corporate Card'
    },
    reasoning: 'Cost optimization through automated resource scaling',
    context: { isNewMerchant: false, historyDepth: 24, riskScore: 1 }
  };

  const result = GovernanceValidator.validate(envelope, DEFAULT_MAS_MANDATES, []);

  React.useEffect(() => {
    if (result.allowed) onTransaction(envelope);
  }, []);

  return (
    <motion.div
      key="act1-outcome"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="story-card"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="avatar avatar-system">⚙️</div>
        <div>
          <h3 className="text-2xl font-black">Governance System</h3>
          <p className="text-sm text-slate-400">Evaluating transaction...</p>
        </div>
      </div>

      <div className={`outcome-panel ${result.allowed ? 'outcome-success' : 'outcome-danger'}`}>
        <div className="flex items-center gap-4 mb-6">
          {result.allowed ? (
            <CheckCircle size={48} className="text-emerald-500" />
          ) : (
            <XCircle size={48} className="text-rose-500" />
          )}
          <div>
            <h4 className="text-3xl font-black mb-1">
              {result.allowed ? '✅ APPROVED' : '❌ BLOCKED'}
            </h4>
            <p className="text-lg font-semibold text-slate-300">{result.reason}</p>
          </div>
        </div>

        {result.triggeredMandates.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {result.triggeredMandates.map(m => (
              <span key={m} className="mandate-badge mandate-badge-success">
                <Shield size={14} /> {m}
              </span>
            ))}
          </div>
        )}
      </div>

      <div className="p-6 bg-indigo-600/10 rounded-xl border border-indigo-500/20 my-8">
        <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Sparkles size={20} className="text-indigo-400" />
          What You Learned
        </h4>
        <div className="space-y-3 explanation">
          {choice === 'autonomous' ? (
            <>
              <p>✅ <strong>Good choice!</strong> For routine, low-risk transactions from trusted merchants,
                autonomous approval is efficient and safe.</p>
              <p>The mandate <code className="px-2 py-1 bg-slate-800 rounded text-emerald-400">fagf-val-01</code> automatically
                approved this because:</p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Amount is under $100 (low value)</li>
                <li>AWS is a trusted merchant</li>
                <li>Category is "SaaS/API" (allowed)</li>
              </ul>
            </>
          ) : (
            <>
              <p>⚠️ You chose manual review. While safe, this creates <strong>friction</strong> for every small purchase.</p>
              <p>The governance system <em>could</em> have approved this automatically via
                mandate <code className="px-2 py-1 bg-slate-800 rounded">fagf-val-01</code> because it's low-risk.</p>
              <p><strong>Key insight:</strong> Good guardrails balance safety with efficiency.</p>
            </>
          )}
        </div>
      </div>

      <button onClick={onContinue} className="choice-btn choice-btn-success w-full">
        <span className="text-xl font-bold flex items-center justify-center gap-3">
          Continue to Act 2 <ArrowRight size={24} />
        </span>
      </button>
    </motion.div>
  );
}

// ============ ACT 2: Challenge ============
function Act2Challenge({ onChoice }: { onChoice: (choice: string) => void }) {
  return (
    <motion.div
      key="act2-challenge"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="story-card"
    >
      <div className="flex items-start gap-6 mb-8">
        <div className="avatar avatar-ai">🤖</div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-2">Your AI Assistant</h3>
          <p className="dialogue">
            "I need to book a flight to Singapore for our lead engineer. It's urgent for the new project launch.
            Cost: <strong>$1,250</strong>. This is above my usual spending limit."
          </p>
        </div>
      </div>

      <div className="p-6 bg-slate-800/40 rounded-xl border border-white/10 mb-8">
        <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
          <AlertTriangle size={20} className="text-amber-400" />
          The Challenge
        </h4>
        <p className="narrative">
          This is a <strong>high-value transaction</strong> ($1,250). Your current policy allows autonomous
          approval up to $100. How should the AI handle purchases above that threshold?
        </p>
      </div>

      <div className="space-y-4">
        <h4 className="text-xl font-bold mb-4">Configure your policy:</h4>
        <button onClick={() => onChoice('no_limit')} className="choice-btn choice-btn-danger w-full">
          <div className="flex items-center gap-3 mb-2">
            <XCircle size={24} className="text-rose-400" />
            <span className="text-xl font-bold">Remove All Limits</span>
          </div>
          <p className="text-sm text-slate-400">Let AI spend any amount without approval. Maximum autonomy, maximum risk.</p>
        </button>
        <button onClick={() => onChoice('hitl')} className="choice-btn choice-btn-success w-full">
          <div className="flex items-center gap-3 mb-2">
            <UserCheck size={24} className="text-emerald-400" />
            <span className="text-xl font-bold">Require Human Approval (HITL)</span>
          </div>
          <p className="text-sm text-slate-400">For purchases above $100, escalate to you for review. Balanced approach.</p>
        </button>
        <button onClick={() => onChoice('block_all')} className="choice-btn choice-btn-warning w-full">
          <div className="flex items-center gap-3 mb-2">
            <Lock size={24} className="text-amber-400" />
            <span className="text-xl font-bold">Block All High-Value Transactions</span>
          </div>
          <p className="text-sm text-slate-400">Automatically reject anything over $100. Ultra-safe but limits AI usefulness.</p>
        </button>
      </div>
    </motion.div>
  );
}

function Act2Outcome({ choice, onContinue, onTransaction }: {
  choice: string;
  onContinue: () => void;
  onTransaction: (tx: GovernanceEnvelope) => void;
}) {
  const envelope: GovernanceEnvelope = {
    transaction: {
      amount: 1250,
      destination: 'singapore_airlines',
      merchantName: 'Singapore Airlines',
      category: 'Travel / Logistics',
      timestamp: Date.now(),
      paymentMethod: 'Corporate Card'
    },
    reasoning: 'Urgent talent relocation for project launch',
    context: { isNewMerchant: false, historyDepth: 50, riskScore: 2 }
  };

  const customMandates = choice === 'no_limit'
    ? { ...DEFAULT_MAS_MANDATES, maxTransactionValue: 999999 }
    : choice === 'block_all'
      ? { ...DEFAULT_MAS_MANDATES, maxTransactionValue: 100 }
      : DEFAULT_MAS_MANDATES;

  const result = GovernanceValidator.validate(envelope, customMandates, []);

  const requiresHITL = choice === 'hitl' && envelope.transaction.amount > 100;

  React.useEffect(() => {
    if (result.allowed && !requiresHITL) onTransaction(envelope);
  }, []);

  return (
    <motion.div
      key="act2-outcome"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="story-card"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="avatar avatar-system">⚙️</div>
        <div>
          <h3 className="text-2xl font-black">Governance System</h3>
          <p className="text-sm text-slate-400">Applying your policy...</p>
        </div>
      </div>

      {requiresHITL ? (
        <div className="outcome-panel outcome-warning">
          <div className="flex items-center gap-4 mb-6">
            <AlertTriangle size={48} className="text-amber-500 pulse" />
            <div>
              <h4 className="text-3xl font-black mb-1 text-amber-500">⏸️ HITL REQUIRED</h4>
              <p className="text-lg font-semibold text-slate-300">Human approval needed for high-value transaction</p>
            </div>
          </div>
          <div className="p-4 bg-slate-900/50 rounded-lg mb-4">
            <p className="font-mono text-sm text-slate-300">
              Transaction: <strong className="text-white">$1,250</strong> → Singapore Airlines
            </p>
          </div>
        </div>
      ) : (
        <div className={`outcome-panel ${result.allowed ? 'outcome-success' : 'outcome-danger'}`}>
          <div className="flex items-center gap-4 mb-6">
            {result.allowed ? (
              <CheckCircle size={48} className="text-emerald-500" />
            ) : (
              <XCircle size={48} className="text-rose-500" />
            )}
            <div>
              <h4 className="text-3xl font-black mb-1">
                {result.allowed ? '✅ APPROVED' : '❌ BLOCKED'}
              </h4>
              <p className="text-lg font-semibold text-slate-300">{result.reason}</p>
            </div>
          </div>
        </div>
      )}

      <div className="p-6 bg-indigo-600/10 rounded-xl border border-indigo-500/20 my-8">
        <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Sparkles size={20} className="text-indigo-400" />
          What You Learned
        </h4>
        <div className="space-y-3 explanation">
          {choice === 'no_limit' && (
            <>
              <p>❌ <strong>Risky choice.</strong> Removing limits means the AI could spend unlimited amounts
                without oversight. In a real scenario, this could lead to massive unexpected expenses.</p>
              <p><strong>Better approach:</strong> Use value thresholds to trigger human review for large purchases.</p>
            </>
          )}
          {choice === 'hitl' && (
            <>
              <p>✅ <strong>Excellent choice!</strong> <strong>HITL (Human-in-the-Loop)</strong> is a key pattern
                in AI governance.</p>
              <p>The mandate <code className="px-2 py-1 bg-slate-800 rounded text-amber-400">fagf-auth-01</code> triggered
                because the amount exceeded your $100 threshold.</p>
              <p><strong>Key insight:</strong> HITL balances autonomy with control. The AI can still act, but you
                approve high-stakes decisions.</p>
            </>
          )}
          {choice === 'block_all' && (
            <>
              <p>⚠️ <strong>Over-conservative.</strong> Blocking all high-value transactions prevents the AI from
                being useful for important business needs.</p>
              <p><strong>Better approach:</strong> Escalate to HITL instead of blocking. This maintains safety while
                preserving flexibility.</p>
            </>
          )}
        </div>
      </div>

      <button onClick={onContinue} className="choice-btn choice-btn-success w-full">
        <span className="text-xl font-bold flex items-center justify-center gap-3">
          Continue to Act 3 <ArrowRight size={24} />
        </span>
      </button>
    </motion.div>
  );
}

// ============ ACT 3: Crisis ============
function Act3Crisis({ onContinue }: { onContinue: () => void }) {
  return (
    <motion.div
      key="act3-crisis"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="story-card"
    >
      <div className="flex items-start gap-6 mb-8">
        <div className="avatar avatar-ai">🤖</div>
        <div className="flex-1">
          <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-2">Your AI Assistant</h3>
          <p className="dialogue">
            "I've discovered a yield-generation opportunity on Binance Exchange. By allocating $50 to their
            staking platform, we could earn 15% APY. Shall I proceed?"
          </p>
        </div>
      </div>

      <div className="p-6 bg-rose-900/20 rounded-xl border border-rose-500/30 mb-8">
        <h4 className="text-lg font-bold mb-3 flex items-center gap-2 text-rose-400">
          <XCircle size={20} />
          Red Flag Detected
        </h4>
        <p className="narrative">
          This is a <strong>forbidden category</strong>: Cryptocurrency/Gambling platforms are prohibited
          by your company policy due to regulatory and risk concerns.
        </p>
      </div>

      <button onClick={onContinue} className="choice-btn choice-btn-danger w-full">
        <div className="flex items-center gap-3 mb-2">
          <Shield size={24} className="text-rose-400" />
          <span className="text-xl font-bold">See Governance Response</span>
        </div>
        <p className="text-sm text-slate-400">No choice needed — the system will enforce policy automatically.</p>
      </button>
    </motion.div>
  );
}

function Act3Outcome({ onContinue, onTransaction }: {
  onContinue: () => void;
  onTransaction: (tx: GovernanceEnvelope) => void;
}) {
  const envelope: GovernanceEnvelope = {
    transaction: {
      amount: 50,
      destination: 'binance_global',
      merchantName: 'Binance Exchange',
      category: 'Ungoverned Gambling',
      timestamp: Date.now(),
      paymentMethod: 'Corporate Card'
    },
    reasoning: 'Yield generation via staking platform',
    context: { isNewMerchant: true, historyDepth: 0, riskScore: 5 }
  };

  const result = GovernanceValidator.validate(envelope, DEFAULT_MAS_MANDATES, []);

  return (
    <motion.div
      key="act3-outcome"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="story-card"
    >
      <div className="flex items-center gap-4 mb-8">
        <div className="avatar avatar-system">⚙️</div>
        <div>
          <h3 className="text-2xl font-black">Governance System</h3>
          <p className="text-sm text-slate-400">Categorical enforcement...</p>
        </div>
      </div>

      <div className="outcome-panel outcome-danger">
        <div className="flex items-center gap-4 mb-6">
          <XCircle size={64} className="text-rose-500" strokeWidth={3} />
          <div>
            <h4 className="text-4xl font-black mb-1 text-rose-500">🚫 HARD BLOCK</h4>
            <p className="text-xl font-semibold text-white">{result.reason}</p>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap mb-6">
          {result.triggeredMandates.map(m => (
            <span key={m} className="mandate-badge mandate-badge-danger">
              <Lock size={14} /> {m}
            </span>
          ))}
        </div>

        <div className="p-4 bg-rose-950/50 rounded-lg border border-rose-500/20">
          <p className="text-sm font-semibold text-rose-300">
            ⚠️ This transaction was rejected <strong>instantly</strong> with no option for override.
            Category-based mandates provide absolute safety rails.
          </p>
        </div>
      </div>

      <div className="p-6 bg-indigo-600/10 rounded-xl border border-indigo-500/20 my-8">
        <h4 className="text-lg font-bold mb-3 flex items-center gap-2">
          <Sparkles size={20} className="text-indigo-400" />
          What You Learned
        </h4>
        <div className="space-y-3 explanation">
          <p>✅ <strong>Critical safety pattern!</strong> Some categories should be <strong>hard-blocked</strong>
            regardless of amount or context.</p>
          <p>The mandate <code className="px-2 py-1 bg-slate-800 rounded text-rose-400">fagf-cat-01</code> enforces
            a categorical ban on gambling/crypto platforms.</p>
          <p><strong>Key insight:</strong> Not everything should be escalated to HITL. Some risks are simply off-limits.</p>
          <p>This prevents AI hallucinations or prompt injections from bypassing critical compliance rules.</p>
        </div>
      </div>

      <button onClick={onContinue} className="choice-btn choice-btn-success w-full">
        <span className="text-xl font-bold flex items-center justify-center gap-3">
          Continue to Final Act <ArrowRight size={24} />
        </span>
      </button>
    </motion.div>
  );
}

// ============ ACT 4: Reflection ============
function Act4Reflection({ transactions, choices, onFinish }: {
  transactions: GovernanceEnvelope[];
  choices: Record<string, string>;
  onFinish: () => void;
}) {
  return (
    <motion.div
      key="act4-reflection"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="story-card"
    >
      <div className="text-center mb-8">
        <div className="inline-flex p-4 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-2xl mb-4">
          <CheckCircle size={48} className="text-white" />
        </div>
        <h2 className="text-4xl font-black mb-3">Journey Complete!</h2>
        <p className="text-lg text-slate-400">You've experienced the three pillars of AI governance:</p>
      </div>

      <div className="space-y-6 mb-8">
        <div className="p-6 bg-emerald-600/10 rounded-xl border border-emerald-500/20">
          <h4 className="text-xl font-bold mb-2 text-emerald-400">1. Autonomous Approval</h4>
          <p className="explanation">Low-risk, routine transactions can be approved automatically for efficiency.</p>
        </div>
        <div className="p-6 bg-amber-600/10 rounded-xl border border-amber-500/20">
          <h4 className="text-xl font-bold mb-2 text-amber-400">2. Human-in-the-Loop (HITL)</h4>
          <p className="explanation">High-value or new scenarios escalate to human review, balancing autonomy with control.</p>
        </div>
        <div className="p-6 bg-rose-600/10 rounded-xl border border-rose-500/20">
          <h4 className="text-xl font-bold mb-2 text-rose-400">3. Hard Blocks</h4>
          <p className="explanation">Forbidden categories are rejected instantly, no exceptions. Critical for compliance.</p>
        </div>
      </div>

      <div className="p-6 bg-slate-800/60 rounded-xl border border-white/10 mb-8">
        <h4 className="text-lg font-bold mb-4 flex items-center gap-2">
          <DollarSign size={20} className="text-indigo-400" />
          Your Transaction History
        </h4>
        {transactions.length > 0 ? (
          <div className="space-y-3">
            {transactions.map((tx, idx) => (
              <div key={idx} className="p-4 bg-slate-900/50 rounded-lg flex items-center justify-between">
                <div>
                  <p className="font-bold text-white">${tx.transaction.amount} → {tx.transaction.merchantName}</p>
                  <p className="text-xs text-slate-500">{tx.transaction.category}</p>
                </div>
                <span className="mandate-badge mandate-badge-success text-xs">VALIDATED</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-slate-400 italic">No transactions were approved in your journey.</p>
        )}
      </div>

      <div className="p-6 bg-indigo-900/20 rounded-xl border border-indigo-500/30 mb-8">
        <h4 className="text-lg font-bold mb-3">🎓 Next Steps</h4>
        <p className="explanation mb-4">
          You now understand the fundamentals of AI guardrails. To dive deeper, explore the
          <strong> FAGF-FS Technical Specification</strong> which defines the full mandate framework.
        </p>
        <a
          href="https://github.com/aetherllama/fagf-fs-core"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-lg font-bold transition-colors"
        >
          <BookOpen size={20} />
          View Full Specification
        </a>
      </div>

      <button onClick={onFinish} className="choice-btn choice-btn-success w-full">
        <span className="text-xl font-bold flex items-center justify-center gap-3">
          Finish Tutorial <Sparkles size={24} />
        </span>
      </button>
    </motion.div>
  );
}

// ============ FINALE ============
function Finale({ onRestart }: { onRestart: () => void }) {
  return (
    <motion.div
      key="finale"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="story-card text-center"
    >
      <div className="flex justify-center mb-8">
        <div className="p-6 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-3xl shadow-2xl">
          <Sparkles size={64} className="text-white" />
        </div>
      </div>
      <h1 className="text-5xl font-black mb-6">Thank You!</h1>
      <p className="dialogue mb-8 max-w-2xl mx-auto">
        You've completed the <strong>AI Guardrails 101</strong> interactive tutorial.
        You now know how to govern autonomous AI agents safely and effectively.
      </p>
      <div className="flex gap-4 justify-center">
        <button onClick={onRestart} className="choice-btn inline-flex items-center gap-3 w-auto px-8">
          <RotateCcw size={20} />
          <span>Restart Tutorial</span>
        </button>
      </div>
    </motion.div>
  );
}
