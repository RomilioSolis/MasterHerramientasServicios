const setCookie = (name, value, days) => {
  const expires = days ? `; expires=${new Date(Date.now() + days * 24 * 60 * 60 * 1000).toUTCString()}` : '';
  document.cookie = `${name}=${value || ''}${expires}; path=/; SameSite=Strict; Secure`;
};

const getCookie = (name) => {
  const nameEQ = `${name}=`;
  return document.cookie.split(';').reduce((acc, c) => {
    const trimmed = c.trim();
    return trimmed.startsWith(nameEQ) ? trimmed.slice(nameEQ.length) : acc;
  }, null);
};

const initCookieBanner = () => {
  const banner = document.getElementById('cookie-banner');
  if (!banner) return;
  
  const consent = getCookie('cookieConsent');
  if (consent === null) {
    banner.style.display = 'block';
  }
};

window.acceptCookies = () => {
  setCookie('cookieConsent', 'accepted', 365);
  document.getElementById('cookie-banner').style.display = 'none';
};

window.rejectCookies = () => {
  setCookie('cookieConsent', 'rejected', 365);
  document.getElementById('cookie-banner').style.display = 'none';
};

export default { initCookieBanner, setCookie, getCookie };