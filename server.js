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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
