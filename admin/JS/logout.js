// Logout functionality
document.addEventListener('DOMContentLoaded', () => {
    // Check if the user is not logged in
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        // Redirect to the login page
        window.location.href = '../HTML/index.html'; // Adjust the URL as necessary
        return; // Exit the function to prevent further execution
    }

    const btnLogout = document.querySelector('.btn-logout'); // Select the button by class

    if (btnLogout) { // Ensure the button exists before adding the event listener
        btnLogout.addEventListener('click', () => {
            if (confirm("Are you sure you want to log out?")) {
                // Set the login state to false
                localStorage.setItem('isLoggedIn', 'false');

                // Use replaceState to prevent back navigation
                history.replaceState(null, '', '../HTML/index.html'); // Replace the current history state

                // Redirect to the login page or home page
                window.location.href = '../HTML/index.html'; // Adjust the URL as necessary
            }
        });
    }
});
