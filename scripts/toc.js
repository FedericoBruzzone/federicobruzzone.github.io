document.addEventListener("DOMContentLoaded", function () {
    const tocContainer = document.getElementById("toc");
    if (!tocContainer) return;

    const main = document.querySelector("main");
    if (!main) return;

    var startLevel = tocContainer.getAttribute("data-toc-start") || "h1";
    var levels = ["h1", "h2", "h3", "h4"];
    var startIdx = levels.indexOf(startLevel);
    if (startIdx === -1) startIdx = 0;
    var selector = levels.slice(startIdx).join(", ");

    const headings = main.querySelectorAll(selector);
    if (headings.length === 0) return;

    function slugify(text) {
        return text
            .toLowerCase()
            .trim()
            .replace(/[^\w\s-]/g, "")
            .replace(/[\s_]+/g, "-")
            .replace(/^-+|-+$/g, "");
    }

    headings.forEach(function (heading) {
        if (!heading.id) {
            let base = slugify(heading.textContent);
            let id = base;
            let n = 1;
            while (document.getElementById(id) && document.getElementById(id) !== heading) {
                id = base + "-" + n++;
            }
            heading.id = id;
        }
    });

    const nav = document.createElement("nav");
    nav.className = "toc";

    const titleEl = document.createElement("strong");
    titleEl.className = "toc-title";
    titleEl.textContent = "Contents";
    nav.appendChild(titleEl);

    const ul = document.createElement("ul");
    nav.appendChild(ul);

    let currentH1Li = null;
    let currentH2Li = null;

    function appendChildLi(parentLi, li) {
        let subUl = parentLi.querySelector("ul");
        if (!subUl) {
            subUl = document.createElement("ul");
            parentLi.appendChild(subUl);
        }
        subUl.appendChild(li);
    }

    headings.forEach(function (heading) {
        const a = document.createElement("a");
        a.href = "#" + heading.id;
        a.textContent = heading.textContent.trim();

        const li = document.createElement("li");
        li.appendChild(a);

        if (heading.tagName === "H1") {
            ul.appendChild(li);
            currentH1Li = li;
            currentH2Li = null;
        } else if (heading.tagName === "H2") {
            if (!currentH1Li) {
                ul.appendChild(li);
            } else {
                appendChildLi(currentH1Li, li);
            }
            currentH2Li = li;
        } else {
            const parentLi = currentH2Li || currentH1Li;
            if (!parentLi) {
                ul.appendChild(li);
            } else {
                appendChildLi(parentLi, li);
            }
        }
    });

    tocContainer.appendChild(nav);
});
