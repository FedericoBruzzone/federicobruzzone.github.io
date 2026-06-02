if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
}

function toggleTheme() {
    const folder = document.getElementById('root-folder').getAttribute('value');
    const isDark = document.body.classList.toggle('dark-mode');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
    const icon = document.getElementById('theme-icon');
    if (icon) {
        icon.src = folder + '/icons/' + (isDark ? 'sun.svg' : 'moon.svg');
    }
}
