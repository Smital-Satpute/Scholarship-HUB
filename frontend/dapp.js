document.addEventListener("DOMContentLoaded", function () {
    const scholarshipContainer = document.querySelector('.scholarship-container');
    const searchInput = document.getElementById('srch'); // Assuming your input has this ID
    let allScholarships = []; // Array to hold all scholarships for searching

    // Function to fetch scholarship data from the server
    function fetchScholarships() {
        fetch('/api/scholarships')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                allScholarships = data; // Store all scholarships
                const scholarships = data.sort(() => 0.5 - Math.random()).slice(0, 10);
                displayScholarships(scholarships);
            })
            .catch(error => console.error('Error fetching scholarships:', error));
    }

    // Function to display scholarships in the container
    function displayScholarships(scholarships) {
        scholarshipContainer.innerHTML = ''; // Clear existing content

        scholarships.forEach(scholarship => {
            const box = document.createElement('div');
            box.className = 'scholarship-box';
            box.onclick = function () {
                // Redirect to the detailed scholarship page
                location.href = `scholarship.html?id=${encodeURIComponent(scholarship['Scholarship name'])}`; 
            };
            box.innerHTML = `
                <h2>${scholarship['Scholarship name']}</h2>
                <p>${scholarship['about']}</p>
            `;
            scholarshipContainer.appendChild(box);
        });
    }

    // Function to display search results
    function displaySearchResults(keyword) {
        scholarshipContainer.innerHTML = ''; // Clear existing content
        const filteredScholarships = allScholarships.filter(scholarship => {
            const scholarshipName = scholarship['Scholarship name'] || ""; // Default to empty string if undefined
            const scholarshipAbout = scholarship['about'] || ""; // Default to empty string if undefined
            return scholarshipName.toLowerCase().includes(keyword.toLowerCase()) ||
                   scholarshipAbout.toLowerCase().includes(keyword.toLowerCase());
        });

        if (filteredScholarships.length > 0) {
            filteredScholarships.forEach(scholarship => {
                const box = document.createElement('div');
                box.className = 'scholarship-box';
                box.onclick = function () {
                    // Redirect to the detailed scholarship page
                    location.href = `scholarship.html?id=${encodeURIComponent(scholarship['Scholarship name'])}`; 
                };
                box.innerHTML = `
                    <h2>${scholarship['Scholarship name']}</h2>
                    <p>${scholarship['about']}</p>
                `;
                scholarshipContainer.appendChild(box);
            });
        } else {
            const noResultsBox = document.createElement('div');
            noResultsBox.className = 'scholarship-box';
            noResultsBox.innerHTML = `<p>No scholarships found for "${keyword}".</p>`;
            scholarshipContainer.appendChild(noResultsBox);
        }
    }

    // Event listener for the search input
    searchInput.addEventListener('input', function(event) {
        const searchTerm = searchInput.value.trim();
        if (searchTerm) {
            displaySearchResults(searchTerm); // Display search results
        } else {
            fetchScholarships(); // Fetch and display random scholarships if search is empty
        }
    });

    // Call the function to fetch scholarships
    fetchScholarships();
});
