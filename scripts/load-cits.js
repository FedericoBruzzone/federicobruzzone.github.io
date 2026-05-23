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
    const bibliography_header = document.createElement('h2');
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
    "MacCall17" : {
        "title"   : "Swift ownership manifesto",
        "author"  : "J. McCall",
        "journal" : "https://github.com/apple/swift/blob/main/docs/OwnershipManifesto.md",
        "year"    : "2017"
    },
    "Swift" : {
        "title"   : "The Swift Programming Language",
        "author"  : "Apple",
        "publisher" : "Apple",
        "journal" : "https://docs.swift.org/swift-book/index.html",
        "year"    : "2022"
    },
    "Hylo" : {
        "title"   : "Hylo Programming Language",
        "author"  : "Hylo",
        "publisher" : "Hylo",
        "journal" : "https://hylo-lang.org/",
        "year"    : "2022"
    },
    "Naden12" : {
        "title"   : "A type system for borrowing permissions",
        "author"  : "Naden, Karl and Bocchino, Robert and Aldrich, Jonathan and Bierhoff, Kevin",
        "journal" : "ACM SIGPLAN Notices",
        "volume"    : "47",
        "number"    : "1",
        "pages"     : "557--570",
        "year"      : "2012",
        "publisher" : "ACM New York, NY, USA"
    },
    "OHearn01" : {
        "title"   : "Local reasoning about programs that alter data structures",
        "author"  : "O'Hearn, Peter and Reynolds, John and Yang, Hongseok",
        "booktitle" : "International Workshop on Computer Science Logic",
        "pages"   : "1--19",
        "year"    : "2001",
        "organization"  : "Springer"
    },
    "Carr94" : {
        "title"   : "Scalar replacement in the presence of conditional control flow",
        "author"  : "Carr, Steve and Kennedy, Ken",
        "journal" : "Software: Practice and Experience",
        "volume"    : "24",
        "number"    : "1",
        "pages"     : "51--77",
        "year"      : "1994",
        "publisher" : "Wiley Online Library"
    },
    "Girard87" : {
        "title"   : "Linear logic",
        "author"  : "Girard, Jean-Yves",
        "journal" : "Theoretical computer science",
        "volume"    : "50",
        "number"    : "1",
        "pages"     : "1--101",
        "year"      : "1987",
        "publisher" : "Elsevier"
    },
    "Matsakis14" : {
        "title"   : "The Rust Programming Language",
        "author"  : "Matsakis, Nicholas D and Klock, Felix S",
        "booktitle" : "ACM SIGAda Annual Conference on High Integrity Language Technology",
        "pages"   : "103--104",
        "year"    : "2014",
        "publisher" : "ACM New York, NY, USA"
    },
    "DeBruijn72" : {
        "title"   : "Lambda calculus notation with nameless dummies, a tool for automatic formula manipulation, with application to the Church-Rosser theorem",
        "author"  : "De Bruijn, Nicolaas Govert",
        "booktitle" : "Indagationes mathematicae (proceedings)",
        "volume"    : "75",
        "number"    : "5",
        "pages"     : "381--392",
        "year"      : "1972",
        "publisher" : "Elsevier"
    },
    "Bruzzone26d-preprint" : {
        "title"   : "Meta-Monomorphizing Specializations",
        "author"  : "Federico Bruzzone and Walter Cazzola",
        "year"    : "2026",
        "eprint"  : "2602.12973",
        "archivePrefix" : "arXiv",
        "primaryClass" : "cs.PL",
        "journal"     : "https://arxiv.org/abs/2602.12973"
    },
    "RustSpecialization" : {
        "title"   : "Specialization",
        "author"  : "Matsakis, Nicholas D.",
        "journal"     : "https://rust-lang.github.io/rfcs/1210-impl-specialization.html"
    },
    "ShippingSpecialization" : {
        "title"   : "Shipping Specialization: A Story of Soundness",
        "author"  : "Aaron Turon",
        "journal"     : "https://aturon.github.io/blog/2017/07/08/lifetime-dispatch/"
    },
    "Marshall22" : {
        "title"   : "Linearity and uniqueness: An entente cordiale",
        "author"  : "Marshall, Danielle and Vollmer, Michael and Orchard, Dominic",
        "booktitle"     : "European Symposium on Programming",
        "pages"   : "346--375",
        "year"    : "2022", 
        "organization"  : "Springer"
    },
    "Marshall24" : {
        "title"   : "Functional ownership through fractional uniqueness",
        "author"  : "Marshall, Danielle and Orchard, Dominic",
        "journal"     : "Proceedings of the ACM on Programming Languages",
        "volume"    : "8",
        "number"    : "OOPSLA1",
        "pages"     : "1040--1070",
        "year"      : "2024",
        "publisher" : "ACM New York, NY, USA"
    },
    "Racordon25" : {
        "title"   : "Who Owns the Contents of a Doubly-Linked List?",
        "author"  : "Racordon, Dimi",
        "booktitle"     : "Companion Proceedings of the 9th International Conference on the Art, Science, and Engineering of Programming (Programming 2025)",
        "pages"   : "25--1",
        "year"    : "2025",
    },
    "Orchard19" : {
        "title"   : "Quantitative program reasoning with graded modal types",
        "author"  : "Orchard, Dominic and Liepelt, Vilem-Benjamin and Eades III, Harley",
        "journal" : "Proceedings of the ACM on Programming Languages",
        "volume"    : "3",
        "number"    : "ICFP",
        "pages"     : "110--1",
        "year"      : "2019",
        "publisher" : "ACM New York, NY, USA"
    },
    "Heule11" : {
        "title"   : "Fractional permissions without the fractions",
        "author"  : "Heule, Stefan and Leino, K. Rustan M. and M\"{u}ller, Peter and Summers, Alexander J.",
        "booktitle"     : "Proceedings of the 13th Workshop on Formal Techniques for Java-Like Programs",
        "pages"   : "1--6",
        "year"    : "2011",
        "publisher" : "Association for Computing Machinery",
        "location"  : "Lancaster, United Kingdom",
        "series"  : "FTfJP '11"
    },
    "Boyland03" : {
        "title"   : "Checking interference with fractional permissions",
        "author"  : "Boyland, John",
        "booktitle"     : "Proceedings of the 10th International Conference on Static Analysis",
        "pages"   : "55–72",
        "year"    : "2003",
        "publisher" : "Springer-Verlag",
        "address"  : "Berlin, Heidelberg",
        "series"  : "SAS'03"
    },
    "Parkinson05" : {
        "title"   : "Separation logic and abstraction",
        "author"  : "Parkinson, Matthew and Bierman, Gavin",
        "booktitle"     : "Proceedings of the 32nd ACM SIGPLAN-SIGACT Symposium on Principles of Programming Languages",
        "pages"   : "247–258",
        "year"    : "2005",
        "publisher" : "Association for Computing Machinery",
        "address"  : "New York, NY, USA",
        "series"  : "POPL '05"
    },
    "Wagner25" : {
        "title"   : "From Linearity to Borrowing",
        "author"  : "Wagner, Andrew and Gierczak, Olek and Marshall, Brianna and Li, John M. and Ahmed, Amal",
        "journal" : "Proceedings of the ACM on Programming Languages",
        "volume"    : "9",
        "number"    : "OOPSLA2",
        "pages"     : "415--1",
        "year"      : "2025",
        "publisher" : "Association for Computing Machinery",
        "address"   : "New York, NY, USA"
    },
    "Bernardy18" : {
        "title"   : "Linear Haskell: practical linearity in a higher-order polymorphic language",
        "author"  : "Bernardy, Jean-Philippe and Boespflug, Mathieu and Newton, Ryan R. and Peyton Jones, Simon and Spiwack, Arnaud",
        "journal" : "Proceedings of the ACM on Programming Languages",
        "volume"    : "2",
        "number"    : "POPL",
        "pages"     : "5:1--5:29",
        "year"      : "2018",
        "publisher" : "ACM New York, NY, USA"
    },
    "Smith00" : {
        "title"   : "Alias types",
        "author"  : "Smith, Frederick and Walker, David and Morrisett, J. Gregory",
        "journal" : "9th European Symposium on Programming (ESOP), LNCS 1782",
        "pages"   : "366--381",
        "year"    : "2000",
        "publisher" : "Springer"
    },
    "Gifford86" : {
        "title"   : "Integrating functional and imperative programming",
        "author"  : "Gifford, David K. and Lucassen, John M.",
        "journal" : "Proceedings of the 1986 ACM Conference on LISP and Functional Programming (LFP)",
        "pages"   : "28--38",
        "year"    : "1986",
        "publisher" : "ACM"
    },
    "Lucassen88" : {
        "title"   : "Polymorphic effect systems",
        "author"  : "Lucassen, John M. and Gifford, David K.",
        "journal" : "Proceedings of the 15th ACM SIGPLAN-SIGACT Symposium on Principles of Programming Languages (POPL)",
        "pages"   : "47--57",
        "year"    : "1988",
        "publisher" : "ACM"
    },
    "Gordon20" : {
        "title"   : "Designing with static capabilities and effects: use, mention, and invariants",
        "author"  : "Gordon, Colin S.",
        "journal" : "34th European Conference on Object-Oriented Programming (ECOOP 2020), LIPIcs vol. 166",
        "year"    : "2020",
        "publisher" : "Schloss Dagstuhl"
    },
    "Jones94" : {
        "title"   : "A theory of qualified types",
        "author"  : "Jones, Mark P.",
        "journal" : "Science of Computer Programming",
        "volume"    : "22",
        "number"    : "3",
        "pages"     : "231--256",
        "year"      : "1994",
        "publisher" : "Elsevier"
    },
    "Foster99" : {
        "title"   : "A theory of type qualifiers",
        "author"  : "Foster, Jeffrey S. and F\"{a}hndrich, Manuel and Aiken, Alexander",
        "journal" : "Proceedings of the ACM SIGPLAN 1999 Conference on Programming Language Design and Implementation (PLDI)",
        "pages"   : "192--203",
        "year"    : "1999",
        "publisher" : "ACM"
    },
    "Spiwack22" : {
        "title"   : "Linearly qualified types: generic inference for capabilities and uniqueness",
        "author"  : "Spiwack, Arnaud and Kiss, Csongor and Bernardy, Jean-Philippe and Wu, Nicolas and Eisenberg, Richard A.",
        "journal" : "Proceedings of the ACM on Programming Languages",
        "volume"    : "6",
        "number"    : "ICFP",
        "pages"     : "95:1--95:31",
        "year"      : "2022",
        "publisher" : "ACM New York, NY, USA"
    },
    "Gordon12" : {
        "title"   : "Uniqueness and reference immutability for safe parallelism",
        "author"  : "Gordon, Colin S. and Parkinson, Matthew J. and Parsons, Jared and Bromfield, Aleks and Duffy, Joe",
        "journal" : "Proceedings of the ACM International Conference on Object Oriented Programming Systems Languages and Applications (OOPSLA 2012)",
        "pages"   : "129--145",
        "year"    : "2012",
        "publisher" : "ACM"
    },
    "Clebsch15" : {
        "title"   : "Deny capabilities for safe, fast actors",
        "author"  : "Clebsch, Sylvan and Drossopoulou, Sophia and Blessing, Sebastian and McNeil, Andy",
        "journal" : "Proceedings of the 5th International Workshop on Programming Based on Actors, Agents, and Decentralized Control (AGERE!)",
        "pages"   : "1--12",
        "year"    : "2015",
        "publisher" : "ACM"
    },
    "Lampson74" : {
        "title"   : "Protection",
        "author"  : "Lampson, Butler W.",
        "journal" : "ACM SIGOPS Operating Systems Review",
        "volume"    : "8",
        "number"    : "1",
        "pages"     : "18--24",
        "year"      : "1974",
        "publisher" : "ACM"
    },
    "Levy84" : {
        "title"   : "Capability-Based Computer Systems",
        "author"  : "Levy, Henry M.",
        "year"    : "1984",
        "publisher" : "Digital Press"
    },
    "Miller06" : {
        "title"   : "Robust composition: towards a unified approach to access control and concurrency control",
        "author"  : "Miller, Mark S.",
        "journal" : "PhD thesis, Johns Hopkins University",
        "year"    : "2006"
    },
    "Strom86" : {
        "title"   : "Typestate: a programming language concept for enhancing software reliability",
        "author"  : "Strom, Robert E. and Yemini, Shaula",
        "journal" : "IEEE Transactions on Software Engineering",
        "volume"    : "12",
        "number"    : "1",
        "pages"     : "157--171",
        "year"      : "1986",
        "publisher" : "IEEE"
    },
    "Haller10" : {
        "title"   : "Capabilities for uniqueness and borrowing",
        "author"  : "Haller, Philipp and Odersky, Martin",
        "journal" : "24th European Conference on Object-Oriented Programming (ECOOP 2010), LNCS 6183",
        "pages"   : "354--378",
        "year"    : "2010",
        "publisher" : "Springer"
    },
    "Bao21" : {
        "title"   : "Reachability types: tracking aliasing and separation in higher-order functional programs",
        "author"  : "Bao, Yuyan and Wei, Guannan and Bra\\v{c}evac, Oliver and Jiang, Yuxuan and He, Qiyang and Rompf, Tiark",
        "journal" : "Proceedings of the ACM on Programming Languages",
        "volume"    : "5",
        "number"    : "OOPSLA",
        "pages"     : "135:1--135:32",
        "year"      : "2021",
        "publisher" : "ACM New York, NY, USA"
    },
    "BoruchGruszecki21" : {
        "title"   : "Tracking captured variables in types",
        "author"  : "Boruch-Gruszecki, Aleksander and Brachth\"{a}user, Jonathan Immanuel and Lee, Edward and Lhot\\'{a}k, Ond\\v{r}ej and Odersky, Martin",
        "journal" : "https://arxiv.org/abs/2105.11896",
        "year"    : "2021"
    },
    "BoruchGruszecki23" : {
        "title"   : "Capturing types",
        "author"  : "Boruch-Gruszecki, Aleksander and Odersky, Martin and Lee, Edward and Lhot\\'{a}k, Ond\\v{r}ej and Brachth\"{a}user, Jonathan Immanuel",
        "journal" : "ACM Transactions on Programming Languages and Systems",
        "volume"    : "45",
        "number"    : "4",
        "year"      : "2023",
        "publisher" : "ACM New York, NY, USA"
    },
    "Wei24" : {
        "title"   : "Polymorphic reachability types: tracking freshness, aliasing, and separation in higher-order generic programs",
        "author"  : "Wei, Guannan and Bra\\v{c}evac, Oliver and Jia, Songlin and Bao, Yuyan and Rompf, Tiark",
        "journal" : "Proceedings of the ACM on Programming Languages",
        "volume"    : "8",
        "number"    : "POPL",
        "pages"     : "393--424",
        "year"      : "2024",
        "publisher" : "ACM New York, NY, USA"
    },
    "Milano22" : {
        "title"   : "A flexible type system for fearless concurrency",
        "author"  : "Milano, Mae and Turcotti, Joshua and Myers, Andrew C.",
        "journal" : "Proceedings of the 43rd ACM SIGPLAN International Conference on Programming Language Design and Implementation (PLDI 2022)",
        "pages"   : "458--473",
        "year"    : "2022",
        "publisher" : "ACM"
    },
    "Xu24" : {
        "title"   : "Degrees of separation: a flexible type system for safe concurrency",
        "author"  : "Xu, Yichen and Boruch-Gruszecki, Aleksander and Odersky, Martin",
        "journal" : "Proceedings of the ACM on Programming Languages",
        "volume"    : "8",
        "number"    : "OOPSLA1",
        "year"      : "2024",
        "publisher" : "ACM New York, NY, USA"
    },
    "Reynolds78" : {
        "title"   : "Syntactic control of interference",
        "author"  : "Reynolds, John C.",
        "journal" : "Conference Record of the 5th Annual ACM SIGPLAN-SIGACT Symposium on Principles of Programming Languages (POPL)",
        "pages"   : "39--46",
        "year"    : "1978",
        "publisher" : "ACM"
    },
    "OHearn99" : {
        "title"   : "Syntactic control of interference revisited",
        "author"  : "O'Hearn, Peter W. and Power, John and Takeyama, Makoto and Tennent, Robert D.",
        "journal" : "Mathematical Foundations of Programming Semantics (MFPS XV), Electronic Notes in Theoretical Computer Science",
        "volume"    : "20",
        "year"    : "1999",
        "publisher" : "Elsevier"
    },
    "Barendsen96" : {
        "title"   : "Uniqueness typing for functional languages with graph rewriting semantics",
        "author"  : "Barendsen, Erik and Smetsers, Sjaak",
        "journal" : "Mathematical Structures in Computer Science",
        "volume"    : "6",
        "number"    : "6",
        "pages"     : "579--612",
        "year"      : "1996",
        "publisher" : "Cambridge University Press"
    },
    "Boyland10" : {
        "title"   : "Semantics of fractional permissions with nesting",
        "author"  : "Boyland, John Tang",
        "journal" : "ACM Transactions on Programming Languages and Systems",
        "volume"    : "32",
        "number"    : "6",
        "pages"     : "22:1--22:33",
        "year"      : "2010",
        "publisher" : "ACM New York, NY, USA"
    }
};