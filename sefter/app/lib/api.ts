import type { ApiErrorBody } from '../types/api';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('access_token');
}

function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('refresh_token');
}

function setTokens(access: string, refresh?: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem('access_token', access);
  if (refresh) localStorage.setItem('refresh_token', refresh);
}

function clearTokens() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
}

/** DRF hata gövdesini okunabilir stringe çevirir */
export function formatApiError(errorData: ApiErrorBody | Record<string, unknown>, status: number): string {
  if (!errorData || typeof errorData !== 'object') {
    return `İstek başarısız oldu (${status})`;
  }

  if (typeof errorData.detail === 'string') return errorData.detail;
  if (typeof errorData.hata === 'string') return errorData.hata;
  if (typeof errorData.mesaj === 'string') return errorData.mesaj;

  // Field-level errors: { telefon: ["..."], password: ["..."] }
  const parts: string[] = [];
  for (const [key, value] of Object.entries(errorData)) {
    if (Array.isArray(value)) {
      parts.push(`${key}: ${value.join(', ')}`);
    } else if (typeof value === 'string') {
      parts.push(`${key}: ${value}`);
    }
  }
  if (parts.length) return parts.join(' | ');

  if (status === 401) return 'Oturum süreniz doldu. Lütfen tekrar giriş yapın.';
  if (status === 403) return 'Bu işlem için yetkiniz yok.';
  if (status === 404) return 'İstenen kayıt bulunamadı.';
  if (status >= 500) return 'Sunucu hatası. Lütfen daha sonra tekrar deneyin.';
  return 'API isteği başarısız oldu';
}

