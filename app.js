const API_BASE_URL = 'https://library-backend-1023917364005.us-central1.run.app/api';

// Navigation Logic
document.querySelectorAll('.nav-links li').forEach(item => {
    item.addEventListener('click', (e) => {
        document.querySelectorAll('.nav-links li').forEach(li => li.classList.remove('active'));
        e.target.classList.add('active');
        
        document.querySelectorAll('.content-section').forEach(sec => sec.classList.remove('active'));
        
        const target = e.target.getAttribute('data-target');
        document.getElementById(target).classList.add('active');

        if(target === 'dashboard') fetchDashboardData();
        else if(target === 'books') fetchBooks();
        else if(target === 'members') fetchMembers();
        else if(target === 'borrows') fetchBorrows();
        else if(target === 'publishers') fetchPublishersGrid();
        else if(target === 'categories') fetchCategoriesGrid();
        else if(target === 'authors') fetchAuthorsGrid();
        else if(target === 'librarians') fetchLibrariansGrid();
        else if(target === 'fines') fetchFinesGrid();
    });
});

const formatDate = (dateString) => {
    if (!dateString) return 'Not Returned';
    return new Date(dateString).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
};

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
        }
    } catch (error) {
        badge.textContent = 'Server Offline';
        badge.className = 'db-status disconnected';
    }
}
checkConnectionStatus();
fetchDashboardData();
setInterval(checkConnectionStatus, 10000);

async function fetchDashboardData() {
    try {
        const [booksRes, membersRes, borrowsRes] = await Promise.all([
            fetch(`${API_BASE_URL}/books`), fetch(`${API_BASE_URL}/members`), fetch(`${API_BASE_URL}/borrows`)
        ]);
        const books = await booksRes.json();
        const members = await membersRes.json();
        const borrows = await borrowsRes.json();

        document.getElementById('total-books').textContent = books.length || 0;
        document.getElementById('total-members').textContent = members.length || 0;
        document.getElementById('active-borrows').textContent = borrows.filter(b => b.return_date === null).length || 0;
    } catch (error) { console.error(error); }
}

// --- Fetching Logic for Grids ---
async function fetchBooks() {
    try {
        const res = await fetch(`${API_BASE_URL}/books`);
        const books = await res.json();
        const tbody = document.querySelector('#books-table tbody');
        tbody.innerHTML = '';
        books.forEach(book => {
            tbody.innerHTML += `
                <tr>
                    <td>#${book.book_id}</td>
                    <td><strong>${book.title}</strong></td>
                    <td>${book.author}</td>
                    <td>${book.category || 'N/A'}</td>
                    <td>${book.available_copies}</td>
                    <td>${book.publisher}</td>
                    <td><button class="btn-danger" style="padding:0.3rem 0.6rem;" onclick="deleteRecord('books', ${book.book_id}, fetchBooks)">Delete</button></td>
                </tr>
            `;
        });
    } catch (error) { console.error(error); }
}

async function fetchMembers() {
    try {
        const res = await fetch(`${API_BASE_URL}/members`);
        const members = await res.json();
        const tbody = document.querySelector('#members-table tbody');
        tbody.innerHTML = '';
        members.forEach(member => {
            tbody.innerHTML += `
                <tr>
                    <td>#${member.memb_id}</td>
                    <td><strong>${member.name}</strong></td>
                    <td>${member.memb_type}</td>
                    <td>${member.email || 'N/A'}</td>
                    <td><button class="btn-danger" style="padding:0.3rem 0.6rem;" onclick="deleteRecord('members', ${member.memb_id}, fetchMembers)">Delete</button></td>
                </tr>
            `;
        });
    } catch (error) { console.error(error); }
}

async function fetchBorrows() {
    try {
        const res = await fetch(`${API_BASE_URL}/borrows`);
        const borrows = await res.json();
        const tbody = document.querySelector('#borrows-table tbody');
        tbody.innerHTML = '';
        borrows.forEach(borrow => {
            const isReturned = borrow.return_date !== null;
            const statusClass = isReturned ? 'available' : 'borrowed';
            const statusText = isReturned ? 'Returned' : 'Active';
            tbody.innerHTML += `
                <tr>
                    <td>#${borrow.borrow_id}</td>
                    <td>${borrow.member_name}</td>
                    <td><strong>${borrow.book_title}</strong></td>
                    <td>${formatDate(borrow.issue_date)}</td>
                    <td>${borrow.librarian_name || 'N/A'}</td>
                    <td><span class="status ${statusClass}">${statusText}</span></td>
                    <td>
                        ${isReturned ? '<span style="color:var(--text-secondary)">-</span>' : `<button class="btn-success" style="padding:0.3rem 0.6rem;" onclick="returnBook(${borrow.borrow_id}, ${borrow.book_id})">Mark Returned</button>`}
                    </td>
                </tr>
            `;
        });
    } catch (error) { console.error(error); }
}

