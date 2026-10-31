'use client';

import Link from 'next/link';
import { openModal } from '@/lib/modalEvents';

export default function PortalCards() {
  return (
    <section className="floating-portal-section">
      <div className="container">
        <div className="portal-box-wrapper">
          <div className="portal-header-pill">
            <span className="portal-badge-label">PORTAL LAYANAN TERPADU</span>
            <h2 className="portal-main-heading">Akses Cepat Sistem Informasi & Akademik Sekolah</h2>
          </div>

          <div className="portal-grid">
            {/* 1. SIAKAD */}
            <Link href="/portal#siakad" className="portal-card-btn">
              <div className="portal-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
                  <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
                </svg>
              </div>
              <span className="portal-title">SIAKAD</span>
            </Link>

            {/* 2. PPDB Online */}
            <button
              type="button"
              onClick={() => openModal('ppdbRegister')}
              className="portal-card-btn"
              style={{ background: 'none', border: 'none', textAlign: 'inherit', cursor: 'pointer' }}
            >
              <div className="portal-icon-wrap" style={{ background: '#fef3c7', color: '#d97706' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                  <circle cx="8.5" cy="7" r="4"></circle>
                  <line x1="20" y1="8" x2="20" y2="14"></line>
                  <line x1="23" y1="11" x2="17" y2="11"></line>
                </svg>
              </div>
              <span className="portal-title">PPDB Online</span>
            </button>

            {/* 3. E-Learning / CBT */}
            <Link href="/portal#cbt" className="portal-card-btn">
              <div className="portal-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                  <line x1="8" y1="21" x2="16" y2="21"></line>
                  <line x1="12" y1="17" x2="12" y2="21"></line>
                </svg>
              </div>
              <span className="portal-title">E-Learning & CBT</span>
            </Link>

            {/* 4. E-Perpustakaan */}
            <Link href="/portal#perpus" className="portal-card-btn">
              <div className="portal-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
                </svg>
              </div>
              <span className="portal-title">E-Library & Kitab</span>
            </Link>

            {/* 5. Cek Nilai Raport */}
            <button
              type="button"
              onClick={() => openModal('raportCheck')}
              className="portal-card-btn"
              style={{ background: 'none', border: 'none', textAlign: 'inherit', cursor: 'pointer' }}
            >
              <div className="portal-icon-wrap" style={{ background: '#ede9fe', color: '#6d28d9' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                  <polyline points="14 2 14 8 20 8"></polyline>
                  <line x1="16" y1="13" x2="8" y2="13"></line>
                  <line x1="16" y1="17" x2="8" y2="17"></line>
                  <polyline points="10 9 9 9 8 9"></polyline>
                </svg>
              </div>
              <span className="portal-title">Cek Raport</span>
            </button>

            {/* 6. Kalkulator SPP & Beasiswa */}
            <button
              type="button"
              onClick={() => openModal('kalkulator')}
              className="portal-card-btn"
              style={{ background: 'none', border: 'none', textAlign: 'inherit', cursor: 'pointer' }}
            >
              <div className="portal-icon-wrap" style={{ background: '#fef3c7', color: '#b45309' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="4" y="2" width="16" height="20" rx="2"></rect>
                  <line x1="8" y1="6" x2="16" y2="6"></line>
                  <line x1="16" y1="14" x2="16" y2="18"></line>
                  <path d="M8 10h.01M12 10h.01M16 10h.01M8 14h.01M12 14h.01M8 18h.01M12 18h.01"></path>
                </svg>
              </div>
              <span className="portal-title">Kalkulator SPP</span>
            </button>

            {/* 7. Ekskul BRAVIA */}
            <a href="#ekskul" className="portal-card-btn">
              <div className="portal-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon>
                </svg>
              </div>
              <span className="portal-title">Ekskul BRAVIA</span>
            </a>

            {/* 8. Konseling & BK */}
            <a href="#kontak" className="portal-card-btn">
              <div className="portal-icon-wrap">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                </svg>
              </div>
              <span className="portal-title">Konseling & BK</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
