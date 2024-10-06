document.addEventListener("DOMContentLoaded", function() {
    var saveButton = document.querySelector(".save-btn");
    var resetButton = document.querySelector(".cancel-btn");
    var loadingSpinner = document.getElementById("loadingSpinner");

    // Function to convert time from 24-hour to 12-hour format
    function convertTimeTo12Hour(time24) {
        const [hours, minutes] = time24.split(':');
        const period = hours >= 12 ? 'PM' : 'AM';
        const hour12 = hours % 12 || 12;
        return `${hour12}:${minutes} ${period}`;
    }

    // Function to handle the save button click
    function handleSaveClick(event) {
        event.preventDefault(); // Prevent default form submission

        // Show the loading spinner
        loadingSpinner.style.display = 'block';

        // Collect form data
        let firstname = document.querySelector(".firstname").value.trim().toUpperCase();
        let lastname = document.querySelector(".lastname").value.trim().toUpperCase();
        let purpose = document.querySelector(".prps-txt").value.trim();

        // Get current date and time
        const now = new Date();
        const currentTime = convertTimeTo12Hour(now.toTimeString().split(' ')[0]); // Get the current time in 12-hour format
        const currentDate = now.toISOString().split('T')[0]; // Get the current date in YYYY-MM-DD format

        // Validation
        if (firstname === "" || lastname === "" || purpose === "") {
            alert("All fields are required");
            // Hide the loading spinner
            loadingSpinner.style.display = 'none';
            return;
        }

        // Prepare the data for sending
        let formData = new FormData();
        formData.append("firstname", firstname);
        formData.append("lastname", lastname);
        formData.append("purpose", purpose);
        formData.append("timein", currentTime); // Use current time
        formData.append("date", currentDate); // Use current date

        // Send the data to the PHP script
        fetch('http://localhost/loginregister/database/visitorlogin.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log("Server Response:", data); // Log the server response
            alert(data);

            // Clear form fields after successful save
            document.querySelector(".firstname").value = '';
            document.querySelector(".lastname").value = '';
            document.querySelector(".prps-txt").value = '';

            // Hide the loading spinner
            loadingSpinner.style.display = 'none';
        })
        .catch(error => {
            console.error('Error:', error);
            // Hide the loading spinner
            loadingSpinner.style.display = 'none';
        });
    }

    // Function to handle the reset button click
    function handleResetClick() {
        // Clear form fields
        document.querySelector(".firstname").value = '';
        document.querySelector(".lastname").value = '';
        document.querySelector(".prps-txt").value = '';
    }

    // Attach event listeners to buttons
    saveButton.addEventListener("click", handleSaveClick);
    resetButton.addEventListener("click", handleResetClick);
});
