document.addEventListener('DOMContentLoaded', function() {
    // Function to get the query parameter value by its name
    function getQueryParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Function to fetch and display subject details based on the id
    function getSubjectDetailsComplaints(id) {
        if (!id) {
            document.getElementById('subject-details').innerText = 'No subject selected';
            return;
        }

        // Fetch data from the server using the provided id
        fetch(`http://localhost/loginregister/database/getSubjectDetailsComplaints.php?id=${encodeURIComponent(id)}`)
            .then(response => response.json())
            .then(data => {
                const detailsContainer = document.getElementById('subject-details');
                
                if (data && data.length > 0) {
                    const subject = data[0];
                    detailsContainer.innerHTML = `
                    <h5><strong>Name:</strong> ${subject.NAME} </h5>
                    <h5><strong>Date:</strong> ${subject.DATE}</h5>
                    <br>
                    <p>${subject.SUBJECT}</p>`;
                } else {
                    detailsContainer.innerText = 'No details available for this subject.';
                }
            })
            .catch(error => {
                console.error('Error fetching subject details:', error);
                document.getElementById('subject-details').innerText = 'Error fetching details';
            });
    }

    // Fetch subject details based on the query parameter
    const id = getQueryParameter('id');
    getSubjectDetailsComplaints(id);

    // Check if the subject has already been marked as read
    if (localStorage.getItem(`subject-read-${id}`) === 'true') {
        document.getElementById('Btn').style.display = 'none';
    }

    document.getElementById('Btn').addEventListener('click', function() {
        if (!id) {
            alert('No subject selected to mark as read.');
            return;
        }

        // Update the read status in the database
        fetch(`http://localhost/loginregister/database/updateReadStatus.php?id=${encodeURIComponent(id)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ read: true })
        })
        .then(response => {
            if (response.ok) {
                alert('Marked as read successfully!');
                // Hide the button after successful marking
                document.getElementById('Btn').style.display = 'none';
                // Save the read status in localStorage
                localStorage.setItem(`subject-read-${id}`, 'true');
                window.location.href = 'complaints.html';
            } else {
                throw new Error('Failed to mark as read');
            }
        })
        .catch(error => {
            console.error('Error updating read status:', error);
            alert('Error marking as read');
        });
    });
});
