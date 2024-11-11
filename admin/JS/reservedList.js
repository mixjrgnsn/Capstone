document.addEventListener('DOMContentLoaded', function() {
    const loadingSpinner = document.getElementById('loadingSpinner');
    const statusFilter = document.getElementById('status-filter');
    const modal = document.getElementById('statusModal');
    const modalMessage = document.getElementById('modalMessage');
    const confirmBtn = document.getElementById('confirmBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    let selectedRowId = null;

    // Load saved status filter
    const savedStatus = localStorage.getItem('selectedStatus');
    if (savedStatus) {
        statusFilter.value = savedStatus;
    }

    function displayReservedList() {
        fetch('https://franciscohomes3.online/loginregister/database/displayReservedList.php')
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
    
                    const sortedData = data.sort((a, b) => (a.STATUS === 'COMPLETED' ? 1 : 0) - (b.STATUS === 'COMPLETED' ? 1 : 0));
                    sortedData.forEach(row => {
                        const tr = document.createElement('tr');
                        tr.dataset.status = row.STATUS;
                        tr.dataset.id = row.id;
    
                        tr.addEventListener('click', () => openModal(row));
                        Object.values(row).forEach((value, index) => {
                            const td = document.createElement('td');
                            td.textContent = value;
    
                            // Change background color based on STATUS
                            if (index === headers.indexOf('STATUS')) {
                                if (row.STATUS === 'ACCEPTED') {
                                    td.style.color = 'blue'
                                } else if (row.STATUS === 'COMPLETED') {
                                    td.style.color = 'green'
                                }
                            }
    
                            tr.appendChild(td);
                        });
    
                        bodyRow.appendChild(tr);
                    });
    
                    searchBox.addEventListener('input', filterTable);
                    statusFilter.addEventListener('change', filterTable);
    
                    function filterTable() {
                        const query = searchBox.value.toLowerCase();
                        const selectedStatus = statusFilter.value;
                        localStorage.setItem('selectedStatus', selectedStatus);
    
                        Array.from(bodyRow.getElementsByTagName('tr')).forEach(row => {
                            const cells = row.getElementsByTagName('td');
                            const matchSearch = Array.from(cells).some(cell => cell.textContent.toLowerCase().includes(query));
                            const matchStatus = selectedStatus === '' || row.dataset.status === selectedStatus;
                            row.style.display = matchSearch && matchStatus ? '' : 'none';
                        });
                    }
                    filterTable();
                } else {
                    bodyRow.innerHTML = '<tr><td colspan="100%">No data available</td></tr>';
                }
            })
            .catch(error => console.error('Error fetching data:', error));
    }
    
    
    function openModal(row) {
        selectedRowId = row.TAG;
        if(row.STATUS == "ACCEPTED"){
            modalMessage.textContent = `Change status of ${row.NAME} to COMPLETED?`;
            modal.style.display = 'block';
        } else{
            console.log("already completed")
        }
    }

    function updateStatus(id) {
        fetch('https://franciscohomes3.online/loginregister/database/update_status.php?id=' + id, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            }
        })
        .then(response => response.text())
        .then(message => {
            alert(message);
            loadingSpinner.style.display = 'none';
            displayReservedList();
        })
        .catch(error => console.error('Error updating status:', error));
    }

    confirmBtn.addEventListener('click', () => {
        loadingSpinner.style.display = 'block';
        if (selectedRowId) {
            updateStatus(selectedRowId);
            modal.style.display = 'none';
        }
    });

    cancelBtn.addEventListener('click', () => {
        modal.style.display = 'none';
    });
    window.onclick = function(event) {
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    };

    document.getElementById('backBtn').addEventListener('click', function() {
        window.location.href = '../HTML/reservation.html';
    });

    displayReservedList();
    setInterval(displayReservedList, 3000);
});