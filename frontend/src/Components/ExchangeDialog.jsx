import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  Typography,
  Box,
  Stack,
  Chip,
  Avatar,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useTheme } from "@mui/material/styles";
import { toast } from "sonner";

export default function ExchangeDialog({ book, isOpen, onOpenChange }) {
  const theme = useTheme();
  const [selectedBook, setSelectedBook] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [isRequested, setIsRequested] = useState(false);
  const [exchangeId, setExchangeId] = useState(null);



  const [myBooks, setMyBooks] = useState([]);

  useEffect(() => {
    const fetchBooks = async () => {
      const token = localStorage.getItem("token");
      try {
        const response = await fetch("https://bookexchangeplatform-3rjn.onrender.com/user/MyListings", {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.ok) {
          const data = await response.json();
          setMyBooks(data);
          console.log(myBooks);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };
    fetchBooks();
  }, []);



  


const handleExchangeRequest = async () => {
  setLoading(true);
  const token = localStorage.getItem("token");

  try {
    const response = await fetch(`https://bookexchangeplatform-3rjn.onrender.com/user/request/${book._id}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        offeredBookId: selectedBook, // from the dropdown
        message, // optional
      }),
    });

    const data = await response.json();

    if (response.ok) {
      setIsRequested(true);
      setExchangeId(data.exchange._id);
    } else {
      alert(data.message || "Failed to send exchange request.");
    }
  } catch (error) {
    console.error("Error sending exchange request:", error);
    alert("Something went wrong. Try again.");
  } finally {
    setLoading(false);
  }
};

const handleCancelRequest = async () => {
  if (!exchangeId) return;

  const confirmCancel = window.confirm("Are you sure you want to cancel the request?");
  if (!confirmCancel) return;

  const token = localStorage.getItem("token");
  setLoading(true);

  try {
    const res = await fetch(
      `https://bookexchangeplatform-3rjn.onrender.com/user/cancel/${exchangeId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.ok) {
      setIsRequested(false);
      setExchangeId(null);
    } else {
      console.error("Failed to cancel request");
    }
  } catch (err) {
    console.error("Cancel request error:", err);
  } finally {
    setLoading(false);
  }
};

useEffect(() => {
  const fetchExistingRequest = async () => {
    const token = localStorage.getItem("token");

    try {
      const res = await fetch("https://bookexchangeplatform-3rjn.onrender.com/user/sent-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        const data = await res.json();

        // Assuming you're viewing a specific book (e.g., `bookId` is the requestedBook)
        const existingRequest = data.find(
          (req) =>
            req.requestedBook._id === book._id // bookId from props or route param
        );

        if (existingRequest) {
          setIsRequested(true);
          setExchangeId(existingRequest._id);
          setSelectedBook(existingRequest.offeredBook?._id || "");
          setMessage(existingRequest.message || "");
        }
      }
    } catch (err) {
      console.error("Error fetching exchange requests:", err);
    }
  };

  fetchExistingRequest();
}, [book._id]); // Add bookId as dependency





  return (
    <Dialog open={isOpen} onClose={() => onOpenChange(false)} fullWidth maxWidth="md">
      {/* Brown header */}
      <Box
        sx={{
          backgroundColor: "#5D4037",
          color: "#fff",
          py: 2,
          px: 3,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Typography variant="h6" fontWeight="bold">
          Book Details
        </Typography>
        <IconButton onClick={() => onOpenChange(false)} sx={{ color: "#fff" }}>
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Content */}
      <DialogContent sx={{ p: 4 }}>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={4}>
          {/* Left Section */}
          <Box sx={{ width: { xs: "100%", sm: "35%" } }}>
            <Box
              component="img"
              src={`https://bookexchangeplatform-3rjn.onrender.com${book.coverImageURL}`}
              alt={book.title}
              sx={{
                width: "100%",
                height: 250,
                objectFit: "cover",
                borderRadius: 2,
                boxShadow: 2,
              }}
            />

            <Box mt={2}>
              <Typography variant="body2" fontWeight="bold" gutterBottom>
                Condition:
              </Typography>
              <Chip label={book.condition} color="primary" size="small" />

              <Typography variant="body2" fontWeight="bold" gutterBottom sx={{ mt: 2 }}>
                Genre:
              </Typography>
              <Chip label={book.genres} variant="outlined" size="small" />
            </Box>
          </Box>


          {/* Right Section */}
          <Stack spacing={2} flex={1}>
            <Typography variant="h5" fontWeight="bold">
              {book.title}
            </Typography>
            <Typography variant="subtitle1" color="text.secondary">
              by {book.authors.join(', ')}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
              {book.description}
            </Typography>

            <Divider sx={{ my: 1 }} />

            {/* Owner Info */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Avatar
                src={
                  book.owner?.profileImageURL
                    ? `https://bookexchangeplatform-3rjn.onrender.com${book.owner.profileImageURL}`
                    : book.owner.fullName // or your fallback image URL
                }
              />



              <Box>
                <Typography variant="subtitle2">{book.owner.fullName}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {book.owner?.exchangeCount || 0} exchanges
                </Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />

            {/* Exchange Form */}
            <Stack spacing={2}>
              <FormControl fullWidth>
                <InputLabel>Your Book</InputLabel>
                <Select
                  value={selectedBook}
                  label="Your Book"
                  onChange={(e) => setSelectedBook(e.target.value)}
                >
                  {myBooks.map((b) => (
                    <MenuItem key={b._id} value={b._id}>
                      {b.title}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Message (optional)"
                multiline
                minRows={3}
                fullWidth
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />

{isRequested ? (
  <Stack direction="row" spacing={2}>
    <Button variant="contained" disabled>
      Requested
    </Button>
    <Button
      variant="outlined"
      color="error"
      onClick={handleCancelRequest}
      disabled={loading}
    >
      Cancel Request
    </Button>
  </Stack>
) : (
  <Button
    variant="contained"
    onClick={handleExchangeRequest}
    disabled={loading}
    sx={{ alignSelf: "flex-start", mt: 1 }}
  >
    {loading ? "Sending..." : "Send Exchange Request"}
  </Button>
)}



            </Stack>
          </Stack>
        </Stack>
      </DialogContent>
    </Dialog>
  );
}
