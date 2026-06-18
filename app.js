const API_BASE_URL = 'http://localhost:3000/api';

// Navigation Logic
document.querySelectorAll('.nav-links li').forEach(item => {
    item.addEventListener('click', (e) => {
        // Remove active class from all links
        document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
        // Add active class to clicked
        e.target.classList.add('active');
        
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
        
        // Show target section
        const target = e.target.getAttribute('data-target');
        document.getElementById(target).classList.add('active');

        // Fetch data if needed
        if(target === 'books') fetchBooks();
        if(target === 'members') fetchMembers();
        if(target === 'borrows') fetchBorrows();
        if(target === 'dashboard') fetchDashboardData();
    });
});

// Format Date helper
const formatDate = (dateString) => {
    if (!dateString) return 'Not Returned';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

// Fetch Dashboard Data
async function fetchDashboardData() {
    try {
        const [booksRes, membersRes, borrowsRes] = await Promise.all([
            fetch(`${API_BASE_URL}/books`),
            fetch(`${API_BASE_URL}/members`),
            fetch(`${API_BASE_URL}/borrows`)
        ]);

        const books = await booksRes.json();
        const members = await membersRes.json();
        const borrows = await borrowsRes.json();

        document.getElementById('total-books').textContent = books.length || 0;
        document.getElementById('total-members').textContent = members.length || 0;
        
        const activeBorrows = borrows.filter(b => b.Return_date === null).length;
        document.getElementById('active-borrows').textContent = activeBorrows || 0;

    } catch (error) {
        console.error("Error fetching dashboard data:", error);
    }
}

// Fetch Books
async function fetchBooks() {
    try {
        const res = await fetch(`${API_BASE_URL}/books`);
        const books = await res.json();
        const tbody = document.querySelector('#books-table tbody');
        tbody.innerHTML = '';

        books.forEach(book => {
            const statusClass = book.Available ? 'available' : 'borrowed';
            const statusText = book.Available ? 'Available' : 'Borrowed';
            
            tbody.innerHTML += `
                <tr>
                    <td>#${book.Book_id}</td>
                    <td><strong>${book.Title}</strong></td>
                    <td>${book.Author}</td>
                    <td>${book.Publisher}</td>
                    <td><span class="status ${statusClass}">${statusText}</span></td>
                    <td><button class="btn-danger" style="padding: 0.3rem 0.6rem;" onclick="deleteBook(${book.Book_id})">Delete</button></td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error fetching books:", error);
    }
}

// Fetch Members
async function fetchMembers() {
    try {
        const res = await fetch(`${API_BASE_URL}/members`);
        const members = await res.json();
        const tbody = document.querySelector('#members-table tbody');
        tbody.innerHTML = '';

        members.forEach(member => {
            tbody.innerHTML += `
                <tr>
                    <td>#${member.Memb_id}</td>
                    <td><strong>${member.Name}</strong></td>
                    <td>${member.Memb_type}</td>
                    <td>${member.Email || 'N/A'}</td>
                    <td><button class="btn-danger" style="padding: 0.3rem 0.6rem;" onclick="deleteMember(${member.Memb_id})">Delete</button></td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error fetching members:", error);
    }
}

// Fetch Borrows
async function fetchBorrows() {
    try {
        const res = await fetch(`${API_BASE_URL}/borrows`);
        const borrows = await res.json();
        const tbody = document.querySelector('#borrows-table tbody');
        tbody.innerHTML = '';

        borrows.forEach(borrow => {
            const statusClass = borrow.Return_date ? 'available' : 'borrowed';
            const statusText = borrow.Return_date ? 'Returned' : 'Active';

            tbody.innerHTML += `
                <tr>
                    <td>#${borrow.Borrow_id}</td>
                    <td>${borrow.Member_Name}</td>
                    <td><strong>${borrow.Book_Title}</strong></td>
                    <td>${formatDate(borrow.Issue_date)}</td>
                    <td><span class="status ${statusClass}">${statusText}</span></td>
                    <td>
                        ${borrow.Return_date ? '<span style="color:var(--text-secondary)">-</span>' : `<button class="btn-success" style="padding: 0.3rem 0.6rem;" onclick="returnBook(${borrow.Borrow_id}, ${borrow.Book_id})">Mark Returned</button>`}
                    </td>
                </tr>
            `;
        });
    } catch (error) {
        console.error("Error fetching borrows:", error);
    }
}

// Check DB Connection Status
async function checkConnectionStatus() {
    const badge = document.getElementById('db-status');
    try {
        const res = await fetch(`${API_BASE_URL}/status`);
        const data = await res.json();
        
        if (data.status === 'connected') {
            badge.textContent = 'DB Connected';
            badge.className = 'db-status connected';
        } else {
            badge.textContent = 'DB Offline';
            badge.className = 'db-status disconnected';
            badge.title = data.error || 'Connection error';
        }
    } catch (error) {
        badge.textContent = 'Server Offline';
        badge.className = 'db-status disconnected';
        badge.title = 'Cannot connect to server';
    }
}

// Initial Fetch for Dashboard & Status
checkConnectionStatus();
fetchDashboardData();

// Periodically check status every 10 seconds
setInterval(checkConnectionStatus, 10000);

// --- Modal & Form Logic ---

function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    
    // Fetch dependencies if necessary
    if(modalId === 'book-modal') {
        fetchPublishersForSelect();
    } else if(modalId === 'borrow-modal') {
        fetchMembersForSelect();
        fetchAvailableBooksForSelect();
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) {
        event.target.classList.remove('active');
    }
}

// Fetch Publishers for Add Book Form
async function fetchPublishersForSelect() {
    try {
        const res = await fetch(`${API_BASE_URL}/publishers`);
        const publishers = await res.json();
        const select = document.getElementById('book-publisher');
        select.innerHTML = '<option value="">Select a Publisher...</option>';
        publishers.forEach(pub => {
            select.innerHTML += `<option value="${pub.Pub_ID}">${pub.Name}</option>`;
        });
    } catch (error) {
        console.error("Error fetching publishers:", error);
    }
}

// Fetch Members for Add Borrow Form
async function fetchMembersForSelect() {
    try {
        const res = await fetch(`${API_BASE_URL}/members`);
        const members = await res.json();
        const select = document.getElementById('borrow-member');
        select.innerHTML = '<option value="">Select a Member...</option>';
        members.forEach(member => {
            select.innerHTML += `<option value="${member.Memb_id}">${member.Name}</option>`;
        });
    } catch (error) {
        console.error("Error fetching members for select:", error);
    }
}

// Fetch Available Books for Add Borrow Form
async function fetchAvailableBooksForSelect() {
    try {
        const res = await fetch(`${API_BASE_URL}/books`);
        const books = await res.json();
        const select = document.getElementById('borrow-book');
        select.innerHTML = '<option value="">Select a Book...</option>';
        books.forEach(book => {
            if(book.Available) {
                select.innerHTML += `<option value="${book.Book_id}">${book.Title} (by ${book.Author})</option>`;
            }
        });
    } catch (error) {
        console.error("Error fetching books for select:", error);
    }
}

// Form Submit Handlers
document.getElementById('add-book-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        Title: document.getElementById('book-title').value,
        Author: document.getElementById('book-author').value,
        Price: document.getElementById('book-price').value,
        Pub_ID: document.getElementById('book-publisher').value
    };

    try {
        const res = await fetch(`${API_BASE_URL}/books`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if(res.ok) {
            closeModal('book-modal');
            e.target.reset();
            fetchBooks();
            fetchDashboardData();
        } else {
            alert('Error adding book');
        }
    } catch(err) { console.error(err); }
});

document.getElementById('add-member-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        Name: document.getElementById('member-name').value,
        Email: document.getElementById('member-email').value,
        Address: document.getElementById('member-address').value,
        Memb_type: document.getElementById('member-type').value
    };

    try {
        const res = await fetch(`${API_BASE_URL}/members`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if(res.ok) {
            closeModal('member-modal');
            e.target.reset();
            fetchMembers();
            fetchDashboardData();
        } else {
            alert('Error adding member');
        }
    } catch(err) { console.error(err); }
});

