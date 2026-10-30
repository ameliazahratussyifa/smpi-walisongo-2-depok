/**
 * Mobile App Mode Simulator & PWA Installer
 */

let deferredPrompt = null;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;
  const pwaBanner = document.getElementById('mobilePwaBanner');
  if (pwaBanner) {
    pwaBanner.style.display = 'flex';
  }
});

function installPwaApp() {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((choiceResult) => {
      if (choiceResult.outcome === 'accepted') {
        console.log('User installed PWA');
      }
      deferredPrompt = null;
    });
  } else if (typeof openModal === 'function' && document.getElementById('modalDownloadApk')) {
    openModal('modalDownloadApk');
  } else {
    alert('Aplikasi siap di-install melalui menu browser Anda ("Instal Aplikasi" / "Tambahkan ke Layar Utama").');
  }
}

function openMobileSimulator() {
  const overlay = document.getElementById('mobileSimulatorOverlay');
  if (overlay) {
    overlay.classList.add('active');
  } else {
    window.location.href = '/mobile';
  }
}

function closeMobileSimulator() {
  const overlay = document.getElementById('mobileSimulatorOverlay');
  if (overlay) {
    overlay.classList.remove('active');
  }
}
