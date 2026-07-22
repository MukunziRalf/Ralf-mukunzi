import React, { useState } from 'react';
import { Image as ImageIcon, Upload, Sparkles, CheckCircle2, AlertCircle, RefreshCw, Eye, ShieldAlert } from 'lucide-react';

export const DentalImageAnalyzer: React.FC = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userNotes, setUserNotes] = useState<string>('Examining upper molar area for potential cavities or surface discoloration.');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [analysis, setAnalysis] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Preset Sample Dental Images for instant demo!
  const SAMPLES = [
    {
      name: 'Sample Bitewing Radiograph',
      type: 'image/jpeg',
      url: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80',
      description: 'Standard interproximal bitewing X-ray showing molars & premolars.',
    },
    {
      name: 'Sample Intraoral Molar Photo',
      type: 'image/jpeg',
      url: 'https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80',
      description: 'Close-up intraoral photograph showing occlusal molar surfaces.',
    },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setAnalysis(null);
    };
    reader.readAsDataURL(file);
  };

  const handleSelectSample = async (sampleUrl: string) => {
    setIsLoading(true);
    setError(null);
    try {
      // Fetch sample image and convert to base64
      const response = await fetch(sampleUrl);
      const blob = await response.blob();
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setIsLoading(false);
      };
      reader.readAsDataURL(blob);
    } catch (err) {
      console.error(err);
      setSelectedImage(sampleUrl);
      setIsLoading(false);
    }
  };

  const handleAnalyzeImage = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/dental/analyze-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: selectedImage,
          mimeType: 'image/jpeg',
          userNotes,
        }),
      });

      if (!res.ok) throw new Error('Failed to analyze image with AI.');
      const data = await res.json();
      setAnalysis(data);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Error executing AI image analysis.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="bg-slate-900 text-white rounded-3xl p-6 shadow-xl border border-slate-800 flex items-center justify-between">
        <div className="space-y-1">
          <div className="inline-flex items-center space-x-2 bg-cyan-500/20 text-cyan-300 px-3 py-1 rounded-full text-xs font-semibold border border-cyan-500/30">
            <ImageIcon className="w-3.5 h-3.5 text-cyan-400" />
            <span>Gemini Multimodal Vision AI</span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Dental Image & Radiograph Visual Assistant</h1>
          <p className="text-xs text-slate-300">
            Upload intraoral photos or radiograph samples. Gemini Vision AI identifies anatomical landmarks, potential areas of observation, and care notes.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Upload & Preview Side */}
        <div className="lg:col-span-6 bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2 border-b pb-3 dark:border-slate-800">
            <Upload className="w-5 h-5 text-cyan-500" />
            <span>Select or Upload Image</span>
          </h3>

          {/* Sample Selectors */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Try Demo Samples:</label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SAMPLES.map((s, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSelectSample(s.url)}
                  className="p-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-800/50 hover:border-cyan-500 text-left transition-all space-y-1 group"
                >
                  <div className="flex items-center space-x-2">
                    <Eye className="w-4 h-4 text-cyan-500 group-hover:scale-110 transition-transform" />
                    <span className="font-bold text-xs text-slate-800 dark:text-slate-200">{s.name}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 line-clamp-1">{s.description}</p>
                </button>
              ))}
            </div>
          </div>

          {/* File Upload Box */}
          <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-2xl p-6 text-center space-y-3 bg-slate-50/50 dark:bg-slate-800/30 hover:bg-slate-100/50 transition-colors cursor-pointer relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
            />
            <div className="w-12 h-12 rounded-2xl bg-cyan-100 dark:bg-cyan-950 text-cyan-600 dark:text-cyan-400 mx-auto flex items-center justify-center">
              <Upload className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Click or drag intraoral photo / radiograph here</p>
              <p className="text-[11px] text-slate-400 mt-0.5">Supports PNG, JPG, WEBP up to 10MB</p>
            </div>
          </div>

          {/* Image Preview Box */}
          {selectedImage && (
            <div className="space-y-4">
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-black max-h-64 flex items-center justify-center">
                <img src={selectedImage} alt="Dental preview" className="object-contain max-h-64 w-full" />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                  Observation Context / Notes
                </label>
                <input
                  type="text"
                  value={userNotes}
                  onChange={(e) => setUserNotes(e.target.value)}
                  placeholder="e.g. Check upper molar interproximal area..."
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>

              <button
                onClick={handleAnalyzeImage}
                disabled={isLoading}
                className="w-full py-3.5 bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-600 hover:from-cyan-400 hover:to-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-cyan-500/20 flex items-center justify-center space-x-2 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Image with Gemini Vision...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-cyan-200" />
                    <span>Run Vision AI Landmark Analysis</span>
                  </>
                )}
              </button>
            </div>
          )}

          {error && (
            <div className="p-4 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs font-medium">
              {error}
            </div>
          )}
        </div>

        {/* AI Analysis Output */}
        <div className="lg:col-span-6 space-y-6">
          {analysis ? (
            <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-md space-y-6">
              <div className="border-b pb-4 dark:border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Vision AI Analysis</span>
                  <h3 className="text-lg font-extrabold text-slate-900 dark:text-white">{analysis.imageType}</h3>
                </div>
                <span className="px-3 py-1 rounded-full bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 text-xs font-bold border border-cyan-200 dark:border-cyan-800">
                  AI Educational Report
                </span>
              </div>

              {/* Landmarks */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>Anatomical Landmarks Identified</span>
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {analysis.landmarks?.map((lm: string, i: number) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-medium border border-slate-200 dark:border-slate-700">
                      {lm}
                    </span>
                  ))}
                </div>
              </div>

              {/* Observations */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
                  <AlertCircle className="w-4 h-4 text-amber-500" />
                  <span>Visual Observations</span>
                </h4>
                <div className="space-y-2">
                  {analysis.potentialObservations?.map((obs: any, i: number) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-xs text-slate-900 dark:text-white">{obs.region}</span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300">
                          {obs.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-300">{obs.observation}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Hygiene Tips */}
              <div className="space-y-2">
                <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">Oral Hygiene Care Guidance</h4>
                <ul className="space-y-1 text-xs text-slate-700 dark:text-slate-300">
                  {analysis.hygieneRecommendations?.map((rec: string, i: number) => (
                    <li key={i} className="flex items-start space-x-2 bg-cyan-50/50 dark:bg-cyan-950/20 p-2 rounded-lg">
                      <span className="text-cyan-500 font-bold">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Disclaimer */}
              <div className="p-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-500 flex items-start space-x-2 border border-slate-200 dark:border-slate-700">
                <ShieldAlert className="w-4 h-4 text-amber-500 flex-shrink-0 mt-0.5" />
                <span>{analysis.clinicianReviewNote}</span>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-900/40 p-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3 text-slate-400">
              <ImageIcon className="w-10 h-10 mx-auto text-cyan-500" />
              <h4 className="font-bold text-slate-700 dark:text-slate-300">No Image Analysis Performed</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Select one of the demo samples or upload your own image to run Gemini Vision AI analysis.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
