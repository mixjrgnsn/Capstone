document.addEventListener('DOMContentLoaded', function() {
    function displayVisitorRecord() {
        fetch('http://localhost/loginregister/database/displayVisitorRecord.php')
            .then(response => response.json())
            .then(data => {
                const headerRow = document.getElementById('header-row');
                const bodyRow = document.getElementById('body-row');    
                const searchBox = document.getElementById('search-box');

                headerRow.innerHTML = '';
                bodyRow.innerHTML = '';

                if (data.length > 0) {
                    const headers = Object.keys(data[0]);
                    headers.forEach(header => {
                        const th = document.createElement('th');
                        th.textContent = header;
                        headerRow.appendChild(th);
                    });

                    data.forEach(row => {
                        const tr = document.createElement('tr');
                        tr.addEventListener('click', () => handleRowClick(row));

                        Object.values(row).forEach(value => {
                            const td = document.createElement('td');
                            td.textContent = value;
                            tr.appendChild(td);
                        });

                        bodyRow.appendChild(tr);
                    });

                    searchBox.addEventListener('input', function() {
                        const query = searchBox.value.toLowerCase();
                        Array.from(bodyRow.getElementsByTagName('tr')).forEach(row => {
                            const cells = row.getElementsByTagName('td');
                            const match = Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(query));
                            row.style.display = match ? '' : 'none';
                        });
                    });

                } else {
                    bodyRow.innerHTML = '<tr><td colspan="100%">No data available</td></tr>';
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    let currentRowData;

    function handleRowClick(row) {
        if (row && row.FIRSTNAME && row.LASTNAME) {
            const message = `Do you want to record the timeout for ${row.FIRSTNAME} ${row.LASTNAME}?`;
            document.getElementById('modal-message').textContent = message;
            document.getElementById('modal').style.display = 'block';
            currentRowData = row; // Save current row data for further actions
        } else {
            console.error('Row data is missing or incomplete');
        }
    }

    function storeLogbook() {
        const data = {
            firstname: currentRowData.FIRSTNAME,
            lastname: currentRowData.LASTNAME,
            purpose: currentRowData.PURPOSE,
            timein: currentRowData['TIME IN'],
            date: currentRowData.DATE,
            timeout: formatCurrentTime() // Use the updated format
        };
    
        fetch('http://localhost/loginregister/database/storeLogbook.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                showAlert(`Timeout for ${currentRowData.FIRSTNAME} ${currentRowData.LASTNAME} has been recorded.`);
                displayVisitorRecord(); 
            } else {
                showAlert('Error: ' + result.message);
                console.error('Server error:', result.message);
            }
        })
        .catch(error => {
            console.error('Error storing timeout:', error);
        });
    }
    
    
    
    // Helper function to format current time
    function formatCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12; // Convert to 12-hour format
        hours = hours ? hours : 12; // Hour '0' should be '12'
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes; // Add leading zero if needed
    
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0'); // Month is 0-based
        const day = String(now.getDate()).padStart(2, '0'); // Add leading zero if needed
    
        return `${hours}:${formattedMinutes} ${ampm} ${year}-${month}-${day}`; // Return formatted time
    }

    function showAlert(message) {
        document.getElementById('modal-message').textContent = message;
        document.getElementById('modal').style.display = 'block';
        document.getElementById('yes-button').style.display = 'none'; // Hide Yes button for simple alerts
        document.getElementById('cancel-button').textContent = 'Close'; // Change Cancel button text
    }
    
    
    // Modal Yes button action
    document.getElementById('yes-button').addEventListener('click', () => {
        storeLogbook(); // Store the timeout when the user confirms
        document.getElementById('modal').style.display = 'none'; // Hide modal
    });

    // Modal Cancel button action
    document.getElementById('cancel-button').addEventListener('click', () => {
        document.getElementById('modal').style.display = 'none'; // Hide modal
    });

    // Close modal when clicking on the close button
    document.querySelector('.close').addEventListener('click', () => {
        document.getElementById('modal').style.display = 'none';
    });

    // Close modal when clicking outside of it
    window.onclick = function(event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    // Navigation to logbook page
    document.getElementById('logbook').addEventListener('click', function() {
        window.location.href = 'logbook.html';
    });

    displayVisitorRecord();
});
