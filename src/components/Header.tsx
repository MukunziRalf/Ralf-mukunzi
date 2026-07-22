import React from 'react';
import { Stethoscope, User, Sparkles, ShieldAlert, Smile as ToothIcon, FileText, MessageSquare, Activity, Image as ImageIcon } from 'lucide-react';

interface HeaderProps {
  userRole: 'patient' | 'clinician';
  setUserRole: (role: 'patient' | 'clinician') => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ userRole, setUserRole, activeTab, setActiveTab }) => {
  return (
    <header className="bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 text-slate-800 dark:text-white sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Title */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('triage')}>
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-sm">
              <ToothIcon className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">DentaCare AI</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Clinical & Patient Dental Intelligence</p>
            </div>
          </div>

          {/* Center Navigation Tabs */}
          <nav className="hidden md:flex items-center space-x-1 bg-slate-100 dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('triage')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'triage'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
              }`}
            >
              <Activity className="w-4 h-4" />
              <span>Symptom Triage</span>
            </button>

            <button
              onClick={() => setActiveTab('chart')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'chart'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
              }`}
            >
              <ToothIcon className="w-4 h-4" />
              <span>Tooth Map</span>
            </button>

            <button
              onClick={() => setActiveTab('chat')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'chat'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>AI Dental Chat</span>
            </button>

            <button
              onClick={() => setActiveTab('image')}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                activeTab === 'image'
                  ? 'bg-blue-600 text-white shadow-sm font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              <span>Image AI</span>
            </button>

            {userRole === 'clinician' ? (
              <button
                onClick={() => setActiveTab('soap')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'soap'
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
                }`}
              >
                <FileText className="w-4 h-4 text-blue-200" />
                <span>SOAP & Treatment</span>
              </button>
            ) : (
              <button
                onClick={() => setActiveTab('postop')}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                  activeTab === 'postop'
                    ? 'bg-blue-600 text-white shadow-sm font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-700/50'
                }`}
              >
                <ShieldAlert className="w-4 h-4" />
                <span>Care & Post-Op</span>
              </button>
            )}
          </nav>

          {/* Mode Switcher */}
          <div className="flex items-center space-x-2.5">
            <div className="bg-slate-100 dark:bg-slate-800 p-1 rounded-2xl border border-slate-200 dark:border-slate-700 flex items-center">
              <button
                onClick={() => setUserRole('patient')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  userRole === 'patient'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Patient Mode</span>
                <span className="sm:hidden">Patient</span>
              </button>
              <button
                onClick={() => setUserRole('clinician')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                  userRole === 'clinician'
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 shadow-xs'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <Stethoscope className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Clinic Mode</span>
                <span className="sm:hidden">Clinic</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Nav Bar */}
      <div className="md:hidden flex items-center justify-around bg-white dark:bg-slate-900 px-2 py-2 border-t border-slate-200 dark:border-slate-800 overflow-x-auto text-xs">
        <button
          onClick={() => setActiveTab('triage')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl ${activeTab === 'triage' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}
        >
          <Activity className="w-4 h-4 mb-0.5" />
          <span>Triage</span>
        </button>
        <button
          onClick={() => setActiveTab('chart')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl ${activeTab === 'chart' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}
        >
          <ToothIcon className="w-4 h-4 mb-0.5" />
          <span>Tooth Map</span>
        </button>
        <button
          onClick={() => setActiveTab('chat')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl ${activeTab === 'chat' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}
        >
          <MessageSquare className="w-4 h-4 mb-0.5" />
          <span>AI Chat</span>
        </button>
        <button
          onClick={() => setActiveTab('image')}
          className={`flex flex-col items-center py-1 px-2 rounded-xl ${activeTab === 'image' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}
        >
          <ImageIcon className="w-4 h-4 mb-0.5" />
          <span>Image AI</span>
        </button>
        {userRole === 'clinician' ? (
          <button
            onClick={() => setActiveTab('soap')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl ${activeTab === 'soap' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}
          >
            <FileText className="w-4 h-4 mb-0.5" />
            <span>SOAP</span>
          </button>
        ) : (
          <button
            onClick={() => setActiveTab('postop')}
            className={`flex flex-col items-center py-1 px-2 rounded-xl ${activeTab === 'postop' ? 'text-blue-600 font-bold' : 'text-slate-500'}`}
          >
            <ShieldAlert className="w-4 h-4 mb-0.5" />
            <span>Care</span>
          </button>
        )}
      </div>
    </header>
  );
};
