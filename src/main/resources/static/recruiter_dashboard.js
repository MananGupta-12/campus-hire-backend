document.addEventListener("DOMContentLoaded", async () => {
    // 1. Security Check & Data Retrieval
    // Pull the logged-in recruiter's details from LocalStorage
    const companyName = localStorage.getItem("recruiterCompany");
    const email = localStorage.getItem("recruiterEmail");

    // Using a fallback for phone and location since they might not be strictly required during registration
    const phone = localStorage.getItem("recruiterPhone") || "Not provided";
    const location = localStorage.getItem("recruiterLocation") || "Not specified";

    // If there is no company name, kick them back to the registration/login page
    if (!companyName) {
        alert("You must be logged in to view the dashboard.");
        window.location.href = "recruiter_registration.html";
        return;
    }

    // 2. Populate the UI with Company Details
    document.getElementById("companyName").textContent = `Welcome, ${companyName}`;
    document.getElementById("profileCompany").textContent = companyName;
    document.getElementById("profileEmail").textContent = email;
    document.getElementById("profilePhone").textContent = phone;
    document.getElementById("profileLocation").textContent = location;

    // 3. Fetch Data for the Statistics Cards
    try {
        // A. Fetch all vacancies from the database
        const jobsResponse = await fetch("http://localhost:8080/api/vacancies/all");
        if (!jobsResponse.ok) throw new Error("Failed to fetch jobs.");

        const allJobs = await jobsResponse.json();

        // B. Filter the jobs so we ONLY count jobs posted by THIS company
        const myJobs = allJobs.filter(job => job.companyName === companyName);

        // Update the "Jobs Posted" number on the dashboard
        document.getElementById("jobCount").textContent = myJobs.length;

        // C. Calculate Total Applicants
        let totalApplicants = 0;

        // Loop through every job this company posted, and ask the database how many applicants it has
        for (const job of myJobs) {
            const appsResponse = await fetch(`http://localhost:8080/api/applications/job/${job.id}`);
            if (appsResponse.ok) {
                const applicants = await appsResponse.json();
                totalApplicants += applicants.length; // Add this job's applicants to the grand total
            }
        }

        // Update the "Applicants" number on the dashboard
        document.getElementById("applicantCount").textContent = totalApplicants;

    } catch (error) {
        console.error("Error fetching dashboard statistics:", error);
        // If the server is offline, the stats will just gracefully remain at "0"
    }
});

// 4. Logout Functionality
// This is triggered by the onclick="logout()" in your HTML sidebar
function logout() {
    const confirmLogout = confirm("Are you sure you want to log out?");

    if (confirmLogout) {
        // Clear all recruiter data from the browser's memory
        localStorage.removeItem("recruiterName");
        localStorage.removeItem("recruiterCompany");
        localStorage.removeItem("recruiterEmail");
        localStorage.removeItem("recruiterPhone");
        localStorage.removeItem("recruiterLocation");

        // Send them back to the homepage
        window.location.href = "index.html";
    }
}