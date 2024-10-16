document.getElementById('check').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'block';

    // Show loading spinner after a 0.5-second delay
    setTimeout(() => {
        if (email) {
            fetch('http://localhost/loginregister/database/check_email.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            })
            .then(response => response.json())
            .then(data => {
                loadingSpinner.style.display = 'none';
                document.getElementById('result').innerText = data.message;

                // Show or hide emailCode based on the result message
                if (data.message === "Email is registered.") {
                    document.getElementById('emailCode').style.display = 'block';
                } else {
                    document.getElementById('emailCode').style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                document.getElementById('result').innerText = 'Error checking email.';
                loadingSpinner.style.display = 'none';
            });
        } else {
            document.getElementById('result').innerText = 'Please enter an email.';
            loadingSpinner.style.display = 'none';
            document.getElementById('emailCode').style.display = 'none'; // Hide emailCode if no email
        }
    }, 500); // 500 milliseconds = 0.5 seconds
});
