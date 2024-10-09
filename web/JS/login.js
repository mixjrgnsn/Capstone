// Check if the user is already logged in
if (localStorage.getItem('userData')) {
    // If logged in, redirect to home page
    window.location.replace('../HTML/home.html');
}

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
    .then(response => response.json())  
    .then(result => {
        loadingSpinner.style.display = 'none';

        if (result.status === 'success') {
            // Store user data in localStorage or sessionStorage
            localStorage.setItem('userData', JSON.stringify(result.data));
            alert("Login Successful");
            window.history.replaceState(null, '', window.location.href); // Prevent back navigation
            window.location.replace('../HTML/home.html'); // Redirect to the home page on success
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

// Slideshow functionality
let slideIndex = 0;

const changeSlide = (n) => {
    const slides = document.querySelectorAll(".pics");
    slideIndex += n;

    if (slideIndex >= slides.length) {
        slideIndex = 0;
    } else if (slideIndex < 0) {
        slideIndex = slides.length - 1;
    }

    for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
    }

    slides[slideIndex].style.display = "block";
}

setInterval(() => changeSlide(1), 5000); // Automatic slide transition every 5 seconds

document.querySelector('.hamburger-menu input').addEventListener('change', function() {
    document.body.classList.toggle('overlay-active', this.checked);
});

const sidebarLinks = document.querySelectorAll('.sidebar .link');

sidebarLinks.forEach(link => {
    link.addEventListener('click', function() {
        const checkbox = document.querySelector('.hamburger-menu input');
        checkbox.checked = false; // Uncheck the checkbox
        document.body.classList.remove('overlay-active'); // Remove overlay class
    });
});
