'use client';

import { useState, useEffect } from 'react';

const INITIAL_EKSKUL = [
  {
    nama: "Pramuka BRAVIA (Gugus Depan)",
    kategori: "Kepanduan & Kedisiplinan",
    deskripsi: "Pasukan Penggalang Pramuka terdepan yang melatih kemandirian, kepemimpinan, pionering, dan tali temali dengan tradisi juara.",
    pembina: "Kak Rahmat Hidayat, S.Pd.",
    jadwal: "Setiap Sabtu, 08.00 - 11.00 WIB",
    prestasi: "Juara Umum LT-II Kwarran Cilodong 2026",
    badge: "Unggulan"
  },
  {
    nama: "Tahfidzul Qur'an & Tilawah",
    kategori: "Keagamaan & Qur'ani",
    deskripsi: "Bimbingan menghafal Al-Qur'an dengan metode talaqqi bersanad, fasohah tajwid, dan seni baca Al-Qur'an (tilawah maqamat).",
    pembina: "Ust. Ahmad Zaki Mubarak, Al-Hafidz",
    jadwal: "Senin - Kamis, Ba'da Ashar",
    prestasi: "Juara 1 MTQ & MHQ Pelajar Tingkat Depok",
    badge: "Prioritas"
  },
  {
    nama: "Hadroh & Marawis El-Walisongo",
    kategori: "Seni Musik Islami",
    deskripsi: "Pelatihan vokal shalawat nabawi, rebana klasik, terbang banjari, dan marawis kontemporer yang tampil di berbagai event syiar.",
    pembina: "Ust. Syamsul Bahri",
    jadwal: "Setiap Selasa & Jumat Sore",
    prestasi: "Penampil Utama Gebyar Maulid Nabi Kota Depok",
    badge: "Seni Budaya"
  },
  {
    nama: "IT Club, Robotika & Digital Coding",
    kategori: "Sains & Teknologi",
    deskripsi: "Eksplorasi coding web, logika pemrograman, algoritma dasar, desain grafis Canva/Photoshop, dan perakitan robotika sederhana.",
    pembina: "Fajar Maulana, S.Kom.",
    jadwal: "Setiap Rabu, 14.30 - 16.30 WIB",
    prestasi: "Finalis Inovasi IoT Pelajar Jawa Barat",
    badge: "Digital 4.0"
  },
  {
    nama: "Bela Diri Silat Prestasi",
    kategori: "Olahraga & Seni Beladiri",
    deskripsi: "Pelatihan jurus tradisional nusantara untuk ketangkasan fisik, mental kesatria, pembelaan diri, dan akhlak luhur.",
    pembina: "Pelatih IPSI Depok",
    jadwal: "Setiap Minggu Pagi, 07.30 WIB",
    prestasi: "Medali Emas Kejurda Silat Pelajar Pelajar Depok",
    badge: "Olahraga"
  },
  {
    nama: "English & Arabic Speech Club (Bilingual)",
    kategori: "Bahasa & Komunikasi",
    deskripsi: "Wadah melatih kepercayaan diri dalam public speaking bahasa Inggris dan bahasa Arab melalui debat, pidato, dan storytelling.",
    pembina: "Ustadzah Fatimah Azzahra, Lc.",
    jadwal: "Setiap Kamis, 14.00 - 16.00 WIB",
    prestasi: "Juara 2 Pidato Bahasa Arab Se-Jabodetabek",
    badge: "Bahasa"
  }
];

export default function Ekskul() {
  const [list, setList] = useState(INITIAL_EKSKUL);

  useEffect(() => {
    fetch('/api/ekskul')
      .then(res => res.json())
      .then(res => {
        if (res.status === 'success' && Array.isArray(res.data) && res.data.length > 0) {
          setList(res.data);
        }
      })
      .catch(() => {});
  }, []);

  return (
    <section id="ekskul" style={{ padding: '4.5rem 0', background: '#ffffff' }}>
      <div className="container">
        <div className="section-header-row">
          <div className="header-text-block">
            <span className="section-pill-tag">PENGEMBANGAN MINAT & BAKAT</span>
            <h2 className="section-title">Ekstrakurikuler Pilihan Santri Berprestasi</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Menyalurkan bakat dan hobi santri secara positif, terarah, serta menghasilkan prestasi di tingkat kota maupun provinsi.
            </p>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
          {list.map((e, idx) => (
            <div
              key={idx}
              style={{
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '16px',
                padding: '1.5rem',
                transition: 'all 0.25s ease',
              }}
              className="ekskul-card"
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ background: '#e0f2fe', color: '#0369a1', fontSize: '0.75rem', fontWeight: 800, padding: '0.25rem 0.65rem', borderRadius: '999px' }}>
                  {e.kategori}
                </span>
                <span style={{ background: '#fef3c7', color: '#b45309', fontSize: '0.75rem', fontWeight: 700, padding: '0.25rem 0.5rem', borderRadius: '6px' }}>
                  {e.badge}
                </span>
              </div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem' }}>
                {e.nama}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#64748b', lineHeight: 1.6, marginBottom: '1rem' }}>
                {e.deskripsi}
              </p>
              <div style={{ borderTop: '1px dashed #cbd5e1', paddingTop: '0.75rem', fontSize: '0.8rem', color: '#334155' }}>
                <p style={{ margin: '0.2rem 0' }}><strong>Pembina:</strong> {e.pembina}</p>
                <p style={{ margin: '0.2rem 0' }}><strong>Jadwal:</strong> {e.jadwal}</p>
                {e.prestasi && (
                  <p style={{ color: '#0284c7', fontWeight: 700, marginTop: '0.35rem' }}>
                    🏅 {e.prestasi}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
