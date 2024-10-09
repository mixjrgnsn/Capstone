document.querySelector(".btn-click").addEventListener("click", function(event) {
    if (this.textContent === "Cancel") {
        event.preventDefault(); // Prevent the default action
        showModal("Are you sure you want to cancel and go back to the home page?", function() {
            window.location.href = "home.html";
        });
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
        loadingSpinner.style.display = "block";
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
            alert("Please enter a subject before sending the complaint.");
            return; // Exit the function if the subject is empty
        }

        showModal("Are you sure you want to send this complaint?", function() {
            fetch('http://localhost/loginregister/database/complaints.php', {
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
            })
            .finally(() => {
                loadingSpinner.style.display = "none";
            });
        });
    };

    window.cancel = function() {
        document.getElementById('subject').value = '';
    };
});
