Simulasi Serangan Man-in-the-Middle pada Protokol Diffie-Hellman
DISUSUN OLEH:
Kelompok 16
1.	Herlita				(G1A023018)
2.	Muhammad Sahlan Habibi		(G1A023058)
3.	Revialdi Rifqi Ramadhan P		(G1A023066)
4.	Rahma Hidayati Fitrah		(G1A023074)
5.	M. Ihtifanul Montaghib		(G1A023094)
DOSEN PENGAMPU: Kurnia Anggriani, S.T., M.T., Ph.D

Tujuan Penelitian
Mengimplementasikan simulasi serangan MITM pada protokol Diffie-Hellman
Menganalisis dampak serangan terhadap keamanan komunikasi
Memberikan rekomendasi pencegahan

Konsep Dasar yang Harus Dipahami
Protokol Diffie-Hellman
Fungsi Utama: Pertukaran kunci rahasia melalui saluran komunikasi terbuka
Prinsip Matematika: Berdasarkan aritmetika modular dan masalah logaritma diskrit
Parameter Kunci:
p = 23 (bilangan prima sebagai modulus)
g = 5 (generator)

Keunggulan: Tidak perlu pertukaran kunci secara langsung
Kelemahan Fatal: Tidak ada mekanisme autentikasi identitas

Serangan Man-in-the-Middle (MITM)
Definisi: Penyerang menyusup dalam komunikasi antara dua pihak yang sah
Mekanisme: Penyerang berpura-pura menjadi masing-masing pihak kepada lawan bicaranya
Dampak: Semua komunikasi dapat disadap, dibaca, dan dimodifikasi tanpa terdeteksi

Implementasi Teknis
Arsitektur Sistem
Lita (Client A) ←→ Ifan (Attacker) ←→ Rahma (Client B)
Tiga Fase Serangan

Fase Inisialisasi:
Generate parameter DH (p=23, g=5)
Buat kunci privat dan publik untuk setiap peserta

Fase Serangan MITM:
Attacker mencegat public key dari kedua client
Attacker mengirim fake public key kepada masing-masing peserta
Attacker menghitung dua shared secret berbeda

Fase Pertukaran Pesan:
Attacker mendekripsi pesan dengan shared secret pengirim
Attacker membaca isi pesan
Attacker mengenkripsi ulang dengan shared secret penerima

Teknologi yang Digunakan
Frontend: HTML5, CSS3, JavaScript
Algoritma Enkripsi: XOR Cipher (untuk demonstrasi)
Metode Perhitungan: Eksponensial modular

3. Hasil Pengujian Kritis
Tingkat Keberhasilan Serangan
Keberhasilan Intersepsi: 100%
Tingkat Deteksi oleh Korban: 0%
Kemampuan Modifikasi Pesan: 100%
Kontrol Komunikasi: Penuh

Performa Sistem
Waktu Inisialisasi: 2-5 milidetik
Waktu Perhitungan Shared Secret: 1-3 milidetik
Waktu Enkripsi/Dekripsi: 0.5-1 milidetik
Penggunaan Memori: ~1KB
Penggunaan CPU: ~0.1%

4. Analisis Kelemahan Sistem
Kelemahan Fundamental

ambil dari word

Kelemahan Implementasi
Parameter p terlalu kecil (p=23): Rentan brute force
XOR Cipher tidak aman: Hanya untuk demonstrasi
Tidak ada Key Derivation Function (KDF)
Tidak ada Forward Secrecy

Implikasi Keamanan
Skenario Serangan Berhasil
Semua pesan dapat dibaca dalam bentuk teks asli
Penyerang dapat memodifikasi isi komunikasi
Korban tidak menyadari adanya pihak ketiga
Tidak ada mekanisme pemulihan atau deteksi

Dampak di Dunia Nyata
Pencurian data sensitif: Login credentials, informasi pribadi
Manipulasi transaksi: Perbankan online, e-commerce
Penyalahgunaan komunikasi: Pesan instan, email

Rekomendasi Perbaikan
Solusi Jangka Pendek
Implementasi PKI (Public Key Infrastructure)
Autentikasi berbasis sertifikat digital
Penggunaan parameter yang lebih besar (p minimal 2048-bit)
Algoritma enkripsi yang lebih kuat (AES, RSA)

Solusi Jangka Panjang
Perfect Forward Secrecy (PFS)
Mutual Authentication
Certificate Pinning
Quantum-resistant algorithms (persiapan masa depan)

7. Kesimpulan Utama
Efisiensi vs Keamanan
Efisiensi: Sangat tinggi (cocok untuk simulasi pembelajaran)
Keamanan: Sangat rendah (tidak layak untuk implementasi nyata)

Pembelajaran Penting
Protokol Diffie-Hellman dasar TIDAK AMAN tanpa autentikasi
Serangan MITM dapat dilakukan dengan mudah dan efektif
Autentikasi identitas adalah komponen kritis dalam komunikasi aman
Parameter kriptografi harus cukup besar untuk keamanan praktis

Relevansi Praktis
Aplikasi yang Terpengaruh
HTTPS tanpa certificate validation
VPN dengan konfigurasi lemah
SSH tanpa host key verification
WhatsApp, Telegram (jika implementasi tidak proper)

Pentingnya Edukasi
Mahasiswa/praktisi perlu memahami kerentanan dasar
Simulasi membantu visualisasi serangan
Pemahaman teoritis harus dibarengi implementasi praktis
