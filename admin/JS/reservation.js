document.addEventListener('DOMContentLoaded', function () {
    // Fetch data when the page loads
    displayReservations();
    setInterval(displayReservations, 3000);

    // Function to display reservations
    function displayReservations() {
        fetch('https://franciscohomes3.online/loginregister/database/displayReservations.php')
            .then(response => response.json())
            .then(data => {
                const headerRow = document.getElementById('header-row');
                const bodyRow = document.getElementById('body-row');
                const searchBox = document.getElementById('search-box');

                // Clear existing table content
                headerRow.innerHTML = '';
                bodyRow.innerHTML = '';

                if (data.length > 0) {
                    // Create table headers
                    const headers = Object.keys(data[0]);
                    headers.forEach(header => {
                        const th = document.createElement('th');
                        th.textContent = header;
                        headerRow.appendChild(th);
                    });

                    // Create table rows
                    data.forEach(row => {
                        const tr = document.createElement('tr');

                        // Add row click event
                        tr.addEventListener('click', () => handleRowClick(row));

                        Object.values(row).forEach(value => {
                            const td = document.createElement('td');
                            td.textContent = value;
                            tr.appendChild(td);
                        });

                        bodyRow.appendChild(tr);
                    });

                    // Add search functionality
                    searchBox.addEventListener('input', function () {
                        const query = searchBox.value.toLowerCase();
                        Array.from(bodyRow.getElementsByTagName('tr')).forEach(row => {
                            const cells = row.getElementsByTagName('td');
                            const match = Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(query));
                            row.style.display = match ? '' : 'none';
                        });
                    });
                } else {
                    // Handle case where no data is available
                    bodyRow.innerHTML = '<tr><td colspan="100%">No data available</td></tr>';
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    // Function to handle row click
    function handleRowClick(row) {
        if (row && row.NAME) {
            openActionModal(row);
        } else {
            console.error('Row data is missing or incomplete');
        }
    }

    // Function to open action modal
    function openActionModal(row) {
        const actionModal = document.getElementById('actionModal');
        const acceptBtn = document.getElementById('acceptBtn');
        const rejectBtn = document.getElementById('rejectBtn');
        const closeModal = document.querySelector('.close');

        actionModal.style.display = 'block';

        closeModal.onclick = function () {
            actionModal.style.display = 'none';
        };

        window.onclick = function (event) {
            if (event.target == actionModal) {
                actionModal.style.display = 'none';
            }
        };

        // Accept button functionality: Move the reservation to reserved list
        acceptBtn.onclick = function () {
            const reservationData = {
                id: row.TAG,
                name: row.NAME,
                date: row.DATE,
                timeFrom: row['TIME FROM'],
                timeTo: row['TIME TO'],
                purpose: row.PURPOSE,
                status: 'ACCEPTED'
            };

            // Send data to the server to accept the reservation
            fetch('https://franciscohomes3.online/loginregister/database/acceptReservation.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(reservationData)
            })
            .then(response => response.text()) // Temporarily change to .text() to see the raw output
            .then(text => {
                console.log(text); // Log the response to check if it's an HTML error page or something else
                const data = JSON.parse(text); // Then attempt to parse as JSON
                if (data.status === 'success') {
                    openConfirmationModal(data.message);
                    displayReservations(); // Refresh the table
                } else {
                    openConfirmationModal(data.message);
                }
            })
            .catch(error => {
                console.error('Error accepting reservation:', error);
                openConfirmationModal("An error occurred while accepting the reservation. Please try again.");
            });
            
            actionModal.style.display = 'none'; // Close the action modal
        };

        // Reject button functionality
        rejectBtn.onclick = function () {
            actionModal.style.display = 'none'; // Close the action modal
            deleteReservation(row.TAG); // Existing reject functionality
        };
    }

    // Function to delete reservation
    function deleteReservation(tag) {
        console.log("Deleting reservation with TAG:", tag);
        fetch('https://franciscohomes3.online/loginregister/database/rejectReservation.php', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: `id=${tag}`
        })
        .then(response => {
            console.log("Response status:", response.status);
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                openConfirmationModal(data.message);
                displayReservations(); // Refresh the table
            } else {
                openConfirmationModal(data.message);
            }
        })
        .catch(error => {
            console.error('Error deleting reservation:', error);
            openConfirmationModal("An error occurred while deleting the reservation. Please try again.");
        });
    }    

    // Function to open confirmation modal
    function openConfirmationModal(message) {
        const confirmationModal = document.getElementById('confirmationModal');
        const confirmationMessage = document.getElementById('confirmation-message');
        const okBtn = document.getElementById('okBtn');

        confirmationMessage.textContent = message;

        confirmationModal.style.display = 'block';

        okBtn.onclick = function () {
            confirmationModal.style.display = 'none';
        };

        window.onclick = function (event) {
            if (event.target == confirmationModal) {
                confirmationModal.style.display = 'none';
            }
        };
    }

    // Reserved button functionality
    const reservedButton = document.getElementById("reservedBtn");
    reservedButton.addEventListener("click", function () {
        window.location.href = "../HTML/reservedlist.html"; // Redirect to reservedlist.html
    });
});