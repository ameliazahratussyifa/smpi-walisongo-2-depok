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
  } else {
    alert('Aplikasi siap di-install melalui menu browser Anda ("Tambahkan ke Layar Utama" / "Add to Home Screen").');
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
