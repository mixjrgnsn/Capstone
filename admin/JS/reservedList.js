document.addEventListener('DOMContentLoaded', function() {
    function displayReservedList() {
        fetch('https://franciscohomes3.online/loginregister/database/displayReservedList.php')
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

                        tr.addEventListener('click', () => handleRowClick(row));

                        Object.values(row).forEach(value => {
                            const td = document.createElement('td');
                            td.textContent = value;
                            tr.appendChild(td);
                        });

                        bodyRow.appendChild(tr);
                    });

                    // Add search functionality
                    searchBox.addEventListener('input', function() {
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

    function handleRowClick(row) {
        if (row && row.NAME) {
            alert(`You clicked on row with Name: ${row.NAME}`);
        } else {
            console.error('Row data is missing or incomplete');
        }
    }

    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = '../HTML/reservation.html';
    });

    displayReservedList();

    setInterval(displayReservedList, 3000);
});