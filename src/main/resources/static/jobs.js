document.addEventListener("DOMContentLoaded", async () => {
    // 1. Target the exact ID from your HTML
    const jobsContainer = document.getElementById("jobsContainer");

    if (!jobsContainer) {
        console.error("Error: Could not find 'jobsContainer' in the HTML.");
        return;
    }

    // Show a loading message while waiting for the server
    jobsContainer.innerHTML = "<p>Loading job vacancies...</p>";

    try {
        // 2. Fetch all vacancies from the Spring Boot backend
        const response = await fetch("http://localhost:8080/api/vacancies/all");

        if (!response.ok) {
            throw new Error("Failed to fetch jobs from the server.");
        }

        const jobs = await response.json();

        // Clear the loading message
        jobsContainer.innerHTML = "";

        // 3. Check if there are any jobs available
        if (jobs.length === 0) {
            jobsContainer.innerHTML = "<p>No job vacancies available at the moment. Please check back later.</p>";
            return;
        }

        // 4. Loop through the jobs and create an HTML card for each one
        jobs.forEach(job => {
            const jobCard = document.createElement("div");
            jobCard.className = "job-card"; // Use this class to style the card in jobs.css

            // Notice how we are now pulling in the new Package, CGPA, and Skills data!
            jobCard.innerHTML = `
                <h3>${job.jobTitle}</h3>
                <p class="company"><strong>Company:</strong> ${job.companyName}</p>
                <p class="location"><strong>Location:</strong> ${job.location}</p>
                
                <div class="job-highlights">
                    <p><strong>Package:</strong> ${job.packageLpa ? job.packageLpa + ' LPA' : 'Not specified'}</p>
                    <p><strong>Min CGPA:</strong> ${job.cgpa ? job.cgpa : 'Not specified'}</p>
                    <p><strong>Deadline:</strong> ${job.deadline ? job.deadline : 'Not specified'}</p>
                </div>

                <div class="job-details">
                    <p><strong>Required Skills:</strong> ${job.skills ? job.skills : 'Not specified'}</p>
                </div>
                
                <button class="apply-btn" onclick="applyForJob(${job.id})">Apply Now</button>
            `;

            jobsContainer.appendChild(jobCard);
        });

    } catch (error) {
        console.error("Error fetching jobs:", error);
        jobsContainer.innerHTML = "<p style='color: red;'>Could not load jobs. Please ensure your Spring Boot server is running on port 8080.</p>";
    }
});

// 5. Function to handle the job application process
async function applyForJob(vacancyId) {
    // Pull the logged-in student's details from LocalStorage
    const studentName = localStorage.getItem("userName");
    const studentEmail = localStorage.getItem("userEmail");
    const studentRollNumber = localStorage.getItem("userRollNumber");

    // Security check: ensure the user actually registered/logged in first
    if (!studentName || !studentEmail) {
        alert("You need to register or log in before applying for a job.");
        window.location.href = "student_registration.html";
        return;
    }

    // Package the data for the backend
    const applicationData = {
        vacancyId: vacancyId,
        studentName: studentName,
        studentRollNumber: studentRollNumber,
        studentEmail: studentEmail
    };

    try {
        const response = await fetch("http://localhost:8080/api/applications/apply", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(applicationData)
        });

        if (response.ok) {
            alert("Successfully applied for the job! The recruiter has received your profile.");
        } else {
            alert("Failed to submit application. Please try again.");
        }
    } catch (error) {
        console.error("Error applying for job:", error);
        alert("Could not connect to the server to submit your application.");
    }
}