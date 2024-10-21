document.addEventListener('DOMContentLoaded', function() {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const RID = `${userData.id}`;

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
                    <h5><strong>Residents ID:</strong> ${RID} </h5>
                    <h5><strong>Date:</strong> ${subject.DATE}</h5>
                    </br>
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


    document.getElementById('Btn').addEventListener('click', function() {
        if (!id) {
            alert('No subject selected to mark as read.');
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
                localStorage.setItem(`subject-read2-${id}`, 'true');
                window.location.href = 'reports.html';
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
