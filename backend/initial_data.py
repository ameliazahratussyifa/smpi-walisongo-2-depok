"""
Authentic seed data for SMP Islam Walisongo 2 Depok.
Populates initial database records if empty.
"""
from backend.database import get_db_connection, init_db

def seed_data():
    init_db()
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Seed Berita & Informasi
    cursor.execute("SELECT COUNT(*) FROM berita")
    if cursor.fetchone()[0] == 0:
        berita_list = [
            (
                "Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027 Resmi Dibuka",
                "ppdb-2026-2027-resmi-dibuka",
                "Pengumuman PPDB",
                "SMP Islam Walisongo 2 Depok membuka pendaftaran peserta didik baru gelombang 1 dengan program beasiswa Tahfidz Al-Qur'an dan Jalur Prestasi.",
                """SMP Islam Walisongo 2 Depok yang berada di bawah naungan Yayasan Pondok Pesantren Hj. Dardjah Amin resmi membuka Penerimaan Peserta Didik Baru (PPDB) untuk Tahun Ajaran 2026/2027.

Pendaftaran gelombang pertama ini memberikan kesempatan khusus bagi calon santri dan siswa berprestasi, meliputi:
1. Jalur Beasiswa Tahfidz Al-Qur'an (Bebas Biaya Uang Pangkal bagi penghafal minimal 2 Juz).
2. Jalur Prestasi Akademik & Non-Akademik (Sains, Olahraga, Seni Kaligrafi, dan Pramuka).
3. Jalur Reguler Terbuka untuk seluruh lulusan SD/MI se-Kota Depok, Bogor, dan Jabodetabek.

Calon peserta didik dapat mendaftar langsung secara daring melalui portal PPDB Online pada website ini atau mengunjungi sekretariat panitia di Kampus SMP Islam Walisongo 2 Depok, Jl. Cepit Raya Kp. Sawah RT. 005/002, Jatimulya, Cilodong, Depok.""",
                "Panitia PPDB 2026",
                "28 Okt 2026",
                "/static/images/news-ppdb.svg",
                1
            ),
            (
                "Kontingen Pramuka BRAVIA SMP Islam Walisongo 2 Raih Juara Umum Lomba Tingkat Kwarran Cilodong",
                "pramuka-bravia-raih-juara-umum-cilodong",
                "Prestasi Siswa",
                "Pasukan Penggalang Pramuka BRAVIA berhasil menorehkan prestasi membanggakan dengan meraih Piala Bergilir Juara Umum.",
                """Regu Penggalang Pramuka BRAVIA (Barisan Pramuka Walisongo 2) kembali mengukir sejarah prestasi gemilang. Pada ajang Lomba Tingkat Penggalang se-Kwartir Ranting Cilodong Kota Depok, kontingen putra dan putri berhasil menyabet juara pada kategori Pionering Kreatif, Semaphore Cepat, dan Penjelajahan Halang Rintang.

Kepala Sekolah SMP Islam Walisongo 2 Depok, Ibu Aida Suryaningsih, S.Pd.I, menyampaikan apresiasi setinggi-tingginya kepada seluruh pembina dan anggota Pramuka BRAVIA atas dedikasi dan kedisiplinan yang telah ditunjukkan.""",
                "Humas & Kesiswaan",
                "20 Okt 2026",
                "/static/images/news-pramuka.svg",
                1
            ),
            (
                "Peringatan Bulan Bahasa & Gebyar Santri Kreatif: Pentas Sastra, Pidato Tiga Bahasa, dan Kaligrafi",
                "bulan-bahasa-gebyar-santri-kreatif",
                "Kegiatan Kesiswaan",
                "Semarak Bulan Bahasa 2026 diisi dengan penampilan pidato Bahasa Arab, Inggris, Indonesia, dan pameran kaligrafi santri.",
                """Dalam rangka memperingati Bulan Bahasa dan Hari Santri Nasional, OSIS dan Dewan Asatidz menyelenggarakan Gebyar Literasi dan Pentas Seni Islam.

Kegiatan ini mencakup:
- Lomba Orasi & Pidato dalam Bahasa Arab (Khitobah) dan English Speech.
- Pameran Seni Kaligrafi Kufi dan Naskhi karya santri kelas 7, 8, dan 9.
- Musabaqah Hifdzil Qur'an (MHQ) antar kelas.

Acara dibuka oleh Pimpinan Yayasan Pondok Pesantren Hj. Dardjah Amin dan disambut antusias oleh seluruh dewan guru dan wali murid.""",
                "Tim Redaksi",
                "15 Okt 2026",
                "/static/images/news-bulan-bahasa.svg",
                0
            ),
            (
                "Implementasi Digital Smart School: Pelatihan Coding dan Robotika bagi Santri Muda",
                "digital-smart-school-coding-robotika",
                "Inovasi Edukasi",
                "SMP Islam Walisongo 2 Depok memperkuat kurikulum abad 21 dengan menghadirkan ekstrakurikuler Coding, Web Design, dan IoT.",
                """Sebagai wujud komitmen memadukan nilai keislaman dan kemajuan teknologi mutakhir, SMP Islam Walisongo 2 Depok mengintegrasikan program Literasi Digital dan Robotika ke dalam kegiatan ekstrakurikuler unggulan.

Siswa diajarkan logika pemrograman visual, perakitan mikrokontroler Arduino untuk smart lamp pesantren, dan pembuatan website edukatif bernilai positif.""",
                "Laboratorium IT",
                "05 Okt 2026",
                "/static/images/news-coding.svg",
                0
            ),
            (
                "Khotmil Qur'an dan Doa Bersama Jelang Asesmen Sumatif Tengah Semester",
                "khotmil-quran-dan-doa-bersama-ast",
                "Keagamaan",
                "Seluruh santriwati dan santriwan melantunkan ayat suci Al-Qur'an secara serentak dalam majelis khotmil Qur'an berkah.",
                """Kegiatan rutin pembiasaan keagamaan di SMP Islam Walisongo 2 Depok mencakup Sholat Dhuha berjamaah setiap pagi, dilanjutkan dengan tilawah one day one juz serta kajian akhlak tasawuf praktis.

Majelis Khotmil Qur'an kali ini dipimpin oleh Asatidz Pengasuh Tahfidz sebagai ikhtiar batin memohon kemudahan dan keberkahan dalam menempuh asesmen akademik.""",
                "Kesiswaan & Tahfidz",
                "25 Sep 2026",
                "/static/images/news-tahfidz.svg",
                0
            )
        ]
        cursor.executemany("""
        INSERT INTO berita (judul, slug, kategori, ringkasan, konten, penulis, tanggal, gambar, is_featured)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, berita_list)

    # 2. Seed Guru & Dewan Pendidik
    cursor.execute("SELECT COUNT(*) FROM guru")
    if cursor.fetchone()[0] == 0:
        guru_list = [
            ("Aida Suryaningsih, S.Pd.I", "Kepala Sekolah", "Manajemen Pendidikan & PAI", "S1 Pendidikan Agama Islam", "/static/images/guru-kepsek.svg", 1),
            ("Ust. Imam Awaludin, S.Pd.", "Wakil Kepala Sekolah Bidang Kurikulum", "Matematika & Fiqih", "S1 Pendidikan Matematika", "/static/images/guru-1.svg", 2),
            ("Ust. Ahmad Zaki Mubarak, Al-Hafidz", "Kepala Program Tahfidzul Qur'an", "Tahfidz & Tajwid Bersanad", "S1 Ilmu Al-Qur'an & Tafsir", "/static/images/guru-2.svg", 3),
            ("Siti Nurkhalizah, S.Pd., M.M.", "Wakasek Kesiswaan & Pembina OSIS", "Bahasa Indonesia & Literasi", "S2 Manajemen Pendidikan", "/static/images/guru-3.svg", 4),
            ("Fajar Maulana, S.Kom.", "Kepala Lab Komputer & Pembina IT Club", "Informatika & Robotika", "S1 Teknik Informatika", "/static/images/guru-4.svg", 5),
            ("Ustadzah Fatimah Azzahra, Lc.", "Koordinator Bahasa Asing", "Bahasa Arab & Hadits", "S1 Universitas Al-Azhar Kairo / LIPIA", "/static/images/guru-5.svg", 6),
            ("Drs. H. Mulyadi Kartasasmita", "Guru Senior Ilmu Pengetahuan Alam", "Ilmu Pengetahuan Alam (IPA Terpadu)", "S1 Pendidikan Biologi", "/static/images/guru-6.svg", 7),
            ("Rahmat Hidayat, S.Pd.", "Koordinator Ekstrakurikuler & Pembina Pramuka", "Pendidikan Jasmani & Kepramukaan", "S1 Pendidikan Jasmani & Olahraga", "/static/images/guru-7.svg", 8)
        ]
        cursor.executemany("""
        INSERT INTO guru (nama, jabatan, bidang_studi, pendidikan, foto, urutan)
        VALUES (?, ?, ?, ?, ?, ?)
        """, guru_list)

    # 3. Seed Ekstrakurikuler
    cursor.execute("SELECT COUNT(*) FROM ekskul")
    if cursor.fetchone()[0] == 0:
        ekskul_list = [
            (
                "Pramuka BRAVIA (Gugus Depan)",
                "Kepanduan & Kedisiplinan",
                "Pasukan Penggalang Pramuka terdepan yang melatih kemandirian, kepemimpinan, pionering, dan tali temali dengan tradisi juara.",
                "Kak Rahmat Hidayat, S.Pd.",
                "Setiap Sabtu, 08.00 - 11.00 WIB",
                "Juara Umum LT-II Kwarran Cilodong 2026",
                "camp",
                "Unggulan"
            ),
            (
                "Tahfidzul Qur'an & Tilawah",
                "Keagamaan & Qur'ani",
                "Bimbingan menghafal Al-Qur'an dengan metode talaqqi bersanad, fasohah tajwid, dan seni baca Al-Qur'an (tilawah maqamat).",
                "Ust. Ahmad Zaki Mubarak, Al-Hafidz",
                "Senin - Kamis, Ba'da Ashar",
                "Juara 1 MTQ & MHQ Pelajar Tingkat Depok",
                "book-open",
                "Prioritas"
            ),
            (
                "Hadroh & Marawis El-Walisongo",
                "Seni Musik Islami",
                "Pelatihan vokal shalawat nabawi, rebana klasik, terbang banjari, dan marawis kontemporer yang tampil di berbagai event syiar.",
                "Ust. Syamsul Bahri",
                "Setiap Selasa & Jumat Sore",
                "Penampil Utama Gebyar Maulid Nabi Kota Depok",
                "music",
                "Seni Budaya"
            ),
            (
                "IT Club, Robotika & Digital Coding",
                "Sains & Teknologi",
                "Eksplorasi coding web, logika pemrograman, algoritma dasar, desain grafis Canva/Photoshop, dan perakitan robotika sederhana.",
                "Fajar Maulana, S.Kom.",
                "Setiap Rabu, 14.30 - 16.30 WIB",
                "Finalis Inovasi IoT Pelajar Jawa Barat",
                "cpu",
                "Digital 4.0"
            ),
            (
                "Bela Diri Silat Prestasi",
                "Olahraga & Seni Beladiri",
                "Pelatihan jurus tradisional nusantara untuk ketangkasan fisik, mental kesatria, pembelaan diri, dan akhlak luhur.",
                "Pelatih IPSI Depok",
                "Setiap Minggu Pagi, 07.30 WIB",
                "Medali Emas Kejurda Silat Pelajar Pelajar Depok",
                "shield",
                "Olahraga"
            ),
            (
                "English & Arabic Speech Club (Bilingual)",
                "Bahasa & Komunikasi",
                "Wadah melatih kepercayaan diri dalam public speaking bahasa Inggris dan bahasa Arab melalui debat, pidato, dan storytelling.",
                "Ustadzah Fatimah Azzahra, Lc.",
                "Setiap Kamis, 14.00 - 16.00 WIB",
                "Juara 2 Pidato Bahasa Arab Se-Jabodetabek",
                "globe",
                "Bahasa"
            ),
            (
                "Futsal & Basket Walisongo Warrior",
                "Olahraga Prestasi",
                "Klub futsal dan basket dengan pembinaan taktik, stamina, kerja sama tim, dan sportivitas tinggi di lapangan olahraga sekolah.",
                "Coach Danu Saputra",
                "Setiap Selasa & Jumat Sore",
                "Semifinalis Futsal Cup Pelajar Cilodong",
                "award",
                "Sport"
            ),
            (
                "PMR (Palang Merah Remaja) & Paskibra",
                "Sosial & Nasionalisme",
                "Pelatihan pertolongan pertama pada kecelakaan (P3K), kesiapsiagaan bencana, donor darah, dan tata upacara bendera presisi.",
                "Ns. Dewi Anggraini, S.Kep.",
                "Setiap Senin, 14.30 - 16.30 WIB",
                "Regu Pengibar Bendera Terbaik Hari Kemerdekaan",
                "heart-pulse",
                "Sosial"
            )
        ]
        cursor.executemany("""
        INSERT INTO ekskul (nama, kategori, deskripsi, pembina, jadwal, prestasi, icon, badge)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, ekskul_list)

    # 4. Seed Testimoni
    cursor.execute("SELECT COUNT(*) FROM testimoni")
    if cursor.fetchone()[0] == 0:
        testimoni_list = [
            (
                "H. Bambang Sulistyo",
                "Orang Tua Siswa",
                "Ayahanda dari M. Farhan (Kelas 9)",
                "Alhamdulillah, sejak menyekolahkan anak di SMP Islam Walisongo 2 Depok, perubahan adab dan kedisiplinan sholatnya sangat terasa. Hafalan Qur'an bertambah 3 Juz dan nilai akademiknya sangat memuaskan.",
                5,
                "BS"
            ),
            (
                "Nadia Salsabila",
                "Alumni Angkatan 2024",
                "Kini melanjutkan di MAN Insan Cendekia Serpong",
                "Pondasi ilmu agama dan kepemimpinan di Pramuka BRAVIA Walisongo 2 sangat membekas dalam diri saya. Guru-gurunya sabar, peduli, dan selalu memotivasi santri untuk berprestasi di tingkat nasional.",
                5,
                "NS"
            ),
            (
                "Ibu Hj. Ratna Juwita",
                "Orang Tua Siswa",
                "Ibunda dari Kayla Az-Zahra (Kelas 8)",
                "Program Digital Smart School dan Tahfidznya berimbang sekali. Anak tidak hanya mahir menghafal ayat-ayat suci Al-Qur'an, tapi juga diajarkan coding dan bahasa asing. Fasilitasnya lengkap dan transparan.",
                5,
                "RJ"
            ),
            (
                "Rayhan Pratama Putra",
                "Alumni & Mahasiswa UI Depok",
                "Alumni SMP Islam Walisongo 2 Depok",
                "SMP Islam Walisongo 2 Depok adalah tempat terbaik yang menempa karakter saya sejak remaja. Lingkungan yang islami dan suportif mengantarkan saya hingga diterima di kampus impian.",
                5,
                "RP"
            )
        ]
        cursor.executemany("""
        INSERT INTO testimoni (nama, status, angkatan_relasi, pesan, rating, avatar_initials)
        VALUES (?, ?, ?, ?, ?, ?)
        """, testimoni_list)

    # 5. Seed Demo Siswa untuk Pengecekan Raport & Status Kelulusan
    cursor.execute("SELECT COUNT(*) FROM siswa_raport")
    if cursor.fetchone()[0] == 0:
        siswa_list = [
            ("0091234567", "Muhammad Rizky Pratama", "Kelas 9A", "Genap", "2025/2026", "LULUS DENGAN PREDIKAT TERBAIK", 95, 92, 90, 89, 94, 91, 88, "Juz 30, Juz 29, Juz 1 (Mutqin)", "Sangat Baik (A)"),
            ("0089876543", "Aisyah Putri Azzahra", "Kelas 9B", "Genap", "2025/2026", "LULUS DENGAN PREDIKAT CUM LAUDE", 98, 95, 92, 96, 90, 93, 91, "Juz 30, Juz 1, Juz 2, Juz 3 (Mumtaz)", "Sangat Baik (A)"),
            ("0076543210", "Fadhil Abdillah", "Kelas 8A", "Ganjil", "2026/2027", "NAIK KE KELAS TINGKAT LANJUT", 88, 87, 85, 84, 86, 85, 84, "Juz 30 (Lancar)", "Baik (B)")
        ]
        cursor.executemany("""
        INSERT INTO siswa_raport (nisn, nama_siswa, kelas, semester, tahun_ajaran, status_kelulusan, nilai_pabp, nilai_ppkn, nilai_bindo, nilai_binggris, nilai_matematika, nilai_ipa, nilai_ips, nilai_tahfidz, akhlak)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, siswa_list)

    # 6. Seed Demo PPDB untuk Status Tracker
    cursor.execute("SELECT COUNT(*) FROM ppdb_pendaftar")
    if cursor.fetchone()[0] == 0:
        demo_ppdb = [
            (
                "REG-2026-WS001",
                "Ahmad Althaf Al-Farizi",
                "0095551234",
                "3276011204090001",
                "Laki-laki",
                "Depok",
                "2013-05-12",
                "SDIT Nurul Fikri Depok",
                "Dr. Hendra Gunawan",
                "081288889999",
                "Jl. Raya Bogor KM 35, Cilodong, Kota Depok",
                "Jalur Beasiswa Tahfidz",
                "Kelas Tahfidz & IT",
                "Diterima (Tahap 1)",
                "Berkas terverifikasi lengkap. Tes wawancara hafalan telah lulus predikat A."
            ),
            (
                "REG-2026-WS002",
                "Zaskia Nur Ramadhani",
                "0097772345",
                "3276015509100002",
                "Perempuan",
                "Jakarta",
                "2013-08-20",
                "MI Al-Hidayah Sukmajaya",
                "Hj. Endang Rahmawati",
                "085711223344",
                "Jl. Tole Iskandar No. 42, Sukmajaya, Depok",
                "Jalur Prestasi",
                "Kelas Bilingual & Sains",
                "Menunggu Seleksi Wawancara",
                "Jadwal wawancara dijadwalkan hari Sabtu, 10 November 2026 pukul 09.00 WIB."
            )
        ]
        cursor.executemany("""
        INSERT INTO ppdb_pendaftar (nomor_registrasi, nama_lengkap, nisn, nik, jenis_kelamin, tempat_lahir, tanggal_lahir, asal_sekolah, nama_wali, no_wa_wali, alamat_lengkap, jalur_pendaftaran, pilihan_peminatan, status_seleksi, catatan)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, demo_ppdb)

    # 7. Seed Akun Master & Admin
    from backend.auth import hash_password
    cursor.execute("SELECT COUNT(*) FROM users")
    if cursor.fetchone()[0] == 0:
        default_users = [
            (
                "master",
                hash_password("MasterWalisongo2026!"),
                "Master Administrator (Super Admin)",
                "master",
                "master@smpiwalisongo2depok.sch.id",
                1
            ),
            (
                "admin",
                hash_password("AdminWalisongo2026!"),
                "Admin Staf TU & Panitia PPDB",
                "admin",
                "admin@smpiwalisongo2depok.sch.id",
                1
            )
        ]
        cursor.executemany("""
        INSERT INTO users (username, password_hash, nama_lengkap, role, email, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
        """, default_users)

    conn.commit()
    conn.close()

if __name__ == "__main__":
    seed_data()
    print("All initial authentic data for SMP Islam Walisongo 2 Depok seeded successfully!")
