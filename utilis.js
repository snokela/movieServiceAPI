 // check if the user exists and return ID
 export const getUserAccountId = async (pgPool, username) => {
  const result = await pgPool.query(
    `SELECT id FROM accounts WHERE username=$1`,
    [username.trim()]
  );

  if (result.rows.length === 0) {
    throw new Error('User not found');
  }
  return result.rows[0].id;
 }

  // check if the movie exists
  export const checkMovieExists = async (pgPool, movieId) => {
    const result = await pgPool.query(
      `SELECT id FROM movies WHERE id=$1`,
      [movieId]
    );

    if (result.rows.length === 0) {
      throw new Error('Movie not found');
    }
   }
