import express from 'express';

var app = express();

const port = process.env.PORT  || 3001;
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// root-endpoint
app.get('/', (req, res) => {
  res.send('Welcome to the Movie API');
});


app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});