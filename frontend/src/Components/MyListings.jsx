import React, { useEffect, useState } from 'react';
import {
  Card, CardContent, CardMedia, Typography, Button, Box, Stack, IconButton, Dialog, DialogTitle,
  DialogContent, DialogActions, TextField, Grid, Avatar, MenuItem
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { API_BASE } from "../utils/api";
import { LANGUAGE_OPTIONS, CONDITION_OPTIONS } from "../constants/bookOptions";


export default function MyListings() {
  const [books, setBooks] = useState([]);
  const [editBook, setEditBook] = useState(null);
  const [selectedCoverFile, setselectedCoverFile] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch(`${API_BASE}/user/MyListings`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setBooks(data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchBooks();
  }, []);

  const handleDelete = async (bookId) => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(`${API_BASE}/book/delete-book/${bookId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 204) {
        setBooks(prev => prev.filter(book => book._id !== bookId));
        setConfirmDeleteId(null);
        alert("Book deleted successfully!");
      } 
      else {
        const errorMsg = await response.text();
        alert(errorMsg || "Failed to delete book.");
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert("An error occurred while deleting the book.");
    }
  };

  const handleImageChange = (e) => {
    setselectedCoverFile(e.target.files[0]);
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    

    /* ---------- 1. Build FormData ---------- */
    const fd = new FormData();

    // Text fields → append directly
    fd.append("title", editBook.title);
    fd.append("description", editBook.description);
    fd.append("condition", editBook.condition);
    fd.append("language", editBook.language);

    // Arrays / objects → stringify
   
fd.append("authors", JSON.stringify(editBook.authors));
fd.append("genres",  JSON.stringify(editBook.genres));  // []

    // Optional new cover image
    if (selectedCoverFile) {
      fd.append("coverImage", selectedCoverFile);
    }

    try {
      const res = await fetch(
        `${API_BASE}/book/update-book/${editBook._id}`,   
        {
          method: "PUT",
          headers: { Authorization: `Bearer ${token}` },
          body: fd,                    // <-- FormData, not JSON
        }
      );

      if (!res.ok) throw new Error("Failed");

      const updated = await res.json();
      setBooks(prev =>
        prev.map(book => (book._id === updated._id ? updated : book))
      );
      setEditBook(null);
      alert("Book updated!");
    } catch (err) {
      console.error("Update error:", err);
      alert("Failed to update book.");
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" gutterBottom>My Listings</Typography>

      {books.length === 0 ? (
        <Typography>No books listed yet.</Typography>
      ) : (
        <Stack spacing={2}>
          {books.map(book => (
            <Card key={book._id} sx={{ display: 'flex', borderRadius: 3, boxShadow: 3, overflow: 'hidden' }}>
              <CardMedia
                component="img"
                sx={{ width: 150 }}
                image={book.coverImageURL.url} // Correct path
                alt={book.title}
              />
              <CardContent sx={{ flex: 1 }}>
                <Typography variant="h6">{book.title}</Typography>
                <Typography variant="body2">Author: {book.authors}</Typography>
                <Typography variant="body2">Genre: {book.genres}</Typography>
                <Typography variant="body2">Condition: {book.condition}</Typography>
                <Typography variant="body2">Language: {book.language}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>{book.description}</Typography>
              </CardContent>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', pr: 2 }}>
                <IconButton onClick={() => setEditBook(book)}>
                  <EditIcon color="primary" />
                </IconButton>
                <IconButton onClick={() => setConfirmDeleteId(book._id)}>
                  <DeleteIcon color="error" />
                </IconButton>
              </Box>
            </Card>
          ))}
        </Stack>
      )}

      {/* Edit Modal */}
      <Dialog open={Boolean(editBook)} onClose={() => setEditBook(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Book</DialogTitle>
        <DialogContent>
        {console.log(editBook)}
        <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
            <Box sx={{ position: "relative", width: "fit-content" }}>
              <CardMedia
              component="img"
                src={
                  selectedCoverFile
                    ? URL.createObjectURL(selectedCoverFile)
                    : editBook?.coverImageURL?.url || "/images/default-avatar.jpeg"
                }
                alt={editBook?.title}
                sx={{ width: 140, height: 190 , objectFit: "cover",  //  ← crop to fill the box
    borderRadius: 1, }}
              />
        
              <IconButton
                component="label"
                sx={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  backgroundColor: "#fff",
                  boxShadow: 2,
                  "&:hover": { backgroundColor: "#f5f5f5" }
                }}
              >
                <PhotoCamera sx={{ fontSize: 20 }} />
                <input hidden type="file" accept="image/*" onChange={handleImageChange} />
              </IconButton>
            </Box>
          </Box>
          {editBook && (
            <Grid container spacing={2} sx={{ mt: 1 }}>
              <Grid item xs={12}>
                <TextField fullWidth label="Title" value={editBook.title}
                  onChange={e => setEditBook({ ...editBook, title: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Author" value={editBook.authors}
                  onChange={e => setEditBook({ ...editBook, authors: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <TextField fullWidth label="Genre" value={editBook.genres}
                  onChange={e => setEditBook({ ...editBook, genres: e.target.value })} />
              </Grid>
              <Grid item xs={6}>
                <TextField select fullWidth label="Condition" value={editBook.condition}
                  onChange={e => setEditBook({ ...editBook, condition: e.target.value })} >
                   {CONDITION_OPTIONS.map(opt => (
        <MenuItem key={opt} value={opt}>
          {opt}
        </MenuItem>
      ))}
                  </TextField>
              </Grid>
              <Grid item xs={6}>
                <TextField select fullWidth label="Language" value={editBook.language}
                  onChange={e => setEditBook({ ...editBook, language: e.target.value })} >
                  {LANGUAGE_OPTIONS.map(opt => (
        <MenuItem key={opt} value={opt}>
          {opt}
        </MenuItem>
      ))}
      </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField fullWidth label="Description" multiline rows={3}
                  value={editBook.description}
                  onChange={e => setEditBook({ ...editBook, description: e.target.value })} />
              </Grid>
            </Grid>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditBook(null)}>Cancel</Button>
          <Button onClick={handleUpdate} variant="contained" color="primary">Update</Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog open={Boolean(confirmDeleteId)} onClose={() => setConfirmDeleteId(null)}>
        <DialogTitle>Are you sure you want to delete this book?</DialogTitle>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
          <Button onClick={() => handleDelete(confirmDeleteId)} color="error" variant="contained">Delete</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
