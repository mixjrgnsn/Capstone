document.addEventListener("DOMContentLoaded", () => {
    const tableBody = document.getElementById("body-row");
    const headerRow = document.getElementById("header-row");
    const searchBox = document.getElementById("search-box");
    const confirmationModal = document.getElementById("confirmationModal");
    const confirmBtn = document.getElementById("confirmBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    let announcementsData = []; // Store fetched announcements data
    let announcementToDelete = null; // Store the announcement to delete

    // Fetch announcements data
    fetch('http://localhost/loginregister/database/displayAnnouncements.php')
        .then(response => response.json())
        .then(data => {
            if (Array.isArray(data) && data.length > 0) {
                headerRow.innerHTML = '<th>CONTENT</th><th>POSTED AT</th>';
                announcementsData = data;
                populateTable(data);
            } else {
                tableBody.innerHTML = '<tr><td colspan="2">No announcements found.</td></tr>';
            }
        })
        .catch(error => {
            console.error('Error fetching announcements:', error);
            tableBody.innerHTML = '<tr><td colspan="2">Error loading announcements.</td></tr>';
        });

    // Populate table function
    function populateTable(data) {
        tableBody.innerHTML = '';
        data.forEach(announcement => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td style="white-space: pre-wrap;">${announcement.content}</td>
                <td>${new Date(announcement.created_at).toLocaleString()}</td>
            `;
            row.addEventListener('click', () => {
                announcementToDelete = announcement; // Store the clicked announcement
                confirmationModal.style.display = 'block'; // Show the modal
            });
            tableBody.appendChild(row);
        });
    }

    // Search functionality
    searchBox.addEventListener('input', function() {
        const searchTerm = searchBox.value.toLowerCase();
        const filteredData = announcementsData.filter(announcement =>
            announcement.content.toLowerCase().includes(searchTerm)
        );
        populateTable(filteredData);
    });

    // Confirm deletion
    confirmBtn.addEventListener('click', () => {
        if (announcementToDelete) {
            fetch('http://localhost/loginregister/database/deleteAnnouncement.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ content: announcementToDelete.content }), // Use content for deletion
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert(data.message);
                    // Remove the deleted announcement from the displayed list
                    populateTable(announcementsData.filter(a => a.content !== announcementToDelete.content));
                } else {
                    alert(data.message);
                }
                confirmationModal.style.display = 'none'; // Close the modal
            })
            .catch(error => {
                alert('Error deleting announcement:', error);
                confirmationModal.style.display = 'none'; // Close the modal
            });
        }
    });

    // Cancel deletion
    cancelBtn.addEventListener('click', () => {
        confirmationModal.style.display = 'none'; // Close the modal
    });
});

document.getElementById('announcements-btn').addEventListener('click', function() {
    window.location.href = '../HTML/announcement.html';
});