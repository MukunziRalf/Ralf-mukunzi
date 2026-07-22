import React, { useState } from 'react';
import { POST_OP_GUIDES } from '../data/postOpGuides';
import { BrushingTimer } from './BrushingTimer';
import { ShieldAlert, CheckCircle2, AlertTriangle, Clock, Search, BookOpen, Download } from 'lucide-react';
import { downloadPostOpPDF } from '../utils/pdfGenerator';

export const PostOpGuideView: React.FC = () => {
  const [selectedKey, setSelectedKey] = useState<string>('extraction');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const activeGuide = POST_OP_GUIDES[selectedKey] || POST_OP_GUIDES['extraction'];

  const guideKeys = Object.keys(POST_OP_GUIDES);
  const filteredKeys = guideKeys.filter((key) =>
    POST_OP_GUIDES[key].title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-2 bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold border border-cyan-500/30 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Patient Oral Care & Post-Op Library</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Post-Procedure Recovery Guides</h1>
          <p className="text-xs text-slate-300 mt-1 max-w-2xl">
            Detailed clinical instructions, things to avoid, red-flag warning signs, and recovery timelines for dental treatments.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search procedures..."
            className="w-full bg-slate-800 border border-slate-700 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 outline-none"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Procedure List */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white dark:bg-slate-900 p-4 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider px-2 py-1">Select Procedure Guide</h3>
            <div className="space-y-1.5">
              {filteredKeys.map((key) => {
                const guide = POST_OP_GUIDES[key];
                const isSelected = selectedKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedKey(key)}
                    className={`w-full text-left p-3 rounded-2xl border transition-all ${
                      isSelected
                        ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 text-cyan-900 dark:text-cyan-200 font-bold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <span className="text-xs block font-bold">{guide.title}</span>
                    <span className="text-[10px] text-slate-500 font-normal">{guide.category}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Embedded Brushing Timer Widget */}
          <BrushingTimer />
        </div>

        {/* Right Active Guide Details */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
          <div className="border-b pb-4 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-cyan-600 dark:text-cyan-400 uppercase tracking-wider">{activeGuide.category}</span>
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mt-0.5">{activeGuide.title}</h2>
            </div>
            <button
              onClick={() => downloadPostOpPDF(activeGuide)}
              className="p-2 px-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl text-xs font-semibold flex items-center space-x-1.5 shadow-sm transition-all"
            >
              <Download className="w-4.5 h-4.5" />
              <span className="hidden sm:inline">Download PDF Guide</span>
            </button>
          </div>

          {/* DO List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Recommended Post-Op Care (DO)</span>
            </h4>
            <div className="space-y-2">
              {activeGuide.doList.map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-800/60 text-xs text-slate-800 dark:text-slate-200 flex items-start space-x-2">
                  <span className="text-emerald-600 font-extrabold">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* DONT List */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-rose-700 dark:text-rose-400 uppercase tracking-wider flex items-center space-x-2">
              <ShieldAlert className="w-4 h-4 text-rose-500" />
              <span>Things to Avoid (DON'T)</span>
            </h4>
            <div className="space-y-2">
              {activeGuide.dontList.map((item, i) => (
                <div key={i} className="p-3 rounded-xl bg-rose-50/60 dark:bg-rose-950/20 border border-rose-200/80 dark:border-rose-800/60 text-xs text-slate-800 dark:text-slate-200 flex items-start space-x-2">
                  <span className="text-rose-600 font-extrabold">•</span>
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Warning Signs */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Red-Flag Warning Signs (Call Dentist Immediately)</span>
            </h4>
            <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/80 text-xs text-slate-800 dark:text-slate-200 space-y-1.5">
              {activeGuide.warningSigns.map((sign, i) => (
                <p key={i} className="flex items-start space-x-2">
                  <span className="text-amber-600 font-bold">⚠️</span>
                  <span>{sign}</span>
                </p>
              ))}
            </div>
          </div>

          {/* Recovery Timeline */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-2">
              <Clock className="w-4 h-4 text-cyan-500" />
              <span>Expected Healing Timeline</span>
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {activeGuide.timeline.map((step, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 space-y-1">
                  <span className="font-extrabold text-cyan-600 dark:text-cyan-400 block">{step.title}</span>
                  <p className="text-slate-600 dark:text-slate-300 text-[11px]">{step.detail}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
