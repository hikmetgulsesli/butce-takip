# Kisisel Butce Takip Uygulamasi — PRD

## 1. Proje Genel Bakisi

**Proje Adi:** Kisisel Butce Takip
**Proje Turu:** CRUD Dashboard / Finansal Takip Uygulamasi
**Proje Ozeti:** Kullanicilarin gelir ve giderlerini kategorilere gore takip edebildigi, aylik ozet ve grafiklerle finansal durumlarini goruntuleyebildikleri tek sayfali bir web uygulamasi.
**Hedef Kullanici:** Turkce konusan, personal finance takibi yapmak isteyen bireyler.
**Repo:** ~/projects/butce-takip
**Branch:** main

---

## 2. Hedef Platform

- **Platform:** Web (responsive, mobil uyumlu)
- **Target:** Tarayici (Chrome, Firefox, Safari, Edge)
- **Teknik:** React + Vite + TypeScript + Tailwind CSS

---

## 3. Fonksiyonel Gereksinimler

### 3.1 Kategoriler
- **Gelir Kategorileri:** Maas, Frrsat, Yatirim, Diger
- **Gider Kategorileri:** Yemek, Ulasim, Fatura, Eglence, Saglik, Diger

### 3.2 Ozellikler

#### 3.2.1 Gelir/Gider Ekleme Formu
- Tur secimi: Gelir veya Gider (toggle/radio)
- Miktar girisi (sayisal, TL)
- Kategori secimi (dropdown, dinamik olarak gelir/gider kategorilerini gosterir)
- Aciklama alani (opsiyonel, metin)
- Tarih secimi (date picker, varsayilan: bugun)
- Kaydet butonu

#### 3.2.2 Islem Listesi
- Tum gelir ve giderlerin kronolojik listesi (yeniden eskiye)
- Her satirda: tarih, kategori ikonu, aciklama, miktar (gelir=yesil, gider=kirmizi)
- Silme butonu (satir bazinda)
- Bos durum gosterimi ("Henuz islem eklemediniz")

#### 3.2.3 Aylik Ozet Karti
- Toplam gelir
- Toplam gider
- Bakiye (gelir - gider)
- Aylik grafik cizgi/gelisme gosterimi (opsiyonel)

#### 3.2.4 Kategori Bazli Pasta Grafigi
- recharts kutuphanesi ile pasta grafigi
- Giderleri kategori bazli gosterir
- Legend ile kategori isimleri ve yuzdeleri
- Ay secimi: onceki/sonraki aylara gecis

#### 3.2.5 Veri Saklama
- Tum veriler localStorage'da saklanir
- Veri yapisi: `{ id, type, amount, category, description, date, createdAt }`

#### 3.2.6 Son Islemler Listesi
- Dashboard'da son 5 islem hizli gorunumu
- "Tumunu Gor" baglantisi

---

## 4. Teknik Gereksinimler

### 4.1 Teknoloji Yigini
- **Framework:** React 18+
- **Build Tool:** Vite
- **Dil:** TypeScript
- **Stil:** Tailwind CSS
- **Grafig:** recharts
- **Veri Saklama:** localStorage (client-side)

### 4.2 Proje Yapisi
```
src/
  components/
    TransactionForm.tsx      # Gelir/gider ekleme formu
    TransactionList.tsx      # Islem listesi
    SummaryCard.tsx          # Aylik ozet karti
    CategoryPieChart.tsx     # Pasta grafigi
    CategorySelect.tsx       # Kategori secim bileşeni
    MonthNavigator.tsx       # Ay gecis bileşeni
    EmptyState.tsx           # Bos durum bileşeni
  hooks/
    useTransactions.ts       # Islem verisi ve CRUD islemleri
    useLocalStorage.ts       # localStorage okuma/yazma hook
  types/
    index.ts                 # Tip tanimlari
  utils/
    formatters.ts            # Para formati, tarih formati
    categories.ts             # Kategori tanimlari ve yardimcilari
  App.tsx                    # Ana uygulama
  main.tsx                   # Entry point
  index.css                  # Tailwind ve ozel stiller
```

