const form = document.getElementById('loginForm');

    form.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the default form submission

        const formData = new FormData(form);

        fetch(form.action, {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            alert(data); // Show success or error message
            if (!data.includes('Duplicate')) { // If it's not a duplicate
                window.location.href = 'dashboard.html'; // Redirect to dashboard.html
            }
        })
        .catch(error => console.error('Error:', error));
    });

    