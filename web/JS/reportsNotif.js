document.addEventListener('DOMContentLoaded', () => {
    const userData = JSON.parse(localStorage.getItem('userData'));
    const name = `${userData.firstname} ${userData.lastname}`;
    const reportsContainer = document.querySelector('#reports-container');

    function fetchReports() {
        fetch(`https://franciscohomes3.online/loginregister/database/displayReportsReadNotif.php?name=${name}`)
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                // Clear previous content
                reportsContainer.innerHTML = '';

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
                            <small>Tag/Report Number: ${report.id}</small><br>
                            <small>${report.updated_at}</small>
                        `;
                        reportsContainer.appendChild(reportDiv);
                    });
                }
            })
            .catch(error => {
                console.error('Fetch error:', error);
                reportsContainer.innerHTML = `<p>Error fetching reports: ${error.message}</p>`;
            });
    }

    // Initial fetch
    fetchReports();

    // Refresh every 5 seconds
    setInterval(fetchReports, 5000);
});
