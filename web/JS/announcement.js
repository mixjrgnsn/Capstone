document.addEventListener('DOMContentLoaded', () => {
    const announcementsContainer = document.createElement('div');
    announcementsContainer.classList.add('announcements-container');
    document.body.appendChild(announcementsContainer);

    fetch('http://localhost/loginregister/database/get_announcements.php')
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.message) {
                announcementsContainer.innerHTML = `<p>${data.message}</p>`;
            } else {
                data.forEach(announcement => {
                    const announcementDiv = document.createElement('div');
                    announcementDiv.classList.add('announcement');
                    announcementDiv.innerHTML = `
                        <p>${announcement.content}</p>
                        <small> Posted on ${new Date(announcement.created_at).toLocaleString()}</small>
                    `;
                    announcementsContainer.appendChild(announcementDiv);
                });
            }
        })
        .catch(error => {
            announcementsContainer.innerHTML = `<p>Error fetching announcements: ${error.message}</p>`;
        });
});
