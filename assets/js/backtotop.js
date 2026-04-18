const btn = document.getElementById('app-back-to-top');
if (btn) {
  btn.onclick = () => scrollTo({ top: 0, behavior: 'smooth' });
  onscroll = () => { btn.style.display = scrollY > 300 ? 'flex' : 'none' };
}
export default {};