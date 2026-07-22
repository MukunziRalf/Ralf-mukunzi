import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { Send, Sparkles, User, Bot, Copy, Check, RefreshCw, MessageSquare, Lightbulb, Stethoscope } from 'lucide-react';

interface AIChatAssistantProps {
  userRole: 'patient' | 'clinician';
  initialPrompt?: string | null;
}

export const AIChatAssistant: React.FC<AIChatAssistantProps> = ({ userRole, initialPrompt }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      sender: 'assistant',
      text: userRole === 'clinician'
        ? "Hello Doctor! I'm your AI Dental Clinical Assistant. I can assist with ADA CDT coding, clinical protocol references, pharmacology, differential diagnosis notes, or patient education summaries. How can I assist your practice today?"
        : "Hello! I am your AI Dental Assistant. You can ask me anything about tooth pain, procedure explanations, post-op care, brushing techniques, or pediatric oral care. How can I help your smile today?",
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    },
  ]);

  const [input, setInput] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  useEffect(() => {
    if (initialPrompt && initialPrompt.trim().length > 0) {
      handleSendMessage(initialPrompt);
    }
  }, [initialPrompt]);

  const patientPrompts = [
    'How do I care for my mouth after wisdom tooth extraction?',
    'Is a throbbing toothache considered a dental emergency?',
    'What is the difference between a root canal and tooth extraction?',
    'My child knocked out an adult tooth! What should I do right now?',
    'How can I reduce tooth sensitivity to ice cream and hot coffee?',
  ];

  const clinicianPrompts = [
    'What are the standard ADA CDT codes for 3-surface posterior composite fillings?',
    'Summarize post-operative instructions for Scaling and Root Planing (D4341).',
    'List maximum recommended dosage for Lidocaine 2% with 1:100,000 Epinephrine.',
    'Draft a patient-friendly explanation for why a crown is needed after endodontic therapy.',
  ];

  const quickPrompts = userRole === 'clinician' ? clinicianPrompts : patientPrompts;

  const handleSendMessage = async (promptText?: string) => {
    const textToSend = promptText || input;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInput('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/dental/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          userRole,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get response from AI Dental Assistant.');
      }

      const data = await res.json();

      const assistantMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: data.text || 'I could not process that request.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      setMessages((prev) => [...prev, assistantMsg]);
    } catch (err: any) {
      console.error(err);
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        sender: 'assistant',
        text: 'Sorry, I encountered an issue retrieving dental guidance. Please ensure your Gemini API Key is configured in Secrets.',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header Banner */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            {userRole === 'clinician' ? (
              <Stethoscope className="w-6 h-6 text-white" />
            ) : (
              <Sparkles className="w-6 h-6 text-white" />
            )}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-bold">AI Dental Assistant</h2>
              <span className="text-xs bg-cyan-500/20 text-cyan-300 px-2.5 py-0.5 rounded-full border border-cyan-500/30 font-semibold">
                {userRole === 'clinician' ? 'Clinical Practice Mode' : 'Patient Companion'}
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Powered by Gemini 3.6 Flash. Instant answers for dental care, procedures, and oral health.
            </p>
          </div>
        </div>
      </div>

      {/* Main Chat Container */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden flex flex-col h-[600px]">
        {/* Messages List */}
        <div className="flex-1 p-6 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              {/* Avatar */}
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-xs ${
                  msg.sender === 'user'
                    ? 'bg-slate-800'
                    : 'bg-gradient-to-tr from-cyan-500 to-blue-600'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
              </div>

              {/* Message Bubble */}
              <div
                className={`group relative max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-slate-900 text-white rounded-tr-none'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-none border border-slate-200/80 dark:border-slate-700/80'
                }`}
              >
                <div className="whitespace-pre-wrap">{msg.text}</div>

                <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/40 dark:border-slate-700/40 text-[10px] opacity-70">
                  <span>{msg.timestamp}</span>

                  {msg.sender === 'assistant' && (
                    <button
                      onClick={() => copyToClipboard(msg.id, msg.text)}
                      className="hover:opacity-100 flex items-center space-x-1 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-opacity"
                    >
                      {copiedId === msg.id ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-500" />
                          <span className="text-emerald-500 font-bold">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center space-x-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center text-white">
                <Bot className="w-5 h-5" />
              </div>
              <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-2xl rounded-tl-none border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center space-x-2">
                <RefreshCw className="w-4 h-4 animate-spin text-cyan-500" />
                <span>Dental AI is formulating clinical guidance...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompts Bar */}
        <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-200 dark:border-slate-800 overflow-x-auto">
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400 flex items-center space-x-1 whitespace-nowrap font-semibold text-[11px]">
              <Lightbulb className="w-3.5 h-3.5 text-amber-500" />
              <span>Suggested:</span>
            </span>
            {quickPrompts.map((p, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(p)}
                className="whitespace-nowrap px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-cyan-500 hover:text-cyan-600 dark:hover:text-cyan-400 text-xs transition-all shadow-xs"
              >
                {p}
              </button>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="flex items-center space-x-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                userRole === 'clinician'
                  ? 'Ask about CDT codes, anesthetic calculations, or clinical notes...'
                  : 'Ask about tooth pain, recovery instructions, or dental treatments...'
              }
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 py-3 text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
            />
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-5 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-bold rounded-2xl shadow-md shadow-cyan-500/20 transition-all disabled:opacity-50 flex items-center space-x-1"
            >
              <span>Send</span>
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
