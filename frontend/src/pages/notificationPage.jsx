import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Paper,
  Button,
} from "@mui/material";
import notificationService from "../services/notificationService";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import DeleteIcon from '@mui/icons-material/Delete';
import { useNavigate } from "react-router-dom";
import Loading from "../components/loading";

export default function NotificationPage({user}) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const handleBackClick = () =>{
    navigate(-1);
  }

  useEffect(() => {
    const fetchNotifications = async () => {
      try {

        setLoading(true);
        const data = await notificationService.getNotificationList(user.id);
        setNotifications(data.data || []); // ✅ extract array
      } catch (err) {
        console.error("Failed to fetch notifications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, []);

  const handleMarkAsRead = async (notif) => {
    if (notif.read) return;
    setNotifications((prev) => prev.map((n) => (n.id === notif.id ? { ...n, read: true } : n)));
    try {
      await notificationService.markNotificationAsRead(notif.id);
    } catch (err) {
      console.error("Failed to mark notification as read:", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    const unread = notifications.filter((n) => !n.read);
    if (unread.length === 0) return;
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await Promise.all(unread.map((n) => notificationService.markNotificationAsRead(n.id)));
    } catch (err) {
      console.error("Failed to mark all notifications as read:", err);
    }
  };

  const handleDelete = async (notif) => {
    setNotifications((prev) => prev.filter((n) => n.id !== notif.id));
    try {
      await notificationService.deleteNotification(notif.id);
    } catch (err) {
      console.error("Failed to delete notification:", err);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2, flexWrap: "wrap", gap: 1 }}>
        <Button
          variant="contained"
          startIcon= {<ArrowBackIcon/>}
          sx={{ backgroundColor: "#6f42c1" }}
          onClick={handleBackClick}
          >
              Back
          </Button>
        {unreadCount > 0 && (
          <Button variant="outlined" onClick={handleMarkAllAsRead}>
            Mark all as read
          </Button>
        )}
      </Box>

      {loading ? (
        <Loading />
      ) : notifications.length === 0 ? (
        <Typography color="text.secondary" align="center" sx={{ mt: 4 }}>
          You don’t have any notifications yet.
        </Typography>
      ) : (
        <Paper elevation={2} sx={{ p: 2 }}>
          <List>
            {notifications.map((notif, index) => (
              <Box key={notif.id || index}>
                <ListItem
                  alignItems="flex-start"
                  onClick={() => handleMarkAsRead(notif)}
                  sx={{
                    cursor: notif.read ? "default" : "pointer",
                    backgroundColor: notif.read ? "transparent" : "action.hover",
                    borderRadius: 1,
                  }}
                  secondaryAction={
                    <IconButton
                      edge="end"
                      size="small"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notif);
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: notif.read ? 500 : 700 }}>
                        {notif.type || "Notification"}
                      </Typography>
                    }
                    secondary={
                      <>
                        <Typography variant="body2" color="text.primary">
                          {notif.message}
                        </Typography>
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          {new Date(notif.created_at).toLocaleString()}
                        </Typography>
                      </>
                    }
                  />
                </ListItem>

                {index !== notifications.length - 1 && <Divider component="li" />}
              </Box>
            ))}
          </List>

          <Box sx={{ textAlign: "center", mt: 2 }}>
            <Button
              variant="contained"
              sx={{ backgroundColor: "#6f42c1", color: "#fff" }}
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              Back to Top
            </Button>
          </Box>
        </Paper>
      )}
    </Box>
  );
}
