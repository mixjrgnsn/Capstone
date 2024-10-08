document.getElementById("signupLink").addEventListener("click", function (e) {
    e.preventDefault(); // Prevent the default link behavior
    // Replace the current history entry before redirecting to the signup page
    window.history.replaceState(null, '', window.location.href);
    window.location.href = '../HTML/signup.html'; // Redirect to the signup page
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

    fetch('http://localhost/loginregister/database/loginWeb.php', {  
        method: 'POST',
        body: new URLSearchParams(formData),
    })
    .then(response => response.text())  
    .then(result => {
        loadingSpinner.style.display = 'none';

        if (result.trim() === 'Login successful') {
            alert("Login Successful");
            window.history.replaceState(null, '', window.location.href); // Prevent back navigation
            window.location.replace('../HTML/home.html'); // Redirect to the home page on success
        } else {
            alert('Login Failed: ' + result);
        }
    })
    .catch(error => {
        loadingSpinner.style.display = 'none';
        console.error('Error:', error);  
        alert('An error occurred. Please try again.');
    });
});
