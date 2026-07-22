import React, { useState } from 'react';
import { SOAPNote, TreatmentPlanResult } from '../types';
import { FileText, Copy, Check, Sparkles, Stethoscope, DollarSign, RefreshCw, Printer, ShieldCheck, Download } from 'lucide-react';
import { downloadSoapPDF, downloadTreatmentPlanPDF } from '../utils/pdfGenerator';

export const SoapNoteGenerator: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'soap' | 'treatment'>('soap');

  // SOAP Note Form State
  const [chiefComplaint, setChiefComplaint] = useState<string>('Severe sharp pain in upper left back tooth when drinking iced coffee');
  const [toothNumbers, setToothNumbers] = useState<string>('14');
  const [clinicalObservations, setClinicalObservations] = useState<string>('Visual exam reveals deep mesial occlusal decay on #14. Positive linger (>10s) to cold spray test. Percussion tender (+). Probe depths 2-3mm WNL.');
  const [radiographsTaken, setRadiographsTaken] = useState<string>('PA radiograph #14 shows radiolucency extending into pulp chamber with slight widened PDL at mesial root apex.');
  const [vitalSigns, setVitalSigns] = useState<string>('BP 122/80, Pulse 74 bpm');
  const [proposedProcedure, setProposedProcedure] = useState<string>('Recommended Endodontic Therapy (Root Canal) followed by Core Build-Up and Porcelain/Zirconia Crown');

  const [soapLoading, setSoapLoading] = useState<boolean>(false);
  const [soapResult, setSoapResult] = useState<SOAPNote | null>(null);
  const [soapCopied, setSoapCopied] = useState<boolean>(false);

  // Treatment Plan State
  const [diagnosisSummary, setDiagnosisSummary] = useState<string>('Tooth #14 Irreversible Pulpitis requiring Root Canal, Core Build-up, and Full Coverage Crown. Tooth #15 Mesial Composite Filling.');
  const [insuranceType, setInsuranceType] = useState<string>('Delta Dental PPO (80% Basic, 50% Major)');
  const [planLoading, setPlanLoading] = useState<boolean>(false);
  const [planResult, setPlanResult] = useState<TreatmentPlanResult | null>(null);

  const handleGenerateSoap = async () => {
    setSoapLoading(true);
    try {
      const res = await fetch('/api/dental/soap-generator', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chiefComplaint,
          toothNumbers,
          clinicalObservations,
          radiographsTaken,
          vitalSigns,
          proposedProcedure,
        }),
      });

      if (!res.ok) throw new Error('Failed to generate SOAP note');
      const data = await res.json();
      setSoapResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setSoapLoading(false);
    }
  };

  const handleGeneratePlan = async () => {
    setPlanLoading(true);
    try {
      const res = await fetch('/api/dental/treatment-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          diagnosisSummary,
          insuranceType,
        }),
      });

      if (!res.ok) throw new Error('Failed to build treatment plan');
      const data = await res.json();
      setPlanResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setPlanLoading(false);
    }
  };

  const copySoapToClipboard = () => {
    if (!soapResult) return;
    const formatted = `SOAP CLINICAL NOTE
Subjective (S):
${soapResult.subjective}

Objective (O):
${soapResult.objective}

Assessment (A):
${soapResult.assessment}

Plan (P):
${soapResult.plan}

CDT CODES:
${soapResult.cdtCodes.map((c) => `- ${c.code}: ${c.title} (Est. $${c.feeEst || 'N/A'})`).join('\n')}

${soapResult.doctorSignaturePrompt || ''}`;

    navigator.clipboard.writeText(formatted);
    setSoapCopied(true);
    setTimeout(() => setSoapCopied(false), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Stethoscope className="w-5 h-5" />
            </span>
            <h1 className="text-xl font-bold">Clinical Workstation & Documentation</h1>
          </div>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Automate EHR clinical SOAP notes, ADA CDT procedure coding, and patient financial treatment plans using Gemini AI.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-800 p-1 rounded-2xl border border-slate-700">
          <button
            onClick={() => setActiveTab('soap')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'soap' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>SOAP Note Generator</span>
          </button>
          <button
            onClick={() => setActiveTab('treatment')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center space-x-1.5 ${
              activeTab === 'treatment' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <DollarSign className="w-4 h-4" />
            <span>Treatment & Cost Plan</span>
          </button>
        </div>
      </div>

      {activeTab === 'soap' ? (
        /* SOAP Note Generator Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Form Input Panel */}
          <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b pb-3 dark:border-slate-800">
              <FileText className="w-5 h-5 text-indigo-500" />
              <span>Draft Clinical Findings</span>
            </h3>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Tooth Number(s)</label>
                <input
                  type="text"
                  value={toothNumbers}
                  onChange={(e) => setToothNumbers(e.target.value)}
                  placeholder="e.g. 14, 15"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Vital Signs</label>
                <input
                  type="text"
                  value={vitalSigns}
                  onChange={(e) => setVitalSigns(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Chief Complaint</label>
              <textarea
                rows={2}
                value={chiefComplaint}
                onChange={(e) => setChiefComplaint(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Clinical & Diagnostic Exam Findings</label>
              <textarea
                rows={3}
                value={clinicalObservations}
                onChange={(e) => setClinicalObservations(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Radiographic Findings</label>
              <textarea
                rows={2}
                value={radiographsTaken}
                onChange={(e) => setRadiographsTaken(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Proposed / Rendered Treatment Plan</label>
              <textarea
                rows={2}
                value={proposedProcedure}
                onChange={(e) => setProposedProcedure(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>

            <button
              onClick={handleGenerateSoap}
              disabled={soapLoading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {soapLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Formatting SOAP Note...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate EHR SOAP Note & CDT Codes</span>
                </>
              )}
            </button>
          </div>

          {/* Formatted SOAP Result Panel */}
          <div className="lg:col-span-6 space-y-6">
            {soapResult ? (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
                <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">Generated SOAP Clinical Note</h3>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => downloadSoapPDF(soapResult, toothNumbers)}
                      className="px-3 py-1.5 bg-indigo-50 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300 hover:bg-indigo-100 text-xs font-bold rounded-xl flex items-center space-x-1.5 border border-indigo-200 dark:border-indigo-800 shadow-xs transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </button>
                    <button
                      onClick={copySoapToClipboard}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl flex items-center space-x-1.5 shadow-sm transition-all"
                    >
                      {soapCopied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
                      <span>{soapCopied ? 'Copied!' : 'Copy to EHR'}</span>
                    </button>
                  </div>
                </div>

                <div className="space-y-4 text-xs leading-relaxed text-slate-800 dark:text-slate-200">
                  {/* Subjective */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                      SUBJECTIVE (S):
                    </span>
                    <p>{soapResult.subjective}</p>
                  </div>

                  {/* Objective */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                      OBJECTIVE (O):
                    </span>
                    <p>{soapResult.objective}</p>
                  </div>

                  {/* Assessment */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                      ASSESSMENT (A):
                    </span>
                    <p>{soapResult.assessment}</p>
                  </div>

                  {/* Plan */}
                  <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700/60">
                    <span className="font-extrabold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider block mb-1">
                      PLAN (P):
                    </span>
                    <p>{soapResult.plan}</p>
                  </div>

                  {/* CDT Codes Table */}
                  <div className="space-y-2">
                    <span className="font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider text-[11px]">
                      Recommended ADA CDT Billing Codes:
                    </span>
                    <div className="divide-y divide-slate-200 dark:divide-slate-800 rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                      {soapResult.cdtCodes.map((code, idx) => (
                        <div key={idx} className="p-3 bg-slate-50/50 dark:bg-slate-800/30 flex items-center justify-between">
                          <div>
                            <span className="font-extrabold text-indigo-600 dark:text-indigo-400">{code.code}</span>
                            <span className="ml-2 font-medium text-slate-700 dark:text-slate-300">{code.title}</span>
                          </div>
                          {code.feeEst && <span className="font-bold text-slate-900 dark:text-white">${code.feeEst}</span>}
                        </div>
                      ))}
                    </div>
                  </div>

                  {soapResult.doctorSignaturePrompt && (
                    <div className="text-[11px] text-slate-400 italic text-center pt-2 border-t border-slate-200 dark:border-slate-800">
                      {soapResult.doctorSignaturePrompt}
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-900/40 p-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3 text-slate-400">
                <FileText className="w-10 h-10 mx-auto text-indigo-400" />
                <h4 className="font-bold text-slate-700 dark:text-slate-300">No Clinical Note Formatted Yet</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Fill in the clinical observations on the left and click "Generate EHR SOAP Note".
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Treatment Plan Builder Layout */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-5 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-5">
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b pb-3 dark:border-slate-800">
              <DollarSign className="w-5 h-5 text-indigo-500" />
              <span>Treatment Case & Insurance</span>
            </h3>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Diagnosis & Procedure Scope</label>
              <textarea
                rows={4}
                value={diagnosisSummary}
                onChange={(e) => setDiagnosisSummary(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-3 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">Insurance Coverage Category</label>
              <select
                value={insuranceType}
                onChange={(e) => setInsuranceType(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="Delta Dental PPO (80% Basic, 50% Major)">Delta Dental PPO (80% Basic, 50% Major)</option>
                <option value="Cigna Dental PPO (80% Basic, 50% Major)">Cigna Dental PPO (80% Basic, 50% Major)</option>
                <option value="MetLife Dental (80% Basic, 50% Major)">MetLife Dental (80% Basic, 50% Major)</option>
                <option value="Out of Network / Cash Patient">Self-Pay / Cash Fee Schedule</option>
              </select>
            </div>

            <button
              onClick={handleGeneratePlan}
              disabled={planLoading}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-indigo-600/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
            >
              {planLoading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Building Financial Plan...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Build Phased Treatment & Financial Plan</span>
                </>
              )}
            </button>
          </div>

          <div className="lg:col-span-7 space-y-6">
            {planResult ? (
              <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
                <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Financial Breakdown</span>
                    <h3 className="text-lg font-bold text-slate-900 dark:text-white">Estimated Treatment Roadmap</h3>
                  </div>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => downloadTreatmentPlanPDF(planResult)}
                      className="p-2 px-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download PDF</span>
                    </button>
                    <button
                      onClick={() => window.print()}
                      className="p-2 border rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/50 flex items-center space-x-1 border-slate-200 dark:border-slate-700"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Print</span>
                    </button>
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/60 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/80 text-xs text-indigo-900 dark:text-indigo-200 leading-relaxed">
                  <span className="font-bold block mb-1">Patient Treatment Explanation:</span>
                  {planResult.patientSummary}
                </div>

                {/* Procedure Cost Breakdown Table */}
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 uppercase text-[10px]">
                        <th className="pb-2">Tooth / CDT</th>
                        <th className="pb-2">Procedure</th>
                        <th className="pb-2">Priority</th>
                        <th className="pb-2 text-right">Fee</th>
                        <th className="pb-2 text-right">Est. Ins.</th>
                        <th className="pb-2 text-right">Patient Cost</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                      {planResult.items.map((item, i) => (
                        <tr key={i} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30">
                          <td className="py-2.5 font-bold text-indigo-600 dark:text-indigo-400">
                            {item.toothNumber ? `#${item.toothNumber}` : 'General'} ({item.cdtCode})
                          </td>
                          <td className="py-2.5 font-medium text-slate-800 dark:text-slate-200">{item.procedureName}</td>
                          <td className="py-2.5">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                              {item.priority}
                            </span>
                          </td>
                          <td className="py-2.5 text-right font-medium">${item.estimatedCost}</td>
                          <td className="py-2.5 text-right font-medium text-emerald-600 dark:text-emerald-400">
                            -${item.estimatedInsuranceCoverage}
                          </td>
                          <td className="py-2.5 text-right font-extrabold text-slate-900 dark:text-white">
                            ${Math.max(0, item.estimatedCost - item.estimatedInsuranceCoverage)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Financial Totals Summary Card */}
                <div className="bg-slate-900 text-white p-5 rounded-2xl flex items-center justify-between">
                  <div>
                    <span className="text-xs text-slate-400 block">Total Procedure Fees: ${planResult.totalCost}</span>
                    <span className="text-xs text-emerald-400 block">Est. Insurance Contribution: -${planResult.estInsurance}</span>
                  </div>

                  <div className="text-right">
                    <span className="text-xs uppercase text-slate-400 font-bold tracking-wider block">Estimated Out-of-Pocket</span>
                    <span className="text-2xl font-black text-cyan-400">${planResult.outOfPocket}</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-slate-50 dark:bg-slate-900/40 p-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3 text-slate-400">
                <DollarSign className="w-10 h-10 mx-auto text-indigo-400" />
                <h4 className="font-bold text-slate-700 dark:text-slate-300">No Financial Estimate Generated</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Enter the procedure scope on the left to build a phased financial treatment estimate.
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