document.getElementById('add-borrow-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        Memb_id: document.getElementById('borrow-member').value,
        Book_id: document.getElementById('borrow-book').value
    };

    try {
        const res = await fetch(`${API_BASE_URL}/borrows`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if(res.ok) {
            closeModal('borrow-modal');
            e.target.reset();
            fetchBorrows();
            fetchDashboardData();
        } else {
            alert('Error adding borrowing. Please ensure inputs are correct.');
        }
    } catch(err) { console.error(err); }
});

document.getElementById('add-publisher-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const payload = {
        Name: document.getElementById('publisher-name').value,
        Address: document.getElementById('publisher-address').value
    };

    try {
        const res = await fetch(`${API_BASE_URL}/publishers`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });
        if(res.ok) {
            closeModal('publisher-modal');
            e.target.reset();
            alert('Publisher added successfully!');
        } else {
            alert('Error adding publisher');
        }
    } catch(err) { console.error(err); }
});

// Action Functions
async function deleteBook(id) {
    if(!confirm("Are you sure you want to delete this book?")) return;
    try {
        const res = await fetch(`${API_BASE_URL}/books/${id}`, { method: 'DELETE' });
        if(res.ok) {
            fetchBooks();
            fetchDashboardData();
        } else {
            const errData = await res.json();
            alert(errData.error || 'Error deleting book');
        }
    } catch(err) { console.error(err); }
}

async function deleteMember(id) {
    if(!confirm("Are you sure you want to delete this member? This will also delete their borrowing history.")) return;
    try {
        const res = await fetch(`${API_BASE_URL}/members/${id}`, { method: 'DELETE' });
        if(res.ok) {
            fetchMembers();
            fetchDashboardData();
        } else {
            alert('Error deleting member');
        }
    } catch(err) { console.error(err); }
}

async function returnBook(borrowId, bookId) {
    if(!confirm("Mark this book as returned?")) return;
    try {
        const res = await fetch(`${API_BASE_URL}/borrows/${borrowId}/return`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ Book_id: bookId })
        });
        if(res.ok) {
            fetchBorrows();
            fetchDashboardData();
            // Optional: refresh books to show availability
            if(document.getElementById('books').classList.contains('active')) {
                fetchBooks();
            }
        } else {
            alert('Error updating borrowing record');
        }
    } catch(err) { console.error(err); }
}