async function tryRefreshAccessToken(): Promise<string | null> {
  const refresh = getRefreshToken();
  if (!refresh) return null;

  try {
    const res = await fetch(`${BASE_URL}/api/auth/token/refresh/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh }),
    });
    if (!res.ok) {
      clearTokens();
      return null;
    }
    const data = await res.json();
    if (data.access) {
      setTokens(data.access);
      return data.access as string;
    }
    return null;
  } catch {
    clearTokens();
    return null;
  }
}

async function fetchAPI(endpoint: string, options: RequestInit = {}, retried = false): Promise<any> {
  let token = getAccessToken();

  const headers = new Headers(options.headers);
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;
  if (!isFormData && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // 401 → refresh dene (bir kez)
  if (response.status === 401 && !retried && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
    const newAccess = await tryRefreshAccessToken();
    if (newAccess) {
      return fetchAPI(endpoint, options, true);
    }
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(formatApiError(errorData, response.status));
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  auth: {
    register: (data: { ad_soyad: string; telefon: string; password: string; email?: string }) =>
      fetchAPI('/api/auth/register/', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: { username: string; password: string }) =>
      fetchAPI('/api/auth/login/', { method: 'POST', body: JSON.stringify(data) }),
    refreshToken: (refresh: string) =>
      fetchAPI('/api/auth/token/refresh/', { method: 'POST', body: JSON.stringify({ refresh }) }),
    resetPassword: (data: { email?: string; telefon?: string }) =>
      fetchAPI('/api/auth/reset-password/', { method: 'POST', body: JSON.stringify(data) }),
    getProfile: () => fetchAPI('/api/auth/profile/'),
    updateProfile: (data: Partial<{ ad_soyad: string; telefon: string; email: string }>) =>
      fetchAPI('/api/auth/profile/', { method: 'PATCH', body: JSON.stringify(data) }),
    changePassword: (data: { old_password: string; new_password: string }) =>
      fetchAPI('/api/auth/change-password/', { method: 'POST', body: JSON.stringify(data) }),
    exportExcel: async () => {
      const token = getAccessToken();
      const res = await fetch(`${BASE_URL}/api/auth/excel/export/`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(formatApiError(errorData, res.status));
      }
      return res.blob();
    },
    importExcel: async (file: File) => {
      const token = getAccessToken();
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${BASE_URL}/api/auth/excel/import/`, {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(formatApiError(data, res.status));
      return data;
    },
  },

  customers: {
    getAll: () => fetchAPI('/api/musteriler/'),
    getById: (id: string | number) => fetchAPI(`/api/musteriler/${id}/`),
    getOzet: (id: string | number) => fetchAPI(`/api/musteriler/${id}/ozet/`),
    create: (data: Partial<{ ad_soyad: string; telefon: string; adres: string; not_alani: string }>) =>
      fetchAPI('/api/musteriler/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string | number, data: Record<string, unknown>) =>
      fetchAPI(`/api/musteriler/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
    patch: (id: string | number, data: Record<string, unknown>) =>
      fetchAPI(`/api/musteriler/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string | number) => fetchAPI(`/api/musteriler/${id}/`, { method: 'DELETE' }),
  },

  jobs: {
    getAll: (params?: { durum?: string; musteri?: number | string; musteri_id?: number | string }) => {
      const qs = new URLSearchParams();
      if (params?.durum) qs.set('durum', params.durum);
      if (params?.musteri) qs.set('musteri', String(params.musteri));
      if (params?.musteri_id) qs.set('musteri_id', String(params.musteri_id));
      const q = qs.toString();
      return fetchAPI(`/api/is-kayitlari/${q ? `?${q}` : ''}`);
    },
    getById: (id: string | number) => fetchAPI(`/api/is-kayitlari/${id}/`),
    create: (data: Record<string, unknown>) =>
      fetchAPI('/api/is-kayitlari/', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string | number, data: Record<string, unknown>) =>
      fetchAPI(`/api/is-kayitlari/${id}/`, { method: 'PUT', body: JSON.stringify(data) }),
    patch: (id: string | number, data: Record<string, unknown>) =>
      fetchAPI(`/api/is-kayitlari/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string | number) => fetchAPI(`/api/is-kayitlari/${id}/`, { method: 'DELETE' }),
    addPhotos: (id: string | number, files: File[]) => {
      const formData = new FormData();
      files.forEach((file) => formData.append('fotograflar', file));
      return fetchAPI(`/api/is-kayitlari/${id}/fotograf_ekle/`, { method: 'POST', body: formData });
    },
    addPayment: (id: string | number, data: { tutar: number | string; tarih?: string }) =>
      fetchAPI(`/api/is-kayitlari/${id}/odeme_ekle/`, { method: 'POST', body: JSON.stringify(data) }),
  },

  dashboard: {
    getSummary: () => fetchAPI('/api/dashboard/ozet/'),
    getDebtors: () => fetchAPI('/api/dashboard/borclular/'),
    search: (query: string) => fetchAPI(`/api/dashboard/ara/?q=${encodeURIComponent(query)}`),
    getHistory: (params?: { durum?: string; musteri_id?: string | number; tarih_baslangic?: string; tarih_bitis?: string }) => {
      const qs = new URLSearchParams();
      if (params?.durum) qs.set('durum', params.durum);
      if (params?.musteri_id) qs.set('musteri_id', String(params.musteri_id));
      if (params?.tarih_baslangic) qs.set('tarih_baslangic', params.tarih_baslangic);
      if (params?.tarih_bitis) qs.set('tarih_bitis', params.tarih_bitis);
      const q = qs.toString();
      return fetchAPI(`/api/dashboard/gecmis/${q ? `?${q}` : ''}`);
    },
    getReportSummary: () => fetchAPI('/api/dashboard/rapor/ozet/'),
  },

  billing: {
    getStatus: () => fetchAPI('/api/abonelik/durum/'),
    requestPayment: (plan: 'aylik' | 'yillik' = 'aylik') =>
      fetchAPI('/api/abonelik/odeme-talep-et/', { method: 'POST', body: JSON.stringify({ plan }) }),
    submitReceipt: (data: FormData | { odeme_kaydi_id: number; dekont_no?: string }) => {
      if (data instanceof FormData) {
        return fetchAPI('/api/abonelik/dekont-bildir/', { method: 'POST', body: data });
      }
      return fetchAPI('/api/abonelik/dekont-bildir/', { method: 'POST', body: JSON.stringify(data) });
    },
    cancel: () => fetchAPI('/api/abonelik/iptal/', { method: 'POST', body: JSON.stringify({}) }),
    getPaymentHistory: () => fetchAPI('/api/abonelik/odeme-gecmisi/'),
  },
};

export { BASE_URL, clearTokens, setTokens };
