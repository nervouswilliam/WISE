import { useEffect, useRef, useState } from "react";
import {
  Box,
  Paper,
  IconButton,
  TextField,
  Typography,
  CircularProgress,
  Fade,
} from "@mui/material";
import ChatIcon from "@mui/icons-material/Chat";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import chatbotService from "../services/chatbotService";

const STORAGE_KEY = "wisely_chat_history";

function loadHistory() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

// Floating chat bubble available on every authenticated page (mounted once in Layout).
// Calls the `chatbot` Supabase Edge Function via chatbotService - see that file and
// supabase/functions/chatbot for how the answer actually gets grounded in real data.
export default function ChatbotWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(loadHistory);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, sending, open]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setMessages((prev) => [...prev, { role: "user", text }]);
    setSending(true);
    try {
      const reply = await chatbotService.askChatbot(text);
      setMessages((prev) => [...prev, { role: "assistant", text: reply }]);
    } catch (err) {
      console.error("Chatbot error:", err);
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text: "Sorry, I couldn't get an answer just now. Please try again in a moment.",
          error: true,
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      <IconButton
        onClick={() => setOpen((v) => !v)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          zIndex: 1300,
          width: 56,
          height: 56,
          backgroundColor: "#6f42c1",
          color: "white",
          boxShadow: 4,
          "&:hover": { backgroundColor: "#5a34a8" },
        }}
      >
        {open ? <CloseIcon /> : <ChatIcon />}
      </IconButton>

      <Fade in={open}>
        <Paper
          elevation={6}
          sx={{
            position: "fixed",
            bottom: { xs: 0, sm: 92 },
            right: { xs: 0, sm: 24 },
            left: { xs: 0, sm: "auto" },
            top: { xs: 0, sm: "auto" },
            width: { xs: "100%", sm: 360 },
            height: { xs: "100%", sm: 500 },
            maxHeight: { xs: "100%", sm: "calc(100vh - 120px)" },
            display: "flex",
            flexDirection: "column",
            zIndex: 1299,
            borderRadius: { xs: 0, sm: 3 },
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              backgroundColor: "#6f42c1",
              color: "white",
              px: 2,
              py: 1.5,
              display: "flex",
              alignItems: "center",
              gap: 1,
            }}
          >
            <SmartToyIcon fontSize="small" />
            <Typography variant="subtitle1" fontWeight={600} sx={{ flexGrow: 1 }}>
              Wisely Assistant
            </Typography>
            <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: "white" }}>
              <CloseIcon fontSize="small" />
            </IconButton>
          </Box>

          {/* Messages */}
          <Box
            ref={scrollRef}
            sx={{ flex: 1, overflowY: "auto", p: 2, display: "flex", flexDirection: "column", gap: 1.5 }}
          >
            {messages.length === 0 && (
              <Typography variant="body2" color="text.secondary" sx={{ textAlign: "center", mt: 4 }}>
                Ask me about your stock, sales trends, or anything else about your business.
              </Typography>
            )}
            {messages.map((m, i) => (
              <Box
                key={i}
                sx={{
                  alignSelf: m.role === "user" ? "flex-end" : "flex-start",
                  maxWidth: "85%",
                  backgroundColor: m.role === "user" ? "#6f42c1" : m.error ? "error.light" : "action.hover",
                  color: m.role === "user" ? "white" : "text.primary",
                  borderRadius: 2,
                  px: 1.5,
                  py: 1,
                }}
              >
                <Typography variant="body2" sx={{ whiteSpace: "pre-wrap" }}>
                  {m.text}
                </Typography>
              </Box>
            ))}
            {sending && (
              <Box sx={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 1, px: 1.5, py: 1 }}>
                <CircularProgress size={16} />
                <Typography variant="body2" color="text.secondary">
                  Thinking...
                </Typography>
              </Box>
            )}
          </Box>

          {/* Input */}
          <Box sx={{ display: "flex", gap: 1, p: 1.5, borderTop: "1px solid", borderColor: "divider" }}>
            <TextField
              fullWidth
              size="small"
              placeholder="Ask about stock, sales, trends..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={sending}
              multiline
              maxRows={3}
            />
            <IconButton
              onClick={handleSend}
              disabled={sending || !input.trim()}
              sx={{
                backgroundColor: "#6f42c1",
                color: "white",
                "&:hover": { backgroundColor: "#5a34a8" },
                alignSelf: "flex-end",
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </Paper>
      </Fade>
    </>
  );
}
