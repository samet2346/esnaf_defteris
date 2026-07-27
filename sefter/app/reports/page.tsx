'use client';

import { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Wallet, Users, FileSpreadsheet, FileText, Calendar } from 'lucide-react';
import { api } from '@/app/lib/api';

interface RaporOzet {
  toplam_gelir: number;
  toplam_alacak: number;
  bu_ay_is_sayisi: number;
  tamamlanan_is_sayisi: number;
  bekleyen_is_sayisi: number;
  devam_eden_is_sayisi: number;
}

interface DashboardOzet {
  toplam_musteri: number;
  toplam_is: number;
  toplam_alacak: number;
  bu_ay_is_sayisi: number;
  bugunku_isler: any[];
  borclu_musteri_sayisi: number;
}

export default function ReportsPage() {
  const [ozet, setOzet] = useState<RaporOzet | null>(null);
  const [dashboard, setDashboard] = useState<DashboardOzet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [raporData, dashboardData] = await Promise.all([
          api.dashboard.getReportSummary(),
          api.dashboard.getSummary(),
        ]);
        setOzet(raporData);
        setDashboard(dashboardData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Bir hata oluştu');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const formatTL = (n: number) =>
    n.toLocaleString('tr-TR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) + ' ₺';

  const tahsilatOrani =
    ozet && ozet.toplam_gelir + ozet.toplam_alacak > 0
      ? Math.round((ozet.toplam_gelir / (ozet.toplam_gelir + ozet.toplam_alacak)) * 100)
      : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-gray-400">Yükleniyor...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-100 text-red-600 p-4 rounded-2xl text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-6">

      {/* Üst Başlık */}
      <div className="bg-blue-600 text-white p-5 rounded-2xl shadow-md mt-2">
        <h2 className="text-lg font-bold flex items-center gap-2">
          <BarChart3 size={20} /> Finansal Raporlar
        </h2>
        <p className="text-xs text-blue-100 mt-1">Gelir, tahsilat ve alacak analizleri</p>
      </div>

      {/* Zaman Filtresi (Çipler) */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        <button className="whitespace-nowrap bg-blue-600 text-white px-5 py-2 rounded-xl text-xs font-bold shadow-sm">Bu Ay</button>
        <button className="whitespace-nowrap bg-white border border-gray-200 text-gray-600 px-5 py-2 rounded-xl text-xs font-medium shadow-sm">Geçen Ay</button>
        <button className="whitespace-nowrap bg-white border border-gray-200 text-gray-600 px-5 py-2 rounded-xl text-xs font-medium shadow-sm">Bu Yıl</button>
        <button className="whitespace-nowrap bg-white border border-gray-200 text-gray-600 px-5 py-2 rounded-xl text-xs font-medium shadow-sm flex items-center gap-1">
          <Calendar size={14} /> Tarih Seç
        </button>
      </div>

      {/* İstatistik Kartları Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
        {/* Toplam Gelir */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mb-2">
            <TrendingUp size={16} />
          </div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mb-1">Toplam Gelir</p>
          <p className="text-lg font-bold text-slate-800">{formatTL(ozet?.toplam_gelir ?? 0)}</p>
          <p className="text-[10px] text-gray-400 font-medium mt-1">Bu ay {ozet?.bu_ay_is_sayisi ?? 0} iş</p>
        </div>

        {/* Tamamlanan İş */}
        <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
          <div className="w-8 h-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center mb-2">
            <Wallet size={16} />
          </div>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mb-1">Tamamlanan İş</p>
          <p className="text-lg font-bold text-slate-800">{ozet?.tamamlanan_is_sayisi ?? 0}</p>
          <div className="w-full bg-gray-100 rounded-full h-1.5 mt-2">
            <div className="bg-green-500 h-1.5 rounded-full" style={{ width: `${tahsilatOrani}%` }}></div>
          </div>
        </div>

        {/* Bekleyen Alacak (Geniş Kart) */}
        <div className="col-span-2 bg-red-50 p-4 rounded-2xl shadow-sm border border-red-100 flex justify-between items-center">
          <div>
            <p className="text-[10px] text-red-600 font-bold uppercase tracking-wide mb-1">Tahsil Edilmeyen (Kalan Borç)</p>
            <p className="text-2xl font-bold text-red-600">{formatTL(ozet?.toplam_alacak ?? 0)}</p>
          </div>
          <div className="text-right flex items-center gap-2">
            <div className="w-8 h-8 bg-red-100 text-red-500 rounded-full flex items-center justify-center">
              <Users size={16} />
            </div>
            <div>
              <p className="text-xs font-bold text-red-500 mb-0.5">Borçlu Müşteri</p>
              <p className="text-lg font-bold text-slate-800">{dashboard?.borclu_musteri_sayisi ?? 0} Kişi</p>
            </div>
          </div>
        </div>

        {/* İş Durumu (Geniş Kart) */}
        <div className="col-span-2 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex justify-around text-center">
          <div>
            <p className="text-lg font-bold text-slate-800">{ozet?.bekleyen_is_sayisi ?? 0}</p>
            <p className="text-[10px] text-gray-500 font-medium">Bekliyor</p>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800">{ozet?.devam_eden_is_sayisi ?? 0}</p>
            <p className="text-[10px] text-gray-500 font-medium">Devam Ediyor</p>
          </div>
          <div>
            <p className="text-lg font-bold text-slate-800">{ozet?.tamamlanan_is_sayisi ?? 0}</p>
            <p className="text-[10px] text-gray-500 font-medium">Tamamlandı</p>
          </div>
        </div>
      </div>

      {/* Dışa Aktarma Butonları */}
      <div>
        <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-3 pl-1">Raporu Dışa Aktar</h3>
        <div className="flex gap-3">
          <button className="flex-1 bg-white border border-gray-200 text-slate-700 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:bg-gray-50 transition-colors">
            <FileSpreadsheet size={16} className="text-green-600" /> Excel İndir
          </button>
          <button className="flex-1 bg-white border border-gray-200 text-slate-700 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 shadow-sm active:bg-gray-50 transition-colors">
            <FileText size={16} className="text-red-500" /> PDF İndir
          </button>
        </div>
      </div>

    </div>
  );
}
