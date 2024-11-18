import express from 'express';

var app = express();

const port = process.env.PORT  || 3001;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
