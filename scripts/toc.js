document.addEventListener("DOMContentLoaded", function () {
    const tocContainer = document.getElementById("toc");
    if (!tocContainer) return;

    const main = document.querySelector("main");
    if (!main) return;

    const headings = main.querySelectorAll("h2, h3");
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
    titleEl.textContent = "Table of Contents";
    nav.appendChild(titleEl);

    const ul = document.createElement("ul");
    nav.appendChild(ul);

    let currentH2Li = null;

    headings.forEach(function (heading) {
        const a = document.createElement("a");
        a.href = "#" + heading.id;
        a.textContent = heading.textContent.trim();

        const li = document.createElement("li");
        li.appendChild(a);

        if (heading.tagName === "H2") {
            ul.appendChild(li);
            currentH2Li = li;
        } else {
            if (!currentH2Li) {
                ul.appendChild(li);
            } else {
                let subUl = currentH2Li.querySelector("ul");
                if (!subUl) {
                    subUl = document.createElement("ul");
                    currentH2Li.appendChild(subUl);
                }
                subUl.appendChild(li);
            }
        }
    });

    tocContainer.appendChild(nav);
});
