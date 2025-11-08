import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Divider,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  Paper,
  Button,
} from "@mui/material";
import notificationService from "../services/notificationService";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
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

  return (
    <Box sx={{ p: 3 }}>
      <Button
        variant="contained"
        startIcon= {<ArrowBackIcon/>}
        sx={{ backgroundColor: "#6f42c1", marginBottom: 2 }}
        onClick={handleBackClick}
        >
            Back
        </Button>

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
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={
                      <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
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
