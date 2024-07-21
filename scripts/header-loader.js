document.addEventListener('DOMContentLoaded', () => {
    fetch('/includes/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading footer:', error);
        });
});
