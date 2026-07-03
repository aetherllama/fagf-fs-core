/**
 * SAFR (Safeguards for Agentic Finance at Runtime)
 * Core Type Definitions — MAS Industry White Paper
 */

export type Severity = 'low' | 'medium' | 'high';

export type EnforcementAction = 'block' | 'approval_required' | 'shadow_log';

export type GovernanceCategory =
    | 'authorization'
    | 'spending_limit'
    | 'category_restriction'
    | 'velocity';

/**
 * The standard SAFR mandate definition (Controls Repository entry).
 */
export interface GovernanceMandate<T = any> {
    id: string; // Standard SAFR ID (e.g., 'safr-limit-01')
    category: GovernanceCategory;
    parameter: T;
    enforcement: EnforcementAction;
    severity: Severity;
    riskDisclosure: string;
    description: string;
    mindForgeDimensions?: import('./mindforge-types').MindForgeRiskDimension[];
}

/**
 * The standard SAFR governance envelope for proposed agent actions.
 */
export interface GovernanceEnvelope {
    transaction: {
        amount: number;
        destination: string;
        merchantName: string;
        category: string;
        timestamp: number;
        paymentMethod: string;
    };
    reasoning: string; // The AI agent's explanation
    context: {
        isNewMerchant: boolean;
        historyDepth: number;
        riskScore: number;
    };
}

/**
 * The result structure returned by the SAFR Disposition Engine.
 */
export interface ValidationResult {
    allowed: boolean;
    requiresApproval: boolean;
    reason?: string;
    mitigationRisk?: string;
    severity?: Severity;
    triggeredMandates: string[];
}

/**
 * Standard SAFR Controls Repository — MAS-aligned financial mandates.
 */
export interface FinancialMandates {
    newMerchantAuth: GovernanceMandate<boolean>;
    confirmationThreshold: GovernanceMandate<number>;
    dailyAggregateLimit: GovernanceMandate<number>;
    rateLimitPerHour: GovernanceMandate<number>;
    cooldownSeconds: GovernanceMandate<number>;
    blockedCategories: GovernanceMandate<string[]>;
    allowedMethods: GovernanceMandate<string[]>;
}
