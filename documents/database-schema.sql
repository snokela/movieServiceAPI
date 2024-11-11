-- Active: 1730193011570@@127.0.0.1@5432@movieservice@public
CREATE TABLE genres(
    id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL
);

CREATE TABLE accounts(
    id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    username VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    birth_year INT
);

CREATE TABLE movies(
    id int NOT NULL PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    name VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    genre_id INT NOT NULL,
    FOREIGN KEY (genre_id) REFERENCES genres(id)
);

CREATE TABLE favorites(
    account_id INT NOT NULL,
    movie_id INT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (movie_id) REFERENCES movies(id),
    PRIMARY KEY (account_id, movie_id)
);

CREATE TABLE reviews(
    account_id INT NOT NULL,
    movie_id INT NOT NULL,
    star INT NOT NULL,
    review TEXT NOT NULL,
    FOREIGN KEY (account_id) REFERENCES accounts(id),
    FOREIGN KEY (movie_id) REFERENCES movies(id),
    PRIMARY KEY (account_id, movie_id)
);

--Add test data into genres-table
INSERT INTO genres (name) VALUES
  ('action'),('drama'),('horror'),('comedy'),('scifi'),('fantasy');

--Add test data into accounts-table
INSERT INTO accounts (name, username, password, birth_year) VALUES
  ('John Smith', 'johntester', 'testPassword1', 1990),
  ('Emily Johnson', 'emilytester', 'testPassword2', 1988),
  ('Michael Brown', 'miketester', 'testPassword3', 2000);

--Add test data into movies-table
INSERT INTO movies (name, year, genre_id) VALUES
  ('Hereditary', 2018, 3),
  ('The Godfather', 1972, 2),
  ('Mission: Impossible - Dead Reckoning Part One', 2023, 1),
  ('Inception', 2010, 1),
  ('Joker', 2019, 2),
  ('Tropic Thunder', 2008, 4);

--Add test data into favorites-table
INSERT INTO favorites (account_id, movie_id) VALUES
  (1, 2),
  (2, 3),
  (3, 1);

--Add test data into reviews-table
INSERT INTO reviews (account_id, movie_id, star, review) VALUES
  (2, 3, 3, 'Good action, but not the best in the series.'),
  (1, 2, 5, 'A true classic and one of the best drama movies.'),
  (2, 1, 4,  'Very intense and unsettling horror movie.'),
  (3, 5, 3, 'Dark and gripping character study with an unforgettable performance.');
