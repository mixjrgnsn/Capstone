document.querySelector(".btn-click").addEventListener("click", function(event) {
    // Check if the button clicked is the "Cancel" button
    if (this.textContent === "Cancel") {
        // Show a confirmation dialog
        const confirmCancel = confirm("Are you sure you want to cancel and go back to the home page?");
        
        // If the user confirms, redirect to home.html
        if (confirmCancel) {
            window.location.href = "home.html";
        }
    }
});