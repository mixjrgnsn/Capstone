document.addEventListener("DOMContentLoaded", function () {
    var saveButton = document.querySelector(".save-btn");
    var loadingSpinner = document.getElementById("loadingSpinner");
    var modal = document.getElementById("modal");
    var modalMessage = document.getElementById("modal-message");
    var yesButton = document.getElementById("yes-button");
    var cancelButton = document.getElementById("cancel-button");
    var currentData = {};

    function convertTimeTo12Hour(time24) {
        const [hours, minutes] = time24.split(':');
        const period = hours >= 12 ? 'PM' : 'AM';
        const hour12 = hours % 12 || 12;
        return `${hour12}:${minutes} ${period}`;
    }

    function handleSaveClick(event) {
        event.preventDefault();

        let firstname = document.querySelector(".firstname").value.trim().toUpperCase();
        let lastname = document.querySelector(".lastname").value.trim().toUpperCase();
        let purpose = document.querySelector(".prps-txt").value.trim();

        if (firstname === "" || lastname === "" || purpose === "") {
            alert("All fields are required");
            return;
        }

        currentData = {
            firstname: firstname,
            lastname: lastname,
            purpose: purpose
        };

        modalMessage.textContent = `Confirm the log in for ${firstname} ${lastname}`;
        modal.style.display = "block";
    }

    function submitData() {
        modal.style.display = 'none';
        loadingSpinner.style.display = 'block';

        const now = new Date();
        const currentTime = convertTimeTo12Hour(now.toTimeString().split(' ')[0]);
        const currentDate = now.toISOString().split('T')[0];


        let formData = new FormData();
        formData.append("firstname", currentData.firstname);
        formData.append("lastname", currentData.lastname);
        formData.append("purpose", currentData.purpose);
        formData.append("timein", currentTime);
        formData.append("date", currentDate);

        fetch('https://franciscohomes3.online/loginregister/database/visitorlogin.php', {
            method: 'POST',
            body: formData
        })
            .then(response => response.text())
            .then(data => {
                console.log("Server Response:", data);
                alert(data);
                document.querySelector(".firstname").value = '';
                document.querySelector(".lastname").value = '';
                document.querySelector(".prps-txt").value = '';
                loadingSpinner.style.display = 'none';
                modal.style.display = 'none';
            })
            .catch(error => {
                alert(error);
                console.error('Error:', error);
                loadingSpinner.style.display = 'none';
                modal.style.display = 'none';
            });
    }

    yesButton.addEventListener("click", submitData);
    cancelButton.addEventListener("click", function () {
        modal.style.display = "none";
    });

    saveButton.addEventListener("click", handleSaveClick);

    window.onclick = function (event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    };
});