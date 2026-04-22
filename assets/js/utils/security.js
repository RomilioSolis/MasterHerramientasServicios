// ============================================
// MÓDULO: Security Utils
// Funciones de sanitización y validación de seguridad
// ============================================
const SecurityUtils = (() => {
  
  // --- CONSTANTES PRIVADAS ---
  const HTML_ESCAPE_MAP = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '/': '&#x2F;'
  };

  const URL_PROTOCOLS = ['http:', 'https:', 'tel:', 'mailto:'];

  // --- FUNCIONES PRIVADAS ---
  
  // Escapa caracteres HTML para prevenir XSS
  function _escapeHtml(str) {
    if (str == null) return '';
    if (typeof str !== 'string') return String(str);
    return str.replace(/[&<>"'\/]/g, char => HTML_ESCAPE_MAP[char] || char);
  }

  // Escapa caracteres para atributos HTML
  function _escapeAttr(str) {
    if (str == null) return '';
    if (typeof str !== 'string') return String(str);
    return str.replace(/["&<>\/\\]/g, char => HTML_ESCAPE_MAP[char] || char);
  }

  // Valida si una URL es segura (previene javascript:, data:, etc.)
  function _isSafeUrl(url) {
    try {
      const parsed = new URL(url, window.location.origin);
      return URL_PROTOCOLS.includes(parsed.protocol);
    } catch {
      // URLs relativas son seguras
      return !url || (!url.startsWith('javascript:') && !url.startsWith('data:') && !url.startsWith('vbscript:'));
    }
  }

  // Valida número de teléfono (formato internacional básico)
  function _validatePhone(phone) {
    if (!phone) return false;
    const cleaned = String(phone).replace(/\D/g, '');
    return cleaned.length >= 10 && cleaned.length <= 15;
  }

  // Valida email básico
  function _validateEmail(email) {
    if (!email) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(String(email));
  }

  // Sanitiza objeto para renderizado seguro en HTML
  function _sanitizeObject(obj, fields) {
    const sanitized = {};
    for (const field of fields) {
      sanitized[field] = _escapeHtml(String(obj[field] || ''));
    }
    return sanitized;
  }

  // Escapa texto para uso en JavaScript (dentro de strings)
  function _escapeJs(str) {
    if (str == null) return '';
    return String(str)
      .replace(/\\/g, '\\\\')
      .replace(/'/g, "\\'")
      .replace(/"/g, '\\"')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r');
  }

  // --- API PÚBLICA ---
  return {
    // Escapa HTML para prevenir XSS
    escapeHtml: _escapeHtml,
    
    // Escapa atributos HTML
    escapeAttr: _escapeAttr,
    
    // Valida si una URL es segura
    isSafeUrl: _isSafeUrl,
    
    // Valida número de teléfono
    validatePhone: _validatePhone,
    
    // Valida email
    validateEmail: _validateEmail,
    
    // Sanitiza objeto para renderizado seguro
    sanitizeObject: _sanitizeObject,
    
    // Escapa para JavaScript
    escapeJs: _escapeJs,
    
    // Versión segura de innerHTML
    setInnerHTML: (el, html) => {
      if (!el || !_isSafeUrl('about:blank')) return;
      el.textContent = _escapeHtml(html);
    },
    
    // Versión segura con template literals
    renderTemplate: (template, data) => {
      const safeData = _sanitizeObject(data, Object.keys(data));
      return template.replace(/\{\{(\w+)\}\}/g, (_, key) => safeData[key] || '');
    },
    
    // Valida y sanitiza entrada de formulario
    validateForm: (formData) => {
      const errors = [];
      
      if (!formData.nombre || formData.nombre.length < 2) {
        errors.push('Nombre debe tener al menos 2 caracteres');
      }
      
      if (formData.email && !_validateEmail(formData.email)) {
        errors.push('Email inválido');
      }
      
      if (formData.telefono && !_validatePhone(formData.telefono)) {
        errors.push('Teléfono inválido');
      }
      
      if (formData.url && !_isSafeUrl(formData.url)) {
        errors.push('URL inválida o no permitida');
      }
      
      return { valid: errors.length === 0, errors };
    }
  };

})();

// Exportar para uso global
window.SecurityUtils = SecurityUtils;