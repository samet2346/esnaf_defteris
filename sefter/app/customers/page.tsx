'use client';

import { useState, useEffect } from 'react';
import { Search, UserPlus, Phone, MoreVertical, Loader2, AlertCircle, Users } from 'lucide-react';
import Link from 'next/link';
import { api } from '../lib/api'; // API yolunu kendi klasör yapına göre ayarla (örn: '@/lib/api')

// API'den gelecek veri tipi (DRF snake_case formatına karşı esnek yapıda)
interface Customer {
  id: string | number;
  ad_soyad: string;
  telefon: string;
  kalan_borc: number;
  son_islem_tarihi?: string;
}

export default function CustomersPage() {
  // --- STATELER ---
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [searchQuery, setSearchQuery] = useState('');

  // --- API'DEN VERİ ÇEKME ---
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Müşterileri DRF backend'inden çekiyoruz
        const data = await api.customers.getAll();
        setCustomers(data);
        
      } catch (err: any) {
        setError(err.message || 'Müşteri listesi yüklenirken bir bağlantı hatası oluştu.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  // --- İSİMDEN BAŞ HARF BULMA YARDIMCISI ---
  const getInitials = (name: string) => {
    if (!name) return 'M'; // İsim yoksa varsayılan 'M' harfi
    return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
  };

  // --- ARAMA FİLTRESİ ---
  const filteredCustomers = customers.filter((customer) => {
    const cName = customer.ad_soyad || '';
    const cPhone = customer.telefon || '';
    return cName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           cPhone.includes(searchQuery);
  });

  return (
    <div className="space-y-4 pb-6 relative">
      
      {/* Üst Başlık ve Yeni Müşteri Butonu */}
      <div className="flex items-center justify-between bg-blue-600 text-white p-4 rounded-2xl shadow-md mt-2">
        <div>
          <h2 className="text-lg font-bold">Müşteriler</h2>
          <p className="text-xs text-blue-100">
            {isLoading ? 'Yükleniyor...' : `Toplam ${customers.length} Kayıtlı Müşteri`}
          </p>
        </div>
        <Link href="/customers/new" className="bg-white text-blue-600 p-2 rounded-xl flex items-center justify-center shadow-sm active:bg-gray-100 transition-colors">
          <UserPlus size={20} />
        </Link>
      </div>

      {/* Arama Alanı */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search size={18} className="text-gray-400" />
        </div>
        <input 
          type="text" 
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={isLoading || !!error}
          placeholder="İsim veya telefon ile ara..." 
          className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 shadow-sm disabled:opacity-50"
        />
      </div>

      {/* İçerik Alanı: Yükleniyor / Hata / Liste */}
      <div className="space-y-3 min-h-[50vh]">
        
        {/* Durum 1: Yükleniyor */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-20 text-blue-600">
            <Loader2 size={40} className="animate-spin mb-4" />
            <p className="text-sm font-medium text-gray-500">Müşterileriniz getiriliyor...</p>
          </div>
        )}

        {/* Durum 2: Hata */}
        {!isLoading && error && (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mb-4">
              <AlertCircle size={32} />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-2">Bağlantı Hatası</h3>
            <p className="text-xs text-gray-500 mb-6">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="bg-white border border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-bold shadow-sm active:bg-gray-50"
            >
              Tekrar Dene
            </button>
          </div>
        )}

        {/* Durum 3: Veriler Listeleniyor */}
        {!isLoading && !error && filteredCustomers.length > 0 && (
          filteredCustomers.map((customer) => {
            // DRF'den gelebilecek veri formatlarını güvenli eşleştirme
            const cName = customer.ad_soyad || 'İsimsiz Müşteri';
            const cPhone = customer.telefon || 'Belirtilmedi';
            const debt = Number(customer.kalan_borc) || 0;
            const lastJob = customer.son_islem_tarihi ? new Date(customer.son_islem_tarihi).toLocaleDateString('tr-TR') : '';

            return (
              <div key={customer.id} className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between active:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center font-bold text-sm shrink-0">
                    {getInitials(cName)}
                  </div>
                  <div>
                    <Link href={`/customers/${customer.id}`} className="text-sm font-bold text-slate-800 hover:text-blue-600 line-clamp-1">
                      {cName}
                    </Link>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
                      <Phone size={10} /> {cPhone}
                    </div>
                  </div>
                </div>
                <div className="text-right flex items-center gap-3 shrink-0">
                  <div>
                    {debt > 0 ? (
                      <>
                        <p className="text-xs text-gray-500 mb-0.5">Kalan Borç</p>
                        <p className="text-sm font-bold text-red-500">{debt.toLocaleString('tr-TR')} ₺</p>
                      </>
                    ) : lastJob ? (
                      <>
                        <p className="text-xs text-gray-500 mb-0.5">Son İş</p>
                        <p className="text-sm font-medium text-slate-700">{lastJob}</p>
                      </>
                    ) : (
                      <>
                        <p className="text-xs text-gray-500 mb-0.5">Durum</p>
                        <p className="text-sm font-medium text-green-600">Borcu Yok</p>
                      </>
                    )}
                  </div>
                  <button className="text-gray-400 hover:text-blue-600 p-1 rounded-full active:bg-blue-50">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            );
          })
        )}

        {/* Durum 4: Aramaya Uygun Müşteri Yok */}
        {!isLoading && !error && customers.length > 0 && filteredCustomers.length === 0 && (
          <div className="text-center py-10">
            <p className="text-sm text-gray-500">Bu aramaya uygun müşteri bulunamadı.</p>
          </div>
        )}

        {/* Durum 5: Hiç Müşteri Yok */}
        {!isLoading && !error && customers.length === 0 && (
          <div className="text-center py-16">
            <div className="w-16 h-16 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users size={32} />
            </div>
            <h3 className="text-sm font-bold text-slate-800 mb-2">Müşteri Listeniz Boş</h3>
            <p className="text-xs text-gray-500 mb-6">Sisteme hemen ilk müşterinizi ekleyerek takibe başlayın.</p>
            <Link href="/customers/new" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-sm shadow-blue-200 active:bg-blue-700">
              <UserPlus size={18} /> Yeni Müşteri Ekle
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}