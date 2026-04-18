// components/category-filter/category-filter.js
// Módulo para filtrar categorías en la vista de equipos

function hideAllEquipmentDetails() {
  const container = document.getElementById('herramientas-container');
  if (container) {
    container.querySelectorAll('article').forEach(article => {
      article.style.display = 'none';
    });
  }
  const container2 = document.getElementById('herramientas-container-2');
  if (container2) {
    container2.querySelectorAll('article').forEach(article => {
      article.style.display = 'none';
    });
  }
}

function handleCategoryClick(category, button) {
  hideAllEquipmentDetails();

  document.querySelectorAll('#categoryTabs .nav-link').forEach(btn => {
    btn.classList.remove('active');
  });
  if (button) {
    button.classList.add('active');
  } else {
    const tabBtn = document.getElementById(category + '-tab');
    if (tabBtn) tabBtn.classList.add('active');
  }

  const netflixRows = document.getElementById('netflixRows');
  if (netflixRows) {
    netflixRows.style.display = 'block';
  }

  const rows = document.querySelectorAll('.netflix-row');
  
  rows.forEach(row => {
    const rowCategory = row.dataset.category;
    
    if (category === 'all') {
      row.style.display = '';
    } else if (rowCategory === category) {
      row.style.display = '';
    } else {
      row.style.display = 'none';
    }
  });

  const equiposSection = document.getElementById('equipos');
  if (equiposSection) {
    equiposSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function scrollRow(rowId, direction) {
  const row = document.getElementById(rowId);
  if (!row) return;
  
  const scrollAmount = 300;
  row.scrollBy({
    left: direction * scrollAmount,
    behavior: 'smooth'
  });
}

function showEquipmentDetail(event, category, index) {
  event.preventDefault();
  event.stopPropagation();
  
  showEquipmentDetailByIndex(category, index);
}

function showEquipmentDetailByIndex(category, index) {
  const netflixRows = document.getElementById('netflixRows');
  if (netflixRows) {
    netflixRows.style.display = 'none';
  }

  hideAllEquipmentDetails();

  const container = document.getElementById('herramientas-container');
  const container2 = document.getElementById('herramientas-container-2');
  
  const allArticles = [];
  if (container) allArticles.push(...container.querySelectorAll('article[data-category="' + category + '"]'));
  if (container2) allArticles.push(...container2.querySelectorAll('article[data-category="' + category + '"]'));
  
  if (!container && !container2) return;
  
  if (index >= 0 && index < allArticles.length) {
    allArticles[index].style.display = 'block';
    allArticles[index].classList.add('active');
    allArticles[index].scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    console.error('Índice no válido:', index, 'para categoría:', category);
    if (netflixRows) netflixRows.style.display = 'block';
  }
}

function showEquipmentDetailByTitle(event, element) {
  event.preventDefault();
  event.stopPropagation();
  
  const titleElement = element.querySelector('.netflix-item-title');
  if (!titleElement) return;
  
  const equipmentName = titleElement.textContent.trim().toLowerCase();
  
  const container = document.getElementById('herramientas-container');
  const container2 = document.getElementById('herramientas-container-2');
  if (!container && !container2) return;

  const netflixRows = document.getElementById('netflixRows');
  if (netflixRows) {
    netflixRows.style.display = 'none';
  }

  hideAllEquipmentDetails();

  const allArticles = [];
  if (container) allArticles.push(...container.querySelectorAll('article'));
  if (container2) allArticles.push(...container2.querySelectorAll('article'));
  
  let found = false;
  let matchCount = 0;
  let targetArticle = null;
  
  allArticles.forEach(article => {
    const titleEl = article.querySelector('h2, h3, h4, .card-title, [itemprop="name"], .card-body h2, .card-body h3');
    if (titleEl) {
      const articleTitle = titleEl.textContent.trim().toLowerCase();
      const searchName = equipmentName;
      const cleanArticleTitle = articleTitle.replace(/alquiler de | en cali/gi, '').trim();
      
      if (cleanArticleTitle === searchName || cleanArticleTitle.includes(searchName) || searchName.includes(cleanArticleTitle)) {
        if (!found) {
          targetArticle = article;
          matchCount++;
        } else {
          matchCount++;
        }
        found = true;
      }
    }
  });

  if (targetArticle && matchCount === 1) {
    targetArticle.style.display = 'block';
    targetArticle.classList.add('active');
    targetArticle.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if (targetArticle && matchCount > 1) {
    const exactMatch = Array.from(allArticles).find(article => {
      const titleEl = article.querySelector('h2, h3, h4, .card-title, [itemprop="name"], .card-body h2, .card-body h3');
      if (titleEl) {
        const articleTitle = titleEl.textContent.trim().toLowerCase();
        const cleanArticleTitle = articleTitle.replace(/alquiler de | en cali/gi, '').trim();
        return cleanArticleTitle === equipmentName;
      }
      return false;
    });
    
    if (exactMatch) {
      hideAllEquipmentDetails();
      exactMatch.style.display = 'block';
      exactMatch.classList.add('active');
      exactMatch.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else if (netflixRows) {
      netflixRows.style.display = 'block';
    }
  } else {
    if (netflixRows) netflixRows.style.display = 'block';
  }
}

function initEquipmentFilter() {
  hideAllEquipmentDetails();
}

// Exponer funciones globalmente
if (typeof window !== 'undefined') {
  window.handleCategoryClick = handleCategoryClick;
  window.showEquipmentDetail = showEquipmentDetail;
  window.showEquipmentDetailByTitle = showEquipmentDetailByTitle;
  window.showEquipmentDetailByIndex = showEquipmentDetailByIndex;
  window.hideAllEquipmentDetails = hideAllEquipmentDetails;
  window.initEquipmentFilter = initEquipmentFilter;
}

document.addEventListener('DOMContentLoaded', initEquipmentFilter);