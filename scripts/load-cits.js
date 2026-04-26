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
    "Walker05" : {
        "title"   : "Substructural type systems",
        "author"  : "Walker, David",
        "journal" : "Advanced topics in types and programming languages",
        "pages"   : "3--44",
        "year"    : "2005",
        "publisher" : "The MIT Press Cambridge"
    },
    "Clarke98" : {
        "title"   : "Ownership types for flexible alias protection",
        "author"  : "Clarke, David G and Potter, John M and Noble, James",
        "journal" : "Proceedings of the 13th ACM SIGPLAN conference on Object-oriented programming, systems, languages, and applications",
        "pages"   : "48--64",
        "year"    : "1998"
    },
    "Mojo26" : {
        "title"   : "The Mojo programming language",
        "author"  : "Mojo",
        "publisher" : "Modular",
        "journal" : "https://www.modular.com/open-source/mojo",
        "year"    : "2026"
    },
    "Ding25" : {
        "title"   : "Tilus: A Tile-Level GPGPU Programming Language for Low-Precision Computation",
        "author"  : "Ding, Yaoyao and Hou, Bohan and Zhang, Xiao and Lin, Allan and Chen, Tianqi and Hao, Cody Yu and Wang, Yida and Pekhimenko, Gennady",
        "journal" : "https://arxiv.org/abs/2504.12984",
        "year"    : "2025"
    },
    "Tillet19" : {
        "title"   : "Triton: An Intermediate Language and Compiler for Tiled Neural Network Computations",
        "author"  : "Tillet, Philippe and Kung, Hsiang-Tsung and Cox, David",
        "journal" : "https://dl.acm.org/doi/10.1145/3341301.3359677",
        "year"    : "2019"
    },
    "Tofte97" : {
        "title"   : "Region-Based Memory Management",
        "author"  : "Tofte, Mads and Talpin, Jean-Pierre",
        "journal" : "Information and Computation",
        "volume"    : "132",
        "number"    : "2",
        "pages"     : "109-176",
        "year"      : "1997",
        "publisher" : "North-Holland, Amsterdam"
    },
    "Barrett93" : {
        "title"   : "Using lifetime predictors to improve memory allocation performance",
        "author"  : "Barrett, David A and Zorn, Benjamin G",
        "booktitle" : "Proceedings of the ACM SIGPLAN 1993 conference on Programming Language Design and Implementation",
        "pages"   : "187--196",
        "year"    : "1993"
    },
    "Aiken95" : {
        "title"   : "A better static memory manager",
        "author"  : "Aiken, Alexander and F{\"a}hndrich, Manuel and Levien, Raph",
        "booktitle" : "Proceedings of the ACM SIGPLAN 1995 conference on Programming language design and implementation",
        "pages"   : "174--185",
        "year"    : "1995"
    },
    "Talpin92" : {
        "title"   : "Polymorphic type, region and effect inference",
        "author"  : "Talpin, Jean-Pierre and Jouvelot, Pierre",
        "journal" : "Journal of functional programming",
        "volume"    : "2",
        "number"    : "3",
        "pages"     : "245--271",
        "year"      : "1992",
        "publisher" : "Cambridge University Press"
    },
    "Gluon26" : {
        "title"   : "Gluon: a GPU programming language based on the same compiler stack as Triton",
        "author"  : "Gluon",
        "publisher" : "GitHub",
        "journal" : "hhttps://github.com/triton-lang/triton/blob/main/python/tutorials/gluon/01-intro.py",
        "year"    : "2026"
    },
    "Racordon22" : {
        "title"   : "Implementation Strategies for Mutable Value Semantics",
        "author"  : "Racordon, Dimitri and Shabalin, Denys and Zheng, Daniel and Abrahams, Dave and Saeta, Brennan",
        "journal" : "Journal of Object Technology",
        "volume"    : "21",
        "number"    : "2",
        "pages"     : "2--1",
        "year"      : "2022"
    },
    "Ragan17" : {
        "title"   : "Halide: Decoupling algorithms from schedules for high-performance image processing",
        "author"  : "Ragan-Kelley, Jonathan and Adams, Andrew and Sharlet, Dillon and Barnes, Connelly and Paris, Sylvain and Levoy, Marc and Amarasinghe, Saman and Durand, Fr{\'e}do",
        "journal" : "Communications of the ACM",
        "volume"    : "61",
        "number"    : "1",
        "pages"     : "106--115",
        "year"      : "2017",
        "publisher" : "ACM New York, NY, USA"
    },
    "TileIR26" : {
        "title"   : "CUDA Tile IR is an MLIR-based intermediate representation and compiler infrastructure for CUDA kernel optimization",
        "author"  : "NVIDIA",
        "publisher" : "GitHub",
        "journal" : "https://github.com/NVIDIA/cuda-tile",
        "year"    : "2026"
    },
};