document.addEventListener('DOMContentLoaded', function() {
    const btn1 = document.getElementById('Btn1');
    const btn2 = document.getElementById('Btn2');
    const loadingSpinner = document.getElementById('loadingSpinner');

    function getQueryParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    function getSubjectDetailsComplaints(id) {
        btn2.style.display = 'none';
        if (!id) {
            document.getElementById('subject-details').innerText = 'No subject selected';
            return;
        }

        fetch(`https://franciscohomes3.online/loginregister/database/getSubjectDetailsComplaints.php?id=${encodeURIComponent(id)}`)
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

    // Check local storage for button states
    const btn1Clicked = localStorage.getItem(`btn1-clicked-${id}`) === 'true';
    const btn2Clicked = localStorage.getItem(`btn2-clicked-${id}`) === 'true';

    if (btn1Clicked) {
        btn1.style.display = 'none';
        if (btn2Clicked) {
            btn2.style.display = 'none'; // Hide btn2 if it was also clicked
        } else {
            btn2.style.display = 'block'; // Show btn2 if only btn1 was clicked
        }
    } else {
        btn2.style.display = 'none'; // Initially hide btn2
    }

    btn1.addEventListener('click', function() {
        loadingSpinner.style.display = 'block';
        btn1.style.display = 'none';
        btn2.style.display = 'block';
        if (!id) {
            alert('No subject selected to mark as read.');
            loadingSpinner.style.display = 'none';
            return;
        }

        fetch(`https://franciscohomes3.online/loginregister/database/updateReadStatus.php?id=${encodeURIComponent(id)}`, {
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
                localStorage.setItem(`btn1-clicked-${id}`, 'true'); // Save btn1 click state
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
        btn2.style.display = 'none';
        loadingSpinner.style.display = 'block';
        if (!id) {
            alert('No subject selected to mark as read.');
            loadingSpinner.style.display = 'none';
            return;
        }

        fetch(`https://franciscohomes3.online/loginregister/database/updateStatusToCompleted.php?id=${encodeURIComponent(id)}`, {
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
                localStorage.setItem(`btn2-clicked-${id}`, 'true'); // Save btn2 click state
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
