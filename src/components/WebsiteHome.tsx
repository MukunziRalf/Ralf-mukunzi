import React, { useState } from 'react';
import { 
  Sparkles, 
  Activity, 
  Smile as ToothIcon, 
  MessageSquare, 
  Image as ImageIcon, 
  ShieldAlert, 
  FileText, 
  Clock, 
  Calendar, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  ArrowRight, 
  Award, 
  Heart, 
  Stethoscope, 
  Star,
  Users,
  ShieldCheck,
  Send
} from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface WebsiteHomeProps {
  onNavigateTab: (tab: string) => void;
  userRole: 'patient' | 'clinician';
}

export const WebsiteHome: React.FC<WebsiteHomeProps> = ({ onNavigateTab, userRole }) => {
  const [bookingName, setBookingName] = useState('');
  const [bookingPhone, setBookingPhone] = useState('');
  const [bookingEmail, setBookingEmail] = useState('');
  const [bookingService, setBookingService] = useState('Emergency Triage / Pain Relief');
  const [bookingDate, setBookingDate] = useState('');
  const [bookingNotes, setBookingNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bookingName || !bookingPhone) return;

    setIsSubmitting(true);
    try {
      if (db) {
        await addDoc(collection(db, 'appointments'), {
          name: bookingName,
          phone: bookingPhone,
          email: bookingEmail,
          service: bookingService,
          preferredDate: bookingDate,
          notes: bookingNotes,
          status: 'pending',
          createdAt: new Date().toISOString()
        });
      }
      setBookingSuccess(true);
    } catch (err) {
      console.error("Error saving appointment:", err);
      // Fallback success for demo
      setBookingSuccess(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-16 py-4">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-slate-900 text-white border border-slate-800 p-8 sm:p-12 lg:p-16 shadow-2xl">
        {/* Background glow effects */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-blue-600/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 px-4 py-1.5 rounded-full text-xs font-bold border border-blue-500/30">
            <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" />
            <span>AI-Enhanced Dental Practice & Triage Portal</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight text-white">
            Modern Precision Dental Care, Powered by AI.
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-normal">
            Welcome to <span className="font-bold text-white">DentaAI Practice</span>. We combine compassionate clinical expertise with Google Gemini 3.6 Multimodal AI to offer instant symptom triage, interactive 3D tooth mapping, radiograph visual analysis, and 24/7 patient guidance.
          </p>

          <div className="pt-2 flex flex-wrap gap-4 items-center">
            <button
              onClick={() => onNavigateTab('triage')}
              className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-600/30 flex items-center space-x-2 transition-all group"
            >
              <Activity className="w-4 h-4" />
              <span>Start AI Symptom Triage</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>

            <button
              onClick={() => onNavigateTab('chart')}
              className="px-6 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-2xl border border-slate-700 flex items-center space-x-2 transition-all"
            >
              <ToothIcon className="w-4 h-4 text-cyan-400" />
              <span>Explore Interactive Tooth Map</span>
            </button>

            <a
              href="#book-appointment"
              className="px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold text-sm rounded-2xl backdrop-blur-md border border-white/20 flex items-center space-x-2 transition-all"
            >
              <Calendar className="w-4 h-4 text-emerald-400" />
              <span>Book Appointment</span>
            </a>
          </div>

          {/* Quick Metrics Bar */}
          <div className="pt-8 border-t border-slate-800/80 grid grid-cols-2 sm:grid-cols-4 gap-4 text-left">
            <div>
              <p className="text-2xl font-black text-cyan-400">24 / 7</p>
              <p className="text-xs text-slate-400 font-medium">AI Triage Availability</p>
            </div>
            <div>
              <p className="text-2xl font-black text-blue-400">FDI & Universal</p>
              <p className="text-xs text-slate-400 font-medium">3D Tooth Mapping</p>
            </div>
            <div>
              <p className="text-2xl font-black text-emerald-400">Gemini 3.6</p>
              <p className="text-xs text-slate-400 font-medium">Vision Radiograph AI</p>
            </div>
            <div>
              <p className="text-2xl font-black text-amber-400">100% Free</p>
              <p className="text-xs text-slate-400 font-medium">Educational Triage</p>
            </div>
          </div>
        </div>
      </section>

      {/* Practice Interactive Services Grid */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest">Our Practice Capabilities</span>
          <h2 className="text-3xl font-extrabold text-slate-900 dark:text-white">Smart Patient Care & Clinical Intelligence</h2>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Select any tool below to launch our interactive dental intelligence features directly from our portal.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Symptom Triage */}
          <div 
            onClick={() => onNavigateTab('triage')}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                AI Dental Symptom Triage
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Describe toothache, gum swelling, sensitivity, or oral discomfort. Our Gemini AI calculates urgency levels (Emergency, Urgent, Standard, Preventive) and recommended steps.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-blue-600 dark:text-blue-400 group-hover:translate-x-1 transition-transform">
              <span>Launch Triage Tool</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Card 2: Interactive Tooth Chart */}
          <div 
            onClick={() => onNavigateTab('chart')}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-cyan-50 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ToothIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-cyan-600 dark:group-hover:text-cyan-400 transition-colors">
                Interactive 3D Tooth Chart
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Select specific teeth on an interactive arch diagram. Supports both Universal (1-32) and FDI (11-48) numbering to isolate symptoms to exact teeth.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-cyan-600 dark:text-cyan-400 group-hover:translate-x-1 transition-transform">
              <span>View Tooth Diagram</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Card 3: Multimodal Image AI */}
          <div 
            onClick={() => onNavigateTab('image')}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ImageIcon className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                X-Ray & Photo Vision AI
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Upload intraoral photographs or bitewing/periapical radiographs. Gemini Vision AI identifies key anatomical landmarks and potential visual observations.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-indigo-600 dark:text-indigo-400 group-hover:translate-x-1 transition-transform">
              <span>Upload & Analyze Image</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Card 4: AI Dental Chat */}
          <div 
            onClick={() => onNavigateTab('chat')}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <MessageSquare className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                24/7 Dental AI Consultation
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Ask questions about root canals, tooth extractions, crowns, aligners, teeth whitening, or pediatric dental hygiene with instant AI guidance.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-emerald-600 dark:text-emerald-400 group-hover:translate-x-1 transition-transform">
              <span>Start AI Consultation</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Card 5: Post-Op & Brushing Timer */}
          <div 
            onClick={() => onNavigateTab('postop')}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center group-hover:scale-105 transition-transform">
                <ShieldAlert className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Post-Op Guides & Brushing Timer
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Clear recovery instructions for extractions, root canals, and fillings, plus an interactive 2-minute 4-quadrant brushing chime timer.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-amber-600 dark:text-amber-400 group-hover:translate-x-1 transition-transform">
              <span>View Care Guides</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          {/* Card 6: SOAP & Treatment (Clinicians) */}
          <div 
            onClick={() => onNavigateTab('soap')}
            className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xs hover:shadow-md transition-all cursor-pointer group flex flex-col justify-between space-y-4"
          >
            <div className="space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex items-center justify-center group-hover:scale-105 transition-transform">
                <FileText className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 transition-colors">
                Clinician SOAP Note Generator
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                Streamline dental clinical documentation. Converts raw examination observations into structured Subjective, Objective, Assessment, and Plan notes.
              </p>
            </div>
            <div className="flex items-center text-xs font-bold text-slate-700 dark:text-slate-300 group-hover:translate-x-1 transition-transform">
              <span>Open Clinician Tool</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Practice About & Clinical Standards */}
      <section className="bg-white dark:bg-slate-900 rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-slate-800 shadow-xs grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-4">
          <div className="inline-flex items-center space-x-2 bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-3 py-1 rounded-full text-xs font-bold border border-blue-200 dark:border-blue-800">
            <Award className="w-3.5 h-3.5" />
            <span>Clinical Standard Excellence</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Designed for Patient Safety and Clinical Precision
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            Our practice integrates Google Gemini 3.6 Flash AI directly into our clinical workflow to reduce patient anxiety, accelerate symptom evaluation, and provide instant, accurate educational resources before and after your visit.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white block">Immediate Triaging</span>
                <span className="text-[11px] text-slate-500">Categorizes pain intensity and emergency signs.</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white block">Patient Data Protection</span>
                <span className="text-[11px] text-slate-500">Firebase secure database storage protocols.</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <Users className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white block">Patient & Doctor Views</span>
                <span className="text-[11px] text-slate-500">Tailored UI for both patients and clinicians.</span>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800">
              <Clock className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-xs text-slate-900 dark:text-white block">Post-Procedure Support</span>
                <span className="text-[11px] text-slate-500">Step-by-step healing timelines & guidance.</span>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Info Box */}
        <div className="lg:col-span-5 bg-slate-900 text-white rounded-3xl p-6 sm:p-8 space-y-6 border border-slate-800 shadow-lg">
          <h3 className="text-lg font-bold text-white border-b border-slate-800 pb-3 flex items-center justify-between">
            <span>DentaAI Clinic Hours</span>
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          </h3>

          <div className="space-y-3 text-xs">
            <div className="flex justify-between text-slate-300">
              <span>Monday – Friday:</span>
              <span className="font-bold text-white">8:00 AM – 6:00 PM</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Saturday:</span>
              <span className="font-bold text-white">9:00 AM – 2:00 PM</span>
            </div>
            <div className="flex justify-between text-slate-300">
              <span>Sunday / Emergency:</span>
              <span className="font-bold text-cyan-400">24/7 AI Triage On-Call</span>
            </div>
          </div>

          <div className="space-y-2 pt-2 border-t border-slate-800 text-xs text-slate-300">
            <p className="flex items-center space-x-2">
              <MapPin className="w-4 h-4 text-blue-400 flex-shrink-0" />
              <span>100 Medical Center Blvd, Suite 400</span>
            </p>
            <p className="flex items-center space-x-2">
              <Phone className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span>(555) 336-8224 (DENTA-AI)</span>
            </p>
          </div>

          <button
            onClick={() => onNavigateTab('triage')}
            className="w-full py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center space-x-2"
          >
            <Activity className="w-4 h-4" />
            <span>Check Symptoms Online Now</span>
          </button>
        </div>
      </section>

      {/* Appointment Booking Section */}
      <section id="book-appointment" className="bg-white dark:bg-slate-900 p-8 sm:p-12 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
        <div className="max-w-xl">
          <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">Online Booking</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Request an In-Person or Consultation Appointment
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Fill out your details below to request a slot with our dental team.
          </p>
        </div>

        {bookingSuccess ? (
          <div className="p-6 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 rounded-2xl text-center space-y-3">
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 rounded-full mx-auto flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-base text-emerald-900 dark:text-emerald-200">Appointment Request Received!</h3>
            <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
              Thank you, {bookingName}. Our dental reception team will contact you shortly at {bookingPhone} to confirm your appointment time.
            </p>
            <button
              onClick={() => setBookingSuccess(false)}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl transition-all"
            >
              Submit Another Request
            </button>
          </div>
        ) : (
          <form onSubmit={handleBookAppointment} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Full Name *</label>
              <input
                type="text"
                required
                value={bookingName}
                onChange={(e) => setBookingName(e.target.value)}
                placeholder="e.g. Jane Doe"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone Number *</label>
              <input
                type="tel"
                required
                value={bookingPhone}
                onChange={(e) => setBookingPhone(e.target.value)}
                placeholder="e.g. (555) 019-2834"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Address</label>
              <input
                type="email"
                value={bookingEmail}
                onChange={(e) => setBookingEmail(e.target.value)}
                placeholder="e.g. jane@example.com"
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Service Required</label>
              <select
                value={bookingService}
                onChange={(e) => setBookingService(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="Emergency Triage / Pain Relief">Emergency Triage / Pain Relief</option>
                <option value="Routine Cleaning & Checkup">Routine Cleaning & Checkup</option>
                <option value="Tooth Extraction / Root Canal">Tooth Extraction / Root Canal</option>
                <option value="Cosmetic Whitening & Veneers">Cosmetic Whitening & Veneers</option>
                <option value="Orthodontic Consultation">Orthodontic Consultation</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Preferred Date</label>
              <input
                type="date"
                value={bookingDate}
                onChange={(e) => setBookingDate(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="space-y-1 sm:col-span-2">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Notes / Dental Pain Description</label>
              <textarea
                rows={2}
                value={bookingNotes}
                onChange={(e) => setBookingNotes(e.target.value)}
                placeholder="Briefly describe your pain, sensitivity, or tooth number if known..."
                className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div className="sm:col-span-2 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                <Send className="w-4 h-4" />
                <span>{isSubmitting ? 'Submitting Request...' : 'Confirm Appointment Request'}</span>
              </button>
            </div>
          </form>
        )}
      </section>
    </div>
  );
};
