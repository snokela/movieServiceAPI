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
  res.status(201).send(dummyResponse);
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
  res.status(201).send(dummyResponse);
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
  res.status(201).send(dummyResponse);
});


// get movie by keyword -endpoint ---------------
app.get('/movies/search', (req, res) => {
  res.send('Movie search completed successfully');
});


// get movie by id -endpoint --------------
app.get('/movies/:id', (req, res) => {
  res.send('Movie retrieved successfully by ID');
});


// remove movie by id -endpoint ---------------
app.delete('/movies/:id', (req, res) => {
  res.send('The movie has been deleted');
});


// get all movies -endpoint ------------------
app.get('/movies', (req, res) => {
  res.send('All movies retrieved succesfully');
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
  res.status(201).send(dummyResponse);
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
  res.status(201).send(dummyResponse);
});


// get favorite movies by username ----------------------
app.get('/favorites/:username', (req, res) => {
  res.send('Favorite movies retrieved by username');
});


// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
