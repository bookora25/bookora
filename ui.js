/* =====================================================
   UI RENDER ENGINE
   Handles:
   - Homepage book rendering
   - Search results
   - Dashboard (donated/sent/received requests)
   - Owner approval interface
===================================================== */

/* ============================
   RENDER BOOKS ON HOMEPAGE
============================ */
function renderBooks(list = books) {
    const container = document.getElementById("book-list");
    if (!container) return;

    container.innerHTML = "";

    list.forEach(book => {
        let card = document.createElement("div");
        card.className = "book-card fade-in";

        card.innerHTML = `
            <img src="${book.img}" />
            <h3>${book.title}</h3>
            <p><strong>Author:</strong> ${book.author}</p>
            <p><strong>Year:</strong> ${book.year}</p>
            <button onclick="handleRequest(${book.id})">Request Book</button>
        `;

        container.appendChild(card);
    });
}

/* Home Page Request Button Logic */
function handleRequest(bookID) {
    if (!currentUser) {
        alert("Please log in to request books.");
        return;
    }
    requestBook(bookID);
}

/* Auto-render on index.html */
if (window.location.pathname.includes("index.html")) {
    renderBooks();
}

/* ============================
   SEARCH HANDLING
============================ */
const tInput = document.getElementById("searchTitle");
const aInput = document.getElementById("searchAuthor");

tInput?.addEventListener("input", searchBooks);
aInput?.addEventListener("input", searchBooks);

function searchBooks() {
    const titleQ = tInput.value.toLowerCase();
    const authorQ = aInput.value.toLowerCase();

    let filtered = books.filter(b =>
        b.title.toLowerCase().includes(titleQ) &&
        b.author.toLowerCase().includes(authorQ)
    );

    // Suggest same book by different author
    if (filtered.length === 0 && titleQ !== "") {
        filtered = books.filter(b =>
            b.title.toLowerCase().includes(titleQ)
        );
        if (filtered.length > 0) {
            alert("Exact author not found. Showing other authors for the same book.");
        }
    }

    renderBooks(filtered);
}

/* =====================================================
   DASHBOARD RENDERING
===================================================== */
function renderDashboard() {
    const sentBox = document.getElementById("sentRequests");
    const receivedBox = document.getElementById("receivedRequests");
    const donatedBox = document.getElementById("donatedBooks");

    if (!sentBox || !receivedBox || !donatedBox) return;

    let user = users.find(u => u.username === currentUser.username);

    /* ============================
       DONATED BOOKS
    ============================= */
    donatedBox.innerHTML = "";
    user.donatedBooks.forEach(bookID => {
        let book = books.find(b => b.id === bookID);
        donatedBox.innerHTML += `
            <div class="dashboard-card fade-in">
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Year:</strong> ${book.year}</p>
            </div>
        `;
    });

    /* ============================
       SENT REQUESTS
    ============================= */
    sentBox.innerHTML = "";
    user.sentRequests.forEach(req => {
        sentBox.innerHTML += `
            <div class="dashboard-card fade-in">
                <h3>${req.bookTitle}</h3>
                <p><strong>To:</strong> ${req.to}</p>
                <p><strong>Status:</strong> ${req.status}</p>

                ${
                    req.status === "approved"
                    ? `<p><strong>Owner Contact:</strong> (shown upon approval)</p>`
                    : ""
                }
            </div>
        `;
    });

    /* ============================
       RECEIVED REQUESTS
       (Owner Approval Interface)
    ============================= */
    receivedBox.innerHTML = "";
    user.receivedRequests.forEach(req => {
        let book = books.find(b => b.id === req.bookID);

        receivedBox.innerHTML += `
            <div class="dashboard-card fade-in">
                <h3>${req.bookTitle}</h3>
                <p><strong>Requested by:</strong> ${req.from}</p>
                <p><strong>Status:</strong> ${req.status}</p>

                ${
                    req.status === "pending"
                    ? `
                        <button class="req-btn req-approve"
                            onclick="approveRequest(${req.bookID}, '${req.from}')">Approve</button>

                        <button class="req-btn req-decline"
                            onclick="declineRequest(${req.bookID}, '${req.from}')">Decline</button>
                      `
                    : req.status === "approved"
                        ? `<p style="color:green;"><strong>Approved ✔</strong></p>`
                        : `<p style="color:red;"><strong>Declined ✘</strong></p>`
                }
            </div>
        `;
    });
}

/* Load dashboard only on dashboard.html */
if (window.location.pathname.includes("dashboard.html")) {
    renderDashboard();
}
/* ============================
   DARK MODE (Guaranteed Working)
============================ */

document.addEventListener("DOMContentLoaded", () => {

    const toggle = document.getElementById("darkModeToggle");
    const icon = toggle?.querySelector("i");

    // Load saved theme
    const saved = localStorage.getItem("bookoraTheme");

    if (saved === "dark") {
        document.body.classList.add("dark");
        if (icon) icon.className = "fa-solid fa-sun";
    }

    toggle?.addEventListener("click", () => {
        document.body.classList.toggle("dark");

        const isDark = document.body.classList.contains("dark");

        // Save preference
        localStorage.setItem("bookoraTheme", isDark ? "dark" : "light");

        // Switch icon
        icon.className = isDark
            ? "fa-solid fa-sun"
            : "fa-solid fa-moon";
    });
});
