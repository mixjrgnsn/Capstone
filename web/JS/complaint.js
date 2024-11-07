document.addEventListener('DOMContentLoaded', () => {
    const sendComplaintBtn = document.getElementById('sendComplaint');
    const customModal = document.getElementById('customModal');
    const confirmButton = document.getElementById('confirm-button');
    const cancelButton = document.getElementById('cancel-button');
    const modalMessage = document.getElementById('modal-message');
    const subjectInput = document.getElementById('subject');
    const currentDate = new Date().toLocaleDateString('en-CA');
    const fileInput = document.getElementById('file-input');
    const userData = JSON.parse(localStorage.getItem('userData'));
    const name = `${userData.firstname} ${userData.lastname}`;

    // When the Send button is clicked, show the confirmation modal
    sendComplaintBtn.addEventListener('click', () => {
        const subjectText = subjectInput.value;
        const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : 'No file selected';

        if (!subjectText) {
            alert("Please enter a subject before sending the complaint.");
            return;
        } else{
            modalMessage.textContent = `Are you sure you want to send the complaint?\n\nSubject: ${subjectText}\nFile: ${fileName}`;
            customModal.style.display = 'block';
        }

    });

    // When the user clicks "Yes" in the modal, send the data via AJAX
    confirmButton.addEventListener('click', () => {
        const subjectText = subjectInput.value;
        const file = fileInput.files[0];

        // Form data for sending to PHP
        const formData = new FormData();
        formData.append('name', name); // You can replace this with actual user data
        formData.append('date', currentDate); // Current date, or get from your form
        formData.append('subject', subjectText);
        if (file) {
            formData.append('image', file);
        }

        // Show loading spinner
        document.getElementById('loadingSpinner').style.display = 'block';

        // Send the form data using AJAX
        fetch('http://localhost/loginregister/database/complaints.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            // Hide loading spinner after the response is received
            document.getElementById('loadingSpinner').style.display = 'none';
            customModal.style.display = 'none'; // Close the modal

            console.log('Server Response:', data); // Log the server response

            // Check if the response indicates success
            if (data.includes("Complaint Submitted")) {
                alert("Complaint Submitted Successfully!");
                // Ensure the redirect happens only after the alert is closed
                setTimeout(() => {
                    window.location.href = 'home.html'; // Redirect after a slight delay
                }, 1000); // Delay can be adjusted if needed
                console.log(data);
            } else {
                alert("Error: " + data); // Show the PHP error message
                console.log(data);
            }
        })
        .catch(error => {
            console.error('Error:', error); // Log any network or other errors
            alert('Error: ' + error);
            document.getElementById('loadingSpinner').style.display = 'none';
            customModal.style.display = 'none';
        });
    });

    // When the user clicks "No" in the modal, just close the modal
    cancelButton.addEventListener('click', () => {
        customModal.style.display = 'none';
    });

    document.getElementById('cancel').addEventListener('click', function() {
        document.getElementById('subject').value = '';
    });
});
