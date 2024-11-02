// Check if the user is already logged in
if (localStorage.getItem('userData')) {
    // If logged in, redirect to home page
    window.location.replace('../HTML/home.html');
}

document.getElementById("signupLink").addEventListener("click", function (e) {
    e.preventDefault(); // Prevent the default link behavior
    // Replace the current history entry before redirecting to the signup page
    window.history.replaceState(null, '', window.location.href);
    window.location.href = '../HTML/signup_email.html'; // Redirect to the signup page
});

document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    let email = document.getElementById('email').value.trim();
    let password = document.getElementById('password').value.trim();
    let loadingSpinner = document.getElementById('loadingSpinner');

    if (email === '' || password === '') {
        alert('Please enter both email and password.');
        return;
    }

    let formData = new FormData();
    formData.append('email', email);
    formData.append('password', password);

    // Show the loading spinner
    loadingSpinner.style.display = 'block';

    fetch('https://franciscohomes3.online/loginregister/database/loginWeb.php', {
        method: 'POST',
        body: new URLSearchParams(formData),
    })
    .then(response => response.json())  
    .then(result => {
        loadingSpinner.style.display = 'none';

        if (result.status === 'success') {
            loadingSpinner.style.display = 'block';
            // Store user data in localStorage or sessionStorage
            localStorage.setItem('userData', JSON.stringify(result.data));
            //alert("Login Successful");
            
            setTimeout(() => {
                //alert("Logout Successful");
                // Redirect to the login page and replace the history state
                window.location.replace('../HTML/home.html');
                window.history.replaceState(null, '', window.location.href); // Prevent back navigation
            }, 1000); // Adjust the time as needed
        } else {
            alert('Login Failed: ' + result.message);
        }
    })
    .catch(error => {
        loadingSpinner.style.display = 'none';
        console.error('Error:', error);  
        alert('An error occurred. Please try again.');
    });
});