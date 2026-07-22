import React, { useState } from 'react';
import { TEETH_DATA } from '../data/teethData';
import { Tooth, ToothStatus } from '../types';
import { Activity, AlertCircle, CheckCircle2, ShieldAlert, Sparkles, Stethoscope, Plus, Info } from 'lucide-react';

interface ToothChartProps {
  onSelectToothForTriage: (toothNumber: number) => void;
}

export const InteractiveToothChart: React.FC<ToothChartProps> = ({ onSelectToothForTriage }) => {
  const [selectedToothNum, setSelectedToothNum] = useState<number | null>(14);
  const [teethStatuses, setTeethStatuses] = useState<Record<number, ToothStatus>>({
    3: 'filled',
    14: 'decay',
    19: 'crown',
    30: 'root-canal',
  });

  const selectedTooth = TEETH_DATA.find((t) => t.number === selectedToothNum);

  const upperTeeth = TEETH_DATA.filter((t) => t.quadrant === 'upper-right' || t.quadrant === 'upper-left').sort((a, b) => a.number - b.number);
  const lowerTeeth = TEETH_DATA.filter((t) => t.quadrant === 'lower-right' || t.quadrant === 'lower-left').sort((a, b) => b.number - a.number);

  const setStatusForTooth = (num: number, status: ToothStatus) => {
    setTeethStatuses((prev) => ({
      ...prev,
      [num]: status,
    }));
  };

  const getStatusColor = (status?: ToothStatus) => {
    switch (status) {
      case 'decay':
        return 'bg-amber-500 text-white border-amber-600 shadow-amber-200';
      case 'filled':
        return 'bg-blue-500 text-white border-blue-600 shadow-blue-200';
      case 'crown':
        return 'bg-purple-500 text-white border-purple-600 shadow-purple-200';
      case 'root-canal':
        return 'bg-rose-500 text-white border-rose-600 shadow-rose-200';
      case 'missing':
        return 'bg-slate-300 text-slate-600 border-slate-400 line-through';
      default:
        return 'bg-emerald-500 text-white border-emerald-600 shadow-emerald-200';
    }
  };

  const getToothShapeIcon = (type: Tooth['type']) => {
    switch (type) {
      case 'Molar':
        return 'M';
      case 'Premolar':
        return 'P';
      case 'Canine':
        return 'C';
      case 'Incisor':
        return 'I';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner */}
      <div className="bg-slate-900 rounded-2xl p-6 text-white shadow-lg border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="p-1.5 rounded-lg bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
              <Sparkles className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold tracking-tight text-white">Interactive 32-Tooth Adult Odontogram</h2>
          </div>
          <p className="text-slate-300 text-sm mt-1 max-w-2xl">
            Universal Numbering System (1 to 32). Select any tooth to inspect anatomical details, log clinical status, or immediately initiate AI symptom triage.
          </p>
        </div>

        {/* Status Legend */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
            <span>Healthy</span>
          </span>
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
            <span className="w-2 h-2 rounded-full bg-amber-400"></span>
            <span>Decay/Cavity</span>
          </span>
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30">
            <span className="w-2 h-2 rounded-full bg-blue-400"></span>
            <span>Restored/Filled</span>
          </span>
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span>
            <span>Crown</span>
          </span>
          <span className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
            <span className="w-2 h-2 rounded-full bg-rose-400"></span>
            <span>Root Canal</span>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Teeth Visual Map (Arch Display) */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-8">
          
          {/* Upper Maxillary Arch */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b pb-2 dark:border-slate-800">
              <span>Upper Right (Q1: #1-#8)</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-extrabold text-sm">UPPER MAXILLARY ARCH</span>
              <span>Upper Left (Q2: #9-#16)</span>
            </div>

            <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5 sm:gap-2">
              {upperTeeth.map((tooth) => {
                const isSelected = selectedToothNum === tooth.number;
                const status = teethStatuses[tooth.number] || 'healthy';
                return (
                  <button
                    key={tooth.number}
                    onClick={() => setSelectedToothNum(tooth.number)}
                    className={`group relative flex flex-col items-center justify-between p-2 rounded-xl border transition-all duration-200 min-h-[85px] ${
                      isSelected
                        ? 'ring-2 ring-cyan-500 border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 shadow-md scale-105 z-10'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-400">#{tooth.number}</span>
                    
                    {/* Visual Tooth Representation */}
                    <div className="my-1 flex flex-col items-center">
                      <div
                        className={`w-7 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs transition-transform group-hover:scale-110 border ${getStatusColor(
                          status
                        )}`}
                      >
                        {getToothShapeIcon(tooth.type)}
                      </div>
                    </div>

                    <span className="text-[9px] font-medium text-slate-600 dark:text-slate-300 truncate max-w-full">
                      {tooth.type}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Central Arch Divider Line */}
          <div className="relative flex items-center justify-center">
            <div className="border-t border-dashed border-slate-300 dark:border-slate-700 w-full"></div>
            <span className="absolute bg-white dark:bg-slate-900 px-3 py-1 text-[11px] font-semibold text-slate-400 rounded-full border border-slate-200 dark:border-slate-800">
              MIDLINE / OCCLUSAL PLANE
            </span>
          </div>

          {/* Lower Mandibular Arch */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b pb-2 dark:border-slate-800">
              <span>Lower Right (Q4: #32-#25)</span>
              <span className="text-cyan-600 dark:text-cyan-400 font-extrabold text-sm">LOWER MANDIBULAR ARCH</span>
              <span>Lower Left (Q3: #17-#24)</span>
            </div>

            <div className="grid grid-cols-8 sm:grid-cols-16 gap-1.5 sm:gap-2">
              {lowerTeeth.map((tooth) => {
                const isSelected = selectedToothNum === tooth.number;
                const status = teethStatuses[tooth.number] || 'healthy';
                return (
                  <button
                    key={tooth.number}
                    onClick={() => setSelectedToothNum(tooth.number)}
                    className={`group relative flex flex-col items-center justify-between p-2 rounded-xl border transition-all duration-200 min-h-[85px] ${
                      isSelected
                        ? 'ring-2 ring-cyan-500 border-cyan-500 bg-cyan-50 dark:bg-cyan-950/40 shadow-md scale-105 z-10'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-slate-400">#{tooth.number}</span>
                    
                    <div className="my-1 flex flex-col items-center">
                      <div
                        className={`w-7 h-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-xs transition-transform group-hover:scale-110 border ${getStatusColor(
                          status
                        )}`}
                      >
                        {getToothShapeIcon(tooth.type)}
                      </div>
                    </div>

                    <span className="text-[9px] font-medium text-slate-600 dark:text-slate-300 truncate max-w-full">
                      {tooth.type}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tooth Detail Side Panel */}
        <div className="lg:col-span-4">
          {selectedTooth ? (
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6 sticky top-20">
              <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-md bg-cyan-100 dark:bg-cyan-950 text-cyan-700 dark:text-cyan-300 font-extrabold text-sm border border-cyan-200 dark:border-cyan-800">
                      Tooth #{selectedTooth.number}
                    </span>
                    <span className="text-xs text-slate-500 capitalize">{selectedTooth.quadrant.replace('-', ' ')}</span>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-1">{selectedTooth.name}</h3>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center font-extrabold text-white text-base ${getStatusColor(
                    teethStatuses[selectedTooth.number] || 'healthy'
                  )}`}
                >
                  {getToothShapeIcon(selectedTooth.type)}
                </div>
              </div>

              {/* Status Selector */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Log / Update Tooth Status
                </label>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <button
                    onClick={() => setStatusForTooth(selectedTooth.number, 'healthy')}
                    className={`p-2 rounded-lg border text-left flex items-center space-x-1.5 transition-all ${
                      (teethStatuses[selectedTooth.number] || 'healthy') === 'healthy'
                        ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Healthy</span>
                  </button>

                  <button
                    onClick={() => setStatusForTooth(selectedTooth.number, 'decay')}
                    className={`p-2 rounded-lg border text-left flex items-center space-x-1.5 transition-all ${
                      teethStatuses[selectedTooth.number] === 'decay'
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <AlertCircle className="w-3.5 h-3.5 text-amber-500" />
                    <span>Active Decay</span>
                  </button>

                  <button
                    onClick={() => setStatusForTooth(selectedTooth.number, 'filled')}
                    className={`p-2 rounded-lg border text-left flex items-center space-x-1.5 transition-all ${
                      teethStatuses[selectedTooth.number] === 'filled'
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Info className="w-3.5 h-3.5 text-blue-500" />
                    <span>Composite Filling</span>
                  </button>

                  <button
                    onClick={() => setStatusForTooth(selectedTooth.number, 'crown')}
                    className={`p-2 rounded-lg border text-left flex items-center space-x-1.5 transition-all ${
                      teethStatuses[selectedTooth.number] === 'crown'
                        ? 'border-purple-500 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <ShieldAlert className="w-3.5 h-3.5 text-purple-500" />
                    <span>Crown / Cap</span>
                  </button>

                  <button
                    onClick={() => setStatusForTooth(selectedTooth.number, 'root-canal')}
                    className={`p-2 rounded-lg border text-left flex items-center space-x-1.5 transition-all ${
                      teethStatuses[selectedTooth.number] === 'root-canal'
                        ? 'border-rose-500 bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Stethoscope className="w-3.5 h-3.5 text-rose-500" />
                    <span>Root Canal</span>
                  </button>

                  <button
                    onClick={() => setStatusForTooth(selectedTooth.number, 'missing')}
                    className={`p-2 rounded-lg border text-left flex items-center space-x-1.5 transition-all ${
                      teethStatuses[selectedTooth.number] === 'missing'
                        ? 'border-slate-500 bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <Plus className="w-3.5 h-3.5 text-slate-500 rotate-45" />
                    <span>Extracted</span>
                  </button>
                </div>
              </div>

              {/* Anatomical Details */}
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl border border-slate-200 dark:border-slate-700/60 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Tooth Type:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">{selectedTooth.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Universal Number:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">#{selectedTooth.number}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Arch & Side:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                    {selectedTooth.quadrant.replace('-', ' ')}
                  </span>
                </div>
              </div>

              {/* Direct Action Button */}
              <button
                onClick={() => onSelectToothForTriage(selectedTooth.number)}
                className="w-full py-3 px-4 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm rounded-xl shadow-md shadow-cyan-500/20 flex items-center justify-center space-x-2 transition-all"
              >
                <Activity className="w-4 h-4" />
                <span>Run Symptom Triage for Tooth #{selectedTooth.number}</span>
              </button>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900/50 p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center text-slate-400">
              Select any tooth from the diagram to view anatomical info and log status.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
