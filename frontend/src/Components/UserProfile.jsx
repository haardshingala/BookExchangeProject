import React, { useEffect, useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  Stack,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import { API_BASE } from "../utils/api";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [selectedImage, setSelectedImage] = useState(null);
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
 

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch(`${API_BASE}/user/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUser(data);
        setFormData(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [token]);

   const [interestsText, setInterestsText] = useState(
  Array.isArray(user?.interests) ? user.interests.join(", ") : ""
);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleUpdate = async () => {
     const interestsArray = interestsText
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
    // 1️ compose a fresh object yourself
const payloadData = { ...formData, interests: interestsArray };

// 2️ update state *after* the fetch (for next dialog use)
setFormData(payloadData); //updating in formdata so need to separately set this field

    const form = new FormData();
    Object.entries(payloadData).forEach(([key, val]) => {
      const payload = Array.isArray(val) || typeof val === "object"
        ? JSON.stringify(val)
        : val;
      form.append(key, payload);
    });
    
    if (selectedImage) form.append("profileImage", selectedImage);

    try {
      const res = await fetch(`${API_BASE}/user/update-profile`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
      const data = await res.json();
      setUser(data);
      setEditMode(false);
      
      setInterestsText(data.interests.join(", ")); // dialog preset next time
      setFormData({ ...data })
      alert("Profile updated!");
    } catch (error) {
      console.error("Update failed:", error);
    }
  };

  const handleDelete = async () => {
    try {
      const res = await fetch(`${API_BASE}/user/delete-profile`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.status === 204) {
        localStorage.removeItem("token");
        alert("Account deleted successfully.");
        window.location.href = "/";
      } else {
        const msg = await res.text();
        alert(msg || "Deletion failed.");
      }
    } catch (err) {
      console.error("Deletion failed:", err);
      alert("Deletion failed.");
    }
  };

  if (!user) return <Typography>Loading...</Typography>;

  return (
    <Box sx={{ p: 4, maxWidth: "900px", mx: "auto" }}>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 4 }}>
        <Grid container spacing={4} alignItems="center">
          <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
            <Box sx={{ position: "relative", display: "inline-block" }}>
              <Avatar
                src={user.profileImageURL?.url || "/images/default-avatar.jpeg"}
                alt={user.fullName}
                sx={{ width: 140, height: 140, mx: "auto", mb: 1 }}
              />
             
            </Box>
            <Typography variant="h6">{user.fullName}</Typography>
            <Typography color="text.secondary">{user.email}</Typography>
          </Grid>

          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              <Typography variant="body1"><strong>City:</strong> {user.city}</Typography>
              <Typography variant="body1"><strong>Address:</strong> {user.address}</Typography>
              <Typography variant="body1"><strong>Bio:</strong> {user.bio}</Typography>
              <Typography variant="body1">
                <strong>Interests:</strong>{" "}
                {Array.isArray(user.interests) ? user.interests.join(", ") : user.interests}
              </Typography>


              <Box mt={2}>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={() => {setInterestsText(user.interests.join(", "));
                   setEditMode(true);}}
                  sx={{ mr: 2 }}
                >
                  Edit Profile
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteForeverIcon />}
                  onClick={() => setConfirmDeleteOpen(true)}
                >
                  Delete Account
                </Button>
              </Box>
            </Stack>
          </Grid>
        </Grid>
      </Paper>

      {/* Edit Dialog */}
      <Dialog open={editMode} onClose={() => setEditMode(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Edit Your Profile</DialogTitle>
        <DialogContent>
         <Box sx={{ display: "flex", justifyContent: "center", mb: 3 }}>
    <Box sx={{ position: "relative", width: "fit-content" }}>
      <Avatar
        src={
          selectedImage
            ? URL.createObjectURL(selectedImage)
            : user.profileImageURL?.url || "/images/default-avatar.jpeg"
        }
        alt={user.fullName}
        sx={{ width: 140, height: 140 }}
      />

      <IconButton
        component="label"
        sx={{
          position: "absolute",
          bottom: 8,
          right: 8,
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
          <Grid container spacing={2} mt={1}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Full Name"
                name="fullName"
                value={formData.fullName || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                value={formData.email || ""}
                disabled
                onChange={handleChange}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="City"
                name="city"
                value={formData.city || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Address"
                name="address"
                value={formData.address || ""}
                onChange={handleChange}
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                minRows={2}
                label="Bio"
                name="bio"
                value={formData.bio || ""}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
  fullWidth
  label="Interests (comma separated)"
  value={interestsText}
  onChange={e => setInterestsText(e.target.value)}
/>

  

            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditMode(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleUpdate}>
            Save Changes
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirmation */}
      <Dialog
        open={confirmDeleteOpen}
        onClose={() => setConfirmDeleteOpen(false)}
      >
        <DialogTitle>Confirm Account Deletion</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete your account?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDeleteOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
