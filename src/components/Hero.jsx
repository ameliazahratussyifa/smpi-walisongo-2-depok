'use client';

import { openModal } from '@/lib/modalEvents';

export default function Hero() {
  return (
    <section className="hero-section">
      {/* Glowing visual elements & grid */}
      <div className="hero-backdrop-glow"></div>
      <div className="hero-orb hero-orb-1"></div>
      <div className="hero-orb hero-orb-2"></div>

      <div className="container hero-content-grid">
        {/* Left Column: Copy & Actions */}
        <div>
          <div className="hero-pill-badge">
            <span>✨</span> TAHFIDZUL QUR'AN • DIGITAL SMART SCHOOL • ADAB ASWAJA
          </div>

          <h1 className="hero-title">
            Mencetak Generasi Qur'ani, <span>Cerdas Teknologi</span> & Berakhlakul Karimah
          </h1>

          <p className="hero-description">
            Selamat datang di <strong>SMP Islam Walisongo 2 Depok</strong>. Memadukan kurikulum nasional modern, pendidikan karakter Islami, hafalan Al-Qur'an bersanad, dan kecakapan digital abad 21 di bawah naungan <em>Yayasan Pondok Pesantren Hj. Dardjah Amin</em>.
          </p>

          <div className="hero-actions">
            <button
              onClick={() => openModal('ppdbRegister')}
              className="btn-primary-hero"
            >
              PENDAFTARAN PPDB 2026/2027 ➔
            </button>
            <a href="#program" className="btn-secondary-hero">
              JELAJAHI PROGRAM & FASILITAS
            </a>
          </div>

          <div className="hero-features-list">
            <div className="hero-feature-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Akreditasi A Kemendikdasmen</span>
            </div>
            <div className="hero-feature-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Kurikulum Merdeka Terintegrasi</span>
            </div>
            <div className="hero-feature-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Tahfidz & Sanad Tajwid</span>
            </div>
            <div className="hero-feature-item">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
              <span>Laboratorium IT & Coding</span>
            </div>
          </div>
        </div>

        {/* Right Column: Glowing Hologram Card */}
        <div>
          <div className="hero-visual-card">
            <div className="hero-card-badge">SEKOLAH ISLAM UNGGULAN KOTA DEPOK</div>
            <img
              src="/static/images/logo-sekolah.png"
              alt="Emblem SMP Islam Walisongo 2"
              className="hero-emblem-large"
            />
            <h3 className="hero-card-title">SMP ISLAM WALISONGO 2</h3>
            <p className="hero-card-subtitle">NPSN: 20268571 • Cilodong, Kota Depok</p>

            <div className="hero-quick-stats">
              <div className="quick-stat-item">
                <span className="quick-stat-val">A</span>
                <span className="quick-stat-lbl">Akreditasi</span>
              </div>
              <div className="quick-stat-item">
                <span className="quick-stat-val">100%</span>
                <span className="quick-stat-lbl">Kelulusan</span>
              </div>
              <div className="quick-stat-item">
                <span className="quick-stat-val">Juz 30+</span>
                <span className="quick-stat-lbl">Tahfidz</span>
              </div>
            </div>

            <div style={{ marginTop: '1.25rem', width: '100%' }}>
              <button
                onClick={() => openModal('ppdbCheck')}
                className="btn-mobile-mode"
                style={{
                  width: '100%',
                  justifyContent: 'center',
                  background: 'rgba(255,255,255,0.15)',
                  color: '#fff',
                  borderColor: 'rgba(255,255,255,0.3)',
                }}
              >
                🔍 Lacak Status Registrasi PPDB Siswa
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
