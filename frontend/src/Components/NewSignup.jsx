import React, { useState, useRef } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  IconButton,
  InputAdornment,
} from '@mui/material';
import {
  Visibility,
  VisibilityOff,
  CloudUpload,
  Close,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import axios from 'axios';
const API_BASE = process.env.REACT_APP_BACKEND_URL;

export default function NewSignUp() {
  const theme = useTheme();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    interests: [],
    bio: '',
    profileImage: null,
    city: '',
    address: '',
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleDropAreaClick = () => fileInputRef.current?.click();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfilePicChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData((prev) => ({ ...prev, profileImage: e.target.files[0] }));
    }
  };

  const removeProfilePic = () => {
    setFormData((prev) => ({ ...prev, profileImage: null }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const { password, confirmPassword } = formData;
    if (password !== confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
  
    try {
      const submitData = new FormData();
      submitData.append('fullName', formData.fullName);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('city', formData.city);
      submitData.append('address', formData.address);
      submitData.append('bio', formData.bio);
      submitData.append('interests', JSON.stringify(formData.interests)); // match backend spelling
  
      if (formData.profileImage) {
        submitData.append('profileImage', formData.profileImage); // match backend key
      }
  
      const response = await axios.post(
      `${API_BASE}/user/signup`,
        submitData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      alert('Signup successful!');
      navigate('/login');
    } catch (error) {
      console.error('Signup error:', error.response?.data || error.message);
      alert('Signup failed');
    }
  };
  

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 5,
        p: 4,
        bgcolor: theme.palette.background.default,
        borderRadius: '12px',
        boxShadow: theme.shadows[4],
        border: `2px solid ${theme.palette.primary.dark || '#8B5E3C'}`,
      }}
    >
      <Typography variant="h5" align="center" sx={{ fontWeight: 700, mb: 2, color: theme.palette.primary.main }}>
        Sign Up
      </Typography>

      <TextField
        label="Full Name"
        name="fullName"
        value={formData.fullName}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />

      <TextField
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />

      <TextField
        label="Password"
        name="password"
        type={showPassword ? 'text' : 'password'}
        value={formData.password}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />

      <TextField
        label="Confirm Password"
        name="confirmPassword"
        type="password"
        value={formData.confirmPassword}
        onChange={handleChange}
        fullWidth
        margin="normal"
        required
      />

      <TextField
        label="Bio"
        name="bio"
        value={formData.bio}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={3}
      />

<TextField
      label="Interests (comma-separated)"
      name="interests"
      value={formData.interests.join(', ')}
      onChange={(e) => {
        const values = e.target.value.split(',').map((item) => item.trim());
        setFormData((prev) => ({ ...prev, interests: values }));
      }}
      fullWidth
      margin="normal"
    />

       
       <TextField
        label="City"
        name="city"
        value={formData.city}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={1}
      />

<TextField
        label="Address"
        name="address"
        value={formData.address}
        onChange={handleChange}
        fullWidth
        margin="normal"
        multiline
        rows={2}
      />


      <Box
        sx={{
          mt: 2,
          mb: 2,
          p: 2,
          border: '2px dashed #aaa',
          borderRadius: '8px',
          textAlign: 'center',
          cursor: 'pointer',
        }}
        onClick={handleDropAreaClick}
      >
        {formData.profileImage ? (
          <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Avatar
              src={URL.createObjectURL(formData.profileImage)}
              alt="Profile Preview"
              sx={{ width: 80, height: 80, margin: 'auto' }}
            />
            <IconButton
              size="small"
              onClick={removeProfilePic}
              sx={{ position: 'absolute', top: 0, right: 0 }}
            >
              <Close />
            </IconButton>
          </Box>
        ) : (
          <>
            <CloudUpload fontSize="large" />
            <Typography>Click to upload profile picture</Typography>
          </>
        )}
        <input
          type="file"
          accept="image/*"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleProfilePicChange}
        />
      </Box>

      <Button
        type="submit"
        variant="contained"
        fullWidth
        sx={{ mt: 2, fontWeight: 'bold' }}
      >
        Register
      </Button>
    </Box>
  );
}
