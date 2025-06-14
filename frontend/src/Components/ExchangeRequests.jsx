import React, { useState , useEffect} from 'react';
import { Box, Tabs, Tab, Card, CardContent, Typography, Button, Avatar } from '@mui/material';
const API_BASE = process.env.REACT_APP_BACKEND_URL;

// Helper component for tab panels
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`exchange-tabpanel-${index}`}
      aria-labelledby={`exchange-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 2 }}>{children}</Box>}
    </div>
  );
}







export default function ExchangeRequests() {
  const [tab, setTab] = useState(0);
  const [sentRequests, setSentRequests]= useState([]);
  const [receivedRequests, setReceivedRequests]= useState([]);
  

  const token = localStorage.getItem("token");

  
  const fetchReceivedRequests = async () => {
    try {
      const res = await fetch(`${API_BASE}/user/recieved-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setReceivedRequests(data);
      
    } catch (error) {
      console.error("Error fetching sent requests:", error);
    }
  };
useEffect(() => {
  const fetchSentRequests = async () => {
    try {
      const res = await fetch(`${API_BASE}/user/sent-requests`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setSentRequests(data);
      console.log(sentRequests);
    } catch (error) {
      console.error("Error fetching sent requests:", error);
    }
  };

  

  if (token) {
    fetchSentRequests();
    fetchReceivedRequests();
  }
}, [token]);


const handleAcceptRequest = async (exchangeId) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API_BASE}/user/accept/${exchangeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      alert("Exchange request accepted");
      // Optionally re-fetch the list to update UI
      fetchReceivedRequests(); // Or fetchReceivedRequests if you're the owner
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error accepting request:", error);
    alert("Something went wrong while accepting the request.");
  }
}; 


const handleRejectRequest = async (exchangeId) => {
  const token = localStorage.getItem("token");

  try {
    const res = await fetch(`${API_BASE}/user/reject/${exchangeId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (res.ok) {
      alert("Exchange request rejected");
      // Optionally re-fetch the list to update UI
      fetchReceivedRequests(); // Or fetchReceivedRequests if you're the owner
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.error("Error rejecting request:", error);
    alert("Something went wrong while rejecting the request.");
  }
}; 
  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  

  return (
    <Box sx={{ p: 3 }}>
      <Tabs value={tab} onChange={handleTabChange} aria-label="Exchange Requests Tabs">
        <Tab label="Received Requests" />
        <Tab label="Sent Requests" />
      </Tabs>
      <TabPanel value={tab} index={0}>
        {receivedRequests.length === 0 ? (
          <Typography>No received exchange requests at the moment.</Typography>
        ) : (
          receivedRequests.map((req) => (
            <Card key={req._id} sx={{ mb: 2, p: 2, display: 'flex', alignItems: 'center' }}>
              <Avatar
                variant="square"
                src={`${API_BASE}${req.requestedBook.coverImageURL}`}
              alt={req.requestedBook.title}
                sx={{ width: 100, height: 150, mr: 2 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">{req.requester.fullName} requested an exchange</Typography>
                <Typography variant="body2" color="text.secondary">
                  Book: {req.requestedBook.title}
                </Typography>
                <Typography variant="body2" display="block" sx={{ mt: 0.5 }}>
                  Status: {req.status}
                </Typography>
              </Box>
              {req.status === 'Pending' && (
                <Box sx={{ ml: 2 }}>
                  <Button variant="outlined" color="primary" sx={{ mr: 1 }} onClick={() => handleAcceptRequest(req._id)}>
                    Accept
                  </Button>
                  <Button variant="outlined" color="error" onClick={() => handleRejectRequest(req._id)}>
                    Decline
                  </Button>
                </Box>
              )}
              {req.status === 'accepted' && (
                <Button variant="contained" color="primary">
                  Chat
                </Button>
              )}
            </Card>
          ))
        )}
      </TabPanel>
      <TabPanel value={tab} index={1}>
        {sentRequests.length === 0 ? (
          <Typography>No sent exchange requests at the moment.</Typography>
        ) : (
          sentRequests.map((req) => (
            <Card key={req._id} sx={{ mb: 2, p: 2, display: 'flex', alignItems: 'center' }}>
              <Avatar
                variant="square"
                src={`${API_BASE}${req.requestedBook.coverImageURL}`}
              alt={req.requestedBook.title}
                sx={{ width: 100, height: 150, mr: 2 }}
              />
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">You requested an exchange</Typography>
                <Typography variant="body2" color="text.secondary">
                  Book: {req.requestedBook.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
                  To: {req.owner.fullName}
                </Typography>
                <Typography variant="body2" display="block" sx={{ mt: 0.5 }}>
                  Status: {req.status}
                </Typography>
              </Box>
              {/* Optionally add a cancel request button if needed */}
            </Card>
          ))
        )}
      </TabPanel>
    </Box>
  );
}
