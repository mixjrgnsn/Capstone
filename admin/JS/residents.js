document.addEventListener('DOMContentLoaded', function() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    let currentSearchQuery = '';

    function displayUsers() {
        fetch('https://franciscohomes3.online/loginregister/database/displayUsers.php')
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
                        tr.addEventListener('click', () => handleRowClick(row, tr));

                        headers.forEach(header => {
                            const td = document.createElement('td');
                            td.textContent = header === 'PASSWORD' ? '*****' : row[header];
                            tr.appendChild(td);
                        });

                        bodyRow.appendChild(tr);
                    });

                    searchBox.value = currentSearchQuery;
                    searchBox.addEventListener('input', function() {
                        currentSearchQuery = searchBox.value.toLowerCase();
                        displayUsers();
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

    function handleRowClick(row, trElement) {
        if (row && row.ID && row.FIRSTNAME && row.LASTNAME) {
            const message = `Do you want to remove ${row.FIRSTNAME} ${row.LASTNAME}?`;
            document.getElementById('modal-message').textContent = message;
            document.getElementById('modal').style.display = 'block';
            currentRowData = { ...row, trElement };
        } else {
            console.error('Row data is missing or incomplete');
        }
    }

    document.getElementById('yes-button').addEventListener('click', () => {
        loadingSpinner.style.display = 'block';
        const row = currentRowData;

        const formData = new URLSearchParams({
            id: row.ID,
            firstname: row.FIRSTNAME,
            lastname: row.LASTNAME,
            email: row.EMAIL,
            password: row.PASSWORD,
            address: row.ADDRESS
        });

        fetch('https://franciscohomes3.online/loginregister/database/accArchive.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formData.toString()
        })
        .then(response => response.json())
        .then(result => {
            if (result.status === 'success') {
                alert(result.message);
                loadingSpinner.style.display = 'none';
                displayUsers();
            } else {
                alert(result.message);
                loadingSpinner.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('There was an error processing the deletion.');
            loadingSpinner.style.display = 'none';
        });

        document.getElementById('modal').style.display = 'none';
    });

    document.getElementById('cancel-button').addEventListener('click', () => {
        document.getElementById('modal').style.display = 'none';
    });

    window.onclick = function(event) {
        const modal = document.getElementById('modal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    const logoutButton = document.getElementById('btn-logout');
    if (logoutButton) {
        logoutButton.addEventListener('click', function() {
            localStorage.removeItem('isLoggedIn');
            window.location.href = '../HTML/login.html';
        });
    }

    displayUsers();
    
    setInterval(displayUsers, 3000);
});

document.getElementById('accApprovalbtn').addEventListener('click', function() {
    window.location.href = '../HTML/approval.html';
});

document.getElementById('accArchivebtn').addEventListener('click', function() {
    window.location.href = '../HTML/archive.html';
});
