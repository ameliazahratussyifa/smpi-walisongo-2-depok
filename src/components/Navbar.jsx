'use client';

import { useState } from 'react';
import Link from 'next/link';
import { openModal } from '@/lib/modalEvents';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* TOPBAR */}
      <header className="topbar">
        <div className="container topbar-wrapper">
          <div className="topbar-contact">
            <span className="topbar-item">
              📞 <strong>(021) 7782 5590</strong>
            </span>
            <span className="topbar-item">
              💬 WA: <strong>0812-9876-5432</strong>
            </span>
            <span className="topbar-item topbar-email-item">
              ✉️ smpiwalisongo2@gmail.com
            </span>
          </div>

          <div className="topbar-actions">
            <span className="topbar-badge">
              🛡️ NPSN: 20268571 • Akreditasi A
            </span>
            <Link href="/login" className="topbar-link" title="Akses Masuk Petugas & Admin CMS">
              🔐 Portal Login Admin
            </Link>
            <button
              onClick={() => openModal('mobileSimulator')}
              className="btn-mobile-mode"
              style={{ padding: '0.15rem 0.6rem', fontSize: '0.75rem' }}
            >
              📱 Tampilan Mobile App
            </button>
          </div>
        </div>
      </header>

      {/* MAIN NAVIGATION */}
      <nav className="main-nav">
        <div className="container nav-container">
          <Link href="/" className="brand-logo" title="Beranda SMP Islam Walisongo 2 Depok">
            <img
              src="/static/images/logo-sekolah.png"
              alt="Logo SMP Islam Walisongo 2 Depok"
              className="brand-emblem"
            />
            <div className="brand-text">
              <span className="brand-name">SMP ISLAM WALISONGO 2</span>
              <span className="brand-tagline">KOTA DEPOK • JAWA BARAT</span>
            </div>
          </Link>

          <ul className={`nav-menu ${mobileMenuOpen ? 'open' : ''}`}>
            <li className="nav-item">
              <Link href="/" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Beranda
              </Link>
            </li>
            <li className="nav-item">
              <a href="#sambutan" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Profil
              </a>
            </li>
            <li className="nav-item">
              <a href="#program" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Program
              </a>
            </li>
            <li className="nav-item">
              <a href="#ekskul" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Ekstrakurikuler
              </a>
            </li>
            <li className="nav-item">
              <a href="#berita" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Berita
              </a>
            </li>
            <li className="nav-item">
              <a href="#lokasi" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Peta Kampus
              </a>
            </li>
            <li className="nav-item">
              <a href="#kontak" className="nav-link" onClick={() => setMobileMenuOpen(false)}>
                Kontak
              </a>
            </li>
          </ul>

          <div className="nav-cta-wrapper">
            <button
              onClick={() => openModal('ppdbCheck')}
              className="btn-nav-outline"
              title="Lacak Pendaftaran PPDB"
            >
              🔍 Cek Status
            </button>
            <button
              onClick={() => openModal('ppdbRegister')}
              className="btn-nav-primary"
              title="Daftar Siswa Baru 2026/2027"
            >
              Daftar PPDB ➔
            </button>
            <button
              className="hamburger-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Buka Menu"
            >
              <span></span>
              <span></span>
              <span></span>
            </button>
          </div>
        </div>
      </nav>
    </>
  );
}
