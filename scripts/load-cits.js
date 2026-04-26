function bibtexToIeee(bibtex) {
    const { author, title, journal, year, volume, number, pages, publisher } = bibtex;
    let citationParts = [];
    if (author) citationParts.push(`${author}`);
    if (title) citationParts.push(`"${title}"`);
    if (journal) citationParts.push(`${journal}`);
    if (volume) citationParts.push(`vol. ${volume}`);
    if (number) citationParts.push(`no. ${number}`);
    if (pages) citationParts.push(`pp. ${pages}`);
    if (year) citationParts.push(`${year}`);
    let citation = citationParts.join(', ');
    if (publisher) citation += ` ${publisher}`;

    return citation + "." ;
}

function replaceCitations() {
    const citeElements = document.querySelectorAll('.cite');
    const bibliographyElement = document.querySelector('.bibliography');
    const references = [];

    citeElements.forEach((citeElement, index) => {
        const bibtex_id = citeElement.getAttribute('value');
        references.push(bibtexToIeee(bibliography[bibtex_id]));

        const citeSpan = document.createElement('span');
        citeSpan.className = 'cite';
        citeSpan.textContent = `[${index + 1}]`;
        citeElement.parentNode.replaceChild(citeSpan, citeElement);
    });

    if (!bibliographyElement) {
        return;
    }

    const listElement = document.createElement('ol');
    const bibliography_header = document.createElement('h3');
    bibliography_header.textContent = "Bibliography";

    listElement.classList.add("bibliography");
    references.forEach(ref => {
        const listItem = document.createElement('li');
        listItem.textContent = ref;
        listElement.appendChild(listItem);
    });

    bibliographyElement.innerHTML = '';
    bibliographyElement.appendChild(bibliography_header);
    bibliographyElement.appendChild(listElement);
}

document.addEventListener('DOMContentLoaded', () => {
    replaceCitations();
});

const bibliography = {
    "Wadler90" : {
        "title"   : "Linear types can change the world!",
        "author"  : "Wadler, Philip",
        "booktitle" : "Programming concepts and methods",
        "volume"    : "3",
        "number"    : "4",
        "pages"     : "5",
        "year"      : "1990",
        "publisher" : "North-Holland, Amsterdam"
    },
};
