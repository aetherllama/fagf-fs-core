import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Info } from 'lucide-react';
import { RiskMaterialityAssessment } from '../core/mindforge-types';
import { DEFAULT_RISK_MATERIALITY, computeMaterialityTier } from '../core/mindforge-defaults';

const TIER_STYLES: Record<string, { bg: string; border: string; text: string }> = {
  low: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', text: 'text-emerald-400' },
  medium: { bg: 'bg-amber-500/10', border: 'border-amber-500/30', text: 'text-amber-400' },
  high: { bg: 'bg-orange-500/10', border: 'border-orange-500/30', text: 'text-orange-400' },
  critical: { bg: 'bg-red-500/10', border: 'border-red-500/30', text: 'text-red-400' },
};

const TIER_DESCRIPTIONS: Record<string, string> = {
  low: 'Standard controls are sufficient. Periodic review recommended.',
  medium: 'Enhanced controls required. Regular monitoring and periodic reassessment.',
  high: 'Comprehensive controls required. Continuous monitoring and senior management oversight.',
  critical: 'Maximum controls required. Board-level oversight, independent validation, and real-time monitoring.',
};

const AXIS_LABELS: Record<string, { label: string; description: string }> = {
  impact: { label: 'Impact', description: 'Potential severity of adverse outcomes on customers, institution, or markets' },
  complexity: { label: 'Complexity', description: 'Technical sophistication and difficulty of understanding the AI system' },
  reliance: { label: 'Reliance', description: 'Degree to which business operations depend on the AI system' },
};

export default function MaterialityAssessmentPanel() {
  const [impact, setImpact] = useState(DEFAULT_RISK_MATERIALITY.impact);
  const [complexity, setComplexity] = useState(DEFAULT_RISK_MATERIALITY.complexity);
  const [reliance, setReliance] = useState(DEFAULT_RISK_MATERIALITY.reliance);

  const assessment = useMemo<RiskMaterialityAssessment>(() => {
    const overallScore = impact * complexity * reliance;
    return { impact, complexity, reliance, overallScore, tier: computeMaterialityTier(overallScore) };
  }, [impact, complexity, reliance]);

  const tierStyle = TIER_STYLES[assessment.tier];

  return (
    <div className="mindforge-panel">
      <div className="mindforge-panel-header">
        <div>
          <h2 className="text-xl font-black text-white">Risk Materiality Assessment</h2>
          <p className="text-sm text-muted mt-1">Three-axis scoring model: Impact x Complexity x Reliance</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Sliders */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {([
            { key: 'impact', value: impact, setter: setImpact },
            { key: 'complexity', value: complexity, setter: setComplexity },
            { key: 'reliance', value: reliance, setter: setReliance },
          ] as const).map(({ key, value, setter }) => (
            <div key={key} className="card">
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-bold text-white">{AXIS_LABELS[key].label}</label>
                <span className="text-xl font-black text-indigo-400">{value}</span>
              </div>
              <p className="text-[11px] text-muted mb-4">{AXIS_LABELS[key].description}</p>
              <input
                type="range"
                min="1"
                max="5"
                step="1"
                value={value}
                onChange={(e) => setter(Number(e.target.value))}
                className="slider w-full"
                style={{ '--value': `${((value - 1) / 4) * 100}%` } as any}
              />
              <div className="flex justify-between mt-2 text-[10px] text-muted">
                <span>1 (Low)</span>
                <span>5 (High)</span>
              </div>
            </div>
          ))}
        </div>

        {/* Score display */}
        <motion.div
          key={assessment.overallScore}
          initial={{ scale: 0.98, opacity: 0.8 }}
          animate={{ scale: 1, opacity: 1 }}
          className="card"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <div className="text-xs font-bold uppercase tracking-wider text-muted mb-1">Computed Score</div>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-white">{assessment.impact}</span>
                <span className="text-xl text-muted font-bold">&times;</span>
                <span className="text-3xl font-black text-white">{assessment.complexity}</span>
                <span className="text-xl text-muted font-bold">&times;</span>
                <span className="text-3xl font-black text-white">{assessment.reliance}</span>
                <span className="text-xl text-muted font-bold">=</span>
                <span className="text-4xl font-black text-indigo-400">{assessment.overallScore}</span>
              </div>
            </div>

            <div className={`px-4 py-2 rounded-lg border ${tierStyle.bg} ${tierStyle.border}`}>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-0.5">Tier</div>
              <div className={`text-xl font-black uppercase ${tierStyle.text}`}>{assessment.tier}</div>
            </div>
          </div>

          {/* Score bar visualization */}
          <div className="mb-4">
            <div className="materiality-bar">
              <div
                className="materiality-bar-fill"
                style={{ width: `${(assessment.overallScore / 125) * 100}%` }}
              />
              <div className="materiality-bar-markers">
                <div className="materiality-marker" style={{ left: '12%' }} title="Low/Medium: 15" />
                <div className="materiality-marker" style={{ left: '32%' }} title="Medium/High: 40" />
                <div className="materiality-marker" style={{ left: '64%' }} title="High/Critical: 80" />
              </div>
            </div>
            <div className="flex justify-between mt-1 text-[9px] text-muted uppercase font-bold">
              <span>Low (1-15)</span>
              <span>Medium (16-40)</span>
              <span>High (41-80)</span>
              <span>Critical (81-125)</span>
            </div>
          </div>
        </motion.div>

        {/* Contextual explanation */}
        <div className="card flex items-start gap-3">
          <AlertTriangle size={20} className={`mt-0.5 ${tierStyle.text}`} />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white mb-1">What this means</h4>
            <p className="text-sm text-secondary">{TIER_DESCRIPTIONS[assessment.tier]}</p>
          </div>
        </div>

        <div className="card flex items-start gap-3">
          <Info size={20} className="text-indigo-400 mt-0.5" />
          <div className="flex-1">
            <h4 className="text-sm font-bold text-white mb-1">About Materiality Assessment</h4>
            <p className="text-sm text-secondary">
              Risk materiality determines the level of SAFR controls required for an AI system.
              The three-axis model (Impact &times; Complexity &times; Reliance) produces a score from 1 to 125,
              mapped to four risk tiers that inform control proportionality per MAS Project MindForge and SAFR guidelines.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
