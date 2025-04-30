import React from 'react';
import { Typography, Grid2, Box } from '@mui/material';
import NewBookCard from './NewBookCard'; // This is your card component

const BookList = ({ books }) => {
  return (
    <Box sx={{ padding: 3 }}>
      {books.length > 0 ? (
        <Grid2 container spacing={3}>
          {books.map((book) => (
            <NewBookCard key={book._id} book={book} />
          ))}
        </Grid2>
      ) : (
        <Typography variant="h6" sx={{ textAlign: 'center', mt: 4, color: 'gray' }}>
          No books available.
        </Typography>
      )}
    </Box>
  );
};

export default BookList;
