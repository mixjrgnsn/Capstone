document.addEventListener('DOMContentLoaded', function() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const RID = `${userData.id}`;
    function getQueryParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    function getSubjectDetailsComplaints(id) {
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
                    detailsContainer.innerHTML = `
                    <h5><strong>Tag/Complaint Number:</strong> ${subject.ID} </h5>
                    <h5><strong>Name:</strong> ${subject.NAME} </h5>
                    <h5><strong>Residents ID:</strong> ${RID} </h5>
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
                localStorage.setItem(`subject-read-${id}`, 'true');
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
