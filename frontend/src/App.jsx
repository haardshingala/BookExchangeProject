import { useState } from 'react'


import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';


import Home from './Components/Home';

import MyListings from './Components/MyListings';
import Favourites from './Components/favourite';
import NewNavbar from './Components/NewNavbar';
import NewSignup from './Components/NewSignup';
import NewBookCard from './Components/NewBookCard';

import Profile from './Components/UserProfile';
import ExchangeRequests from './Components/ExchangeRequests';
import Chats from './Components/chats';
import { Box } from '@mui/material';
import NewAddBook from './Components/NewAddBook';
import NewLogin from './Components/NewLogin';


function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
 
  


  return (
    <>


      <NewNavbar setIsLoggedIn={setIsLoggedIn} isLoggedIn={isLoggedIn} />
      


      <Routes>

        <Route path="/" element={<Home  />} />
        <Route path="/home" element={<Home />} />
        <Route path="/add-book" element={<NewAddBook />} />
        <Route path="/my-listings" element={<MyListings />} />

        <Route path="/login" element={<NewLogin setIsLoggedIn={setIsLoggedIn} />}/>
        <Route path="/signup" element={<NewSignup />}/>
        <Route path="/favourites" element={<Favourites/>}/>
         
        <Route path="/profile" element={<Profile />} />
        <Route path="/exchange-requests" element={<ExchangeRequests />} />
        <Route path="/chats" element={<Chats />} />

        {/* Other routes */}

      </Routes>

    </>




  )
}

export default App
