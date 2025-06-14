import api from '../api/axios'; // Adjust path as needed from components folder

import React, { useState } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Divider,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
const API_BASE = process.env.REACT_APP_BACKEND_URL;

export default function NewLogin({ setIsLoggedIn }) {
  const theme = useTheme();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { email, password } = formData; // ✅ Destructure here
  
    try {
      const response = await fetch(`${API_BASE}/user/signin`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        console.log("Login successful:", data);
        localStorage.setItem("token", data.token);
        setIsLoggedIn(true); // optional, if you are tracking login state
        alert("Logged in successfully!");
        navigate("/home"); // ✅ if you want to redirect after login
      } else {
        alert(data.message || "Login failed");
      }
    } catch (error) {
      console.error("Error during sign-in:", error);
      alert("Something went wrong. Please try again.");
    }
  };
  
      
  

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 360,
        mx: 'auto',
        mt: 6,
        p: 3,
        bgcolor: theme.palette.background.default,
        borderRadius: 2,
        border: `2px solid ${theme.palette.secondary.main}`,
        boxShadow: theme.shadows[4],
      }}
    >
      <Typography
        variant="h5"
        align="center"
        sx={{
          fontWeight: 700,
          mb: 2,
          color: theme.palette.primary.main,
        
        }}
      >
        Welcome Back
      </Typography>

      <Divider sx={{ my: 1.5, bgcolor: theme.palette.secondary.main, height: '2px' }} />

      {/* Email Field */}
      <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, color: theme.palette.primary.main }}>
        Email
      </Typography>
      <TextField
        name="email"
        type="email"
        fullWidth
        size="small"
        value={formData.email}
        onChange={handleChange}
        sx={textFieldStyle(theme)}
      />

      {/* Password Field */}
      <Typography variant="body2" sx={{ mb: 0.5, fontWeight: 500, color: theme.palette.primary.main }}>
        Password
      </Typography>
      <TextField
        name="password"
        type={showPassword ? 'text' : 'password'}
        fullWidth
        size="small"
        value={formData.password}
        onChange={handleChange}
        sx={textFieldStyle(theme)}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                sx={{ color: theme.palette.secondary.main }}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      {/* Forgot Password */}
      <Typography
        variant="body2"
        align="right"
        sx={{
          color: theme.palette.custom?.forgotPassword || '#9C732C',
          cursor: 'pointer',
          mb: 2,
          '&:hover': { textDecoration: 'underline' }
        }}
        onClick={() => navigate('/forgot-password')}
      >
        Forgot Password?
      </Typography>

      {/* Login Button */}
      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{
          py: 1,
          textTransform: 'none',
          fontSize: '1rem',
          bgcolor: theme.palette.primary.main,
          color: theme.palette.background.default,
          '&:hover': { bgcolor: theme.palette.primary.dark || '#4B3226' }
        }}
      >
        Login
      </Button>

      {/* Sign Up Option */}
      <Typography variant="body2" align="center" sx={{ mt: 2, color: theme.palette.text.secondary }}>
        Don't have an account?{' '}
        <Typography
          component="span"
          sx={{ color: theme.palette.custom?.signup || '#9C732C', cursor: 'pointer' }}
          onClick={() => navigate('/signup')}
        >
          Sign Up
        </Typography>
      </Typography>
    </Box>
  );
}

// Common text field style as a function of theme
const textFieldStyle = (theme) => ({
  bgcolor: 'white',
  borderRadius: 1,
  '& .MuiOutlinedInput-root': {
    '& fieldset': { borderColor: theme.palette.secondary.main },
    '&:hover fieldset': { borderColor: '#9C732C' },
    '&.Mui-focused fieldset': { borderColor: theme.palette.primary.main }
  }
});


