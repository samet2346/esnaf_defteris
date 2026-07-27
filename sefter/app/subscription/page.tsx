'use client';

import { useEffect, useState } from 'react';
import { CreditCard, CheckCircle2, Clock, History, AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { api } from '../lib/api';
import type { AbonelikDurum, OdemeKaydi } from '../types/api';

const DURUM_LABEL: Record<string, string> = {
  deneme: 'Deneme Sürümü',
  aktif: 'Aktif Abonelik',
  pasif: 'Pasif',
  suresi_doldu: 'Süresi Doldu',
  iptal: 'İptal Edildi',
};

export default function SubscriptionPage() {
  const [status, setStatus] = useState<AbonelikDurum | null>(null);
  const [history, setHistory] = useState<OdemeKaydi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const load = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [durum, gecmis] = await Promise.all([
        api.billing.getStatus(),
        api.billing.getPaymentHistory(),
      ]);
      setStatus(durum);
      setHistory(gecmis?.gecmis || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Abonelik bilgileri yüklenemedi.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const remainingTrialDays = () => {
    if (!status?.deneme_bitis) return null;
    const end = new Date(status.deneme_bitis).getTime();
    const days = Math.ceil((end - Date.now()) / (1000 * 60 * 60 * 24));
    return Math.max(0, days);
  };

  const handleSubscribe = async (plan: 'aylik' | 'yillik') => {
    try {
      setActionLoading(true);
      setMessage(null);
      setError(null);
      const res = await api.billing.requestPayment(plan);
      setMessage(res.mesaj || 'Ödeme talebiniz alındı.');
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Ödeme talebi oluşturulamadı.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!window.confirm('Aboneliğinizi iptal etmek istediğinize emin misiniz?')) return;
    try {
      setActionLoading(true);
      setError(null);
      const res = await api.billing.cancel();
      setMessage(res.mesaj || 'Abonelik iptal edildi.');
      await load();
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'İptal işlemi başarısız.');
    } finally {
      setActionLoading(false);
    }
  };

  const trialDays = remainingTrialDays();

  return (
    <div className="space-y-5 pb-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mt-2">
        <Link href="/profile" className="touch-target w-11 h-11 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center active:bg-gray-100">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-sm font-bold text-slate-800">Abonelik Yönetimi</h2>
        </div>
      </div>

      {isLoading && (
        <div className="flex flex-col items-center py-12 text-blue-600">
          <Loader2 className="animate-spin mb-2" />
          <p className="text-sm text-gray-500">Abonelik yükleniyor...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 font-medium">{error}</div>
      )}
      {message && (
        <div className="bg-green-50 text-green-700 text-sm p-4 rounded-xl border border-green-100 font-medium">{message}</div>
      )}

      {!isLoading && status && (
        <>
          <div className="bg-linear-to-br from-blue-600 to-blue-800 p-6 rounded-2xl shadow-md text-white relative overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-white rounded-full opacity-10"></div>
            <div className="relative z-10 flex justify-between items-start mb-6">
              <div>
                <span className="bg-blue-500/50 text-blue-100 text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider">
                  Mevcut Plan
                </span>
                <h3 className="text-2xl font-bold mt-2">{DURUM_LABEL[status.durum] || status.durum}</h3>
                {status.plan && <p className="text-sm text-blue-100 mt-1">Plan: {status.plan === 'yillik' ? 'Yıllık' : 'Aylık'}</p>}
              </div>
              <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <CreditCard size={24} className="text-white" />
              </div>
            </div>

            {status.durum === 'deneme' && trialDays !== null && (
              <div className="relative z-10 bg-black/10 rounded-xl p-4 backdrop-blur-sm border border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-orange-500 rounded-full flex items-center justify-center text-white shadow-sm">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] text-blue-100 font-medium uppercase tracking-wide">Kalan Deneme Süresi</p>
                    <p className="text-lg font-bold">{trialDays} Gün Kaldı</p>
                  </div>
                </div>
              </div>
            )}

            {status.bekleyen_odeme_var_mi && (
              <p className="relative z-10 mt-4 text-xs text-blue-100 bg-black/20 rounded-lg p-3">
                Bekleyen bir ödeme talebiniz var. Onay sonrası aboneliğiniz aktifleşecektir.
              </p>
            )}
          </div>

          <div className="bg-white p-5 rounded-2xl shadow-sm border border-blue-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-sm font-bold text-slate-800">Defter PRO Planı</h3>
              <span className="text-lg font-bold text-blue-600">109 ₺ <span className="text-[10px] text-gray-400 font-normal">/ ay</span></span>
            </div>

            <ul className="space-y-3 mb-6">
              <li className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <CheckCircle2 size={16} className="text-green-500" /> Sınırsız Müşteri ve İş Kaydı
              </li>
              <li className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <CheckCircle2 size={16} className="text-green-500" /> Borç ve Tahsilat Takibi
              </li>
              <li className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <CheckCircle2 size={16} className="text-green-500" /> WhatsApp ve Arama Entegrasyonu
              </li>
              <li className="flex items-center gap-2 text-xs font-medium text-slate-700">
                <CheckCircle2 size={16} className="text-green-500" /> Bulut Yedekleme (Güvenli Veri)
              </li>
            </ul>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                disabled={actionLoading}
                onClick={() => handleSubscribe('aylik')}
                className="touch-target w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:bg-blue-700 transition-colors disabled:opacity-60"
              >
                <CreditCard size={18} /> Aylık Abone Ol
              </button>
              <button
                disabled={actionLoading}
                onClick={() => handleSubscribe('yillik')}
                className="touch-target w-full bg-slate-800 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 active:bg-slate-900 transition-colors disabled:opacity-60"
              >
                Yıllık (999 ₺)
              </button>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100 flex items-center gap-2">
              <History size={16} className="text-gray-500" />
              <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Ödeme Geçmişi</h3>
            </div>

            {history.length === 0 ? (
              <div className="p-8 text-center flex flex-col items-center justify-center">
                <div className="w-12 h-12 bg-gray-50 text-gray-300 rounded-full flex items-center justify-center mb-3">
                  <History size={24} />
                </div>
                <p className="text-sm font-medium text-slate-800">Henüz ödeme geçmişi yok</p>
                <p className="text-xs text-gray-400 mt-1">İlk ödemenizden sonra faturalarınız burada görünecektir.</p>
              </div>
            ) : (
              <ul className="divide-y divide-gray-50">
                {history.map((item) => (
                  <li key={item.id} className="px-4 py-3 flex justify-between items-center gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{item.plan_tipi === 'yillik' ? 'Yıllık' : 'Aylık'} — {item.tutar} ₺</p>
                      <p className="text-[10px] text-gray-400">{new Date(item.islem_tarihi).toLocaleString('tr-TR')}</p>
                    </div>
                    <span className="text-[10px] font-bold uppercase text-blue-600 bg-blue-50 px-2 py-1 rounded">{item.durum}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {status.durum === 'aktif' && (
            <button
              disabled={actionLoading}
              onClick={handleCancel}
              className="touch-target w-full bg-white border border-red-100 text-red-500 font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm active:bg-red-50 transition-colors disabled:opacity-60"
            >
              <AlertTriangle size={18} /> Aboneliği İptal Et
            </button>
          )}
        </>
      )}
    </div>
  );
}
