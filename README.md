# FAGF-FS: Foundational Agentic Governance Framework for Financial Services

**Version: 1.0.0-Stable**

## What is FAGF-FS?

The **Foundational Agentic Governance Framework for Financial Services (FAGF-FS)** is a standardized specification for building safe, compliant, and auditable autonomous AI agents in financial ecosystems. As AI agents evolve from advisory tools to autonomous executors of financial transactions, FAGF-FS provides the architectural blueprints and operational mandates necessary to ensure every action is governed by human-defined policy and regulatory requirements.

### The Problem

Modern AI agents can propose and execute financial transactions autonomously, but without proper governance:
- **Risk**: Agents could execute unauthorized high-value transactions
- **Compliance**: Regulatory requirements (MAS, GDPR, AML) may be violated
- **Safety**: PII leakage, hallucinations, or reasoning errors could cause harm
- **Auditability**: Lack of transparency in decision-making processes

### The Solution

FAGF-FS introduces a **deterministic validation layer** that sits between the AI agent and financial rails, ensuring:
- ✅ **Immutability**: Governance rules are enforced before execution, not after
- ✅ **Interpretability**: Every decision has a verifiable audit trail
- ✅ **Regulatory Parity**: Financial regulations are mapped into executable code
- ✅ **Human-in-the-Loop**: High-risk actions require explicit human approval

## Core Concepts

### 1. Governance Envelope
Every agent action is wrapped in a structured envelope containing:
- **Transaction**: The proposed financial action (amount, merchant, category)
- **Reasoning**: The agent's explanation for why it's taking this action
- **Context**: Metadata like merchant history, risk scores, and flags

### 2. Mandate Stack
A collection of deterministic rules that define what's allowed:
- **Authorization Mandates**: New merchant checks, confirmation thresholds
- **Spending Mandates**: Transaction limits, approval requirements
- **Velocity Mandates**: Rate limiting, cooldown periods
- **Custom Mandates**: Region-specific rules (e.g., Singapore MAS compliance, PII protection)

### 3. Tiered Validation Logic (TVL)
The validator evaluates mandates in priority order:
1. **Block-Before-Commit**: Hard blocks (e.g., gambling, unlicensed activities)
2. **Human-in-the-Loop (HITL)**: Flagged for approval (e.g., high-value transactions)
3. **Autonomous Execution**: Approved for immediate execution
4. **Shadow Logging**: Logged for audit but not blocked

### 4. Deterministic Validator
A standalone service that:
- Receives governance envelopes from agents
- Evaluates them against the mandate stack
- Returns a validation result (APPROVED, BLOCKED, or HITL)
- Maintains an immutable audit log

## How It Works

```
┌─────────────────┐
│  AI Agent       │
│  (Proposes)     │
└────────┬────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Governance Envelope            │
│  ┌───────────────────────────┐  │
│  │ Transaction: $2,500       │  │
│  │ Merchant: Apple Inc       │  │
│  │ Reasoning: "New laptop"   │  │
│  │ Context: isNewMerchant=no │  │
│  └───────────────────────────┘  │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────────────────────┐
│  Deterministic Validator        │
│  ┌───────────────────────────┐  │
│  │ ✓ Check Category Block    │  │
│  │ ✓ Check Spending Limit    │  │
│  │ ⚠ Exceeds $1k threshold   │  │
│  │ ✓ Check PII Leakage       │  │
│  │ ✓ Check Content Safety    │  │
│  └───────────────────────────┘  │
│  Result: HITL Required          │
└────────┬────────────────────────┘
         │
         ▼
┌─────────────────┐
│  Human Approver │
│  (Reviews)      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Financial Rail │
│  (Executes)     │
└─────────────────┘
```

## Key Features

### 🔒 Security & Compliance
- **Categorical Blocklists**: Prevent transactions in prohibited categories (gambling, high-risk investments)
- **PII Protection**: Detect and block Singapore NRIC/FIN numbers in agent reasoning
- **MAS Compliance**: Enforce licensing requirements for financial services
- **Content Safety**: Filter profanity, scam keywords, and malicious intent

### 💰 Financial Controls
- **Spending Limits**: Configurable thresholds for autonomous vs. human approval
- **Velocity Controls**: Rate limiting to prevent rapid-fire transactions
- **New Merchant Authorization**: Require approval for first-time vendors
- **Payment Method Restrictions**: Control which payment methods are allowed

### 📊 Observability
- **Audit Trail**: Every validation decision is logged with full context
- **Triggered Mandates**: See exactly which rules were evaluated and why
- **Reasoning Transparency**: Agent explanations are preserved and auditable
- **Risk Scoring**: Contextual risk assessment for every transaction

## 📖 Documentation

- **[SPECIFICATION.md](./SPECIFICATION.md)**: Complete technical specification
- **[Sample Application](./src)**: Reference TypeScript implementation
- **[AI-Guardrails-Sandbox](../AI-Guardrails-Sandbox)**: Interactive demo with live validation

## 🚀 Getting Started

### Installation
```bash
npm install --legacy-peer-deps
npm run dev
```

### Quick Example
```typescript
import { GovernanceValidator } from './core/validator';
import { STANDARD_MANDATES } from './core/mandates';

const envelope = {
  transaction: {
    amount: 500,
    merchantName: 'Microsoft',
    category: 'Software Subscription',
    // ...
  },
  reasoning: 'Monthly Office 365 renewal',
  context: { isNewMerchant: false }
};

const result = GovernanceValidator.validate(
  envelope, 
  STANDARD_MANDATES, 
  []
);

console.log(result.allowed); // true
console.log(result.reason);  // "Transaction approved"
```

## Use Cases

### 1. Autonomous Expense Management
AI agents can autonomously pay recurring bills, office supplies, and subscriptions while requiring human approval for large purchases.

### 2. Compliance-First Trading
Ensure all trading activities comply with MAS regulations, blocking unlicensed activities and flagging high-risk transactions.

### 3. Privacy-Preserving Operations
Automatically detect and prevent PII leakage in agent reasoning, protecting customer data.

### 4. Multi-Region Deployment
Extend the framework with region-specific mandates (Singapore, EU, US) while maintaining a consistent validation architecture.

## Architecture Highlights

- **Deterministic**: Same input always produces same output
- **Stateless**: Validator can be horizontally scaled
- **Extensible**: Add custom mandates without changing core logic
- **Framework-Agnostic**: Works with any AI agent architecture
- **Language-Agnostic**: Specification can be implemented in any language

## Regulatory Alignment

FAGF-FS provides templates for mapping to:
- **MAS (Monetary Authority of Singapore)**: Financial services licensing, AML/CFT
- **GDPR**: Personal data protection, PII handling
- **ISO 20022**: Financial messaging standards
- **PCI-DSS**: Payment card industry security

## Contributing

This is a conceptual framework maintained as a reference implementation. For production use, adapt the specification to your specific regulatory and operational requirements.

## License

MIT License - See LICENSE file for details

---

**Maintained by the Agentic Financial Standards Org (Conceptual)**

*For questions or feedback, please open an issue in this repository.*
