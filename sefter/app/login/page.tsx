'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, LogIn, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { api } from '../lib/api'; // api.ts dosyasının yolu, klasör yapına göre gerekirse '@/app/lib/api' olarak değiştirebilirsin

export default function LoginPage() {
  const router = useRouter();
  
  // --- FORM STATELERİ ---
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // --- GİRİŞ İŞLEMİ ---
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault(); // Sayfanın yenilenmesini engeller
    setError(null);

    // Boş alan kontrolü
    if (!username || !password) {
      setError('Lütfen tüm alanları doldurun.');
      return;
    }

    setIsLoading(true);

    try {
      // API'ye istek atıyoruz (DRF genellikle kullanıcı adını 'username' alanında bekler)
      const response = await api.auth.login({ username, password });
      
      // Token'ları güvenli bir şekilde localStorage'a kaydediyoruz
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.access);
        if (response.refresh) {
          localStorage.setItem('refresh_token', response.refresh);
        }
      }

      // Giriş başarılı, ana sayfaya yönlendir
      router.push('/dashboard');
      
    } catch (err: any) {
      // API'den gelen hatayı veya varsayılan hatayı ekrana bas
      setError(err.message || 'Giriş yapılamadı. Bilgilerinizi kontrol edip tekrar deneyin.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex flex-col justify-center px-4 pb-10 max-w-md mx-auto w-full">
      
      {/* Logo ve Karşılama */}
      <div className="text-center mb-10 mt-8">
        <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue-200 transform rotate-3">
          <div className="w-10 h-10 bg-white rounded-lg transform -rotate-3 flex items-center justify-center">
            <span className="text-blue-600 font-bold text-xl">D</span>
          </div>
        </div>
        <h1 className="text-2xl font-bold text-slate-800">Tekrar Hoş Geldiniz</h1>
        <p className="text-sm text-gray-500 mt-2">İşlerinizi ve müşterilerinizi yönetmeye devam edin.</p>
      </div>

      {/* Giriş Formu (onSubmit ile handleLogin'e bağlandı) */}
      <form onSubmit={handleLogin} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-5">
        
        {/* Hata Mesajı Alanı */}
        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl border border-red-100 font-medium">
            {error}
          </div>
        )}

        {/* E-posta veya Telefon (Username) */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 pl-1">E-Posta / Telefon</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Mail size={18} className="text-gray-400" />
            </div>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="ornek@mail.com" 
              disabled={isLoading}
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        {/* Şifre */}
        <div>
          <label className="block text-xs font-bold text-gray-500 uppercase tracking-wide mb-2 pl-1">Şifre</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Lock size={18} className="text-gray-400" />
            </div>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              disabled={isLoading}
              className="w-full pl-11 pr-4 py-3.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:bg-white transition-colors disabled:opacity-50"
            />
          </div>
        </div>

        {/* Beni Hatırla & Şifremi Unuttum */}
        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <span className="text-xs font-medium text-gray-600">Beni Hatırla</span>
          </label>
          <Link href="/forgot-password" className="text-xs font-bold text-blue-600">
            Şifremi Unuttum
          </Link>
        </div>

        {/* Giriş Butonu */}
        <button 
          type="submit" 
          disabled={isLoading}
          className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:bg-blue-700 transition-colors mt-2 disabled:bg-blue-400"
        >
          {isLoading ? (
            <>
              Giriş Yapılıyor <Loader2 size={18} className="animate-spin" />
            </>
          ) : (
            <>
              Giriş Yap <LogIn size={18} />
            </>
          )}
        </button>
      </form>

      {/* Kayıt Ol Yönlendirmesi */}
      <div className="text-center mt-8">
        <p className="text-sm text-gray-600">
          Hesabınız yok mu?{' '}
          <Link href="/register" className="font-bold text-blue-600 inline-flex items-center gap-1">
            Hemen Kayıt Olun <ArrowRight size={14} />
          </Link>
        </p>
      </div>

    </div>
  );
}