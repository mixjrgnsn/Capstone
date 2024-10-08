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
