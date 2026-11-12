document.addEventListener("DOMContentLoaded", () => {
    // 1. Target the exact form ID from your HTML
    const studentForm = document.getElementById("studentForm");

    if (studentForm) {
        studentForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Stop the page from reloading

            // 2. Gather all the checked skills into a comma-separated string
            const checkedSkills = Array.from(document.querySelectorAll('.skills input[type="checkbox"]:checked'))
                .map(checkbox => checkbox.value);
            const allSkills = checkedSkills.join(", ");

            // 3. Extract values matching your new HTML IDs exactly
            const studentData = {
                fullName: document.getElementById("name").value.trim(),
                email: document.getElementById("email").value.trim(),
                phone: document.getElementById("phone").value.trim(),
                branch: document.getElementById("branch").value,
                cgpa: document.getElementById("cgpa").value,
                skills: allSkills
                // Note: password and rollNumber are no longer in the form,
                // so they will be saved as 'null' in the database.
            };

            // Basic validation
            if (!studentData.fullName || !studentData.email || !studentData.branch) {
                alert("Please fill out your Name, Email, and Branch.");
                return;
            }

            try {
                // 4. Send the data to your Spring Boot backend on Render
                const response = await fetch("https://campus-hire-api-yiju.onrender.com/api/students/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(studentData)
                });

                if (response.ok) {
                    const savedStudent = await response.json();

                    // 5. Save details to LocalStorage to instantly power the Student Dashboard
                    localStorage.setItem("userName", savedStudent.fullName);
                    localStorage.setItem("userEmail", savedStudent.email);
                    localStorage.setItem("userPhone", savedStudent.phone);
                    localStorage.setItem("userBranch", savedStudent.branch);
                    localStorage.setItem("userCGPA", savedStudent.cgpa);
                    localStorage.setItem("userSkills", savedStudent.skills);

                    alert(`Registration successful! Welcome to Campus Hire, ${savedStudent.fullName}.`);

                    // Redirect the student to their dashboard
                    window.location.href = "student_dashboard.html";
                } else {
                    alert("Registration failed. Please check your details and try again.");
                }
            } catch (error) {
                console.error("Error connecting to backend:", error);
                alert("Could not connect to the server. Make sure your Render backend is running.");
            }
        });
    } else {
        console.error("Error: Could not find the 'studentForm' in the HTML.");
    }
});