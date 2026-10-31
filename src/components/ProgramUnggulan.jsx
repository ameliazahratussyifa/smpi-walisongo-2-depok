'use client';

import Link from 'next/link';
import { openModal } from '@/lib/modalEvents';

export default function ProgramUnggulan() {
  const programs = [
    {
      level: "Reguler & Khusus",
      badge: "Prioritas Utama",
      name: "Tahfidzul Qur'an & Tilawah",
      summary: "Program hafalan Al-Qur'an dengan bimbingan metode talaqqi bersanad, perbaikan makharijul huruf, tajwid mutqin, serta tradisi One Day One Maqra' dan khotmil Qur'an terpadu.",
      actionText: "Daftar Jalur Tahfidz ➔"
    },
    {
      level: "Digital Smart School",
      badge: "Inovasi 4.0",
      name: "Digital IT & Coding Club",
      summary: "Laboratorium komputer modern dengan materi logika koding, pemrograman web dasar, Scratch, desain grafis multimedia, dan pengenalan robotika aplikatif untuk generasi santri cerdas digital.",
      actionText: "Pelajari Fasilitas Lab ➔"
    },
    {
      level: "Bilingual",
      badge: "Global Ready",
      name: "Bilingual Arabic & English",
      summary: "Wadah pengembangan kemampuan public speaking, khitobah (pidato bahasa Arab), English debate, dan pembiasaan percakapan sehari-hari dalam lingkungan pesantren yang suportif.",
      actionText: "Kurikulum Bahasa ➔"
    },
    {
      level: "Karakter Santri",
      badge: "Ahlussunnah wal Jama'ah",
      name: "Adab & Amaliyah Aswaja",
      summary: "Pembiasaan sholat Dhuha serentak, sholat fardhu berjamaah di masjid pesantren Hj. Dardjah Amin, kajian hadits arba'in, kitab akhlaq lil banin/banat, dan penanaman birrul walidain.",
      actionText: "Pembiasaan Ibadah ➔"
    },
    {
      level: "Kepramukaan",
      badge: "Tradisi Juara",
      name: "Pramuka BRAVIA Walisongo",
      summary: "Gugus Depan Penggalang berprestasi Juara Umum Kwarran Cilodong. Melatih ketangkasan pionering, sandi semaphore, survival camp, kemandirian, dan kepemimpinan tangguh.",
      actionText: "Prestasi Pramuka ➔"
    },
    {
      level: "Sains Terpadu",
      badge: "Kompetitif",
      name: "Klinik OSN & Sains Madrasah",
      summary: "Bimbingan intensif bagi siswa berbakat dalam bidang Matematika, IPA, dan IPS Terpadu untuk berkompetisi di ajang Olimpiade Sains Nasional (OSN) dan KSM Kemenag.",
      actionText: "Jalur Prestasi OSN ➔"
    }
  ];

  return (
    <section id="program" className="section-programs">
      <div className="container">
        <div className="section-header-row">
          <div className="header-text-block">
            <span className="section-pill-tag">PILIHAN AKADEMIK & TAHFIDZ</span>
            <h2 className="section-title">Program Unggulan Pendidikan Berkualitas</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Kurikulum yang dirancang terpadu guna membekali santri keunggulan spiritual, kognitif, dan kecakapan masa depan.
            </p>
          </div>
          <div>
            <Link href="/profil" className="btn-view-all">
              LIHAT PROFIL LENGKAP ➔
            </Link>
          </div>
        </div>

        <div className="programs-grid">
          {programs.map((item, idx) => (
            <div key={idx} className="program-card">
              <div className="program-top-meta">
                <span className="program-level-tag">{item.level}</span>
                <span className="program-badge-status">{item.badge}</span>
              </div>
              <h3 className="program-name">{item.name}</h3>
              <p className="program-summary">{item.summary}</p>
              <div className="program-card-footer">
                <button
                  type="button"
                  onClick={() => openModal('ppdbRegister')}
                  className="link-program-detail"
                  style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
                >
                  {item.actionText}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
