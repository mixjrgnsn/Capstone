document.getElementById("submit-btn").addEventListener("click", function() {
    // Retrieve user data
    const userData = JSON.parse(localStorage.getItem('userData'));
    const name = `${userData.firstname} ${userData.lastname}`;

    // Get input values
    const date = document.getElementById("reservation-date").value;
    let timeFrom = document.getElementById("time-from").value;
    let timeTo = document.getElementById("time-to").value;
    const purpose = document.getElementById("purpose").value;

    // Validate input
    if (!date || !timeFrom || !timeTo || !purpose) {
        alert("All fields are required");
        return;
    }

    // Validate date is today or within one week
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set time to midnight for comparison
    const selectedDate = new Date(date);
    const oneWeekFromNow = new Date(today);
    oneWeekFromNow.setDate(today.getDate() + 7);

    if (selectedDate < today || selectedDate > oneWeekFromNow) {
        alert("Reservations can only be made for today or within the next 7 days.");
        return;
    }

    function convertTo12HourFormat(time) {
        let hours = parseInt(time.split(':')[0]);
        let minutes = time.split(':')[1];
        let am_pm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12 || 12;
        return { time: `${hours}:${minutes}`, am_pm: am_pm };
    }

    const timeFromConverted = convertTo12HourFormat(timeFrom);
    const timeToConverted = convertTo12HourFormat(timeTo);

    // Extract time and AM/PM values
    timeFrom = timeFromConverted.time;
    const am_pm_from = timeFromConverted.am_pm;
    timeTo = timeToConverted.time;
    const am_pm_to = timeToConverted.am_pm;

    // Show confirmation modal
    document.getElementById("modal-message").innerText = "Are you sure you want to submit your reservation?";
    document.getElementById("customModal").style.display = "block";

    // Set up confirmation button
    document.getElementById("confirm-button").onclick = function() {
        // Create form data to submit
        const formData = new FormData();
        formData.append('name', name);
        formData.append('date', date);
        formData.append('timeFrom', timeFrom);
        formData.append('am_pm_from', am_pm_from);
        formData.append('timeTo', timeTo);
        formData.append('am_pm_to', am_pm_to);
        formData.append('purpose', purpose);

        // Show loading spinner
        document.getElementById("loadingSpinner").style.display = "block";

        // Send data to PHP
        fetch('https://franciscohomes3.online/loginregister/database/reservations.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            document.getElementById("loadingSpinner").style.display = "none";
            alert(data);
            document.getElementById('purpose').value = '';
            if (data === "Reservation Submitted") {
                window.location.href = "home.html"; // Redirect only if successful
            }
        })
        .catch(error => {
            console.error('Error:', error);
            document.getElementById("loadingSpinner").style.display = "none";
        });

        // Hide confirmation modal
        document.getElementById("customModal").style.display = "none";
    };

    // Set up cancel button
    document.getElementById("cancel-button").onclick = function() {
        document.getElementById("customModal").style.display = "none"; // Close modal
    };
});
