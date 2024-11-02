document.addEventListener('DOMContentLoaded', () => {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const postButton = document.getElementById('post-btn');
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmBtn = document.getElementById('confirmBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const fileInput = document.getElementById('file-input');

    postButton.addEventListener('click', () => {
        const content = document.querySelector('.content-text').value;

        if (content.trim() === '') {
            alert('Please enter some content for the announcement.');
            return;
        }

        confirmationModal.style.display = 'block';
    });

    confirmBtn.addEventListener('click', () => {
        const content = document.querySelector('.content-text').value;
        const file = fileInput.files[0]; // Get the selected file

        loadingSpinner.style.display = 'block';
        confirmationModal.style.display = 'none';
        const formData = new FormData();
        formData.append('content', content);

        if (file) {
            formData.append('image', file); // Append the image file
        }

        fetch('https://franciscohomes3.online/loginregister/database/announcement.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log(data); // Log the response data for debugging
            if (data.includes("successfully")) {
                alert(data); // Success message
                document.querySelector('.content-text').value = '';
                fileInput.value = ''; // Clear the file input
                document.getElementById('preview-image').style.display = 'none'; // Hide the preview image
                confirmationModal.style.display = 'none';
            } else {
                alert("An error occurred: " + data); // Show error message from server
            }
        })
        .catch(error => {
            console.log('Error:', error);
            alert('An error occurred while submitting the announcement.');
        })
        .finally(() => {
            loadingSpinner.style.display = 'none';
        });
    });

    cancelBtn.addEventListener('click', () => {
        confirmationModal.style.display = 'none';
    });

    window.addEventListener('click', (event) => {
        if (event.target === confirmationModal) {
            confirmationModal.style.display = 'none';
        }
    });

    document.getElementById('postedAnnouncements-btn').addEventListener('click', function() {
        window.location.href = '../HTML/postedAnnouncement.html';
    });

    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            const imagePreview = document.getElementById('image-preview');
            const previewImage = document.getElementById('preview-image');
            
            previewImage.src = e.target.result;
            previewImage.style.display = 'block'; // Show the image
            imagePreview.style.backgroundImage = 'none'; // Clear background
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    });
});
