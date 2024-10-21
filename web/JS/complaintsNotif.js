document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const name = `${userData.firstname} ${userData.lastname}`;
    const complaintsContainer = document.querySelector('#complaints-container');

    fetch(`https://franciscohomes3.online/loginregister/database/displayComplaintsReadNotif.php?name=${name}`)
        .then(response => {
            if (!response.ok) throw new Error('Network response was not ok');
            return response.json();
        })
        .then(data => {

            if (data.message) {
                complaintsContainer.innerHTML += `<p>${data.message}</p>`;
            } else {
                data.forEach(notification => {
                    const notificationDiv = document.createElement('div');
                    notificationDiv.classList.add('notification');
                    const statusColor = notification.status === "ON GOING" ? "#6171ff" : "#4aed75";
                    
                    notificationDiv.innerHTML = `
                        <big>Your Complaint has been marked as <span style="color: ${statusColor};">${notification.status}</span></big><br><br>
                        <p>${notification.subject}</p><br>
                        <small>Date of your complaint: ${notification.date}</small><br>
                        <small>Tag/Complaint Number: ${notification.id}</small><br>
                        <small>${notification.updated_at}</small>
                    `;
                    
                    complaintsContainer.appendChild(notificationDiv);
                });
            }
        })
        .catch(error => {
            console.error('Fetch error:', error);
            complaintsContainer.innerHTML += `<p>Error fetching complaints: ${error.message}</p>`;
        });
});
