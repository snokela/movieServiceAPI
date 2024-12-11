# Movie Service REST API

## Project Overview
This project implements a Movie Service REST API with a database connection. The API is designed to manage movies, users, reviews, and genres. The project was completed as part of the Database Management and Programming course. It includes database design documents, SQL commands for schema creation, and the server code.

---

## Features

- **Genres Management:** Add movie genres.
- **Movies Management:** Add, retrieve, and delete movies. Supports keyword search and pagination.
- **User Management:** Create users.
- **Reviews Management:** Add reviews for movies (1–5 stars).
- **Favorites Management:** Add and retrieve a user's favorite movies.

---

## API Endpoints

### Root
- **GET** `/`  
  Return a welcome message.

### Genres
- **POST** `/genres`  
  Add a new movie genre.

### Movies
- **POST** `/movies`  
  Add a new movie.

- **GET** `/movies/:id`  
  Retrieve details of a specific movie by ID.

- **DELETE** `/movies/:id`  
  Delete a movie by ID.

- **GET** `/movies`  
  Retrieve all movies with pagination.

- **GET** `/movies?keyword=KEYWORD`  
  Search movies by keyword with pagination.

### Users
- **POST** `/register`  
  Register a new user.

### Reviews
- **POST** `/reviews`  
  Add a movie review.

### Favorites
- **POST** `/favorites`  
  Add a movie to a user's favorites.

- **GET** `/favorites/:username`  
  Retrieve a user's favorite movies.
