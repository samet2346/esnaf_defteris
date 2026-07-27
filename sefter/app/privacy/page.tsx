'use client';

import { ArrowLeft, ShieldCheck } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      
      {/* Üst Bar */}
      <header className="bg-white px-4 py-4 flex items-center shadow-sm sticky top-0 z-50">
        <Link href="/" className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center active:bg-gray-100 mr-3">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-bold text-slate-800">Gizlilik Politikası</h1>
      </header>

      {/* İçerik */}
      <div className="px-4 mt-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mb-2">
            <ShieldCheck size={24} />
          </div>
          
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-2">1. Veri Toplama</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Defter uygulaması, hizmetleri sağlayabilmek için adınız, e-posta adresiniz ve telefon numaranız gibi temel iletişim bilgilerinizi toplar. Eklediğiniz müşteri verileri tamamen sizin kontrolünüzdedir.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-800 mb-2">2. Veri Güvenliği</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Tüm verileriniz modern şifreleme standartlarıyla korunarak bulut sunucularımızda güvenle saklanmaktadır. Verilerinizi üçüncü şahıslarla veya kurumlarla kesinlikle paylaşmıyor, satmıyoruz.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-800 mb-2">3. Çerezler (Cookies)</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Sisteme giriş yaptığınızda oturumunuzu açık tutmak ve size daha iyi bir deneyim sunmak için temel düzeyde çerezler kullanmaktayız.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-800 mb-2">4. İletişim</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Gizlilik politikamızla ilgili tüm sorularınız için bizimle <Link href="/contact" className="text-blue-600 font-bold">iletişim sayfası</Link> üzerinden irtibata geçebilirsiniz.
            </p>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <p className="text-xs text-gray-400">Son Güncelleme: Temmuz 2026</p>
          </div>
        </div>
      </div>

    </div>
  );
}