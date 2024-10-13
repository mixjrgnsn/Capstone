document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission behavior.

    // Get form field values and trim them
    let firstName = document.getElementById("firstname").value.trim().toUpperCase();
    let lastName = document.getElementById("lastname").value.trim().toUpperCase();
    let email = document.getElementById("email").value.trim();
    let password = document.getElementById("password").value.trim();
    let confPassword = document.getElementById("confirmPassword").value.trim();
    let blk = document.getElementById("lot").value.trim(); // Adjusted for the correct ID
    let lot = document.getElementById("blk").value.trim(); // Adjusted for the correct ID
    let street = document.getElementById("street").value.trim().toUpperCase();

    // Front-end validation: Check if any field is empty
    if (!firstName || !lastName || !email || !password || !confPassword || !blk || !lot || !street) {
        alert("All fields are required.");
        return;
    }

    // Check if passwords match
    if (password !== confPassword) {
        alert("Passwords do not match. Please check again.");
        return; // Prevent form submission
    }

    // Check if password meets the minimum length requirement
    if (password.length < 6) {
        alert("Password must be at least 6 characters long.");
        return; // Prevent form submission
    }

    // Validate blk and lot: Must be two-digit positive numbers
    if (!/^\d{1,2}$/.test(blk) || parseInt(blk) < 0 || parseInt(blk) > 99) {
        alert("BLK must be a two-digit positive number (0-99).");
        return;
    }

    if (!/^\d{1,2}$/.test(lot) || parseInt(lot) < 0 || parseInt(lot) > 99) {
        alert("LOT must be a two-digit positive number (0-99).");
        return;
    }

    // Create a FormData object to send data to the backend
    let formData = new FormData();
    formData.append("firstname", firstName);
    formData.append("lastname", lastName);
    formData.append("email", email);
    formData.append("password", password);
    formData.append("address", `BLK ${blk} LOT ${lot} ${street}`);

    // Make a fetch request to the PHP backend
    fetch('https://in6abxok.infinityfree.com/signup.php', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text(); // Convert the response to text
    })
    .then(data => {
        // Handle the server response
        if (data.includes("Your account is waiting to approve")) {
            alert("Registration completed successfully! Your account is waiting for approval.");
            window.location.href = '../HTML/index.html'; // Redirect to login page
        } else if (data.includes("Sign up Failed")) {
            alert("Sign up failed. Please try again.");
        } else {
            alert(data); // Show other error messages
        }
    })
    .catch(error => {
        console.error('Error:', error);
        alert("An error occurred while registering.");
    });
});
