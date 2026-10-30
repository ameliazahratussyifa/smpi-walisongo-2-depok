/**
 * PPDB Online Interactive Logic for SMP Islam Walisongo 2 Depok
 */

document.addEventListener('DOMContentLoaded', () => {
  initPpdbForm();
  initPpdbTracker();
  loadPpdbStats();
});

// 1. Submit PPDB Form
function initPpdbForm() {
  const form = document.getElementById('ppdbRegisterForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '⏳ Memproses Pendaftaran...';
    submitBtn.disabled = true;

    const payload = {
      nama_lengkap: form.nama_lengkap.value.trim(),
      nisn: form.nisn.value.trim(),
      nik: form.nik ? form.nik.value.trim() : '',
      jenis_kelamin: form.jenis_kelamin.value,
      tempat_lahir: form.tempat_lahir ? form.tempat_lahir.value.trim() : '',
      tanggal_lahir: form.tanggal_lahir ? form.tanggal_lahir.value : '',
      asal_sekolah: form.asal_sekolah.value.trim(),
      nama_wali: form.nama_wali.value.trim(),
      no_wa_wali: form.no_wa_wali.value.trim(),
      alamat_lengkap: form.alamat_lengkap ? form.alamat_lengkap.value.trim() : '',
      jalur_pendaftaran: form.jalur_pendaftaran.value,
      pilihan_peminatan: form.pilihan_peminatan ? form.pilihan_peminatan.value : 'Reguler & Tahfidz'
    };

    // NISN validation
    if (payload.nisn.length !== 10 || isNaN(payload.nisn)) {
      showToast('NISN harus berjumlah 10 digit angka!', 'error');
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
      return;
    }

    try {
      const response = await fetch('/api/ppdb/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const result = await response.json();

      if (response.ok && result.status === 'success') {
        form.reset();
        closeModal('modalPpdbRegister');
        showPpdbSuccessModal(result);
        loadPpdbStats();
      } else {
        showToast(result.detail || 'Terjadi kesalahan saat menyimpan pendaftaran', 'error');
      }
    } catch (err) {
      showToast('Gagal terhubung ke server pendaftaran', 'error');
    } finally {
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }
  });
}

// 2. Render Printable Registration Receipt Modal
function showPpdbSuccessModal(res) {
  const d = res.data;
  const modalContainer = document.getElementById('modalPpdbSuccess');
  const contentBox = document.getElementById('ppdbSuccessContent');

  if (modalContainer && contentBox) {
    contentBox.innerHTML = `
      <div id="printableReceipt" style="background:#ffffff; border:2px dashed #059669; border-radius:16px; padding:2rem; text-align:left;">
        <!-- Header Receipt -->
        <div style="display:flex; align-items:center; gap:1rem; border-bottom:2px solid #064e3b; padding-bottom:1rem; margin-bottom:1.25rem;">
          <img src="/static/images/logo-sekolah.png" style="width:65px; height:65px; object-fit:contain;" alt="Logo Walisongo">
          <div>
            <h3 style="color:#064e3b; font-size:1.15rem; font-weight:800; margin:0;">SMP ISLAM WALISONGO 2 DEPOK</h3>
            <p style="font-size:0.75rem; color:#d97706; font-weight:700; margin:0;">YAYASAN PONDOK PESANTREN HJ. DARDJAH AMIN</p>
            <p style="font-size:0.75rem; color:#64748b; margin:0;">NPSN: 70043562 • Akreditasi A • Jl. Cepit Raya, Cilodong, Depok</p>
          </div>
        </div>

        <div style="text-align:center; margin-bottom:1.5rem;">
          <span style="background:#ecfdf5; color:#047857; font-size:0.8rem; font-weight:800; padding:0.3rem 0.85rem; border-radius:999px; border:1px solid #10b981;">
            BUKTI RESMI PENDAFTARAN PPDB TA 2026/2027
          </span>
          <h2 style="color:#0f172a; font-size:1.4rem; font-weight:900; margin-top:0.75rem; letter-spacing:1px;">
            ${d.nomor_registrasi}
          </h2>
          <p style="font-size:0.8rem; color:#64748b;">Simpan nomor ini untuk cek status kelulusan / verifikasi</p>
        </div>

        <!-- Student Data -->
        <table style="width:100%; font-size:0.875rem; border-collapse:collapse; margin-bottom:1.5rem;">
          <tr style="border-bottom:1px solid #f1f5f9;">
            <td style="padding:0.4rem 0; color:#64748b; width:40%;">Nama Lengkap:</td>
            <td style="padding:0.4rem 0; font-weight:700; color:#0f172a;">${d.nama_lengkap}</td>
          </tr>
          <tr style="border-bottom:1px solid #f1f5f9;">
            <td style="padding:0.4rem 0; color:#64748b;">NISN:</td>
            <td style="padding:0.4rem 0; font-weight:700;">${d.nisn}</td>
          </tr>
          <tr style="border-bottom:1px solid #f1f5f9;">
            <td style="padding:0.4rem 0; color:#64748b;">Asal SD / MI:</td>
            <td style="padding:0.4rem 0; font-weight:700;">${d.asal_sekolah}</td>
          </tr>
          <tr style="border-bottom:1px solid #f1f5f9;">
            <td style="padding:0.4rem 0; color:#64748b;">Jalur Pendaftaran:</td>
            <td style="padding:0.4rem 0; font-weight:700; color:#047857;">${d.jalur_pendaftaran}</td>
          </tr>
          <tr style="border-bottom:1px solid #f1f5f9;">
            <td style="padding:0.4rem 0; color:#64748b;">Nama Wali / No. WA:</td>
            <td style="padding:0.4rem 0; font-weight:700;">${d.nama_wali} (${d.no_wa_wali})</td>
          </tr>
          <tr>
            <td style="padding:0.4rem 0; color:#64748b;">Status Awal:</td>
            <td style="padding:0.4rem 0; font-weight:800; color:#d97706;">${d.status_seleksi}</td>
          </tr>
        </table>

        <!-- Actions -->
        <div style="display:flex; gap:0.75rem; justify-content:center; flex-wrap:wrap;">
          <button onclick="window.print()" class="btn-primary-hero" style="font-size:0.85rem; padding:0.6rem 1.25rem;">
            🖨️ Cetak / Simpan PDF
          </button>
          <a href="https://wa.me/6281290904356?text=Halo%20Panitia%20PPDB%20SMP%20Islam%20Walisongo%202%20Depok,%20saya%20telah%20mendaftar%20dengan%20No.%20Registrasi%20${d.nomor_registrasi}" target="_blank" class="btn-secondary-hero" style="color:#022c22; border-color:#022c22; font-size:0.85rem; padding:0.6rem 1.25rem;">
            📲 Konfirmasi ke WhatsApp Panitia
          </a>
        </div>
      </div>
    `;
    modalContainer.classList.add('active');
  }
}

