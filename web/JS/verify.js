document.getElementById('check').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'block';

    setTimeout(() => {
        if (email) {
            fetch('https://franciscohomes3.online/loginregister/database/check_email.php', {
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
                if (data.message === "Email is registered.") {
                    document.getElementById('emailCode').style.display = 'block';
                    document.getElementById('container').style.display = 'block';
                    document.getElementById('email').disabled = true;
                } else {
                    document.getElementById('emailCode').style.display = 'none';
                    document.getElementById('container').style.display = 'none';
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
        }
    }, 500);
});

document.getElementById('sendcode').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'block';

    if (email) {
        const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
        
        emailjs.send("service_wokf5ir", "template_yz44713", {
            to_email: email,
            verification_code: verificationCode
        })
        .then((response) => {
            console.log('Email sent successfully:', response.status, response.text);
            loadingSpinner.style.display = 'none';
            document.getElementById('result').innerText = 'Verification code sent to your email.';
            localStorage.setItem('verificationcode', verificationCode);
        })
        .catch((error) => {
            console.error('Error sending email:', error);
            loadingSpinner.style.display = 'none';
            document.getElementById('result').innerText = 'Error sending verification code.';
        });
    } else {
        document.getElementById('result').innerText = 'Please enter an email.';
        loadingSpinner.style.display = 'none';
    }
});

// New code verification logic
document.getElementById('verifycode').addEventListener('click', function() {
    const inputCode = document.getElementById('code').value; // Get the user input code
    const storedCode = localStorage.getItem('verificationcode'); // Get the stored code
    const resultMessage = document.getElementById('result');

    if (inputCode === storedCode) {
        resultMessage.innerText = 'You can now change your password.';
        document.getElementById('new').style.display = 'block';
        document.getElementById('cnfrm').style.display = 'block';
        document.getElementById('submit').style.display = 'block';
        localStorage.removeItem('verificationcode');
    } else {
        resultMessage.innerText = 'Incorrect code. Please try again.';
    }
});

document.getElementById('submit').addEventListener('click', function() {
    const newPassword = document.getElementById('new').value;
    const confirmPassword = document.getElementById('cnfrm').value;
    const email = document.getElementById('email').value; // Get the email from the input
    const resultMessage = document.getElementById('result');

    // Check for minimum password length
    if (newPassword.length < 6) {
        resultMessage.innerText = 'Password must be at least 6 characters long.';
        return; // Exit the function
    }

    if (newPassword === confirmPassword) {
        const loadingSpinner = document.getElementById('loadingSpinner');
        loadingSpinner.style.display = 'block';

        // Make a POST request to the PHP script to update the password
        fetch('https://franciscohomes3.online/loginregister/database/update_password.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: new URLSearchParams({
                email: email,
                newPass: newPassword
            })
        })
        .then(response => response.json())
        .then(data => {
            loadingSpinner.style.display = 'none';
            resultMessage.innerText = data.message;

            if (data.status === "success") {
                // Optionally, redirect or reset the form
                window.location.href = 'index.html';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            resultMessage.innerText = 'Error updating password.';
            loadingSpinner.style.display = 'none';
        });
    } else {
        resultMessage.innerText = 'Passwords do not match. Please try again.';
    }
});