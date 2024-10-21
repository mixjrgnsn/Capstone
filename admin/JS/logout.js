document.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isLoggedIn') !== 'true') {
        window.location.href = '../HTML/index.html';
        return;
    }

    const btnLogout = document.querySelector('.btn-logout');

    if (btnLogout) {
        btnLogout.addEventListener('click', () => {
            if (confirm("Are you sure you want to log out?")) {
                localStorage.setItem('isLoggedIn', 'false');
                localStorage.removeItem('role');

                history.replaceState(null, '', '../HTML/index.html');

                window.location.href = '../HTML/index.html';
            }
        });
    }
});
