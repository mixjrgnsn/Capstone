document.addEventListener('DOMContentLoaded', () => {
    const sendReportsBtn = document.getElementById('sendReports');
    const customModal = document.getElementById('customModal');
    const confirmButton = document.getElementById('confirm-button');
    const cancelButton = document.getElementById('cancel-button');
    const modalMessage = document.getElementById('modal-message');
    const customModal1 = document.getElementById('customModal1');
    const confirmButton1 = document.getElementById('confirm-button1');
    const cancelButton1 = document.getElementById('cancel-button1');
    const modalMessage1 = document.getElementById('modal-message1');
    const subjectInput = document.getElementById('subject');
    const currentDate = new Date().toLocaleDateString('en-CA');
    const fileInput = document.getElementById('file-input');
    const userData = JSON.parse(localStorage.getItem('userData'));
    const name = `${userData.firstname} ${userData.lastname}`;

    // When the Send button is clicked, show the confirmation modal
    sendReportsBtn.addEventListener('click', () => {
        const subjectText = subjectInput.value;
        const fileName = fileInput.files.length > 0 ? fileInput.files[0].name : 'No file selected';

        if (!subjectText) {
            alert("Please enter a subject before sending the report.");
            return;
        } else{
            modalMessage.textContent = `Are you sure you want to send the report?`;
            customModal.style.display = 'block';
        }
    });

    confirmButton.addEventListener('click', () => {
        customModal.style.display = 'none';
        const subjectText = subjectInput.value;
        const file = fileInput.files[0];

        // Form data for sending to PHP
        const formData = new FormData();
        formData.append('name', name);
        formData.append('date', currentDate);
        formData.append('subject', subjectText);
        if (file) {
            formData.append('image', file);
        }

        document.getElementById('loadingSpinner').style.display = 'block';

        fetch('https://franciscohomes3.online/loginregister/database/reports.php', {
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
            if (data.includes("Report Submitted")) {
                alert("Report Submitted Successfully!");
                setTimeout(() => {
                    window.location.href = 'home.html';
                }, 1000);
                console.log(data);
            } else {
                alert("Error: " + data);
                console.log(data);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error: ' + error);
            document.getElementById('loadingSpinner').style.display = 'none';
            customModal.style.display = 'none';
        });
    });

    cancelButton.addEventListener('click', () => {
        customModal.style.display = 'none';
    });

    document.getElementById('cancel').addEventListener('click', function() {
        modalMessage1.textContent = `Are you sure you want to cancel?`;
        customModal1.style.display = 'block';
    });

    confirmButton1.addEventListener('click', () => {
        customModal1.style.display = 'none';
        document.getElementById('loadingSpinner').style.display = 'block';
        setTimeout(() => {
            window.location.href = 'home.html'; // Redirect after a slight delay
        }, 500);
    });

    cancelButton1.addEventListener('click', () => {
        customModal1.style.display = 'none';
    });
});