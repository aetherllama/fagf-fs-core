import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Shield, Activity, Eye, Scale, Gavel, Heart, Lock
} from 'lucide-react';
import { RiskDimensionAssessment } from '../core/mindforge-types';
import { DEFAULT_RISK_DIMENSIONS } from '../core/mindforge-defaults';
import { FinancialMandates } from '../core/types';

const DIMENSION_ICONS: Record<string, React.ReactNode> = {
  accountability_governance: <Shield size={20} />,
  monitoring_stability: <Activity size={20} />,
  transparency_explainability: <Eye size={20} />,
  fairness_bias: <Scale size={20} />,
  legal_regulatory: <Gavel size={20} />,
  ethics_impact: <Heart size={20} />,
  cyber_data_security: <Lock size={20} />,
};

const SCORE_COLORS = ['', 'bg-red-500', 'bg-orange-500', 'bg-amber-500', 'bg-emerald-500', 'bg-indigo-500'];
const SCORE_LABELS = ['', 'Critical', 'Weak', 'Moderate', 'Strong', 'Excellent'];

interface Props {
  activeMandates: FinancialMandates;
}

export default function RiskDimensionsPanel({ activeMandates }: Props) {
  const [dimensions, setDimensions] = useState<RiskDimensionAssessment[]>(DEFAULT_RISK_DIMENSIONS);

  const averageScore = dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length;

  const updateScore = (index: number, score: number) => {
    setDimensions(prev => prev.map((d, i) => i === index ? { ...d, score } : d));
  };

  return (
    <div className="mindforge-panel">
      <div className="mindforge-panel-header">
        <div>
          <h2 className="text-xl font-black text-white">Risk Dimensions Assessment</h2>
          <p className="text-sm text-muted mt-1">MAS Project MindForge — 7 AI risk dimensions underpinning SAFR controls</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <div className="text-xs font-bold uppercase tracking-wider text-muted">Average Score</div>
            <div className="text-2xl font-black text-indigo-400">{averageScore.toFixed(1)}<span className="text-sm text-muted">/5</span></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-6">
        {dimensions.map((dim, index) => (
          <motion.div
            key={dim.dimension}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="card"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className={`p-2 rounded-lg ${dim.score >= 4 ? 'bg-emerald-500/20 text-emerald-400' : dim.score >= 3 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                {DIMENSION_ICONS[dim.dimension]}
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-bold text-white">{dim.label}</h3>
                <p className="text-xs text-muted mt-1">{dim.rationale}</p>
              </div>
            </div>

            {/* Score selector */}
            <div className="flex items-center gap-1.5 mb-3">
              {[1, 2, 3, 4, 5].map(s => (
                <button
                  key={s}
                  onClick={() => updateScore(index, s)}
                  className={`score-segment ${s <= dim.score ? SCORE_COLORS[dim.score] : 'bg-white/10'}`}
                />
              ))}
              <span className={`ml-2 text-xs font-bold ${dim.score >= 4 ? 'text-emerald-400' : dim.score >= 3 ? 'text-amber-400' : 'text-red-400'}`}>
                {dim.score}/5 {SCORE_LABELS[dim.score]}
              </span>
            </div>

            {/* Controls */}
            <div className="mb-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">Active Controls</div>
              <div className="flex flex-wrap gap-1">
                {dim.controls.map(c => (
                  <span key={c} className="text-[10px] px-2 py-0.5 bg-white/5 border border-white/10 rounded text-secondary">{c}</span>
                ))}
              </div>
            </div>

            {/* Linked mandates */}
            <div>
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1.5">Linked Mandates</div>
              <div className="flex flex-wrap gap-1">
                {dim.linkedMandateIds.map(id => (
                  <span key={id} className="badge badge-info text-[9px] py-0 px-1.5">{id}</span>
                ))}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
