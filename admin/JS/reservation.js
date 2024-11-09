document.addEventListener('DOMContentLoaded', function () {
    const loadingSpinner = document.getElementById('loadingSpinner');
    let currentSearchQuery = '';

    displayReservations();
    setInterval(displayReservations, 5000);

    function displayReservations() {
        fetch('http://localhost/loginregister/database/displayReservations.php')
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
                    searchBox.addEventListener('input', function () {
                        currentSearchQuery = searchBox.value.toLowerCase();
                        displayReservations();
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
        if (row && row.NAME) {
            openActionModal(row);
        } else {
            console.error('Row data is missing or incomplete');
        }
    }

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

        acceptBtn.onclick = function () {
            loadingSpinner.style.display = 'block';
            const reservationData = {
                id: row.TAG,
                name: row.NAME,
                date: row.DATE,
                timeFrom: row['TIME FROM'],
                timeTo: row['TIME TO'],
                purpose: row.PURPOSE,
                status: 'ACCEPTED'
            };

            fetch('http://localhost/loginregister/database/acceptReservation.php', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: new URLSearchParams(reservationData)
            })
            .then(response => response.text())
            .then(text => {
                console.log(text);
                const data = JSON.parse(text);
                if (data.status === 'success') {
                    alert(data.message);
                    displayReservations();
                    loadingSpinner.style.display = 'none';
                } else {
                    alert(data.message);
                    loadingSpinner.style.display = 'none';
                }
            })
            .catch(error => {
                console.error('Error accepting reservation:', error);
                alert("An error occurred while accepting the reservation. Please try again.");
                loadingSpinner.style.display = 'none';
            });
            
            actionModal.style.display = 'none';
        };

        rejectBtn.onclick = function () {
            loadingSpinner.style.display = 'block';
            actionModal.style.display = 'none';
            deleteReservation(row.TAG);
        };
    }

    function deleteReservation(tag) {
        console.log("Deleting reservation with TAG:", tag);
        fetch('http://localhost/loginregister/database/rejectReservation.php', {
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
                alert(data.message);
                displayReservations();
                loadingSpinner.style.display = 'none';
            } else {
                alert(data.message);
                loadingSpinner.style.display = 'none';
            }
        })
        .catch(error => {
            console.error('Error deleting reservation:', error);
            alert("An error occurred while deleting the reservation. Please try again.");
            loadingSpinner.style.display = 'none';
        });
    } 

    const reservedButton = document.getElementById("reservedBtn");
    reservedButton.addEventListener("click", function () {
        window.location.href = "../HTML/reservedList.html";
    });
});