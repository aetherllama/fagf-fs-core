# SAFR: Safeguards for Agentic Finance at Runtime

**Version: 2.0.0** | Active contribution to the MAS SAFR working group

## About

This repository is an active working implementation that contributes to the **SAFR (Safeguards for Agentic Finance at Runtime)** framework — an industry initiative led by the Monetary Authority of Singapore (MAS) under the BuildFin.ai programme. SAFR defines how AI agents in financial services can be authorized to act, how their actions are validated in real time, and how every governance decision is recorded before execution occurs.

Work in this repo feeds directly into the SAFR specification: the Controls Repository schema, Disposition Engine logic, disposition outcome taxonomy, and audit log structure developed here are aligned with and intended to inform the evolving MAS SAFR standard.

### Background

The rapid advancement of AI agents capable of autonomous decision-making has created a critical gap: **how do we ensure these agents operate safely within financial regulations while maintaining the speed and efficiency that makes them valuable?** Traditional post-execution auditing is insufficient when agents can execute transactions in milliseconds. SAFR addresses this by introducing **pre-execution governance** through a real-time Disposition Engine.

### Who Is This For?

- **SAFR Contributors**: Practitioners and institutions actively shaping the SAFR specification
- **Financial Institutions**: Banks, fintechs, and payment processors deploying AI agents for autonomous operations
- **Regulatory Bodies**: Organizations seeking working implementations of AI governance frameworks in finance
- **AI Developers**: Teams building autonomous agents that handle financial transactions
- **Compliance Officers**: Professionals responsible for ensuring AI systems meet regulatory requirements
- **Researchers**: Academics studying safe AI deployment in high-stakes domains

## What is SAFR?

The **Safeguards for Agentic Finance at Runtime (SAFR)** framework provides a set of governance checkpoints that verify and record an AI agent's proposed actions before execution. SAFR builds on MAS Project MindForge's AI Risk Management toolkit with four safeguard principles embedded into system operations:

1. **Policy-Bound Execution** — all agent actions must comply with pre-configured institutional controls
2. **Real-Time Validation** — checks happen before execution, not after
3. **Auditability** — every governance decision is captured in a tamper-evident audit log
4. **Interoperability** — works across agent architectures via native integration or gateway model

### The Problem

Modern AI agents can propose and execute financial transactions autonomously, but without proper governance:
- **Risk**: Agents could execute unauthorized high-value transactions
- **Compliance**: Regulatory requirements (MAS, GDPR, AML) may be violated
- **Safety**: Hallucinations or reasoning errors could cause financial harm
- **Auditability**: Lack of transparency in decision-making processes

### The Solution

SAFR introduces a **Disposition Engine** that sits between the AI agent and financial rails, providing four possible outcomes for every proposed action:

- ✅ **Auto-Execute** — action approved for immediate execution
- 🚫 **Reject** — action hard-blocked by a categorical control
- ⏸️ **HITL Escalation** — action escalated for human review
- 👁️ **Flag & Monitor** — action proceeds but is flagged in the audit log

## SAFR Architecture

### Four Core Components

| Component | Description |
| :--- | :--- |
| **Agent Identity** | Verifies the AI agent's credentials and authority before any action is evaluated |
| **Controls Repository** | Stores institutional policies, risk parameters, and mandate definitions |
| **Disposition Engine** | Evaluates proposed actions against the Controls Repository in real time |
| **Audit Log** | Creates a tamper-evident record of every governance decision |

### How It Works

```
┌─────────────────┐
│  AI Agent       │
│  (Proposes)     │
└────────┬────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  SAFR Governance Envelope            │
│  ┌────────────────────────────────┐  │
│  │ Transaction: $2,500            │  │
│  │ Merchant: Apple Inc            │  │
│  │ Agent Reasoning: "New laptop"  │  │
│  │ Context: isNewMerchant=false   │  │
│  └────────────────────────────────┘  │
└────────┬─────────────────────────────┘
         │
         ▼
┌──────────────────────────────────────┐
│  SAFR Disposition Engine             │
│  ┌────────────────────────────────┐  │
│  │ 1. Verify Agent Identity       │  │
│  │ 2. Check Controls Repository   │  │
│  │    ✓ Category not blocked      │  │
│  │    ⚠ Exceeds HITL threshold    │  │
│  │    ✓ Payment method allowed    │  │
│  └────────────────────────────────┘  │
│  Disposition: HITL Escalation        │
└────────┬─────────────────────────────┘
         │
         ▼
┌─────────────────┐     ┌──────────────────┐
│  Human Approver │     │  Audit Log       │
│  (Reviews)      │     │  (Records)       │
└────────┬────────┘     └──────────────────┘
         │
         ▼
┌─────────────────┐
│  Financial Rail │
│  (Executes)     │
└─────────────────┘
```

