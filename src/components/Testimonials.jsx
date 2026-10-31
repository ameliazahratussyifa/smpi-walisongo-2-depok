'use client';

const TESTIMONIALS = [
  {
    nama: "H. Bambang Sulistyo",
    status: "Orang Tua Siswa",
    angkatan_relasi: "Ayahanda dari M. Farhan (Kelas 9)",
    pesan: "Alhamdulillah, sejak menyekolahkan anak di SMP Islam Walisongo 2 Depok, perubahan adab dan kedisiplinan sholatnya sangat terasa. Hafalan Qur'an bertambah 3 Juz dan nilai akademiknya sangat memuaskan.",
    avatar_initials: "BS"
  },
  {
    nama: "Nadia Salsabila",
    status: "Alumni Angkatan 2024",
    angkatan_relasi: "Kini melanjutkan di MAN Insan Cendekia Serpong",
    pesan: "Pondasi ilmu agama dan kepemimpinan di Pramuka BRAVIA Walisongo 2 sangat membekas dalam diri saya. Guru-gurunya sabar, peduli, dan selalu memotivasi santri untuk berprestasi di tingkat nasional.",
    avatar_initials: "NS"
  },
  {
    nama: "Ibu Hj. Ratna Juwita",
    status: "Orang Tua Siswa",
    angkatan_relasi: "Ibunda dari Kayla Az-Zahra (Kelas 8)",
    pesan: "Program Digital Smart School dan Tahfidznya berimbang sekali. Anak tidak hanya mahir menghafal ayat-ayat suci Al-Qur'an, tapi juga diajarkan coding dan bahasa asing. Fasilitasnya lengkap dan transparan.",
    avatar_initials: "RJ"
  },
  {
    nama: "Rayhan Pratama Putra",
    status: "Alumni & Mahasiswa UI Depok",
    angkatan_relasi: "Alumni SMP Islam Walisongo 2 Depok",
    pesan: "SMP Islam Walisongo 2 Depok adalah tempat terbaik yang menempa karakter saya sejak remaja. Lingkungan yang islami dan suportif mengantarkan saya hingga diterima di kampus impian.",
    avatar_initials: "RP"
  }
];

export default function Testimonials() {
  return (
    <section className="section-testimonials">
      <div className="container">
        <div className="section-header-row">
          <div className="header-text-block">
            <span className="section-pill-tag">SUARA SIVITAS & ALUMNI</span>
            <h2 className="section-title">Cerita dari Siswa, Wali Murid & Alumni</h2>
            <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
              Pengalaman nyata belajar, bertumbuh, menghafal Al-Qur&apos;an, dan meraih prestasi di lingkungan asri SMP Islam Walisongo 2 Depok.
            </p>
          </div>
        </div>

        <div className="testimonials-grid">
          {TESTIMONIALS.map((t, idx) => (
            <div key={idx} className="testimonial-card">
              <div>
                <div className="quote-icon-mark">&ldquo;</div>
                <p className="testimonial-text">{t.pesan}</p>
              </div>
              <div className="testimonial-author-meta">
                <div className="author-avatar-circle">{t.avatar_initials}</div>
                <div>
                  <div className="author-name">{t.nama}</div>
                  <div className="author-sub">{t.status} • {t.angkatan_relasi}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
