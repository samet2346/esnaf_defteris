'use client';

import { ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      
      {/* Üst Bar */}
      <header className="bg-white px-4 py-4 flex items-center shadow-sm sticky top-0 z-50">
        <Link href="/" className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center active:bg-gray-100 mr-3">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-bold text-slate-800">Kullanım Koşulları</h1>
      </header>

      {/* İçerik */}
      <div className="px-4 mt-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center mb-2">
            <FileText size={24} />
          </div>
          
          <div>
            <h2 className="text-base font-bold text-slate-800 mb-2">1. Hizmetin Kapsamı</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Defter, küçük işletmeler ve serbest çalışanlar için müşteri, iş ve borç takibi imkanı sunan bulut tabanlı bir SaaS yazılımıdır.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-800 mb-2">2. Üyelik ve Abonelik</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Sisteme kayıt olan her kullanıcıya 14 günlük ücretsiz deneme hakkı sunulur. Deneme süresi bitiminde sistemi kullanmaya devam edebilmek için aylık 105 TL ücretle abonelik başlatılması gerekmektedir.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-800 mb-2">3. İptal ve İade</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Kullanıcılar aboneliklerini diledikleri zaman profil ayarları üzerinden iptal edebilirler. İptal edilen aboneliklerde, o ayın geri kalan günleri için kısmi ücret iadesi yapılmaz.
            </p>
          </div>

          <div>
            <h2 className="text-base font-bold text-slate-800 mb-2">4. Sorumluluk Reddi</h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              Uygulamaya girilen verilerin doğruluğu tamamen kullanıcının sorumluluğundadır. Sistemdeki anlık teknik arızalardan doğabilecek ticari kayıplardan Defter sorumlu tutulamaz.
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