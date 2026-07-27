export interface User {
  id: number;
  ad_soyad: string;
  telefon: string;
  email?: string | null;
}

export interface AuthTokens {
  access: string;
  refresh: string;
  user?: User;
}

export interface Musteri {
  id: number;
  ad_soyad: string;
  telefon: string;
  adres?: string | null;
  not_alani?: string | null;
  created_at?: string;
  toplam_harcama?: string | number;
  kalan_borc?: string | number;
  son_islem_tarihi?: string | null;
}

export interface IsFotografi {
  id: number;
  is_kaydi: number;
  fotograf: string;
  foto_tipi?: string;
  yuklenme_tarihi?: string;
}

export interface Odeme {
  id: number;
  is_kaydi: number;
  tutar: string | number;
  tarih: string;
  created_at?: string;
}

export type IsDurum = 'bekliyor' | 'devam_ediyor' | 'tamamlandi';
export type OdemeDurumu = 'odendi' | 'kismi_odendi' | 'odenmedi';

export interface IsKaydi {
  id: number;
  talep_no: string;
  musteri: number;
  musteri_adi_goster?: string;
  musteri_telefon_goster?: string;
  tarih: string;
  yapilan_is: string;
  ucret: string | number;
  durum: IsDurum;
  odenen_tutar: string | number;
  odeme_durumu: OdemeDurumu;
  kalan_tutar?: string | number;
  fotograflar?: IsFotografi[];
  odemeler?: Odeme[];
  created_at?: string;
}

export interface DashboardOzet {
  toplam_musteri: number;
  toplam_is: number;
  toplam_alacak: number;
  bu_ay_is_sayisi?: number;
  bugunku_isler: IsKaydi[];
  borclu_musteri_sayisi: number;
}

export interface BorcluMusteri {
  ad_soyad: string;
  telefon: string;
  kalan_borc: number;
  son_islem_tarihi?: string | null;
}

export interface RaporOzet {
  toplam_gelir: number;
  toplam_alacak: number;
  bu_ay_is_sayisi: number;
  tamamlanan_is_sayisi: number;
  bekleyen_is_sayisi: number;
  devam_eden_is_sayisi: number;
}

export interface AbonelikDurum {
  plan: string | null;
  durum: string;
  deneme_bitis: string | null;
  mevcut_donem_bitis: string | null;
  sonraki_odeme_tarihi: string | null;
  bekleyen_odeme_var_mi: boolean;
}

export interface OdemeKaydi {
  id: number;
  tutar: string;
  durum: string;
  plan_tipi?: string;
  islem_tarihi: string;
}

export interface ApiErrorBody {
  detail?: string;
  hata?: string;
  mesaj?: string;
  [key: string]: unknown;
}
