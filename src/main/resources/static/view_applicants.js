document.addEventListener("DOMContentLoaded", async () => {
    // 1. Select the exact container ID from your HTML
    const applicantsContainer = document.getElementById("applicantsContainer");

    if (!applicantsContainer) {
        console.error("Error: Could not find 'applicantsContainer' in the HTML.");
        return;
    }

    // 2. Get the logged-in recruiter's company from LocalStorage
    const recruiterCompany = localStorage.getItem("recruiterCompany");

    if (!recruiterCompany) {
        applicantsContainer.innerHTML = "<p style='color: red;'>You must be logged in as a recruiter to view applicants.</p>";
        return;
    }

    applicantsContainer.innerHTML = "<p>Loading applicants...</p>";

    try {
        // 3. Fetch ALL jobs, then filter to only keep the jobs posted by THIS recruiter
        const jobsResponse = await fetch("http://localhost:8080/api/vacancies/all");
        if (!jobsResponse.ok) throw new Error("Failed to fetch vacancies.");

        const allJobs = await jobsResponse.json();
        const myJobs = allJobs.filter(job => job.companyName === recruiterCompany);

        applicantsContainer.innerHTML = ""; // Clear loading text

        if (myJobs.length === 0) {
            applicantsContainer.innerHTML = "<p>You haven't posted any job vacancies yet.</p>";
            return;
        }

        // 4. Loop through each of the recruiter's jobs to fetch its specific applicants
        for (const job of myJobs) {
            // Create a section for this specific job
            const jobSection = document.createElement("div");
            jobSection.className = "job-applicant-section"; // Use this class for CSS styling
            jobSection.innerHTML = `<h3>Applicants for: ${job.jobTitle}</h3>`;

            // Fetch applicants for this specific job ID
            const appsResponse = await fetch(`http://localhost:8080/api/applications/job/${job.id}`);
            if (!appsResponse.ok) throw new Error(`Failed to fetch applicants for job ${job.id}`);

            const applicants = await appsResponse.json();

            // 5. Display the applicants in a table, or show a message if there are none
            if (applicants.length === 0) {
                jobSection.innerHTML += `<p class="no-applicants">No students have applied for this position yet.</p>`;
            } else {
                // Build a table to display the student data cleanly (Roll Number removed to match new registration form)
                let tableHTML = `
                    <table class="applicants-table">
                        <thead>
                            <tr>
                                <th>Student Name</th>
                                <th>Email</th>
                                <th>Date Applied</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                `;

                // Add a row for each student
                applicants.forEach(app => {
                    // Fallbacks added in case appliedDate or status are missing
                    const dateApplied = app.appliedDate || "Recently";
                    const currentStatus = app.status || "Pending";

                    tableHTML += `
                        <tr>
                            <td>${app.studentName}</td>
                            <td><a href="mailto:${app.studentEmail}">${app.studentEmail}</a></td>
                            <td>${dateApplied}</td>
                            <td><span class="status ${currentStatus.toLowerCase()}">${currentStatus}</span></td>
                            <td>
                                <button class="review-btn" onclick="reviewApplicant('${app.studentName}', '${app.studentEmail}')">Contact Student</button>
                            </td>
                        </tr>
                    `;
                });

                tableHTML += `</tbody></table>`;
                jobSection.innerHTML += tableHTML;
            }

            // Add the job section to the main container
            applicantsContainer.appendChild(jobSection);
        }

    } catch (error) {
        console.error("Error fetching data:", error);
        applicantsContainer.innerHTML = "<p style='color: red;'>Could not load applicant data. Please ensure your backend is running on port 8080.</p>";
    }
});

// 6. Action button function
function reviewApplicant(studentName, studentEmail) {
    alert(`Initiating review for ${studentName}.\n\nYou can reach them at: ${studentEmail}`);
}