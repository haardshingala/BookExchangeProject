import React, { useState, useEffect } from 'react';
import { Box } from '@mui/material';
import axios from 'axios';
import NewSearchFilter from './NewSearchFilter';
import NewBookCard from './NewBookCard';
import BookList from './BookList';
const API_BASE = process.env.REACT_APP_BACKEND_URL;

export default function Home() {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({ query: '', genre: 'All' });

  const fetchBooks = async () => {
    try {
      const params = {};
      if (filters.query) params.query = filters.query;
      if (filters.genre && filters.genre !== 'All') params.genre = filters.genre;

      const res = await axios.get(`${API_BASE}/book/get-all-books`, { params });
      setBooks(res.data);
    } catch (err) {
      console.error('Failed to fetch books:', err);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [filters]);

  const handleSearch = (query) => {
    setFilters((prev) => ({ ...prev, query }));
  };

  const handleFilter = ({ genre }) => {
    setFilters((prev) => ({ ...prev, genre }));
  };

  

 
  

  return (
    <>
      <NewSearchFilter
        onSearch={handleSearch}
        onFilter={handleFilter}
      />

     <BookList books={books} />
    </>
  );
}
