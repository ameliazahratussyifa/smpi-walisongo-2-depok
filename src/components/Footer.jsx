'use client';

import Link from 'next/link';
import { openModal } from '@/lib/modalEvents';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        {/* Col 1: Identity */}
        <div className="footer-brand-col">
          <div className="brand-logo">
            <img
              src="/static/images/logo-sekolah.png"
              alt="Logo SMP Islam Walisongo 2"
              className="brand-emblem"
              style={{ width: '48px', height: '48px' }}
            />
            <div className="brand-text">
              <span className="brand-name" style={{ fontSize: '1rem' }}>SMP ISLAM WALISONGO 2</span>
              <span className="brand-tagline" style={{ color: 'var(--gold-400)' }}>Yayasan PP. Hj. Dardjah Amin</span>
            </div>
          </div>
          <p className="footer-desc">
            Mencetak insan terpelajar berakhlakul karimah, unggul dalam sains teknologi dan mendalam dalam pemahaman Al-Qur&apos;an serta ajaran Islam Ahlussunnah wal Jama&apos;ah.
          </p>
          <div className="footer-npsn-badge">
            ✅ NPSN: 20268571 | Terakreditasi A (Unggul)
          </div>
        </div>

        {/* Col 2: Quick Links */}
        <div>
          <h4 className="footer-col-title">Tautan Cepat</h4>
          <ul className="footer-links-list">
            <li>
              <button
                type="button"
                onClick={() => openModal('ppdbRegister')}
                style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0 }}
              >
                Pendaftaran PPDB 2026/2027
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => openModal('ppdbCheck')}
                style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0 }}
              >
                Cek Status Penerimaan PPDB
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => openModal('raportCheck')}
                style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0 }}
              >
                Verifikasi Raport & Kelulusan
              </button>
            </li>
            <li>
              <button
                type="button"
                onClick={() => openModal('kalkulator')}
                style={{ background: 'none', border: 'none', color: 'inherit', font: 'inherit', cursor: 'pointer', padding: 0 }}
              >
                Simulasi Biaya SPP & Beasiswa
              </button>
            </li>
            <li><Link href="/portal">SIAKAD & CBT Ujian Online</Link></li>
            <li><Link href="/profil#guru">Direktori Dewan Guru</Link></li>
          </ul>
        </div>

        {/* Col 3: Programs */}
        <div>
          <h4 className="footer-col-title">Program Pendidikan</h4>
          <ul className="footer-links-list">
            <li><a href="#program">Tahfidzul Qur&apos;an Bersanad</a></li>
            <li><a href="#program">Digital Smart School & Coding</a></li>
            <li><a href="#program">Bilingual Arabic & English</a></li>
            <li><a href="#ekskul">Pramuka BRAVIA Walisongo 2</a></li>
            <li><a href="#ekskul">Hadroh & Marawis El-Walisongo</a></li>
            <li><a href="#program">Bimbingan Sains & Olimpiade</a></li>
          </ul>
        </div>

        {/* Col 4: Contact & Location */}
        <div>
          <h4 className="footer-col-title">Sekretariat & Lokasi</h4>
          <div className="footer-contact-item">
            <span>📍</span>
            <span>Jl. Cepit Raya, Kp. Sawah RT 005/RW 002, Jatimulya, Kec. Cilodong, Kota Depok, Jawa Barat 16413</span>
          </div>
          <div className="footer-contact-item">
            <span>📞</span>
            <span>(021) 7782 5590 / 0812-9876-5432</span>
          </div>
          <div className="footer-contact-item">
            <span>🕒</span>
            <span>Senin - Sabtu: 07.00 - 16.00 WIB</span>
          </div>
          <div className="footer-contact-item">
            <span>✉️</span>
            <span>smpiwalisongo2@gmail.com</span>
          </div>
        </div>
      </div>

      <div className="container footer-bottom-bar">
        <div>
          © 2026 <strong>SMP Islam Walisongo 2 Depok</strong>. Hak Cipta Dilindungi Undang-Undang.
        </div>
        <div>
          Yayasan Pondok Pesantren Hj. Dardjah Amin • Kota Depok, Jawa Barat •{' '}
          <Link href="/login" style={{ color: '#6ee7b7', textDecoration: 'none', fontWeight: 700 }}>
            🔐 Login Petugas
          </Link>
        </div>
      </div>
    </footer>
  );
}
