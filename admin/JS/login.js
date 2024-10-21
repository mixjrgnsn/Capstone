var btn = document.getElementsByClassName('btn')[0];
var loadingSpinner = document.getElementById('loadingSpinner');
var currentAction = 'admin';

function leftClick() {
    btn.style.left = '0px';
    currentAction = 'admin';
}

function rightClick() {
    btn.style.left = '200px';
    currentAction = 'security';
}

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
            //alert(data);
            // Set login state and role in local storage
            localStorage.setItem('isLoggedIn', 'true');
            localStorage.setItem('role', currentAction);
            // Use history.replaceState to prevent back navigation
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

// Optional: Prevent navigating back to login page if already logged in
window.onload = function() {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        const role = localStorage.getItem('role');
        // Redirect to appropriate page based on the role
        if (role === 'admin') {
            window.location.href = '../HTML/dashboard.html';
        } else if (role === 'security') {
            window.location.href = '../HTML/dashboardsecurity.html';
        }
    }
};
