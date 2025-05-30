import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';

const ParticleLogo = () => {
  return (
    <Box sx={{ position: 'relative', width: 240, height: 120, mx: 'auto', mb: 6 }}>
      {/* Central neural network node */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 12,
          height: 12,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #00f5ff, #8b5cf6)',
          boxShadow: '0 0 30px #00f5ff66',
          zIndex: 10
        }}
      />
      
      {/* Diffusion particles */}
      {[...Array(24)].map((_, i) => {
        const angle = (i * 15) * Math.PI / 180;
        const radius = 45 + (i % 3) * 15;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return (
          <motion.div
            key={i}
            initial={{ 
              x: 0, 
              y: 0, 
              scale: 0,
              opacity: 0 
            }}
            animate={{ 
              x, 
              y, 
              scale: [0, 1.2, 0.8],
              opacity: [0, 1, 0.6] 
            }}
            transition={{
              duration: 2,
              delay: 0.3 + (i * 0.05),
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 0.5
            }}
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: 4 + (i % 3) * 2,
              height: 4 + (i % 3) * 2,
              borderRadius: '50%',
              background: `linear-gradient(45deg, ${i % 2 ? '#00f5ff' : '#8b5cf6'}, ${i % 2 ? '#8b5cf6' : '#00f5ff'})`,
              boxShadow: `0 0 ${8 + (i % 3) * 4}px ${i % 2 ? '#00f5ff' : '#8b5cf6'}66`
            }}
          />
        );
      })}
      
      {/* Connection lines */}
      {[...Array(8)].map((_, i) => (
        <motion.div
          key={`line-${i}`}
          initial={{ scaleX: 0, opacity: 0 }}
          animate={{ scaleX: 1, opacity: 0.3 }}
          transition={{
            duration: 1.5,
            delay: 0.8 + (i * 0.1),
            ease: "easeOut"
          }}
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 60,
            height: 1,
            background: 'linear-gradient(90deg, transparent, #00f5ff66, transparent)',
            transformOrigin: 'left center',
            transform: `translate(-50%, -50%) rotate(${i * 45}deg)`
          }}
        />
      ))}
    </Box>
  );
};

const FloatingElements = () => (
  <>
    {[...Array(12)].map((_, i) => (
      <motion.div
        key={i}
        initial={{ opacity: 0, y: 100 }}
        animate={{ 
          opacity: [0, 0.4, 0],
          y: [-100, -200],
          x: [0, (Math.random() - 0.5) * 100]
        }}
        transition={{
          duration: 4 + Math.random() * 2,
          delay: Math.random() * 3,
          repeat: Infinity,
          ease: "easeOut"
        }}
        style={{
          position: 'absolute',
          left: `${Math.random() * 100}%`,
          bottom: 0,
          width: 3 + Math.random() * 4,
          height: 3 + Math.random() * 4,
          borderRadius: '50%',
          background: Math.random() > 0.5 ? '#00f5ff' : '#8b5cf6',
          boxShadow: `0 0 10px ${Math.random() > 0.5 ? '#00f5ff' : '#8b5cf6'}66`
        }}
      />
    ))}
  </>
);

export default function SplashScreen() {
  const [loadingStage, setLoadingStage] = useState(0);
  
  useEffect(() => {
    const stages = [
      { delay: 500, stage: 1 },
      { delay: 1200, stage: 2 },
      { delay: 1800, stage: 3 }
    ];
    
    stages.forEach(({ delay, stage }) => {
      setTimeout(() => setLoadingStage(stage), delay);
    });
  }, []);

  return (
    <Box sx={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, #0a0a0a 0%, #000 100%)',
      color: '#fff',
      position: 'relative',
      overflow: 'hidden',
      fontFamily: '"Inter", sans-serif'
    }}>
      
      {/* Animated background gradient */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(ellipse at 20% 30%, #00f5ff0a 0%, transparent 50%), radial-gradient(ellipse at 80% 70%, #8b5cf60a 0%, transparent 50%)',
          zIndex: 1
        }}
      />
      
      <FloatingElements />
      
      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        style={{ zIndex: 10, textAlign: 'center' }}
      >
        <ParticleLogo />
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 300,
              letterSpacing: 8,
              fontSize: { xs: '1.8rem', md: '3rem' },
              background: 'linear-gradient(90deg, #fff 20%, #00f5ff 50%, #8b5cf6 80%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              mb: 2
            }}
          >
            DDPO
          </Typography>
          <Typography 
            variant="h6" 
            sx={{ 
              fontWeight: 300,
              opacity: 0.7,
              letterSpacing: 3,
              fontSize: { xs: '0.9rem', md: '1.25rem' }
            }}
          >
            CS106 • Group 4
          </Typography>
        </motion.div>
      </motion.div>
      
      {/* Modern loading indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{
          position: 'absolute',
          bottom: 80,
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 10
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{
                scale: loadingStage > i ? [1, 1.5, 1] : 1,
                opacity: loadingStage > i ? [0.5, 1, 0.8] : 0.3
              }}
              transition={{
                duration: 0.6,
                ease: "easeInOut",
                repeat: loadingStage > i ? Infinity : 0,
                repeatDelay: 0.2
              }}
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: loadingStage > i ? 
                  'linear-gradient(45deg, #00f5ff, #8b5cf6)' : 
                  '#333',
                boxShadow: loadingStage > i ? '0 0 20px #00f5ff66' : 'none'
              }}
            />
          ))}
        </Box>
        
        <Typography 
          variant="caption" 
          sx={{ 
            mt: 2, 
            display: 'block', 
            textAlign: 'center',
            opacity: 0.5,
            letterSpacing: 2,
            fontSize: '0.75rem'
          }}
        >
          INITIALIZING
        </Typography>
      </motion.div>
    </Box>
  );
} 