### 4.3 Veri Modeli
```typescript
type TransactionType = 'income' | 'expense';

interface Transaction {
  id: string;                // UUID
  type: TransactionType;
  amount: number;            // Kurus cinsinden (veya TL)
  category: string;           // Kategori key
  description: string;       // Opsiyonel aciklama
  date: string;              // ISO 8601 tarih (YYYY-MM-DD)
  createdAt: number;         // Timestamp
}

interface AppState {
  transactions: Transaction[];
  selectedMonth: string;     // YYYY-MM
}
```

---

## 5. UI/UX Gereksinimleri

### 5.1 Tema
- **Tema Turu:** Koyu tema (Dark Mode)
- **Renk Paleti:**
  - Arka plan: `#0f172a` (slate-900)
  - Kart arka plan: `#1e293b` (slate-800)
  - Border: `#334155` (slate-700)
  - Primary accent: `#3b82f6` (blue-500)
  - Gelir rengi: `#22c55e` (green-500)
  - Gider rengi: `#ef4444` (red-500)
  - Metin ana: `#f8fafc` (slate-50)
  - Metin yardimci: `#94a3b8` (slate-400)

### 5.2 Tipografi
- Font: Sistem fontu veya Inter
- Basliklar: Bold, slate-50
- Govde metni: slate-300

### 5.3 Layout
- Tek sayfa, responsive grid
- Mobilde tek sutun, tablet/desktop'da 2-3 sutun
- Sabit header (uygulama adi + ay navigatoru)

### 5.4 Animasyonlar
- Form submit: kisa scale animasyonu
- Liste ogeleri: fade-in
- Pasta grafigi: hover'da tooltips

---

## 6. Non-Fonksiyonel Gereksinimler

- **Performans:** Ilk yukleme < 2sn, localStorage islemleri aninda
- **Erisilebilirlik:** Tum form ogeleri label ile, klavye navigasyonu
- ** Uyumluluk:** Modern tarayicilar (son 2 versiyon)
- **Guvenlik:** localStorage kullanimi, hassas veri yok ( finansal veri degil)

---

## 7. Ekranlar (Screens)

| # | Ekran Adi | Tur | Aciklam |
|---|-----------|-----|---------|
| 1 | Ana Dashboard | dashboard | KPI kartlari (toplam gelir/gider/bakiye), son 5 islem, kategori pasta grafigi |
| 2 | Gelir/Gider Ekleme Formu | form | Modal veya inline form; tur, miktar, kategori, tarih, aciklama girisi |
| 3 | Islem Listesi | list-view | Tum islemler; filtreleme yok (tek sayfa), silme aksiyonu |
| 4 | Kategori Pasta Grafigi | chart | Aylik giderlerin kategori dagilimi; recharts ile |
| 5 | Aylik Ozet Karti | card | Ay bazli toplam gelir, gider, bakiye |
| 6 | Ay Navigatoru | navigation | Onceki/sonraki aya gecis; anlik ay gosterimi |
| 7 | Bos Durum (Islem Yok) | empty-state | Henuz islem eklenmediginde gosterilen bos panel |
| 8 | Silme Onay Diyalogu | dialog | Islem silme onayi icin basit confirm |
| 9 | Hata Durumu | error-state | Beklenmeyen hatalarda gosterilen sayfa/bilesen |
| 10 | 404 / Yanlis Yol | error-page | URL yanlisliginda gosterilen sayfa |

---

## 8. PRD Ozet

Bu proje, kullanicilarin gelir ve giderlerini kategorilere gore takip etmelerini saglayan, React + Vite + TypeScript + Tailwind CSS ile gelistirilmis tek sayfali, koyu temali bir kisisel finains uygulamasidir. localStorage ile veri saklanir, recharts ile grafik gosterimi yapilir. Tum UI Turkce'dir.

**Ekran Sayisi:** 10
