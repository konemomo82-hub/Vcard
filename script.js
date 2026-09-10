/**
 * vcard - Dynamic Business Card & QR Code Generator
 * JavaScript Logic
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements - Form Inputs
  const inputFullName = document.getElementById('inputFullName');
  const inputJobTitle = document.getElementById('inputJobTitle');
  const inputCompany = document.getElementById('inputCompany');
  const inputLocation = document.getElementById('inputLocation');
  const inputAvatarUrl = document.getElementById('inputAvatarUrl');
  const inputPhone = document.getElementById('inputPhone');
  const inputEmail = document.getElementById('inputEmail');
  const inputBio = document.getElementById('inputBio');

  const websitesContainer = document.getElementById('websitesContainer');
  const socialsContainer = document.getElementById('socialsContainer');
  const addWebsiteBtn = document.getElementById('addWebsiteBtn');
  const addSocialBtn = document.getElementById('addSocialBtn');
  const loadExampleBtn = document.getElementById('loadExampleBtn');

  const addNewCardBtnHeader = document.getElementById('addNewCardBtnHeader');
  const addNewCardBtnForm = document.getElementById('addNewCardBtnForm');

  // Elements - Preview Card
  const previewAvatar = document.getElementById('previewAvatar');
  const previewName = document.getElementById('previewName');
  const previewTitle = document.getElementById('previewTitle');
  const previewCompany = document.getElementById('previewCompany');
  const previewCompanyBox = document.getElementById('previewCompanyBox');
  const previewLocation = document.getElementById('previewLocation');
  const previewLocationBox = document.getElementById('previewLocationBox');

  const previewCallBtn = document.getElementById('previewCallBtn');
  const previewEmailBtn = document.getElementById('previewEmailBtn');
  const previewWhatsappBtn = document.getElementById('previewWhatsappBtn');

  const previewBio = document.getElementById('previewBio');
  const previewBioBox = document.getElementById('previewBioBox');
  const previewPhone = document.getElementById('previewPhone');
  const previewPhoneBox = document.getElementById('previewPhoneBox');
  const previewEmail = document.getElementById('previewEmail');
  const previewEmailBox = document.getElementById('previewEmailBox');

  const previewWebsitesList = document.getElementById('previewWebsitesList');
  const previewSocialsBox = document.getElementById('previewSocialsBox');
  const previewSocialIcons = document.getElementById('previewSocialIcons');

  const downloadVCardBtn = document.getElementById('downloadVCardBtn');
  const modalDownloadVCardBtn = document.getElementById('modalDownloadVCardBtn');
  const downloadQrImageBtn = document.getElementById('downloadQrImageBtn');
  const openQrModalBtn = document.getElementById('openQrModalBtn');
  const previewQrBtn = document.getElementById('previewQrBtn');
  const closeQrModalBtn = document.getElementById('closeQrModalBtn');
  const qrModal = document.getElementById('qrModal');
  const qrcodeContainer = document.getElementById('qrcodeContainer');

  // Set Current Year
  if (document.getElementById('currentYear')) {
    document.getElementById('currentYear').textContent = new Date().getFullYear();
  }

  // QR Code instance
  let qrcodeInstance = null;

  // Initial State: Default Sample Data
  const defaultWebsites = [
    { label: 'Site Web', url: 'https://zanga.ml' }
  ];

  const defaultSocials = [
    { platform: 'linkedin', url: 'https://linkedin.com/in/souleymane-kone' },
    { platform: 'github', url: 'https://github.com/souleymane-kone' },
    { platform: 'whatsapp', url: 'https://wa.me/22370000000' }
  ];

  // Initialize Default Form Rows
  function initDefaultRows() {
    websitesContainer.innerHTML = '';
    socialsContainer.innerHTML = '';

    defaultWebsites.forEach(site => addWebsiteRow(site.label, site.url));
    defaultSocials.forEach(social => addSocialRow(social.platform, social.url));
  }

  // Add Website Row
  function addWebsiteRow(label = '', url = '') {
    const row = document.createElement('div');
    row.className = 'dynamic-row website-row';
    row.innerHTML = `
      <input type="text" class="website-label" placeholder="Nom (ex: Portfolio)" value="${escapeHtml(label)}">
      <input type="url" class="website-url" placeholder="https://..." value="${escapeHtml(url)}">
      <button type="button" class="btn-remove-row" title="Supprimer"><i class="fa-solid fa-trash"></i></button>
    `;
    websitesContainer.appendChild(row);

    row.querySelector('.btn-remove-row').addEventListener('click', () => {
      row.remove();
      updatePreview();
    });

    row.querySelectorAll('input').forEach(input => {
      input.addEventListener('input', updatePreview);
    });
  }

  // Add Social Row
  function addSocialRow(platform = 'linkedin', url = '') {
    const row = document.createElement('div');
    row.className = 'dynamic-row social-row';
    row.innerHTML = `
      <select class="social-platform">
        <option value="linkedin" ${platform === 'linkedin' ? 'selected' : ''}>LinkedIn</option>
        <option value="whatsapp" ${platform === 'whatsapp' ? 'selected' : ''}>WhatsApp</option>
        <option value="github" ${platform === 'github' ? 'selected' : ''}>GitHub</option>
        <option value="twitter" ${platform === 'twitter' ? 'selected' : ''}>X / Twitter</option>
        <option value="facebook" ${platform === 'facebook' ? 'selected' : ''}>Facebook</option>
        <option value="instagram" ${platform === 'instagram' ? 'selected' : ''}>Instagram</option>
        <option value="youtube" ${platform === 'youtube' ? 'selected' : ''}>YouTube</option>
        <option value="tiktok" ${platform === 'tiktok' ? 'selected' : ''}>TikTok</option>
      </select>
      <input type="url" class="social-url" placeholder="Lien du profil" value="${escapeHtml(url)}">
      <button type="button" class="btn-remove-row" title="Supprimer"><i class="fa-solid fa-trash"></i></button>
    `;
    socialsContainer.appendChild(row);

    row.querySelector('.btn-remove-row').addEventListener('click', () => {
      row.remove();
      updatePreview();
    });

    row.querySelector('select').addEventListener('change', updatePreview);
    row.querySelector('input').addEventListener('input', updatePreview);
  }

  // Helper: Escape HTML
  function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  // Helper: Clean phone number for tel: link
  function cleanPhone(phone) {
    return phone.replace(/[^\d+]/g, '');
  }

  // Social Platform Icon Class Map
  const socialIconsMap = {
    linkedin: 'fa-brands fa-linkedin-in',
    whatsapp: 'fa-brands fa-whatsapp',
    github: 'fa-brands fa-github',
    twitter: 'fa-brands fa-x-twitter',
    facebook: 'fa-brands fa-facebook-f',
    instagram: 'fa-brands fa-instagram',
    youtube: 'fa-brands fa-youtube',
    tiktok: 'fa-brands fa-tiktok'
  };

  // Build vCard Data Object from Form
  function getVCardData() {
    const name = inputFullName.value.trim() || 'Votre Nom';
    const title = inputJobTitle.value.trim();
    const company = inputCompany.value.trim();
    const location = inputLocation.value.trim();
    const avatarUrl = inputAvatarUrl.value.trim();
    const phone = inputPhone.value.trim();
    const email = inputEmail.value.trim();
    const bio = inputBio.value.trim();

    // Websites
    const websites = [];
    document.querySelectorAll('.website-row').forEach(row => {
      const label = row.querySelector('.website-label').value.trim() || 'Site Web';
      const url = row.querySelector('.website-url').value.trim();
      if (url) websites.push({ label, url });
    });

    // Socials
    const socials = [];
    document.querySelectorAll('.social-row').forEach(row => {
      const platform = row.querySelector('.social-platform').value;
      const url = row.querySelector('.social-url').value.trim();
      if (url) socials.push({ platform, url });
    });

    return { name, title, company, location, avatarUrl, phone, email, bio, websites, socials };
  }

  // Generate VCF vCard Standard String
  function generateVCFString(data) {
    const nameParts = data.name.trim().split(/\s+/);
    const lastName = nameParts.length > 1 ? nameParts.pop() : '';
    const firstName = nameParts.join(' ');

    let vcf = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `N:${lastName};${firstName};;;`,
      `FN:${data.name}`
    ];

    if (data.company) vcf.push(`ORG:${data.company}`);
    if (data.title) vcf.push(`TITLE:${data.title}`);
    if (data.phone) vcf.push(`TEL;TYPE=CELL,VOICE:${cleanPhone(data.phone)}`);
    if (data.email) vcf.push(`EMAIL;TYPE=INTERNET,PREF:${data.email}`);
    if (data.location) vcf.push(`ADR;TYPE=WORK:;;;${data.location};;;`);

    data.websites.forEach(site => {
      vcf.push(`URL:${site.url}`);
    });

    data.socials.forEach(soc => {
      vcf.push(`X-SOCIALPROFILE;TYPE=${soc.platform}:${soc.url}`);
    });

    if (data.bio) {
      const sanitizedBio = data.bio.replace(/\n/g, ' ');
      vcf.push(`NOTE:${sanitizedBio}`);
    }

    vcf.push('END:VCARD');
    return vcf.join('\r\n');
  }

  // Live Update Preview Card
  function updatePreview() {
    const data = getVCardData();

    // Profile Header
    previewName.textContent = data.name;

    if (data.title) {
      previewTitle.textContent = data.title;
      previewTitle.style.display = 'block';
    } else {
      previewTitle.style.display = 'none';
    }

    if (data.company) {
      previewCompany.textContent = data.company;
      previewCompanyBox.style.display = 'inline-flex';
    } else {
      previewCompanyBox.style.display = 'none';
    }

    if (data.location) {
      previewLocation.textContent = data.location;
      previewLocationBox.style.display = 'inline-flex';
    } else {
      previewLocationBox.style.display = 'none';
    }

    // Avatar
    if (data.avatarUrl) {
      previewAvatar.src = data.avatarUrl;
    } else {
      const encodedName = encodeURIComponent(data.name);
      previewAvatar.src = `https://ui-avatars.com/api/?name=${encodedName}&background=4F46E5&color=fff&size=256&bold=true&font-family=Outfit`;
    }

    // Quick Action Buttons
    if (data.phone) {
      const cPhone = cleanPhone(data.phone);
      previewCallBtn.href = `tel:${cPhone}`;
      previewWhatsappBtn.href = `https://wa.me/${cPhone.replace(/^\+/, '')}`;
      previewCallBtn.style.display = 'flex';
      previewWhatsappBtn.style.display = 'flex';
    } else {
      previewCallBtn.style.display = 'none';
      previewWhatsappBtn.style.display = 'none';
    }

    if (data.email) {
      previewEmailBtn.href = `mailto:${data.email}`;
      previewEmailBtn.style.display = 'flex';
    } else {
      previewEmailBtn.style.display = 'none';
    }

    // Bio
    if (data.bio) {
      previewBio.textContent = data.bio;
      previewBioBox.style.display = 'block';
    } else {
      previewBioBox.style.display = 'none';
    }

    // Contact Details List
    if (data.phone) {
      previewPhone.textContent = data.phone;
      previewPhone.href = `tel:${cleanPhone(data.phone)}`;
      previewPhoneBox.style.display = 'flex';
    } else {
      previewPhoneBox.style.display = 'none';
    }

    if (data.email) {
      previewEmail.textContent = data.email;
      previewEmail.href = `mailto:${data.email}`;
      previewEmailBox.style.display = 'flex';
    } else {
      previewEmailBox.style.display = 'none';
    }

    // Dynamic Websites List
    previewWebsitesList.innerHTML = '';
    data.websites.forEach(site => {
      const item = document.createElement('div');
      item.className = 'detail-item';
      item.innerHTML = `
        <i class="fa-solid fa-globe detail-icon"></i>
        <div class="detail-content">
          <span class="detail-label">${escapeHtml(site.label)}</span>
          <a href="${escapeHtml(site.url)}" target="_blank" rel="noopener noreferrer" class="detail-value">${escapeHtml(site.url)}</a>
        </div>
      `;
      previewWebsitesList.appendChild(item);
    });

    // Dynamic Social Networks
    previewSocialIcons.innerHTML = '';
    if (data.socials.length > 0) {
      previewSocialsBox.style.display = 'block';
      data.socials.forEach(soc => {
        const iconClass = socialIconsMap[soc.platform] || 'fa-solid fa-link';
        const a = document.createElement('a');
        a.href = soc.url;
        a.target = '_blank';
        a.rel = 'noopener noreferrer';
        a.className = `social-icon ${soc.platform}`;
        a.setAttribute('aria-label', soc.platform);
        a.innerHTML = `<i class="${iconClass}"></i>`;
        previewSocialIcons.appendChild(a);
      });
    } else {
      previewSocialsBox.style.display = 'none';
    }
  }

  // Handle Download vCard (.vcf)
  function triggerVCardDownload() {
    const data = getVCardData();
    const vcfString = generateVCFString(data);
    const blob = new Blob([vcfString], { type: 'text/vcard;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    const filename = `${data.name.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_')}_contact.vcf`;
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Render QR Code in Modal
  function renderQRCode() {
    const data = getVCardData();
    const vcfString = generateVCFString(data);

    qrcodeContainer.innerHTML = '';
    qrcodeInstance = new QRCode(qrcodeContainer, {
      text: vcfString,
      width: 240,
      height: 240,
      colorDark: '#0B0F19',
      colorLight: '#FFFFFF',
      correctLevel: QRCode.CorrectLevel.M
    });
  }

  // Download QR Code as PNG Image
  function downloadQRCodeImage() {
    const data = getVCardData();
    const filename = `QRCode_${data.name.replace(/[^\w\s-]/g, '').trim().replace(/\s+/g, '_')}.png`;

    // Try canvas first
    const canvas = qrcodeContainer.querySelector('canvas');
    if (canvas) {
      const dataUrl = canvas.toDataURL('image/png');
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      return;
    }

    // Try img tag next
    const img = qrcodeContainer.querySelector('img');
    if (img && img.src) {
      const a = document.createElement('a');
      a.href = img.src;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  }

  // Reset Form to Create a New Card ("Ajouter une carte")
  function resetFormForNewCard() {
    inputFullName.value = '';
    inputJobTitle.value = '';
    inputCompany.value = '';
    inputLocation.value = '';
    inputAvatarUrl.value = '';
    inputPhone.value = '';
    inputEmail.value = '';
    inputBio.value = '';

    websitesContainer.innerHTML = '';
    socialsContainer.innerHTML = '';

    addWebsiteRow('', '');
    addSocialRow('linkedin', '');

    inputFullName.focus();
    updatePreview();
  }

  // Modal Controls
  function openModal() {
    renderQRCode();
    qrModal.classList.add('active');
    qrModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    qrModal.classList.remove('active');
    qrModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  // Event Listeners for Input Change
  [inputFullName, inputJobTitle, inputCompany, inputLocation, inputAvatarUrl, inputPhone, inputEmail, inputBio].forEach(input => {
    input.addEventListener('input', updatePreview);
  });

  addWebsiteBtn.addEventListener('click', () => {
    addWebsiteRow();
    updatePreview();
  });

  addSocialBtn.addEventListener('click', () => {
    addSocialRow();
    updatePreview();
  });

  // Action Buttons
  downloadVCardBtn.addEventListener('click', triggerVCardDownload);
  modalDownloadVCardBtn.addEventListener('click', triggerVCardDownload);
  downloadQrImageBtn.addEventListener('click', downloadQRCodeImage);

  addNewCardBtnHeader.addEventListener('click', resetFormForNewCard);
  addNewCardBtnForm.addEventListener('click', resetFormForNewCard);

  openQrModalBtn.addEventListener('click', openModal);
  previewQrBtn.addEventListener('click', openModal);
  closeQrModalBtn.addEventListener('click', closeModal);

  qrModal.addEventListener('click', (e) => {
    if (e.target === qrModal) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && qrModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Load Example Preset
  loadExampleBtn.addEventListener('click', () => {
    inputFullName.value = 'Souleymane Kone';
    inputJobTitle.value = 'Développeur Web & Consultant';
    inputCompany.value = 'ZANGA';
    inputLocation.value = 'Bamako, Mali';
    inputAvatarUrl.value = '';
    inputPhone.value = '+223 70 00 00 00';
    inputEmail.value = 'contact@zanga.ml';
    inputBio.value = 'Spécialiste du développement web moderne et de la stratégie digitale. Accompagnement des entreprises et startups dans leur transformation numérique à Bamako et à l\'international.';

    initDefaultRows();
    updatePreview();
  });

  // Initialize App
  initDefaultRows();
  updatePreview();
});
