import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Gemini API client initialization
  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      }
    }
  });

  // API route for generating the transformation plan
  app.post("/api/generate-plan", async (req, res) => {
    const { 
      strengths, 
      weaknesses, 
      opportunities, 
      threats, 
      futureHopes 
    } = req.body;

    if (!strengths || !weaknesses || !opportunities || !threats || !futureHopes) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      // Using gemini-3-flash-preview (Free model per skill guidelines)
      const model = "gemini-3-flash-preview";
      
      const prompt = `
        Bertindaklah sebagai Ahli Strategi Transformasi Sekolah yang berpengalaman lebih dari 20 tahun. 
        Tugasmu adalah memproses 5 Data Kunci berikut untuk menghasilkan "Panduan Transformasi Sekolah yang 'Agak Laen'".
        
        DATA KUNCI:
        1. Kekuatan: ${strengths}
        2. Kelemahan: ${weaknesses}
        3. Peluang: ${opportunities}
        4. Ancaman: ${threats}
        5. Harapan Masa Depan (3 Tahun): ${futureHopes}
        
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

      res.json({ text: response.text });
    } catch (error: any) {
      console.error("Gemini API Error:", error);
      res.status(500).json({ error: "Gagal menghasilkan rencana. Silakan coba lagi nanti." });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
