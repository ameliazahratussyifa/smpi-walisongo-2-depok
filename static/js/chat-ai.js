/**
 * WALISONGO SMART AI ASSISTANT CHATBOT
 * Fast, reliable, polite Islamic conversational assistant for SMP Islam Walisongo 2 Depok.
 */

document.addEventListener('DOMContentLoaded', () => {
  initChatWidget();
});

function initChatWidget() {
  const triggerBtn = document.getElementById('aiChatTriggerBtn');
  const chatBox = document.getElementById('aiChatBox');
  const closeBtn = document.getElementById('btnCloseAi');
  const sendBtn = document.getElementById('btnAiSend');
  const inputField = document.getElementById('aiChatInput');
  const messagesList = document.getElementById('aiMessagesList');

  if (!triggerBtn || !chatBox) return;

  triggerBtn.addEventListener('click', () => {
    chatBox.classList.toggle('open');
    if (chatBox.classList.contains('open') && inputField) {
      inputField.focus();
    }
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      chatBox.classList.remove('open');
    });
  }

  // Quick prompt buttons
  document.querySelectorAll('.ai-chip-prompt').forEach(chip => {
    chip.addEventListener('click', () => {
      const query = chip.getAttribute('data-prompt') || chip.textContent.trim();
      sendAiMessage(query);
    });
  });

  if (sendBtn && inputField) {
    sendBtn.addEventListener('click', () => {
      const q = inputField.value.trim();
      if (q) {
        sendAiMessage(q);
        inputField.value = '';
      }
    });

    inputField.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        const q = inputField.value.trim();
        if (q) {
          sendAiMessage(q);
          inputField.value = '';
        }
      }
    });
  }
}

async function sendAiMessage(question) {
  const messagesList = document.getElementById('aiMessagesList');
  if (!messagesList) return;

  // Append User message
  const userBubble = document.createElement('div');
  userBubble.className = 'ai-msg user';
  userBubble.textContent = question;
  messagesList.appendChild(userBubble);

  // Typing indicator
  const typingIndicator = document.createElement('div');
  typingIndicator.className = 'ai-msg bot';
  typingIndicator.id = 'aiTypingIndicator';
  typingIndicator.textContent = 'Mengetik jawaban...';
  messagesList.appendChild(typingIndicator);

  messagesList.scrollTop = messagesList.scrollHeight;

  try {
    const res = await fetch('/api/ai/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ pertanyaan: question })
    });
    const data = await res.json();

    const indicator = document.getElementById('aiTypingIndicator');
    if (indicator) indicator.remove();

    const botBubble = document.createElement('div');
    botBubble.className = 'ai-msg bot';
    botBubble.textContent = data.jawaban;
    messagesList.appendChild(botBubble);
  } catch (err) {
    const indicator = document.getElementById('aiTypingIndicator');
    if (indicator) indicator.remove();

    const botBubble = document.createElement('div');
    botBubble.className = 'ai-msg bot';
    botBubble.textContent = "Mohon maaf, terjadi kendala saat menghubungkan ke asisten. Silakan hubungi langsung panitia di WhatsApp +62 812-9090-4356.";
    messagesList.appendChild(botBubble);
  }

  messagesList.scrollTop = messagesList.scrollHeight;
}
