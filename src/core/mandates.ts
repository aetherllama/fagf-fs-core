import { FinancialMandates } from './types';

/**
 * SAFR Controls Repository — MAS-aligned reference mandates for Singapore financial agents.
 */
export const DEFAULT_MAS_MANDATES: FinancialMandates = {
    newMerchantAuth: {
        id: 'safr-auth-01',
        category: 'authorization',
        parameter: true,
        enforcement: 'approval_required',
        severity: 'high',
        riskDisclosure: 'Prevents Phishing & Merchant Impersonation',
        description: 'Requires human review for merchants not in the agent\'s historical trust list.'
    },
    confirmationThreshold: {
        id: 'safr-limit-01',
        category: 'spending_limit',
        parameter: 50,
        enforcement: 'approval_required',
        severity: 'medium',
        riskDisclosure: 'Mitigates Large Unauthorized Outbound Transfers',
        description: 'Autonomous payments above S$50 require explicit user cryptographic approval.'
    },
    dailyAggregateLimit: {
        id: 'safr-limit-02',
        category: 'spending_limit',
        parameter: 200,
        enforcement: 'block',
        severity: 'high',
        riskDisclosure: 'Limits Total Daily Exposure for Autonomous Agents',
        description: 'Hard reject if total daily spending by the agent exceeds S$200.'
    },
    rateLimitPerHour: {
        id: 'safr-velocity-01',
        category: 'velocity',
        parameter: 5,
        enforcement: 'approval_required',
        severity: 'medium',
        riskDisclosure: 'Prevents API Runaway / Autonomous Fail-loops',
        description: 'Max 5 autonomous transactions per hour before HITL escalation.'
    },
    cooldownSeconds: {
        id: 'safr-velocity-02',
        category: 'velocity',
        parameter: 60,
        enforcement: 'approval_required',
        severity: 'low',
        riskDisclosure: 'Ensures Observation Window Between Agent Actions',
        description: 'Minimum 60-second delay between consecutive autonomous executions.'
    },
    blockedCategories: {
        id: 'safr-cat-01',
        category: 'category_restriction',
        parameter: ['Ungoverned Gambling', 'Unregulated Crypto', 'Offshore Investment', 'Job Scams'],
        enforcement: 'block',
        severity: 'high',
        riskDisclosure: 'Regulatory Compliance & High-Risk Mitigation',
        description: 'Hard reject for transactions matching restricted or illegal category labels.'
    },
    allowedMethods: {
        id: 'safr-auth-02',
        category: 'authorization',
        parameter: ['PayNow', 'NETS', 'FAST', 'DBS PayLah!'],
        enforcement: 'approval_required',
        severity: 'medium',
        riskDisclosure: 'Restricts Payment to Verified Local Channels',
        description: 'Only allows autonomous usage of verified Singapore payment channels.'
    }
};
