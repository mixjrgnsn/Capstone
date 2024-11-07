if (!localStorage.getItem('userData')) {
    // Redirect to login if there's no user data
    window.location.replace('../HTML/index.html');
} else {
    // Retrieve the stored user data
    const userData = JSON.parse(localStorage.getItem('userData'));
    
    // Assuming the userData object contains a 'name' field
    if (userData && userData.firstname && userData.lastname) {
        // Set the text content of the user link to the user's name
        document.getElementById('user').innerText = userData.firstname + " " + userData.lastname;
    }
}

var loadingSpinner = document.getElementById('loadingSpinner');

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
const sidebarLinks = document.querySelectorAll('.sidebar .link');

sidebarLinks.forEach(link => {
    link.addEventListener('click', function() {
        const checkbox = document.querySelector('.hamburger-menu input');
        checkbox.checked = false; // Uncheck the checkbox
        document.body.classList.remove('overlay-active'); // Remove overlay class
    });
});

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('logout-btn').addEventListener('click', function() {
        console.log("haha");
        document.getElementById('custom-alert').style.display = 'flex';
    });

    document.getElementById('confirm-logout').addEventListener('click', function() {
        loadingSpinner.style.display = 'block'; // Show the loading spinner
        // Clear user data from localStorage
        localStorage.removeItem('userData');
        
        // Simulate a delay for loading spinner (optional)
        setTimeout(() => {
            window.location.replace('../HTML/index.html');
            history.replaceState(null, '', '../HTML/index.html');
        }, 1000);
    });
    
    // Handle the cancel button
    document.getElementById('cancel-logout').addEventListener('click', function() {
        // Hide the custom alert
        document.getElementById('custom-alert').style.display = 'none';
    });
});