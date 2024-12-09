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
  const genre = req.body.genre;
  // validation
  if (!genre || genre.trim() === '') {
    return res.status(400).json({ message: 'Genre  is required' });
  }

  try {
    // add genre to db and return the added row data
    const result = await pgPool.query(
      `INSERT INTO genres (name) VALUES ($1) RETURNING id, name `,
      [genre.trim()]
    );

    // response object
    const response = {
      id: result.rows[0].id,
      genre: result.rows[0].name,
    };

    res.status(201).json(response);
  } catch (error) {
    res.status(500).json({error: error.message});
  }
});


// add new movie -endpoint -------------------
app.post('/movies', (req, res) => {
  const { name, year, genre } = req.body;

  if (!name || !year || !genre) {
    return res.status(400).json({ message: 'Name, year and genre are required' });
  }

  // Retrieving genreID from the database
  const dummyGenreId = 4;

  const response = {
    id: 3,
    name: name,
    year: year,
    genre_id: dummyGenreId,
  };

  res.status(201).json(response);
});


// add registering user (accounts) -endpoint ----------------
app.post('/register', (req, res) => {
  const { name, username, password, birth_year } = req.body;

  if (!name || !username || !password || !birth_year) {
    return res.status(400).json({ message: 'Name, username, password and birth_year are required' });
  }

  // dummyresponse
  const response = {
    name: name,
    username: username,
    birth_year: birth_year,
  };

  res.status(201).json(response);
});


// get movie by id -endpoint --------------
app.get('/movies/:id', (req, res) => {
  const { id } = req.params;

  if (!id || isNaN(Number(id))) {
    return res.status(400).json({ message: 'Movie ID must be a valid number' });
  }

  // dummyresponse
  const response = {
    id: 1,
    name: 'The Matrix',
    year: 1999,
    genre: 'scifi',
    genre_id: 5
  };

  res.status(200).json(response);
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
    }else {
      keyword = '%' + keyword.toLowerCase() + '%';
      result = await pgPool.query(
        `SELECT id, name, year, genre_id AS genreID FROM movies WHERE LOWER(name) LIKE $1`,
        [keyword]
      );
    }

    const response = result.rows;

    // Check if any movies were found
    if (response.length === 0) {
      return res.status(404).json({ message: 'No movies found'})
    }

    // return movies
    res.json(response)
  } catch (error) {
    res.status(500).json({ error: error.message})
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