async function fetchPublishersGrid() {
    try {
        const res = await fetch(`${API_BASE_URL}/publishers`);
        const data = await res.json();
        const tbody = document.querySelector('#publishers-table tbody');
        tbody.innerHTML = '';
        data.forEach(item => {
            tbody.innerHTML += `<tr>
                <td>#${item.pub_id}</td><td><strong>${item.pub_name}</strong></td><td>${item.address || ''}</td>
                <td><button class="btn-danger" style="padding:0.3rem 0.6rem;" onclick="deleteRecord('publishers', ${item.pub_id}, fetchPublishersGrid)">Delete</button></td>
            </tr>`;
        });
    } catch (error) { console.error(error); }
}

async function fetchCategoriesGrid() {
    try {
        const res = await fetch(`${API_BASE_URL}/categories`);
        const data = await res.json();
        const tbody = document.querySelector('#categories-table tbody');
        tbody.innerHTML = '';
        data.forEach(item => {
            tbody.innerHTML += `<tr>
                <td>#${item.category_id}</td><td><strong>${item.category_name}</strong></td>
                <td><button class="btn-danger" style="padding:0.3rem 0.6rem;" onclick="deleteRecord('categories', ${item.category_id}, fetchCategoriesGrid)">Delete</button></td>
            </tr>`;
        });
    } catch (error) { console.error(error); }
}

async function fetchAuthorsGrid() {
    try {
        const res = await fetch(`${API_BASE_URL}/authors`);
        const data = await res.json();
        const tbody = document.querySelector('#authors-table tbody');
        tbody.innerHTML = '';
        data.forEach(item => {
            tbody.innerHTML += `<tr>
                <td>#${item.author_id}</td><td><strong>${item.author_name}</strong></td><td>${item.country || ''}</td>
                <td><button class="btn-danger" style="padding:0.3rem 0.6rem;" onclick="deleteRecord('authors', ${item.author_id}, fetchAuthorsGrid)">Delete</button></td>
            </tr>`;
        });
    } catch (error) { console.error(error); }
}

async function fetchLibrariansGrid() {
    try {
        const res = await fetch(`${API_BASE_URL}/librarians`);
        const data = await res.json();
        const tbody = document.querySelector('#librarians-table tbody');
        tbody.innerHTML = '';
        data.forEach(item => {
            tbody.innerHTML += `<tr>
                <td>#${item.librarian_id}</td><td><strong>${item.librarian_name}</strong></td><td>${item.email}</td><td>${item.phone || ''}</td>
                <td><button class="btn-danger" style="padding:0.3rem 0.6rem;" onclick="deleteRecord('librarians', ${item.librarian_id}, fetchLibrariansGrid)">Delete</button></td>
            </tr>`;
        });
    } catch (error) { console.error(error); }
}

async function fetchFinesGrid() {
    try {
        const res = await fetch(`${API_BASE_URL}/fines`);
        const data = await res.json();
        const tbody = document.querySelector('#fines-table tbody');
        tbody.innerHTML = '';
        data.forEach(item => {
            const statusClass = item.status === 'Paid' ? 'available' : 'borrowed';
            tbody.innerHTML += `<tr>
                <td>#${item.fine_id}</td><td>Borrow #${item.borrow_id}</td><td>$${item.amount}</td>
                <td><span class="status ${statusClass}">${item.status}</span></td>
                <td><button class="btn-danger" style="padding:0.3rem 0.6rem;" onclick="deleteRecord('fines', ${item.fine_id}, fetchFinesGrid)">Delete</button></td>
            </tr>`;
        });
    } catch (error) { console.error(error); }
}


// --- Modals ---
function openModal(modalId) {
    document.getElementById(modalId).classList.add('active');
    if(modalId === 'book-modal') {
        fetchPublishersForSelect(); fetchCategoriesForSelect();
    } else if(modalId === 'borrow-modal') {
        fetchMembersForSelect(); fetchAvailableBooksForSelect(); fetchLibrariansForSelect();
    }
}

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal-overlay')) event.target.classList.remove('active');
}

// Select Populators
async function fetchPublishersForSelect() {
    try {
        const res = await fetch(`${API_BASE_URL}/publishers`);
        const data = await res.json();
        const select = document.getElementById('book-publisher');
        select.innerHTML = '<option value="">Select...</option>';
        data.forEach(pub => select.innerHTML += `<option value="${pub.pub_id}">${pub.pub_name}</option>`);
    } catch (err) { console.error(err); }
}
async function fetchCategoriesForSelect() {
    try {
        const res = await fetch(`${API_BASE_URL}/categories`);
        const data = await res.json();
        const select = document.getElementById('book-category');
        select.innerHTML = '<option value="">Select...</option>';
        data.forEach(cat => select.innerHTML += `<option value="${cat.category_id}">${cat.category_name}</option>`);
    } catch (err) { console.error(err); }
}
async function fetchMembersForSelect() {
    try {
        const res = await fetch(`${API_BASE_URL}/members`);
        const data = await res.json();
        const select = document.getElementById('borrow-member');
        select.innerHTML = '<option value="">Select...</option>';
        data.forEach(m => select.innerHTML += `<option value="${m.memb_id}">${m.name}</option>`);
    } catch (err) { console.error(err); }
}
async function fetchAvailableBooksForSelect() {
    try {
        const res = await fetch(`${API_BASE_URL}/books`);
        const data = await res.json();
        const select = document.getElementById('borrow-book');
        select.innerHTML = '<option value="">Select...</option>';
        data.forEach(b => { if(b.available_copies > 0) select.innerHTML += `<option value="${b.book_id}">${b.title}</option>`; });
    } catch (err) { console.error(err); }
}
async function fetchLibrariansForSelect() {
    try {
        const res = await fetch(`${API_BASE_URL}/librarians`);
        const data = await res.json();
        const select = document.getElementById('borrow-librarian');
        select.innerHTML = '<option value="">Select...</option>';
        data.forEach(l => select.innerHTML += `<option value="${l.librarian_id}">${l.librarian_name}</option>`);
    } catch (err) { console.error(err); }
}

