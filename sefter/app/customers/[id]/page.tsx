'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Phone, MessageCircle, Briefcase, Wallet, Copy, Image as ImageIcon, Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { api } from '../../lib/api'; // API yolunu klasör yapına göre düzenleyebilirsin (örn: '@/lib/api')

// Müşteri ve İş tipleri
interface Job {
  id: string | number;
  yapilan_is: string;
  tarih: string;
  ucret: string | number;
  durum: string;
}

interface CustomerDetail {
  id: string | number;
  ad_soyad: string;
  telefon: string;
  kalan_borc: number;
  toplam_harcama: number;
}

export default function CustomerDetailPage() {
  const params = useParams();
  const customerId = params?.id as string;

  // --- STATELER ---
  const [customer, setCustomer] = useState<CustomerDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [jobsList, setJobsList] = useState<Job[]>([]);

  // --- API'DEN VERİ ÇEKME ---
  useEffect(() => {
    if (!customerId) return;

    const fetchCustomerDetail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // ID'ye göre müşteriyi çekiyoruz
        const data = await api.customers.getOzet(customerId);
        setCustomer(data.musteri);
        setJobsList(data.gecmis || []);
      } catch (err: any) {
        setError(err.message || 'Müşteri bilgileri yüklenirken bir hata oluştu.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomerDetail();
  }, [customerId]);

  // --- YARDIMCI FONKSİYONLAR ---
  const getInitials = (name: string) => {
    if (!name) return 'M';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const cName = customer?.ad_soyad || 'İsimsiz Müşteri';
  const cPhone = customer?.telefon || '';
  const totalJobs = jobsList.length;
  const totalPaid = Number(customer?.toplam_harcama) - Number(customer?.kalan_borc) || 0;
  const remainingDebt = Number(customer?.kalan_borc) || 0;

  const DURUM_LABEL: Record<string, string> = { bekliyor: 'Bekliyor', devam_ediyor: 'Devam Ediyor', tamamlandi: 'Tamamlandı' };

  // Numara Kopyalama İşlemi
  const handleCopyPhone = () => {
    if (cPhone) {
      navigator.clipboard.writeText(cPhone);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // WhatsApp'a Yönlendirme
  const handleWhatsApp = () => {
    if (cPhone) {
      // Numaradaki boşlukları vs. temizle
      const cleanPhone = cPhone.replace(/\D/g, ''); 
      window.open(`https://wa.me/90${cleanPhone}`, '_blank');
    }
  };

  return (
    <div className="space-y-4 pb-6 relative min-h-[80vh]">
      
      {/* Üst Menü Bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mt-2">
        <div className="flex items-center gap-3">
          <Link href="/customers" className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center active:bg-gray-200 transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <h2 className="text-sm font-bold text-slate-800">Müşteri Profili</h2>
        </div>
      </div>

      {/* Yükleniyor Durumu */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-blue-600">
          <Loader2 size={40} className="animate-spin mb-4" />
          <p className="text-sm font-medium text-gray-500">Müşteri detayları getiriliyor...</p>
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

      {/* Başarılı Veri Gösterimi */}
      {!isLoading && !error && customer && (
        <>
          {/* Profil Başlığı ve İletişim */}
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 text-center relative overflow-hidden">
            <div className="w-20 h-20 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-3 shadow-sm border-4 border-white">
              {getInitials(cName)}
            </div>
            <h3 className="text-lg font-bold text-slate-800">{cName}</h3>
            <p className="text-sm text-gray-500 mb-4">{cPhone || 'Telefon Belirtilmemiş'}</p>
            
            {/* İletişim Butonları */}
            <div className="flex justify-center gap-2">
              <button onClick={handleWhatsApp} disabled={!cPhone} className="flex-[1.5] bg-green-50 text-green-600 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-green-100 active:bg-green-100 disabled:opacity-50">
                <MessageCircle size={16} /> WhatsApp
              </button>
              <a href={`tel:${cPhone}`} className={`flex-[1.5] bg-blue-50 text-blue-600 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-blue-100 active:bg-blue-100 ${!cPhone && 'opacity-50 pointer-events-none'}`}>
                <Phone size={16} /> Ara
              </a>
              <button onClick={handleCopyPhone} disabled={!cPhone} className="flex-1 bg-gray-50 text-gray-600 py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 border border-gray-200 active:bg-gray-200 disabled:opacity-50 transition-all">
                {copied ? <CheckCircle2 size={16} className="text-green-500" /> : <Copy size={16} />}
                {copied ? 'Kopyalandı' : 'Kopyala'}
              </button>
            </div>
          </div>

          {/* İstatistikler */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-2"><Briefcase size={14} /></div>
              <p className="text-[10px] text-gray-500 font-medium">Toplam İş</p>
              <p className="text-sm font-bold text-slate-800">{totalJobs}</p>
            </div>
            <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100 text-center">
              <div className="w-8 h-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center mx-auto mb-2"><Wallet size={14} /></div>
              <p className="text-[10px] text-gray-500 font-medium">Tahsilat</p>
              <p className="text-sm font-bold text-slate-800">{totalPaid.toLocaleString('tr-TR')} ₺</p>
            </div>
            <div className={`${remainingDebt > 0 ? 'bg-red-50 border-red-100' : 'bg-gray-50 border-gray-100'} p-3 rounded-2xl shadow-sm border text-center`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 shadow-sm bg-white ${remainingDebt > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                <Wallet size={14} />
              </div>
              <p className={`text-[10px] font-medium ${remainingDebt > 0 ? 'text-red-600' : 'text-gray-500'}`}>Kalan Borç</p>
              <p className={`text-sm font-bold ${remainingDebt > 0 ? 'text-red-600' : 'text-slate-800'}`}>{remainingDebt.toLocaleString('tr-TR')} ₺</p>
            </div>
          </div>

          {/* Geçmiş İşler Listesi */}
          <div>
            <h3 className="text-sm font-bold text-slate-800 mb-3 px-1">Geçmiş İşler</h3>
            
            {jobsList.length > 0 ? (
              <div className="space-y-3">
                {jobsList.map((job) => {
                  const jobPrice = Number(job.ucret) || 0;
                  const jobDate = job.tarih ? new Date(job.tarih).toLocaleDateString('tr-TR') : '';

                  return (
                    <Link key={job.id} href={`/jobs/${job.id}`} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center active:bg-gray-50 transition-colors">
                      <div>
                        <p className="text-sm font-bold text-slate-800 line-clamp-1">{job.yapilan_is || 'İş Tanımı Yok'}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{jobDate}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-bold text-slate-800">{jobPrice.toLocaleString('tr-TR')} ₺</p>
                        <span className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded mt-1 ${job.durum === 'bekliyor' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                          {DURUM_LABEL[job.durum] || job.durum}
                        </span>
                      </div>
                    </Link>
                  )
                })}
              </div>
            ) : (
              <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
                <p className="text-xs text-gray-500">Müşteriye ait geçmiş iş kaydı bulunamadı.</p>
              </div>
            )}
          </div>

          {/* Fotoğraf Galerisi */}
          <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ImageIcon size={18} className="text-blue-500" /> Müşteri Galerisi
              </h3>
              <button className="text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded active:bg-blue-100">
                Tümünü Gör
              </button>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
              {/* Not: Gerçek görseller backend'den geliyorsa bu alanı map() ile dinamik hale getirebilirsin */}
              <div className="min-w-25 h-25 bg-gray-100 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-gray-400 text-xs gap-1 shrink-0"><ImageIcon size={20}/> Tesisat</div>
              <div className="min-w-25 h-25 bg-gray-100 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-gray-400 text-xs gap-1 shrink-0"><ImageIcon size={20}/> Kombi</div>
              <div className="min-w-25 h-25 bg-gray-50 rounded-xl border border-gray-200 flex flex-col items-center justify-center text-gray-400 text-xs gap-1 shrink-0 opacity-70"><ImageIcon size={20}/></div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}