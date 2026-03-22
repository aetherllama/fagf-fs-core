import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Server, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { AISystemEntry, LifecycleStage } from '../core/mindforge-types';
import { DEFAULT_AI_SYSTEM_ENTRY, computeMaterialityTier } from '../core/mindforge-defaults';
import { FinancialMandates } from '../core/types';

const LIFECYCLE_STAGES: { stage: LifecycleStage; label: string }[] = [
  { stage: 'design', label: 'Design' },
  { stage: 'data_collection', label: 'Data Collection' },
  { stage: 'training', label: 'Training' },
  { stage: 'deployment', label: 'Deployment' },
  { stage: 'monitoring', label: 'Monitoring' },
  { stage: 'retirement', label: 'Retirement' },
];

const VALIDATION_STYLES: Record<string, { icon: React.ReactNode; color: string }> = {
  validated: { icon: <CheckCircle size={14} />, color: 'text-emerald-400' },
  pending: { icon: <Clock size={14} />, color: 'text-amber-400' },
  not_assessed: { icon: <AlertCircle size={14} />, color: 'text-red-400' },
};

const TIER_COLORS: Record<string, string> = {
  low: 'text-emerald-400',
  medium: 'text-amber-400',
  high: 'text-orange-400',
  critical: 'text-red-400',
};

interface Props {
  activeMandates: FinancialMandates;
}

export default function SystemInventoryPanel({ activeMandates }: Props) {
  const [systems, setSystems] = useState<AISystemEntry[]>([DEFAULT_AI_SYSTEM_ENTRY]);

  const updateStage = (index: number, stage: LifecycleStage) => {
    setSystems(prev => prev.map((s, i) => i === index ? { ...s, lifecycleStage: stage } : s));
  };

  const addSystem = () => {
    const newSystem: AISystemEntry = {
      id: `ais-custom-${String(systems.length + 1).padStart(3, '0')}`,
      name: `New AI System ${systems.length + 1}`,
      description: 'Custom AI system entry for playground exploration.',
      lifecycleStage: 'design',
      dataUsed: [],
      dependencies: [],
      riskMateriality: { impact: 1, complexity: 1, reliance: 1, overallScore: 1, tier: 'low' },
      validationStatus: 'not_assessed',
      owner: 'Unassigned',
      featAlignment: {
        principles: [],
        overallPercentage: 0,
      },
      lifecycleControls: [],
    };
    setSystems(prev => [...prev, newSystem]);
  };

  return (
    <div className="mindforge-panel">
      <div className="mindforge-panel-header">
        <div className="flex-1">
          <h2 className="text-xl font-black text-white">AI System Inventory</h2>
          <p className="text-sm text-muted mt-1">Registry of AI systems under MindForge risk governance</p>
        </div>
        <button onClick={addSystem} className="btn btn-primary btn-sm">
          <Plus size={14} />
          Add System
        </button>
      </div>

      <div className="p-6 space-y-6">
        {systems.map((system, index) => (
          <motion.div
            key={system.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="card"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-indigo-500/20 rounded-lg">
                  <Server size={20} className="text-indigo-400" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{system.name}</h3>
                  <p className="text-xs text-muted mt-0.5">{system.description}</p>
                  <div className="flex items-center gap-3 mt-2 text-[10px]">
                    <span className="text-muted">ID: <span className="font-mono text-secondary">{system.id}</span></span>
                    <span className="text-muted">Owner: <span className="text-secondary">{system.owner}</span></span>
                  </div>
                </div>
              </div>
              <div className={`flex items-center gap-1 ${VALIDATION_STYLES[system.validationStatus].color}`}>
                {VALIDATION_STYLES[system.validationStatus].icon}
                <span className="text-xs font-bold uppercase">{system.validationStatus.replace('_', ' ')}</span>
              </div>
            </div>

            {/* Lifecycle Pipeline */}
            <div className="mb-4">
              <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">Lifecycle Stage</div>
              <div className="lifecycle-pipeline">
                {LIFECYCLE_STAGES.map((ls, i) => {
                  const currentIdx = LIFECYCLE_STAGES.findIndex(s => s.stage === system.lifecycleStage);
                  const isActive = ls.stage === system.lifecycleStage;
                  const isPast = i < currentIdx;
                  return (
                    <React.Fragment key={ls.stage}>
                      {i > 0 && (
                        <div className={`lifecycle-connector ${isPast ? 'lifecycle-connector-done' : ''}`} />
                      )}
                      <button
                        onClick={() => updateStage(index, ls.stage)}
                        className={`lifecycle-stage ${isActive ? 'lifecycle-stage-active' : isPast ? 'lifecycle-stage-done' : 'lifecycle-stage-pending'}`}
                        title={ls.label}
                      >
                        <div className="lifecycle-dot" />
                        <span className="lifecycle-label">{ls.label}</span>
                      </button>
                    </React.Fragment>
                  );
                })}
              </div>
            </div>

            {/* Details grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <div className="p-2 bg-black/20 rounded-lg">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Risk Tier</div>
                <div className={`text-sm font-black uppercase ${TIER_COLORS[system.riskMateriality.tier]}`}>
                  {system.riskMateriality.tier}
                </div>
                <div className="text-[10px] text-muted">Score: {system.riskMateriality.overallScore}</div>
              </div>
              <div className="p-2 bg-black/20 rounded-lg">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">FEAT Score</div>
                <div className="text-sm font-black text-indigo-400">{system.featAlignment.overallPercentage}%</div>
              </div>
              <div className="p-2 bg-black/20 rounded-lg">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Data Sources</div>
                <div className="text-sm font-bold text-white">{system.dataUsed.length}</div>
              </div>
              <div className="p-2 bg-black/20 rounded-lg">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Dependencies</div>
                <div className="text-sm font-bold text-white">{system.dependencies.length}</div>
              </div>
            </div>

            {/* Tags */}
            {(system.dataUsed.length > 0 || system.dependencies.length > 0) && (
              <div className="space-y-2">
                {system.dataUsed.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Data Used</div>
                    <div className="flex flex-wrap gap-1">
                      {system.dataUsed.map(d => (
                        <span key={d} className="text-[10px] px-2 py-0.5 bg-indigo-500/10 border border-indigo-500/20 rounded text-indigo-300">{d}</span>
                      ))}
                    </div>
                  </div>
                )}
                {system.dependencies.length > 0 && (
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Dependencies</div>
                    <div className="flex flex-wrap gap-1">
                      {system.dependencies.map(d => (
                        <span key={d} className="text-[10px] px-2 py-0.5 bg-amber-500/10 border border-amber-500/20 rounded text-amber-300">{d}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Lifecycle Controls */}
            {system.lifecycleControls.length > 0 && (
              <div className="mt-4">
                <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-2">
                  Controls ({system.lifecycleControls.filter(c => c.stage === system.lifecycleStage).length} for current stage)
                </div>
                <div className="space-y-1">
                  {system.lifecycleControls
                    .filter(c => c.stage === system.lifecycleStage)
                    .map(c => (
                      <div key={c.controlName} className="flex items-center gap-2 text-xs">
                        <div className={`w-1.5 h-1.5 rounded-full ${c.status === 'implemented' ? 'bg-emerald-500' : c.status === 'planned' ? 'bg-amber-500' : 'bg-white/20'}`} />
                        <span className="text-secondary">{c.controlName}</span>
                        <span className="text-[9px] text-muted uppercase">{c.status.replace('_', ' ')}</span>
                      </div>
                    ))}
                </div>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
