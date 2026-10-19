# Jurnal Prompt

Catat prompt penting selama membangun aplikasi: apa yang kamu minta, hasilnya, dan perbaikan yang dilakukan. Beri tanda **[SENDIRI]** untuk prompt yang kamu tulis sendiri (bukan dari lembar kerja).

## US-01 Katalog dari database

**Prompt:**
Baca AGENTS.md dan docs/user-stories.md bagian US-01.

Ubah app/page.jsx supaya daftar produk diambil dari tabel "produk" di Supabase, di sisi server, memakai SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable. Buat koneksi Supabase untuk server di folder lib/supabase.

Tampilkan produk dengan komponen KartuProduk yang sudah ada, tanpa mengubah tampilannya. Kalau gagal mengambil data, tampilkan pesan error yang jelas di halaman. Kalau tabel kosong, tampilkan tulisan "Belum ada produk". Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
Pekerjaan untuk US-01 (Katalog dari database) telah selesai.

Perubahan yang Dilakukan
Membuat koneksi Supabase server di lib/supabase/server.js dan lib/supabase/index.js:
Membuat helper createServerClient() menggunakan @supabase/supabase-js dengan SUPABASE_URL dan SUPABASE_SECRET_KEY dari environment variable di sisi server.
Memperbarui app/page.jsx:
Mengambil data produk langsung dari tabel produk di Supabase secara server-side (Server Component).
Menampilkan produk menggunakan komponen KartuProduk tanpa mengubah tampilannya.
Menghapus komponen CatatanBelumAktif dan impor produkContoh.
Menambahkan penanganan jika tabel kosong: menampilkan teks "Belum ada produk".
Menambahkan penanganan jika terjadi error saat memuat data: menampilkan kotak pesan error yang jelas.

**Perbaikan:**

## US-02 Detail produk

**Prompt:**
Baca docs/user-stories.md bagian US-02.

Ubah app/produk/[id]/page.jsx supaya mengambil satu produk dari tabel "produk" di Supabase berdasarkan id di URL, di sisi server, memakai koneksi Supabase yang sudah dibuat di lib/supabase. Kalau produk tidak ditemukan, panggil notFound(). Jangan ubah tampilannya. Hapus CatatanBelumAktif dari halaman ini, tapi biarkan tombol WhatsApp.

**Hasil:**
Pekerjaan untuk US-02 (Detail produk) telah selesai.

Perubahan yang Dilakukan
app/produk/[id]/page.jsx:
Mengambil id dari params secara asynchronous (const { id } = await params).
Mengambil data produk spesifik dari tabel produk di Supabase secara server-side menggunakan createServerClient() dari @/lib/supabase/server.
Memanggil notFound() jika produk tidak ditemukan di database atau jika terjadi error kueri.
Mempertahankan tampilan dan susunan elemen termasuk tombol TombolWhatsApp.
Menghapus komponen CatatanBelumAktif dan impor cariProdukContoh.

**Perbaikan:**

## US-03 Pesan via WhatsApp

**Prompt:**
Baca docs/rancangan-teknis.md bagian "Pesan WhatsApp (US-03)".

Ubah components/TombolWhatsApp.jsx menjadi tautan yang membuka https://wa.me/ ke nomor di lib/toko.js, dengan pesan otomatis berisi nama dan harga produk dalam format rupiah. Pesan di-encode dengan encodeURIComponent dan dibuka di tab baru. Pertahankan tampilan tombolnya. Hapus CatatanBelumAktif yang menyebut US-03 di halaman detail produk.

**Hasil:**
Pekerjaan untuk US-03 (Pesan via WhatsApp) telah selesai.

Perubahan yang Dilakukan
components/TombolWhatsApp.jsx:
Mengubah elemen button menjadi elemen link a dengan mempertahankan kelas tampilan tombol aslinya.
Menghubungkan link ke wa
Menyusun pesan otomatis berisi nama produk dan harga dalam format rupiah (formatRupiah), yang di-encode menggunakan encodeURIComponent.
Menambahkan atribut target="_blank" dan rel="noopener noreferrer" agar link terbuka di tab baru.
app/produk/[id]/page.jsx:
Memastikan komponen CatatanBelumAktif yang menyebut US-03 sudah dihapus dari halaman detail produk dengan tetap mempertahankan tombol pesan WhatsApp.

**Perbaikan:**

