 // check if the user exists and return ID
 export const getUserAccountId = async (pqPool, username) => {
  const result = await pgPool.query(
    `SELECT id FROM accounts WHERE username=$1`,
    [username.trim()]
  );

  if (accountIdResult.rows.length === 0) {
    throw new Error ('User not found');
  }

  return result.rows[0].id;
 }

  // check if the movie exists
  export const checkMovieExist = async (pqPool, movieId) => {
    const result = await pgPool.query(
      `SELECT id FROM movies WHERE id=$1`,
      [movieId]
    );

    if (movieExistsResult.rows.length === 0) {
      throw new Error ('Movie not found');
    }
   }
