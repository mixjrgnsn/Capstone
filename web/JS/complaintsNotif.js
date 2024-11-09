document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const name = `${userData.firstname} ${userData.lastname}`;
    const notificationsContainer = document.querySelector('#notifications-container'); // Assuming a container for all notifications

    // Fetch complaints, reports, and reservations
    function fetchNotifications() {
        Promise.all([
            fetch(`https://franciscohomes3.online/loginregister/database/displayComplaintsReadNotif.php?name=${name}`),
            fetch(`https://franciscohomes3.online/loginregister/database/displayReportsReadNotif.php?name=${name}`),
            fetch(`https://franciscohomes3.online/loginregister/database/displayReservationsAcceptedNotif.php?name=${name}`)
        ])
        .then(responses => {
            // Check if all requests were successful
            return Promise.all(responses.map(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            }));
        })
        .then(data => {
            // Merging all notifications into one array
            const [complaints, reports, reservations] = data;

            // Clear previous content
            notificationsContainer.innerHTML = '';

            // Combine all notifications into one array
            let allNotifications = [];

            if (Array.isArray(complaints)) {
                allNotifications = allNotifications.concat(complaints.map(notification => ({ ...notification, type: 'complaint' })));
            }
            if (Array.isArray(reports)) {
                allNotifications = allNotifications.concat(reports.map(notification => ({ ...notification, type: 'report' })));
            }
            if (Array.isArray(reservations)) {
                allNotifications = allNotifications.concat(reservations.map(notification => ({ ...notification, type: 'reservation' })));
            }

            // Sort notifications by updated_at (latest first)
            allNotifications.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

            // Render notifications
            allNotifications.forEach(notification => {
                createNotification(notification);
            });
        })
        .catch(error => {
            console.error('Fetch error:', error);
            notificationsContainer.innerHTML = `<p>Error fetching notifications: ${error.message}</p>`;
        });
    }

    // Function to create a notification element
    function createNotification(notification) {
        const notificationDiv = document.createElement('div');
        notificationDiv.classList.add('notification');
        let statusColor = '';
        let additionalMessage = '';
        let imageHtml = ''; // Variable to hold image HTML if applicable

        // Check for image and create the HTML if the notification has one
        if (notification.image_name) {
            imageHtml = `<img class="notification-image" src="https://franciscohomes3.online/loginregister/uploads/${notification.image_name}" alt="Notification Image"><br>`;
        }

        if (notification.type === 'complaint') {
            statusColor = notification.status === "ON GOING" ? "#6171ff" : "#4aed75";
            notificationDiv.innerHTML = `
                <big>Your Complaint has been marked as <span style="color: ${statusColor};">${notification.status}</span></big><br><br>
                <p>${notification.subject}</p><br>
                ${imageHtml}
                <small>Date of your complaint: ${notification.date}</small><br>
                <small>Tag/Complaint Number: ${notification.id}</small><br>
                <small>${notification.updated_at}</small>
            `;
        } else if (notification.type === 'report') {
            notificationDiv.innerHTML = `
                <big>Your report has been marked as <span style="color: #4aed75">${notification.status}</span></big><br><br>
                <p>${notification.subject}</p><br>
                ${imageHtml}
                <small>Date of your report: ${notification.date}</small><br>
                <small>Tag/Report Number: ${notification.id}</small><br>
                <small>${notification.updated_at}</small>
            `;
        } else if (notification.type === 'reservation') {
            statusColor = notification.status === "COMPLETED" ? "#4aed75" : "#6171ff";
            additionalMessage = notification.status === "ACCEPTED" ? "Proceed to the security guard to claim the ticket!" : "";
            notificationDiv.innerHTML = `
                <big>Your reservation has been <span style="color: ${statusColor};">${notification.status}</span>. ${additionalMessage}</big><br><br>
                <p>${notification.purpose}</p><br>
                <small>Date of your reservation: ${notification.date}</small><br>
                <small>From: ${notification.timeFrom} To: ${notification.timeTo}</small><br>
                <small>Tag/Reservation Number: ${notification.id}</small><br>
                <small>${notification.updated_at}</small>
            `;
        }

        notificationsContainer.appendChild(notificationDiv);
    }

    // Initial fetch of notifications
    fetchNotifications();

    // Refresh every 5 seconds
    setInterval(fetchNotifications, 5000);
});
