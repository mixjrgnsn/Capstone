window.onload = function() {
    // Retrieve the email from localStorage
    const userEmail = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).email : '';

    const emailInput = document.getElementById('email');
    emailInput.value = userEmail;
    emailInput.disabled = true;

    const submitButton = document.querySelector('input[type="submit"]');
    submitButton.addEventListener('click', function(event) {
        event.preventDefault();

        const oldPassInput = document.getElementById('oldPass');
        const newPassInput = document.getElementById('newPass');
        const oldPass = oldPassInput.value;
        const newPass = newPassInput.value;

        if (!oldPass || !newPass) {
            showAlert("Please fill all fields.");
            return;
        }

        if (newPass.length < 6) {
            showAlert("New password must be at least 6 characters long.");
            return;
        }

        // Show confirm modal
        showConfirm("Are you sure you want to change your password?", function() {
            // Confirmed - proceed with form submission
            const formData = new FormData();
            formData.append('email', userEmail);
            formData.append('oldPass', oldPass);
            formData.append('newPass', newPass);

            fetch('https://franciscohomes3.online/loginregister/database/privacy.php', {
                method: 'POST',
                body: formData
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === 'success') {
                    showAlert(data.message);  // Show alert with success message
                    oldPassInput.value = '';  // Clear inputs
                    newPassInput.value = '';
                } else {
                    showAlert(data.message);
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showAlert('An error occurred while processing your request.');
            });
        });
    });

    // Alert Modal Functions
    const alertModal = document.getElementById("alertModal");
    const alertMessage = document.getElementById("alertMessage");
    const closeAlert = document.querySelector("#alertModal .close");

    function showAlert(message) {
        alertMessage.innerText = message;
        alertModal.style.display = "block";
    }

    closeAlert.onclick = function() {
        alertModal.style.display = "none";

        // Check if the alert message is "Password updated successfully"
        if (alertMessage.innerText === "Password updated successfully") {
            window.location.href = 'home.html';  // Redirect to home.html
        }
    };

    // Confirm Modal Functions
    const confirmModal = document.getElementById("confirmModal");
    const confirmMessage = document.getElementById("confirmMessage");
    const confirmBtn = document.getElementById("confirmBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    function showConfirm(message, onConfirm) {
        confirmMessage.innerText = message;
        confirmModal.style.display = "block";

        confirmBtn.onclick = function() {
            confirmModal.style.display = "none";
            onConfirm();
        };

        cancelBtn.onclick = function() {
            confirmModal.style.display = "none";
        };
    }

    // Close modals when clicking outside
    window.onclick = function(event) {
        if (event.target == alertModal) {
            alertModal.style.display = "none";
        } else if (event.target == confirmModal) {
            confirmModal.style.display = "none";
        }
    };
};
