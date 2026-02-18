import { FinancialMandates } from './types';

/**
 * Reference Financial Mandates for a Singapore-aligned (MAS) profile.
 */
export const DEFAULT_MAS_MANDATES: FinancialMandates = {
    newMerchantAuth: {
        id: 'fagf-auth-01',
        category: 'authorization',
        parameter: true,
        enforcement: 'approval_required',
        severity: 'high',
        riskDisclosure: 'Prevents Phishing & Merchant Impersonation',
        description: 'Requires manual verification for merchants not in the agent\'s historical trust list.'
    },
    confirmationThreshold: {
        id: 'fagf-limit-01',
        category: 'spending_limit',
        parameter: 50,
        enforcement: 'approval_required',
        severity: 'medium',
        riskDisclosure: 'Mitigates Large Unauthorized Outbound Transfers',
        description: 'Autonomous payments above S$50 require explicit user cryptographic approval.'
    },
    dailyAggregateLimit: {
        id: 'fagf-limit-02',
        category: 'spending_limit',
        parameter: 200,
        enforcement: 'block',
        severity: 'high',
        riskDisclosure: 'Limits Total Daily Exposure for Autonomous Agents',
        description: 'Strict block if the total daily spending exceeds S$200.'
    },
    rateLimitPerHour: {
        id: 'fagf-velocity-01',
        category: 'velocity',
        parameter: 5,
        enforcement: 'approval_required',
        severity: 'medium',
        riskDisclosure: 'Prevents API Runaway / Autonomous Fail-loops',
        description: 'Max 5 autonomous transactions per hour.'
    },
    cooldownSeconds: {
        id: 'fagf-velocity-02',
        category: 'velocity',
        parameter: 60,
        enforcement: 'approval_required',
        severity: 'low',
        riskDisclosure: 'Ensures Observation Period Between Actions',
        description: 'Minimum 60-second delay between consecutive autonomous executions.'
    },
    blockedCategories: {
        id: 'fagf-cat-01',
        category: 'category_restriction',
        parameter: ['Ungoverned Gambling', 'Unregulated Crypto', 'Offshore Investment', 'Job Scams'],
        enforcement: 'block',
        severity: 'high',
        riskDisclosure: 'Regulatory Compliance & High-Risk Mitigation',
        description: 'Strictly blocks transactions to restricted or illegal categories.'
    },
    allowedMethods: {
        id: 'fagf-auth-02',
        category: 'authorization',
        parameter: ['PayNow', 'NETS', 'FAST', 'DBS PayLah!'],
        enforcement: 'approval_required',
        severity: 'medium',
        riskDisclosure: 'Restricts Payment to Verified Local Channels',
        description: 'Only allows autonomous usage of verified Singapore payment channels.'
    }
};
