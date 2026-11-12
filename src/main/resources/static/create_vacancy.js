let customSkillsArray = [];

function addSkill() {
    const skillInput = document.getElementById("customSkill");
    const skillValue = skillInput.value.trim();

    if (skillValue && !customSkillsArray.includes(skillValue)) {
        customSkillsArray.push(skillValue);

        const listDiv = document.getElementById("customSkillsList");
        const skillBadge = document.createElement("span");

        skillBadge.style.display = "inline-block";
        skillBadge.style.backgroundColor = "#e0e7ff";
        skillBadge.style.color = "#3730a3";
        skillBadge.style.padding = "5px 10px";
        skillBadge.style.borderRadius = "15px";
        skillBadge.style.margin = "5px";
        skillBadge.style.cursor = "pointer";
        skillBadge.textContent = skillValue + " ✖";

        skillBadge.onclick = function() {
            customSkillsArray = customSkillsArray.filter(s => s !== skillValue);
            listDiv.removeChild(skillBadge);
        };

        listDiv.appendChild(skillBadge);
        skillInput.value = "";
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const jobForm = document.getElementById("jobForm");

    if (jobForm) {
        jobForm.addEventListener("submit", async (event) => {
            event.preventDefault();

            // Gather the skills
            const checkedSkills = Array.from(document.querySelectorAll('.skills input:checked'))
                .map(checkbox => checkbox.value);
            const allSkills = [...checkedSkills, ...customSkillsArray].join(", ");

            // Get company name from login session
            const companyName = localStorage.getItem("recruiterCompany") || "Unknown Company";

            // Map data using ONLY the IDs that actually exist in your new HTML
            const vacancyData = {
                companyName: companyName,
                jobTitle: document.getElementById("jobTitle").value.trim(),
                location: document.getElementById("location").value.trim(),
                packageLpa: document.getElementById("package").value,
                cgpa: document.getElementById("cgpa").value,
                skills: allSkills,
                deadline: document.getElementById("deadline").value
            };

            if (!vacancyData.skills) {
                alert("Please select or add at least one required skill.");
                return;
            }

            try {
                const response = await fetch("https://campus-hire-api-yiju.onrender.com/api/vacancies/create", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(vacancyData)
                });

                if (response.ok) {
                    alert("Vacancy created successfully!");
                    jobForm.reset();
                    customSkillsArray = [];
                    document.getElementById("customSkillsList").innerHTML = "";
                } else {
                    alert("Failed to create vacancy. Please try again.");
                }
            } catch (error) {
                console.error("Error:", error);
                alert("Could not connect to the server. Make sure your Spring Boot backend is running.");
            }
        });
    }
});