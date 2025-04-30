import React, { useState , useEffect} from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import ChatIcon from '@mui/icons-material/Chat';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AddIcon from '@mui/icons-material/Add';
import LogoutIcon from '@mui/icons-material/Logout';
import HomeIcon from '@mui/icons-material/Home';
import LoginIcon from '@mui/icons-material/Login';
import PersonAddIcon from '@mui/icons-material/PersonAdd';


import { useNavigate } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';

export default function NewNavbar({ setIsLoggedIn, isLoggedIn }) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [user, setUser] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLogin = () => navigate('/login');
  const handleSignup = () => navigate('/signup');
  const handleLogout = () => {
    setIsLoggedIn(false);
    navigate('/');
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) return;
    setDrawerOpen(open);
  };

  const token = localStorage.getItem("token");
  
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) return;
  
      try {
        const res = await fetch("https://bookexchangeplatform-3rjn.onrender.com/user/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
  
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        } else {
          console.error("Failed to fetch profile:", res.statusText);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
  
    fetchProfile();
  }, [token]);
  

    

  const drawerContent = (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        width: 250,
        bgcolor: theme.palette.background.default,
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        <ListItem button onClick={() => navigate('/')}>
          <ListItemIcon sx={{ color: theme.palette.secondary.main }}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
        <ListItem button onClick={() => navigate('/add-book')}>
          <ListItemIcon sx={{ color: theme.palette.secondary.main }}>
            <AddIcon />
          </ListItemIcon>
          <ListItemText primary="Add Book" />
        </ListItem>
        <ListItem button onClick={() => navigate('/my-listings')}>
          <ListItemIcon sx={{ color: theme.palette.secondary.main }}>
            <ListAltIcon />
          </ListItemIcon>
          <ListItemText primary="My Listings" />
        </ListItem>
        <ListItem button onClick={() => navigate('/profile')}>
          <ListItemIcon sx={{ color: theme.palette.secondary.main }}>
            <AccountCircleIcon />
          </ListItemIcon>
          <ListItemText primary="Profile" />
        </ListItem>
        <ListItem button onClick={() => navigate('/favourites')}>
          <ListItemIcon sx={{ color: theme.palette.secondary.main }}>
            <FavoriteIcon />
          </ListItemIcon>
          <ListItemText primary="Favourites" />
        </ListItem>
        <ListItem button onClick={() => navigate('/exchange-requests')}>
          <ListItemIcon sx={{ color: theme.palette.secondary.main }}>
            <SwapHorizIcon />
          </ListItemIcon>
          <ListItemText primary="Exchange Requests" />
        </ListItem>
        <ListItem button onClick={() => navigate('/chats')}>
          <ListItemIcon sx={{ color: theme.palette.secondary.main }}>
            <ChatIcon />
          </ListItemIcon>
          <ListItemText primary="Chats" />
        </ListItem>
      </List>

      <Divider />
      <Box sx={{ flexGrow: 1 }} />
      <Box
        sx={{
          p: 2,
          borderTop: '1px solid #ccc',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        <Avatar alt={user?.fullName} src={`https://bookexchangeplatform-3rjn.onrender.com${user?.profileImageURL}`} sx={{ mr: 1 }} />
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          {user?.fullName}
        </Typography>
        <IconButton onClick={handleLogout} sx={{ color: theme.palette.secondary.main }}>
          <LogoutIcon />
        </IconButton>
      </Box>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          backgroundColor: theme.palette.primary.main,
          width: '100%',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 10,
        }}
      >
        <Toolbar sx={{ px: 3 }}>
          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              fontWeight: 'bold',
              color: theme.palette.background.default,
              fontFamily: "'Playfair Display', serif",
            }}
          >
            Book Exchange
          </Typography>

          {!isLoggedIn && (
            <>
              <Button variant="contained" startIcon={<LoginIcon />} sx={{
                backgroundColor: theme.palette.background.default,
                color: theme.palette.primary.main,
                borderColor: theme.palette.background.default,
                '&:hover': {
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.primary.main
                }
              }} onClick={handleLogin}>
                Login
              </Button>
              <Button variant="contained"  sx={{
                
                backgroundColor: theme.palette.background.default,
                color: theme.palette.primary.main,
                borderColor: theme.palette.background.default,
                '&:hover': {
                  backgroundColor: theme.palette.secondary.main,
                  color: theme.palette.primary.main
                },
               ml: 1
              }}  onClick={handleSignup}>
                Join Now
              </Button>
            </>
          )}

          {isLoggedIn && (
            <>
              <IconButton>
                <Avatar alt={user?.fullName} src={`https://bookexchangeplatform-3rjn.onrender.com${user?.profileImageURL}`} />
              </IconButton>
              <IconButton sx={{ color: theme.palette.background.default }} onClick={toggleDrawer(true)}>
                <MenuIcon />
              </IconButton>
            </>
          )}

          <Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
            {drawerContent}
          </Drawer>
        </Toolbar>
      </AppBar>

      <Box sx={{ height: '64px' }} />
    </>
  );
}
