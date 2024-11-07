document.addEventListener("DOMContentLoaded", () => {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const tableBody = document.getElementById("body-row");
    const headerRow = document.getElementById("header-row");
    const searchBox = document.getElementById("search-box");
    const confirmationModal = document.getElementById("confirmationModal");
    const confirmBtn = document.getElementById("confirmBtn");
    const cancelBtn = document.getElementById("cancelBtn");

    let announcementsData = []; // Store fetched announcements data
    let announcementToDelete = null; // Store the announcement to delete
    let currentSearchTerm = ''; // Store the current search term

    // Function to fetch and display announcements
    function fetchAnnouncements() {
        fetch('https://franciscohomes3.online/loginregister/database/displayAnnouncements.php')
            .then(response => response.json())
            .then(data => {
                if (Array.isArray(data) && data.length > 0) {
                    headerRow.innerHTML = '<th>IMAGE</th><th>CONTENT</th><th>POSTED ON</th>';
                    announcementsData = data;
                    populateTable(data); // Populate with new data

                    // Reapply the search filter if there's a current search term
                    if (currentSearchTerm) {
                        const filteredData = announcementsData.filter(announcement =>
                            announcement.content.toLowerCase().includes(currentSearchTerm)
                        );
                        populateTable(filteredData);
                    }
                } else {
                    tableBody.innerHTML = '<tr><td colspan="2">No announcements found.</td></tr>';
                }
            })
            .catch(error => {
                console.error('Error fetching announcements:', error);
                tableBody.innerHTML = '<tr><td colspan="2">Error loading announcements.</td></tr>';
            });
    }

    // Populate table function
    // Populate table function
    function populateTable(data) {
        tableBody.innerHTML = '';
        data.forEach(announcement => {
            const row = document.createElement('tr');
            
            // Check if the announcement has an image
            const imageHtml = announcement.image_name
                ? `<img src="https://franciscohomes3.online/loginregister/uploads/${announcement.image_name}" alt="Announcement Image" style="width: 300px; height: 300px;">`
                : 'No uploaded image'; // Display 'No Image' text if no image is found

            row.innerHTML = `
                <td>${imageHtml}</td>
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
        currentSearchTerm = searchBox.value.toLowerCase(); // Save the current search term
        const filteredData = announcementsData.filter(announcement =>
            announcement.content.toLowerCase().includes(currentSearchTerm)
        );
        populateTable(filteredData);
    });

    // Confirm deletion
    confirmBtn.addEventListener('click', () => {
        loadingSpinner.style.display = 'block';
        confirmationModal.style.display = 'none';
        if (announcementToDelete) {
            fetch('https://franciscohomes3.online/loginregister/database/deleteAnnouncement.php', {
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
                    loadingSpinner.style.display = 'none';
                    // Remove the deleted announcement from the displayed list
                    announcementsData = announcementsData.filter(a => a.content !== announcementToDelete.content);
                    populateTable(announcementsData.filter(a => a.content.toLowerCase().includes(currentSearchTerm)));
                } else {
                    alert(data.message);
                    loadingSpinner.style.display = 'none';
                }
                confirmationModal.style.display = 'none'; // Close the modal
            })
            .catch(error => {
                alert('Error deleting announcement:', error);
                loadingSpinner.style.display = 'none';
                confirmationModal.style.display = 'none'; // Close the modal
            });
        }
    });

    // Cancel deletion
    cancelBtn.addEventListener('click', () => {
        confirmationModal.style.display = 'none'; // Close the modal
    });

    // Fetch announcements on initial load
    fetchAnnouncements();

    // Set interval to refresh table every 3 seconds
    setInterval(fetchAnnouncements, 3000);

    document.getElementById('announcements-btn').addEventListener('click', function() {
        window.location.href = '../HTML/announcement.html';
    });
});
