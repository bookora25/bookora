/* =====================================================
   GLOBAL APP FUNCTIONS
   Handles:
   - Dark mode
   - Navbar login/logout visibility
   - Modal open/close
   - Smooth animations
===================================================== */

/* ============================
   DARK MODE
============================ */
const darkToggle = document.getElementById("darkModeToggle");

darkToggle?.addEventListener("click", () => {
    document.body.classList.toggle("dark");

    // Save preference
    localStorage.setItem(
        "bookoraDarkMode",
        document.body.classList.contains("dark") ? "on" : "off"
    );
});

/* Load saved dark mode */
if (localStorage.getItem("bookoraDarkMode") === "on") {
    document.body.classList.add("dark");
}

/* ============================
   NAVBAR LOGIN/LOGOUT UI
============================ */
function updateNavbarUI() {
    const loginBtn = document.getElementById("loginBtn");
    const signupBtn = document.getElementById("signupBtn");
    const logoutBtn = document.getElementById("logoutBtn");

    const donateLink = document.getElementById("donateLink");
    const dashboardLink = document.getElementById("dashboardLink");

    if (!currentUser) {
        loginBtn.classList.remove("hidden");
        signupBtn.classList.remove("hidden");
        logoutBtn.classList.add("hidden");

        donateLink.classList.add("hidden");
        dashboardLink.classList.add("hidden");
    } else {
        loginBtn.classList.add("hidden");
        signupBtn.classList.add("hidden");
        logoutBtn.classList.remove("hidden");

        donateLink.classList.remove("hidden");
        dashboardLink.classList.remove("hidden");
    }
}

updateNavbarUI();

/* Logout Handling */
document.getElementById("logoutBtn")?.addEventListener("click", () => {
    currentUser = null;
    localStorage.removeItem("bookoraCurrentUser");

    updateNavbarUI();

    alert("Logged out successfully.");
    window.location.href = "index.html";
});

/* ============================
   MODAL CONTROL
============================ */
const authModal = document.getElementById("authModal");
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const closeModal = document.getElementById("closeModal");

/* Open modal for login/sign up */
loginBtn?.addEventListener("click", () => openAuthModal("login"));
signupBtn?.addEventListener("click", () => openAuthModal("signup"));

function openAuthModal(mode) {
    authModal.classList.remove("hidden");

    const title = document.getElementById("authTitle");
    const switchText = document.getElementById("switchAuthText");

    if (mode === "login") {
        authMode = "login";
        title.textContent = "Login";
        switchText.innerHTML = `Don't have an account? <a onclick="openAuthModal('signup')">Sign up</a>`;
    } else {
        authMode = "signup";
        title.textContent = "Sign Up";
        switchText.innerHTML = `Already have an account? <a onclick="openAuthModal('login')">Log in</a>`;
    }
}

/* Close modal */
closeModal?.addEventListener("click", () => {
    authModal.classList.add("hidden");
});

/* Close modal when clicking outside */
window.addEventListener("click", (e) => {
    if (e.target === authModal) authModal.classList.add("hidden");
});

/* ============================
   SMOOTH FADE-IN ANIMATIONS
============================ */
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll(".fade-in").forEach(el => {
        el.style.opacity = 0;
        setTimeout(() => {
            el.style.opacity = 1;
            el.style.transition = "opacity 0.7s ease";
        }, 50);
    });
});
