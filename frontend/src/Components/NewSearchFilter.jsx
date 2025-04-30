import React, { useState } from 'react';
import { Box, TextField, Typography, InputAdornment, Paper, IconButton } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useTheme } from '@mui/material/styles';

const genres = [
  'All', 'Fiction', 'Non-Fiction', 'Mystery', 'Sci-Fi',
  'Fantasy', 'Biography', 'History', 'Self-Help'
];

const NewSearchFilter = ({ onSearch, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const theme = useTheme();

  const handleGenreClick = (genre) => {
    setSelectedGenre(genre);
    if (onFilter) onFilter({ genre });
  };

  const handleSearch = () => {
    if (onSearch) onSearch(searchTerm);
  };

  return (
    <Paper
      elevation={3}
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        p: 1.5,
        borderRadius: '12px',
        backgroundColor: theme.palette.background.default,
        border: `2px solid ${theme.palette.custom.border}`,
      }}
    >
      {/* Genre Slider Section */}
      <Box
        sx={{
          display: 'flex',
          gap: 1,
          flexWrap: 'nowrap',
          overflowX: 'auto',
          width: '50%',
          backgroundColor: theme.palette.custom.sliderBg,
          borderRadius: '8px',
          padding: '8px',
          '&::-webkit-scrollbar': { display: 'none' },
        }}
      >
        {genres.map((genre) => (
          <Typography
            key={genre}
            onClick={() => handleGenreClick(genre)}
            sx={{
              cursor: 'pointer',
              fontWeight: genre === selectedGenre ? 'bold' : 'normal',
              color: genre === selectedGenre 
                      ? theme.palette.custom.textSliderSelected 
                      : theme.palette.custom.textSliderUnselected,
              borderBottom: genre === selectedGenre 
                      ? `2px solid ${theme.palette.custom.textSliderSelected}` 
                      : 'none',
              px: 1.5,
              py: 0.5,
              whiteSpace: 'nowrap',
              transition: 'all 0.2s ease-in-out',
            }}
          >
            {genre}
          </Typography>
        ))}
      </Box>

      {/* Search Bar Section */}
      <Box sx={{ width: '50%' }}>
        <TextField
          placeholder="Search books or authors"
          fullWidth
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          InputProps={{
            sx: {
              borderRadius: '24px',
              height: 48,
              fontSize: '1rem',
              backgroundColor: 'rgba(255, 255, 255, 0.7)',
              backdropFilter: 'blur(8px)',
              border: `2px solid ${theme.palette.custom.border}`,
              pr: 1, // Space for the icon on the right
            },
            endAdornment: (
              <InputAdornment position="end">
                <IconButton onClick={handleSearch} sx={{ p: 0 }}>
                  <SearchIcon
                    sx={{ 
                      color: theme.palette.custom.textSliderSelected, 
                      '&:hover': { color: theme.palette.custom.searchIconHover } 
                    }}
                  />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Paper>
  );
};

export default NewSearchFilter;
