'use client';

import { useState } from 'react';
import { User, Phone, Mail, MapPin, Save, X, Loader2, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../../lib/api'; // API dosyasının yolu, klasör yapına göre düzeltmeyi unutma (örn: '@/lib/api')

export default function NewCustomerPage() {
  const router = useRouter();

  // --- FORM STATELERİ ---
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');

  // --- API VE UI DURUMLARI ---
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- KAYDETME İŞLEMİ ---
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault(); // Formun sayfayı yenilemesini engelle
    
    // Basit Doğrulama
    if (!fullName || !phone) {
      setError('Lütfen Müşteri Adı ve Telefon Numarası alanlarını doldurun.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);

      // DRF Backend'in beklediği payload (isim, telefon vb.)
      const payload = {
        ad_soyad: fullName,
        telefon: phone,
        adres: address,
      };

      // API'ye POST İsteği
      await api.customers.create(payload);

      // Başarılıysa listeye yönlendir
      alert('Müşteri başarıyla kaydedildi!');
      router.push('/customers');

    } catch (err: any) {
      setError(err.message || 'Müşteri kaydedilirken sunucu kaynaklı bir hata oluştu.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 pb-6 relative">
      
      {/* Üst Başlık */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mt-2">
        <div>
          <h2 className="text-lg font-bold text-slate-800">Yeni Müşteri Ekle</h2>
          <p className="text-xs text-gray-500">Sisteme yeni bir cari hesap tanımlayın</p>
        </div>
        <Link href="/customers" className="w-10 h-10 bg-gray-50 text-gray-500 rounded-full flex items-center justify-center active:bg-gray-100 transition-colors">
          <X size={20} />
        </Link>
      </div>

      {/* Hata Mesajı Alanı */}
      {error && (
        <div className="bg-red-50 text-red-600 text-sm p-4 rounded-xl border border-red-100 font-medium flex items-center gap-2">
          <AlertCircle size={18} className="shrink-0" /> {error}
        </div>
      )}

      {/* Kayıt Formu */}
      <form onSubmit={handleSave} className="space-y-4">
        
        {/* Temel Bilgiler */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-sm font-bold text-blue-600 flex items-center gap-2 border-b border-gray-50 pb-3">
            <User size={18} /> Temel Bilgiler
          </h3>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Ad Soyad / Firma Adı *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <User size={16} className="text-gray-400" />
              </div>
              <input 
                type="text" 
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isSubmitting}
                placeholder="Örn: Ahmet Yılmaz" 
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Telefon Numarası *</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Phone size={16} className="text-gray-400" />
              </div>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isSubmitting}
                placeholder="Örn: 0555 123 45 67" 
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors disabled:opacity-50"
              />
            </div>
          </div>
        </div>

        {/* İletişim Detayları */}
        <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100 space-y-4">
          <h3 className="text-sm font-bold text-blue-600 flex items-center gap-2 border-b border-gray-50 pb-3">
            <MapPin size={18} /> İletişim Detayları
          </h3>
          
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">E-Posta (İsteğe Bağlı)</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Mail size={16} className="text-gray-400" />
              </div>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                placeholder="ornek@mail.com" 
                className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors disabled:opacity-50"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1.5 ml-1">Açık Adres (İsteğe Bağlı)</label>
            <textarea 
              rows={3} 
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              disabled={isSubmitting}
              placeholder="Mahalle, sokak, bina no..." 
              className="w-full p-4 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors disabled:opacity-50 resize-none"
            ></textarea>
          </div>
        </div>

        {/* Aksiyon Butonları */}
        <div className="flex gap-3 pt-4 w-full">
          <Link href="/customers" className="w-1/3 bg-white border border-gray-200 text-gray-700 font-bold py-4 rounded-xl flex items-center justify-center shadow-sm active:bg-gray-50 transition-colors">
            Vazgeç
          </Link>
          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-2/3 bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:bg-blue-700 transition-colors disabled:bg-blue-400"
          >
            {isSubmitting ? (
              <>Kaydediliyor <Loader2 size={20} className="animate-spin" /></>
            ) : (
              <><Save size={20} /> Müşteriyi Kaydet</>
            )}
          </button>
        </div>
        
      </form>

    </div>
  );
}