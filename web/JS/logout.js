window.onload = function() {
    if (!localStorage.getItem('userData')) {
        // Redirect to login if there's no user data
        window.location.replace('../HTML/index.html');
        history.replaceState(null, '', '../HTML/index.html');
    }
};