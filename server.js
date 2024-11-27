import express from 'express';

var app = express();

const port = process.env.PORT || 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// root-endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Movie API');
});

// add movie genre -endpoint ------------------
app.post('/genres', (req, res) => {
  const { genre }  = req.body;
  // console.log(genre);
  // validation
  const dummyResponse = {
    id: "2",
    genre: genre,
    message: "Genre added succesfully"
  };
  // res.send('Genre added successfully');
  res.status(201).json(dummyResponse);
});


// add new movie -endpoint -------------------
app.post('/movies', (req, res) => {
  const { name, year, genre } = req.body;

  // Retrieving from the database
  const dummyGenreId = 4;

  const dummyResponse = {
    id: 3,
    name: name,
    year: year,
    genre_id : dummyGenreId,
    message: "Movie added succesfully"
  };
  // res.send('Movie added succesfully');
  res.status(201).json(dummyResponse);
});


// add registering user (accounts) -endpoint ----------------
app.post('/register', (req, res) => {
  const { name, username, password, birth_year } = req.body;

  const dummyResponse = {
    name: name,
    username: username,
    birth_year: birth_year,
    message: "User added succesfully"
  };
  // res.send('User registered successfully');
  res.status(201).json(dummyResponse);
});


// // get movie by keyword -endpoint ---------------
// app.get('/movies/search', (req, res) => {
//   res.send('Movie search completed successfully');
// });


// get movie by id -endpoint --------------
app.get('/movies/:id', (req, res) => {
  const { id } = req.params;

  const dummyResponse = {
    movie_id: id,
    message: "The movie has been retrieved succesfully"
  };

  res.status(200).json(dummyResponse);
  // res.send('Movie retrieved successfully by ID');
});


// remove movie by id -endpoint ---------------
app.delete('/movies/:id', (req, res) => {
  const { id } = req.params;

  const dummyResponse = {
    movie_id: id,
    message: "The movie has been deleted succesfully"
  };

  res.status(200).json(dummyResponse);
  // res.send('The movie has been deleted');
});


// get all movies -endpoint and get movies by keyword -endpoint ------------------
app.get('/movies', (req, res) => {
  const keyword = req.query.keyword || '';

  // dummyresponse for the all movies
  const  allMoviesResponse = [
    { id: 1, name: 'The Matrix', year: 1999, genre: 'scifi', genre_id: 5},
    { id: 2, name: 'Inception', year: 2010, genre: 'action', genre_id: 1 },
    { id: 3, name: 'Hereditary', year: 2018, genre: 'horror',  genre_id: 3 },
    { id: 4, name: 'The Godfather', year: 1972, genre: 'drama', genre_id: 2 },
    { id: 5, name: 'Tropic Thunder', year: 2008, genre: 'comedy', genre_id: 4 },
    { id: 6, name: 'The Godfather 2030', year: 2030, genre: 'drama', genre_id: 2 }
  ];

  if (keyword) {
    //  TODO: Replace this logic with a database query to fetch movies by keyword

    // dummyresponse for the keyword
    const response = [
      { id: 4, name: 'The Godfather', year: 1972, genre: 'drama', genre_id: 2 },
      { id: 6, name: 'The Godfather 2030', year: 2030, genre: 'drama', genre_id: 2 }
    ];

    res.status(200).json(response);
  } else {
    res.status(200).json(allMoviesResponse);
  }
});


// add movie review -endpoint ---------------
app.post('/reviews', (req, res) => {
  const { username, star, review, movie_id } = req.body;
  // Retrieving from the database
  const dummyAccountId = 2;

  const dummyResponse = {
    account_id: dummyAccountId,
    movie_id: movie_id,
    star: star,
    review: review,
    message: "Movie review added successfully"
  };

  // res.send('Movie review added');
  res.status(201).json(dummyResponse);
});


// add favorite movies for user -endpoint -----------------
app.post('/favorites', (req, res) => {
  const { username, movie_id } = req.body;

  const dummyAccountId = 3;

  const dummyResponse = {
    account_id: dummyAccountId,
    movie_id: movie_id,
    message: "Favorite movies added succesfully"
  };
  // res.send('Favorite movie added for user');
  res.status(201).json(dummyResponse);
});


// get favorite movies by username ----------------------
app.get('/favorites/:username', (req, res) => {
  res.send('Favorite movies retrieved by username');
});


// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
