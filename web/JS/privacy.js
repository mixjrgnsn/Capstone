window.onload = function() {
    // Retrieve the email from localStorage
    const userEmail = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).email : '';

    // Get the email input field by its ID
    const emailInput = document.getElementById('email');
    emailInput.value = userEmail;
    emailInput.disabled = true; // Make the input non-editable

    // Add event listener for form submission
    const submitButton = document.querySelector('input[type="submit"]'); // Ensure submit button exists
    submitButton.addEventListener('click', function(event) {
        event.preventDefault(); // Prevent default form submission

        // Get the form inputs
        const oldPassInput = document.getElementById('oldPass');
        const newPassInput = document.getElementById('newPass');
        const oldPass = oldPassInput.value;
        const newPass = newPassInput.value;

        // Validate inputs
        if (!oldPass || !newPass) {
            alert("Please fill all fields.");
            return;
        }

        // Create request payload
        const formData = new FormData();
        formData.append('email', userEmail);
        formData.append('oldPass', oldPass);
        formData.append('newPass', newPass);

        // Send request to PHP server to check credentials and update password
        fetch('http://localhost/loginregister/database/privacy.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                alert(data.message);

                // Clear the old and new password fields
                oldPassInput.value = '';
                newPassInput.value = '';
            } else {
                alert(data.message);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while processing your request.');
        });
    });
};
