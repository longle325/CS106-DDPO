import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { 
  ThemeProvider, 
  createTheme, 
  CssBaseline, 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Container, 
  Box, 
  Paper, 
  Grid,
  Card,
  CardContent,
  Chip,
  TextField,
  IconButton,
  useMediaQuery
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
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
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          '@keyframes shimmer': {
            '0%': { backgroundPosition: '200% 0' },
            '100%': { backgroundPosition: '-200% 0' }
          },
          '@keyframes rotate0': {
            '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
            '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' }
          },
          '@keyframes rotate1': {
            '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
            '100%': { transform: 'translate(-50%, -50%) rotate(-360deg)' }
          },
          '@keyframes rotate2': {
            '0%': { transform: 'translate(-50%, -50%) rotate(0deg)' },
            '100%': { transform: 'translate(-50%, -50%) rotate(360deg)' }
          },
          '@keyframes float0': {
            '0%, 100%': { transform: 'translateY(0px) scale(1)' },
            '50%': { transform: 'translateY(-10px) scale(1.1)' }
          },
          '@keyframes float1': {
            '0%, 100%': { transform: 'translateY(0px) scale(0.8)' },
            '50%': { transform: 'translateY(-15px) scale(1.2)' }
          },
          '@keyframes float2': {
            '0%, 100%': { transform: 'translateY(0px) scale(1)' },
            '50%': { transform: 'translateY(-8px) scale(0.9)' }
          }
        }
      }
    }
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
          Denoising Diffusion
          <br />
          Policy Optimization
        </Typography>
        
        <Box sx={{ 
          maxWidth: 980,
          mx: 'auto',
          mb: 6,
          textAlign: 'left'
        }}>
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.primary',
              mb: 3,
              fontSize: { xs: '1.2rem', md: '1.4rem' },
              fontWeight: 400,
              lineHeight: 1.7
            }}
          >
            The paper titled <Box component="span" sx={{ 
              color: 'primary.main', 
              fontWeight: 600,
              fontStyle: 'italic'
            }}>
              "Training Diffusion Models with Reinforcement Learning"
            </Box> introduces a revolutionary approach to fine-tuning diffusion models using reinforcement learning.
          </Typography>
          
          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.primary',
              mb: 3,
              fontSize: { xs: '1.2rem', md: '1.4rem' },
              fontWeight: 400,
              lineHeight: 1.7
            }}
          >
            The authors propose a method called <Box component="span" sx={{ 
              color: 'secondary.main', 
              fontWeight: 600,
              fontStyle: 'italic'
            }}>
              Denoising Diffusion Policy Optimization (DDPO)
            </Box>, which frames the denoising process as a multi-step decision-making task. This perspective enables the application of policy gradient algorithms to directly optimize diffusion models for specific downstream objectives.
          </Typography>

          <Typography 
            variant="h6" 
            sx={{ 
              color: 'text.primary',
              fontSize: { xs: '1.2rem', md: '1.4rem' },
              lineHeight: 1.7,
              fontWeight: 400,
              mb: 4
            }}
          >
            Our interactive platform demonstrates how DDPO adapts diffusion models to optimize for specific objectives such as <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>aesthetic quality</Box>, <Box component="span" sx={{ color: 'secondary.main', fontWeight: 600 }}>compressibility</Box>, and <Box component="span" sx={{ color: 'primary.main', fontWeight: 600 }}>prompt-image alignment</Box>.
          </Typography>

          {/* Buttons */}
          <Box sx={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
            <Button
              component={Link}
              to="/inference"
              variant="contained"
              size="large"
              onClick={() => window.scrollTo(0, 0)}
              sx={{
                fontSize: '1rem',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
                boxShadow: '0 8px 32px rgba(0, 245, 255, 0.3)',
                textTransform: 'none',
                borderRadius: 2,
                '&:hover': {
                  boxShadow: '0 12px 48px rgba(0, 245, 255, 0.4)',
                  transform: 'translateY(-2px)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              Try Our Model
            </Button>
            
            <Button
              component={Link}
              to="/about"
              variant="outlined"
              size="large"
              onClick={() => window.scrollTo(0, 0)}
              sx={{
                fontSize: '1rem',
                fontWeight: 600,
                px: 4,
                py: 1.5,
                border: '2px solid rgba(0, 245, 255, 0.3)',
                color: 'primary.main',
                textTransform: 'none',
                borderRadius: 2,
                backdropFilter: 'blur(10px)',
                background: 'rgba(0, 245, 255, 0.05)',
                '&:hover': {
                  border: '2px solid rgba(0, 245, 255, 0.6)',
                  background: 'rgba(0, 245, 255, 0.1)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 32px rgba(0, 245, 255, 0.2)'
                },
                transition: 'all 0.3s ease'
              }}
            >
              About Us
            </Button>
          </Box>
        </Box>
      </motion.div>
    </Box>
  );
}

function AboutUs() {
  const teamMembers = [
    {
      name: "Lê Bảo Long",
      id: "23520877",
      image: "/images/guts.png"
    },
    {
      name: "Nguyễn Thuận Phát",
      id: "23521146", 
      image: "/images/ryan_ng.png"
    },
    {
      name: "Nguyễn Tiến Thắng",
      id: "23521429",
      image: "/images/willingWill.png"
    },
    {
      name: "Phan Xuân Thành",
      id: "23521461",
      image: "/images/thanhpahn.jpg"
    }
  ];

  const [contactForm, setContactForm] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleContactChange = (field, value) => {
    setContactForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Create mailto link with form data
    const { name, email, subject, message } = contactForm;
    const emailBody = `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`;
    const mailtoLink = `mailto:lebaolong74@gmail.com?subject=${encodeURIComponent(subject || 'Contact from DDPO Demo')}&body=${encodeURIComponent(emailBody)}`;
    
    // Open default email client
    window.location.href = mailtoLink;
  };

  return (
    <Container maxWidth="xl" sx={{ py: 8 }}>
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Box sx={{ textAlign: 'center', mb: 8 }}>
          <Typography 
            variant="h1" 
            sx={{ 
              fontSize: { xs: '3rem', md: '4.5rem' },
              fontWeight: 200,
              background: 'linear-gradient(135deg, #ffffff 0%, #00f5ff 50%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 3,
              letterSpacing: '-0.02em'
            }}
          >
            Meet Our Team
          </Typography>
          <Typography 
            variant="h5" 
            sx={{ 
              color: 'text.secondary',
              maxWidth: 800,
              mx: 'auto',
              lineHeight: 1.6,
              fontWeight: 300
            }}
          >
            Passionate students pushing the boundaries of AI-driven aesthetic optimization
          </Typography>
        </Box>
      </motion.div>

      {/* Team Members Section */}
      <Box sx={{ mb: 12 }}>
        <Typography 
          variant="h3" 
          sx={{ 
            textAlign: 'center', 
            mb: 6,
            fontWeight: 300,
            color: 'primary.main'
          }}
        >
        </Typography>
        
        <Box sx={{ 
          display: 'grid', 
          gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', lg: '1fr 1fr 1fr 1fr' },
          gap: 4,
          maxWidth: 1400,
          mx: 'auto'
        }}>
          {teamMembers.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <Box sx={{
                background: 'rgba(20, 20, 30, 0.6)',
                backdropFilter: 'blur(20px)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: 3,
                p: 4,
                height: '100%',
                textAlign: 'center',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-8px)',
                  boxShadow: '0 20px 60px rgba(0, 245, 255, 0.1)',
                  border: '1px solid rgba(0, 245, 255, 0.2)'
                }
              }}>
                <Box sx={{
                  width: 120,
                  height: 120,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  mx: 'auto',
                  mb: 3,
                  padding: '4px',
                  boxShadow: '0 8px 32px rgba(0, 245, 255, 0.3)'
                }}>
                  <Box sx={{
                    width: '100%',
                    height: '100%',
                    borderRadius: '50%',
                    overflow: 'hidden',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <img 
                      src={member.image}
                      alt={member.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        console.error(`Failed to load image: ${member.image}`);
                        e.target.style.display = 'none';
                        e.target.parentElement.innerHTML = `<div style="display: flex; align-items: center; justify-content: center; width: 100%; height: 100%; background: rgba(255,255,255,0.1); color: #fff; font-size: 12px; text-align: center;">${member.name.split(' ').map(n => n[0]).join('')}</div>`;
                      }}
                      onLoad={() => console.log(`Successfully loaded: ${member.image}`)}
                    />
                  </Box>
                </Box>
                
                <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>
                  {member.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'primary.main', fontWeight: 500 }}>
                  ID: {member.id}
                </Typography>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Box>

      {/* Contact Section */}
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Typography 
          variant="h3" 
          sx={{ 
            textAlign: 'center', 
            mb: 6,
            fontWeight: 300,
            color: 'primary.main'
          }}
        >
          Get In Touch
        </Typography>
        
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', lg: '1fr 1fr' },
          gap: 6,
          maxWidth: 1400,
          mx: 'auto'
        }}>
          {/* Left Side - Sophisticated Animation */}
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 4
          }}>
            <Box sx={{
              position: 'relative',
              width: { xs: 280, md: 350 },
              height: { xs: 280, md: 350 }
            }}>
              {/* Neural Network Visualization */}
              <Box sx={{
                position: 'absolute',
                inset: 0,
                background: 'radial-gradient(circle at center, rgba(0, 245, 255, 0.1) 0%, transparent 70%)',
                borderRadius: '50%',
                animation: 'pulse 3s ease-in-out infinite'
              }} />
              
              {/* Rotating Rings */}
              {[0, 1, 2].map((ring) => (
                <Box
                  key={ring}
                  sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    width: `${80 + ring * 60}px`,
                    height: `${80 + ring * 60}px`,
                    border: '1px solid rgba(0, 245, 255, 0.2)',
                    borderRadius: '50%',
                    transform: 'translate(-50%, -50%)',
                    animation: `rotate${ring} ${15 + ring * 5}s linear infinite`,
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      top: -2,
                      left: -2,
                      width: 4,
                      height: 4,
                      background: '#00f5ff',
                      borderRadius: '50%',
                      boxShadow: '0 0 10px #00f5ff'
                    }
                  }}
                />
              ))}
              
              {/* Central Core */}
              <Box sx={{
                position: 'absolute',
                top: '50%',
                left: '50%',
                width: 60,
                height: 60,
                background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
                borderRadius: '50%',
                transform: 'translate(-50%, -50%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.5rem',
                boxShadow: '0 0 30px rgba(0, 245, 255, 0.5)'
              }}>
                🚀
              </Box>
              
              {/* Floating Particles */}
              {[...Array(8)].map((_, i) => (
                <Box
                  key={i}
                  sx={{
                    position: 'absolute',
                    width: 3,
                    height: 3,
                    background: '#8b5cf6',
                    borderRadius: '50%',
                    top: `${20 + Math.sin(i) * 60}%`,
                    left: `${20 + Math.cos(i) * 60}%`,
                    animation: `float${i} ${3 + i * 0.5}s ease-in-out infinite`,
                    boxShadow: '0 0 6px #8b5cf6'
                  }}
                />
              ))}
            </Box>
          </Box>

          {/* Right Side - Contact Form */}
          <Box sx={{
            background: 'rgba(20, 20, 30, 0.6)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            borderRadius: 3,
            p: 4
          }}>
            <form onSubmit={handleSubmit}>
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Your Name
                </Typography>
                <Box sx={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  '&:focus-within': {
                    border: '1px solid rgba(0, 245, 255, 0.5)',
                    boxShadow: '0 0 0 3px rgba(0, 245, 255, 0.1)'
                  }
                }}>
                  <input
                    type="text"
                    value={contactForm.name}
                    onChange={(e) => handleContactChange('name', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#ffffff',
                      fontSize: '1rem'
                    }}
                    placeholder="Enter your full name"
                    required
                  />
                </Box>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Email
                </Typography>
                <Box sx={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  '&:focus-within': {
                    border: '1px solid rgba(0, 245, 255, 0.5)',
                    boxShadow: '0 0 0 3px rgba(0, 245, 255, 0.1)'
                  }
                }}>
                  <input
                    type="email"
                    value={contactForm.email}
                    onChange={(e) => handleContactChange('email', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#ffffff',
                      fontSize: '1rem'
                    }}
                    placeholder="your.email@example.com"
                    required
                  />
                </Box>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Subject
                </Typography>
                <Box sx={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  '&:focus-within': {
                    border: '1px solid rgba(0, 245, 255, 0.5)',
                    boxShadow: '0 0 0 3px rgba(0, 245, 255, 0.1)'
                  }
                }}>
                  <input
                    type="text"
                    value={contactForm.subject}
                    onChange={(e) => handleContactChange('subject', e.target.value)}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#ffffff',
                      fontSize: '1rem'
                    }}
                    placeholder="What's this about?"
                  />
                </Box>
              </Box>
              
              <Box sx={{ mb: 4 }}>
                <Typography variant="body2" sx={{ color: 'text.secondary', mb: 1, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  Your Message
                </Typography>
                <Box sx={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: 2,
                  '&:focus-within': {
                    border: '1px solid rgba(0, 245, 255, 0.5)',
                    boxShadow: '0 0 0 3px rgba(0, 245, 255, 0.1)'
                  }
                }}>
                  <textarea
                    value={contactForm.message}
                    onChange={(e) => handleContactChange('message', e.target.value)}
                    rows={6}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: '#ffffff',
                      fontSize: '1rem',
                      resize: 'vertical',
                      minHeight: '120px'
                    }}
                    placeholder="Tell us about your project or inquiry..."
                    required
                  />
                </Box>
              </Box>
              
              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  py: 2,
                  background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
                  boxShadow: '0 8px 32px rgba(0, 245, 255, 0.3)',
                  textTransform: 'none',
                  '&:hover': {
                    boxShadow: '0 12px 48px rgba(0, 245, 255, 0.4)',
                    transform: 'translateY(-2px)'
                  },
                  transition: 'all 0.3s ease'
                }}
              >
                Send Message 📧
              </Button>
            </form>
          </Box>
        </Box>
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