/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
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
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const model = "gemini-3.1-pro-preview";
      
      const prompt = `
        Bertindaklah sebagai Ahli Strategi Transformasi Sekolah yang berpengalaman lebih dari 20 tahun. 
        Tugasmu adalah memproses 5 Data Kunci berikut untuk menghasilkan "Panduan Transformasi Sekolah yang 'Agak Laen'".
        
        DATA KUNCI:
        1. Kekuatan: ${data.strengths}
        2. Kelemahan: ${data.weaknesses}
        3. Peluang: ${data.opportunities}
        4. Ancaman: ${data.threats}
        5. Harapan Masa Depan (3 Tahun): ${data.futureHopes}
        
        FORMAT JAWABAN (WAJIB):
        
        1. Potret Kondisi Sekolah (Analisis Situasi): 
           Ringkasan kondisi sekolah berdasarkan SWOT dan Harapan Masa Depan dengan bahasa yang memotivasi dan menggugah semangat.
        
        2. Program Perubahan (Panduan Pelaksanaan):
           Usulan program konkret yang memuat:
           a. Persiapan: SDM, biaya, alat/bahan.
           b. Langkah Demi Langkah: Urutan tindakan nyata (Minggu ke-1, ke-2, dst).
           c. Cara Menghadapi Hambatan: Tips praktis mengatasi kelemahan/ancaman.
           d. Indikator Keberhasilan: Bukti nyata perubahan.
        
        3. Alur Waktu Perubahan:
           a. Langkah Cepat (1-2 Bulan): Program sederhana memanfaatkan Kekuatan untuk hasil cepat (Quick Wins).
           b. Langkah Lanjutan: Program strategis menutupi Kelemahan dan mencapai Harapan Masa Depan.
        
        4. Bahan Presentasi: 
           Ringkasan poin-poin penting (bullet points) yang siap disalin untuk paparan ke Yayasan atau Dinas Pendidikan.
        
        TONE: Profesional, akrab, solutif, dan mendukung. Gunakan istilah bahasa Indonesia yang mudah dipahami.
        BATASAN: Taktis, sesuai data, singkat dan padat.
      `;

      const response = await ai.models.generateContent({
        model: model,
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
      });

      setResult(response.text || "Gagal menghasilkan rencana. Silakan coba lagi.");
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error("Error generating plan:", error);
      alert("Terjadi kesalahan saat menghubungi AI. Pastikan koneksi internet stabil.");
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
    <div className="min-h-screen bg-stone-50 selection:bg-emerald-100 selection:text-emerald-900">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center text-white">
              <School size={20} />
            </div>
            <h1 className="text-xl font-serif font-bold tracking-tight text-stone-900">
              Transformasi <span className="text-emerald-600">Agak Laen</span>
            </h1>
          </div>
          {result && (
            <button 
              onClick={() => setResult(null)}
              className="text-sm font-medium text-stone-500 hover:text-stone-900 flex items-center gap-1 transition-colors"
            >
              <ArrowLeft size={16} />
              Kembali ke Input
            </button>
          )}
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-12">
        <AnimatePresence mode="wait">
          {!result ? (
            <motion.div 
              key="input-form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-12"
            >
              {/* Hero Section */}
              <div className="text-center space-y-4 max-w-2xl mx-auto">
                <h2 className="text-4xl md:text-5xl font-serif font-bold text-stone-900 leading-tight">
                  Ubah Sekolah Anda Menjadi <span className="italic text-emerald-600">Luar Biasa</span>
                </h2>
                <p className="text-lg text-stone-600">
                  Masukkan data evaluasi sekolah Anda, dan biarkan AI Strategis kami menyusun rencana kerja taktis yang siap dijalankan.
                </p>
              </div>

              {/* Form Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <InputCard 
                  title="Kekuatan (Strengths)"
                  description="Apa hal baik yang sudah dimiliki sekolah saat ini?"
                  name="strengths"
                  value={data.strengths}
                  onChange={handleInputChange}
                  icon={<Zap className="text-amber-500" size={20} />}
                  placeholder="Contoh: Guru-guru muda yang kreatif, fasilitas lab komputer lengkap, dukungan orang tua kuat..."
                />
                <InputCard 
                  title="Kelemahan (Weaknesses)"
                  description="Apa kekurangan atau masalah internal yang paling terasa?"
                  name="weaknesses"
                  value={data.weaknesses}
                  onChange={handleInputChange}
                  icon={<AlertTriangle className="text-rose-500" size={20} />}
                  placeholder="Contoh: Kurangnya pelatihan kurikulum baru, administrasi masih manual, motivasi belajar siswa rendah..."
                />
                <InputCard 
                  title="Peluang (Opportunities)"
                  description="Kesempatan apa di luar sekolah yang bisa dimanfaatkan?"
                  name="opportunities"
                  value={data.opportunities}
                  onChange={handleInputChange}
                  icon={<TrendingUp className="text-emerald-500" size={20} />}
                  placeholder="Contoh: Kerjasama dengan industri lokal, beasiswa dari pemerintah, tren digitalisasi pendidikan..."
                />
                <InputCard 
                  title="Ancaman (Threats)"
                  description="Tantangan luar yang bisa menghambat kemajuan?"
                  name="threats"
                  value={data.threats}
                  onChange={handleInputChange}
                  icon={<Target className="text-blue-500" size={20} />}
                  placeholder="Contoh: Munculnya sekolah pesaing baru, perubahan kebijakan mendadak, lingkungan sekitar yang kurang kondusif..."
                />
                <div className="md:col-span-2">
                  <InputCard 
                    title="Harapan Masa Depan (3 Tahun)"
                    description="Kondisi sekolah seperti apa yang ingin dicapai dalam 3 tahun ke depan?"
                    name="futureHopes"
                    value={data.futureHopes}
                    onChange={handleInputChange}
                    icon={<Sparkles className="text-purple-500" size={20} />}
                    placeholder="Contoh: Menjadi sekolah rujukan digital di tingkat provinsi, 90% lulusan diterima di PTN favorit, budaya literasi yang kuat..."
                    large
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 pt-8">
                <button
                  onClick={generateTransformationPlan}
                  disabled={loading}
                  className="w-full md:w-auto px-8 py-4 bg-stone-900 text-white rounded-full font-semibold text-lg flex items-center justify-center gap-2 hover:bg-stone-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-stone-200"
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      Menyusun Strategi...
                    </>
                  ) : (
                    <>
                      Generate Strategi Transformasi
                      <ChevronRight size={20} />
                    </>
                  )}
                </button>
                <button
                  onClick={resetForm}
                  className="text-stone-500 hover:text-stone-900 font-medium transition-colors"
                >
                  Reset Data
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.div 
              key="result-view"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              {/* Result Header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-stone-200 pb-8">
                <div className="space-y-2">
                  <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold uppercase tracking-wider">
                    <Sparkles size={14} />
                    Strategi Siap Dijalankan
                  </div>
                  <h2 className="text-4xl font-serif font-bold text-stone-900">
                    Panduan Transformasi Sekolah
                  </h2>
                  <p className="text-stone-500">
                    Dibuat berdasarkan analisis SWOT dan visi masa depan sekolah Anda.
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={copyToClipboard}
                    className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-200 rounded-lg text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors shadow-sm"
                  >
                    {copied ? <CheckCircle2 size={18} className="text-emerald-500" /> : <Copy size={18} />}
                    {copied ? 'Tersalin!' : 'Salin Semua'}
                  </button>
                </div>
              </div>

              {/* Result Content */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                <div className="lg:col-span-8 space-y-12">
                  <div ref={resultRef} className="markdown-body bg-white p-8 md:p-12 rounded-3xl border border-stone-200 shadow-sm">
                    <ReactMarkdown>{result}</ReactMarkdown>
                  </div>
                </div>

                {/* Sidebar / Quick Access */}
                <div className="lg:col-span-4 space-y-6">
                  <div className="sticky top-24 space-y-6">
                    <div className="bg-stone-900 text-white p-6 rounded-2xl space-y-4">
                      <h3 className="text-xl font-serif font-bold">Langkah Selanjutnya?</h3>
                      <p className="text-stone-400 text-sm leading-relaxed">
                        Gunakan panduan ini untuk rapat koordinasi dengan guru atau presentasi ke pemangku kepentingan.
                      </p>
                      <div className="space-y-3 pt-2">
                        <ActionButton icon={<FileText size={18} />} label="Cetak Dokumen" onClick={() => window.print()} />
                        <ActionButton icon={<Presentation size={18} />} label="Buka Mode Presentasi" onClick={() => alert("Gunakan bagian 'Bahan Presentasi' di bawah untuk paparan Anda.")} />
                      </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl space-y-3">
                      <h4 className="font-bold text-emerald-900 flex items-center gap-2">
                        <Zap size={18} />
                        Tips Ahli
                      </h4>
                      <p className="text-emerald-800 text-sm leading-relaxed">
                        Fokuslah pada <strong>Quick Wins</strong> di 2 bulan pertama untuk membangun kepercayaan diri tim sebelum masuk ke program yang lebih kompleks.
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
      <footer className="border-t border-stone-200 py-12 mt-12 bg-white">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-4">
          <div className="flex items-center justify-center gap-2 opacity-50">
            <School size={16} />
            <span className="text-sm font-medium uppercase tracking-widest">Transformasi Sekolah Agak Laen</span>
          </div>
          <p className="text-stone-400 text-sm">
            &copy; {new Date().getFullYear()} &bull; Dirancang untuk kemajuan pendidikan Indonesia.
          </p>
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
  large = false
}: { 
  title: string; 
  description: string; 
  name: string; 
  value: string; 
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void; 
  icon: React.ReactNode;
  placeholder: string;
  large?: boolean;
}) {
  return (
    <div className={`bg-white p-6 rounded-2xl border border-stone-200 shadow-sm hover:border-stone-300 transition-all group ${large ? 'md:p-8' : ''}`}>
      <div className="flex items-start gap-4 mb-4">
        <div className="p-2 bg-stone-50 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all">
          {icon}
        </div>
        <div>
          <h3 className="font-bold text-stone-900">{title}</h3>
          <p className="text-xs text-stone-500">{description}</p>
        </div>
      </div>
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full bg-stone-50 border border-stone-100 rounded-xl p-4 text-stone-800 placeholder:text-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all resize-none ${large ? 'h-48' : 'h-32'}`}
      />
    </div>
  );
}

function ActionButton({ icon, label, onClick }: { icon: React.ReactNode; label: string; onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className="w-full flex items-center gap-3 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-xl text-sm font-medium transition-colors text-left"
    >
      {icon}
      {label}
    </button>
  );
}
