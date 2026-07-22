import React, { useState } from 'react';
import { Header } from './components/Header';
import { WebsiteHome } from './components/WebsiteHome';
import { SymptomTriage } from './components/SymptomTriage';
import { InteractiveToothChart } from './components/InteractiveToothChart';
import { AIChatAssistant } from './components/AIChatAssistant';
import { SoapNoteGenerator } from './components/SoapNoteGenerator';
import { DentalImageAnalyzer } from './components/DentalImageAnalyzer';
import { PostOpGuideView } from './components/PostOpGuideView';
import { ShieldAlert, Sparkles, Heart } from 'lucide-react';

export default function App() {
  const [userRole, setUserRole] = useState<'patient' | 'clinician'>('patient');
  const [activeTab, setActiveTab] = useState<string>('home');
  const [selectedToothForTriage, setSelectedToothForTriage] = useState<number | null>(null);
  const [chatInitialPrompt, setChatInitialPrompt] = useState<string | null>(null);

  const handleSelectToothForTriage = (toothNum: number) => {
    setSelectedToothForTriage(toothNum);
    setActiveTab('triage');
  };

  const handleNavigateToChat = (prompt?: string) => {
    if (prompt) {
      setChatInitialPrompt(prompt);
    }
    setActiveTab('chat');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header & Role Switcher */}
      <Header
        userRole={userRole}
        setUserRole={setUserRole}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* Main Content View */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {activeTab === 'home' && (
          <WebsiteHome
            onNavigateTab={(tab) => setActiveTab(tab)}
            userRole={userRole}
          />
        )}

        {activeTab === 'triage' && (
          <SymptomTriage
            initialToothNum={selectedToothForTriage}
            onNavigateToChat={handleNavigateToChat}
          />
        )}

        {activeTab === 'chart' && (
          <InteractiveToothChart onSelectToothForTriage={handleSelectToothForTriage} />
        )}

        {activeTab === 'chat' && (
          <AIChatAssistant userRole={userRole} initialPrompt={chatInitialPrompt} />
        )}

        {activeTab === 'image' && <DentalImageAnalyzer />}

        {activeTab === 'soap' && <SoapNoteGenerator />}

        {activeTab === 'postop' && <PostOpGuideView />}
      </main>

      {/* Footer & Medical Disclaimer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-8 px-4 sm:px-6 lg:px-8 mt-12 text-xs">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/80 flex items-start space-x-3 text-slate-300">
            <ShieldAlert className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
            <div className="space-y-1">
              <span className="font-bold text-amber-300 text-xs block">IMPORTANT MEDICAL & CLINICAL DISCLAIMER</span>
              <p className="text-[11px] text-slate-300 leading-relaxed">
                DentaCare AI is an artificial intelligence triage and clinical assistance tool powered by Google Gemini AI. It is intended for educational, clinical documentation assistance, and triage informational purposes only. It does NOT provide formal medical diagnosis, definitive radiographic interpretation, or emergency prescription orders. If you are experiencing severe facial swelling, difficulty breathing or swallowing, trauma, or uncontrolled bleeding, please visit an emergency department or contact a licensed dentist immediately.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-slate-800 text-[11px] text-slate-500">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-slate-300">DentaAI Dental Practice & Intelligence Portal</span>
              <span>•</span>
              <span className="flex items-center space-x-1 text-cyan-400 font-semibold">
                <Sparkles className="w-3 h-3" />
                <span>Gemini 3.6 Flash Engine</span>
              </span>
            </div>

            <p className="flex items-center space-x-1">
              <span>Crafted for dental practices & patient health</span>
              <Heart className="w-3 h-3 text-rose-500 fill-rose-500" />
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
