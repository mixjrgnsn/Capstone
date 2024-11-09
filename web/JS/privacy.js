window.onload = function() {
    // Retrieve the email from localStorage
    const userEmail = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')).email : '';
    const userData = localStorage.getItem('userData') ? JSON.parse(localStorage.getItem('userData')) : {};
    const userID = userData.id;
    const userName = userData.firstname && userData.lastname ? `${userData.firstname} ${userData.lastname}` : '';
    const userAddress = userData.address;

    const idInput = document.getElementById('id');
    idInput.value = userID;
    idInput.disabled = true;

    const nameInput = document.getElementById('name');
    nameInput.value = userName;
    nameInput.disabled = true;

    const addressInput = document.getElementById('address');
    addressInput.value = userAddress;
    addressInput.disabled = true;

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
            alert("Please fill all fields.");
            return;
        }

        if (newPass.length < 6) {
            alert("New password must be at least 6 characters long.");
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
                    alert(data.message);  // Show alert with success message
                    oldPassInput.value = '';  // Clear inputs
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
    });

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
};
