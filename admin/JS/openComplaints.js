document.addEventListener('DOMContentLoaded', function() {
    // Function to get the query parameter value by its name
    function getQueryParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

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
                    <h5><strong>Tag/Complaint Number:</strong> ${subject.ID} </h5>
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

    const id = getQueryParameter('id');
    getSubjectDetailsComplaints(id);
    document.getElementById('Btn2').style.display = 'none';

    // Check if the subject has already been marked as read
    if (localStorage.getItem(`subject-read1-${id}`) === 'true') {
        document.getElementById('Btn1').style.display = 'none';
        document.getElementById('Btn2').style.display = 'block';
    }
    if (localStorage.getItem(`subject-completed-${id}`) === 'true') {
        document.getElementById('Btn2').style.display = 'none';
    }
    
    document.getElementById('Btn1').addEventListener('click', function() {
        if (!id) {
            alert('No subject selected to mark as read.');
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
                document.getElementById('Btn1').style.display = 'none';
                // Save the read status in localStorage
                localStorage.setItem(`subject-read1-${id}`, 'true');
                
                document.getElementById('Btn2').style.display = 'block';
                window.location.href = 'complaints.html';
            } else {
                throw new Error('Failed to mark as ON GOING');
            }
        })
        .catch(error => {
            console.error('Error updating status:', error);
            alert('Error marking as ON GOING');
        });
    });


    document.getElementById('Btn2').addEventListener('click', function() {
        if (!id) {
            alert('No subject selected to mark as read.');
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
                localStorage.setItem(`subject-completed-${id}`, 'true');
                document.getElementById('Btn2').style.display = 'none';
                window.location.href = 'complaints.html';
            } else {
                throw new Error('Failed to mark as COMPLETED');
            }
        })
        .catch(error => {
            console.error('Error updating status:', error);
            alert('Error marking as COMPLETED');
        });
    });
});
