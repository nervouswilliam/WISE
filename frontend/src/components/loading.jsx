import { Box } from '@mui/material';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

export default function Loading() {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
    return (
        <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: '#f9f7fc',
        }}
        >
        <img
            src="/loadingLogo.gif" // ✅ directly from /public
            alt="Loading Wisely..."
            width={isMobile ? 300 : 500}
        />
        </Box>
    );
}
