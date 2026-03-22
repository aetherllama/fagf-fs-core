import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { FEATPrinciple, FEATPillar } from '../core/mindforge-types';
import { DEFAULT_FEAT_PRINCIPLES } from '../core/mindforge-defaults';
import { FinancialMandates } from '../core/types';

const PILLAR_CONFIG: Record<FEATPillar, { label: string; color: string; bgColor: string; borderColor: string }> = {
  fairness: { label: 'Fairness', color: 'text-emerald-400', bgColor: 'bg-emerald-500/10', borderColor: 'border-emerald-500/30' },
  ethics: { label: 'Ethics', color: 'text-amber-400', bgColor: 'bg-amber-500/10', borderColor: 'border-amber-500/30' },
  accountability: { label: 'Accountability', color: 'text-indigo-400', bgColor: 'bg-indigo-500/10', borderColor: 'border-indigo-500/30' },
  transparency: { label: 'Transparency', color: 'text-cyan-400', bgColor: 'bg-cyan-500/10', borderColor: 'border-cyan-500/30' },
};

const PILLARS: FEATPillar[] = ['fairness', 'ethics', 'accountability', 'transparency'];

interface Props {
  activeMandates: FinancialMandates;
}

export default function FEATAlignmentPanel({ activeMandates }: Props) {
  const [principles, setPrinciples] = useState<FEATPrinciple[]>(DEFAULT_FEAT_PRINCIPLES);
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const implementedCount = principles.filter(p => p.implemented).length;
  const totalCount = principles.length;
  const overallPct = Math.round((implementedCount / totalCount) * 100);

  const togglePrinciple = (id: string) => {
    setPrinciples(prev => prev.map(p => p.id === id ? { ...p, implemented: !p.implemented } : p));
  };

  const toggleExpand = (id: string) => {
    setExpandedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  const updateNotes = (id: string, notes: string) => {
    setPrinciples(prev => prev.map(p => p.id === id ? { ...p, evidenceNotes: notes } : p));
  };

  return (
    <div className="mindforge-panel">
      <div className="mindforge-panel-header">
        <div className="flex-1">
          <h2 className="text-xl font-black text-white">FEAT Principles Alignment</h2>
          <p className="text-sm text-muted mt-1">Fairness, Ethics, Accountability, Transparency -- MAS FEAT Framework</p>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {/* Overall progress */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-white">{implementedCount} of {totalCount} principles implemented</span>
            <span className="text-lg font-black text-indigo-400">{overallPct}%</span>
          </div>
          <div className="progress-bar">
            <motion.div
              className="progress-bar-fill"
              initial={{ width: 0 }}
              animate={{ width: `${overallPct}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>

          {/* Per-pillar summary */}
          <div className="grid grid-cols-4 gap-3 mt-4">
            {PILLARS.map(pillar => {
              const config = PILLAR_CONFIG[pillar];
              const pillarPrinciples = principles.filter(p => p.pillar === pillar);
              const pillarImplemented = pillarPrinciples.filter(p => p.implemented).length;
              return (
                <div key={pillar} className={`p-2 rounded-lg border ${config.bgColor} ${config.borderColor} text-center`}>
                  <div className={`text-xs font-bold ${config.color}`}>{config.label}</div>
                  <div className="text-lg font-black text-white">{pillarImplemented}/{pillarPrinciples.length}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Pillar sections */}
        {PILLARS.map(pillar => {
          const config = PILLAR_CONFIG[pillar];
          const pillarPrinciples = principles.filter(p => p.pillar === pillar);

          return (
            <div key={pillar}>
              <div className={`flex items-center gap-2 mb-3 ${config.color}`}>
                <div className={`w-3 h-3 rounded-full ${config.bgColor} border ${config.borderColor}`} />
                <h3 className="text-sm font-black uppercase tracking-wider">{config.label}</h3>
              </div>

              <div className="space-y-2">
                {pillarPrinciples.map(principle => {
                  const isExpanded = expandedIds.has(principle.id);
                  return (
                    <div key={principle.id} className="card !p-0 overflow-hidden">
                      <div
                        className="flex items-center gap-3 p-3 cursor-pointer hover:bg-white/[0.02] transition-colors"
                        onClick={() => toggleExpand(principle.id)}
                      >
                        <div className="flex-shrink-0">
                          {isExpanded ? <ChevronDown size={14} className="text-muted" /> : <ChevronRight size={14} className="text-muted" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-bold text-white">{principle.name}</div>
                          <div className="text-[11px] text-muted truncate">{principle.description}</div>
                        </div>
                        <label className="toggle flex-shrink-0" onClick={(e) => e.stopPropagation()}>
                          <input
                            type="checkbox"
                            checked={principle.implemented}
                            onChange={() => togglePrinciple(principle.id)}
                          />
                          <span className="toggle-slider"></span>
                        </label>
                      </div>

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="px-3 pb-3 pt-0 border-t border-white/5">
                              <div className="mt-3 mb-2">
                                <label className="text-[10px] font-bold uppercase tracking-wider text-muted block mb-1">Evidence / Notes</label>
                                <textarea
                                  value={principle.evidenceNotes}
                                  onChange={(e) => updateNotes(principle.id, e.target.value)}
                                  placeholder="Document evidence of implementation..."
                                  className="input-field text-xs h-16 resize-none"
                                />
                              </div>
                              {principle.linkedMandateIds.length > 0 && (
                                <div>
                                  <div className="text-[10px] font-bold uppercase tracking-wider text-muted mb-1">Linked Mandates</div>
                                  <div className="flex flex-wrap gap-1">
                                    {principle.linkedMandateIds.map(id => (
                                      <span key={id} className="badge badge-info text-[9px] py-0 px-1.5">{id}</span>
                                    ))}
                                  </div>
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
