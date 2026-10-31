'use client';

import { useState, useEffect } from 'react';
import { openModal, closeModal } from '@/lib/modalEvents';

export default function Modals() {
  // Active modals
  const [activeModal, setActiveModal] = useState(null);
  const [selectedArticle, setSelectedArticle] = useState(null);

  // PPDB Form State
  const [ppdbForm, setPpdbForm] = useState({
    nama_lengkap: '',
    nisn: '',
    jenis_kelamin: 'Laki-laki',
    tempat_lahir: '',
    tanggal_lahir: '',
    asal_sekolah: '',
    nama_wali: '',
    no_wa_wali: '',
    jalur_pendaftaran: 'Jalur Reguler',
    pilihan_peminatan: 'Kelas Tahfidz & IT',
    alamat_lengkap: '',
  });
  const [ppdbSubmitting, setPpdbSubmitting] = useState(false);
  const [ppdbSuccessData, setPpdbSuccessData] = useState(null);

  // PPDB Track State
  const [trackQuery, setTrackQuery] = useState('REG-2026-WS001');
  const [trackLoading, setTrackLoading] = useState(false);
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState(null);

  // Raport State
  const [raportNisn, setRaportNisn] = useState('0091234567');
  const [raportLoading, setRaportLoading] = useState(false);
  const [raportResult, setRaportResult] = useState(null);
  const [raportError, setRaportError] = useState(null);

  // SPP Calculator State
  const [calcTahfidz, setCalcTahfidz] = useState(false);
  const [calcPrestasi, setCalcPrestasi] = useState(false);
  const [calcSibling, setCalcSibling] = useState(false);

  // AI Chat State
  const [aiOpen, setAiOpen] = useState(false);
  const [aiInput, setAiInput] = useState('');
  const [aiMessages, setAiMessages] = useState([
    {
      role: 'bot',
      text: "Assalamu'alaikum Warahmatullahi Wabarakatuh! ✨\n\nSelamat datang di Layanan Informasi Cerdas **SMP Islam Walisongo 2 Depok**. Saya asisten digital siap membantu menjawab pertanyaan seputar pendaftaran PPDB 2026/2027, program tahfidz, biaya sekolah, kurikulum, dan fasilitas santri. Silakan tanyakan apa saja!",
    },
  ]);
  const [aiLoading, setAiLoading] = useState(false);

  // Global listener for opening modals
  useEffect(() => {
    const handleOpen = (e) => {
      setActiveModal(e.detail);
    };
    const handleClose = () => {
      setActiveModal(null);
    };
    const handleArticleOpen = (e) => {
      setSelectedArticle(e.detail);
      setActiveModal('articleReader');
    };

    window.addEventListener('open-modal', handleOpen);
    window.addEventListener('close-modal', handleClose);
    window.addEventListener('open-article-modal', handleArticleOpen);

    return () => {
      window.removeEventListener('open-modal', handleOpen);
      window.removeEventListener('close-modal', handleClose);
      window.removeEventListener('open-article-modal', handleArticleOpen);
    };
  }, []);

  // 1. PPDB Register Submit
  const handlePpdbSubmit = async (e) => {
    e.preventDefault();
    setPpdbSubmitting(true);
    try {
      const res = await fetch('/api/ppdb/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ppdbForm),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setPpdbSuccessData(data.data);
        setActiveModal('ppdbSuccess');
      } else {
        alert(data.detail || data.message || 'Pendaftaran gagal. Periksa data kembali.');
      }
    } catch {
      alert('Terjadi kesalahan jaringan saat mengirim data PPDB.');
    } finally {
      setPpdbSubmitting(false);
    }
  };

  // 2. PPDB Check Status
  const handlePpdbCheck = async () => {
    if (!trackQuery.trim()) return;
    setTrackLoading(true);
    setTrackError(null);
    setTrackResult(null);
    try {
      const res = await fetch(`/api/ppdb/check/${encodeURIComponent(trackQuery.trim())}`);
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setTrackResult(data.data);
      } else {
        setTrackError(data.detail || 'Data registrasi tidak ditemukan.');
      }
    } catch {
      setTrackError('Gagal menghubungi server database.');
    } finally {
      setTrackLoading(false);
    }
  };

  // 3. Raport Check
  const handleRaportCheck = async () => {
    if (!raportNisn.trim()) return;
    setRaportLoading(true);
    setRaportError(null);
    setRaportResult(null);
    try {
      const res = await fetch('/api/raport/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nisn: raportNisn.trim() }),
      });
      const data = await res.json();
      if (res.ok && data.status === 'success') {
        setRaportResult(data.data);
      } else {
        setRaportError(data.detail || 'Data raport tidak ditemukan untuk NISN tersebut.');
      }
    } catch {
      setRaportError('Gagal memverifikasi data raport.');
    } finally {
      setRaportLoading(false);
    }
  };

  // 4. Calculate Tuition
  const calculateTuition = () => {
    let pangkal = 3500000;
    let spp = 450000;
    let diskonPangkal = 0;
    let diskonSpp = 0;

    if (calcTahfidz) {
      diskonPangkal = 3500000; // 100% Free
    } else if (calcPrestasi) {
      diskonPangkal = 1000000;
      diskonSpp = 50000;
    }

    if (calcSibling) {
      diskonSpp += 50000;
    }

    const netPangkal = Math.max(0, pangkal - diskonPangkal);
    const netSpp = Math.max(0, spp - diskonSpp);
    return {
      pangkal,
      spp,
      diskonPangkal,
      diskonSpp,
      netPangkal,
      netSpp,
      totalAwal: netPangkal + netSpp,
    };
  };

  const tuitionResult = calculateTuition();

  // 5. AI Send Question
  const handleAiSend = async (customPrompt) => {
    const q = customPrompt || aiInput;
    if (!q.trim()) return;

    const newMsgs = [...aiMessages, { role: 'user', text: q }];
    setAiMessages(newMsgs);
    setAiInput('');
    setAiLoading(true);

    try {
      const res = await fetch('/api/ai/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: q }),
      });
      const data = await res.json();
      if (res.ok && data.answer) {
        setAiMessages([...newMsgs, { role: 'bot', text: data.answer }]);
      } else {
        setAiMessages([
          ...newMsgs,
          { role: 'bot', text: 'Mohon maaf, terjadi gangguan server AI. Silakan coba tanyakan kembali.' },
        ]);
      }
    } catch {
      setAiMessages([
        ...newMsgs,
        { role: 'bot', text: 'Koneksi asisten AI terputus. Silakan hubungi admin di 0812-9876-5432.' },
      ]);
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <>
      {/* ==================== AI ASSISTANT WIDGET ==================== */}
      <div className="ai-assistant-widget">
        {aiOpen && (
          <div className="ai-chat-box" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="ai-chat-header">
              <div className="ai-header-profile">
                <img
                  src="/static/images/logo-sekolah.png"
                  alt="AI Avatar"
                  className="ai-avatar"
                />
                <div>
                  <div className="ai-title">Walisongo AI Smart Assistant</div>
                  <div className="ai-sub">Online • Siap Menjawab 24/7</div>
                </div>
              </div>
              <button
                onClick={() => setAiOpen(false)}
                className="btn-close-ai"
                title="Tutup Chat"
              >
                ✕
              </button>
            </div>

            {/* Quick prompts */}
            <div
              style={{
                padding: '0.65rem 0.85rem',
                background: '#ecfdf5',
                borderBottom: '1px solid #d1fae5',
                display: 'flex',
                gap: '0.4rem',
                overflowX: 'auto',
              }}
            >
              <button
                onClick={() => handleAiSend('Berapa biaya SPP dan uang pangkal sekolah?')}
                style={{
                  background: '#fff',
                  border: '1px solid #10b981',
                  color: '#064e3b',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.55rem',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                💰 Biaya & SPP
              </button>
              <button
                onClick={() => handleAiSend('Apa saja syarat pendaftaran PPDB 2026?')}
                style={{
                  background: '#fff',
                  border: '1px solid #10b981',
                  color: '#064e3b',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.55rem',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                📝 Syarat PPDB
              </button>
              <button
                onClick={() => handleAiSend("Bagaimana program Tahfidz Al-Qur'an?")}
                style={{
                  background: '#fff',
                  border: '1px solid #10b981',
                  color: '#064e3b',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.55rem',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                📖 Tahfidz
              </button>
              <button
                onClick={() => handleAiSend('Dimana alamat lengkap sekolah?')}
                style={{
                  background: '#fff',
                  border: '1px solid #10b981',
                  color: '#064e3b',
                  fontSize: '0.7rem',
                  fontWeight: 700,
                  padding: '0.25rem 0.55rem',
                  borderRadius: '999px',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                }}
              >
                📍 Lokasi
              </button>
            </div>

            {/* Messages list */}
            <div className="ai-messages-list">
              {aiMessages.map((m, idx) => (
                <div key={idx} className={`ai-msg ${m.role}`} style={{ whiteSpace: 'pre-wrap' }}>
                  {m.text}
                </div>
              ))}
              {aiLoading && (
                <div className="ai-msg bot" style={{ fontStyle: 'italic', color: '#64748b' }}>
                  Sedang mengetik jawaban...
                </div>
              )}
            </div>

            {/* Input bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAiSend();
              }}
              className="ai-chat-input-bar"
            >
              <input
                type="text"
                value={aiInput}
                onChange={(e) => setAiInput(e.target.value)}
                className="ai-chat-input"
                placeholder="Tulis pertanyaan seputar sekolah..."
                autoComplete="off"
              />
              <button type="submit" className="btn-ai-send" title="Kirim" disabled={aiLoading}>
                ➤
              </button>
            </form>
          </div>
        )}

        <button
          onClick={() => setAiOpen(!aiOpen)}
          className="ai-trigger-btn"
          title="Tanya Asisten AI Sekolah"
        >
          <span style={{ fontSize: '1.6rem' }}>💬</span>
        </button>
      </div>

      {/* ==================== 1. MODAL: PPDB REGISTER ==================== */}
      {activeModal === 'ppdbRegister' && (
        <div className="modal-backdrop active" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
          <div className="modal-window">
            <div className="modal-header">
              <h3 className="modal-header-title">📝 Formulir Pendaftaran PPDB 2026/2027</h3>
              <button className="btn-close-modal" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                Lengkapi data calon peserta didik baru. Formulir online ini bebas biaya pendaftaran (Gratis).
              </p>

              <form onSubmit={handlePpdbSubmit}>
                <div className="form-group">
                  <label className="form-label">Nama Lengkap Siswa *</label>
                  <input
                    type="text"
                    required
                    value={ppdbForm.nama_lengkap}
                    onChange={(e) => setPpdbForm({ ...ppdbForm, nama_lengkap: e.target.value })}
                    className="form-input"
                    placeholder="Contoh: Muhammad Farhan Pratama"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">NISN (10 Digit Angka) *</label>
                    <input
                      type="text"
                      required
                      maxLength={10}
                      value={ppdbForm.nisn}
                      onChange={(e) => setPpdbForm({ ...ppdbForm, nisn: e.target.value })}
                      className="form-input"
                      placeholder="Contoh: 0098765432"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Jenis Kelamin *</label>
                    <select
                      value={ppdbForm.jenis_kelamin}
                      onChange={(e) => setPpdbForm({ ...ppdbForm, jenis_kelamin: e.target.value })}
                      className="form-select"
                      required
                    >
                      <option value="Laki-laki">Laki-laki</option>
                      <option value="Perempuan">Perempuan</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Tempat Lahir</label>
                    <input
                      type="text"
                      value={ppdbForm.tempat_lahir}
                      onChange={(e) => setPpdbForm({ ...ppdbForm, tempat_lahir: e.target.value })}
                      className="form-input"
                      placeholder="Kota Kelahiran"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tanggal Lahir</label>
                    <input
                      type="date"
                      value={ppdbForm.tanggal_lahir}
                      onChange={(e) => setPpdbForm({ ...ppdbForm, tanggal_lahir: e.target.value })}
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Asal Sekolah (SD / MI) *</label>
                  <input
                    type="text"
                    required
                    value={ppdbForm.asal_sekolah}
                    onChange={(e) => setPpdbForm({ ...ppdbForm, asal_sekolah: e.target.value })}
                    className="form-input"
                    placeholder="Contoh: SDIT Al-Barkah / MI Nurul Falah Depok"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Nama Orang Tua / Wali *</label>
                    <input
                      type="text"
                      required
                      value={ppdbForm.nama_wali}
                      onChange={(e) => setPpdbForm({ ...ppdbForm, nama_wali: e.target.value })}
                      className="form-input"
                      placeholder="Nama Lengkap Ayah/Ibu/Wali"
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Nomor WhatsApp Aktif *</label>
                    <input
                      type="tel"
                      required
                      value={ppdbForm.no_wa_wali}
                      onChange={(e) => setPpdbForm({ ...ppdbForm, no_wa_wali: e.target.value })}
                      className="form-input"
                      placeholder="Contoh: 081234567890"
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Jalur Pendaftaran *</label>
                    <select
                      value={ppdbForm.jalur_pendaftaran}
                      onChange={(e) => setPpdbForm({ ...ppdbForm, jalur_pendaftaran: e.target.value })}
                      className="form-select"
                      required
                    >
                      <option value="Jalur Reguler">Jalur Reguler</option>
                      <option value="Jalur Beasiswa Tahfidz">Jalur Beasiswa Tahfidz (Min. 2 Juz)</option>
                      <option value="Jalur Prestasi Akademik/Non-Akademik">Jalur Prestasi (Sains/Olahraga/Seni)</option>
                      <option value="Jalur Afirmasi / Yatim Dhuafa">Jalur Afirmasi Yatim / Dhuafa</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Peminatan Kelas</label>
                    <select
                      value={ppdbForm.pilihan_peminatan}
                      onChange={(e) => setPpdbForm({ ...ppdbForm, pilihan_peminatan: e.target.value })}
                      className="form-select"
                    >
                      <option value="Kelas Tahfidz & IT">Kelas Tahfidz & IT Coding</option>
                      <option value="Kelas Bilingual & Sains">Kelas Bilingual (Arab-Inggris) & Sains</option>
                      <option value="Kelas Reguler Plus">Kelas Reguler Berkarakter</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Alamat Lengkap</label>
                  <textarea
                    rows={2}
                    value={ppdbForm.alamat_lengkap}
                    onChange={(e) => setPpdbForm({ ...ppdbForm, alamat_lengkap: e.target.value })}
                    className="form-textarea"
                    placeholder="Alamat jalan, RT/RW, Kelurahan, Kecamatan, Kota"
                  />
                </div>

                <button
                  type="submit"
                  disabled={ppdbSubmitting}
                  className="btn-primary-hero"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '0.5rem', padding: '0.75rem' }}
                >
                  {ppdbSubmitting ? 'Mengirim Pendaftaran...' : 'Kirim Pendaftaran Sekarang ➔'}
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 2. MODAL: PPDB SUCCESS ==================== */}
      {activeModal === 'ppdbSuccess' && ppdbSuccessData && (
        <div className="modal-backdrop active" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
          <div className="modal-window" style={{ maxWidth: '600px' }}>
            <div className="modal-header">
              <h3 className="modal-header-title">🎉 Pendaftaran Berhasil!</h3>
              <button className="btn-close-modal" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div style={{ textAlign: 'center', padding: '1rem 0' }}>
                <span style={{ fontSize: '3rem' }}>✅</span>
                <h4 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0369a1', marginTop: '0.5rem' }}>
                  Terima Kasih, Berkas Formulir Berhasil Diterima!
                </h4>
                <p style={{ color: '#64748b', fontSize: '0.875rem' }}>
                  Simpan Nomor Registrasi berikut untuk melacak status verifikasi berkas dan jadwal tes seleksi:
                </p>

                <div
                  style={{
                    background: '#f0fdf4',
                    border: '2px dashed #16a34a',
                    borderRadius: '12px',
                    padding: '1rem',
                    margin: '1.25rem 0',
                    fontSize: '1.4rem',
                    fontWeight: 900,
                    color: '#15803d',
                    letterSpacing: '0.05em',
                  }}
                >
                  {ppdbSuccessData.nomor_registrasi}
                </div>

                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    borderRadius: '12px',
                    padding: '1rem',
                    textAlign: 'left',
                    fontSize: '0.85rem',
                    color: '#334155',
                    lineHeight: 1.8,
                  }}
                >
                  <p><strong>Nama Siswa:</strong> {ppdbSuccessData.nama_lengkap}</p>
                  <p><strong>NISN:</strong> {ppdbSuccessData.nisn}</p>
                  <p><strong>Jalur:</strong> {ppdbSuccessData.jalur_pendaftaran}</p>
                  <p><strong>Pilihan Peminatan:</strong> {ppdbSuccessData.pilihan_peminatan}</p>
                  <p><strong>Status Berkas:</strong> <span style={{ color: '#d97706', fontWeight: 700 }}>Menunggu Verifikasi Administrasi</span></p>
                </div>

                <button
                  onClick={() => {
                    setActiveModal(null);
                    window.print();
                  }}
                  className="btn-primary-hero"
                  style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center' }}
                >
                  🖨️ Cetak / Simpan Bukti Registrasi
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 3. MODAL: CEK STATUS PPDB ==================== */}
      {activeModal === 'ppdbCheck' && (
        <div className="modal-backdrop active" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
          <div className="modal-window">
            <div className="modal-header">
              <h3 className="modal-header-title">🔍 Cek Status Penerimaan PPDB</h3>
              <button className="btn-close-modal" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
                Masukkan <strong>Nomor Registrasi</strong> (contoh: <code>REG-2026-WS001</code>) atau <strong>10 Digit NISN</strong> calon siswa.
              </p>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
                <input
                  type="text"
                  value={trackQuery}
                  onChange={(e) => setTrackQuery(e.target.value)}
                  className="form-input"
                  placeholder="Ketik No. Registrasi atau NISN..."
                />
                <button
                  type="button"
                  onClick={handlePpdbCheck}
                  disabled={trackLoading}
                  className="btn-primary-hero"
                  style={{ fontSize: '0.85rem', padding: '0.6rem 1.25rem', whiteSpace: 'nowrap' }}
                >
                  {trackLoading ? 'Mencari...' : 'Lacak Data'}
                </button>
              </div>

              {trackError && (
                <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                  {trackError}
                </div>
              )}

              {trackResult && (
                <div style={{ background: '#f0fdf4', border: '1px solid #86efac', borderRadius: '12px', padding: '1rem' }}>
                  <h4 style={{ color: '#166534', fontWeight: 800, fontSize: '1rem', marginBottom: '0.5rem' }}>
                    Data Registrasi Ditemukan
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#1e293b', margin: '0.2rem 0' }}>
                    <strong>Nomor Registrasi:</strong> {trackResult.nomor_registrasi}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#1e293b', margin: '0.2rem 0' }}>
                    <strong>Nama Lengkap:</strong> {trackResult.nama_lengkap}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#1e293b', margin: '0.2rem 0' }}>
                    <strong>Jalur:</strong> {trackResult.jalur_pendaftaran}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: '#1e293b', margin: '0.2rem 0' }}>
                    <strong>Status:</strong>{' '}
                    <span style={{ color: '#0284c7', fontWeight: 800 }}>
                      {trackResult.status_verifikasi || 'TERVERIFIKASI / LULUS SELEKSI'}
                    </span>
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== 4. MODAL: CEK RAPORT ==================== */}
      {activeModal === 'raportCheck' && (
        <div className="modal-backdrop active" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
          <div className="modal-window">
            <div className="modal-header">
              <h3 className="modal-header-title">📊 Verifikasi Raport & Kelulusan Siswa</h3>
              <button className="btn-close-modal" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.875rem', color: '#64748b', marginBottom: '1rem' }}>
                Layanan verifikasi digital nilai akademik, capaian tahfidzul Qur&apos;an, dan surat keterangan lulus siswa SMP Islam Walisongo 2 Depok.
              </p>

              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <input
                  type="text"
                  value={raportNisn}
                  onChange={(e) => setRaportNisn(e.target.value)}
                  className="form-input"
                  placeholder="Masukkan 10 digit NISN siswa..."
                />
                <button
                  type="button"
                  onClick={handleRaportCheck}
                  disabled={raportLoading}
                  className="btn-primary-hero"
                  style={{ fontSize: '0.85rem', padding: '0.6rem 1.25rem', whiteSpace: 'nowrap' }}
                >
                  {raportLoading ? 'Memeriksa...' : 'Periksa Nilai'}
                </button>
              </div>
              <p style={{ fontSize: '0.75rem', color: '#047857' }}>
                💡 Contoh NISN Uji Coba: <code>0091234567</code> (Rizky Pratama) atau <code>0089876543</code> (Aisyah Azzahra)
              </p>

              {raportError && (
                <div style={{ background: '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', padding: '0.75rem', borderRadius: '8px', fontSize: '0.85rem', marginTop: '0.75rem' }}>
                  {raportError}
                </div>
              )}

              {raportResult && (
                <div style={{ background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '12px', padding: '1rem', marginTop: '1rem' }}>
                  <h4 style={{ color: '#0f172a', fontWeight: 800, fontSize: '1rem', marginBottom: '0.35rem' }}>
                    {raportResult.nama_siswa}
                  </h4>
                  <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '0.75rem' }}>
                    NISN: {raportResult.nisn} • Kelas: {raportResult.kelas} • Semester: {raportResult.semester}
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', textAlign: 'center', marginBottom: '0.75rem' }}>
                    <div style={{ background: '#e0f2fe', padding: '0.5rem', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#0369a1', display: 'block' }}>Rata-rata</span>
                      <strong style={{ fontSize: '1.2rem', color: '#0284c7' }}>{raportResult.rata_rata_nilai}</strong>
                    </div>
                    <div style={{ background: '#ecfdf5', padding: '0.5rem', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#065f46', display: 'block' }}>Tahfidz</span>
                      <strong style={{ fontSize: '1.2rem', color: '#059669' }}>{raportResult.capaian_tahfidz}</strong>
                    </div>
                    <div style={{ background: '#fef3c7', padding: '0.5rem', borderRadius: '8px' }}>
                      <span style={{ fontSize: '0.75rem', color: '#92400e', display: 'block' }}>Status</span>
                      <strong style={{ fontSize: '1rem', color: '#d97706' }}>{raportResult.status_kelulusan}</strong>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==================== 5. MODAL: KALKULATOR SPP ==================== */}
      {activeModal === 'kalkulator' && (
        <div className="modal-backdrop active" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
          <div className="modal-window">
            <div className="modal-header">
              <h3 className="modal-header-title">🧮 Kalkulator Transparan Biaya & SPP</h3>
              <button className="btn-close-modal" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem' }}>
                Hitung estimasi rincian biaya masuk dan potongan beasiswa pendidikan di SMP Islam Walisongo 2 Depok:
              </p>

              <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '1rem', marginBottom: '1.25rem' }}>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#064e3b', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={calcTahfidz}
                      onChange={(e) => setCalcTahfidz(e.target.checked)}
                    />
                    ⭐ Calon Santri Hafal Minimal 2 Juz Al-Qur&apos;an (Bebas Uang Pangkal 100%)
                  </label>
                </div>
                <div style={{ marginBottom: '0.75rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#064e3b', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={calcPrestasi}
                      onChange={(e) => setCalcPrestasi(e.target.checked)}
                    />
                    🏆 Jalur Prestasi Juara OSN / Kejuaraan Tingkat Kota (Diskon Uang Pangkal 1 Juta + Diskon SPP)
                  </label>
                </div>
                <div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', fontWeight: 700, color: '#064e3b', cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={calcSibling}
                      onChange={(e) => setCalcSibling(e.target.checked)}
                    />
                    👨‍👩‍👦 Memiliki Saudara Kandung yang Bersekolah di Walisongo 2 (Diskon Khusus SPP)
                  </label>
                </div>
              </div>

              <div style={{ background: '#ecfdf5', border: '1px solid #10b981', borderRadius: '12px', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.875rem' }}>
                  <span>Uang Pangkal Masuk:</span>
                  <strong style={{ textDecoration: tuitionResult.diskonPangkal > 0 ? 'line-through' : 'none', color: tuitionResult.diskonPangkal > 0 ? '#94a3b8' : '#0f172a' }}>
                    Rp 3.500.000
                  </strong>
                </div>
                {tuitionResult.diskonPangkal > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.875rem', color: '#16a34a' }}>
                    <span>Potongan Beasiswa Pangkal:</span>
                    <strong>- Rp {tuitionResult.diskonPangkal.toLocaleString('id-ID')}</strong>
                  </div>
                )}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.875rem' }}>
                  <span>SPP Bulanan:</span>
                  <strong>Rp {tuitionResult.netSpp.toLocaleString('id-ID')} / bulan</strong>
                </div>
                <hr style={{ margin: '0.75rem 0', borderColor: '#a7f3d0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.05rem', fontWeight: 900, color: '#065f46' }}>
                  <span>Estimasi Biaya Masuk Awal:</span>
                  <span>Rp {tuitionResult.totalAwal.toLocaleString('id-ID')}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveModal('ppdbRegister');
                }}
                className="btn-primary-hero"
                style={{ width: '100%', justifyContent: 'center', marginTop: '1rem' }}
              >
                Daftar Jalur Ini Sekarang ➔
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 6. MODAL: SAMBUTAN KEPSEK ==================== */}
      {activeModal === 'sambutan' && (
        <div className="modal-backdrop active" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
          <div className="modal-window">
            <div className="modal-header">
              <h3 className="modal-header-title">📜 Sambutan Lengkap Kepala Sekolah</h3>
              <button className="btn-close-modal" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                <img
                  src="/static/images/guru-kepsek.svg"
                  alt="Kepsek"
                  style={{ width: '60px', height: '60px', borderRadius: '12px', border: '2px solid #f59e0b' }}
                />
                <div>
                  <h4 style={{ color: '#0369a1', fontSize: '1.1rem', fontWeight: 800, margin: 0 }}>
                    Drs. H. M. Syarifuddin, M.Pd.I
                  </h4>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
                    Kepala Sekolah SMP Islam Walisongo 2 Depok
                  </p>
                </div>
              </div>
              <div style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.75, display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <p><em>Assalamu&apos;alaikum Warahmatullahi Wabarakatuh,</em></p>
                <p>
                  Puji dan syukur senantiasa kita panjatkan ke hadirat Allah SWT, Rabb semesta alam, yang telah menganugerahkan taufiq dan hidayah-Nya. Shalawat beriring salam semoga senantiasa tercurah kepada junjungan kita Nabi Agung Muhammad SAW, keluarga, sahabat, dan para pengikutnya hingga akhir zaman.
                </p>
                <p>
                  Sebagai lembaga pendidikan formal yang bernafaskan nilai-nilai Islam Ahlussunnah wal Jama&apos;ah di bawah naungan <strong>Yayasan Pondok Pesantren Hj. Dardjah Amin</strong>, SMP Islam Walisongo 2 Depok mengemban amanah suci untuk melahirkan generasi yang tidak hanya cerdas secara nalar sains, tetapi juga kukuh dalam adab dan akidah.
                </p>
                <p>
                  Pendidikan di SMP Islam Walisongo 2 Depok mengintegrasikan <strong>Kurikulum Merdeka</strong> dengan program unggulan Tahfidzul Qur&apos;an, kecakapan berbahasa asing (Arab & Inggris), serta literasi digital modern. Kami mendidik anak-anak kita dengan kasih sayang, keteladanan, dan disiplin tinggi melalui pembiasaan ibadah harian serta kepanduan Pramuka BRAVIA.
                </p>
                <p>
                  Kami menyambut hangat para orang tua yang ingin mengamanahkan putra-putrinya untuk tumbuh bersama kami. Mari bersama-sama kita ikhtiarkan generasi terbaik yang akan menjadi kebanggaan keluarga, agama, dan bangsa.
                </p>
                <p><em>Wassalamu&apos;alaikum Warahmatullahi Wabarakatuh.</em></p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 7. MODAL: ARTICLE READER ==================== */}
      {activeModal === 'articleReader' && selectedArticle && (
        <div className="modal-backdrop active" onClick={(e) => e.target === e.currentTarget && setActiveModal(null)}>
          <div className="modal-window">
            <div className="modal-header">
              <h3 className="modal-header-title">{selectedArticle.kategori}</h3>
              <button className="btn-close-modal" onClick={() => setActiveModal(null)}>&times;</button>
            </div>
            <div className="modal-body">
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.5rem', lineHeight: 1.3 }}>
                {selectedArticle.judul}
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '1rem' }}>
                📅 Dipublikasikan pada {selectedArticle.tanggal} oleh <strong>{selectedArticle.penulis}</strong>
              </p>
              <img
                src={selectedArticle.gambar || '/static/images/news-ppdb.svg'}
                alt={selectedArticle.judul}
                style={{ width: '100%', height: '240px', objectFit: 'cover', borderRadius: '12px', marginBottom: '1.25rem' }}
              />
              <div style={{ fontSize: '0.95rem', color: '#334155', lineHeight: 1.75, whiteSpace: 'pre-wrap' }}>
                {selectedArticle.konten}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================== 8. MOBILE SIMULATOR OVERLAY ==================== */}
      {activeModal === 'mobileSimulator' && (
        <div className="mobile-simulator-overlay active">
          <button onClick={() => setActiveModal(null)} className="btn-close-simulator">
            ✕ Tutup Simulasi
          </button>
          <div className="phone-mockup-frame">
            <iframe src="/app" className="phone-screen-iframe" title="Tampilan Aplikasi Mobile" />
          </div>
        </div>
      )}
    </>
  );
}
