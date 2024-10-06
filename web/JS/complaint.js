document.querySelector(".btn-click").addEventListener("click", function(event) {

    if (this.textContent === "Cancel") {

        const confirmCancel = confirm("Are you sure you want to cancel and go back to the home page?");
        
        if (confirmCancel) {
            window.location.href = "home.html";
        }
    }
});