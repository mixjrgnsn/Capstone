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

        confirmationModal.style.display = 'block';
    });

    confirmBtn.addEventListener('click', () => {
        const content = document.querySelector('.content-text').value;
    
        loadingSpinner.style.display = 'block';
    
        const formData = new FormData();
        formData.append('content', content);
    
        fetch('https://franciscohomes3.online/loginregister/database/announcement.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            alert(data);
            document.querySelector('.content-text').value = '';
            confirmationModal.style.display = 'none';
        })
        .catch(error => {
            console.error('Error:', error);
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
});

document.getElementById('postedAnnouncements-btn').addEventListener('click', function() {
    window.location.href = '../HTML/postedAnnouncement.html';
});
