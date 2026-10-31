'use client';

import { openModal } from '@/lib/modalEvents';

export default function Sambutan() {
  return (
    <section id="sambutan" className="section-sambutan">
      <div className="container sambutan-grid">
        {/* Left: Speech text */}
        <div className="sambutan-content-col">
          <span className="section-pill-tag">SAMBUTAN KEPALA SEKOLAH</span>
          <h2 className="section-title">
            Membimbing Generasi Pemimpin dengan Iman, Adab, dan Teknologi
          </h2>
          <p className="sambutan-text">
            &ldquo;Alhamdulillah, puji syukur ke hadirat Allah SWT. SMP Islam Walisongo 2 Depok hadir sebagai ikhtiar luhur dalam mendidik putra-putri bangsa agar memiliki keteguhan akidah, keluhuran budi pekerti, serta kesiapan menyongsong era revolusi teknologi.
            <br /><br />
            Kami meyakini bahwa kecerdasan intelektual harus selalu dibingkai dengan akhlakul karimah dan kecintaan pada Al-Qur&apos;an. Melalui kolaborasi para ustadz dan pendidik profesional, kami berkomitmen mendampingi setiap santri menemukan potensi terbaiknya.&rdquo;
          </p>

          <div className="kepsek-profile-badge">
            <img
              src="/static/images/guru-kepsek.svg"
              alt="Kepala Sekolah"
              className="kepsek-thumb"
            />
            <div>
              <div className="kepsek-name">Drs. H. M. Syarifuddin, M.Pd.I</div>
              <div className="kepsek-role">Kepala Sekolah SMP Islam Walisongo 2 Depok</div>
            </div>
          </div>

          <div>
            <button
              type="button"
              onClick={() => openModal('sambutan')}
              className="btn-read-more-link"
              style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
            >
              Baca Sambutan Selengkapnya ➔
            </button>
          </div>
        </div>

        {/* Right: Media Card */}
        <div className="sambutan-media-col">
          <div className="sambutan-photo-frame">
            <img
              src="/static/images/sambutan-santri.svg"
              alt="Aktivitas Belajar Santri Walisongo 2"
              className="sambutan-main-img"
              style={{ display: 'block', width: '100%', height: 'auto', minHeight: '360px', objectFit: 'cover' }}
            />
            <div className="sambutan-float-badge">
              <div className="float-badge-icon">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <circle cx="12" cy="12" r="10"></circle>
                  <polygon points="10 8 16 12 10 16 10 8"></polygon>
                </svg>
              </div>
              <div>
                <div className="float-badge-title">Yayasan PP. Hj. Dardjah Amin</div>
                <div className="float-badge-sub">Membina generasi Islam sejak dini</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
