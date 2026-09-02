function generatePDF() {
  const element = document.querySelector('body');
  const btn = document.getElementById('download-btn');

  if (!element) return;

  document.body.classList.add('pdf-generation');
  if (btn) btn.style.visibility = 'hidden';

  const opt = {
    margin:       12,
    filename:     'Portafolio_Master_Herramientas.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 2, letterRendering: true, useCORS: true, logging: false },
    jsPDF:        { unit: 'mm', format: 'letter', orientation: 'portrait' }
  };

  html2pdf().set(opt).from(element).save().then(function () {
    document.body.classList.remove('pdf-generation');
    if (btn) btn.style.visibility = 'visible';
  }).catch(function (err) {
    console.error('Error generando PDF:', err);
    document.body.classList.remove('pdf-generation');
    if (btn) btn.style.visibility = 'visible';
  });
}
