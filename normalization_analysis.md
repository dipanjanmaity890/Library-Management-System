# Normalization Analysis

This document demonstrates the normalization process for the Library Management System database up to the Third Normal Form (3NF).

## 1. First Normal Form (1NF)
**Rule:** Every table must have a primary key, and each attribute must contain atomic (indivisible) values. There must be no repeating groups.

**Analysis:**
- In our initial ER diagram, attributes like `Author` in the `Books` entity are treated as single values. We assume each book has one primary author recorded. If a book had multiple authors, it would violate 1NF and require a separate `Book_Authors` table. For the scope of this schema as defined by the ER diagram, we treat `Author` as an atomic string.
- The `Address` field in both `Publisher` and `Member` tables is treated as a single atomic string (e.g., "123 Main St, City").
- All tables have uniquely identifying Primary Keys (`Pub_ID`, `Memb_id`, `Book_id`, `Borrow_id`).
- There are no repeating groups.

**Status:** The schema is in **1NF**.

## 2. Second Normal Form (2NF)
**Rule:** The table must be in 1NF, and all non-key attributes must be fully functionally dependent on the entire primary key (no partial dependencies). Partial dependencies only apply to tables with composite primary keys.

**Analysis:**
- `Publisher`: Primary key `Pub_ID` is a single column. No partial dependencies possible.
- `Member`: Primary key `Memb_id` is a single column. No partial dependencies possible.
- `Books`: Primary key `Book_id` is a single column. No partial dependencies possible.
- `Borrows`: The primary key is the surrogate key `Borrow_id`.
  - *Note:* If we had used a composite key of `(Memb_id, Book_id, Issue_date)`, then attributes like `Due_date` and `Return_date` would depend on the *entire* composite key. Since we use a surrogate key `Borrow_id`, all attributes depend entirely on it.

**Status:** The schema is in **2NF**. Redundancy from partial dependencies is eliminated.

## 3. Third Normal Form (3NF)
**Rule:** The table must be in 2NF, and there must be no transitive dependencies (a non-key attribute depending on another non-key attribute).

**Analysis:**
- **Functional Dependencies:**
  - `Publisher`: `Pub_ID` $\rightarrow$ {`Name`, `Address`}
    - No non-key attribute determines another non-key attribute.
  - `Member`: `Memb_id` $\rightarrow$ {`Name`, `Address`, `Memb_type`, `Memb_date`, `Expiry_date`}
    - There are no transitive dependencies here.
  - `Books`: `Book_id` $\rightarrow$ {`Title`, `Price`, `Available`, `Author`, `Pub_ID`}
    - `Pub_ID` is a foreign key, but it does not functionally determine `Title`, `Price`, `Available`, or `Author`. No non-key attribute determines another.
  - `Borrows`: `Borrow_id` $\rightarrow$ {`Memb_id`, `Book_id`, `Issue_date`, `Due_date`, `Return_date`}
    - No non-key attribute determines another non-key attribute.

**Anomalies Eliminated:**
- **Insertion Anomaly:** We can add a new Publisher without needing to add a Book, because they are separate tables.
- **Deletion Anomaly:** If we delete the only Book published by a specific Publisher, we do not lose the Publisher's information.
- **Update Anomaly:** If a Publisher changes their address, we only update it in one place (the `Publisher` table), rather than updating multiple rows in the `Books` table.

**Status:** The schema is fully normalized up to **3NF**.
