'use client';

import { useState, useEffect } from 'react';
import { Search, Phone, MessageCircle, AlertCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { api } from '../lib/api';

interface Debtor {
  id: string | number;
  ad_soyad: string;
  telefon: string;
  kalan_borc: number;
  son_islem_tarihi?: string;
}

export default function DebtorsPage() {
  const [debtors, setDebtors] = useState<Debtor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchDebtors = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await api.dashboard.getDebtors();
        setDebtors(data || []);
      } catch (err: any) {
        setError(err.message || 'Borçlu listesi yüklenirken bir hata oluştu.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchDebtors();
  }, []);

  const filteredDebtors = debtors.filter((d) =>
    d.ad_soyad.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.telefon.includes(searchQuery)
  );

  const totalDebt = debtors.reduce((sum, d) => sum + (Number(d.kalan_borc) || 0), 0);

  const getInitials = (name: string) => {
    if (!name) return 'M';
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  const handleWhatsApp = (phone: string) => {
    const cleanPhone = phone.replace(/\D/g, '');
    window.open(`https://wa.me/90${cleanPhone}`, '_blank');
  };

  return (
    <div className="space-y-4 pb-6">

      <div className="bg-red-500 text-white p-5 rounded-2xl shadow-md mt-2 flex items-center justify-between relative overflow-hidden">
        <div className="absolute -top-6 -right-6 w-24 h-24 bg-red-400 rounded-full opacity-50"></div>

        <div className="relative z-10">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <AlertCircle size={20} /> Borçlular
          </h2>
          <p className="text-xs text-red-100 mt-1">{isLoading ? 'Yükleniyor...' : `${debtors.length} Borçlu Müşteri`}</p>
        </div>
        <div className="text-right relative z-10">
          <p className="text-[10px] text-red-100 font-medium">Toplam Alacak</p>
          <p className="text-2xl font-bold">{totalDebt.toLocaleString('tr-TR')} ₺</p>
        </div>
      </div>

      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isLoading}
          placeholder="İsim veya telefon ile ara..."
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 shadow-sm disabled:opacity-50"
        />
      </div>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-20 text-red-500">
          <Loader2 size={40} className="animate-spin mb-4" />
          <p className="text-sm font-medium text-gray-500">Borçlu listesi getiriliyor...</p>
        </div>
      )}

      {!isLoading && error && (
        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 font-medium">{error}</div>
      )}

      {!isLoading && !error && (
        <div className="space-y-4">
          {filteredDebtors.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm text-gray-500">
                {debtors.length === 0 ? 'Borçlu müşteri bulunmuyor.' : 'Bu aramaya uygun borçlu bulunamadı.'}
              </p>
            </div>
          ) : (
            filteredDebtors.map((debtor) => (
              <div key={debtor.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <Link href={`/customers/${debtor.id}`} className="p-4 border-b border-gray-50 flex justify-between items-start active:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-50 text-red-500 rounded-full flex items-center justify-center font-bold text-sm">
                      {getInitials(debtor.ad_soyad)}
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-800">{debtor.ad_soyad}</h3>
                      <p className="text-xs text-gray-500 mt-0.5">{debtor.telefon}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-gray-400 font-medium">Kalan Borç</p>
                    <p className="text-base font-bold text-red-500">{Number(debtor.kalan_borc).toLocaleString('tr-TR')} ₺</p>
                  </div>
                </Link>

                <div className="bg-gray-50/50 p-3 flex gap-2">
                  <button onClick={() => handleWhatsApp(debtor.telefon)} className="flex-1 bg-green-50 text-green-600 py-2 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-1 border border-green-100 shadow-sm active:bg-green-100">
                    <MessageCircle size={14} /> WhatsApp
                  </button>
                  <a href={`tel:${debtor.telefon}`} className="flex-1 bg-blue-50 text-blue-600 py-2 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-1 border border-blue-100 shadow-sm active:bg-blue-100">
                    <Phone size={14} /> Ara
                  </a>
                  <Link href={`/customers/${debtor.id}`} className="flex-1 bg-slate-800 text-white py-2 rounded-lg text-[10px] font-bold flex flex-col items-center justify-center gap-1 shadow-sm active:bg-slate-700">
                    Detaya Git
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}

    </div>
  );
}