## Key Features

### Controls Repository
- **Categorical Blocklists**: Hard reject for prohibited categories (gambling, unlicensed activities)
- **Spending Controls**: Configurable thresholds for autonomous vs. HITL execution
- **Velocity Controls**: Rate limiting to prevent runaway agent behavior
- **Authorization Controls**: Agent identity verification, new merchant checks, payment channel restrictions

### Disposition Engine
- **Real-Time**: Validates before execution, not after
- **Deterministic**: Same input always produces same disposition
- **Stateless**: Can be horizontally scaled
- **Interoperable**: Native integration or gateway model

### Audit Log
- **Tamper-Evident**: Every disposition is logged with full context
- **Triggered Controls**: See exactly which rules fired and why
- **Agent Reasoning**: Agent explanations are preserved alongside the governance decision
- **Governance Signature**: Financial rails can require a valid SAFR signature before accepting actions

## Regulatory Alignment

SAFR is built on MAS Project MindForge and aligns with:
- **MAS SAFR White Paper**: Primary specification source
- **MAS Project MindForge**: AI Risk Management Toolkit — 7 risk dimensions
- **MAS FEAT Principles**: Fairness, Ethics, Accountability, Transparency
- **Singapore PDPA**: Personal data protection and reasoning transparency
- **MAS AML/CFT Requirements**: Enforced through category and authorization controls

## Documentation

- **[SPECIFICATION.md](./SPECIFICATION.md)**: Complete technical specification
- **[Source Implementation](./src)**: Reference TypeScript implementation

## Getting Started

### Installation
```bash
npm install --legacy-peer-deps
npm run dev
```

### Quick Example
```typescript
import { GovernanceValidator } from './core/validator';
import { DEFAULT_MAS_MANDATES } from './core/mandates';

const envelope = {
  transaction: {
    amount: 500,
    merchantName: 'Microsoft',
    category: 'Software Subscription',
    paymentMethod: 'PayNow',
    destination: 'microsoft',
    timestamp: Date.now(),
  },
  reasoning: 'Monthly Office 365 renewal',
  context: { isNewMerchant: false, historyDepth: 12, riskScore: 1 }
};

const result = GovernanceValidator.validate(
  envelope,
  DEFAULT_MAS_MANDATES,
  []
);

// Disposition Engine outcomes:
// result.allowed === true              → Auto-Execute
// result.requiresApproval === true     → HITL Escalation
// result.allowed === false && !req...  → Reject
console.log(result.allowed);   // true
console.log(result.reason);    // undefined (auto-execute)
```

## Use Cases

### 1. Autonomous Expense Management
AI agents autonomously pay recurring bills and subscriptions while HITL escalation triggers for large or new-vendor purchases.

### 2. Agent-Assisted Payments & Treasury
Wealth management and treasury workflows bounded by institutional spending controls and velocity limits.

### 3. Client Engagement
AI agents generate client insights and draft materials within approved content boundaries, with full audit trail.

### 4. Multi-Institution Deployment
Institutions can adapt the Controls Repository to their own technology, risk, and compliance systems while maintaining SAFR interoperability.

## Architecture Highlights

- **Policy-Bound**: All agent actions validated against the Controls Repository before execution
- **Deterministic**: Same input always produces same disposition
- **Stateless**: Disposition Engine can be horizontally scaled
- **Interoperable**: Works with any AI agent architecture via native or gateway integration
- **Auditable**: Tamper-evident log of every governance decision

## Contributing to SAFR

This is an active working repository. Contributions are used to develop and refine the SAFR specification, validate the Controls Repository schema against real-world financial use cases, and test Disposition Engine logic across institution types.

If you are working on agentic finance governance and want to contribute test cases, control definitions, or implementation patterns, open an issue or pull request. Findings from this repo feed into the MAS SAFR working group.

---

**Active SAFR working repository — aligned with the MAS SAFR White Paper (2026)**

*For questions or feedback, open an issue in this repository.*
