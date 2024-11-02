document.addEventListener('DOMContentLoaded', () => {
    // Check if user is logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = '../HTML/index.html';
        return;
    }

    const btnLogout = document.querySelector('.btn-logout');
    const modal = document.getElementById('logoutModal');
    const confirmLogout = document.getElementById('confirmLogout');
    const cancelLogout = document.getElementById('cancelLogout');
    const loadingSpinner = document.getElementById('loadingSpinner');

    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            modal.style.display = "block"; // Show the modal
        });
    }

    cancelLogout.onclick = () => {
        modal.style.display = "none"; // Close the modal
    }

    confirmLogout.onclick = () => {
        modal.style.display = "none";
        // Show the loading spinner
        loadingSpinner.style.display = "block";
    
        // Simulate a delay for 3 seconds before logging out
        setTimeout(() => {
            // Log out the user
            localStorage.setItem('isLoggedIn', 'false');
            localStorage.removeItem('role');
    
            // Replace the current history state with the logout page
            history.replaceState(null, '', '../HTML/index.html');
    
            // Redirect to index.html
            window.location.href = '../HTML/index.html';
        }, 2000); // 3000 milliseconds = 3 seconds
    };
    
});

// Redirect if user refreshes the page after logging out
window.addEventListener('pageshow', (event) => {
    if (event.persisted) {
        // This event is fired when the page is loaded from cache
        if (localStorage.getItem('isLoggedIn') !== 'true') {
            window.location.href = '../HTML/index.html';
        }
    }
});
