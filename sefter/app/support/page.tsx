'use client';

import { ArrowLeft, MessageCircle, Mail, Bug, Lightbulb, HelpCircle, ShieldAlert, ChevronRight } from 'lucide-react';
import Link from 'next/link';

export default function SupportPage() {
  return (
    <div className="space-y-5 pb-6">
      
      {/* Üst Bar / Geri Butonu */}
      <div className="flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-100 mt-2">
        <Link href="/profile" className="w-10 h-10 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center active:bg-gray-100">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h2 className="text-sm font-bold text-slate-800">Destek ve İletişim</h2>
        </div>
      </div>

      {/* Karşılama Kartı */}
      <div className="bg-blue-600 p-6 rounded-2xl shadow-md text-white text-center">
        <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3 backdrop-blur-sm">
          <HelpCircle size={32} className="text-white" />
        </div>
        <h3 className="text-lg font-bold">Size nasıl yardımcı olabiliriz?</h3>
        <p className="text-xs text-blue-100 mt-1">Soru, görüş ve önerileriniz bizim için değerli.</p>
      </div>

      {/* İletişim Kanalları */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Doğrudan İletişim</h3>
        </div>
        
        <button className="w-full p-4 border-b border-gray-50 flex items-center justify-between active:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
              <MessageCircle size={20} />
            </div>
            <div className="text-left">
              <span className="block text-sm font-bold text-slate-800">WhatsApp Destek</span>
              <span className="block text-[10px] text-gray-500 mt-0.5">En hızlı çözüm kanalı (09:00 - 18:00)</span>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>

        <button className="w-full p-4 flex items-center justify-between active:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
              <Mail size={20} />
            </div>
            <div className="text-left">
              <span className="block text-sm font-bold text-slate-800">E-Posta Gönder</span>
              <span className="block text-[10px] text-gray-500 mt-0.5">destek@defter.com</span>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
      </div>

      {/* Geri Bildirim */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
          <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Geri Bildirim</h3>
        </div>
        
        <button className="w-full p-4 border-b border-gray-50 flex items-center justify-between active:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
              <Bug size={20} />
            </div>
            <div className="text-left">
              <span className="block text-sm font-bold text-slate-800">Sorun Bildir</span>
              <span className="block text-[10px] text-gray-500 mt-0.5">Sistemde bir hata mı buldunuz?</span>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>

        <button className="w-full p-4 flex items-center justify-between active:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center">
              <Lightbulb size={20} />
            </div>
            <div className="text-left">
              <span className="block text-sm font-bold text-slate-800">Özellik Öner</span>
              <span className="block text-[10px] text-gray-500 mt-0.5">Uygulamada ne görmek istersiniz?</span>
            </div>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
      </div>

      {/* Yasal & SSS */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <button className="w-full p-4 border-b border-gray-50 flex items-center justify-between active:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center">
              <HelpCircle size={16} />
            </div>
            <span className="text-sm font-medium text-slate-800">Sık Sorulan Sorular</span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
        <button className="w-full p-4 flex items-center justify-between active:bg-gray-50 transition-colors">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gray-50 text-gray-600 rounded-full flex items-center justify-center">
              <ShieldAlert size={16} />
            </div>
            <span className="text-sm font-medium text-slate-800">Gizlilik ve Kullanım Koşulları</span>
          </div>
          <ChevronRight size={18} className="text-gray-400" />
        </button>
      </div>

    </div>
  );
}