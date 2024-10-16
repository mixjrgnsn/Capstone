document.addEventListener('DOMContentLoaded', function() {
    const statusFilter = document.getElementById('status-filter');

    // Load saved filter from localStorage
    const savedFilter = localStorage.getItem('reportsStatusFilter');
    if (savedFilter) {
        statusFilter.value = savedFilter;
    }

    const statusOrder = ['UNREAD', 'READ']; // Define the status order

    function displayReports() {
        fetch('http://localhost/loginregister/database/displayReports.php')
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

                    // Sort the data based on status order
                    data.sort((a, b) => statusOrder.indexOf(a.STATUS) - statusOrder.indexOf(b.STATUS));

                    // Create table rows
                    data.forEach(row => {
                        const tr = document.createElement('tr');
                        tr.dataset.status = row.STATUS;

                        tr.addEventListener('click', () => handleRowClick(row));

                        headers.forEach(header => {
                            const td = document.createElement('td');
                            td.textContent = row[header];

                            // Change font color for "STATUS" column
                            if (header === 'STATUS') {
                                td.style.color = getStatusColor(row[header]);
                            }

                            tr.appendChild(td);
                        });

                        bodyRow.appendChild(tr);
                    });

                    // Event listeners for search and status filtering
                    setupFilters(searchBox, bodyRow);
                    
                    // Apply filter on initial load
                    filterTable(searchBox, bodyRow);
                } else {
                    bodyRow.innerHTML = '<tr><td colspan="100%">No data available</td></tr>';
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    function getStatusColor(status) {
        switch (status) {
            case 'UNREAD':
                return 'red';
            case 'READ':
                return 'green';
            default:
                return 'black';
        }
    }

    function setupFilters(searchBox, bodyRow) {
        searchBox.addEventListener('input', () => filterTable(searchBox, bodyRow));
        statusFilter.addEventListener('change', () => filterTable(searchBox, bodyRow));

        // Initial filter application
        filterTable(searchBox, bodyRow);
    }

    function filterTable(searchBox, bodyRow) {
        const query = searchBox.value.toLowerCase();
        const selectedStatus = statusFilter.value;

        // Save selected status to localStorage
        localStorage.setItem('reportsStatusFilter', selectedStatus);

        Array.from(bodyRow.getElementsByTagName('tr')).forEach(row => {
            const cells = row.getElementsByTagName('td');
            const matchQuery = Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(query));
            const matchStatus = !selectedStatus || row.dataset.status === selectedStatus;

            row.style.display = matchQuery && matchStatus ? '' : 'none';
        });
    }

    function handleRowClick(row) {
        if (row && row.TAG) {
            window.location.href = `../HTML/openReports.html?id=${encodeURIComponent(row.TAG)}`;
        } else {
            console.error('Row data is missing or incomplete');
        }
    }

    // Fetch data when the page loads
    displayReports();

    // Set an interval to refresh the data every 3 seconds (3000 milliseconds)
    setInterval(displayReports, 3000);
});
