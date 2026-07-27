'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Calendar, CheckCircle2, Clock, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { api } from '../lib/api';

interface Job {
  id: string | number;
  talep_no: string;
  musteri_adi_goster: string;
  durum: 'bekliyor' | 'devam_ediyor' | 'tamamlandi';
  yapilan_is: string;
  tarih: string;
  ucret: string | number;
  kalan_tutar: number;
}

const DURUM_LABEL: Record<string, string> = {
  bekliyor: 'Bekliyor',
  devam_ediyor: 'Devam Ediyor',
  tamamlandi: 'Tamamlandı',
};

export default function JobsPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [activeFilter, setActiveFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await api.jobs.getAll();
        setJobs(data);
      } catch (err: any) {
        setError(err.message || 'İş kayıtları yüklenirken bir bağlantı hatası oluştu.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const cName = job.musteri_adi_goster || 'İsimsiz';
    const rNo = job.talep_no || '';
    const debt = job.kalan_tutar || 0;

    const matchesSearch =
      cName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      rNo.toLowerCase().includes(searchQuery.toLowerCase());

    let matchesFilter = true;
    if (activeFilter === 'pending') matchesFilter = job.durum === 'bekliyor';
    if (activeFilter === 'completed') matchesFilter = job.durum === 'tamamlandi';
    if (activeFilter === 'debtors') matchesFilter = debt > 0;

    return matchesSearch && matchesFilter;
  });

  return (
    <div className="space-y-4 pb-6 relative">

      <div className="bg-blue-600 text-white p-4 rounded-2xl shadow-md mt-2">
        <h2 className="text-lg font-bold">İş Geçmişi</h2>
        <p className="text-xs text-blue-100">
          {isLoading ? 'Yükleniyor...' : `Toplam ${jobs.length} Kayıtlı İş`}
        </p>
      </div>

      <div className="flex gap-2">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            disabled={isLoading || !!error}
            placeholder="İsim veya Talep No..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm disabled:opacity-50"
          />
        </div>
        <button className="bg-white border border-gray-200 text-gray-600 px-4 rounded-xl flex items-center justify-center shadow-sm hover:bg-gray-50 active:bg-gray-100 disabled:opacity-50">
          <Filter size={18} />
        </button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button
          onClick={() => setActiveFilter('all')}
          className={`touch-target whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium shadow-sm transition-colors ${activeFilter === 'all' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
        >
          Tümü
        </button>
        <button
          onClick={() => setActiveFilter('pending')}
          className={`touch-target whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium shadow-sm transition-colors ${activeFilter === 'pending' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
        >
          Bekleyenler
        </button>
        <button
          onClick={() => setActiveFilter('completed')}
          className={`touch-target whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium shadow-sm transition-colors ${activeFilter === 'completed' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
        >
          Tamamlananlar
        </button>
        <button
          onClick={() => setActiveFilter('debtors')}
          className={`touch-target whitespace-nowrap px-4 py-2 rounded-full text-xs font-medium shadow-sm transition-colors ${activeFilter === 'debtors' ? 'bg-blue-600 text-white' : 'bg-white border border-gray-200 text-gray-600'}`}
        >
          Borçlular
        </button>
      </div>

      <div className="space-y-3 min-h-[50vh]">

        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-blue-600">
            <Loader2 size={40} className="animate-spin mb-4" />
            <p className="text-sm font-medium text-gray-500">İş kayıtları getiriliyor...</p>
          </div>
        )}

        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-2">Bağlantı Hatası</h3>
            <p className="text-xs text-gray-500 mb-6">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm active:bg-gray-50"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {!isLoading && !error && filteredJobs.length > 0 && (
          filteredJobs.map((job) => {
            const cName = job.musteri_adi_goster || 'İsimsiz Müşteri';
            const rNo = job.talep_no || `#ID-${job.id}`;
            const debt = job.kalan_tutar || 0;
            const total = Number(job.ucret) || 0;
            const dateStr = job.tarih ? new Date(job.tarih).toLocaleDateString('tr-TR') : '';

            return (
              <Link key={job.id} href={`/jobs/${job.id}`} className="block bg-white p-4 rounded-2xl shadow-sm border border-gray-100 active:bg-gray-50 transition-colors">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <span className="text-[10px] font-bold text-gray-400">{rNo}</span>
                    <h3 className="text-sm font-bold text-slate-800 mt-0.5">{cName}</h3>
                  </div>
                  {job.durum === 'bekliyor' ? (
                    <div className="flex items-center gap-1 bg-orange-50 text-orange-600 px-2 py-1 rounded-md text-[10px] font-bold">
                      <Clock size={12} /> Bekliyor
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 bg-green-50 text-green-600 px-2 py-1 rounded-md text-[10px] font-bold">
                      <CheckCircle2 size={12} /> {DURUM_LABEL[job.durum] || job.durum}
                    </div>
                  )}
                </div>

                <p className="text-xs text-gray-600 mb-3 line-clamp-1">{job.yapilan_is || 'Açıklama girilmemiş.'}</p>

                <div className="flex justify-between items-center pt-3 border-t border-gray-50">
                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar size={12} /> {dateStr}
                  </div>
                  <div className="text-right">
                    {debt > 0 ? (
                      <>
                        <div className="text-[10px] text-gray-400">Kalan Borç</div>
                        <div className="text-sm font-bold text-red-500">{debt.toLocaleString('tr-TR')} ₺</div>
                      </>
                    ) : (
                      <>
                        <div className="text-[10px] text-gray-400">Toplam Ücret</div>
                        <div className="text-sm font-bold text-slate-700">{total.toLocaleString('tr-TR')} ₺</div>
                      </>
                    )}
                  </div>
                </div>
              </Link>
            )
          })
        )}

        {!isLoading && !error && jobs.length > 0 && filteredJobs.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-gray-500">Bu filtreye uygun kayıt bulunamadı.</p>
          </div>
        )}

        {!isLoading && !error && jobs.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-2">Henüz İş Kaydı Yok</h3>
            <p className="text-xs text-gray-500 mb-6">Müşterilerinize ait ilk iş kaydını oluşturarak başlayın.</p>
            <Link href="/jobs/new" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-sm shadow-blue-200 active:bg-blue-700">
              Yeni İş Oluştur
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
