-- migrate:up
CREATE TABLE books_authors(
    id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    book_id INT NOT NULL,
    author_id  INT NOT NULL,
    CONSTRAINT book_authors_book_id_fkey FOREIGN KEY(book_id) REFERENCES books (id),
    CONSTRAINT book_authors_author_id_fkey FOREIGN KEY(author_id) REFERENCES authors(id)
);

-- migrate:down
DROP TABLE books_authors;
