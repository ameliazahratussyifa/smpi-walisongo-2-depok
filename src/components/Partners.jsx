'use client';

export default function Partners() {
  const partners = [
    {
      initial: "K",
      name: "Kemendikdasmen RI",
      desc: "Pembinaan Kurikulum Merdeka & Akreditasi A"
    },
    {
      initial: "M",
      name: "Kemenag Kota Depok",
      desc: "Sinergi Pembinaan PAI & Musabaqah Hifdzil Qur'an"
    },
    {
      initial: "P",
      name: "Kwartir Cabang Pramuka",
      desc: "Gugus Depan Penggalang Berprestasi Kwarran Cilodong"
    },
    {
      initial: "B",
      name: "Bank Syariah Indonesia (BSI)",
      desc: "Layanan Pembayaran SPP Online & Edukasi Finansial"
    }
  ];

  return (
    <section className="section-partners">
      <div className="container">
        <div className="partners-heading-block">
          <span className="section-pill-tag">KOLABORASI & SINERGI</span>
          <h2 className="section-title">Mitra Kerja Sama & Jejaring Lembaga</h2>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
            Sinergi kelembagaan yang memperkuat kualitas pembelajaran, pembinaan dakwah, dan kepanduan.
          </p>
        </div>

        <div className="partners-grid">
          {partners.map((p, idx) => (
            <div key={idx} className="partner-box">
              <div className="partner-icon-circle">{p.initial}</div>
              <div className="partner-name">{p.name}</div>
              <div className="partner-desc">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
