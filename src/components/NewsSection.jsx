'use client';

import { useState, useEffect } from 'react';
import { openModal } from '@/lib/modalEvents';

const INITIAL_NEWS = [
  {
    id: 1,
    judul: "Penerimaan Peserta Didik Baru (PPDB) Tahun Ajaran 2026/2027 Resmi Dibuka",
    kategori: "Pengumuman PPDB",
    ringkasan: "SMP Islam Walisongo 2 Depok membuka pendaftaran peserta didik baru gelombang 1 dengan program beasiswa Tahfidz Al-Qur'an dan Jalur Prestasi.",
    penulis: "Panitia PPDB 2026",
    tanggal: "28 Okt 2026",
    gambar: "/static/images/news-ppdb.svg",
    konten: `SMP Islam Walisongo 2 Depok yang berada di bawah naungan Yayasan Pondok Pesantren Hj. Dardjah Amin resmi membuka Penerimaan Peserta Didik Baru (PPDB) untuk Tahun Ajaran 2026/2027.

Pendaftaran gelombang pertama ini memberikan kesempatan khusus bagi calon santri dan siswa berprestasi, meliputi:
1. Jalur Beasiswa Tahfidz Al-Qur'an (Bebas Biaya Uang Pangkal bagi penghafal minimal 2 Juz).
2. Jalur Prestasi Akademik & Non-Akademik (Sains, Olahraga, Seni Kaligrafi, dan Pramuka).
3. Jalur Reguler Terbuka untuk seluruh lulusan SD/MI se-Kota Depok, Bogor, dan Jabodetabek.

Calon peserta didik dapat mendaftar langsung secara daring melalui portal PPDB Online pada website ini.`
  },
  {
    id: 2,
    judul: "Kontingen Pramuka BRAVIA SMP Islam Walisongo 2 Raih Juara Umum Lomba Tingkat Kwarran Cilodong",
    kategori: "Prestasi Siswa",
    ringkasan: "Pasukan Penggalang Pramuka BRAVIA berhasil menorehkan prestasi membanggakan dengan meraih Piala Bergilir Juara Umum.",
    penulis: "Humas & Kesiswaan",
    tanggal: "20 Okt 2026",
    gambar: "/static/images/news-pramuka.svg",
    konten: `Regu Penggalang Pramuka BRAVIA (Barisan Pramuka Walisongo 2) kembali mengukir sejarah prestasi gemilang. Pada ajang Lomba Tingkat Penggalang se-Kwartir Ranting Cilodong Kota Depok, kontingen putra dan putri berhasil menyabet juara pada kategori Pionering Kreatif, Semaphore Cepat, dan Penjelajahan Halang Rintang.

Kepala Sekolah menyampaikan apresiasi setinggi-tingginya kepada seluruh pembina dan anggota Pramuka BRAVIA atas dedikasi dan kedisiplinan yang telah ditunjukkan.`
  },
  {
    id: 3,
    judul: "Peringatan Bulan Bahasa & Gebyar Santri Kreatif: Pentas Sastra, Pidato Tiga Bahasa, dan Kaligrafi",
    kategori: "Kegiatan Kesiswaan",
    ringkasan: "Semarak Bulan Bahasa 2026 diisi dengan penampilan pidato Bahasa Arab, Inggris, Indonesia, dan pameran kaligrafi santri.",
    penulis: "Tim Redaksi",
    tanggal: "15 Okt 2026",
    gambar: "/static/images/news-bulan-bahasa.svg",
    konten: `Dalam rangka memperingati Bulan Bahasa dan Hari Santri Nasional, OSIS dan Dewan Asatidz menyelenggarakan Gebyar Literasi dan Pentas Seni Islam.

Kegiatan ini mencakup:
- Lomba Orasi & Pidato dalam Bahasa Arab (Khitobah) dan English Speech.
- Pameran Seni Kaligrafi Kufi dan Naskhi karya santri kelas 7, 8, dan 9.
- Musabaqah Hifdzil Qur'an (MHQ) antar kelas.`
  }
];

export default function NewsSection() {
  const [newsList, setNewsList] = useState(INITIAL_NEWS);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/berita')
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success' && Array.isArray(res.data) && res.data.length > 0) {
          setNewsList(res.data);
        }
      })
      .catch(() => {});
  }, []);

  const filteredNews = filter === 'all'
    ? newsList
    : newsList.filter(item => item.kategori === filter);

  const handleOpenArticle = (item) => {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('open-article-modal', { detail: item }));
    }
  };

  return (
    <section id="berita" className="section-news">
      <div className="container">
        <div className="section-header-row">
          <div className="header-text-block">
            <span className="section-pill-tag">PUBLIKASI TERKINI</span>
            <h2 className="section-title">Berita & Pengumuman Sekolah</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Informasi resmi, agenda kegiatan kesiswaan, dan catatan prestasi terkini SMP Islam Walisongo 2 Depok.
            </p>
          </div>
          <div>
            <a href="#berita" className="btn-view-all">LIHAT ARSIP BERITA ➔</a>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="news-filter-tabs">
          <button
            className={`news-tab-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            Semua Informasi
          </button>
          <button
            className={`news-tab-btn ${filter === 'Pengumuman PPDB' ? 'active' : ''}`}
            onClick={() => setFilter('Pengumuman PPDB')}
          >
            Pengumuman PPDB
          </button>
          <button
            className={`news-tab-btn ${filter === 'Prestasi Siswa' ? 'active' : ''}`}
            onClick={() => setFilter('Prestasi Siswa')}
          >
            Prestasi Siswa
          </button>
          <button
            className={`news-tab-btn ${filter === 'Kegiatan Kesiswaan' ? 'active' : ''}`}
            onClick={() => setFilter('Kegiatan Kesiswaan')}
          >
            Kegiatan Santri
          </button>
        </div>

        <div className="news-grid">
          {filteredNews.map((b) => (
            <article key={b.id} className="news-card">
              <div className="news-thumb-wrap">
                <img src={b.gambar || '/static/images/news-ppdb.svg'} alt={b.judul} className="news-img" />
                <span className="news-tag-badge">{b.kategori}</span>
              </div>
              <div className="news-content">
                <span className="news-date">📅 {b.tanggal} • Oleh {b.penulis}</span>
                <h3 className="news-card-title">{b.judul}</h3>
                <p className="news-card-excerpt">{b.ringkasan}</p>
                <div>
                  <button
                    type="button"
                    onClick={() => handleOpenArticle(b)}
                    className="news-card-btn"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                  >
                    BACA SELENGKAPNYA ➔
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
