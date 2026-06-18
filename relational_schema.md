# Relational Schema

Based on the provided ER diagram, the conceptual schema translates into the following relational model.

## Entities and Attributes

### 1. Publisher
- **Pub_ID**: Primary Key
- **Name**: Attribute
- **Address**: Attribute

### 2. Member
- **Memb_id**: Primary Key
- **Name**: Attribute
- **Address**: Attribute
- **Memb_type**: Attribute
- **Memb_date**: Attribute
- **Expiry_date**: Attribute

### 3. Books
- **Book_id**: Primary Key
- **Title**: Attribute
- **Price**: Attribute
- **Available**: Attribute
- **Author**: Attribute
- **Pub_ID**: Foreign Key referencing `Publisher(Pub_ID)`
  - *Cardinality*: 1:N (One publisher can publish many books, but one book is published by only one publisher).
  - *Participation*: Books must have a publisher (Total participation from the Books side).

### 4. Borrows (Junction Table)
Resolves the Many-to-Many (M:N) `Borrowed by` relationship between `Member` and `Books`.
- **Borrow_id**: Primary Key (Surrogate key introduced for transactional uniqueness, allowing a member to borrow the same book multiple times at different dates).
- **Memb_id**: Foreign Key referencing `Member(Memb_id)`
- **Book_id**: Foreign Key referencing `Books(Book_id)`
- **Issue_date**: Attribute
- **Due_date**: Attribute
- **Return_date**: Attribute

## Relational Notation

**Publisher** (<u>Pub_ID</u>, Name, Address)

**Member** (<u>Memb_id</u>, Name, Address, Memb_type, Memb_date, Expiry_date)

**Books** (<u>Book_id</u>, Title, Price, Available, Author, *Pub_ID*)

**Borrows** (<u>Borrow_id</u>, *Memb_id*, *Book_id*, Issue_date, Due_date, Return_date)
