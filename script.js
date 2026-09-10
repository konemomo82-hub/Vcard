/**
 * Interactive vCard & QR Code Handler
 * Souleymane Kone - ZANGA
 */

document.addEventListener('DOMContentLoaded', () => {
  // Raw vCard Data to be encoded into QR Code
  const vCardData = `BEGIN:VCARD
VERSION:3.0
N:Kone;Souleymane;;;
FN:Souleymane Kone
ORG:ZANGA
TITLE:Développeur Web & Consultant
TEL;TYPE=CELL,VOICE:+22370000000
EMAIL;TYPE=INTERNET,PREF:contact@zanga.ml
URL:https://zanga.ml
ADR;TYPE=WORK,POSTAL,PARCEL:;;Bamako;Bamako;;;Mali
LABEL;TYPE=WORK,POSTAL,PARCEL:Bamako\\, Mali
X-SOCIALPROFILE;TYPE=linkedin:https://linkedin.com/in/souleymane-kone
X-SOCIALPROFILE;TYPE=github:https://github.com/souleymane-kone
X-SOCIALPROFILE;TYPE=whatsapp:https://wa.me/22370000000
NOTE:Développeur Web & Consultant chez ZANGA. Expert en solutions web modernes et stratégie digitale.
END:VCARD`;

  // DOM Elements
  const openQrModalBtn = document.getElementById('openQrModalBtn');
  const closeQrModalBtn = document.getElementById('closeQrModalBtn');
  const qrModal = document.getElementById('qrModal');
  const qrcodeContainer = document.getElementById('qrcodeContainer');

  let qrCodeInstance = null;

  // Initialize and render QR Code inside Modal Container
  function generateQRCode() {
    if (!qrcodeContainer) return;

    // Clear existing content if any
    qrcodeContainer.innerHTML = '';

    if (typeof QRCode !== 'undefined') {
      qrCodeInstance = new QRCode(qrcodeContainer, {
        text: vCardData,
        width: 220,
        height: 220,
        colorDark: '#0F172A',
        colorLight: '#FFFFFF',
        correctLevel: QRCode.CorrectLevel.M
      });
    } else {
      console.error('QRCode.js library is not loaded.');
      qrcodeContainer.innerHTML = '<p style="color:#f43f5e;">Erreur lors du chargement du QR Code.</p>';
    }
  }

  // Open Modal
  function openModal() {
    if (!qrCodeInstance) {
      generateQRCode();
    }
    qrModal.classList.add('active');
    qrModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling
  }

  // Close Modal
  function closeModal() {
    qrModal.classList.remove('active');
    qrModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Event Listeners
  if (openQrModalBtn) {
    openQrModalBtn.addEventListener('click', openModal);
  }

  if (closeQrModalBtn) {
    closeQrModalBtn.addEventListener('click', closeModal);
  }

  // Close when clicking outside the modal content card
  if (qrModal) {
    qrModal.addEventListener('click', (event) => {
      if (event.target === qrModal) {
        closeModal();
      }
    });
  }

  // Close modal on Escape key press
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && qrModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Pre-generate QR Code in background
  generateQRCode();
});
