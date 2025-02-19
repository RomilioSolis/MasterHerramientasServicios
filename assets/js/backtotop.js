document.addEventListener('DOMContentLoaded', function() {
  const backToTop = document.getElementById('backToTop');
  
  window.addEventListener('scroll', function() {
      if (window.pageYOffset > 100) {
          backToTop.style.display = 'flex';
      } else {
          backToTop.style.display = 'none';
      }
  });

  backToTop.addEventListener('click', function() {
      window.scrollTo({
          top: 0,
          behavior: 'smooth'
      });
  });
});