// 3. Status Tracker Lookup
function initPpdbTracker() {
  const btn = document.getElementById('btnCheckPpdbStatus');
  const input = document.getElementById('inputTrackQuery');
  const resultDiv = document.getElementById('ppdbTrackResult');

  if (!btn || !input || !resultDiv) return;

  btn.addEventListener('click', async () => {
    const q = input.value.trim();
    if (!q) {
      showToast('Masukkan Nomor Registrasi (REG-...) atau 10 digit NISN Anda', 'error');
      return;
    }

    resultDiv.innerHTML = '<div style="text-align:center; padding:1.5rem;"><p>🔍 Mencari data pendaftaran...</p></div>';

    try {
      const res = await fetch(`/api/ppdb/check/${encodeURIComponent(q)}`);
      const data = await res.json();

      if (data.status === 'success') {
        const d = data.data;
        const isDiterima = d.status_seleksi.toLowerCase().includes('diterima');
        const badgeColor = isDiterima ? '#059669' : '#d97706';

        resultDiv.innerHTML = `
          <div style="background:#ffffff; border:1px solid #cbd5e1; border-radius:14px; padding:1.5rem; box-shadow:0 4px 12px rgba(0,0,0,0.05); margin-top:1rem;">
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem; border-bottom:1px solid #f1f5f9; padding-bottom:0.75rem;">
              <div>
                <h4 style="font-size:1.1rem; font-weight:800; color:#0f172a; margin:0;">${d.nama_lengkap}</h4>
                <p style="font-size:0.8rem; color:#64748b; margin:0;">No. Reg: <strong>${d.nomor_registrasi}</strong> • NISN: ${d.nisn}</p>
              </div>
              <span style="background:${badgeColor}; color:#fff; font-size:0.75rem; font-weight:800; padding:0.35rem 0.85rem; border-radius:999px;">
                ${d.status_seleksi}
              </span>
            </div>

            <div style="font-size:0.875rem; color:#334155; line-height:1.6; margin-bottom:1rem;">
              <p><strong>Asal Sekolah:</strong> ${d.asal_sekolah}</p>
              <p><strong>Jalur Pendaftaran:</strong> ${d.jalur_pendaftaran}</p>
              <p><strong>Catatan Panitia:</strong> ${d.catatan || 'Berkas sedang dalam antrean verifikasi tim PPDB.'}</p>
            </div>

            <div style="background:#f8fafc; border-radius:8px; padding:0.75rem; font-size:0.8rem; color:#475569;">
              ℹ️ Jika memerlukan bantuan verifikasi berkas fisik, silakan hubungi Hotline PPDB: <strong>+62 812-9090-4356</strong>
            </div>
          </div>
        `;
      } else {
        resultDiv.innerHTML = `
          <div style="background:#fef2f2; border:1px solid #f87171; border-radius:12px; padding:1.25rem; margin-top:1rem; color:#991b1b; font-size:0.875rem;">
            <p>⚠️ ${data.message}</p>
            <p style="margin-top:0.5rem; font-size:0.775rem;">Tip: Coba demo nomor pendaftaran <strong>REG-2026-WS001</strong> atau NISN <strong>0095551234</strong>.</p>
          </div>
        `;
      }
    } catch (err) {
      resultDiv.innerHTML = '<p style="color:red; margin-top:1rem;">Kendala jaringan saat memeriksa status.</p>';
    }
  });
}

// 4. Load Live PPDB Statistics
async function loadPpdbStats() {
  try {
    const res = await fetch('/api/ppdb/stats');
    const data = await res.json();
    if (data.status === 'success') {
      const totalEl = document.getElementById('statTotalPpdb');
      const sisaEl = document.getElementById('statSisaKuota');
      if (totalEl) totalEl.textContent = data.total_pendaftar;
      if (sisaEl) sisaEl.textContent = data.sisa_kuota;
    }
  } catch (e) {
    // Silent fail
  }
}
