document.addEventListener('DOMContentLoaded', function() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const btn = document.getElementById('Btn');
    
    function getQueryParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    function getSubjectDetailsReports(id) {
        btn.style.display = 'none';
        if (!id) {
            document.getElementById('subject-details').innerText = 'No subject selected';
            return;
        }

        fetch(`http://localhost/loginregister/database/getSubjectDetailsReports.php?id=${encodeURIComponent(id)}`)
            .then(response => response.json())
            .then(data => {
                const detailsContainer = document.getElementById('subject-details');
                
                if (data && data.length > 0) {
                    const subject = data[0];
                    
                    // Display subject details
                    const imageUrl = subject.IMAGE ? `http://localhost/loginregister/uploads/${subject.IMAGE}` : null;

                    if (imageUrl) {
                        detailsContainer.innerHTML = `
                            <h5><strong>Tag/Report Number:</strong> ${subject.ID} </h5>
                            <h5><strong>Name:</strong> ${subject.NAME} </h5>
                            <h5><strong>Date:</strong> ${subject.DATE}</h5>
                            <a href="${imageUrl}" target="_blank">
                                <img class="image" src="${imageUrl}" alt="Image" style="max-width: 100%; cursor: pointer;">
                            </a>
                            <p>${subject.SUBJECT}</p>
                        `;
                    } else {
                        detailsContainer.innerHTML = `
                            <h5><strong>Tag/Report Number:</strong> ${subject.ID} </h5>
                            <h5><strong>Name:</strong> ${subject.NAME} </h5>
                            <h5><strong>Date:</strong> ${subject.DATE}</h5>
                            <p>${subject.SUBJECT}</p>
                        `;
                    }

                    // Control button visibility based on STATUS
                    switch (subject.STATUS) {
                        case 'UNREAD':
                            btn.style.display = 'block';
                            break;
                        case 'COMPLETED':
                            btn.style.display = 'none';
                            break;
                        default:
                            btn.style.display = 'none';
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
    getSubjectDetailsReports(id);

    btn.addEventListener('click', function() {
        loadingSpinner.style.display = 'block';
        if (!id) {
            alert('No subject selected to mark as read.');
            loadingSpinner.style.display = 'none';
            return;
        }

        fetch(`http://localhost/loginregister/database/updateReadStatus2.php?id=${encodeURIComponent(id)}`, {
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
                window.location.href = 'home.html';
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
