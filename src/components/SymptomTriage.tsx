import React, { useState, useEffect } from 'react';
import { COMMON_SYMPTOMS_LIST, COMMON_TRIGGERS_LIST, TEETH_DATA } from '../data/teethData';
import { SymptomInput, TriageResult } from '../types';
import { Activity, AlertTriangle, CheckCircle2, Clock, ShieldAlert, Sparkles, Stethoscope, Smile as ToothIcon, HelpCircle, ArrowRight, RefreshCw, Printer } from 'lucide-react';

interface SymptomTriageProps {
  initialToothNum?: number | null;
  onNavigateToChat: (initialPrompt?: string) => void;
}

export const SymptomTriage: React.FC<SymptomTriageProps> = ({ initialToothNum, onNavigateToChat }) => {
  const [selectedTooth, setSelectedTooth] = useState<number | undefined>(initialToothNum || undefined);
  const [painLevel, setPainLevel] = useState<number>(6);
  const [duration, setDuration] = useState<string>('1 to 2 days');
  const [selectedSymptoms, setSelectedSymptoms] = useState<string[]>([
    'Throbbing pain',
    'Sensitivity to cold drinks/ice',
    'Pain when biting or chewing',
  ]);
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>(['Cold drinks / ice cream', 'Chewing / Pressure']);
  const [notes, setNotes] = useState<string>('Pain started after drinking cold soda. Worse when lying down at night.');

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [result, setResult] = useState<TriageResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialToothNum) {
      setSelectedTooth(initialToothNum);
    }
  }, [initialToothNum]);

  const toggleSymptom = (symptom: string) => {
    setSelectedSymptoms((prev) =>
      prev.includes(symptom) ? prev.filter((s) => s !== symptom) : [...prev, symptom]
    );
  };

  const toggleTrigger = (trigger: string) => {
    setSelectedTriggers((prev) =>
      prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger]
    );
  };

  const handleRunTriage = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const payload: SymptomInput = {
        toothNumber: selectedTooth,
        painLevel,
        duration,
        symptoms: selectedSymptoms,
        triggers: selectedTriggers,
        description: notes,
      };

      const res = await fetch('/api/dental/symptom-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('Failed to run AI triage assessment.');
      }

      const data: TriageResult = await res.json();
      setResult(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Something went wrong running AI symptom assessment.');
    } finally {
      setIsLoading(false);
    }
  };

  const getPainColor = (level: number) => {
    if (level <= 3) return 'bg-emerald-500 text-white';
    if (level <= 6) return 'bg-amber-500 text-white';
    return 'bg-rose-600 text-white animate-pulse';
  };

  const getUrgencyBadge = (urgency: TriageResult['urgency']) => {
    switch (urgency) {
      case 'EMERGENCY':
        return (
          <div className="flex items-center space-x-2 bg-rose-600 text-white px-4 py-2 rounded-xl shadow-lg shadow-rose-600/30 animate-pulse font-extrabold text-sm">
            <AlertTriangle className="w-5 h-5" />
            <span>DENTAL EMERGENCY (Immediate Care Recommended)</span>
          </div>
        );
      case 'PROMPT':
        return (
          <div className="flex items-center space-x-2 bg-amber-500 text-white px-4 py-2 rounded-xl shadow-md font-extrabold text-sm">
            <Clock className="w-5 h-5" />
            <span>PROMPT CARE (Schedule within 24–48 Hours)</span>
          </div>
        );
      default:
        return (
          <div className="flex items-center space-x-2 bg-teal-600 text-white px-4 py-2 rounded-xl shadow-md font-extrabold text-sm">
            <CheckCircle2 className="w-5 h-5" />
            <span>ROUTINE CARE (Schedule Regular Appointment)</span>
          </div>
        );
    }
  };

  return (
    <div className="space-y-8">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>AI Symptom Analysis & Dental Triage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Describe Your Dental Symptoms
          </h1>
          <p className="text-slate-300 text-sm leading-relaxed">
            Select affected tooth, pain severity, duration, and pain triggers. Gemini AI will perform instant clinical triage, identify potential dental conditions, and guide immediate home safety steps.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Form Panel */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b pb-3 dark:border-slate-800">
            <ToothIcon className="w-5 h-5 text-cyan-500" />
            <span>1. Affected Tooth & Pain Assessment</span>
          </h3>

          {/* Tooth Selection Dropdown */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Affected Tooth (Universal #1 - #32)
            </label>
            <select
              value={selectedTooth || ''}
              onChange={(e) => setSelectedTooth(e.target.value ? Number(e.target.value) : undefined)}
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
            >
              <option value="">Full Mouth / Unspecified / General Jaw Pain</option>
              {TEETH_DATA.map((t) => (
                <option key={t.number} value={t.number}>
                  Tooth #{t.number} - {t.name} ({t.quadrant.replace('-', ' ')})
                </option>
              ))}
            </select>
          </div>

          {/* Pain Score Slider */}
          <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                Pain Level Score (1 to 10)
              </label>
              <span className={`px-3 py-1 rounded-full font-black text-sm ${getPainColor(painLevel)}`}>
                {painLevel} / 10
              </span>
            </div>

            <input
              type="range"
              min="1"
              max="10"
              value={painLevel}
              onChange={(e) => setPainLevel(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-cyan-500"
            />

            <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 font-medium">
              <span>1 - Mild Discomfort</span>
              <span>5 - Moderate Pain</span>
              <span>10 - Unbearable Agony</span>
            </div>
          </div>

          {/* Duration Selector */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Symptom Duration
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              {['Sudden onset', '1 to 2 days', '3 to 7 days', 'More than a week'].map((dur) => (
                <button
                  key={dur}
                  type="button"
                  onClick={() => setDuration(dur)}
                  className={`p-2 rounded-xl border text-center font-medium transition-all ${
                    duration === dur
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {dur}
                </button>
              ))}
            </div>
          </div>

          {/* Symptoms Multi-select */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Select Specific Symptoms
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_SYMPTOMS_LIST.map((sym) => {
                const isSelected = selectedSymptoms.includes(sym);
                return (
                  <button
                    key={sym}
                    type="button"
                    onClick={() => toggleSymptom(sym)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-cyan-600 text-white border-cyan-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {sym}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Pain Triggers */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              What Triggers or Worsens Pain?
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_TRIGGERS_LIST.map((trig) => {
                const isSelected = selectedTriggers.includes(trig);
                return (
                  <button
                    key={trig}
                    type="button"
                    onClick={() => toggleTrigger(trig)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                      isSelected
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                        : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {trig}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Additional Details / Description
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g. Tooth hurts when I bite down. Gum feels slightly swollen..."
              className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none resize-none"
            />
          </div>

          {/* Action Button */}
          <button
            onClick={handleRunTriage}
            disabled={isLoading}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-base rounded-2xl shadow-lg shadow-cyan-500/25 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Running Gemini AI Triage...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5 text-cyan-200" />
                <span>Analyze Symptoms with Gemini AI</span>
              </>
            )}
          </button>

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}
        </div>

        {/* Right Output Results Panel */}
        <div className="lg:col-span-6 space-y-6">
          {result ? (
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">AI Clinical Triage</span>
                  <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">Assessment Results</h2>
                </div>
                <button
                  onClick={() => window.print()}
                  className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-white rounded-lg border border-slate-200 dark:border-slate-700 flex items-center space-x-1 text-xs font-medium"
                >
                  <Printer className="w-4 h-4" />
                  <span className="hidden sm:inline">Print Report</span>
                </button>
              </div>

              {/* Urgency Alert */}
              <div className="space-y-2">
                {getUrgencyBadge(result.urgency)}
                <p className="text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3 rounded-xl border border-slate-200 dark:border-slate-700">
                  {result.urgencyReason}
                </p>
              </div>

              {/* Potential Conditions */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <Stethoscope className="w-4 h-4 text-cyan-500" />
                  <span>Potential Conditions to Discuss with Dentist</span>
                </h4>
                <div className="space-y-2">
                  {result.potentialConditions.map((cond, idx) => (
                    <div
                      key={idx}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-slate-900 dark:text-white">{cond.name}</span>
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            cond.likelihood === 'High'
                              ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                              : 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                          }`}
                        >
                          {cond.likelihood} Likelihood
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{cond.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Immediate Safe Home Actions */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Immediate Safe Home Care</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {result.immediateActions.map((act, i) => (
                    <li key={i} className="flex items-start space-x-2 bg-emerald-50/50 dark:bg-emerald-950/20 p-2 rounded-lg">
                      <span className="text-emerald-500 font-bold">•</span>
                      <span>{act}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What to Avoid */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center space-x-1.5">
                  <ShieldAlert className="w-4 h-4 text-rose-500" />
                  <span>What to Avoid Right Now</span>
                </h4>
                <ul className="space-y-1.5 text-xs text-slate-700 dark:text-slate-300">
                  {result.whatToAvoid.map((av, i) => (
                    <li key={i} className="flex items-start space-x-2 bg-rose-50/50 dark:bg-rose-950/20 p-2 rounded-lg">
                      <span className="text-rose-500 font-bold">•</span>
                      <span>{av}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Questions for Dentist */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <HelpCircle className="w-4 h-4 text-cyan-500" />
                  <span>Questions to Ask Your Dentist</span>
                </h4>
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  {result.questionsForDentist.map((q, i) => (
                    <p key={i} className="flex items-center space-x-2">
                      <span className="text-cyan-500 font-bold">Q{i + 1}:</span>
                      <span>{q}</span>
                    </p>
                  ))}
                </div>
              </div>

              {/* Follow-up with AI Assistant */}
              <button
                onClick={() =>
                  onNavigateToChat(
                    `I just completed symptom triage for ${
                      selectedTooth ? 'Tooth #' + selectedTooth : 'general dental symptoms'
                    }. The AI noted potential ${result.potentialConditions[0]?.name}. Can you explain what happens during a dental appointment for this condition?`
                  )
                }
                className="w-full py-3 px-4 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl flex items-center justify-center space-x-2 transition-all shadow-sm"
              >
                <span>Ask AI Dental Assistant More Questions About This</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900/40 p-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4 text-slate-400">
              <div className="w-16 h-16 rounded-full bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 mx-auto flex items-center justify-center">
                <Activity className="w-8 h-8" />
              </div>
              <div className="max-w-xs mx-auto space-y-1">
                <h3 className="font-bold text-slate-700 dark:text-slate-200 text-base">No Triage Generated Yet</h3>
                <p className="text-xs text-slate-500">
                  Fill out the symptom report on the left and click "Analyze Symptoms" to get your AI clinical triage report.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
