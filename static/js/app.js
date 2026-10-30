/**
 * SMP ISLAM WALISONGO 2 DEPOK - CORE APPLICATION JS
 * Handles navigation, stats counters, modals, news filtering, and academic report lookup.
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavbar();
  initStatsCounter();
  initNewsFilters();
  initModals();
  initServiceWorker();
});

// 1. Mobile Menu & Navbar Effects
function initNavbar() {
  const toggleBtn = document.querySelector('.btn-menu-toggle');
  const navMenu = document.querySelector('.nav-menu');

  if (toggleBtn && navMenu) {
    toggleBtn.addEventListener('click', () => {
      navMenu.classList.toggle('mobile-open');
      if (navMenu.classList.contains('mobile-open')) {
        navMenu.style.display = 'flex';
        navMenu.style.flexDirection = 'column';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '80px';
        navMenu.style.left = '0';
        navMenu.style.right = '0';
        navMenu.style.background = '#ffffff';
        navMenu.style.padding = '1.5rem';
        navMenu.style.boxShadow = '0 10px 25px rgba(0,0,0,0.1)';
      } else {
        navMenu.style.display = '';
      }
    });
  }

  // Scroll shadow effect
  window.addEventListener('scroll', () => {
    const nav = document.querySelector('.main-nav');
    if (nav) {
      if (window.scrollY > 40) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }
  });
}

// 2. Animated Counter for Stats
function initStatsCounter() {
  const statElements = document.querySelectorAll('.stat-num[data-target]');
  if (!statElements.length) return;

  const runCounter = (el) => {
    const targetStr = el.getAttribute('data-target');
    const suffix = el.getAttribute('data-suffix') || '';
    const target = parseInt(targetStr, 10);
    
    if (isNaN(target)) {
      el.textContent = targetStr + suffix;
      return;
    }

    let current = 0;
    const step = Math.max(1, Math.ceil(target / 30));
    const timer = setInterval(() => {
      current += step;
      if (current >= target) {
        el.textContent = target + suffix;
        clearInterval(timer);
      } else {
        el.textContent = current + suffix;
      }
    }, 25);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          runCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });

    statElements.forEach(el => observer.observe(el));
  } else {
    statElements.forEach(el => runCounter(el));
  }
}

// 3. News Filtering Tabs
function initNewsFilters() {
  const tabBtns = document.querySelectorAll('.news-tab-btn');
  const newsCards = document.querySelectorAll('.news-card');

  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      newsCards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.style.display = 'flex';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// 4. Modal Handlers
function initModals() {
  // Close buttons
  document.querySelectorAll('.btn-close-modal, .modal-backdrop').forEach(elem => {
    elem.addEventListener('click', (e) => {
      if (e.target === elem || elem.classList.contains('btn-close-modal')) {
        document.querySelectorAll('.modal-backdrop').forEach(m => m.classList.remove('active'));
      }
    });
  });

  // Stop propagation inside modal window
  document.querySelectorAll('.modal-window').forEach(win => {
    win.addEventListener('click', (e) => e.stopPropagation());
  });
}

function openModal(modalId) {
  const target = document.getElementById(modalId);
  if (target) {
    target.classList.add('active');
  }
}

function closeModal(modalId) {
  const target = document.getElementById(modalId);
  if (target) {
    target.classList.remove('active');
  }
}

// 5. Cek Nilai & Raport Siswa (Academic Report Verification)
async function checkRaportSiswa() {
  const input = document.getElementById('raportNisnInput');
  const resultDiv = document.getElementById('raportResultBox');
  if (!input || !resultDiv) return;

  const nisn = input.value.trim();
  if (!nisn) {
    showToast('Silakan masukkan NISN siswa terlebih dahulu', 'error');
    return;
  }

  resultDiv.innerHTML = '<div style="text-align:center; padding:1.5rem;"><p>🔍 Memeriksa pangkalan data Dapodik & SIAKAD...</p></div>';

  try {
    const res = await fetch('/api/raport/check', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nisn })
    });
    const data = await res.json();

    if (data.status === 'success') {
      const d = data.data;
      resultDiv.innerHTML = `
        <div style="background:#ecfdf5; border:1px solid #10b981; border-radius:12px; padding:1.25rem; margin-top:1rem;">
          <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.75rem; border-bottom:1px solid #a7f3d0; padding-bottom:0.5rem;">
            <div>
              <h4 style="color:#064e3b; font-size:1.1rem; font-weight:800;">${d.nama_siswa}</h4>
              <p style="font-size:0.85rem; color:#047857;">NISN: ${d.nisn} • ${d.kelas} (${d.tahun_ajaran})</p>
            </div>
            <span style="background:#047857; color:#fff; font-size:0.75rem; font-weight:800; padding:0.25rem 0.65rem; border-radius:999px;">${d.status_kelulusan}</span>
          </div>

          <div style="display:grid; grid-template-columns:repeat(2, 1fr); gap:0.5rem; font-size:0.875rem; margin-bottom:1rem;">
            <div><strong>PA & BP:</strong> ${d.nilai_pabp} (Sangat Baik)</div>
            <div><strong>PPKn:</strong> ${d.nilai_ppkn}</div>
            <div><strong>Bhs. Indonesia:</strong> ${d.nilai_bindo}</div>
            <div><strong>Bhs. Inggris:</strong> ${d.nilai_binggris}</div>
            <div><strong>Matematika:</strong> ${d.nilai_matematika}</div>
            <div><strong>IPA Terpadu:</strong> ${d.nilai_ipa}</div>
            <div><strong>IPS Terpadu:</strong> ${d.nilai_ips}</div>
            <div><strong>Tahfidz Qur'an:</strong> <span style="color:#047857; font-weight:700;">${d.nilai_tahfidz}</span></div>
          </div>

          <div style="border-top:1px dashed #6ee7b7; padding-top:0.65rem; display:flex; justify-content:space-between; align-items:center;">
            <span style="font-size:0.8rem; color:#064e3b;">Predikat Karakter & Adab: <strong>${d.akhlak}</strong></span>
            <button onclick="window.print()" class="btn-primary-hero" style="font-size:0.75rem; padding:0.35rem 0.85rem;">🖨️ Cetak Ringkasan</button>
          </div>
        </div>
      `;
    } else {
      resultDiv.innerHTML = `
        <div style="background:#fef2f2; border:1px solid #f87171; border-radius:12px; padding:1rem; margin-top:1rem; color:#991b1b; font-size:0.9rem;">
          <p>⚠️ ${data.message}</p>
        </div>
      `;
    }
  } catch (err) {
    resultDiv.innerHTML = '<p style="color:red; margin-top:1rem;">Terjadi kendala saat memeriksa data.</p>';
  }
}

// 6. Kalkulator Simulasi Biaya SPP & Beasiswa
function calculateTuition() {
  const isTahfidz = document.getElementById('calcTahfidz')?.checked || false;
  const isPrestasi = document.getElementById('calcPrestasi')?.checked || false;
  const isSibling = document.getElementById('calcSibling')?.checked || false;

  let basePangkal = 3500000;
  let baseSpp = 350000;
  let seragam = 950000;

  let diskonPangkal = 0;
  let diskonSpp = 0;

  if (isTahfidz) {
    diskonPangkal += 3500000; // 100% bebas uang pangkal
  } else if (isPrestasi) {
    diskonPangkal += 1000000; // Potongan 1jt
    diskonSpp += 100000;
  }

  if (isSibling) {
    diskonSpp += 50000;
  }

  const netPangkal = Math.max(0, basePangkal - diskonPangkal);
  const netSpp = Math.max(150000, baseSpp - diskonSpp);
  const totalAwal = netPangkal + seragam + netSpp;

  const resultBox = document.getElementById('calcResultBox');
  if (resultBox) {
    resultBox.innerHTML = `
      <div style="background:#f0fdf4; border:1px solid #86efac; border-radius:12px; padding:1.25rem;">
        <h4 style="color:#064e3b; font-weight:800; font-size:1.05rem; margin-bottom:0.75rem;">📋 Hasil Estimasi Biaya Pendidikan:</h4>
        <ul style="list-style:none; font-size:0.875rem; color:#1e293b; display:flex; flex-direction:column; gap:0.4rem; margin-bottom:1rem;">
          <li style="display:flex; justify-content:space-between;"><span>Uang Pangkal / Sarpras:</span> <strong>Rp ${netPangkal.toLocaleString('id-ID')} ${diskonPangkal > 0 ? '<span style="color:#059669;">(Diskon Beasiswa)</span>' : ''}</strong></li>
          <li style="display:flex; justify-content:space-between;"><span>Seragam Lengkap (5 Stel):</span> <strong>Rp ${seragam.toLocaleString('id-ID')}</strong></li>
          <li style="display:flex; justify-content:space-between;"><span>SPP Bulan Pertama:</span> <strong>Rp ${netSpp.toLocaleString('id-ID')} / bln</strong></li>
          <li style="border-top:1px dashed #cbd5e1; padding-top:0.5rem; display:flex; justify-content:space-between; font-size:1rem; font-weight:800; color:#064e3b;">
            <span>Total Pembayaran Masuk Awal:</span>
            <span>Rp ${totalAwal.toLocaleString('id-ID')}</span>
          </li>
        </ul>
        <p style="font-size:0.775rem; color:#64748b; margin-bottom:0.75rem;">*Uang pangkal dapat dicicil 3x selama semester ganjil. Tidak ada biaya pendaftaran formulir.</p>
        <button onclick="closeModal('modalKalkulator'); openModal('modalPpdbRegister');" class="btn-primary-hero" style="width:100%; justify-content:center; font-size:0.875rem; padding:0.6rem;">
          Lanjut Daftar PPDB Sekarang ➜
        </button>
      </div>
    `;
  }
}

// 7. Toast Notification Utility
function showToast(message, type = 'info') {
  const existing = document.querySelector('.custom-toast-msg');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'custom-toast-msg';
  toast.style.position = 'fixed';
  toast.style.bottom = '2rem';
  toast.style.left = '50%';
  toast.style.transform = 'translateX(-50%)';
  toast.style.background = type === 'error' ? '#dc2626' : (type === 'success' ? '#059669' : '#0f172a');
  toast.style.color = '#ffffff';
  toast.style.padding = '0.75rem 1.5rem';
  toast.style.borderRadius = '999px';
  toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.2)';
  toast.style.fontSize = '0.9rem';
  toast.style.fontWeight = '700';
  toast.style.zIndex = '9999';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.gap = '0.5rem';
  toast.textContent = message;

  document.body.appendChild(toast);

  setTimeout(() => {
    toast.style.transition = 'opacity 0.4s ease';
    toast.style.opacity = '0';
    setTimeout(() => toast.remove(), 400);
  }, 3500);
}

// 8. Service Worker Registration
function initServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js').catch(err => {
        console.log('SW registration note:', err);
      });
    });
  }
}
