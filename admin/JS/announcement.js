document.addEventListener('DOMContentLoaded', () => {
    const postButton = document.getElementById('post-btn');

    postButton.addEventListener('click', () => {
        const content = document.querySelector('.content-text').value;

        if (content.trim() === '') {
            alert('Please enter some content for the announcement.');
            return;
        }

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
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while submitting the announcement.');
        });
    });
});
