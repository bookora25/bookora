/* =====================================================
   BOOKORA BOOK SYSTEM
   - Store all books
   - Request books
   - Approval system
   - Notifications
   - Donated books tracking
===================================================== */

/* Load saved books or set default sample data */
let books = JSON.parse(localStorage.getItem("bookoraBooks")) || [
    {
        id: 1,
        title: "Data Structures",
        author: "Mark Weiss",
        year: 2014,
        img: "https://picsum.photos/id/1025/400/300",
        owner: "Asha",
        ownerUser: null,
        requests: []
    },
    {
        id: 2,
        title: "Data Structures",
        author: "Different Author",
        year: 2012,
        img: "https://picsum.photos/id/1040/400/300",
        owner: "John",
        ownerUser: null,
        requests: []
    },
    {
        id: 3,
        title: "Algorithms",
        author: "CLRS",
        year: 2015,
        img: "https://picsum.photos/id/1020/400/300",
        owner: "Riya",
        ownerUser: null,
        requests: []
    },
    {
        id: 4,
        title: "Java Basics",
        author: "James Gosling",
        year: 2010,
        img: "https://picsum.photos/id/1005/400/300",
        owner: "Mason",
        ownerUser: null,
        requests: []
    }
];

saveBooks();

/* Utility: Save books to localStorage */
function saveBooks() {
    localStorage.setItem("bookoraBooks", JSON.stringify(books));
}

/* =====================================================
       REQUEST A BOOK
===================================================== */
function requestBook(bookID) {
    if (!currentUser) {
        alert("Please login to request books.");
        return;
    }

    let book = books.find(b => b.id === bookID);

    if (!book) return;

    /* Add request to the book object */
    const request = {
        requester: currentUser.username,
        status: "pending"
    };
    book.requests.push(request);
    saveBooks();

    /* Add request to the owner's account (if registered) */
    let owner = users.find(u => u.username === book.ownerUser);
    if (owner) {
        owner.receivedRequests.push({
            bookID,
            bookTitle: book.title,
            from: currentUser.username,
            status: "pending"
        });
        localStorage.setItem("bookoraUsers", JSON.stringify(users));
    }

    /* Add to sender's sent requests */
    let userRef = users.find(u => u.username === currentUser.username);
    userRef.sentRequests.push({
        bookID,
        bookTitle: book.title,
        to: book.ownerUser,
        status: "pending"
    });
    localStorage.setItem("bookoraUsers", JSON.stringify(users));

    alert("Request sent! Owner will approve or decline.");
    updateNotificationBadge();
}

/* =====================================================
       ADD NEW BOOK (Donate Page)
===================================================== */
function addNewBook(title, author, year, img) {
    if (!currentUser) return;

    const book = {
        id: Date.now(),
        title,
        author,
        year,
        img,
        owner: currentUser.username,
        ownerUser: currentUser.username,
        requests: []
    };

    books.push(book);
    saveBooks();

    /* Add to user's donated books */
    let acc = users.find(u => u.username === currentUser.username);
    acc.donatedBooks.push(book.id);
    localStorage.setItem("bookoraUsers", JSON.stringify(users));

    alert("Book added successfully!");
}

/* =====================================================
      OWNER APPROVAL / DECLINE
===================================================== */
function approveRequest(bookID, requester) {
    let book = books.find(b => b.id === bookID);
    if (!book) return;

    /* Update book request status */
    let req = book.requests.find(r => r.requester === requester);
    req.status = "approved";
    saveBooks();

    /* Update owner's received requests */
    let owner = users.find(u => u.username === currentUser.username);
    let userReq = owner.receivedRequests.find(
        r => r.bookID === bookID && r.from === requester
    );
    userReq.status = "approved";

    /* Update requester's sent requests */
    let requesterAcc = users.find(u => u.username === requester);
    let req2 = requesterAcc.sentRequests.find(
        r => r.bookID === bookID && r.to === currentUser.username
    );
    req2.status = "approved";

    localStorage.setItem("bookoraUsers", JSON.stringify(users));

    alert(`Request approved. ${requester} will now see your contact details.`);
    updateNotificationBadge();
}

function declineRequest(bookID, requester) {
    let book = books.find(b => b.id === bookID);
    if (!book) return;

    /* Update book request status */
    let req = book.requests.find(r => r.requester === requester);
    req.status = "declined";
    saveBooks();

    /* Update owner's received requests */
    let owner = users.find(u => u.username === currentUser.username);
    let userReq = owner.receivedRequests.find(
        r => r.bookID === bookID && r.from === requester
    );
    userReq.status = "declined";

    /* Update requester's sent requests */
    let requesterAcc = users.find(u => u.username === requester);
    let req2 = requesterAcc.sentRequests.find(
        r => r.bookID === bookID && r.to === currentUser.username
    );
    req2.status = "declined";

    localStorage.setItem("bookoraUsers", JSON.stringify(users));

    alert(`Request declined.`);
    updateNotificationBadge();
}

/* =====================================================
      NOTIFICATION BADGE
===================================================== */
function updateNotificationBadge() {
    const dashboardLink = document.getElementById("dashboardLink");

    if (!currentUser) return;

    let user = users.find(u => u.username === currentUser.username);

    let pending = user.receivedRequests.filter(r => r.status === "pending").length;

    /* Remove old badge */
    let oldBadge = document.querySelector(".badge");
    if (oldBadge) oldBadge.remove();

    if (pending > 0) {
        let badge = document.createElement("span");
        badge.className = "badge";
        badge.textContent = pending;
        dashboardLink.style.position = "relative";
        dashboardLink.appendChild(badge);
    }
}

updateNotificationBadge();
