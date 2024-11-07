document.addEventListener('DOMContentLoaded', function() {
    const btn1 = document.getElementById('Btn1');
    const btn2 = document.getElementById('Btn2');
    const loadingSpinner = document.getElementById('loadingSpinner');

    function getQueryParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    function getSubjectDetailsComplaints(id) {
        btn1.style.display = 'none';
        btn2.style.display = 'none'; // Initially hide both buttons

        if (!id) {
            document.getElementById('subject-details').innerText = 'No subject selected';
            return;
        }

        fetch(`http://localhost/loginregister/database/getSubjectDetailsComplaints.php?id=${encodeURIComponent(id)}`)
            .then(response => response.json())
            .then(data => {
                const detailsContainer = document.getElementById('subject-details');
                
                if (data && data.length > 0) {
                    const subject = data[0];

                    // Display subject details
                    const imageUrl = subject.IMAGE ? `http://localhost/loginregister/uploads/${subject.IMAGE}` : null;

                    if (imageUrl) {
                        detailsContainer.innerHTML = `
                            <h5><strong>Tag/Complaint Number:</strong> ${subject.ID} </h5>
                            <h5><strong>Name:</strong> ${subject.NAME} </h5>
                            <h5><strong>Date:</strong> ${subject.DATE}</h5>
                            <a href="${imageUrl}" target="_blank">
                                <img class="image" src="${imageUrl}" alt="Image" style="max-width: 100%; cursor: pointer;">
                            </a>
                            <p>${subject.SUBJECT}</p>
                        `;
                    } else {
                        detailsContainer.innerHTML = `
                            <h5><strong>Tag/Complaint Number:</strong> ${subject.ID} </h5>
                            <h5><strong>Name:</strong> ${subject.NAME} </h5>
                            <h5><strong>Date:</strong> ${subject.DATE}</h5>
                            <p>${subject.SUBJECT}</p>
                        `;
                    }

                    // Control button visibility based on STATUS
                    switch (subject.STATUS) {
                        case 'UNREAD':
                            btn1.style.display = 'block'; // Show btn1
                            btn2.style.display = 'none';  // Hide btn2
                            break;
                        case 'ON GOING':
                            btn1.style.display = 'none';  // Hide btn1
                            btn2.style.display = 'block'; // Show btn2
                            break;
                        case 'COMPLETED':
                            btn1.style.display = 'none'; // Hide btn1
                            btn2.style.display = 'none'; // Hide btn2
                            break;
                        default:
                            btn1.style.display = 'none'; // Hide btn1 by default
                            btn2.style.display = 'none'; // Hide btn2 by default
                            break;
                    }
                } else {
                    detailsContainer.innerText = 'No details available for this subject.';
                }
            })
            .catch(error => {
                console.error('Error fetching subject details:', error);
                document.getElementById('subject-details').innerText = 'Error fetching details';
            });
    }

    const id = getQueryParameter('id');
    getSubjectDetailsComplaints(id);

    btn1.addEventListener('click', function() {
        loadingSpinner.style.display = 'block';
        if (!id) {
            alert('No subject selected to mark as read.');
            loadingSpinner.style.display = 'none';
            return;
        }

        fetch(`http://localhost/loginregister/database/updateReadStatus.php?id=${encodeURIComponent(id)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ read: true })
        })
        .then(response => {
            if (response.ok) {
                alert('Marked as ON GOING successfully!');
                loadingSpinner.style.display = 'none';
                window.location.href = 'complaints.html';
            } else {
                throw new Error('Failed to mark as ON GOING');
            }
        })
        .catch(error => {
            console.error('Error updating status:', error);
            alert('Error marking as ON GOING');
            loadingSpinner.style.display = 'none';
        });
    });

    btn2.addEventListener('click', function() {
        loadingSpinner.style.display = 'block';
        if (!id) {
            alert('No subject selected to mark as read.');
            loadingSpinner.style.display = 'none';
            return;
        }

        fetch(`http://localhost/loginregister/database/updateStatusToCompleted.php?id=${encodeURIComponent(id)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ read: true })
        })
        .then(response => {
            if (response.ok) {
                alert('Marked as COMPLETED successfully!');
                loadingSpinner.style.display = 'none';
                window.location.href = 'complaints.html';
            } else {
                throw new Error('Failed to mark as COMPLETED');
            }
        })
        .catch(error => {
            console.error('Error updating status:', error);
            alert('Error marking as COMPLETED');
            loadingSpinner.style.display = 'none';
        });
    });
});
