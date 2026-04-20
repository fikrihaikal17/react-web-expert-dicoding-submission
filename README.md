# Forum App

Forum App adalah aplikasi diskusi berbasis React yang menerapkan praktik pengembangan modern: state management terstruktur, pengujian berlapis, dan pipeline CI/CD otomatis.

## Tujuan Proyek

Proyek ini dibangun untuk menunjukkan implementasi end-to-end aplikasi frontend yang tidak hanya berjalan di browser, tetapi juga terukur kualitasnya melalui:

- Struktur kode modular.
- Validasi fungsional lewat unit, thunk, component, dan e2e test.
- Otomasi quality gate di GitHub Actions.
- Deploy otomatis ke Vercel.

## Fitur Utama

- Autentikasi pengguna (register, login, profil).
- Menampilkan daftar thread dan detail thread.
- Menambahkan thread baru.
- Menambahkan komentar pada thread.
- Voting thread dan komentar.
- Filter thread berdasarkan kategori.
- Halaman leaderboard aktivitas pengguna.
- Internationalization (i18n) dan preferensi bahasa.

## Arsitektur Singkat

### 1. Frontend Layer

- React + Vite untuk SPA yang ringan dan cepat.
- React Router untuk navigasi multi-halaman.
- Komponen dipisah antara komponen umum dan komponen halaman.

### 2. State Layer

- Redux Toolkit sebagai state container utama.
- Redux Thunk untuk asynchronous flow (fetch data API, aksi login, create thread, vote, komentar).
- State dipisah per domain (threads, thread detail, auth user, categories, leaderboards, users, preferences, loading).

### 3. Data Layer

- API abstraction diletakkan terpisah agar komponen tidak langsung bergantung pada detail request.
- Utility helper dipisahkan untuk format tanggal, text, notifikasi, dan translasi.

## Kualitas dan Pengujian

Strategi testing menggunakan pendekatan berlapis:

- Reducer test untuk menjamin perubahan state sinkron dengan action.
- Thunk test untuk memastikan alur async dan side effect berjalan benar.
- Component test untuk perilaku UI dan interaksi user.
- End-to-end test untuk validasi alur login dari sisi pengguna.

Daftar pengujian utama:

- Reducer tests
  - src/states/__tests__/threadsSlice.test.js
  - src/states/__tests__/threadDetailSlice.test.js
- Thunk tests
  - src/states/__tests__/thunks.test.js
- Component tests
  - src/components/__tests__/CategoryFilter.test.jsx
  - src/pages/__tests__/LoginPage.test.jsx
- E2E test
  - cypress/e2e/login.cy.js

## CI/CD Overview

Pipeline CI ada di `.github/workflows/ci.yml` dan berjalan untuk validasi otomatis setiap perubahan kode.

Tahapan quality gate:

1. Install dependency (`npm ci`)
2. Lint (`npm run lint`)
3. Test (`npm test`)
4. Build (`npm run build`)
5. E2E Cypress (`npm run e2e`)

Deploy production dijalankan via Vercel dengan output build dari folder `dist`.

## Menjalankan Proyek Secara Lokal

Install dependency:

```bash
npm install
```

Jalankan development server:

```bash
npm run dev
```

Build production:

```bash
npm run build
```

Preview hasil build:

```bash
npm run preview
```

## Menjalankan Pengujian

Lint:

```bash
npm run lint
```

Unit, thunk, component tests:

```bash
npm test
```

End-to-end tests:

```bash
npm run e2e
```

## Struktur Folder Penting

- src/api: komunikasi data dengan backend API.
- src/states: redux slice, thunk, dan testing state logic.
- src/components: komponen reusable UI.
- src/pages: komponen level halaman.
- src/hooks: custom hooks aplikasi.
- src/i18n: konfigurasi bahasa dan terjemahan.
- src/utils: helper utility umum.
- cypress/e2e: skenario end-to-end test.
- screenshot: bukti CI/CD untuk kebutuhan submission.

