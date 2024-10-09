document.addEventListener('DOMContentLoaded', () => {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const postButton = document.getElementById('post-btn');
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmBtn = document.getElementById('confirmBtn');
    const cancelBtn = document.getElementById('cancelBtn');

    postButton.addEventListener('click', () => {
        const content = document.querySelector('.content-text').value;

        if (content.trim() === '') {
            alert('Please enter some content for the announcement.');
            return;
        }

        // Show the confirmation modal
        confirmationModal.style.display = 'block';
    });

    // When the user clicks on the confirm button
    confirmBtn.addEventListener('click', () => {
        const content = document.querySelector('.content-text').value;
    
        // Show the loading spinner
        loadingSpinner.style.display = 'block';
    
        // Create a FormData object to send the data
        const formData = new FormData();
        formData.append('content', content);
    
        // Send the data to the PHP script using fetch
        fetch('http://localhost/loginregister/database/announcement.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            alert(data); // Display the response message
            document.querySelector('.content-text').value = ''; // Clear the textarea
            confirmationModal.style.display = 'none'; // Close the modal
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while submitting the announcement.');
        })
        .finally(() => {
            // Hide the loading spinner after the fetch completes
            loadingSpinner.style.display = 'none';
        });
    });
    

    // When the user clicks on the cancel button
    cancelBtn.addEventListener('click', () => {
        confirmationModal.style.display = 'none'; // Close the modal
    });

    // Close the modal if the user clicks anywhere outside of it
    window.addEventListener('click', (event) => {
        if (event.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });
});
