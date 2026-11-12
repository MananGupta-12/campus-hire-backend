// ==========================
// Campus Hire Landing Page
// ==========================

document.addEventListener("DOMContentLoaded", function () {

    console.log("Campus Hire Loaded Successfully");

});

// ==========================
// Smooth Scrolling
// ==========================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {

    anchor.addEventListener("click", function (e) {

        e.preventDefault();

        const target =
        document.querySelector(
            this.getAttribute("href")
        );

        if(target){

            target.scrollIntoView({
                behavior: "smooth"
            });

        }

    });

});

// ==========================
// Navbar Shadow Effect
// ==========================

window.addEventListener("scroll", function () {

    const navbar =
    document.querySelector(".navbar");

    if(window.scrollY > 50){

        navbar.style.boxShadow =
        "0 4px 15px rgba(0,0,0,0.2)";

    }
    else{

        navbar.style.boxShadow =
        "none";

    }

});

// ==========================
// Future Features Placeholder
// ==========================

// Career Readiness Score
// Job Matching
// Notifications
// Recruiter Analytics
