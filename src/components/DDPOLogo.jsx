import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const DDPOLogo = ({ size = 32, showAnimation = true }) => {
  return (
    <Box sx={{ 
      position: 'relative', 
      width: size * 1.5, 
      height: size, 
      display: 'flex', 
      alignItems: 'center',
      mr: 2
    }}>
      {/* Central core */}
      <motion.div
        initial={showAnimation ? { scale: 0 } : { scale: 1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          transform: 'translate(-50%, -50%)',
          width: size * 0.3,
          height: size * 0.3,
          borderRadius: '50%',
          background: 'linear-gradient(45deg, #00f5ff, #8b5cf6)',
          boxShadow: '0 0 20px #00f5ff66',
          zIndex: 3
        }}
      />
      
      {/* Diffusion rings */}
      {[1, 2, 3].map((ring) => (
        <motion.div
          key={ring}
          initial={showAnimation ? { scale: 0, opacity: 0 } : { scale: 1, opacity: 0.3 }}
          animate={{ 
            scale: 1, 
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            delay: showAnimation ? ring * 0.2 : 0,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: size * (0.4 + ring * 0.2),
            height: size * (0.4 + ring * 0.2),
            borderRadius: '50%',
            border: `1px solid ${ring % 2 ? '#00f5ff' : '#8b5cf6'}`,
            opacity: 0.3,
            zIndex: 3 - ring
          }}
        />
      ))}
      
      {/* Particles */}
      {showAnimation && [...Array(8)].map((_, i) => {
        const angle = (i * 45) * Math.PI / 180;
        const radius = size * 0.6;
        const x = Math.cos(angle) * radius;
        const y = Math.sin(angle) * radius;
        
        return (
          <motion.div
            key={i}
            initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
            animate={{ 
              x, y, 
              scale: [0, 1, 0.7],
              opacity: [0, 1, 0.5] 
            }}
            transition={{
              duration: 1.5,
              delay: 0.5 + (i * 0.1),
              repeat: Infinity,
              repeatType: "reverse",
              repeatDelay: 1
            }}
            style={{
              position: 'absolute',
              left: '50%',
              top: '50%',
              width: size * 0.1,
              height: size * 0.1,
              borderRadius: '50%',
              background: i % 2 ? '#00f5ff' : '#8b5cf6',
              boxShadow: `0 0 10px ${i % 2 ? '#00f5ff' : '#8b5cf6'}66`
            }}
          />
        );
      })}
    </Box>
  );
};

export default DDPOLogo; 