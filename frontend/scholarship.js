document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    const scholarshipName = urlParams.get('id');

    function fetchScholarshipDetails() {
        fetch('/api/scholarships')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const scholarship = data.find(item => item['Scholarship name'] === scholarshipName);
                if (scholarship) {
                    displayScholarshipDetails(scholarship);
                } else {
                    document.querySelector('.scholarship-details').innerHTML = `<p>Scholarship details not found.</p>`;
                }
            })
            .catch(error => console.error('Error fetching scholarship details:', error));
    }

    function displayScholarshipDetails(scholarship) {
        document.getElementById('scholarship-name').innerText = scholarship['Scholarship name'];
        document.getElementById('about-text').innerText = scholarship['about'];
        document.getElementById('about-desc').innerText = scholarship['Description'];
        document.getElementById('applicable-text').innerText = scholarship['Applicable For'];
        document.getElementById('application-record-text').innerText = scholarship['Application record'];
        
        // Make official website clickable
        const officialWebsite = scholarship['Official Website'];
        document.getElementById('official-website-text').innerHTML = `<a href="${officialWebsite}" target="_blank" rel="noopener noreferrer">${officialWebsite}</a>`;
        
        document.getElementById('steps-text').innerText = scholarship['Steps'];
        document.getElementById('documents-text').innerText = scholarship['Documents'];
        document.getElementById('remarks-text').innerText = scholarship['Remark'];
    
        // Make email clickable
        const email = scholarship['email'];
        document.getElementById('email-text').innerHTML = `<a href="mailto:${email}">${email}</a>`;
        
        // Make contact clickable
        const contact = scholarship['contact'];
        document.getElementById('contact-text').innerHTML = `<a href="tel:+${contact}">+${contact}</a>`;
    
        const videoUrl = scholarship['Video link'];
        if (videoUrl && videoUrl !== 'NA') {
            const videoId = extractVideoId(videoUrl);
            if (videoId) {
                document.getElementById('video-link').src = `https://www.youtube.com/embed/${videoId}`; // Set the video link directly to the iframe
            } else {
                document.getElementById('video-section').style.display = 'none';
            }
        } else {
            document.getElementById('video-section').style.display = 'none';
        }
    
        document.getElementById('address-text').innerText = scholarship['Address'];
    }
    

    function extractVideoId(url) {
        const regex = /(?:https?:\/\/)?(?:www\.)?youtube\.com\/watch\?v=([^&]+)|youtu\.be\/([^&]+)/;
        const match = url.match(regex);
        return match ? (match[1] || match[2]) : null;
    }

    fetchScholarshipDetails();
});
