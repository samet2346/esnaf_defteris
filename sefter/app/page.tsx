'use client';

import { ArrowRight, CheckCircle2, Smartphone, Cloud, Wallet, ChevronRight, HelpCircle } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-20">
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="app-shell px-4 py-3 md:py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-blue-600 rounded-lg flex items-center justify-center text-white font-bold text-lg">
              D
            </div>
            <span className="text-xl md:text-2xl font-bold text-slate-800 tracking-wide">DEFTER</span>
          </div>
          <div className="flex items-center gap-2 md:gap-3">
            <Link
              href="/register"
              className="hidden sm:inline-flex touch-target items-center px-4 text-sm font-bold text-slate-600 hover:text-blue-600"
            >
              Kayıt Ol
            </Link>
            <Link
              href="/login"
              className="touch-target inline-flex items-center text-sm font-bold text-blue-600 bg-blue-50 px-4 rounded-xl"
            >
              Giriş Yap
            </Link>
          </div>
        </div>
      </header>

      {/* Hero: mobil tek kolon, desktop iki kolon */}
      <section className="app-shell px-4 pt-10 md:pt-16 pb-8 md:pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-14 items-center">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-wider mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Küçük İşletmeler İçin
            </div>

            <h1 className="heading-hero font-extrabold text-slate-800 mb-4">
              Müşteri ve Borç Takibinin <span className="text-blue-600">En Kolay Yolu</span>
            </h1>

            <p className="body-copy text-gray-500 mb-8 leading-relaxed max-w-xl mx-auto lg:mx-0">
              Ajandaları ve karmaşık Excel dosyalarını çöpe atın. İşlerinizi, müşterilerinizi ve alacaklarınızı cebinizden saniyeler içinde yönetin.
            </p>

            <div className="space-y-3 max-w-md mx-auto lg:mx-0">
              <Link
                href="/register"
                className="w-full touch-target bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:bg-blue-700 transition-colors"
              >
                14 Gün Ücretsiz Dene <ArrowRight size={18} />
              </Link>
              <p className="text-[10px] md:text-xs text-gray-400 font-medium">Kredi kartı gerekmez. İptal etmesi kolay.</p>
            </div>
          </div>

          <div className="w-full max-w-lg mx-auto">
            <div className="w-full h-64 md:h-80 bg-linear-to-tr from-blue-600 to-blue-400 rounded-3xl shadow-xl p-4 flex items-end justify-center overflow-hidden relative">
              <div className="absolute top-4 left-4 right-4 bg-white/20 backdrop-blur-md rounded-xl h-20 border border-white/30"></div>
              <div className="absolute top-28 left-4 right-4 bg-white/20 backdrop-blur-md rounded-xl h-20 border border-white/30"></div>
              <div className="w-48 h-56 bg-white rounded-t-3xl shadow-2xl border-4 border-b-0 border-slate-800 relative z-10 flex flex-col items-center pt-4 px-2">
                <div className="w-16 h-1 bg-gray-200 rounded-full mb-4"></div>
                <div className="w-full h-8 bg-blue-50 rounded-lg mb-2"></div>
                <div className="w-full h-8 bg-gray-50 rounded-lg mb-2"></div>
                <div className="w-full h-8 bg-gray-50 rounded-lg"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="app-shell px-4 py-10 md:py-14">
          <h2 className="heading-section font-bold text-center text-slate-800 mb-8 md:mb-10">Neden Defter?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            <div className="flex md:flex-col gap-4 md:text-center">
              <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0 md:mx-auto">
                <Smartphone size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Mobile First Tasarım</h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">Sahadayken bile iş ekleyin, fotoğraf çekin ve müşteriyi tek tıkla WhatsApp&apos;tan arayın.</p>
              </div>
            </div>
            <div className="flex md:flex-col gap-4 md:text-center">
              <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center shrink-0 md:mx-auto">
                <Wallet size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Kolay Borç Takibi</h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">Kimin ne kadar borcu kaldığını saniyeler içinde görün, ödemeleri kısmi olarak tahsil edin.</p>
              </div>
            </div>
            <div className="flex md:flex-col gap-4 md:text-center">
              <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center shrink-0 md:mx-auto">
                <Cloud size={24} />
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800 mb-1">Bulut Yedekleme</h3>
                <p className="text-xs md:text-sm text-gray-500 leading-relaxed">Telefonunuz bozulsa bile verileriniz kaybolmaz. İstediğiniz an Excel veya PDF olarak indirin.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="app-shell px-4 py-10 md:py-14">
        <div className="max-w-xl mx-auto bg-slate-800 rounded-3xl p-6 md:p-8 text-white text-center shadow-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full opacity-20 blur-2xl"></div>
          <div className="absolute bottom-0 left-0 w-32 h-32 bg-purple-500 rounded-full opacity-20 blur-2xl"></div>
          <h2 className="heading-section font-bold relative z-10 mb-2">Basit ve Tek Fiyat</h2>
          <p className="text-xs md:text-sm text-gray-400 relative z-10 mb-6">Gizli ücret, sürpriz limit yok.</p>
          <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6 relative z-10 mb-6">
            <div className="text-4xl font-extrabold mb-1">105 ₺<span className="text-sm font-medium text-gray-300">/ay</span></div>
            <p className="text-[10px] text-green-400 font-bold uppercase tracking-wider mb-4">İlk 14 Gün Ücretsiz</p>
            <ul className="space-y-3 text-left">
              <li className="flex items-center gap-2 text-xs md:text-sm font-medium"><CheckCircle2 size={16} className="text-blue-400" /> Sınırsız Müşteri Kaydı</li>
              <li className="flex items-center gap-2 text-xs md:text-sm font-medium"><CheckCircle2 size={16} className="text-blue-400" /> Sınırsız İş ve Fotoğraf</li>
              <li className="flex items-center gap-2 text-xs md:text-sm font-medium"><CheckCircle2 size={16} className="text-blue-400" /> Gelişmiş Raporlar</li>
              <li className="flex items-center gap-2 text-xs md:text-sm font-medium"><CheckCircle2 size={16} className="text-blue-400" /> WhatsApp Destek</li>
            </ul>
          </div>
          <Link href="/register" className="w-full touch-target bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-colors relative z-10">
            Hemen Başlayın <ChevronRight size={18} />
          </Link>
        </div>
      </section>

      <section className="bg-white">
        <div className="app-shell px-4 py-10 md:py-14">
          <h2 className="heading-section font-bold text-center text-slate-800 mb-6 flex items-center justify-center gap-2">
            <HelpCircle size={24} className="text-blue-500" /> Sık Sorulan Sorular
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4 max-w-5xl mx-auto">
            <div className="bg-slate-50 p-4 md:p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800">Verilerim güvende mi?</h3>
              <p className="text-xs md:text-sm text-gray-500 mt-2">Evet, tüm verileriniz bulut sunucularımızda şifrelenerek saklanır ve günlük yedeklenir.</p>
            </div>
            <div className="bg-slate-50 p-4 md:p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800">İstediğim zaman iptal edebilir miyim?</h3>
              <p className="text-xs md:text-sm text-gray-500 mt-2">Evet, Profil &gt; Abonelik menüsünden hiçbir taahhüt olmadan tek tuşla iptal edebilirsiniz.</p>
            </div>
            <div className="bg-slate-50 p-4 md:p-5 rounded-xl border border-gray-100 shadow-sm">
              <h3 className="text-sm font-bold text-slate-800">Deneme süresi için kart gerekli mi?</h3>
              <p className="text-xs md:text-sm text-gray-500 mt-2">Hayır, 14 gün boyunca kredi kartı bilgisi girmeden sistemi tam sürüm olarak deneyebilirsiniz.</p>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-gray-200 bg-slate-50">
        <div className="app-shell px-4 py-8 text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-6 h-6 bg-slate-800 rounded-md flex items-center justify-center text-white font-bold text-[10px]">D</div>
            <span className="font-bold text-slate-800">DEFTER</span>
          </div>
          <div className="flex justify-center gap-4 text-xs md:text-sm font-medium text-gray-500 mb-6">
            <Link href="/privacy" className="touch-target inline-flex items-center">Gizlilik</Link>
            <Link href="/terms" className="touch-target inline-flex items-center">Koşullar</Link>
            <Link href="/contact" className="touch-target inline-flex items-center">İletişim</Link>
          </div>
          <p className="text-[10px] md:text-xs text-gray-400">© 2026 Defter App. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}