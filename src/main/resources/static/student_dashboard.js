document.addEventListener("DOMContentLoaded", () => {
    // 1. Security Check
    // Pull the core details saved during registration
    const userName = localStorage.getItem("userName");
    const userEmail = localStorage.getItem("userEmail");

    // If there is no name, kick them back to the registration/login page
    if (!userName || !userEmail) {
        alert("You must be logged in to view your dashboard.");
        window.location.href = "student_registration.html";
        return;
    }

    // 2. Fetch all remaining data from LocalStorage
    // We use fallback strings (like "Not provided") if the user hasn't filled out their profile yet
    const userBranch = localStorage.getItem("userBranch") || "Computer Science";
    const userPhone = localStorage.getItem("userPhone") || "Not provided";
    const userCGPA = localStorage.getItem("userCGPA") || "Not provided";
    const userSkills = localStorage.getItem("userSkills") || "None added yet";

    // 3. Populate the Dashboard UI
    document.getElementById("welcomeName").textContent = `Welcome, ${userName}`;
    document.getElementById("studentName").textContent = userName;
    document.getElementById("studentEmail").textContent = userEmail;
    document.getElementById("studentPhone").textContent = userPhone;
    document.getElementById("studentBranch").textContent = userBranch;
    document.getElementById("studentCGPA").textContent = userCGPA;
    document.getElementById("studentSkills").textContent = userSkills;

    // For the resume, we show a status since file hosting requires a separate cloud setup
    document.getElementById("studentResume").textContent = "Pending Upload";

    // 4. Calculate Career Readiness Score
    // This mirrors the logic from the Profile page to keep the score consistent
    let score = 0;

    if (userName) score += 15;
    if (userEmail) score += 15;
    if (userBranch && userBranch !== "Not provided") score += 15;
    if (userPhone && userPhone !== "Not provided") score += 10;
    if (userCGPA && userCGPA !== "Not provided") score += 10;
    if (userSkills && userSkills !== "None added yet") score += 15;
    // (The remaining 20% would theoretically come from a verified Resume upload)

    // Update the visual score circle
    const scoreCircle = document.getElementById("scoreCircle");
    if (scoreCircle) {
        scoreCircle.textContent = `${score}%`;

        // Dynamically change the color based on how complete the profile is
        if (score >= 80) {
            scoreCircle.style.color = "#155724"; // Dark Green
            scoreCircle.style.backgroundColor = "#d4edda"; // Light Green background
            scoreCircle.style.border = "2px solid #c3e6cb";
        } else if (score >= 50) {
            scoreCircle.style.color = "#856404"; // Dark Yellow
            scoreCircle.style.backgroundColor = "#fff3cd";
        }
    }
});

// 5. Logout Functionality
// This is triggered by the onclick="logout()" in your HTML sidebar
function logout() {
    const confirmLogout = confirm("Are you sure you want to log out?");

    if (confirmLogout) {
        // Clear all student data from the browser's memory
        localStorage.clear();

        // Send them back to the homepage
        window.location.href = "index.html";
    }
}