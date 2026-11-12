document.addEventListener("DOMContentLoaded", async () => {
    // 1. Select the exact container ID from your HTML
    const jobsContainer = document.getElementById("jobsContainer");

    if (!jobsContainer) {
        console.error("Error: Could not find 'jobsContainer' in the HTML.");
        return;
    }

    // 2. Get the logged-in recruiter's company from LocalStorage
    const recruiterCompany = localStorage.getItem("recruiterCompany");

    if (!recruiterCompany) {
        jobsContainer.innerHTML = "<p style='color: red;'>You must be logged in to view your posted jobs.</p>";
        // Optional: Redirect them if they aren't logged in
        // window.location.href = "recruiter_registration.html";
        return;
    }

    // Show a loading message
    jobsContainer.innerHTML = "<p>Loading your posted jobs...</p>";

    try {
        // 3. Fetch ALL jobs from the Render backend
        const response = await fetch("https://campus-hire-api-yiju.onrender.com/api/vacancies/all");

        if (!response.ok) {
            throw new Error("Failed to fetch jobs from the server.");
        }

        const allJobs = await response.json();

        // 4. FILTER: Only keep the jobs that match this recruiter's company name
        const myJobs = allJobs.filter(job => job.companyName === recruiterCompany);

        // Clear the loading message
        jobsContainer.innerHTML = "";

        // 5. Check if they have posted any jobs yet
        if (myJobs.length === 0) {
            jobsContainer.innerHTML = `
                <div class="empty-state">
                    <p>You haven't posted any job vacancies yet.</p>
                    <a href="create_vacancy.html" class="create-btn">Create a Vacancy Now</a>
                </div>
            `;
            return;
        }

        // 6. Loop through their specific jobs and display them
        myJobs.forEach(job => {
            const jobCard = document.createElement("div");
            jobCard.className = "job-card"; // Class for CSS styling

            jobCard.innerHTML = `
                <div class="job-header">
                    <h3>${job.jobTitle}</h3>
                    <span class="location-badge">${job.location}</span>
                </div>
                
                <div class="job-highlights">
                    <p><strong>Package:</strong> ${job.packageLpa ? job.packageLpa + ' LPA' : 'Not specified'}</p>
                    <p><strong>Min CGPA:</strong> ${job.cgpa ? job.cgpa : 'Not specified'}</p>
                    <p><strong>Deadline:</strong> ${job.deadline ? job.deadline : 'Not specified'}</p>
                </div>

                <div class="job-details">
                    <p><strong>Required Skills:</strong> ${job.skills ? job.skills : 'Not specified'}</p>
                </div>
                
                <button class="view-applicants-btn" onclick="window.location.href='view_applicants.html'">
                    View Applicants
                </button>
            `;

            jobsContainer.appendChild(jobCard);
        });

    } catch (error) {
        console.error("Error fetching jobs:", error);
        jobsContainer.innerHTML = "<p style='color: red;'>Could not load your jobs. Please ensure your Render backend is running.</p>";
    }
});