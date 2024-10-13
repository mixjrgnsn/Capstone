document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const name = `${userData.firstname} ${userData.lastname}`;
    const complaintsContainer = document.querySelector('#complaints-container');
    const reportsContainer = document.querySelector('#reports-container');

    const fetchNotifications = () => {
        complaintsContainer.innerHTML = ''; // Clear previous complaints
        reportsContainer.innerHTML = ''; // Clear previous reports

        // Fetch complaints
        fetch(`http://localhost/loginregister/database/displayComplaintsReadNotif.php?name=${name}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                console.log('Fetched complaints:', data);

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
                            <small>Tag/Complaint Number: ${notification.id}</small>
                        `;
                        complaintsContainer.appendChild(notificationDiv);
                    });
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                complaintsContainer.innerHTML += `<p>Error fetching complaints: ${error.message}</p>`;
            });

        // Fetch reports
        fetch(`http://localhost/loginregister/database/displayReportsReadNotif.php?name=${name}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                console.log('Fetched reports:', data);

                if (data.message) {
                    reportsContainer.innerHTML += `<p>${data.message}</p>`;
                } else {
                    data.forEach(report => {
                        const reportDiv = document.createElement('div');
                        reportDiv.classList.add('notification');
                        reportDiv.innerHTML = `
                            <big>Your report has been marked as <span style="color: #4aed75">${report.status}</span></big><br><br>
                            <p>${report.subject}</p><br>
                            <small>Date of your report: ${report.date}</small><br>
                            <small>Tag/Report Number: ${report.id}</small>
                        `;
                        reportsContainer.appendChild(reportDiv);
                    });
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                reportsContainer.innerHTML += `<p>Error fetching reports: ${error.message}</p>`;
            });
    };

    // Fetch notifications immediately on load
    fetchNotifications();

    // Set an interval to fetch notifications every 10 seconds
    //setInterval(fetchNotifications, 10000);
});
