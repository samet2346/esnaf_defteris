'use client';

import { useState, useEffect } from 'react';
import { ArrowUpRight, ArrowDownRight, Wallet, Users, ChevronRight, Briefcase, PlusCircle, UserPlus, Calendar, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { api } from '../lib/api'; // API yolunu kendi klasör yapına göre ayarla (örn: '@/lib/api')

// API'den gelecek özet veri tipleri
interface DashboardStats {
  customers: number;
  jobs: number;
  receivables: number;
  debtors: number;
}

interface TodayJob {
  id: string | number;
  musteri_adi_goster: string;
  tarih: string;
  yapilan_is: string;
  durum: string;
}

interface UpcomingPayment {
  ad_soyad: string;
  telefon: string;
  kalan_borc: number;
  son_islem_tarihi?: string;
}

export default function Dashboard() {
  // --- STATELER ---
  const [stats, setStats] = useState<DashboardStats>({ customers: 0, jobs: 0, receivables: 0, debtors: 0 });
  const [todaysJobs, setTodaysJobs] = useState<TodayJob[]>([]);
  const [upcomingPayments, setUpcomingPayments] = useState<UpcomingPayment[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- API'DEN VERİ ÇEKME ---
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Özet endpoint'inden verileri çekiyoruz
        const summaryData = await api.dashboard.getSummary();

        setStats({
          customers: summaryData.toplam_musteri || 0,
          jobs: summaryData.toplam_is || 0,
          receivables: summaryData.toplam_alacak || 0,
          debtors: summaryData.borclu_musteri_sayisi || 0,
        });

        setTodaysJobs(summaryData.bugunku_isler || []);

        // Borçlu müşteriler listesini "yaklaşan ödemeler" olarak kullanıyoruz
        const debtorsData = await api.dashboard.getDebtors();
        setUpcomingPayments(debtorsData || []);

      } catch (err: any) {
        setError(err.message || 'Dashboard verileri yüklenirken bir hata oluştu.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="space-y-6 pb-6 relative">
      
      {/* Hızlı İşlem Butonları */}
      <div className="flex gap-3 mt-2">
        <Link href="/jobs/new" className="flex-1 bg-blue-600 text-white rounded-xl p-3 flex items-center justify-center gap-2 font-bold text-sm shadow-md shadow-blue-200">
          <PlusCircle size={18}/> Yeni İş
        </Link>
        <Link href="/customers" className="flex-1 bg-white border border-blue-600 text-blue-600 rounded-xl p-3 flex items-center justify-center gap-2 font-bold text-sm shadow-sm">
          <UserPlus size={18}/> Yeni Müşteri
        </Link>
      </div>

      {/* Yükleniyor veya Hata Durumları */}
      {isLoading && (
        <div className="flex flex-col items-center justify-center py-10 text-blue-600">
          <Loader2 size={32} className="animate-spin mb-3" />
          <p className="text-sm font-medium text-gray-500">Özet bilgileriniz yükleniyor...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 font-medium flex items-center gap-2">
          <AlertCircle size={20} className="shrink-0" /> 
          <span className="flex-1">{error}</span>
          <button onClick={() => window.location.reload()} className="underline font-bold text-xs">Tekrar Dene</button>
        </div>
      )}

      {/* Veriler Başarıyla Geldiyse Göster */}
      {!isLoading && !error && (
        <>
          {/* 4'lü İstatistik Kartları */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2"><Users size={16} /></div>
              <p className="text-xs text-gray-500 font-medium">Toplam Müşteri</p>
              <p className="text-xl font-bold text-slate-800 mt-1">{stats.customers}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-8 h-8 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center mb-2"><Briefcase size={16} /></div>
              <p className="text-xs text-gray-500 font-medium">Toplam İş</p>
              <p className="text-xl font-bold text-slate-800 mt-1">{stats.jobs}</p>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
              <div className="w-8 h-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-2"><Wallet size={16} /></div>
              <p className="text-xs text-gray-500 font-medium">Toplam Alacak</p>
              <p className="text-xl font-bold text-slate-800 mt-1">{stats.receivables.toLocaleString('tr-TR')} ₺</p>
            </div>
            <div className="bg-red-50 p-4 rounded-2xl shadow-sm border border-red-100">
              <div className="w-8 h-8 bg-white text-red-500 rounded-full flex items-center justify-center mb-2 shadow-sm"><Users size={16} /></div>
              <p className="text-xs text-red-600 font-medium">Borçlu Müşteri</p>
              <p className="text-xl font-bold text-red-600 mt-1">{stats.debtors} Kişi</p>
            </div>
          </div>

          {/* Bugünkü İşler & Yaklaşan Ödemeler */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
            
            {/* Bugünkü İşler */}
            <div>
              <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Calendar size={16} className="text-blue-500"/> Bugünkü İşler ({todaysJobs.length})
              </h2>
              
              <div className="space-y-2">
                {todaysJobs.length > 0 ? (
                  todaysJobs.map((job) => {
                    const jobTime = job.tarih ? new Date(job.tarih).toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }) : '';
                    const DURUM_LABEL: Record<string, string> = { bekliyor: 'Bekliyor', devam_ediyor: 'Devam Ediyor', tamamlandi: 'Tamamlandı' };
                    return (
                      <div key={job.id} className="p-3 bg-gray-50 rounded-xl flex justify-between items-center border border-gray-100">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{job.musteri_adi_goster}</p>
                          <p className="text-[10px] text-gray-500">{jobTime} - {job.yapilan_is}</p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-1 rounded ${job.durum === 'bekliyor' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'}`}>
                          {DURUM_LABEL[job.durum] || job.durum}
                        </span>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-xs text-gray-400 text-center py-2">Bugün için planlanan iş bulunmuyor.</p>
                )}
              </div>
            </div>
            
          </div>

            {/* Yaklaşan Ödemeler */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
              <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
                <Wallet size={16} className="text-green-500"/> Yaklaşan Ödemeler
              </h2>
              <div className="space-y-2">
                {upcomingPayments.length > 0 ? (
                  upcomingPayments.map((payment, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-xl flex justify-between items-center border border-gray-100">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{payment.ad_soyad}</p>
                        <p className="text-[10px] text-gray-500">{payment.telefon}</p>
                      </div>
                      <p className="text-sm font-bold text-red-500">{Number(payment.kalan_borc).toLocaleString('tr-TR')} ₺</p>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-gray-400 text-center py-2">Yaklaşan ödeme bulunmuyor.</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}

    </div>
  );
}