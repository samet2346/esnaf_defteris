'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Edit, Trash2, Phone, MessageCircle, Image as ImageIcon, Receipt, CheckCircle2, Clock, History, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { api } from '../../lib/api'; // Orijinal api yapın aynen kalıyor

const MEDIA_BASE_URL = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000');

// API'den gelecek İş Detay veri tipi
interface JobDetail {
  id: string | number;
  talep_no: string;
  musteri_adi_goster: string;
  musteri_telefon_goster?: string;
  durum: string;
  yapilan_is: string;
  tarih: string;
  ucret: string | number;
  kalan_tutar: number;
  fotograflar?: { id: number; fotograf: string; foto_tipi: string }[];
}

export default function JobDetailPage() {
  const params = useParams();
  const router = useRouter();
  const jobId = params?.id as string;

  // --- STATELER ---
  const [job, setJob] = useState<JobDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- API'DEN VERİ ÇEKME ---
  useEffect(() => {
    if (!jobId) return;

    const fetchJobDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Senin orijinal api yapın üzerinden veri çekme
        const data = await api.jobs.getById(jobId);
        setJob(data);
      } catch (err: any) {
        setError(err.message || 'İş detayları yüklenirken bir bağlantı hatası oluştu.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobDetail();
  }, [jobId]);

  // İş Silme Fonksiyonu
  const handleDelete = async () => {
    const confirmDelete = window.confirm('Bu iş kaydını silmek istediğinize emin misiniz? Bu işlem geri alınamaz.');
    if (!confirmDelete) return;

    try {
      await api.jobs.delete(jobId);
      alert('İş kaydı başarıyla silindi.');
      router.push('/jobs'); // Silindikten sonra listeye dön
    } catch (err: any) {
      alert('İş silinirken bir hata oluştu: ' + (err.message || 'Bilinmeyen Hata'));
    }
  };

  // Güvenli Veri Atamaları
  const rNo = job?.talep_no || `#ID-${job?.id}`;
  const cName = job?.musteri_adi_goster || 'İsimsiz Müşteri';
  const cPhone = job?.musteri_telefon_goster || '';
  const totalPrice = Number(job?.ucret) || 0;
  const remainingDebt = job?.kalan_tutar || 0;
  const DURUM_LABEL: Record<string, string> = { bekliyor: 'Bekliyor', devam_ediyor: 'Devam Ediyor', tamamlandi: 'Tamamlandı' };
  const durumLabel = job ? (DURUM_LABEL[job.durum] || job.durum) : '';
  const dateStr = job?.tarih ? new Date(job.tarih).toLocaleDateString('tr-TR') : '';
  
  // Ödenen tutarı hesapla
  const paidAmount = totalPrice - remainingDebt;

  // WhatsApp'a Yönlendirme
  const handleWhatsApp = () => {
    if (cPhone) {
      const cleanPhone = cPhone.replace(/\D/g, ''); 
      window.open(`https://wa.me/90${cleanPhone}`, '_blank');
    }
  };

  return (
    <div className="space-y-4 pb-24 relative min-h-[80vh]">
      
      {/* Üst Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mt-2">
        <div className="flex items-center gap-3">
          <Link href="/jobs" className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center active:bg-gray-200 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h2 className="text-sm font-bold text-slate-800">İş Detayı</h2>
            <p className="text-xs text-gray-500">{isLoading ? '...' : rNo}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {/* Düzenleme Butonu */}
          <button onClick={() => alert("Düzenleme özelliği yakında eklenecek.")} className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center active:bg-blue-100">
            <Edit size={18} />
          </button>
          {/* Silme Butonu */}
          <button onClick={handleDelete} className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center active:bg-red-100">
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Yükleniyor Durumu */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-blue-600">
          <Loader2 size={40} className="animate-spin mb-4" />
          <p className="text-sm font-medium text-gray-500">İş detayları getiriliyor...</p>
        </div>
      )}

      {/* Hata Durumu */}
      {!isLoading && error && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={32} />
          </div>
          <h3 className="text-sm font-bold text-slate-800 mb-2">Hata Oluştu</h3>
          <p className="text-xs text-gray-500 mb-6">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm active:bg-gray-50"
          >
            Tekrar Dene
          </button>
        </div>
      )}

      {/* Veriler Başarıyla Geldiyse Göster */}
      {!isLoading && !error && job && (
        <>
          {/* Müşteri Kartı */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold text-slate-800">{cName}</h3>
              <p className="text-xs text-gray-500 mt-0.5">{cPhone || 'Telefon Yok'}</p>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={handleWhatsApp}
                disabled={!cPhone} 
                className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center active:bg-green-100 disabled:opacity-50"
              >
                <MessageCircle size={20} />
              </button>
              <a 
                href={cPhone ? `tel:${cPhone}` : '#'} 
                className={`w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center active:bg-blue-100 ${!cPhone && 'opacity-50 pointer-events-none'}`}
              >
                <Phone size={20} />
              </a>
            </div>
          </div>

          {/* İş Bilgileri */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Clock size={16} className="text-gray-400"/> {dateStr}
              </h3>
              <span className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold ${
                job.durum === 'bekliyor' ? 'bg-orange-100 text-orange-600' :
                job.durum === 'devam_ediyor' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
              }`}>
                {job.durum === 'tamamlandi' ? <CheckCircle2 size={12}/> : <Clock size={12} />}
                {durumLabel}
              </span>
            </div>
            <div className="p-4">
              <p className="text-sm text-slate-700 leading-relaxed font-medium">
                {job.yapilan_is || 'Bu iş için herhangi bir açıklama girilmemiş.'}
              </p>
            </div>
          </div>

          {/* Fotoğraflar */}
          {job.fotograflar && job.fotograflar.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h3 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <ImageIcon size={16} className="text-gray-400" /> Fotoğraflar ({job.fotograflar.length})
              </h3>
              <div className="grid grid-cols-3 gap-2">
                {job.fotograflar.map((foto) => (
                  <a 
                    key={foto.id}
                    href={foto.fotograf.startsWith('http') ? foto.fotograf : `${MEDIA_BASE_URL}${foto.fotograf}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block aspect-square rounded-xl bg-slate-100 overflow-hidden relative border border-slate-200"
                  >
                    <img 
                      src={foto.fotograf.startsWith('http') ? foto.fotograf : `${MEDIA_BASE_URL}${foto.fotograf}`} 
                      alt="İş Görseli" 
                      className="w-full h-full object-cover"
                    />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Hesap Özeti ve Ödeme Geçmişi */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-50 space-y-3">
              <h3 className="text-sm font-bold text-slate-800 mb-2 flex items-center gap-2">
                <Receipt size={18} className="text-blue-500" /> Hesap Özeti
              </h3>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Toplam Ücret</span>
                <span className="font-medium text-slate-800">{totalPrice.toLocaleString('tr-TR')} ₺</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Ödenen Toplam</span>
                <span className="font-medium text-green-600">- {paidAmount > 0 ? paidAmount.toLocaleString('tr-TR') : 0} ₺</span>
              </div>
              <div className="h-px bg-gray-100 w-full my-2"></div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-slate-800">Kalan Borç</span>
                <span className={`text-lg font-bold ${remainingDebt > 0 ? 'text-red-500' : 'text-green-500'}`}>
                  {remainingDebt > 0 ? remainingDebt.toLocaleString('tr-TR') : 0} ₺
                </span>
              </div>
            </div>
            
            {/* Ödeme Geçmişi */}
            <div className="p-4 bg-gray-50/50">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 flex items-center gap-2">
                <History size={14}/> Ödeme Hareketleri
              </h4>
              <div className="space-y-2">
                {paidAmount > 0 ? (
                  <div className="flex justify-between items-center text-xs bg-white p-2.5 rounded-lg border border-gray-100">
                    <div>
                      <span className="font-bold text-slate-700">Tahsilat Alındı</span>
                      <p className="text-[10px] text-gray-400">{dateStr}</p>
                    </div>
                    <span className="font-bold text-green-600">+ {paidAmount.toLocaleString('tr-TR')} ₺</span>
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 text-center py-2">Henüz ödeme alınmamış.</p>
                )}
              </div>
            </div>
          </div>

          {/* Tahsilat Butonu */}
          {remainingDebt > 0 && (
            <div className="fixed bottom-20 left-0 w-full px-4 z-40">
              <button 
                onClick={() => alert("Kısmi tahsilat ekleme işlemi çok yakında aktif edilecek!")}
                className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg flex items-center justify-center gap-2 active:bg-blue-700 transition-colors"
              >
                <CheckCircle2 size={20} /> Tahsilat Ekle (Borcu Düş)
              </button>
            </div>
          )}
        </>
      )}

    </div>
  );
}