import express from 'express';

var app = express();

const port = process.env.PORT || 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// root-endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Movie API');
});

// add movie genre -endpoint
app.post('/genres', (req, res) => {
  res.send('Genre added successfully');
});

// add new movie -endpoint
app.post('/movies', (req, res) => {
  res.send('Movie added succesfully');
});

// add registering user (accounts) -endpoint
app.post('/register', (req, res) => {
  res.send('User registered successfully');
});

// get movie by keyword -endpoint
app.get('/movies/search', (req, res) => {
  res.send('Movie search completed successfully');
});

// get movie by id -endpoint
app.get('/movies/:id', (req, res) => {
  res.send('Movie retrieved successfully by ID');
});

// remove movie by id -endpoint
app.delete('/movies/:id', (req, res) => {
  res.send('The movie has been deleted');
});

// get all movies -endpoint
app.get('/movies', (req, res) => {
  res.send('All movies retrieved succesfully');
});

// add movie review -endpoint
app.post('/reviews', (req, res) => {
  res.send('Movie review added');
});

// add favorite movies for user -endpoint
app.post('/favorites', (req, res) => {
  res.send('Favorite movie added for user');
});

// get favorite movies by username
app.get('/favorites/:username', (req, res) => {
  res.send('Favorite movies retrieved by username');
});

// Start the server and listen on the specified port
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
