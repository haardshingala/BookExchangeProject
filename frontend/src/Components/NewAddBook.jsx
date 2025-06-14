import React, { useState } from 'react';
import { Container, TextField, Button, Typography, Box, Avatar, IconButton, Stack, MenuItem } from '@mui/material';
import { Close as CloseIcon } from '@mui/icons-material';
import { useTheme } from '@mui/material/styles';
const API_BASE = process.env.REACT_APP_BACKEND_URL;

export default function NewAddBook() {
  const theme = useTheme();
  const [bookData, setBookData] = useState({
    title: '',
    authors: [],           // now an array
    genres: [],            // now an array
    description: '',
    language: '',
    condition: '',
    image: null,           // for preview
    imageFile: null        // for uploading to backend
  });


  const handleChange = (e) => {
    const { name, value } = e.target;
    setBookData({ ...bookData, [name]: value });
  };



  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setBookData({
        ...bookData,
        image: URL.createObjectURL(file),
        imageFile: file // this is used for uploading
      });
    }
  };

  const handleImageRemove = () => {
    
    setBookData({ ...bookData, image: null, imageFile: null });

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const formData = new FormData();
    formData.append("title", bookData.title);
    formData.append("description", bookData.description);
    formData.append("condition", bookData.condition);
    formData.append("language", bookData.language);
    formData.append("authors", JSON.stringify(bookData.authors));
    formData.append("genres", JSON.stringify(bookData.genres));
  
    if (bookData.imageFile) {
      formData.append("coverImage", bookData.imageFile);
    }
  
    try {
      const token = localStorage.getItem("token");
  
      const response = await fetch(`${API_BASE}/book/add-book`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert("Book added successfully!");
        console.log(result);
        // Reset the form after success
        setBookData({
          title: '',
          authors: [],
          genres: [],
          description: '',
          language: '',
          condition: '',
          image: null,
          imageFile: null
        });
      } else {
        console.error("Failed to add book:", result);
        alert(result.message || "Failed to add book.");
      }
    } catch (err) {
      console.error("Error submitting form:", err);
      alert("Something went wrong while submitting the form.");
    }
  };
  



  return (
    <>
      <Container
        maxWidth="sm"
        sx={{
          mt: 4,
          p: 3,
          pb: 10, // Increased bottom padding for extra space
          boxShadow: theme.shadows[4],
          borderRadius: 2,
          bgcolor: theme.palette.background.default,
          border: `2px solid ${theme.palette.secondary.main}`
        }}
      >
        <Typography
          variant="h5"
          textAlign="center"
          gutterBottom
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 'bold',
            color: theme.palette.primary.main
          }}
        >
          Add a New Book
        </Typography>

        <Box component="form" onSubmit={handleSubmit} sx={{ pb: 3 }}>
          {/* Book Title */}
          <Typography sx={{ mt: 2, color: theme.palette.primary.main }}>Book Title</Typography>
          <TextField
            name="title"
            value={bookData.title}
            onChange={handleChange}
            fullWidth
            required
            size="small"
            placeholder="Enter the book's title..."
            sx={textFieldStyle(theme)}
          />

          {/* Author */}
          <Typography sx={{ mt: 2, color: theme.palette.primary.main }}>Authors</Typography>
          <TextField
            name="authors"
            value={bookData.authors.join(', ')}
            onChange={(e) =>
              setBookData({ ...bookData, authors: e.target.value.split(',').map(a => a.trim()) })
            }
            fullWidth
            size="small"
            placeholder="Enter authors, comma-separated"
            sx={textFieldStyle(theme)}
          />


          {/* Language */}
<Typography sx={{ mt: 2, color: theme.palette.primary.main }}>Language</Typography>
<TextField
  select
  name="language"
  value={bookData.language}
  onChange={handleChange}
  fullWidth
  size="small"
  sx={textFieldStyle(theme)}