## US-04 Login admin

**Prompt:**
Baca AGENTS.md bagian aturan keamanan dan docs/user-stories.md bagian US-04.

Buat login admin memakai Supabase Auth (email dan password) dengan @supabase/ssr dan cookie, memakai SUPABASE_URL dan SUPABASE_PUBLISHABLE_KEY. Login diproses dengan Server Action di app/admin/actions.js dan disambungkan ke form di app/admin/login/page.jsx. Login berhasil diarahkan ke /admin; login gagal menampilkan pesan error yang jelas di halaman login. Buat juga tombol "Keluar" di components/NavAdmin.jsx berfungsi: mengakhiri sesi lalu kembali ke /admin/login. Jangan ubah tampilan. Hapus CatatanBelumAktif dari halaman login.

**Hasil:**

**Perbaikan:**

## US-05 Ganti password

**Prompt:**
Baca docs/user-stories.md bagian US-05.

Buat Server Action ganti password di app/admin/actions.js untuk admin yang sedang login, memakai Supabase Auth. Validasi di server: password baru minimal 8 karakter dan harus sama dengan konfirmasi. Tampilkan pesan berhasil atau pesan error yang jelas di halaman. Sambungkan ke form di app/admin/password/page.jsx tanpa mengubah tampilannya. Hapus CatatanBelumAktif dari halaman ini.

**Hasil:**
Pekerjaan untuk US-05 (Ganti password) telah selesai.

Perubahan yang Dilakukan
app/admin/actions.js:
Menambahkan Server Action gantiPassword(formData) (dan alias ubahPassword).
Verifikasi Autentikasi di Server: Memeriksa sesi admin yang sedang login melalui supabase.auth.getUser(). Jika tidak ada sesi aktif, pengguna dialihkan ke /admin/login.
Validasi Server:
Memastikan password baru dan konfirmasi tidak kosong.
Memvalidasi panjang password baru minimal 8 karakter.
Memvalidasi bahwa password baru dan konfirmasi password bernilai sama persis.
Pembaruan Password: Memanggil supabase.auth.updateUser({ password: passwordBaru }).
Mengalihkan kembali ke /admin/password dengan parameter sukses jika berhasil, atau error jika terdapat kegagalan.
app/admin/password/page.jsx:
Mengubah halaman menjadi Server Component yang membaca parameter URL searchParams (error dan sukses).
Menyambungkan form ke action gantiPassword (<form action={gantiPassword}>).
Menampilkan kotak pesan error (berwarna text-bahaya) atau pesan sukses (berwarna text-utama) sesuai respons.
Menghapus komponen CatatanBelumAktif dengan mempertahankan seluruh susunan form dan tombol.

**Perbaikan:**

## US-06 Proteksi halaman admin

**Prompt:**
Baca AGENTS.md aturan keamanan nomor 3 dan 4, dan docs/user-stories.md bagian US-06.

Buat file proxy.js di root proyek (Next.js 16). Semua rute /admin kecuali /admin/login wajib login dengan Supabase Auth; kalau belum login, alihkan ke /admin/login. Pastikan juga setiap Server Action yang mengubah data memeriksa login di server. Hapus CatatanBelumAktif dari halaman /admin.

**Hasil:**
Pekerjaan untuk US-06 (Proteksi halaman admin) telah selesai.

Perubahan yang Dilakukan
Membuat proxy.js di root proyek:
Berfungsi sebagai middleware / proxy resmi Next.js 16 untuk memproteksi rute dengan konfigurasi matcher: ["/admin/:path*"].
Membaca status autentikasi admin di sisi server menggunakan @supabase/ssr (supabase.auth.getUser()).
Jika pengguna belum login dan mencoba mengakses rute /admin mana pun selain /admin/login, request langsung dialihkan (redirect) ke /admin/login.
Memperbarui app/admin/actions.js:
Menambahkan helper requireAuth() dan memastikan setiap Server Action yang mengubah data (seperti gantiPassword) wajib memvalidasi sesi admin yang sedang login di server via supabase.auth.getUser().
Memperbarui app/admin/page.jsx:
Menghapus komponen CatatanBelumAktif dan impornya dari halaman daftar admin.

**Perbaikan:**

## Debugging dan fitur bonus

Tambahkan bagian baru untuk setiap error yang kamu perbaiki atau fitur bonus yang kamu kerjakan.
