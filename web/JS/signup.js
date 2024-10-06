document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission behavior.

    // Get form field values and trim them
    let firstName = document.getElementById("firstname").value.trim().toUpperCase();
    let lastName = document.getElementById("lastname").value.trim().toUpperCase();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let confPassword = document.getElementById("confirmPassword").value.trim();
    let number = document.getElementById("blkAndLot").value.trim().toUpperCase();
    let street = document.getElementById("street").value.trim().toUpperCase();
    var loadingSpinner = document.getElementById('loadingSpinner');

    // Front-end validation: Check if any field is empty
    if (firstName === "" || lastName === "" || email === "" || password === "" || confPassword === "" || number === "" || street === "") {
        alert("All fields are required");
        return;
    }

    // Check if passwords match
    if (password !== confPassword) {
        alert("Passwords do not match. Please check again.");
        return; // Prevent form submission
    }

    // Show the loading spinner
    loadingSpinner.style.display = 'block';

    // Create a FormData object to send data to the backend
    let formData = new FormData();
    formData.append("firstname", firstName);
    formData.append("lastname", lastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("address", number + ' ' + street);

    // Make a fetch request to the PHP backend
    fetch('http://localhost/loginregister/database/signup.php', {
        method: 'POST',
        body: formData
    })
    .then(response => response.text()) // Convert the response to text
    .then(data => {
        // Hide the loading spinner
        loadingSpinner.style.display = 'none';

        // Handle the server response
        if (data.includes("Your account is waiting to approve")) {
            alert("Registration completed successfully! Your account is waiting for approval.");
            window.history.replaceState(null, '', window.location.href);
            window.location.href = '/web/HTML/login.html'; // Redirect to login page
        } else if (data.includes("Sign up Failed")) {
            alert("Sign up failed. Please try again.");
        } else {
            alert(data); // Show other error messages
        }
    })
    .catch(error => {
        // Hide the loading spinner
        loadingSpinner.style.display = 'none';
        
        console.error('Error:', error);
        alert("An error occurred while registering.");
    });
});
