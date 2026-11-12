// 1. Setup for Custom Skills
let customSkillsArray = [];

// This function must sit outside so the HTML onclick="addSkill()" can find it
function addSkill() {
    const skillInput = document.getElementById("customSkill");
    const skillValue = skillInput.value.trim();

    if (skillValue && !customSkillsArray.includes(skillValue)) {
        customSkillsArray.push(skillValue);

        const listDiv = document.getElementById("customSkillsList");
        const skillBadge = document.createElement("span");

        // Styling the badge
        skillBadge.style.display = "inline-block";
        skillBadge.style.backgroundColor = "#e0e7ff";
        skillBadge.style.color = "#3730a3";
        skillBadge.style.padding = "5px 10px";
        skillBadge.style.borderRadius = "15px";
        skillBadge.style.margin = "5px";
        skillBadge.style.cursor = "pointer";
        skillBadge.style.fontSize = "0.9em";
        skillBadge.textContent = skillValue + " ✖";

        // Remove skill on click
        skillBadge.onclick = function() {
            customSkillsArray = customSkillsArray.filter(s => s !== skillValue);
            listDiv.removeChild(skillBadge);
            calculateCompletion(); // Recalculate score when removed
        };

        listDiv.appendChild(skillBadge);
        skillInput.value = ""; // Clear input
        calculateCompletion(); // Recalculate score when added
    }
}

// 2. Real-time Profile Completion Calculator
function calculateCompletion() {
    let score = 0;

    // Base details from registration (45% total)
    if (document.getElementById("name").value.trim() !== "") score += 15;
    if (document.getElementById("email").value.trim() !== "") score += 15;
    if (document.getElementById("branch").value.trim() !== "") score += 15;

    // Editable details (20% total)
    if (document.getElementById("phone").value.trim() !== "") score += 10;
    if (document.getElementById("cgpa").value.trim() !== "") score += 10;

    // Skills Check (15% total if at least one skill is selected)
    const checkedSkills = document.querySelectorAll('.skills input[type="checkbox"]:checked');
    if (checkedSkills.length > 0 || customSkillsArray.length > 0) {
        score += 15;
    }

    // Resume Upload (20% total)
    const resumeUpload = document.getElementById("resume");
    if (resumeUpload.files && resumeUpload.files.length > 0) {
        score += 20;
    }

    // Update the UI
    const scoreDisplay = document.getElementById("completionScore");
    scoreDisplay.textContent = score + "%";

    // Optional: Change color based on score
    if (score === 100) {
        scoreDisplay.style.color = "#155724"; // Green if complete
        scoreDisplay.style.fontWeight = "bold";
    } else {
        scoreDisplay.style.color = "#333"; // Default color
    }
}

// 3. Main DOM Setup
document.addEventListener("DOMContentLoaded", () => {
    // A. Auto-fill the Readonly fields from LocalStorage
    document.getElementById("name").value = localStorage.getItem("userName") || "";
    document.getElementById("email").value = localStorage.getItem("userEmail") || "";

    // Fallback in case branch wasn't saved perfectly
    document.getElementById("branch").value = localStorage.getItem("userBranch") || "Computer Science";

    // B. Calculate the initial score right when the page loads
    calculateCompletion();

    // C. Add event listeners so the score updates instantly as the user types/clicks
    const inputs = ["phone", "cgpa", "resume"];
    inputs.forEach(id => {
        const element = document.getElementById(id);
        if (element) {
            element.addEventListener("input", calculateCompletion);
            element.addEventListener("change", calculateCompletion);
        }
    });

    const checkboxes = document.querySelectorAll('.skills input[type="checkbox"]');
    checkboxes.forEach(box => {
        box.addEventListener("change", calculateCompletion);
    });

    // D. Handle Saving the Profile
    const profileForm = document.getElementById("profileForm");

    if (profileForm) {
        profileForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            // Gather skills
            const checkedSkills = Array.from(document.querySelectorAll('.skills input[type="checkbox"]:checked'))
                .map(checkbox => checkbox.value);
            const allSkills = [...checkedSkills, ...customSkillsArray].join(", ");

            // Gather all data
            const profileData = {
                email: document.getElementById("email").value, // Used to find the student in the database
                phone: document.getElementById("phone").value,
                cgpa: document.getElementById("cgpa").value,
                skills: allSkills
            };

            // Check if a file was uploaded (File handling requires special backend setup, so we just log it for now)
            const resumeFile = document.getElementById("resume").files[0];
            if (resumeFile) {
                console.log("Resume ready for upload:", resumeFile.name);
            }

            try {
                // Send the updated data to the new Spring Boot PutMapping
                const response = await fetch("http://localhost:8080/api/students/update", {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(profileData)
                });

                if (response.ok) {
                    // Also save locally so the form stays filled out if they refresh
                    localStorage.setItem("userPhone", profileData.phone);
                    localStorage.setItem("userCGPA", profileData.cgpa);
                    localStorage.setItem("userSkills", profileData.skills);

                    alert("Profile successfully updated in the database!");
                } else {
                    alert("Failed to update profile. Please try again.");
                }

            } catch (error) {
                console.error("Error saving profile:", error);
                alert("Could not connect to the server.");
            }
        });
    }
});