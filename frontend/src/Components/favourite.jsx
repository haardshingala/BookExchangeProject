import React, { useEffect, useState } from 'react';
import { Box, CircularProgress, Typography } from '@mui/material';
import BookList from './BookList';

export default function Favourites() {
  const [books, setBooks] = useState([]); // store books
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {  
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("https://bookexchangeplatform-3rjn.onrender.com/user/get-all-favourite-books", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const books = await response.json();
          setBooks(books);
          console.log(books);
        } else {
          const errData = await response.json();
          setError(errData.message || "Failed to fetch favorites");
        }
      } catch (error) {
        console.error("Fetch error:", error);
        setError("An error occurred while fetching favorites.");
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  if (loading) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
      {books.length === 0 ? (
        <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>
          No favorite books found.
        </Typography>
      ) : (
        <BookList  books={books} />
      )}
    </>
  );
}
