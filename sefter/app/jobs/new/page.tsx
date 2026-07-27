'use client';
import { useState, useEffect, useRef } from 'react';
import { Camera, Image as ImageIcon, Save, X, User, Briefcase, DollarSign, FileText, Calendar, Clock, Printer, Trash2, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api';

export default function NewJobPage() {
  const router = useRouter();
  const [customerName, setCustomerName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [total, setTotal] = useState<number | ''>('');
  const [paid, setPaid] = useState<number | ''>('');

  const [status, setStatus] = useState('bekliyor'); // backend değerleri: bekliyor | devam_ediyor | tamamlandi
  const [selectedImages, setSelectedImages] = useState<File[]>([]);

  const cameraInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [requestNo, setRequestNo] = useState('Oluşturuluyor...');
  const [todayStr, setTodayStr] = useState('...');
  const [todayInput, setTodayInput] = useState('');
  const [timeInput, setTimeInput] = useState('');

  useEffect(() => {
    setRequestNo(`#DFTR-${Math.floor(1000 + Math.random() * 9000)}`);
    const now = new Date();
    setTodayStr(now.toLocaleDateString('tr-TR'));
    setTodayInput(now.toISOString().split('T')[0]);
    setTimeInput(now.toTimeString().slice(0, 5));
  }, []);

  const remaining = (Number(total) || 0) - (Number(paid) || 0);

  const handlePrint = (e: React.MouseEvent) => {
    e.preventDefault();
    window.print();
  };

  const handleSave = async () => {
    if (!customerName || !jobDescription) {
      setError('Lütfen Müşteri Adı ve İş Detayları alanlarını doldurun.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    try {
      setIsSubmitting(true);
      setError(null);
      const payload = {
        musteri_adi: customerName,
        yapilan_is: jobDescription,
        ucret: Number(total) || 0,
        durum: status,
      };
      const yeniIs = await api.jobs.create(payload);

      const paidAmount = Number(paid) || 0;
      if (paidAmount > 0 && yeniIs?.id) {
        await api.jobs.addPayment(yeniIs.id, { tutar: paidAmount });
      }

      if (selectedImages.length > 0) {
        await api.jobs.addPhotos(yeniIs.id, selectedImages);
      }

      alert("İş başarıyla kaydedildi!");
      router.push('/jobs');
    } catch (err: any) {
      setError(err.message || 'İş kaydedilirken sunucu kaynaklı bir hata oluştu.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);
      setSelectedImages(prev => [...prev, ...files]);
    }
    e.target.value = '';
  };

  const removeImage = (indexToRemove: number) => {
    setSelectedImages(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  return (
    <div className="space-y-6 pb-6 relative">

      <div className="hidden print:block absolute top-0 left-0 w-full bg-white text-black p-8 z-50">
        <div className="text-center mb-6 border-b-2 border-dashed border-gray-300 pb-6">
          <div className="w-12 h-12 bg-gray-800 text-white rounded-lg flex items-center justify-center font-bold text-2xl mx-auto mb-2">D</div>
          <h1 className="text-2xl font-extrabold uppercase tracking-widest">DEFTER SERVİS</h1>
          <p className="text-sm text-gray-500">Müşteri ve İş Takip Sistemi</p>
        </div>
        <div className="space-y-4 mb-6 text-sm">
          <div className="flex justify-between"><span className="font-bold">Talep No:</span> <span>{requestNo}</span></div>
          <div className="flex justify-between"><span className="font-bold">Tarih:</span> <span>{todayStr}</span></div>
          <div className="flex justify-between"><span className="font-bold">Müşteri:</span> <span>{customerName || 'Belirtilmedi'}</span></div>
        </div>
        <div className="border-t-2 border-b-2 border-gray-800 py-4 mb-6">
          <h2 className="font-bold mb-2 uppercase">Yapılan İşlem</h2>
          <p className="text-sm">{jobDescription || 'Belirtilmedi'}</p>
        </div>
        <div className="space-y-2 text-sm font-medium mb-8">
          <div className="flex justify-between"><span>Toplam Tutar:</span> <span>{total || 0} ₺</span></div>
          <div className="flex justify-between"><span>Alınan (Peşinat):</span> <span>{paid || 0} ₺</span></div>
          <div className="flex justify-between text-lg font-bold mt-2 pt-2 border-t border-gray-300">
            <span>KALAN BORÇ:</span> <span>{remaining > 0 ? remaining : 0} ₺</span>
          </div>
        </div>
      </div>

      <div className="print:hidden space-y-6">

        <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mt-2">
          <div>
            <h2 className="text-lg font-bold text-slate-800">Yeni İş Oluştur</h2>
            <p className="text-xs text-gray-500">Talep No: {requestNo}</p>
          </div>
          <Link href="/dashboard" className="w-10 h-10 bg-gray-50 text-gray-500 rounded-full flex items-center justify-center active:bg-gray-100"><X size={20} /></Link>
        </div>
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 font-medium flex items-center gap-2">
            <AlertCircle size={18} /> {error}
          </div>
        )}
        <div className="flex gap-3">
          <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <label className="flex text-xs font-medium text-gray-500 mb-1 items-center gap-1"><Calendar size={12}/> Tarih</label>
            <input
              type="date"
              value={todayInput}
              onChange={(e) => setTodayInput(e.target.value)}
              disabled={isSubmitting}
              className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
          </div>
          <div className="flex-1 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <label className="flex text-xs font-medium text-gray-500 mb-1 items-center gap-1"><Clock size={12}/> Saat</label>
            <input
              type="time"
              value={timeInput}
              onChange={(e) => setTimeInput(e.target.value)}
              disabled={isSubmitting}
              className="w-full border border-gray-200 rounded-xl p-2.5 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
            />
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-sm font-bold text-blue-600 flex items-center gap-2"><User size={18} /> Müşteri Seç</h3>
          <input
            type="text"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
            disabled={isSubmitting}
            placeholder="İsim soyisim veya telefon..."
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-sm font-bold text-blue-600 flex items-center gap-2"><Briefcase size={18} /> İş Detayları</h3>
          <input
            type="text"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            disabled={isSubmitting}
            placeholder="Yapılacak İş (Örn: Kombi bakımı)"
            className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:border-blue-500 disabled:opacity-50"
          />

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-2">Durum</label>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setStatus('bekliyor')}
                disabled={isSubmitting}
                className={`text-xs py-2 rounded-lg font-bold transition-colors disabled:opacity-50 ${status === 'bekliyor' ? 'bg-orange-100 border-orange-200 text-orange-600 border' : 'bg-gray-50 border border-gray-200 text-gray-400'}`}>
                Bekliyor
              </button>
              <button
                onClick={() => setStatus('devam_ediyor')}
                disabled={isSubmitting}
                className={`text-xs py-2 rounded-lg font-bold transition-colors disabled:opacity-50 ${status === 'devam_ediyor' ? 'bg-blue-100 border-blue-200 text-blue-600 border' : 'bg-gray-50 border border-gray-200 text-gray-400'}`}>
                Devam Ediyor
              </button>
              <button
                onClick={() => setStatus('tamamlandi')}
                disabled={isSubmitting}
                className={`text-xs py-2 rounded-lg font-bold transition-colors disabled:opacity-50 ${status === 'tamamlandi' ? 'bg-green-100 border-green-200 text-green-600 border' : 'bg-gray-50 border border-gray-200 text-gray-400'}`}>
                Tamamlandı
              </button>
            </div>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-sm font-bold text-blue-600 flex items-center gap-2"><DollarSign size={18} /> Ücretlendirme</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Toplam Ücret (₺)</label>
              <input type="number" value={total} onChange={(e) => setTotal(Number(e.target.value) || '')} disabled={isSubmitting} placeholder="0.00" className="w-full border border-gray-200 rounded-xl p-3 text-sm font-bold text-slate-800 focus:outline-none focus:border-blue-500 disabled:opacity-50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-500 mb-1">Ödenen (Peşinat)</label>
              <input type="number" value={paid} onChange={(e) => setPaid(Number(e.target.value) || '')} disabled={isSubmitting} placeholder="0.00" className="w-full border border-gray-200 rounded-xl p-3 text-sm font-bold text-green-600 focus:outline-none focus:border-green-500 disabled:opacity-50" />
            </div>
          </div>
          <div className={`p-3 rounded-xl flex justify-between items-center border ${remaining > 0 ? 'bg-red-50 border-red-100 text-red-600' : 'bg-gray-50 border-gray-200 text-gray-500'}`}>
            <span className="text-xs font-bold uppercase tracking-wide">Kalan Borç (Otomatik)</span>
            <span className="text-lg font-bold">{remaining > 0 ? remaining : 0} ₺</span>
          </div>
        </div>
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-sm font-bold text-blue-600 flex items-center gap-2"><FileText size={18} /> Medya & Belge</h3>

          <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleFileChange} className="hidden" />
          <input type="file" accept="image/*" multiple ref={galleryInputRef} onChange={handleFileChange} className="hidden" />

          <div className="flex gap-3">
            <button onClick={() => cameraInputRef.current?.click()} disabled={isSubmitting} className="flex-1 flex flex-col items-center justify-center gap-2 bg-blue-50 border border-blue-100 rounded-xl p-4 text-blue-600 active:bg-blue-100 transition-colors disabled:opacity-50"><Camera size={24} /><span className="text-xs font-medium">Kamera Aç</span></button>
            <button onClick={() => galleryInputRef.current?.click()} disabled={isSubmitting} className="flex-1 flex flex-col items-center justify-center gap-2 bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-600 active:bg-gray-100 transition-colors disabled:opacity-50"><ImageIcon size={24} /><span className="text-xs font-medium">Galeriden Seç</span></button>
          </div>
          {selectedImages.length > 0 && (
            <div className="mt-4 space-y-2">
              <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Eklenecek Fotoğraflar ({selectedImages.length})</p>
              {selectedImages.map((img, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded-lg border border-gray-100">
                  <div className="flex items-center gap-2 overflow-hidden">
                    <ImageIcon size={14} className="text-gray-400 shrink-0" />
                    <span className="text-xs text-gray-600 truncate">{img.name}</span>
                  </div>
                  <button onClick={() => removeImage(index)} disabled={isSubmitting} className="text-red-400 hover:text-red-600 p-1 rounded-full hover:bg-red-50 disabled:opacity-50"><Trash2 size={14} /></button>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="space-y-3 pt-2">
          <button onClick={handlePrint} disabled={isSubmitting} className="w-full bg-gray-800 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-md active:bg-gray-700 transition-colors disabled:opacity-50">
            <Printer size={20} /> Kaydet ve Fiş Çıkar
          </button>

          <div className="flex gap-3 w-full">
            <Link href="/dashboard" className="w-1/3 bg-gray-100 text-gray-700 font-bold py-4 rounded-xl flex items-center justify-center active:bg-gray-200 transition-colors">Vazgeç</Link>
            <button
              onClick={handleSave}
              disabled={isSubmitting}
              className="w-2/3 bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:bg-blue-700 transition-colors disabled:bg-blue-400"
            >
              {isSubmitting ? (
                <>Kaydediliyor <Loader2 size={20} className="animate-spin" /></>
              ) : (
                <><Save size={20} /> Sadece Kaydet</>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
