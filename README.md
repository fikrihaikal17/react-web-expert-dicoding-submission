# Forum App Testing and CI/CD Submission

Proyek ini merupakan aplikasi Forum Diskusi React dengan automation testing (unit, thunk, component, e2e) dan integrasi CI/CD.

## Tech Stack

- React + Vite
- Redux Toolkit + Redux Thunk
- React Router
- Jest + React Testing Library
- Cypress
- GitHub Actions (Continuous Integration)
- Vercel (Continuous Deployment)
- React Hook Form (React ecosystem tambahan)

## Menjalankan Proyek

1. Install dependency:

```bash
npm install
```

2. Jalankan development server:

```bash
npm run dev
```

## Menjalankan Pengujian

### 1) Unit, Thunk, dan Component Test

```bash
npm test
```

### 2) End-to-End Test (alur login)

```bash
npm run e2e
```

## Struktur Pengujian

- Reducer tests:
	- `src/states/__tests__/threadsSlice.test.js`
	- `src/states/__tests__/threadDetailSlice.test.js`
- Thunk tests:
	- `src/states/__tests__/thunks.test.js`
- React component tests:
	- `src/components/__tests__/CategoryFilter.test.jsx`
	- `src/pages/__tests__/LoginPage.test.jsx`
- End-to-end login test:
	- `cypress/e2e/login.cy.js`

## CI dengan GitHub Actions

Workflow CI tersedia di:

- `.github/workflows/ci.yml`

Pipeline akan menjalankan:

1. `npm ci`
2. `npm run lint`
3. `npm test`
4. `npm run build`
5. Cypress e2e login test

## Deploy ke Vercel (Step by Step)

1. Push proyek ke GitHub repository.
2. Buka [Vercel Dashboard](https://vercel.com/dashboard).
3. Klik **Add New Project**.
4. Pilih repository ini.
5. Framework preset biasanya otomatis terdeteksi sebagai **Vite**.
6. Pastikan build settings:
	 - Build Command: `npm run build`
	 - Output Directory: `dist`
7. Klik **Deploy**.
8. Setelah deploy sukses, salin URL Vercel dan masukkan ke catatan submission.

Catatan:

- File `vercel.json` sudah disiapkan untuk fallback route SPA React Router.

## Branch Protection (Step by Step)

1. Buka repository di GitHub.
2. Masuk ke **Settings** > **Branches**.
3. Pada **Branch protection rules**, klik **Add rule**.
4. Isi branch name pattern: `main` (atau default branch repository Anda).
5. Centang:
	 - **Require a pull request before merging**
	 - **Require status checks to pass before merging**
6. Pada status check, pilih job CI: `automation-test-job`.
7. Simpan rule.

## Bukti Screenshot untuk Submission

Simpan file screenshot di folder:

- `screenshot/1_ci_check_error.png`
- `screenshot/2_ci_check_pass.png`
- `screenshot/3_branch_protection.png`

Sebelum upload ZIP submission:

1. Pastikan folder `node_modules` tidak ikut di-zip.
2. Pastikan folder `screenshot` berisi ketiga bukti di atas.
3. Pastikan URL Vercel dicantumkan pada catatan submission.
