document.addEventListener('DOMContentLoaded', () => {
    const announcementsContainer = document.createElement('div');
    announcementsContainer.classList.add('announcements-container');
    document.body.appendChild(announcementsContainer);

    const fetchAnnouncements = () => {
        fetch('https://franciscohomes3.online/loginregister/database/get_announcements.php')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                announcementsContainer.innerHTML = '';

                if (data.message) {
                    announcementsContainer.innerHTML = `<p>${data.message}</p>`;
                } else {
                    data.forEach(announcement => {
                        const announcementDiv = document.createElement('div');
                        announcementDiv.classList.add('announcement');
                        
                        const imageHtml = announcement.image_name 
                            ? `<img class="centered-image" src="https://franciscohomes3.online/loginregister/uploads/${announcement.image_name}" alt="Announcement Image"><br>`
                            : ``;

                        announcementDiv.innerHTML = `
                            <p>${announcement.content}</p>
                            ${imageHtml}
                            <small>Posted on ${new Date(announcement.created_at).toLocaleString()}</small>
                        `;
                        announcementsContainer.appendChild(announcementDiv);
                    });
                }
            })
            .catch(error => {
                announcementsContainer.innerHTML = `<p>Error fetching announcements: ${error.message}</p>`;
            });
    };

    fetchAnnouncements();

    setInterval(fetchAnnouncements, 5000);
});
