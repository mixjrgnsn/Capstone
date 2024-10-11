document.addEventListener("DOMContentLoaded", function () {
    var saveButton = document.querySelector(".save-btn");
    var resetButton = document.querySelector(".cancel-btn");
    var loadingSpinner = document.getElementById("loadingSpinner");
    var modal = document.getElementById("modal");
    var modalMessage = document.getElementById("modal-message");
    var yesButton = document.getElementById("yes-button");
    var cancelButton = document.getElementById("cancel-button");
    var currentData = {};

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

        // Collect form data
        let firstname = document.querySelector(".firstname").value.trim().toUpperCase();
        let lastname = document.querySelector(".lastname").value.trim().toUpperCase();
        let purpose = document.querySelector(".prps-txt").value.trim();

        // Validation
        if (firstname === "" || lastname === "" || purpose === "") {
            alert("All fields are required");
            return;
        }

        // Set current data for modal
        currentData = {
            firstname: firstname,
            lastname: lastname,
            purpose: purpose
        };

        // Show the modal and set the message
        modalMessage.textContent = `Confirm the log in for ${firstname} ${lastname}`;
        modal.style.display = "block"; // Show the modal
    }

    // Function to handle the actual data submission
    function submitData() {
        // Show the loading spinner
        loadingSpinner.style.display = 'block';

        // Get current date and time
        const now = new Date();
        const currentTime = convertTimeTo12Hour(now.toTimeString().split(' ')[0]);
        const currentDate = now.toISOString().split('T')[0];

        // Prepare the data for sending
        let formData = new FormData();
        formData.append("firstname", currentData.firstname);
        formData.append("lastname", currentData.lastname);
        formData.append("purpose", currentData.purpose);
        formData.append("timein", currentTime);
        formData.append("date", currentDate);

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

                // Close the modal
                modal.style.display = 'none';
            })
            .catch(error => {
                console.error('Error:', error);
                // Hide the loading spinner
                loadingSpinner.style.display = 'none';

                // Close the modal
                modal.style.display = 'none';
            });
    }

    // Function to handle the reset button click
    function handleResetClick() {
        // Clear form fields
        document.querySelector(".firstname").value = '';
        document.querySelector(".lastname").value = '';
        document.querySelector(".prps-txt").value = '';
    }

    // Modal event listeners
    yesButton.addEventListener("click", submitData); // On "Yes", submit data
    cancelButton.addEventListener("click", function () {
        modal.style.display = "none"; // Close modal on "Cancel"
    });

    // Attach event listeners to buttons
    saveButton.addEventListener("click", handleSaveClick);
    resetButton.addEventListener("click", handleResetClick);

    // Close modal if clicked outside of it
    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
});