KURMA 2026 — DASHBOARD VERSI 2
================================

Fitur:
- Form pendaftaran anggota baru.
- Statistik total, laki-laki, perempuan, dan kelas terbanyak.
- Tabel data pendaftar.
- Pencarian.
- Filter kelas.
- Filter jenis kelamin.
- Refresh data dari Google Spreadsheet.
- Export data hasil filter ke Excel-compatible .xls.
- Profil KURMA dan moto "Luruskan Niat, Rapatkan Shaff".
- Dokumentasi foto KURMA.
- Google Apps Script backend.
- ID pendaftaran dan timestamp otomatis.
- Nomor HP disimpan sebagai teks.

GOOGLE SPREADSHEET
==================
ID Spreadsheet:
1dR217eo8zGw5jP0spT2MDrcZEW6MDiijPzdc8BFaXiA

LANGKAH INSTALASI
=================
1. Buka Google Spreadsheet KURMA 2026.
2. Extensions/Ekstensi > Apps Script.
3. Ganti kode Apps Script dengan isi Code.gs.
4. Jalankan fungsi setupSheet sekali dan beri izin.
5. Deploy > New deployment > Web app.
6. Execute as: Me.
7. Who has access: Anyone.
8. Copy URL /exec.
9. Buka app.js dan ganti:
   const WEB_APP_URL = "PASTE_WEB_APP_URL_DI_SINI";
   dengan URL /exec tersebut.
10. Buka index.html.

PENTING TENTANG DATA ADMIN
==========================
Versi 2 menampilkan data spreadsheet di tabel browser. Karena endpoint publik diperlukan
agar form pendaftaran dapat mengirim data tanpa server sendiri, data GET juga dapat terbaca
oleh siapa pun yang mengetahui URL endpoint.

Untuk penggunaan sekolah yang membutuhkan privasi data anggota:
- gunakan versi ini sebagai prototipe/internal sesuai kebijakan sekolah; atau
- buat deployment admin terpisah yang hanya dapat diakses akun Google pengurus.
Jangan menaruh password/token rahasia di JavaScript frontend publik karena dapat dilihat pengguna.

EXPORT EXCEL
============
Tombol "Excel" mengunduh data yang sedang tampil setelah filter sebagai file .xls
(Excel-compatible, UTF-8). Untuk .xlsx native, buka Google Spreadsheet lalu:
File > Download > Microsoft Excel (.xlsx).

KUSTOMISASI
===========
- Foto dan logo berada di folder assets.
- Warna utama di styles.css pada variabel --maroon, --gold, dan --cream.
- Kolom spreadsheet diatur pada HEADERS di Code.gs.
- Jika tab spreadsheet tertentu ingin digunakan, isi SHEET_NAME pada Code.gs.

MOTO
====
"Luruskan Niat, Rapatkan Shaff"
