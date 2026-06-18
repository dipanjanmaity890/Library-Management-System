# Data Dictionary

## Table: Publisher
| Column Name | Data Type | Key | Null | Description |
| :--- | :--- | :--- | :--- | :--- |
| `Pub_ID` | INT | PK | NO | Unique identifier for a publisher. |
| `Name` | VARCHAR(100) | | NO | The name of the publisher. |
| `Address` | VARCHAR(255) | | YES | The physical address of the publisher. |

## Table: Member
| Column Name | Data Type | Key | Null | Description |
| :--- | :--- | :--- | :--- | :--- |
| `Memb_id` | INT | PK | NO | Unique identifier for a member. |
| `Name` | VARCHAR(100) | | NO | The full name of the member. |
| `Address` | VARCHAR(255) | | YES | The residential address of the member. |
| `Memb_type` | VARCHAR(50) | | NO | Type of membership (e.g., Student, Faculty, Regular). |
| `Memb_date` | DATE | | NO | The date the membership was activated. |
| `Expiry_date` | DATE | | NO | The date the membership expires. |

## Table: Books
| Column Name | Data Type | Key | Null | Description |
| :--- | :--- | :--- | :--- | :--- |
| `Book_id` | INT | PK | NO | Unique identifier for a book. |
| `Title` | VARCHAR(255) | | NO | The title of the book. |
| `Price` | DECIMAL(10,2)| | YES | The price/cost of the book. |
| `Available` | BOOLEAN | | NO | Availability status (1/TRUE = Available, 0/FALSE = Borrowed). |
| `Author` | VARCHAR(100) | | NO | The author of the book. |
| `Pub_ID` | INT | FK | NO | Foreign key linking to Publisher. |

## Table: Borrows
| Column Name | Data Type | Key | Null | Description |
| :--- | :--- | :--- | :--- | :--- |
| `Borrow_id` | INT | PK | NO | Unique transaction identifier for the borrowing record. |
| `Memb_id` | INT | FK | NO | Foreign key linking to the Member who borrowed the book. |
| `Book_id` | INT | FK | NO | Foreign key linking to the Borrowed Book. |
| `Issue_date`| DATE | | NO | The date the book was issued/borrowed. |
| `Due_date` | DATE | | NO | The expected return date. |
| `Return_date`| DATE | | YES | The actual return date (NULL if not returned yet). |
