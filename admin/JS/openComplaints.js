document.addEventListener('DOMContentLoaded', function() {
    // Function to get the query parameter value by its name
    function getQueryParameter(name) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    }

    // Function to fetch and display subject details based on the id
    function getSubjectDetailsComplaints(id) {
        if (!id) {
            document.getElementById('subject-details').innerText = 'No subject selected';
            return;
        }

        // Fetch data from the server using the provided id
        fetch(`http://localhost/loginregister/database/getSubjectDetailsComplaints.php?id=${encodeURIComponent(id)}`)
            .then(response => response.json())
            .then(data => {
                const detailsContainer = document.getElementById('subject-details');
                
                if (data && data.length > 0) {
                    const subject = data[0];
                    detailsContainer.innerHTML = `
                    <h5><strong>Name:</strong> ${subject.NAME} </h5>
                    <h5><strong>Date:</strong> ${subject.DATE}</h5>
                    </br>
                    <p>${subject.SUBJECT}</p>`;
                } else {
                    detailsContainer.innerText = 'No details available for this subject.';
                }
            })
            .catch(error => {
                console.error('Error fetching subject details:', error);
                document.getElementById('subject-details').innerText = 'Error fetching details';
            });
    }

    // Fetch subject details based on the query parameter
    const id = getQueryParameter('id');
    getSubjectDetailsComplaints(id);

    document.getElementById('Btn').addEventListener('click', function() {
        alert('Button clicked!'); // Placeholder for the actual action
        // Add logic here to handle the button click, such as marking the complaint as read
    });
});