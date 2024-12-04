document.addEventListener('DOMContentLoaded', () => {
    const darkModeToggle = document.querySelector('.dark-mode-toggle');
    const slider = document.querySelector('.slider');
    const body = document.body;

    // Dark mode toggle
    darkModeToggle.addEventListener('click', () => {
        body.classList.toggle('dark-mode');
        slider.classList.toggle('active');
    });

    // Voice search icon
    const voiceIcon = document.getElementById('voiceIcon');
    voiceIcon.addEventListener('click', () => {
        // Voice search functionality (placeholder)
        alert('Voice search not implemented yet');
    });

    // Cookie banner
    const cookieBanner = document.getElementById('cookieBanner');
    const acceptCookiesBtn = document.getElementById('acceptCookies');

    acceptCookiesBtn.addEventListener('click', () => {
        cookieBanner.style.display = 'none';
        // You might want to set a cookie here to remember user's preference
    });

    // No result message handling
    const searchBox = document.querySelector('.search-box');
    const noResultMessage = document.getElementById('noResultMessage');

    searchBox.addEventListener('input', (event) => {
        const searchTerm = event.target.value;
        
        // This is a placeholder. In a real app, you'd check against a product list
        if (searchTerm && searchTerm.length > 0) {
            // Simulating no results
            noResultMessage.style.display = 'block';
        } else {
            noResultMessage.style.display = 'none';
        }
    });
});
