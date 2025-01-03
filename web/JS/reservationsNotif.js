document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const name = `${userData.firstname} ${userData.lastname}`;
    const reservationsContainer = document.querySelector('#reservations-container');

    function fetchReservations() {
        fetch(`http://localhost/loginregister/database/displayReservationsAcceptedNotif.php?name=${name}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                // Clear previous content
                reservationsContainer.innerHTML = '';

                if (data.message) {
                    reservationsContainer.innerHTML += `<p>${data.message}</p>`;
                } else {
                    data.forEach(notification => {
                        const notificationDiv = document.createElement('div');
                        notificationDiv.classList.add('notification');
                        const statusColor = notification.status === "COMPLETED" ? "#4aed75" : "#6171ff";
                        const statusMessage = notification.status === "ACCEPTED"
                        ? "Proceed to the security guard to claim the ticket!"
                        : "";
                        
                        notificationDiv.innerHTML = `
                            <big>Your reservation has been <span style="color: ${statusColor};">${notification.status}</span>. ${statusMessage}</big><br><br>
                            <p>${notification.purpose}</p><br>
                            <small>Date of your reservation: ${notification.date}</small><br>
                            <small>From: ${notification.timeFrom} To: ${notification.timeTo}</small><br>
                            <small>Tag/Reservation Number: ${notification.id}</small><br>
                            <small>${notification.updated_at}</small>
                        `;
                        
                        reservationsContainer.appendChild(notificationDiv);
                    });
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                reservationsContainer.innerHTML = `<p>Error fetching reservations: ${error.message}</p>`;
            });
    }

    // Initial fetch
    fetchReservations();

    // Refresh every 5 seconds
    setInterval(fetchReservations, 5000);
});
