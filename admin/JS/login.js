var btn = document.getElementsByClassName('btn')[0];
var loadingSpinner = document.getElementById('loadingSpinner');
var currentAction = 'admin';

// Toggle button functionality for admin and security
function leftClick() {
    btn.style.left = '0px';
    currentAction = 'admin';
}

function rightClick() {
    btn.style.left = '200px';
    currentAction = 'security';
}

// Handle form submission
function handleFormSubmit(event) {
    event.preventDefault();

    loadingSpinner.style.display = 'block';

    let username = document.getElementById("username").value.trim();
    let password = document.getElementById("password").value.trim();

    if (username === "" || password === "") {
        alert("All fields are required");
        loadingSpinner.style.display = 'none';
        return;
    }

    let formData = new FormData();
    formData.append("username", username);
    formData.append("password", password);

    let url;
    let redirectUrl;
    if (currentAction === 'admin') {
        url = 'https://franciscohomes3.online/loginregister/database/adminlogin.php';
        redirectUrl = '../HTML/dashboard.html';
    } else {
        url = 'https://franciscohomes3.online/loginregister/database/securitylogin.php';
        redirectUrl = '../HTML/dashboardsecurity.html';
    }

    fetch(url, {
        method: 'POST',
        body: formData
    })
    .then(response => response.text())
    .then(data => {
        console.log("Server Response:", data);
        if (data.trim() === "Login Success") {
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('role', currentAction);
            history.replaceState(null, null, redirectUrl);
            window.location.href = redirectUrl;
        } else {
            alert(data);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    })
    .finally(() => {
        loadingSpinner.style.display = 'none';
    });
}

// Event listeners for toggle buttons
btn.addEventListener('click', function(event) {
    if (event.which === 1) {
        leftClick();
    } else if (event.which === 3) {
        rightClick();
    }
});

document.getElementById("loginForm").addEventListener("submit", handleFormSubmit);

// Disable right-click context menu
document.addEventListener('contextmenu', function(event) {
    event.preventDefault();
});

// Prevent navigating back to login page if already logged in
window.onload = function() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const role = localStorage.getItem('role');
        if (role === 'admin') {
            history.replaceState(null, null, '../HTML/dashboard.html');
            window.location.href = '../HTML/dashboard.html';
        } else if (role === 'security') {
            history.replaceState(null, null, '../HTML/dashboardsecurity.html');
            window.location.href = '../HTML/dashboardsecurity.html';
        }
    }
};

// Toggle password visibility
const togglePassword = document.getElementById("togglePassword");
togglePassword.style.display = "none"; // Hide the icon initially

togglePassword.addEventListener("click", function () {
    const passwordField = document.getElementById("password");

    // Just toggle the input type without changing the icon
    passwordField.type = passwordField.type === "password" ? "text" : "password";
});

// Show icon when typing
const passwordField = document.getElementById("password");

passwordField.addEventListener("focus", function() {
    // Show icon when focusing if the field is not empty
    if (this.value.length > 0) {
        togglePassword.style.display = "block";
    }
});

passwordField.addEventListener("blur", function() {
    // Hide if empty when losing focus
    if (this.value === "") {
        togglePassword.style.display = "none"; // Hide if empty
    } else {
        togglePassword.style.display = "block"; // Keep it visible if there's text
    }
});

passwordField.addEventListener("input", function() {
    // Show icon when typing
    if (this.value.length > 0) {
        togglePassword.style.display = "block"; // Show icon when typing
    } else {
        togglePassword.style.display = "none"; // Hide if empty
    }
});