>
  <MenuItem value="">Select Language</MenuItem>
  <MenuItem value="English">English</MenuItem>
  <MenuItem value="Hindi">Hindi</MenuItem>
  <MenuItem value="Spanish">Spanish</MenuItem>
  <MenuItem value="French">French</MenuItem>
  {/* Add more languages if needed */}
</TextField>

{/* Genres */}
<Typography sx={{ mt: 2, color: theme.palette.primary.main }}>Genres</Typography>
<TextField
  name="genres"
  value={bookData.genres.join(', ')}
  onChange={(e) =>
    setBookData({
      ...bookData,
      genres: e.target.value.split(',').map(g => g.trim())
    })
  }
  fullWidth
  size="small"
  placeholder="Enter genres, comma-separated (e.g., Fiction, Thriller, Mystery)"
  sx={textFieldStyle(theme)}
/>

          {/* Description */}
          <Typography sx={{ mt: 2, color: theme.palette.primary.main }}>Description</Typography>
          <TextField
            name="description"
            value={bookData.description}
            onChange={handleChange}
            multiline
            rows={3}
            fullWidth
            size="small"
            placeholder="Provide a short description of the book..."
            sx={textFieldStyle(theme)}
          />

          


          {/* Condition */}
          <Typography sx={{ mt: 2, color: theme.palette.primary.main }}>Condition</Typography>
          <TextField
            select
            name="condition"
            value={bookData.condition}
            onChange={handleChange}
            fullWidth
            size="small"
            sx={textFieldStyle(theme)}
          >
            <MenuItem value="">Select Condition</MenuItem>
            <MenuItem value="New">📖 New</MenuItem>
            <MenuItem value="Like New">✨ Like New</MenuItem>
            <MenuItem value="Very Good">👍 Very Good</MenuItem>
            <MenuItem value="Good">✅ Good</MenuItem>
            <MenuItem value="Fair">📚 Fair</MenuItem>
          </TextField>

          {/* Book Image */}
          <Typography sx={{ mt: 2, color: theme.palette.primary.main }}>Book Image</Typography>
          <Stack direction="column" spacing={2} alignItems="center" sx={{ mt: 1 }}>
            {bookData.image && (
              <Box sx={{ position: 'relative' }}>
                <Avatar
                  src={bookData.image}
                  alt="Book Preview"
                  sx={{
                    width: 160,
                    height: 160,
                    borderRadius: 2,
                    border: `2px solid ${theme.palette.secondary.main}`
                  }}
                />
                <IconButton
                  sx={{
                    position: 'absolute',
                    top: 4,
                    right: 4,
                    bgcolor: 'rgba(0, 0, 0, 0.2)',
                    color: 'white',
                    '&:hover': { bgcolor: 'rgba(0, 0, 0, 0.5)' }
                  }}
                  size="small"
                  onClick={handleImageRemove}
                >
                  <CloseIcon />
                </IconButton>
              </Box>
            )}

            <Button
              variant="contained"
              component="label"
              fullWidth
              sx={{
                maxWidth: 200,
                bgcolor: theme.palette.primary.main,
                color: theme.palette.background.default,
                '&:hover': { bgcolor: theme.palette.primary.dark || '#4B3226' }
              }}
            >
              Upload Image
              <input type="file" hidden onChange={handleImageChange} />
            </Button>
          </Stack>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 3,
              bgcolor: theme.palette.primary.main,
              color: theme.palette.background.default,
              fontWeight: 'bold',
              '&:hover': { bgcolor: theme.palette.primary.dark || '#4B3226' }
            }}
          >
            Submit
          </Button>
        </Box>
      </Container>
      {/* Extra spacing element if needed */}
      <Box sx={{ height: 40 }} />
    </>
  );
}

// Common style for text fields as a function of theme
const textFieldStyle = (theme) => ({
  bgcolor: 'white',
  borderRadius: 1,
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: theme.palette.secondary.main },
    '&:hover fieldset': { borderColor: '#9C732C' },
    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main }
  }
});


