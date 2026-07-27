'use client';

import { useState, useRef, useEffect } from 'react';
import { User, Key, Download, Upload, CreditCard, MessageCircle, ShieldAlert, LogOut, ChevronRight, X, CheckCircle2, Smartphone, Mail, Camera } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { api } from '../lib/api';

export default function ProfilePage() {
  const router = useRouter();

  // --- STATELER ---
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

  // Kullanıcı Bilgileri State'i
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userPhone, setUserPhone] = useState('');
  const [profileImage, setProfileImage] = useState<string | null>(null);

  // Şifre Değiştirme State'i
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordConfirm, setNewPasswordConfirm] = useState('');
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [isSavingProfile, setIsSavingProfile] = useState(false);

  useEffect(() => {
    api.auth.getProfile()
      .then((data: any) => {
        setUserName(data.ad_soyad || '');
        setUserEmail(data.email || '');
        setUserPhone(data.telefon || '');
      })
      .catch(() => {});
  }, []);

  // Dosya Seçici Referansları
  const fileInputRef = useRef<HTMLInputElement>(null);
  const profileImageRef = useRef<HTMLInputElement>(null);

  // --- AKSİYONLAR ---
  const handleSaveProfile = async () => {
    try {
      setIsSavingProfile(true);
      await api.auth.updateProfile({ ad_soyad: userName, telefon: userPhone, email: userEmail });
      setIsEditModalOpen(false);
      alert("Profil bilgileriniz başarıyla güncellendi!");
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Profil güncellenirken bir hata oluştu.");
    } finally {
      setIsSavingProfile(false);
    }
  };
  const handleSavePassword = async () => {
    setPasswordError(null);
    if (!oldPassword || !newPassword || !newPasswordConfirm) {
      setPasswordError("Lütfen tüm alanları doldurun.");
      return;
    }
    if (newPassword !== newPasswordConfirm) {
      setPasswordError("Yeni şifreler eşleşmiyor.");
      return;
    }
    try {
      await api.auth.changePassword({ old_password: oldPassword, new_password: newPassword });
      setIsPasswordModalOpen(false);
      setOldPassword("");
      setNewPassword("");
      setNewPasswordConfirm("");
      alert("Şifreniz başarıyla değiştirildi!");
    } catch (err: unknown) {
      setPasswordError(err instanceof Error ? err.message : "Şifre değiştirilirken bir hata oluştu.");
    }
  };

  const handleExportExcel = async () => {
    try {
      const blob = await api.auth.exportExcel();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'esnaf_defteri_verileri.xlsx';
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      alert(err.message || 'Excel dışa aktarılırken bir hata oluştu.');
    }
  };

  const handleImportExcel = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const result = await api.auth.importExcel(file);
      alert(result.detail || 'İçe aktarma tamamlandı.');
    } catch (err: any) {
      alert(err.message || 'Excel içe aktarılırken bir hata oluştu.');
    } finally {
      e.target.value = '';
    }
  };

  const handleLogout = () => {
    const confirmLogout = window.confirm('Hesabınızdan çıkış yapmak istediğinize emin misiniz?');
    if (confirmLogout) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
      }
      router.push('/login');
    }
  };

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  return (
    <div className="space-y-5 pb-6 relative">
      
      {/* Profil Başlığı */}
      <div className="bg-blue-600 text-white p-6 rounded-2xl shadow-md mt-2 flex items-center gap-4">
        
        {/* Profil Fotoğrafı Alanı */}
        <div className="relative shrink-0">
          <div className="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold shadow-sm overflow-hidden border-2 border-blue-100">
            {profileImage ? (
              <img src={profileImage} alt="Profil" className="w-full h-full object-cover" />
            ) : (
              userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
            )}
          </div>
          <button 
            onClick={() => profileImageRef.current?.click()} 
            className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full border-2 border-blue-600 shadow-sm active:bg-blue-700 transition-colors"
            title="Fotoğrafı Değiştir"
          >
            <Camera size={12} />
          </button>
          <input 
            type="file" 
            accept="image/*" 
            ref={profileImageRef} 
            onChange={handleProfileImageChange} 
            className="hidden" 
          />
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-xl font-bold truncate">{userName}</h2>
          <p className="text-sm text-blue-100 mt-1 truncate">{userEmail}</p>
          <div className="mt-2 inline-flex items-center gap-1 bg-blue-500 text-white text-[10px] px-2 py-1 rounded-md font-medium">
            <CreditCard size={12} /> 14 Gün Ücretsiz Deneme
          </div>
        </div>
      </div>

      {/* Menü Grupları */}
      <div className="space-y-4">
        
        {/* Hesap Yönetimi */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hesap Ayarları</h3>
          </div>
          
          <button onClick={() => setIsEditModalOpen(true)} className="w-full p-4 border-b border-gray-50 flex items-center justify-between active:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <User size={16} />
              </div>
              <span className="text-sm font-medium text-slate-800">Profili Düzenle</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>

          <button onClick={() => setIsPasswordModalOpen(true)} className="w-full p-4 flex items-center justify-between active:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <Key size={16} />
              </div>
              <span className="text-sm font-medium text-slate-800">Şifre Değiştir</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Veri ve Abonelik */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Veri & Abonelik</h3>
          </div>

          <Link href="/subscription" className="w-full p-4 border-b border-gray-50 flex items-center justify-between active:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-50 text-green-600 rounded-full flex items-center justify-center">
                <CreditCard size={16} />
              </div>
              <div className="text-left">
                <span className="block text-sm font-medium text-slate-800">Abonelik Planı</span>
                <span className="block text-[10px] text-gray-500 mt-0.5">Aylık 105 TL</span>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </Link>
          
          <button onClick={handleExportExcel} className="w-full p-4 border-b border-gray-50 flex items-center justify-between active:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <Download size={16} />
              </div>
              <span className="text-sm font-medium text-slate-800">Excel Olarak Dışa Aktar</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>

          {/* Gizli Dosya Seçici ve İçe Aktar Butonu */}
          <input type="file" accept=".xlsx, .xls" ref={fileInputRef} className="hidden" onChange={handleImportExcel} />
          <button onClick={() => fileInputRef.current?.click()} className="w-full p-4 flex items-center justify-between active:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <Upload size={16} />
              </div>
              <span className="text-sm font-medium text-slate-800">Excel'den İçe Aktar</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>
        </div>

        {/* Destek */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-4 py-3 bg-gray-50/50 border-b border-gray-100">
            <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider">Destek & Diğer</h3>
          </div>
          
          <button onClick={() => window.open('https://wa.me/908501234567', '_blank')} className="w-full p-4 border-b border-gray-50 flex items-center justify-between active:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                <MessageCircle size={16} />
              </div>
              <span className="text-sm font-medium text-slate-800">WhatsApp Destek</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </button>

          <Link href="/terms" className="w-full p-4 flex items-center justify-between active:bg-gray-50 transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center">
                <ShieldAlert size={16} />
              </div>
              <span className="text-sm font-medium text-slate-800">Gizlilik ve Koşullar</span>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </Link>
        </div>

      </div>

      {/* Çıkış Butonu */}
      <button onClick={handleLogout} className="w-full mt-6 bg-red-50 text-red-600 font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-sm border border-red-100 active:bg-red-100 transition-colors">
        <LogOut size={20} /> Çıkış Yap
      </button>


      {/* =========================================
          MODALLAR (BOTTOM SHEETS)
          ========================================= */}

      {/* PROFİLİ DÜZENLE MODALI */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:w-100 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Profili Düzenle</h3>
              <button onClick={() => setIsEditModalOpen(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 active:bg-gray-200">
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1.5"><User size={12}/> Ad Soyad</label>
                <input 
                  type="text" 
                  value={userName} 
                  onChange={(e) => setUserName(e.target.value)} 
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3.5 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" 
                />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1.5"><Smartphone size={12}/> Telefon</label>
                <input 
                  type="tel" 
                  value={userPhone} 
                  onChange={(e) => setUserPhone(e.target.value)} 
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3.5 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" 
                />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase flex items-center gap-1 mb-1.5"><Mail size={12}/> E-Posta</label>
                <input 
                  type="email" 
                  value={userEmail} 
                  onChange={(e) => setUserEmail(e.target.value)} 
                  className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3.5 text-sm focus:outline-none focus:border-blue-500 focus:bg-white transition-colors" 
                />
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button onClick={handleSaveProfile} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:bg-blue-700">
                <CheckCircle2 size={20} /> Kaydet
              </button>
              <button onClick={() => setIsEditModalOpen(false)} className="w-full bg-white border border-gray-200 text-gray-600 font-bold py-4 rounded-xl active:bg-gray-50">
                Vazgeç
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ŞİFRE DEĞİŞTİR MODALI */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-end sm:items-center justify-center">
          <div className="bg-white w-full sm:w-100 rounded-t-3xl sm:rounded-3xl p-6 shadow-2xl animate-in slide-in-from-bottom-8 duration-300">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-800">Şifre Değiştir</h3>
              <button onClick={() => setIsPasswordModalOpen(false)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 active:bg-gray-200">
                <X size={18} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Mevcut Şifre</label>
                <input type="password" placeholder="••••••••" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)} className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3.5 text-sm focus:outline-none focus:border-blue-500 focus:bg-white" />
              </div>
              
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Yeni Şifre</label>
                <input type="password" placeholder="••••••••" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3.5 text-sm focus:outline-none focus:border-blue-500 focus:bg-white" />
              </div>

              <div>
                <label className="text-xs font-bold text-gray-500 uppercase mb-1.5 block">Yeni Şifre (Tekrar)</label>
                <input type="password" placeholder="••••••••" value={newPasswordConfirm} onChange={(e) => setNewPasswordConfirm(e.target.value)} className="w-full border border-gray-200 bg-gray-50 rounded-xl p-3.5 text-sm focus:outline-none focus:border-blue-500 focus:bg-white" />
              {passwordError && <p className="text-xs text-red-600 font-medium mt-1">{passwordError}</p>}
              </div>
            </div>

            <div className="mt-8 space-y-3">
              <button onClick={handleSavePassword} className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-blue-200 active:bg-blue-700">
                Şifreyi Güncelle
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}