document.addEventListener('DOMContentLoaded', function() {
    let currentSearchQuery = '';

    function displaylogbook2() {
        fetch('https://franciscohomes3.online/loginregister/database/displayLogbook2.php')
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

                    const filteredData = data.filter(row => {
                        return Object.values(row).some(value =>
                            value.toString().toLowerCase().includes(currentSearchQuery)
                        );
                    });

                    filteredData.forEach(row => {
                        const tr = document.createElement('tr');
                        tr.addEventListener('click', () => handleRowClick(row));

                        Object.values(row).forEach(value => {
                            const td = document.createElement('td');
                            td.textContent = value;
                            tr.appendChild(td);
                        });

                        bodyRow.appendChild(tr);
                    });

                    searchBox.value = currentSearchQuery;
                    searchBox.addEventListener('input', function() {
                        currentSearchQuery = searchBox.value.toLowerCase();
                        displaylogbook2();
                    });
                } else {
                    bodyRow.innerHTML = '<tr><td colspan="100%">No data available</td></tr>';
                }
            })
            .catch(error => {
                console.error('Error fetching data:', error);
            });
    }

    function handleRowClick(row) {
        if (row && row.FIRSTNAME && row.LASTNAME) {
            // Action on row click can be here
        }
    }

    document.getElementById('visitorRecord').addEventListener('click', function() {
        window.location.href = 'visitorRecord.html';
    });

    displaylogbook2();
    setInterval(displaylogbook2, 3000);
});
