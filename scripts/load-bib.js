document.addEventListener("DOMContentLoaded", function() {
    const bibtex = document.querySelector('.bibtex');
    if (!bibtex) {
        return;
    }
    const folder = document.getElementById('root-folder').getAttribute('value');

    const pageTitle = document.querySelector('h1') ? document.querySelector('h1').textContent.trim() : 'Untitled';
    const pageUrl = window.location.href;
    const pageYear = bibtex.getAttribute('year');
    const pageMonth = bibtex.getAttribute('month');
    const pageDate = new Date().toISOString().split('T')[0];

    const bibContent = `
@misc{${pageTitle.replace(/\s+/g, '_').toLowerCase()}_${pageYear},
  author = {Bruzzone, Federico},
  title = {${pageTitle}},
  url   = {${pageUrl}},
  note  = {Blog post, accessed: ${pageDate}},
  year  = {${pageYear}},
  month = {${pageMonth}},
}
    `;

    const pre = document.createElement('pre');
    const code = document.createElement('code');
    code.className = "language-bibtex";
    code.textContent = bibContent.trim();
    pre.appendChild(code);

    const p = document.createElement('p');
    p.innerHTML = `If you found this page useful, please consider citing it using the following BibTeX entry:`;

    const h3 = document.createElement('h3');
    h3.textContent = "Cite this page";

    bibtex.appendChild(h3);
    bibtex.appendChild(p);
    bibtex.appendChild(pre);
});
