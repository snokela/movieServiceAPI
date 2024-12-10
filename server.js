import express from 'express';
import { pgPool } from './db.js';

var app = express();

const port = process.env.PORT || 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// root-endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Movie API');
});


// add movie genre -endpoint
app.post('/genres', async (req, res) => {
  const { genre } = req.body;
  // validation
  if (!genre || genre.trim() === '') {
    return res.status(400).json({ message: 'Genre  is required' });
  }

  try {
    // check if genre already exists in the db
    const existingGenreResult = await pgPool.query(
      `SELECT id FROM genres WHERE name = $1`,
      [genre.trim()]
    );

    if (existingGenreResult.rows.length > 0) {
      return res.status(409).json({ message: 'Genre already exists' })
    }

    // add genre to db
    const result = await pgPool.query(
      `INSERT INTO genres (name) VALUES ($1) RETURNING id, name AS genre `,
      [genre.trim()]
    );

    const response = result.rows[0];

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// add new movie -endpoint
app.post('/movies', async (req, res) => {
  const { name, year, genre } = req.body;

  if (!name || !year || !genre) {
    return res.status(400).json({ message: 'Name, year and genre are required' });
  }

  try {
    // check if genre exists in the db
    const genreIdResult = await pgPool.query(
      `SELECT id FROM genres WHERE name=$1`,
      [genre.trim()]
    );

    if (genreIdResult.rows.length === 0) {
      return res.status(404).json({ message: 'Genre not found' });
    }

    const genreId = genreIdResult.rows[0].id;

    // check if the movie already exists in the db
    const existingMovieResult = await pgPool.query(
      `SELECT id FROM movies WHERE name=$1 AND year=$2`,
      [name.trim(), year]
    );

    if (existingMovieResult.rows.length > 0) {
      return res.status(409).json({ message: 'Movie already exists' });
    }

    // add movie to db
    const result = await pgPool.query(
      `INSERT INTO movies (name, year, genre_id) VALUES ($1, $2, $3) RETURNING id, name, year, genre_id AS genreID`,
      [name.trim(), year, genreId]
    );

    const response = result.rows[0];

    res.status(201).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

// add registering user (accounts) -endpoint
app.post('/register', async (req, res) => {
  const { name, username, password, birthYear } = req.body;

  if (!name || !username || !password || !birthYear) {
    return res.status(400).json({ message: 'Name, username, password and birth_year are required' });
  }

  try {
    // check if user already exists in the db
    const existingUserResult = await pgPool.query(
      `SELECT id FROM accounts WHERE username = $1`,
      [username.trim()]
    );

    if (existingUserResult.rows.length > 0) {
      return res.status(409).json({ message: 'User already exists' });
    }

    //add user to db
    const result = await pgPool.query(
      `INSERT INTO accounts (name, username, password, birth_year) VALUES ($1, $2, $3, $4) RETURNING id, name, username, birth_year AS birthYear`,
      [name.trim(), username.trim(), password, birthYear]
    );

    const response = result.rows[0];

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


// get movie by id -endpoint
app.get('/movies/:id', async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: 'Movie ID must be a valid number' });

  } try {
    const result = await pgPool.query(
      `SELECT movies.id, movies.name, movies.year, movies.genre_id AS genreID, genres.name AS genre
        FROM movies
        INNER JOIN genres
        ON movies.genre_id = genres.id
        WHERE movies.id=$1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const response = result.rows[0];

    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
});

// remove movie by id -endpoint
app.delete('/movies/:id', async (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: 'Movie ID must be a valid number' });
  }

  try {
    const result = await pgPool.query(
      `DELETE FROM movies WHERE id= $1 RETURNING id`,
      [id]
    );

    // check if the movie exists in the db
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Movie does not exists' });
    }

    const response = {
      message: "The movie has been deleted succesfully",
      movieid: result.rows[0].id
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
});


// get all movies -endpoint and get movies by keyword -endpoint
app.get('/movies', async (req, res) => {
  let keyword = req.query.keyword || '';

  // TODO: Implement pagination for movie results

  try {

    let result;

    keyword = keyword.trim();
    if (!keyword) {
      result = await pgPool.query(`SELECT id, name, year, genre_id AS genreID FROM movies`);
    } else {
      keyword = '%' + keyword.toLowerCase() + '%';
      result = await pgPool.query(
        `SELECT id, name, year, genre_id AS genreID FROM movies WHERE LOWER(name) LIKE $1`,
        [keyword]
      );
    }

    const response = result.rows;

    // Check if any movies were found
    if (response.length === 0) {
      return res.status(404).json({ message: 'No movies found' })
    }

    // return movies
    res.json(response)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
});


// add movie review -endpoint ---------------
app.post('/reviews', async (req, res) => {
  const { username, star, review, movieId } = req.body;

  // validation
  if (!username || !star || !review || !movieId) {
    return res.status(400).json({ message: 'Username, star, review and movie_id are required' });
  }

  if (isNaN(Number(star)) || star < 1 || star > 5) {
    return res.status(400).json({ message: 'Star must be number between 1 and 5' });
  }

  try {
    // check if the user exists
    const accountIdResult = await pgPool.query(
      `SELECT id FROM accounts WHERE username=$1`,
      [username.trim()]
    );

    if (accountIdResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const accountId = accountIdResult.rows[0].id;

    // checking if the movie exist
    const movieExistsResult = await pgPool.query(
      `SELECT id FROM movies WHERE id=$1`,
      [movieId]
    );

    if (movieExistsResult.rows.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // add review to db
    const result = await pgPool.query(
      `INSERT INTO reviews (account_id, movie_id, star, review) VALUES ($1, $2, $3, $4) RETURNING account_id, movie_id, star, review`,
      [accountId, movieId, star, review.trim()]
    );

    const response = result.rows[0];

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
});


// add favorite movies for user -endpoint -----------------
app.post('/favorites', async (req, res) => {
  const { username, movieId } = req.body;

  if (!username || !movieId) {
    return res.status(400).json({ message: 'Username and movie_id are required' });
  }

  try {
    // check if the user exists
    const accountIdResult = await pgPool.query(
      `SELECT id FROM accounts WHERE username=$1`,
      [username.trim()]
    );

    if (accountIdResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const accountId = accountIdResult.rows[0].id;

    // check if the movie exist
    const movieExistsResult = await pgPool.query(
      `SELECT id FROM movies WHERE id=$1`,
      [movieId]
    );

    if (movieExistsResult.rows.length === 0) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // add favorite to db
    const result = await pgPool.query(
      `INSERT INTO favorites (account_id, movie_id) VALUES ($1, $2) RETURNING account_id, movie_id`,
      [accountId, movieId]
    );

    const response = result.rows[0];

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
});

// GET FAVORITE MOVIES BY USERNAME
app.get('/favorites/:username', async (req, res) => {
  const username = req.params.username;

  if (!username) {
    return res.status(400).json({ message: 'Username is required' });
  }

  try {
    // check if the user exists
    const accountIdResult = await pgPool.query(
      `SELECT id FROM accounts WHERE username=$1`,
      [username.trim()]
    );

    if (accountIdResult.rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const accountId = accountIdResult.rows[0].id;

    // get favorite movies
    const result = await pgPool.query(
      `SELECT
        m.id AS movieID,
        m.name,
        m.year,
        g.name AS genre
      FROM favorites AS f
      JOIN movies AS m ON f.movie_id = m.id
      JOIN genres AS g ON m.genre_id = g.id
      WHERE f.account_id = $1`,
      [accountId]
    );

    const favoriteMovies = result.rows;

    const response = {
      username: username,
      favorites: favoriteMovies
    };

    res.status(200).json(response);
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
