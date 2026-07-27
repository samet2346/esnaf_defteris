'use client';

import { useState } from 'react';
import { Mail, ArrowLeft, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
// api.ts dosyasında auth nesnesi altına resetPassword metodunu eklemeyi unutma!
import { api } from '../lib/api'; 

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Sayfanın yenilenmesini engelle

    if (!email) {
      setStatus('error');
      setErrorMessage('Lütfen sisteme kayıtlı e-posta adresinizi girin.');
      return;
    }

    try {
      setIsLoading(true);
      setStatus('idle');
      
      // Backend'e şifre sıfırlama talebi gönder
      // Not: api.ts dosyanda `api.auth.resetPassword` tanımlı olmalıdır.
      // Örn: resetPassword: (data: { email: string }) => fetchAPI('/api/auth/reset-password/', { method: 'POST', body: JSON.stringify(data) })
      await api.auth.resetPassword({ email });

      // Başarılı olursa başarı ekranını göster
      setStatus('success');
      
    } catch (err: any) {
      setStatus('error');
      setErrorMessage(err.message || 'Bir hata oluştu. Lütfen e-posta adresinizi kontrol edip tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col px-4 pt-8 relative max-w-md mx-auto w-full">
      
      {/* Geri Dönüş Butonu */}
      <div className="mb-8">
        <Link href="/login" className="touch-target w-11 h-11 bg-white border border-gray-200 text-gray-600 rounded-full flex items-center justify-center shadow-sm active:bg-gray-50 transition-colors">
          <ArrowLeft size={20} />
        </Link>
      </div>

      {/* Başlık Alanı */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Şifrenizi mi Unuttunuz?</h1>
        <p className="text-sm text-gray-500 mt-2">Sistemde kayıtlı e-posta adresinizi girin. Talebiniz alındıktan sonra destek ekibi sizinle iletişime geçer.</p>
      </div>

      {/* Başarı Durumu */}
      {status === 'success' ? (
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 text-center space-y-4">
          <div className="w-16 h-16 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
            <CheckCircle2 size={32} />
          </div>
          <h2 className="text-lg font-bold text-slate-800">Talebiniz Alındı</h2>
          <p className="text-sm text-gray-500">
            <span className="font-bold text-slate-700">{email}</span> için şifre sıfırlama talebi kaydedildi. Kayıtlı bir hesap varsa destek ekibimiz sizinle iletişime geçecektir.
          </p>
          <Link href="/login" className="touch-target block w-full bg-gray-50 text-gray-700 font-bold py-4 rounded-xl mt-6 active:bg-gray-100 transition-colors">
            Giriş Ekranına Dön
          </Link>
        </div>
      ) : (
        /* Form Alanı */
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          
          {/* Hata Mesajı */}
          {status === 'error' && (
            <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 font-medium flex items-center gap-2">
              <AlertCircle size={18} className="shrink-0" /> {errorMessage}
            </div>
          )}

          {/* E-posta */}
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5 pl-1">Kayıtlı E-Posta Adresiniz</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={16} className="text-gray-400" />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                placeholder="ornek@mail.com" 
                className="w-full pl-11 pr-4 py-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          {/* Gönder Butonu */}
          <button 
            type="submit" 
            disabled={isLoading}
            className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {isLoading ? (
              <>Gönderiliyor <Loader2 size={18} className="animate-spin" /></>
            ) : (
              <>Sıfırlama Linki Gönder <Send size={18} /></>
            )}
          </button>
        </form>
      )}

    </div>
  );
}