document.addEventListener("DOMContentLoaded", async () => {
    // 1. Select the container where the applied jobs will be displayed
    // IMPORTANT: Ensure you have <div id="applications-container"></div> in your applications.html
    const applicationsContainer = document.getElementById("applications-container");

    if (!applicationsContainer) {
        console.error("Error: Could not find an element with id 'applications-container'.");
        return;
    }

    // 2. Get the logged-in student's email from LocalStorage
    const studentEmail = localStorage.getItem("userEmail");

    if (!studentEmail) {
        applicationsContainer.innerHTML = "<p style='color: red;'>You must be logged in to view your applications.</p>";
        return;
    }

    applicationsContainer.innerHTML = "<p>Loading your applications...</p>";

    try {
        // 3. Fetch the student's personal applications
        const appsResponse = await fetch(`http://localhost:8080/api/applications/student/${studentEmail}`);
        if (!appsResponse.ok) throw new Error("Failed to fetch applications.");
        const applications = await appsResponse.json();

        // 4. Fetch all vacancies to match the Vacancy ID with the Job Title & Company Name
        const jobsResponse = await fetch("http://localhost:8080/api/vacancies/all");
        if (!jobsResponse.ok) throw new Error("Failed to fetch job details.");
        const vacancies = await jobsResponse.json();

        applicationsContainer.innerHTML = ""; // Clear loading text

        // 5. Check if the student has applied to any jobs yet
        if (applications.length === 0) {
            applicationsContainer.innerHTML = "<p>You haven't applied for any jobs yet. Head over to the Jobs section to find opportunities!</p>";
            return;
        }

        // 6. Loop through applications and render them
        applications.forEach(app => {
            // Match the application's vacancyId to the actual job details
            const jobDetails = vacancies.find(job => job.id === app.vacancyId);
            
            // Fallback text just in case a job was deleted from the database
            const jobTitle = jobDetails ? jobDetails.jobTitle : "Job No Longer Available";
            const companyName = jobDetails ? jobDetails.companyName : "Unknown Company";

            const appCard = document.createElement("div");
            appCard.className = "application-card"; // Use this class for CSS styling
            
            appCard.innerHTML = `
                <h3>${jobTitle}</h3>
                <p><strong>Company:</strong> ${companyName}</p>
                <p><strong>Date Applied:</strong> ${app.appliedDate}</p>
                <p><strong>Status:</strong> <span class="status ${app.status.toLowerCase()}">${app.status}</span></p>
            `;
            
            applicationsContainer.appendChild(appCard);
        });

    } catch (error) {
        console.error("Error fetching applications:", error);
        applicationsContainer.innerHTML = "<p style='color: red;'>Could not load your applications. Please ensure your backend is running.</p>";
    }
});