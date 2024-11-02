document.getElementById('check').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'block';

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
                if (data.message === "Email is not registered.") {
                    document.getElementById('result').style.display = 'none';
                    document.getElementById('emailCode').style.display = 'block';
                    document.getElementById('container').style.display = 'block';
                    document.getElementById('email').disabled = true;
                } else if (data.message === "Email is registered.") {
                    document.getElementById('result').innerText = "Email is registered. " + "Try different one.";
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
    document.getElementById('result').innerText = '';
    document.getElementById('result').style.display = 'block';

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

document.getElementById('verifycode').addEventListener('click', function() {
    const email = document.getElementById('email').value;
    const inputCode = document.getElementById('code').value;
    const storedCode = localStorage.getItem('verificationcode');
    const resultMessage = document.getElementById('result');
    const loadingSpinner = document.getElementById('loadingSpinner');
    loadingSpinner.style.display = 'block';

    setTimeout(() => {
        loadingSpinner.style.display = 'none';
        if (inputCode === storedCode) {
            localStorage.removeItem('verificationcode');
            localStorage.setItem('email', email);
            window.location.href = '../HTML/signup.html';
        } else {
            resultMessage.innerText = 'Incorrect code. Please try again.';
        }
    }, 1000);
});
