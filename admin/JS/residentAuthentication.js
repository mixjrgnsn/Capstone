document.addEventListener('DOMContentLoaded', function() {
    function displayUsers() {
        fetch('https://franciscohomes3.online/loginregister/database/displayUsers.php')
            .then(response => response.json())
            .then(data => {
                const headerRow = document.getElementById('header-row');
                const bodyRow = document.getElementById('body-row');
                const searchBox = document.getElementById('search-box');

                // Clear existing rows
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
                        tr.addEventListener('click', () => handleRowClick(row, tr));

                        headers.forEach(header => {
                            const td = document.createElement('td');
                            td.textContent = header === 'PASSWORD' ? '*****' : row[header];
                            tr.appendChild(td);
                        });

                        bodyRow.appendChild(tr);
                    });

                    searchBox.addEventListener('input', function() {
                        const query = searchBox.value.toLowerCase();
                        Array.from(bodyRow.getElementsByTagName('tr')).forEach(row => {
                            const cells = row.getElementsByTagName('td');
                            const match = Array.from(cells).some(cell => 
                                cell.textContent.toLowerCase().includes(query)
                            );
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

    // Fetch data when the page loads
    displayUsers();
});
