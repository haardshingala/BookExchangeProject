import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import {
  Box,
  Button,
  CardContent,
  CardMedia,
  Chip,
  Grid2,
  IconButton,
  Stack,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';



import { useTheme } from '@mui/material/styles';
import ExchangeDialog from './ExchangeDialog';

const NewBookCard = ({ book }) => {
  const theme = useTheme();
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  const handleOpen = () => setDialogOpen(true);
  const handleClose = () => setDialogOpen(false);

  const token = localStorage.getItem("token");



  const handleToggleFavorite = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/user/${isFavorite ? 'remove-favourite' : 'add-favourite'}/${book._id}`,
        {
          method: isFavorite ? 'DELETE' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          }
        }
      );

      const data = await response.json();

      if (response.ok) {
        setIsFavorite(!isFavorite);
        console.log(data.message);
      } else {
        console.error('Failed:', data.message);
      }
    } catch (err) {
      console.error('Error toggling favorite:', err);
    }
  };


  useEffect(() => {
    if (book) {
      if (book.owner?.favouriteBooks?.includes(book._id)) {
        setIsFavorite(true);

      }
    }
  }, [book])




  return (
    <>
      <Grid2 item
        size={{
          md: 3
        }}
        sx={{
          maxWidth: 320,
          margin: '20px auto',
          borderRadius: '12px',
          backgroundColor: theme.palette.background.default,
          boxShadow: '4px 4px 15px rgba(0, 0, 0, 0.2)',
          border: `2px solid ${theme.palette.secondary.main}`
        }}
      >

        <Box sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="250"
            image={`http://localhost:5000${book.coverImageURL}`}

            alt={book.title}
            sx={{
              objectFit: 'cover',
              padding: '10px',
              borderRadius: '8px',
              marginX: 'auto',
              width: '100%'
            }}

          />
          <Chip
            label={book.condition}
            size="small"
            sx={{
              position: 'absolute',
              bottom: 16,
              left: 28,
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.background.default,
              fontWeight: 'bold'
            }}
          />
        </Box>



        <CardContent sx={{ mt: -3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography
              variant="h6"
              sx={{
                color: theme.palette.primary.main,
                fontFamily: "'Playfair Display', serif",
                fontWeight: 'bold'

              }}
            >
              {book.title}
            </Typography>

            <IconButton
              onClick={handleToggleFavorite}
              sx={{
                color: isFavorite ? '#B22222' : theme.palette.primary.main,
                '&:hover': { color: '#B22222' },
                ml: 2
              }}
            >
              {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
            </IconButton>
          </Stack>

          <Typography variant="body2" color="text.secondary">
            by {book.authors.join(', ')}<br />
            <strong>Owner:</strong> {book.owner.fullName}<br />

          </Typography>


          <Button
            fullWidth
            variant="contained"
            onClick={handleOpen}
            sx={{
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.background.default,
              '&:hover': { backgroundColor: theme.palette.primary.dark || '#4B3226' },
              marginTop: '2px',

            }}
          >
            View Details
          </Button>



        </CardContent>
      </Grid2>

      <ExchangeDialog
        isOpen={isDialogOpen}
        onOpenChange={handleClose}
        book={book}
      />

    </>
  );
};

export default NewBookCard;
