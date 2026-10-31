export function openModal(name) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('open-modal', { detail: name }));
  }
}

export function closeModal(name) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('close-modal', { detail: name }));
  }
}

export function showToast(message, type = 'info') {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('show-toast', { detail: { message, type } }));
  }
}
