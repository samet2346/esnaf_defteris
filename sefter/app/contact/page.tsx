'use client';

import { ArrowLeft, Mail, Phone, MapPin, Send } from 'lucide-react';
import Link from 'next/link';

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      
      {/* Üst Bar */}
      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="app-shell px-4 py-4 flex items-center">
        <Link href="/" className="touch-target w-11 h-11 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center active:bg-gray-100 mr-3">
          <ArrowLeft size={20} />
        </Link>
        <h1 className="text-lg font-bold text-slate-800">İletişim</h1>
        </div>
      </header>

      <div className="app-shell px-4 mt-6 space-y-6 max-w-2xl mx-auto">
        
        {/* İletişim Bilgileri */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-5">
          <h2 className="text-base font-bold text-slate-800 mb-2">Bize Ulaşın</h2>
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
              <Mail size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">E-Posta</p>
              <p className="text-sm font-medium text-slate-800 mt-0.5">destek@defter.com</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center shrink-0">
              <Phone size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Telefon / WhatsApp</p>
              <p className="text-sm font-medium text-slate-800 mt-0.5">+90 850 123 45 67</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 text-orange-600 rounded-full flex items-center justify-center shrink-0">
              <MapPin size={18} />
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Adres</p>
              <p className="text-sm font-medium text-slate-800 mt-0.5">Teknoloji Geliştirme Bölgesi, İstanbul</p>
            </div>
          </div>
        </div>

        {/* İletişim Formu */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-4">
          <h2 className="text-base font-bold text-slate-800 mb-2">Mesaj Gönderin</h2>
          
          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5 pl-1">Adınız Soyadınız</label>
            <input type="text" placeholder="Ad Soyad" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white" />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5 pl-1">E-Posta Adresiniz</label>
            <input type="email" placeholder="ornek@mail.com" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white" />
          </div>

          <div>
            <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wide mb-1.5 pl-1">Mesajınız</label>
            <textarea rows={4} placeholder="Size nasıl yardımcı olabiliriz?" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:bg-white"></textarea>
          </div>

          <button className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-200 flex items-center justify-center gap-2 active:bg-blue-700 mt-2">
            Gönder <Send size={18} />
          </button>
        </div>

      </div>
    </div>
  );
}