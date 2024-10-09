document.querySelector(".btn-click").addEventListener("click", function(event) {
    // Check if the button clicked is the "Cancel" button
    if (this.textContent === "Cancel") {
        // Show a confirmation dialog
        const confirmCancel = confirm("Are you sure you want to cancel and go back to the home page?");
        
        // If the user confirms, redirect to home.html
        if (confirmCancel) {
            window.location.href = "home.html";
        }
    }
});

function showModal(message, onConfirm) {
    const modal = document.getElementById('customModal');
    const modalMessage = document.getElementById('modal-message');
    const confirmButton = document.getElementById('confirm-button');
    const cancelButton = document.getElementById('cancel-button');

    modalMessage.textContent = message;
    modal.style.display = "block";

    confirmButton.onclick = function() {
        modal.style.display = "none";
        onConfirm();
    };

    cancelButton.onclick = function() {
        modal.style.display = "none";
    };

    // Remove the close button functionality
    window.onclick = function(event) {
        if (event.target === modal) {
            // Prevent closing by clicking outside
            event.stopPropagation();
        }
    };
}

document.addEventListener('DOMContentLoaded', () => {
    const currentDate = new Date().toISOString().split('T')[0];
    document.getElementById('date').value = " " + currentDate;
    let loadingSpinner = document.getElementById('loadingSpinner');

    const userData = JSON.parse(localStorage.getItem('userData'));
    const name = `${userData.firstname} ${userData.lastname}`;

    window.sendReport = function() {
        const subject = document.getElementById('subject').value.trim(); // Get the subject and trim whitespace

        if (!subject) { // Check if the subject is empty
            alert("Please enter a subject before sending the report.");
            return; // Exit the function if the subject is empty
        }

        showModal("Are you sure you want to send this report?", function() {
            fetch('http://localhost/loginregister/database/reports.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams({
                    name: name,
                    date: currentDate,
                    subject: subject
                })
            })
            .then(response => response.text())
            .then(data => {
                loadingSpinner.style.display = 'block';
                alert(data);
                document.getElementById('subject').value = '';
                window.location.href = "home.html";
            })
            .catch(error => {
                console.error('Error:', error);
            });
        });
    };

    window.cancel = function() {
        document.getElementById('subject').value = '';
    };
});