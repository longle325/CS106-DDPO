import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Box, Container } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { motion } from 'framer-motion';
import InferencePage from './pages/InferencePage';
import DDPOLogo from './components/DDPOLogo';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#00f5ff',
    },
    secondary: {
      main: '#8b5cf6',
    },
    background: {
      default: '#0a0a0a',
      paper: 'rgba(20, 20, 30, 0.8)',
    },
    text: {
      primary: '#ffffff',
      secondary: '#a0a0a0',
    },
  },
  typography: {
    fontFamily: '"Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: { fontWeight: 300, letterSpacing: '-0.02em' },
    h2: { fontWeight: 300, letterSpacing: '-0.01em' },
    h3: { fontWeight: 400, letterSpacing: '-0.01em' },
    h4: { fontWeight: 500 },
    h6: { fontWeight: 400, letterSpacing: '0.02em' },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
          borderRadius: 8,
          padding: '8px 24px',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: 'rgba(20, 20, 30, 0.6)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
        },
      },
    },
  },
});

function Home() {
  return (
    <Box sx={{ 
      minHeight: 'calc(100vh - 80px)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      px: 4
    }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <Typography 
          variant="h1" 
          sx={{ 
            fontSize: { xs: '3rem', md: '5rem' },
            fontWeight: 200,
            background: 'linear-gradient(135deg, #ffffff 0%, #00f5ff 50%, #8b5cf6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: 3,
            letterSpacing: '-0.03em'
          }}
        >
          Aesthetic
          <br />
          Diffusion
        </Typography>
        
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'text.secondary',
            mb: 6,
            maxWidth: 600,
            lineHeight: 1.6,
            fontSize: { xs: '1.1rem', md: '1.3rem' },
            fontWeight: 300
          }}
        >
          Advanced DDPO implementation for aesthetic quality optimization.
          Experience the next generation of AI-powered image generation.
        </Typography>
        
        <Button
          component={Link}
          to="/inference"
          variant="contained"
          size="large"
          sx={{
            fontSize: '1.1rem',
            fontWeight: 500,
            px: 6,
            py: 2,
            background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
            boxShadow: '0 8px 32px rgba(0, 245, 255, 0.3)',
            '&:hover': {
              boxShadow: '0 12px 48px rgba(0, 245, 255, 0.4)',
              transform: 'translateY(-2px)'
            },
            transition: 'all 0.3s ease'
          }}
        >
          Try Our Model
        </Button>
      </motion.div>
    </Box>
  );
}

function AboutUs() {
  return (
    <Container maxWidth="md" sx={{ mt: 8, mb: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Typography variant="h2" align="center" gutterBottom sx={{ mb: 6 }}>
          About Us
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" sx={{ lineHeight: 1.8 }}>
          CS106 Research Team
          <br />
          Advancing the frontiers of aesthetic AI and diffusion models.
          <br />
          <br />
          <em>Team member information will be updated here.</em>
        </Typography>
      </motion.div>
    </Container>
  );
}

function Navbar() {
  const location = useLocation();
  
  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        background: 'rgba(10, 10, 10, 0.8)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.05)',
      }}
    >
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 80 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <DDPOLogo size={28} showAnimation={false} />
            <Typography 
              variant="h5" 
              sx={{ 
                fontWeight: 600, 
                letterSpacing: '0.1em',
                background: 'linear-gradient(135deg, #ffffff, #00f5ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              DDPO
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', gap: 1 }}>
            {[
              { path: '/', label: 'Home' },
              { path: '/inference', label: 'Inference' },
              { path: '/about', label: 'About' }
            ].map(({ path, label }) => (
              <Button
                key={path}
                component={Link}
                to={path}
                sx={{
                  color: location.pathname === path ? 'primary.main' : 'text.primary',
                  fontWeight: location.pathname === path ? 600 : 400,
                  fontSize: '0.95rem',
                  mx: 1,
                  position: 'relative',
                  '&::after': location.pathname === path ? {
                    content: '""',
                    position: 'absolute',
                    bottom: -4,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 20,
                    height: 2,
                    background: 'linear-gradient(90deg, #00f5ff, #8b5cf6)',
                    borderRadius: 1
                  } : {}
                }}
              >
                {label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}

export default function App() {
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh', 
        background: 'radial-gradient(ellipse at center, #0f0f23 0%, #0a0a0a 100%)',
        position: 'relative'
      }}>
        {/* Ambient background effects */}
        <Box sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at 20% 30%, rgba(0, 245, 255, 0.03) 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, rgba(139, 92, 246, 0.03) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0
        }} />
        
        <Box sx={{ position: 'relative', zIndex: 1 }}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/inference" element={<InferencePage />} />
            <Route path="/about" element={<AboutUs />} />
          </Routes>
        </Box>
      </Box>
    </ThemeProvider>
  );
} 