document.addEventListener('DOMContentLoaded', function() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const btn = document.getElementById('Btn');
    
    function getQueryParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    function getSubjectDetailsReports(id) {
        if (!id) {
            document.getElementById('subject-details').innerText = 'No subject selected';
            return;
        }

        fetch(`https://franciscohomes3.online/loginregister/database/getSubjectDetailsReports.php?id=${encodeURIComponent(id)}`)
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
    getSubjectDetailsReports(id);

    // Check local storage to see if the button should be hidden
    if (id && localStorage.getItem(`subject-read3-${id}`) === 'true') {
        btn.style.display = 'none'; // Only hide if the specific ID is found in localStorage
    }

    btn.addEventListener('click', function() {
        loadingSpinner.style.display = 'block';
        if (!id) {
            alert('No subject selected to mark as read.');
            loadingSpinner.style.display = 'none';
            return;
        }

        fetch(`https://franciscohomes3.online/loginregister/database/updateReadStatus2.php?id=${encodeURIComponent(id)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ read: true })
        })
        .then(response => {
            if (response.ok) {
                alert('Marked as read successfully!');
                loadingSpinner.style.display = 'none';
                localStorage.setItem(`subject-read3-${id}`, 'true'); // Store the read status
                btn.style.display = 'none'; // Hide the button after marking as read
                window.location.href = 'reports.html'; // Redirect after success
            } else {
                throw new Error('Failed to mark as read');
            }
        })
        .catch(error => {
            console.error('Error updating read status:', error);
            alert('Error marking as read');
            loadingSpinner.style.display = 'none';
        });
    });
});
