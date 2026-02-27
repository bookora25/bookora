/* =====================================================
   BOOKORA AUTH SYSTEM (Frontend Only)
   - Sign Up
   - Sign In
   - Logout
   - Session Handling
   - Navbar Updates
   - Fixed: Modal stays closed after user clicks CLOSE
===================================================== */

/* -----------------------------
    GLOBAL USER SESSION
------------------------------ */
let users = JSON.parse(localStorage.getItem("bookoraUsers")) || [];
let currentUser = JSON.parse(localStorage.getItem("bookoraCurrentUser")) || null;

/* Prevent modal reopening after user closes it manually */
let authManuallyClosed = false;

/* -----------------------------
   NAVBAR ELEMENTS
------------------------------ */
const loginBtn = document.getElementById("loginBtn");
const signupBtn = document.getElementById("signupBtn");
const logoutBtn = document.getElementById("logoutBtn");

const donateLink = document.getElementById("donateLink");
const dashboardLink = document.getElementById("dashboardLink");

/* -----------------------------
      AUTH MODAL ELEMENTS
------------------------------ */
const authModal = document.getElementById("authModal");
const authTitle = document.getElementById("authTitle");
const authUsername = document.getElementById("authUsername");
const authPassword = document.getElementById("authPassword");
const authSubmitBtn = document.getElementById("authSubmitBtn");
const switchAuthText = document.getElementById("switchAuthText");
const closeModal = document.getElementById("closeModal");

/* =====================================================
   UPDATE NAVBAR FOR LOGGED-IN / LOGGED-OUT STATE
===================================================== */
function updateNavbar() {
    if (currentUser) {
        loginBtn.classList.add("hidden");
        signupBtn.classList.add("hidden");
        logoutBtn.classList.remove("hidden");

        donateLink.classList.remove("hidden");
        dashboardLink.classList.remove("hidden");
    } else {
        loginBtn.classList.remove("hidden");
        signupBtn.classList.remove("hidden");
        logoutBtn.classList.add("hidden");

        donateLink.classList.add("hidden");
        dashboardLink.classList.add("hidden");
    }
}
updateNavbar();

/* =====================================================
                OPEN LOGIN / SIGNUP MODAL
===================================================== */

let mode = "login"; // default mode

loginBtn?.addEventListener("click", () => {
    authManuallyClosed = false;  // reopen allowed
    openAuth("login");
});

signupBtn?.addEventListener("click", () => {
    authManuallyClosed = false;  // reopen allowed
    openAuth("signup");
});

function openAuth(type) {

    // 🚫 If the user clicked CLOSE earlier → do NOT open automatically
    if (authManuallyClosed) return;

    mode = type;
    authModal.classList.remove("hidden");

    if (type === "login") {
        authTitle.textContent = "Sign In";
        authSubmitBtn.textContent = "Login";
        switchAuthText.innerHTML = `Don't have an account? 
            <span style="color:#4a148c; cursor:pointer;" onclick="openAuth('signup')">Sign Up</span>`;
    } else {
        authTitle.textContent = "Sign Up";
        authSubmitBtn.textContent = "Create Account";
        switchAuthText.innerHTML = `Already have an account? 
            <span style="color:#4a148c; cursor:pointer;" onclick="openAuth('login')">Login</span>`;
    }
}

/* =====================================================
                 CLOSE MODAL (FIXED)
===================================================== */
closeModal.addEventListener("click", () => {
    authManuallyClosed = true;  // ❗ important: stops auto-reopen
    authModal.classList.add("hidden");
    authUsername.value = "";
    authPassword.value = "";
});

/* Close when clicking outside the box */
window.addEventListener("click", (e) => {
    if (e.target === authModal) {
        authManuallyClosed = true;
        authModal.classList.add("hidden");
    }
});

/* =====================================================
               SUBMIT LOGIN OR SIGNUP
===================================================== */
authSubmitBtn.addEventListener("click", () => {
    const username = authUsername.value.trim();
    const password = authPassword.value.trim();

    if (!username || !password) {
        alert("Please fill all fields.");
        return;
    }

    if (mode === "signup") {
        handleSignup(username, password);
    } else {
        handleLogin(username, password);
    }
});

/* =====================================================
                 SIGN UP FUNCTION
===================================================== */
function handleSignup(username, password) {
    const exists = users.find(u => u.username === username);

    if (exists) {
        alert("Username already taken!");
        return;
    }

  const newUser = {
    username,
    password,
    email: "",
    phone: "",
    donatedBooks: [],
    receivedRequests: [],
    sentRequests: []
};

    users.push(newUser);
    localStorage.setItem("bookoraUsers", JSON.stringify(users));

    alert("Account created successfully! Please log in.");
    openAuth("login");
}

/* =====================================================
                 LOGIN FUNCTION
===================================================== */
function handleLogin(username, password) {
    const found = users.find(
        u => u.username === username && u.password === password
    );

    if (!found) {
        alert("Invalid username or password.");
        return;
    }

    currentUser = found;
    localStorage.setItem("bookoraCurrentUser", JSON.stringify(found));

    authModal.classList.add("hidden");
    updateNavbar();

    alert(`Welcome back, ${found.username}!`);
}

/* =====================================================
                   LOGOUT FUNCTION
===================================================== */
logoutBtn?.addEventListener("click", () => {
    currentUser = null;
    localStorage.removeItem("bookoraCurrentUser");
    updateNavbar();
    alert("Logged out successfully.");
});

/* =====================================================
     PROTECT PAGES (Donate & Dashboard ONLY)
===================================================== */
const protectedPages = ["donate.html", "dashboard.html"];

if (protectedPages.some(p => window.location.pathname.includes(p))) {
    if (!currentUser) {
        alert("You must be logged in to access this page.");
        window.location.href = "index.html";
    }
}
