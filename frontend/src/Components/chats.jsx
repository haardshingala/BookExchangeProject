"use client";

import React, { useState } from "react";
import { format } from "date-fns";
import {
  Container,
  Box,
  Avatar,
  IconButton,
  TextField,
  InputAdornment,
  Button,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
  Typography,
  Paper,
  Stack,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Search,
  Send,
  ChevronLeft,
  MoreVert,
  Phone,
  VideoCall,
  Info,
  AttachFile,
} from "@mui/icons-material";

// Sample data for conversations
const conversations = [
  {
    id: "1",
    user: {
      id: "u1",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    book: {
      id: "b1",
      title: "1984",
      author: "George Orwell",
      coverImage: "/placeholder.svg?height=60&width=40",
    },
    lastMessage: {
      text: "Hi, I'm interested in exchanging this book. Is it still available?",
      timestamp: new Date(2023, 5, 15, 14, 30),
      isRead: true,
      sender: "them",
    },
    status: "accepted",
  },
  {
    id: "2",
    user: {
      id: "u2",
      name: "Alice Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    book: {
      id: "b2",
      title: "Dune",
      author: "Frank Herbert",
      coverImage: "/placeholder.svg?height=60&width=40",
    },
    lastMessage: {
      text: "Great! When and where would you like to meet for the exchange?",
      timestamp: new Date(2023, 5, 16, 9, 45),
      isRead: false,
      sender: "them",
    },
    status: "accepted",
  },
  {
    id: "3",
    user: {
      id: "u3",
      name: "Robert Brown",
      avatar: "/placeholder.svg?height=40&width=40",
    },
    book: {
      id: "b3",
      title: "The Hobbit",
      author: "J.R.R. Tolkien",
      coverImage: "/placeholder.svg?height=60&width=40",
    },
    lastMessage: {
      text: "I've received the book, thank you! It's in great condition.",
      timestamp: new Date(2023, 5, 14, 16, 20),
      isRead: true,
      sender: "them",
    },
    status: "completed",
  },
];

// Filter conversations to only those with "accepted" status
const acceptedConversations = conversations.filter(
  (conv) => conv.status === "accepted"
);

// Sample messages for the active conversation
const sampleMessages = [
  {
    id: "m1",
    text: "Hi, I'm interested in exchanging this book. Is it still available?",
    timestamp: new Date(2023, 5, 15, 14, 30),
    sender: "them",
    user: {
      id: "u1",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "m2",
    text: "Yes, it's still available! I'd be happy to exchange it.",
    timestamp: new Date(2023, 5, 15, 14, 35),
    sender: "me",
    user: {
      id: "me",
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "m3",
    text: "Great! I've been looking for this book for a while. Would you prefer to meet in person or mail it?",
    timestamp: new Date(2023, 5, 15, 14, 40),
    sender: "them",
    user: {
      id: "u1",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "m4",
    text: "I'm in downtown area, so we could meet at the Central Library if that works for you?",
    timestamp: new Date(2023, 5, 15, 14, 45),
    sender: "me",
    user: {
      id: "me",
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "m5",
    text: "That sounds perfect! How about this Saturday around 2pm?",
    timestamp: new Date(2023, 5, 15, 14, 50),
    sender: "them",
    user: {
      id: "u1",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "m6",
    text: "Saturday at 2pm works for me. I'll bring the book. It's in good condition with just some minor wear on the cover.",
    timestamp: new Date(2023, 5, 15, 15, 0),
    sender: "me",
    user: {
      id: "me",
      name: "Jane Smith",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
  {
    id: "m7",
    text: "Sounds good! I'll be wearing a blue jacket. See you then!",
    timestamp: new Date(2023, 5, 15, 15, 5),
    sender: "them",
    user: {
      id: "u1",
      name: "John Doe",
      avatar: "/placeholder.svg?height=40&width=40",
    },
  },
];

// Book details for the exchange (used in header info button actions)
const exchangeDetails = {
  book: {
    id: "b1",
    title: "1984",
    author: "George Orwell",
    coverImage: "/placeholder.svg?height=450&width=300",
    condition: "Good",
    genre: ["Dystopian", "Classic"],
  },
  exchangeStatus: "Accepted",
  meetupDetails: {
    location: "Central Library",
    date: new Date(2023, 5, 18, 14, 0),
  },
};

export default function Chats() {
  const [activeConversation, setActiveConversation] = useState(acceptedConversations[0]);
  const [messageInput, setMessageInput] = useState("");
  const [showConversationList, setShowConversationList] = useState(true);

  // Menu for header actions
  const [anchorEl, setAnchorEl] = useState(null);
  const openMenu = Boolean(anchorEl);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleSendMessage = () => {
    if (messageInput.trim() === "") return;
    console.log("Sending message:", messageInput);
    setMessageInput("");
  };

  const handleSelectConversation = (conversation) => {
    setActiveConversation(conversation);
    if (window.innerWidth < 768) {
      setShowConversationList(false);
    }
  };

  const handleBackToList = () => setShowConversationList(true);

  return (
    <Container maxWidth="lg" sx={{ py: 2, height: "100vh" }}>
      
      <Box
        sx={{
          display: "flex",
          height: "calc(100% - 60px)",
          border: "1px solid #ccc",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        {/* Conversation List */}
        <Box
          sx={{
            width: { xs: showConversationList ? "100%" : 0, md: "33%" },
            borderRight: { xs: 0, md: "1px solid #ccc" },
            display: { xs: showConversationList ? "block" : "none", md: "block" },
          }}
        >
          <Box sx={{ p: 2, borderBottom: "1px solid #ccc" }}>
            <TextField
              placeholder="Search conversations..."
              variant="outlined"
              size="small"
              fullWidth
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6">Chats</Typography>
          </Box>
          <Box sx={{ overflowY: "auto", height: "calc(100% - 130px)" }}>
            <List>
              {acceptedConversations.map((conversation) => (
                <ListItem
                  key={conversation.id}
                  button
                  onClick={() => handleSelectConversation(conversation)}
                  selected={activeConversation?.id === conversation.id}
                >
                  <ListItemAvatar>
                    <Avatar alt={conversation.user.name} src={conversation.user.avatar} />
                  </ListItemAvatar>
                  <ListItemText
                    primary={
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography noWrap variant="subtitle1">
                          {conversation.user.name}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(conversation.lastMessage.timestamp, "h:mm a")}
                        </Typography>
                      </Box>
                    }
                    secondary={
                      <>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Avatar
                            variant="rounded"
                            src={conversation.book.coverImage}
                            sx={{ width: 30, height: 30 }}
                          />
                          <Typography variant="caption" noWrap>
                            {conversation.book.title}
                          </Typography>
                        </Box>
                        <Typography
                          variant="body2"
                          noWrap
                          sx={{
                            fontWeight:
                              !conversation.lastMessage.isRead && conversation.lastMessage.sender === "them" ? 500 : 400,
                          }}
                        >
                          {conversation.lastMessage.text}
                        </Typography>
                      </>
                    }
                  />
                  {!conversation.lastMessage.isRead && conversation.lastMessage.sender === "them" && (
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "primary.main", mt: 1 }} />
                  )}
                </ListItem>
              ))}
            </List>
          </Box>
        </Box>

        {/* Chat Area */}
        <Box
          sx={{
            width: { xs: showConversationList ? 0 : "100%", md: "67%" },
            display: { xs: showConversationList ? "none" : "flex", md: "flex" },
            flexDirection: "column",
          }}
        >
          {activeConversation && (
            <>
              {/* Chat Header */}
              <Box
                sx={{
                  p: 2,
                  borderBottom: "1px solid #ccc",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <IconButton sx={{ display: { xs: "block", md: "none" } }} onClick={handleBackToList}>
                    <ChevronLeft />
                  </IconButton>
                  <Avatar alt={activeConversation.user.name} src={activeConversation.user.avatar} />
                  <Box>
                    <Typography variant="subtitle1">{activeConversation.user.name}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activeConversation.book.title}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <IconButton>
                    <Phone />
                  </IconButton>
                  <IconButton>
                    <VideoCall />
                  </IconButton>
                  <IconButton onClick={handleMenuOpen}>
                    <Info />
                  </IconButton>
                  <Menu anchorEl={anchorEl} open={openMenu} onClose={handleMenuClose}>
                    <MenuItem onClick={handleMenuClose}>Reschedule</MenuItem>
                    <MenuItem onClick={handleMenuClose}>Cancel Exchange</MenuItem>
                  </Menu>
                  <IconButton>
                    <MoreVert />
                  </IconButton>
                </Box>
              </Box>

              {/* Messages Area */}
              <Box sx={{ flex: 1, p: 2, overflowY: "auto", backgroundColor: "#f9f9f9" }}>
                {sampleMessages.map((message) => {
                  const isMe = message.sender === "me";
                  return (
                    <Box
                      key={message.id}
                      sx={{
                        display: "flex",
                        justifyContent: isMe ? "flex-end" : "flex-start",
                        mb: 2,
                      }}
                    >
                      <Stack
                        direction={isMe ? "row-reverse" : "row"}
                        spacing={1}
                        alignItems="flex-end"
                        sx={{ maxWidth: "80%" }}
                      >
                        {!isMe && (
                          <Avatar alt={message.user.name} src={message.user.avatar} sx={{ width: 32, height: 32 }} />
                        )}
                        <Box>
                          <Paper
                            sx={{
                              p: 1.5,
                              backgroundColor: isMe ? "primary.main" : "grey.300",
                              color: isMe ? "primary.contrastText" : "text.primary",
                              borderRadius: 2,
                            }}
                          >
                            <Typography variant="body2">{message.text}</Typography>
                          </Paper>
                          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
                            {format(message.timestamp, "h:mm a")}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  );
                })}
              </Box>

              {/* Message Input */}
              <Box sx={{ p: 2, borderTop: "1px solid #ccc" }}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <IconButton>
                    <AttachFile />
                  </IconButton>
                  <TextField
                    placeholder="Type a message..."
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        handleSendMessage();
                      }
                    }}
                  />
                  <IconButton onClick={handleSendMessage} disabled={messageInput.trim() === ""}>
                    <Send />
                  </IconButton>
                </Stack>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Container>
  );
}
