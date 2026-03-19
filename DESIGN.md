# Butce Takip — Design System

## Aesthetic Direction
- **Style:** Minimal, professional finance dashboard
- **Mood:** Clean, trustworthy, modern dark UI

## Color Palette
```css
--surface-dark: #0f172a;   /* slate-900 - page background */
--surface: #1e293b;        /* slate-800 - card backgrounds */
--primary: #3b82f6;        /* blue-500 - primary actions */
--income: #22c55e;         /* green-500 - income amounts */
--expense: #ef4444;        /* red-500 - expense amounts */
--text: #f8fafc;           /* slate-50 - primary text */
--text-muted: #94a3b8;     /* slate-400 - secondary text */
--border: #334155;         /* slate-700 - borders */
```

## Typography
- **Heading font:** Sora (Google Fonts) — weights 500, 600, 700
- **Body font:** Nunito Sans (Google Fonts) — weights 400, 500, 600
- **Turkish text** throughout UI

## Icon Library
- Lucide React (SVG icons, w-5 h-5, currentColor)

## Components
- Dark-themed cards with slate-800 background
- KPI summary cards with colored accents (green/red/blue)
- Recharts pie chart for category breakdown
- Form inputs with slate-700 borders
- Modal dialogs with backdrop blur

## Turkish Content Rules
- All UI text in Turkish
- Date format: GG.AA.YYYY
- Number format: 1.234,56 TL (Turkish locale)
- Categories: Yemek, Ulasim, Fatura, Eglence, Saglik, Diger (expense); Maas, Frrsat, Yatirim, Diger (income)
