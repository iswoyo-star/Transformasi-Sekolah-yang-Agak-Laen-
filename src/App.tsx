import React, { useState, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  School, 
  TrendingUp, 
  AlertTriangle, 
  Target, 
  Zap, 
  ChevronRight, 
  Loader2, 
  Copy, 
  CheckCircle2,
  ArrowLeft,
  Sparkles,
  FileText,
  Presentation
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

// Types
interface SchoolData {
  strengths: string;
  weaknesses: string;
  opportunities: string;
  threats: string;
  futureHopes: string;
}

const INITIAL_DATA: SchoolData = {
  strengths: '',
  weaknesses: '',
  opportunities: '',
  threats: '',
  futureHopes: '',
};

export default function App() {
  const [data, setData] = useState<SchoolData>(INITIAL_DATA);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const resultRef = useRef<HTMLDivElement>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const generateTransformationPlan = async () => {
    if (!data.strengths || !data.weaknesses || !data.opportunities || !data.threats || !data.futureHopes) {
      alert("Mohon isi semua data kunci terlebih dahulu.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/generate-plan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || errorData.error || "Failed to generate plan");
      }

      const resultData = await response.json();
      setResult(resultData.text || "Gagal menghasilkan rencana. Silakan coba lagi.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error: any) {
      console.error("Error generating plan:", error);
      alert(`Terjadi kesalahan: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (result) {
      navigator.clipboard.writeText(result);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const resetForm = () => {
    if (confirm("Apakah Anda yakin ingin mengulang dari awal?")) {
      setData(INITIAL_DATA);
      setResult(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafaf9] selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/60 backdrop-blur-xl border-b border-indigo-50">
        <div className="max-w-6xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-2xl flex items-center justify-center text-white shadow-lg shadow-indigo-100 rotate-3">
              <School size={24} />
            </div>
            <div>
              <h1 className="text-xl font-serif font-black tracking-tight text-slate-900 leading-none">
                Transformasi <span className="text-indigo-500 italic block text-sm font-sans uppercase tracking-widest mt-0.5">Agak Laen</span>
              </h1>
            </div>
          </div>
          {result && (
            <button 
              onClick={() => setResult(null)}
              className="px-4 py-2 bg-indigo-50 text-indigo-600 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-indigo-100 transition-all active:scale-95"
            >
              <ArrowLeft size={18} />
              Re-edit Data
            </button>
          )}
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-16">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div 
              key="input-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-16"
            >
              {/* Hero Section */}
              <div className="text-center space-y-6 max-w-3xl mx-auto">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 text-amber-700 rounded-full text-xs font-black uppercase tracking-widest border border-amber-100">
                  <Sparkles size={14} className="fill-amber-700" />
                  AI Transformation Expert
                </div>
                <h2 className="text-5xl md:text-6xl font-serif font-black text-slate-900 leading-[1.1]">
                  Rancang Strategi <span className="text-indigo-500 underline decoration-indigo-200 underline-offset-8">Sekolah Impian</span>
                </h2>
                <p className="text-xl text-slate-500 font-medium">
                  Ubah data SWOT menjadi rencana taktis yang "Agak Laen" dan visioner hanya dalam hitungan detik.
                </p>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-2">
                  <InputCard 
                    title="Kekuatan"
                    description="Internal Strength"
                    name="strengths"
                    value={data.strengths}
                    onChange={handleInputChange}
                    icon={<Zap className="text-amber-600" size={24} fill="currentColor" />}
                    placeholder="Apa hal keren yang ada di sekolah Anda?"
                    bgColor="bg-[#fff9e6]"
                    accentColor="border-amber-200"
                    textColor="text-amber-900"
                  />
                </div>
                <div className="lg:col-span-2">
                  <InputCard 
                    title="Kelemahan"
                    description="Internal Challenges"
                    name="weaknesses"
                    value={data.weaknesses}
                    onChange={handleInputChange}
                    icon={<AlertTriangle className="text-rose-600" size={24} fill="currentColor" />}
                    placeholder="Jujur saja, apa yang kurang oke di dalam?"
                    bgColor="bg-[#fff1f2]"
                    accentColor="border-rose-200"
                    textColor="text-rose-900"
                  />
                </div>
                <div className="lg:col-span-2">
                  <InputCard 
                    title="Peluang"
                    description="External Potential"
                    name="opportunities"
                    value={data.opportunities}
                    onChange={handleInputChange}
                    icon={<TrendingUp className="text-emerald-600" size={24} />}
                    placeholder="Keajaiban apa yang menunggu di luar sana?"
                    bgColor="bg-[#f0fdf4]"
                    accentColor="border-emerald-200"
                    textColor="text-emerald-900"
                  />
                </div>
                <div className="lg:col-span-2">
                  <InputCard 
                    title="Ancaman"
                    description="External Risks"
                    name="threats"
                    value={data.threats}
                    onChange={handleInputChange}
                    icon={<Target className="text-blue-600" size={24} />}
                    placeholder="Apa yang bikin kita deg-degan dari luar?"
                    bgColor="bg-[#eff6ff]"
                    accentColor="border-blue-200"
                    textColor="text-blue-900"
                  />
                </div>
                <div className="lg:col-span-4">
                  <InputCard 
                    title="Harapan Masa Depan (3 Tahun)"
                    description="Visionary Hopes"
                    name="futureHopes"
                    value={data.futureHopes}
                    onChange={handleInputChange}
                    icon={<Sparkles className="text-purple-600" size={24} fill="currentColor" />}
                    placeholder="Tutup mata sejenak, bayangkan sekolah 3 tahun lagi. Seperti apa megahnya?"
                    bgColor="bg-[#f5f3ff]"
                    accentColor="border-purple-200"
                    textColor="text-purple-900"
                    large
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col items-center gap-8 pt-4">
                <button
                  onClick={generateTransformationPlan}
                  disabled={loading}
                  className="group relative w-full md:w-auto px-12 py-6 bg-slate-900 text-white rounded-[2rem] font-black text-xl flex items-center justify-center gap-3 hover:bg-indigo-600 transition-all shadow-2xl shadow-indigo-200 hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={24} />
                      Synthesizing Strategy...
                    </>
                  ) : (
                    <>
                      Buka Gerbang Transformasi
                      <ChevronRight size={24} className="group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>
                <button
                  onClick={resetForm}
                  className="text-slate-400 hover:text-rose-500 font-bold text-sm uppercase tracking-widest transition-colors flex items-center gap-2"
                >
                  <AlertTriangle size={16} />
                  Mulai dari Nol
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="result-view"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-12"
            >
              {/* Result Header */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-end border-b border-slate-200 pb-12">
                <div className="md:col-span-2 space-y-4">
                  <div className="w-16 h-1 bg-indigo-500 rounded-full" />
                  <h2 className="text-5xl font-serif font-black text-slate-900 leading-tight">
                    Blueprint <br/>Transformasi <span className="text-indigo-500">'Agak Laen'</span>
                  </h2>
                  <p className="text-slate-500 text-lg font-medium">
                    Analisis mendalam untuk lompatan kuantum sekolah Anda.
                  </p>
                </div>
                <div className="flex justify-start md:justify-end gap-3">
                  <button 
                    onClick={copyToClipboard}
                    className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-4 bg-white border-2 border-slate-100 rounded-2xl text-sm font-black text-slate-700 hover:bg-slate-50 hover:border-indigo-100 transition-all shadow-sm active:scale-95"
                  >
                    {copied ? <CheckCircle2 size={20} className="text-emerald-500" /> : <Copy size={20} />}
                    {copied ? 'Copied!' : 'Copy Plan'}
                  </button>
                </div>
              </div>

              {/* Result Content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8">
                  <div ref={resultRef} className="markdown-body bg-white p-10 md:p-14 rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-100/50">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                </div>

                {/* Sidebar */}
                <div className="lg:col-span-4 space-y-8">
                  <div className="sticky top-28 space-y-8">
                    <div className="bg-indigo-600 text-white p-8 rounded-[2.5rem] space-y-6 shadow-2xl shadow-indigo-200 relative overflow-hidden">
                      <Zap size={120} className="absolute -bottom-10 -right-10 text-white/10 rotate-12" />
                      <h3 className="text-2xl font-serif font-black relative z-10">Waktunya Beraksi!</h3>
                      <p className="text-indigo-100 font-medium relative z-10">
                        Strategi ini tidak akan 'laen' kalau hanya disimpan. Bagikan sekarang!
                      </p>
                      <div className="space-y-3 relative z-10">
                        <ActionButton icon={<FileText size={20} />} label="Print Blueprint" onClick={() => window.print()} secondary />
                        <ActionButton icon={<Presentation size={20} />} label="Slide Paparan" onClick={() => alert("Lihat bagian akhir dokumen untuk bahan presentasi.")} secondary />
                      </div>
                    </div>

                    <div className="bg-amber-50 border border-amber-100 p-8 rounded-[2.5rem] space-y-4">
                      <div className="w-12 h-12 bg-amber-200/50 rounded-2xl flex items-center justify-center text-amber-700">
                        <Zap size={24} fill="currentColor" />
                      </div>
                      <h4 className="text-xl font-serif font-black text-amber-900">Expert Tip</h4>
                      <p className="text-amber-800 font-medium leading-relaxed">
                        Jangan ubah semuanya sekaligus. Pilih <strong>satu</strong> program 'Agak Laen' paling berani untuk bulan pertama!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer */}
      <footer className="py-20 bg-white border-t border-slate-50">
        <div className="max-w-6xl mx-auto px-6 flex flex-col items-center gap-8">
          <div className="flex items-center gap-2 opacity-30 grayscale">
            <School size={24} />
            <h1 className="text-lg font-serif font-black tracking-tight">Transformasi Sekolah</h1>
          </div>
          <div className="flex gap-8 text-sm font-black text-slate-300 uppercase tracking-[0.2em]">
            <span>Empowered by AI</span>
            <span>&bull;</span>
            <span>Est. 2026</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

function InputCard({ 
  title, 
  description, 
  name, 
  value, 
  onChange, 
  icon, 
  placeholder,
  bgColor,
  accentColor,
  textColor,
  large = false
}: { 
  title: string; 
  description: string; 
  name: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; 
  icon: React.ReactNode;
  placeholder: string;
  bgColor: string;
  accentColor: string;
  textColor: string;
  large?: boolean;
}) {
  return (
    <div className={`flex flex-col h-full bg-white p-6 rounded-[2rem] border-2 border-slate-50 transition-all hover:border-indigo-100 hover:shadow-xl hover:shadow-indigo-50/50 group ${large ? 'md:p-10' : ''}`}>
      <div className={`flex items-center gap-4 mb-6 p-4 rounded-2xl ${bgColor} border ${accentColor}`}>
        <div className="transition-transform group-hover:scale-110 duration-500">
          {icon}
        </div>
        <div>
          <h3 className={`font-black text-lg ${textColor} leading-none`}>{title}</h3>
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">{description}</p>
        </div>
      </div>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`flex-1 w-full bg-slate-50/50 border border-slate-100 rounded-2xl p-5 text-slate-700 placeholder:text-slate-300 focus:outline-none focus:ring-4 focus:ring-indigo-50 focus:bg-white focus:border-indigo-200 transition-all resize-none font-medium leading-relaxed ${large ? 'h-64' : 'h-40'}`}
      />
    </div>
  );
}

function ActionButton({ icon, label, onClick, secondary }: { icon: React.ReactNode; label: string; onClick: () => void, secondary?: boolean }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-black transition-all active:scale-95 shadow-sm ${secondary ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-white text-indigo-600 hover:bg-indigo-50'}`}
    >
      {icon}
      {label}
    </button>
  );
}
