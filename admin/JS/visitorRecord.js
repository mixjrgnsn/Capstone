document.addEventListener('DOMContentLoaded', function() {
    var loadingSpinner = document.getElementById("loadingSpinner");
    let currentSearchQuery = '';

    function displayVisitorRecord() {
        fetch('https://franciscohomes3.online/loginregister/database/displayVisitorRecord.php')
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
                        displayVisitorRecord();
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
            document.getElementById('modal-message2').textContent = message;
            document.getElementById('modal2').style.display = 'block';
            currentRowData = row;
        } else {
            console.error('Row data is missing or incomplete');
        }
    }

    function storeLogbook() {
        const data = {
            timeout: formatCurrentTime(),
            id: currentRowData.TAG // Change TAG to ID
        };
    
        console.log("Data being sent:", data);
        
        fetch('https://franciscohomes3.online/loginregister/database/storeLogbook.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                alert(`Timeout for ${currentRowData.FIRSTNAME} ${currentRowData.LASTNAME} has been recorded.`);
                displayVisitorRecord();
                loadingSpinner.style.display = 'none';
            } else {
                alert('Error: ' + result.message);
                console.error('Server error:', result.message);
                loadingSpinner.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error storing timeout:', error);
            loadingSpinner.style.display = 'none';
        });
    }
    
    
    function formatCurrentTime() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const formattedMinutes = minutes < 10 ? '0' + minutes : minutes;
    
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
    
        return `${hours}:${formattedMinutes} ${ampm} ${year}-${month}-${day}`;
    } 

    document.getElementById('yes-button2').addEventListener('click', () => {
        loadingSpinner.style.display = 'block';
        storeLogbook();
        document.getElementById('modal2').style.display = 'none';
    });

    document.getElementById('cancel-button2').addEventListener('click', () => {
        document.getElementById('modal2').style.display = 'none';
    });

    window.onclick = function(event) {
        const modal = document.getElementById('modal2');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };
    displayVisitorRecord();
    setInterval(displayVisitorRecord, 5000);
});
