document.addEventListener("DOMContentLoaded", () => {
    // Target the specific form ID you used in your HTML
    const recruiterForm = document.getElementById("recruiterForm");

    if (recruiterForm) {
        recruiterForm.addEventListener("submit", async (event) => {
            event.preventDefault(); // Stop the page from reloading

            // Extract values matching your new HTML IDs exactly
            const recruiterData = {
                companyName: document.getElementById("companyName").value.trim(),
                email: document.getElementById("email").value.trim(),
                phone: document.getElementById("phone").value.trim(),
                location: document.getElementById("location").value.trim()
            };

            // Basic validation
            if (!recruiterData.companyName || !recruiterData.email) {
                alert("Please fill out the essential company details.");
                return;
            }

            try {
                // Send the data to your Spring Boot backend on Render
                const response = await fetch("https://campus-hire-api-yiju.onrender.com/api/recruiters/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(recruiterData)
                });

                if (response.ok) {
                    const savedRecruiter = await response.json();

                    // Save details to LocalStorage to power the Recruiter Dashboard UI
                    localStorage.setItem("recruiterCompany", savedRecruiter.companyName);
                    localStorage.setItem("recruiterEmail", savedRecruiter.email);
                    localStorage.setItem("recruiterPhone", savedRecruiter.phone);
                    localStorage.setItem("recruiterLocation", savedRecruiter.location);

                    alert(`Registration successful! Welcome to Campus Hire, ${savedRecruiter.companyName}.`);

                    // Redirect the recruiter to their dashboard
                    window.location.href = "recruiter_dashboard.html";
                } else {
                    alert("Registration failed. Please check your details and try again.");
                }
            } catch (error) {
                console.error("Error connecting to backend:", error);
                alert("Could not connect to the server. Make sure your Render backend is running.");
            }
        });
    } else {
        console.error("Error: Could not find the recruiterForm in the HTML.");
    }
});