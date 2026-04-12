document.addEventListener("DOMContentLoaded", function() {
    // Select the header element
    const header = document.getElementById('header');
    const folder = document.getElementById('root-folder').getAttribute('value');

    // Define the content you want to add
    const headerContent = `
        <header class="header">
            <div class="header-brand">
                <button class="theme-button" onclick="toggleTheme()">
                    <img id="theme-icon" src="[FOLDER]/icons/moon.svg"/>
                </button>
                <div class="title">
                    <a href="[FOLDER]/index.html" title="Posts" style="text-decoration: none; color:var(--header-color)">
                        <span class="active">Federico Bruzzone's Space</span>
                    </a>
                </div>
            </div>

            <button class="header-toggle" aria-label="Open navigation menu">☰</button>

            <nav class="header-nav">
                <a href="[FOLDER]/index.html" title="Posts" style="text-decoration: none; color:var(--header-color)">Posts</a>
                <a href="[FOLDER]/cv.pdf" title="CV" style="text-decoration: none; color:var(--header-color)">CV</a>
                <a href="[FOLDER]/about.html" title="About" style="text-decoration: none; color:var(--header-color)">About</a>
            </nav>
        </header>
    `.replaceAll("[FOLDER]",folder);

    header.innerHTML = headerContent;

    const toggle = header.querySelector('.header-toggle');
    const nav = header.querySelector('.header-nav');
    if (toggle && nav) {
        toggle.addEventListener('click', () => {
            const isOpen = nav.classList.toggle('open');
            toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
        });

        nav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('open');
                toggle.setAttribute('aria-expanded', 'false');
            });
        });
    }
});
