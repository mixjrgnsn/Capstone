// Function to load user data from localStorage
function loadUserData() {
    const userData = JSON.parse(localStorage.getItem('userData'));

    // Check if user data exists
    if (userData) {
        // Populate the HTML elements with user data
        document.getElementById('id').textContent += userData.id;
        document.getElementById('fname').textContent += userData.firstname;
        document.getElementById('lname').textContent += userData.lastname;
        document.getElementById('address').textContent += userData.address;
    } else {
        // Handle case where no user data is found (e.g., redirect to login)
        document.body.innerHTML = '<h1>No user data found. Please log in.</h1>';
        // Optionally, you can redirect to the login page
        // window.location.replace('../HTML/login.html');
    }
}

// Call the function to load user data when the page loads
window.onload = loadUserData;
