'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { User, Mail, Phone, Lock, UserPlus, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { api } from '../lib/api'; // Yolunu klasör yapına göre ayarlayabilirsin (örn: '@/lib/api')

export default function RegisterPage() {
  const router = useRouter();

  // --- FORM STATELERİ ---
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [agreed, setAgreed] = useState(false);

  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- KAYIT İŞLEMİ ---
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault(); // Sayfa yenilenmesini engelle
    setError(null);

    // Temel Doğrulamalar
    if (!fullName || !phone || !email || !password) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    if (!agreed) {
      setError('Kayıt olmak için kullanım koşullarını kabul etmelisiniz.');
      return;
    }

    setIsLoading(true);

    try {
      const response = await api.auth.register({
        ad_soyad: fullName,
        telefon: phone,
        email: email,
        password: password,
      });

      if (typeof window !== 'undefined' && response?.access) {
        localStorage.setItem('access_token', response.access);
        if (response.refresh) localStorage.setItem('refresh_token', response.refresh);
      }

      router.push('/dashboard');
      
    } catch (err: any) {
      setError(err.message || 'Kayıt olurken bir hata oluştu. Bilgilerinizi kontrol edip tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center px-4 pb-10 max-w-md mx-auto w-full">
      
      {/* Başlık Alanı */}
      <div className="mb-8 mt-6">
        <h1 className="text-2xl font-bold text-slate-800">Hesap Oluştur</h1>
        <p className="text-sm text-gray-500 mt-2">14 Günlük ücretsiz denemenizi hemen başlatın. Kredi kartı gerekmez.</p>
      </div>

      {/* Kayıt Formu (onSubmit ile bağlandı) */}
      <form onSubmit={handleRegister} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
        
        {/* Hata Mesajı Alanı */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 font-medium">
            {error}
          </div>
        )}

        {/* Ad Soyad */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5 pl-1">Ad Soyad</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <User size={16} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              disabled={isLoading}
              placeholder="Adınız Soyadınız" 
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        {/* Telefon */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5 pl-1">Telefon Numarası</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Phone size={16} className="text-gray-400" />
            </div>
            <input 
              type="tel" 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={isLoading}
              placeholder="05XX XXX XX XX" 
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        {/* E-posta */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5 pl-1">E-Posta</label>
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
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        {/* Şifre */}
        <div>
          <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5 pl-1">Şifre Belirleyin</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock size={16} className="text-gray-400" />
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={isLoading}
              placeholder="En az 6 karakter" 
              className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        {/* Sözleşme Onayı */}
        <div className="pt-2">
          <label className="flex items-start gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              disabled={isLoading}
              className="w-4 h-4 mt-0.5 rounded border-gray-300 text-blue-600 focus:ring-blue-500 disabled:opacity-50" 
            />
            <span className="text-[11px] font-medium text-gray-500 leading-tight">
              <Link href="/terms" className="text-blue-600 font-bold underline decoration-blue-200 underline-offset-2">Kullanım Koşulları</Link>'nı ve <Link href="/privacy" className="text-blue-600 font-bold underline decoration-blue-200 underline-offset-2">Gizlilik Politikası</Link>'nı okudum, kabul ediyorum.
            </span>
          </label>
        </div>

        {/* Kayıt Butonu */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:bg-blue-700 transition-colors mt-2 disabled:bg-blue-400"
        >
          {isLoading ? (
            <>
              Kaydediliyor <Loader2 size={18} className="animate-spin" />
            </>
          ) : (
            <>
              14 Gün Ücretsiz Başla <UserPlus size={18} />
            </>
          )}
        </button>
      </form>

      {/* Giriş Yönlendirmesi */}
      <div className="text-center mt-6">
        <p className="text-sm text-gray-600">
          Zaten hesabınız var mı?{' '}
          <Link href="/login" className="font-bold text-blue-600 inline-flex items-center gap-1">
            Giriş Yapın <ArrowRight size={14} />
          </Link>
        </p>
      </div>

    </div>
  );
}