// --- Submit Handlers ---
async function handleFormSubmit(e, endpoint, payload, modalId, refreshFunc) {
    e.preventDefault();
    try {
        const res = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
        });
        if(res.ok) {
            closeModal(modalId);
            e.target.reset();
            refreshFunc();
        } else {
            const data = await res.json();
            alert('Error: ' + (data.error || 'Unknown error'));
        }
    } catch(err) { console.error(err); }
}

document.getElementById('add-book-form').addEventListener('submit', (e) => handleFormSubmit(e, 'books', {
    title: document.getElementById('book-title').value, author: document.getElementById('book-author').value,
    price: document.getElementById('book-price').value, available_copies: document.getElementById('book-copies').value,
    pub_id: document.getElementById('book-publisher').value, category_id: document.getElementById('book-category').value
}, 'book-modal', () => { fetchBooks(); fetchDashboardData(); }));

document.getElementById('add-member-form').addEventListener('submit', (e) => handleFormSubmit(e, 'members', {
    name: document.getElementById('member-name').value, email: document.getElementById('member-email').value,
    address: document.getElementById('member-address').value, memb_type: document.getElementById('member-type').value
}, 'member-modal', () => { fetchMembers(); fetchDashboardData(); }));

document.getElementById('add-borrow-form').addEventListener('submit', (e) => handleFormSubmit(e, 'borrows', {
    memb_id: document.getElementById('borrow-member').value, book_id: document.getElementById('borrow-book').value,
    librarian_id: document.getElementById('borrow-librarian').value
}, 'borrow-modal', () => { fetchBorrows(); fetchDashboardData(); }));

document.getElementById('add-publisher-form').addEventListener('submit', (e) => handleFormSubmit(e, 'publishers', {
    pub_name: document.getElementById('publisher-name').value, address: document.getElementById('publisher-address').value
}, 'publisher-modal', fetchPublishersGrid));

document.getElementById('add-category-form').addEventListener('submit', (e) => handleFormSubmit(e, 'categories', {
    category_name: document.getElementById('category-name').value
}, 'category-modal', fetchCategoriesGrid));

document.getElementById('add-author-form').addEventListener('submit', (e) => handleFormSubmit(e, 'authors', {
    author_name: document.getElementById('author-name').value, country: document.getElementById('author-country').value
}, 'author-modal', fetchAuthorsGrid));

document.getElementById('add-librarian-form').addEventListener('submit', (e) => handleFormSubmit(e, 'librarians', {
    librarian_name: document.getElementById('librarian-name').value, email: document.getElementById('librarian-email').value,
    phone: document.getElementById('librarian-phone').value
}, 'librarian-modal', fetchLibrariansGrid));

document.getElementById('add-fine-form').addEventListener('submit', (e) => handleFormSubmit(e, 'fines', {
    borrow_id: document.getElementById('fine-borrow-id').value, amount: document.getElementById('fine-amount').value,
    status: document.getElementById('fine-status').value
}, 'fine-modal', fetchFinesGrid));

// --- Action Functions ---
async function deleteRecord(endpoint, id, refreshFunc) {
    if(!confirm("Are you sure you want to delete this?")) return;
    try {
        const res = await fetch(`${API_BASE_URL}/${endpoint}/${id}`, { method: 'DELETE' });
        if(res.ok) {
            refreshFunc();
            if(endpoint === 'books' || endpoint === 'members' || endpoint === 'borrows') fetchDashboardData();
        } else {
            const errData = await res.json();
            alert('Error deleting: ' + (errData.error || 'Foreign Key Constraint'));
        }
    } catch(err) { console.error(err); }
}

async function returnBook(borrowId, bookId) {
    if(!confirm("Mark this book as returned?")) return;
    try {
        const res = await fetch(`${API_BASE_URL}/borrows/${borrowId}/return`, {
            method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ book_id: bookId })
        });
        if(res.ok) {
            fetchBorrows(); fetchDashboardData();
        } else { alert('Error updating borrowing record'); }
    } catch(err) { console.error(err); }
}
