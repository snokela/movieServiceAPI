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

    const genreID = genreIdResult.rows[0].id;

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
      [name.trim(), year, genreID]
    );

    const response = result.rows[0];

    res.status(201).json(response);
  } catch (error) {
    console.log(error.message);
    res.status(500).json({ error: error.message });
  }
});

// add registering user (accounts) -endpoint ----------------
app.post('/register', async (req, res) => {
  const { name, username, password, birth_year } = req.body;

  if (!name || !username || !password || !birth_year) {
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
      [name.trim(),username.trim(), password, birth_year]
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

// remove movie by id -endpoint ---------------
app.delete('/movies/:id', (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: 'Movie ID must be a valid number' });
  }

  const response = {
    message: "The movie has been deleted succesfully",
    movie_id: id
  };

  res.status(200).json(response);
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
app.post('/reviews', (req, res) => {
  const { username, star, review, movie_id } = req.body;

  if (!username || !star || !review || !movie_id) {
    return res.status(400).json({ message: 'Username, star, review and movie_id are required' });
  }

  if (isNaN(Number(star)) || star < 1 || star > 5) {
    return res.status(400).json({ message: 'Star must be number between 1 and 5' });
  }

  // Retrieving from the database
  const dummyAccountId = 2;

  const response = {
    account_id: dummyAccountId,
    movie_id: movie_id,
    star: star,
    review: review,
  };

  res.status(201).json(response);
});


// add favorite movies for user -endpoint -----------------
app.post('/favorites', (req, res) => {
  const { username, movie_id } = req.body;

  if (!username || !movie_id) {
    return res.status(400).json({ message: 'Username and movie_id are required' });
  }

  const dummyAccountId = 3;

  // dummyresponse
  const response = {
    account_id: dummyAccountId,
    movie_id: movie_id,
  };
  res.status(201).json(response);
});


// get favorite movies by username----------------------
app.get('/favorites', (req, res) => {

  // dummyfavorites
  const favorites1 = [
    { movie_id: 1, movie: 'Inception', genre_id: 1 },
    { movie_id: 4, movie: 'Hereditary', genre_id: 3 }
  ];

  const favorites2 = [
    { movie_id: 3, movie: 'Inception', genre_id: 1 },
    { movie_id: 5, movie: 'Joker', genre_id: 2 }
  ];

  const response = [
    {
      username: 'example1',
      favorites: favorites1
    },
    {
      username: 'example2',
      favorites: favorites2
    },
  ]

  res.status(200).json(response);
});


// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
