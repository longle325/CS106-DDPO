import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Paper, Box, TextField, Button, Slider, Select, MenuItem, InputLabel, FormControl, IconButton, Chip, Divider, Card, CardMedia, CardActions, Alert, CircularProgress, LinearProgress, Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { motion, AnimatePresence } from 'framer-motion';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import ImageIcon from '@mui/icons-material/Image';
import TuneIcon from '@mui/icons-material/Tune';
import PhotoLibraryIcon from '@mui/icons-material/PhotoLibrary';
import DownloadIcon from '@mui/icons-material/Download';
import ArchiveIcon from '@mui/icons-material/Archive';
import DeleteIcon from '@mui/icons-material/Delete';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import InfoIcon from '@mui/icons-material/Info';
import HistoryIcon from '@mui/icons-material/History';
import CloseIcon from '@mui/icons-material/Close';
import DDPOLogo from '../components/DDPOLogo';

const API_BASE = 'https://cd19-192-222-50-114.ngrok-free.app';

const samplingMethods = [
  'DDPM', 'Euler a', 'Euler', 'LMS', 'Heun', 'DPM2', 'DPM++ 2M', 'DDIM', 'PLMS'
];

const presetPrompts = [
  "A majestic mountain landscape at golden hour, highly detailed, photorealistic",
  "Portrait of a serene woman with flowing hair, artistic, beautiful lighting", 
  "Futuristic cityscape with neon lights, cyberpunk aesthetic, high quality",
  "Abstract geometric patterns with vibrant colors, modern art style",
  "A cute puppy playing in a sunny garden, adorable, sharp focus",
  "Elegant architecture with classical columns, professional photography"
];

export default function InferencePage() {
  const [checkpoints, setCheckpoints] = useState([]);
  const [checkpoint, setCheckpoint] = useState('aesthetic');
  const [samplingMethod, setSamplingMethod] = useState('DDPM');
  const [samplingSteps, setSamplingSteps] = useState(20);
  const [width, setWidth] = useState(512);
  const [height, setHeight] = useState(512);
  const [batchCount, setBatchCount] = useState(1);
  const [batchSize, setBatchSize] = useState(1);
  const [cfgScale, setCfgScale] = useState(7.5);
  const [seed, setSeed] = useState(123456789);
  const [prompt, setPrompt] = useState('');
  const [negativePrompt, setNegativePrompt] = useState('');
  const [images, setImages] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState('');
  const [lastMetadata, setLastMetadata] = useState(null);
  const [backendHealth, setBackendHealth] = useState(null);
  const [checkpointLoading, setCheckpointLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingMessage, setLoadingMessage] = useState('');
  
  // New states for image history and detailed view
  const [imageHistory, setImageHistory] = useState([]);
  const [selectedImageDetails, setSelectedImageDetails] = useState(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Add generation timer states
  const [generationStartTime, setGenerationStartTime] = useState(null);
  const [generationElapsedTime, setGenerationElapsedTime] = useState(0);

  // Check backend health on component mount
  useEffect(() => {
    checkBackendHealth();
    loadCheckpoints();
  }, []);

  // Refresh health check periodically and after checkpoint changes
  useEffect(() => {
    const interval = setInterval(checkBackendHealth, 10000); // Check every 10 seconds
    return () => clearInterval(interval);
  }, []);

  // Load image history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('ddpo_image_history');
    if (savedHistory) {
      try {
        setImageHistory(JSON.parse(savedHistory));
      } catch (error) {
        console.error('Failed to load image history:', error);
      }
    }
  }, []);

  // Save image history to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('ddpo_image_history', JSON.stringify(imageHistory));
  }, [imageHistory]);

  // Add timer effect for generation
  useEffect(() => {
    let interval;
    if (isGenerating && generationStartTime) {
      interval = setInterval(() => {
        const elapsed = Date.now() - generationStartTime;
        setGenerationElapsedTime(elapsed);
      }, 100); // Update every 100ms for smooth timer
    } else {
      setGenerationElapsedTime(0);
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isGenerating, generationStartTime]);

  const checkBackendHealth = async () => {
    try {
      console.log('Checking backend health at:', `${API_BASE}/health`);
      const response = await fetch(`${API_BASE}/health`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });
      
      console.log('Health check response status:', response.status);
      console.log('Health check response headers:', response.headers);
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const health = await response.json();
      console.log('Backend health data:', health);
      setBackendHealth(health);
    } catch (error) {
      console.error('Backend health check failed:', error);
      setBackendHealth({ status: 'error', model_loaded: false, error: error.message });
    }
  };

  const loadCheckpoints = async () => {
    try {
      const response = await fetch(`${API_BASE}/checkpoints`, {
        headers: {
          'ngrok-skip-browser-warning': 'true',
        },
      });
      const data = await response.json();
      setCheckpoints(data.checkpoints || []);
    } catch (error) {
      console.error('Failed to load checkpoints:', error);
    }
  };

  const handleRandomSeed = () => {
    setSeed(Math.floor(Math.random() * 1e9));
  };

  const handlePresetPrompt = (presetPrompt) => {
    setPrompt(presetPrompt);
  };

  const handleCheckpointChange = async (newCheckpoint) => {
    setCheckpoint(newCheckpoint);
    setCheckpointLoading(true);
    setLoadingProgress(0);
    setError('');
    
    // Try to preload the checkpoint
    try {
      console.log(`Preloading checkpoint: ${newCheckpoint}`);
      
      // Start polling progress
      const pollProgress = async () => {
        try {
          const progressResponse = await fetch(`${API_BASE}/loading_progress`, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
          });
          if (progressResponse.ok) {
            const progressData = await progressResponse.json();
            setLoadingProgress(progressData.progress || 0);
            setLoadingMessage(progressData.message || 'Loading...');
            
            if (progressData.status === 'completed' || progressData.status === 'error') {
              return true; // Stop polling
            }
          }
        } catch (e) {
          console.log('Failed to get progress:', e);
        }
        return false;
      };
      
      // Start loading checkpoint
      const loadPromise = fetch(`${API_BASE}/load_checkpoint`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify({ checkpoint: newCheckpoint }),
      });
      
      // Poll progress every 500ms
      const progressInterval = setInterval(async () => {
        const shouldStop = await pollProgress();
        if (shouldStop) {
          clearInterval(progressInterval);
        }
      }, 500);
      
      const response = await loadPromise;
      clearInterval(progressInterval);
      
      if (response.ok) {
        const result = await response.json();
        console.log('Checkpoint loaded:', result);
        setLoadingProgress(100);
        
        // Refresh health status immediately
        setTimeout(() => {
          checkBackendHealth();
          setCheckpointLoading(false);
          setLoadingProgress(0);
          setLoadingMessage('');
        }, 1000);
      } else {
        throw new Error(`Failed to load checkpoint: ${response.statusText}`);
      }
    } catch (error) {
      console.log('Failed to preload checkpoint:', error);
      setError(`Failed to load checkpoint: ${error.message}`);
      setCheckpointLoading(false);
      setLoadingProgress(0);
      setLoadingMessage('');
      // Not critical, will load during generation
    }
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError('');
    setGenerationStartTime(Date.now()); // Start the timer
    
    try {
      const requestData = {
        prompt: prompt.trim(),
        negative_prompt: negativePrompt.trim(),
        checkpoint: checkpoint,
        sampling_method: samplingMethod,
        sampling_steps: samplingSteps,
        width: width,
        height: height,
        batch_count: batchCount,
        batch_size: batchSize,
        cfg_scale: cfgScale,
        seed: seed === '' ? -1 : parseInt(seed),
        use_aesthetic_scoring: true
      };

      // Start generation request
      const generatePromise = fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true',
        },
        body: JSON.stringify(requestData),
      });
      
      const response = await generatePromise;

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Generation failed');
      }

      const data = await response.json();
      setImages(data.images);
      
      // Enhanced metadata with model name
      const enhancedMetadata = {
        ...data.metadata,
        model_name: checkpoint === 'aesthetic' ? 'Aesthetic DDPO' : 'Stable Diffusion v1.4',
        timestamp: new Date().toISOString()
      };
      setLastMetadata(enhancedMetadata);
      
      // Add to image history
      const historyEntry = {
        id: Date.now(),
        images: data.images,
        metadata: enhancedMetadata,
        timestamp: new Date().toISOString()
      };
      setImageHistory(prev => [historyEntry, ...prev.slice(0, 49)]); // Keep last 50 entries
      
      // Update seed with the actual seed used
      if (data.metadata.seed !== undefined) {
        setSeed(data.metadata.seed);
      }
      
      // Refresh backend health to show current checkpoint
      checkBackendHealth();
      
    } catch (error) {
      console.error('Generation error:', error);
      setError(error.message);
    } finally {
      setIsGenerating(false);
      setGenerationStartTime(null); // Reset timer
    }
  };

  const handleSaveImage = (imageUrl, index) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ddpo_generated_${Date.now()}_${index + 1}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleSaveAllImages = () => {
    images.forEach((imageUrl, index) => {
      setTimeout(() => {
        handleSaveImage(imageUrl, index);
      }, index * 100);
    });
  };

  const handleDeleteImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleViewFullscreen = (imageUrl) => {
    const newWindow = window.open('', '_blank');
    newWindow.document.write(`
      <html>
        <head><title>DDPO Generated Image</title></head>
        <body style="margin:0; padding:20px; background:#000; display:flex; justify-content:center; align-items:center; min-height:100vh;">
          <img src="${imageUrl}" style="max-width:100%; max-height:100%; object-fit:contain;" />
        </body>
      </html>
    `);
  };

  // New function to handle image detail view
  const handleShowImageDetails = (imageData, imageIndex = 0) => {
    setSelectedImageDetails({
      ...imageData,
      selectedImageIndex: imageIndex
    });
    setDetailDialogOpen(true);
  };

  // New function to handle history image click
  const handleHistoryImageClick = (historyItem, imageIndex = 0) => {
    const detailsWithImages = {
      ...historyItem.metadata,
      images: historyItem.images,
      selectedImageIndex: imageIndex
    };
    setSelectedImageDetails(detailsWithImages);
    setDetailDialogOpen(true);
  };

  // New function to clear history
  const handleClearHistory = () => {
    setImageHistory([]);
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
            <DDPOLogo size={40} showAnimation={true} />
            <Typography 
              variant="h3" 
              sx={{ 
                fontWeight: 300,
                ml: 2,
                background: 'linear-gradient(135deg, #ffffff, #00f5ff, #8b5cf6)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Generation Studio
            </Typography>
          </Box>
          <Typography variant="h6" color="text.secondary" sx={{ fontWeight: 300 }}>
            Create stunning images with advanced DDPO technology
          </Typography>
          
          {/* Backend Status */}
          {backendHealth && (
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center' }}>
              <Chip 
                label={
                  backendHealth.status === 'healthy' 
                    ? `Current Model: ${backendHealth.current_checkpoint || 'Unknown'}${checkpointLoading ? ' (Loading...)' : ''} | Loaded: ${backendHealth.model_loaded ? 'Yes' : 'No'} | Aesthetic Scorer: ${backendHealth.aesthetic_scorer ? 'Ready' : 'Not Available'}`
                    : backendHealth.error 
                      ? `Backend Error: ${backendHealth.error}`
                      : 'Backend Error'
                }
                color={backendHealth.status === 'healthy' && backendHealth.model_loaded && !checkpointLoading ? 'success' : 'warning'}
                size="small"
                sx={{ maxWidth: '90%' }}
                icon={checkpointLoading ? <CircularProgress size={16} color="inherit" /> : undefined}
              />
            </Box>
          )}
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        <Grid container spacing={4}>
          {/* Left Panel - Parameters + Prompt Combined */}
          <Grid item xs={12} lg={5}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                borderRadius: 3,
                background: 'rgba(20, 25, 40, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              {/* Parameters Section */}
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <TuneIcon sx={{ mr: 1, color: 'primary.main' }} />
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  Parameters
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3, mb: 4 }}>
                {/* Model Selection - Limited to 2 options */}
                <FormControl fullWidth>
                  <InputLabel>Model Checkpoint</InputLabel>
                  <Select
                    value={checkpoint}
                    label="Model Checkpoint"
                    onChange={e => handleCheckpointChange(e.target.value)}
                    disabled={checkpointLoading || isGenerating}
                  >
                    <MenuItem value="aesthetic">Aesthetic DDPO (Recommended)</MenuItem>
                    <MenuItem value="sd14">Stable Diffusion v1.4</MenuItem>
                  </Select>
                  
                  {/* Checkpoint Loading Progress */}
                  {checkpointLoading && (
                    <Box sx={{ mt: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography variant="body2" color="text.secondary" sx={{ flexGrow: 1 }}>
                          {loadingMessage || 'Loading checkpoint...'}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {Math.round(loadingProgress)}%
                        </Typography>
                      </Box>
                      <LinearProgress 
                        variant="determinate" 
                        value={loadingProgress} 
                        sx={{
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: 'rgba(255, 255, 255, 0.1)',
                          '& .MuiLinearProgress-bar': {
                            borderRadius: 3,
                            background: 'linear-gradient(90deg, #00f5ff, #8b5cf6)',
                          }
                        }}
                      />
                    </Box>
                  )}
                </FormControl>

                {/* Sampling */}
                <FormControl fullWidth>
                  <InputLabel>Sampling Method</InputLabel>
                  <Select
                    value={samplingMethod}
                    label="Sampling Method"
                    onChange={e => setSamplingMethod(e.target.value)}
                  >
                    {samplingMethods.map(method => (
                      <MenuItem key={method} value={method}>{method}</MenuItem>
                    ))}
                  </Select>
                </FormControl>

                <Box>
                  <Typography gutterBottom sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>Sampling Steps</span>
                    <Chip label={samplingSteps} size="small" color="primary" />
                  </Typography>
                  <Slider 
                    min={1} 
                    max={100} 
                    value={samplingSteps} 
                    onChange={(_, v) => setSamplingSteps(v)} 
                    sx={{ color: 'primary.main' }}
                  />
                </Box>

                {/* Dimensions */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Box flex={1}>
                    <Typography gutterBottom sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Width</span>
                      <Chip label={width} size="small" />
                    </Typography>
                    <Slider min={256} max={1024} step={64} value={width} onChange={(_, v) => setWidth(v)} />
                  </Box>
                  <Box flex={1}>
                    <Typography gutterBottom sx={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Height</span>
                      <Chip label={height} size="small" />
                    </Typography>
                    <Slider min={256} max={1024} step={64} value={height} onChange={(_, v) => setHeight(v)} />
                  </Box>
                </Box>

                {/* Batch Settings */}
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <TextField
                    label="Batch Count"
                    type="number"
                    value={batchCount}
                    onChange={e => setBatchCount(Number(e.target.value))}
                    inputProps={{ min: 1, max: 8 }}
                    size="small"
                    fullWidth
                  />
                  <TextField
                    label="Batch Size"
                    type="number"
                    value={batchSize}
                    onChange={e => setBatchSize(Number(e.target.value))}
                    inputProps={{ min: 1, max: 4 }}
                    size="small"
                    fullWidth
                  />
                </Box>

                <Box>
                  <Typography gutterBottom sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span>CFG Scale</span>
                    <Chip label={cfgScale} size="small" color="secondary" />
                  </Typography>
                  <Slider min={1} max={20} step={0.5} value={cfgScale} onChange={(_, v) => setCfgScale(v)} />
                </Box>

                {/* Seed */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <TextField
                    label="Seed"
                    type="number"
                    value={seed}
                    onChange={e => setSeed(e.target.value === '' ? '' : Number(e.target.value))}
                    size="small"
                    fullWidth
                    placeholder="Random"
                  />
                  <IconButton onClick={handleRandomSeed} color="primary">
                    <AutorenewIcon />
                  </IconButton>
                </Box>
              </Box>

              <Divider sx={{ opacity: 0.1, mb: 4 }} />

              {/* Prompt Section */}
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 500 }}>
                Prompt
              </Typography>
              
              <TextField
                label="Describe your image"
                value={prompt}
                onChange={e => setPrompt(e.target.value)}
                multiline
                minRows={3}
                fullWidth
                placeholder="A beautiful landscape with mountains and lakes..."
                sx={{ mb: 3 }}
              />

              <Typography variant="subtitle2" sx={{ mb: 2, opacity: 0.7 }}>
                Quick Presets:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
                {presetPrompts.map((preset, index) => (
                  <Chip
                    key={index}
                    label={preset.split(',')[0] + '...'}
                    variant="outlined"
                    size="small"
                    onClick={() => handlePresetPrompt(preset)}
                    sx={{ cursor: 'pointer' }}
                  />
                ))}
              </Box>

              <TextField
                label="Negative Prompt (Optional)"
                value={negativePrompt}
                onChange={e => setNegativePrompt(e.target.value)}
                multiline
                minRows={2}
                fullWidth
                placeholder="low quality, blurry..."
                sx={{ mb: 3 }}
              />

              <Button
                variant="contained"
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating || checkpointLoading}
                fullWidth
                size="large"
                sx={{
                  py: 1.5,
                  background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #00c4db, #7c3aed)',
                  },
                  '&:disabled': {
                    background: 'rgba(255, 255, 255, 0.1)',
                  }
                }}
              >
                {isGenerating ? 'Generating...' : 'Generate Image'}
              </Button>
            </Paper>
          </Grid>

          {/* Right Panel - Generated Images */}
          <Grid item xs={12} lg={7}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                borderRadius: 3,
                background: 'rgba(20, 25, 40, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '600px'
              }}
            >
              {/* Header */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <ImageIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    Generated Images
                  </Typography>
                  {images.length > 0 && (
                    <Chip 
                      label={`${images.length} images`} 
                      size="small" 
                      color="primary" 
                      sx={{ ml: 2 }}
                    />
                  )}
                </Box>
                
                {images.length > 1 && (
                  <Button
                    startIcon={<ArchiveIcon />}
                    onClick={handleSaveAllImages}
                    size="small"
                    variant="outlined"
                    sx={{
                      borderColor: 'rgba(255, 255, 255, 0.2)',
                      color: 'text.secondary',
                      '&:hover': {
                        borderColor: 'primary.main',
                        color: 'primary.main'
                      }
                    }}
                  >
                    Save All
                  </Button>
                )}
              </Box>

              {/* Centered Gallery Content */}
              <Box sx={{ 
                flex: 1, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center'
              }}>
                <AnimatePresence>
                  {isGenerating ? (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        gap: '24px',
                        minHeight: '400px',
                        width: '100%'
                      }}
                    >
                      <DDPOLogo size={60} showAnimation={true} />
                      <Typography color="text.secondary" variant="h6">
                        Generating your image...
                      </Typography>
                      <Typography color="primary.main" variant="h5" sx={{ fontWeight: 500, fontFamily: 'monospace' }}>
                        {Math.floor(generationElapsedTime / 1000)}s
                      </Typography>
                      <Typography color="text.secondary" variant="body2" sx={{ opacity: 0.7 }}>
                        This may take a few moments
                      </Typography>
                    </motion.div>
                  ) : images.length === 0 ? (
                    <Box sx={{ 
                      display: 'flex', 
                      flexDirection: 'column', 
                      alignItems: 'center', 
                      justifyContent: 'center',
                      minHeight: '400px',
                      width: '100%',
                      opacity: 0.5,
                      border: '2px dashed rgba(255, 255, 255, 0.1)',
                      borderRadius: 3,
                      background: 'rgba(0, 0, 0, 0.2)'
                    }}>
                      <ImageIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                      <Typography color="text.secondary">
                        Your generated images will appear here
                      </Typography>
                    </Box>
                  ) : (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.5 }}
                      style={{ width: '100%' }}
                    >
                      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 3 }}>
                        {images.map((img, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <Card 
                              sx={{ 
                                background: 'rgba(15, 20, 35, 0.8)',
                                border: '1px solid rgba(255, 255, 255, 0.05)',
                                borderRadius: 2,
                                overflow: 'hidden',
                                transition: 'all 0.3s ease',
                                '&:hover': {
                                  transform: 'translateY(-4px)',
                                  boxShadow: '0 12px 40px rgba(0, 245, 255, 0.15)',
                                  border: '1px solid rgba(0, 245, 255, 0.3)'
                                }
                              }}
                            >
                              <CardMedia
                                component="img"
                                image={img}
                                alt={`Generated ${idx + 1}`}
                                sx={{ 
                                  aspectRatio: '1/1',
                                  objectFit: 'cover',
                                  cursor: 'pointer'
                                }}
                                onClick={() => handleViewFullscreen(img)}
                              />
                              <CardActions sx={{ 
                                p: 2, 
                                justifyContent: 'space-between',
                                background: 'rgba(0, 0, 0, 0.3)'
                              }}>
                                <Box sx={{ display: 'flex', gap: 1 }}>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleSaveImage(img, idx)}
                                    sx={{ 
                                      color: 'primary.main',
                                      '&:hover': { backgroundColor: 'rgba(0, 245, 255, 0.1)' }
                                    }}
                                    title="Save Image"
                                  >
                                    <DownloadIcon />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleViewFullscreen(img)}
                                    sx={{ 
                                      color: 'text.secondary',
                                      '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.1)' }
                                    }}
                                    title="View Fullscreen"
                                  >
                                    <FullscreenIcon />
                                  </IconButton>
                                  <IconButton
                                    size="small"
                                    onClick={() => handleShowImageDetails(lastMetadata, idx)}
                                    sx={{ 
                                      color: 'info.main',
                                      '&:hover': { backgroundColor: 'rgba(33, 150, 243, 0.1)' }
                                    }}
                                    title="View Details"
                                  >
                                    <InfoIcon />
                                  </IconButton>
                                </Box>
                                <IconButton
                                  size="small"
                                  onClick={() => handleDeleteImage(idx)}
                                  sx={{ 
                                    color: 'error.main',
                                    '&:hover': { backgroundColor: 'rgba(244, 67, 54, 0.1)' }
                                  }}
                                  title="Delete Image"
                                >
                                  <DeleteIcon />
                                </IconButton>
                              </CardActions>
                            </Card>
                          </motion.div>
                        ))}
                      </Box>
                      
                      {/* Image Generation Info */}
                      {images.length > 0 && lastMetadata && (
                        <Box sx={{ 
                          mt: 3, 
                          p: 2, 
                          background: 'rgba(0, 0, 0, 0.2)', 
                          borderRadius: 2,
                          border: '1px solid rgba(255, 255, 255, 0.05)'
                        }}>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                            <strong>Model:</strong> {lastMetadata.model_name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                            <strong>Prompt:</strong> {lastMetadata.prompt}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                            <strong>Settings:</strong> Steps: {lastMetadata.sampling_steps}, CFG: {lastMetadata.cfg_scale}, Size: {lastMetadata.width}×{lastMetadata.height}, Seed: {lastMetadata.seed}
                          </Typography>
                          {lastMetadata.aesthetic_scores && (
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                              <strong>Aesthetic Scores:</strong> {lastMetadata.aesthetic_scores.map(s => s.toFixed(2)).join(', ')}
                            </Typography>
                          )}
                        </Box>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Image History Section */}
        {imageHistory.length > 0 && (
          <Box sx={{ mt: 4 }}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                borderRadius: 3,
                background: 'rgba(20, 25, 40, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <HistoryIcon sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6" sx={{ fontWeight: 500 }}>
                    Image History
                  </Typography>
                  <Chip 
                    label={`${imageHistory.length} generations`} 
                    size="small" 
                    color="primary" 
                    sx={{ ml: 2 }}
                  />
                </Box>
                <Button
                  startIcon={<DeleteIcon />}
                  onClick={handleClearHistory}
                  size="small"
                  variant="outlined"
                  color="error"
                  sx={{
                    borderColor: 'rgba(244, 67, 54, 0.2)',
                    '&:hover': {
                      borderColor: 'error.main',
                    }
                  }}
                >
                  Clear History
                </Button>
              </Box>
              
              <Box sx={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', 
                gap: 2,
                maxHeight: '300px',
                overflowY: 'auto',
                '&::-webkit-scrollbar': {
                  width: '8px',
                },
                '&::-webkit-scrollbar-track': {
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '4px',
                },
                '&::-webkit-scrollbar-thumb': {
                  background: 'rgba(0, 245, 255, 0.3)',
                  borderRadius: '4px',
                  '&:hover': {
                    background: 'rgba(0, 245, 255, 0.5)',
                  }
                }
              }}>
                {imageHistory.map((historyItem) => (
                  historyItem.images.map((img, imgIndex) => (
                    <motion.div
                      key={`${historyItem.id}-${imgIndex}`}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Card 
                        sx={{ 
                          background: 'rgba(15, 20, 35, 0.8)',
                          border: '1px solid rgba(255, 255, 255, 0.05)',
                          borderRadius: 2,
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          '&:hover': {
                            transform: 'translateY(-2px)',
                            boxShadow: '0 8px 20px rgba(0, 245, 255, 0.1)',
                            border: '1px solid rgba(0, 245, 255, 0.3)'
                          }
                        }}
                      >
                        <CardMedia
                          component="img"
                          image={img}
                          alt={`History ${historyItem.id}-${imgIndex}`}
                          sx={{ 
                            aspectRatio: '1/1',
                            objectFit: 'cover',
                            cursor: 'pointer'
                          }}
                          onClick={() => handleHistoryImageClick(historyItem, imgIndex)}
                        />
                        <Box sx={{ 
                          p: 1, 
                          background: 'rgba(0, 0, 0, 0.6)',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}>
                          <Box sx={{ flex: 1, textAlign: 'center' }}>
                            <Typography variant="caption" color="text.secondary" sx={{ fontSize: '0.7rem', display: 'block' }}>
                              {historyItem.metadata.model_name}
                            </Typography>
                            {historyItem.metadata.aesthetic_scores && historyItem.metadata.aesthetic_scores[imgIndex] && (
                              <Typography variant="caption" color="primary.main" sx={{ fontSize: '0.7rem' }}>
                                {historyItem.metadata.aesthetic_scores[imgIndex].toFixed(2)}
                              </Typography>
                            )}
                          </Box>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSaveImage(img, imgIndex);
                            }}
                            sx={{ 
                              color: 'primary.main',
                              ml: 1,
                              '&:hover': { backgroundColor: 'rgba(0, 245, 255, 0.1)' }
                            }}
                            title="Download Image"
                          >
                            <DownloadIcon sx={{ fontSize: '1rem' }} />
                          </IconButton>
                        </Box>
                      </Card>
                    </motion.div>
                  ))
                ))}
              </Box>
            </Paper>
          </Box>
        )}

        {/* Image Details Dialog */}
        <Dialog
          open={detailDialogOpen}
          onClose={() => setDetailDialogOpen(false)}
          maxWidth="md"
          fullWidth
          PaperProps={{
            sx: {
              background: 'rgba(20, 25, 40, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
            }
          }}
        >
          <DialogTitle sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            borderBottom: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <Typography variant="h6">Image Details</Typography>
            <IconButton 
              onClick={() => setDetailDialogOpen(false)}
              sx={{ color: 'text.secondary' }}
            >
              <CloseIcon />
            </IconButton>
          </DialogTitle>
          <DialogContent sx={{ p: 3 }}>
            {selectedImageDetails && (
              <Box>
                {/* Selected Image Display */}
                {selectedImageDetails.images && selectedImageDetails.images[selectedImageDetails.selectedImageIndex || 0] && (
                  <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Box sx={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={selectedImageDetails.images[selectedImageDetails.selectedImageIndex || 0]}
                        alt="Selected"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '400px',
                          borderRadius: '12px',
                          objectFit: 'contain',
                          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)'
                        }}
                      />
                      <Box sx={{ 
                        mt: 2,
                        display: 'flex',
                        justifyContent: 'center',
                        gap: 2
                      }}>
                        <Button
                          variant="contained"
                          startIcon={<DownloadIcon />}
                          onClick={() => handleSaveImage(
                            selectedImageDetails.images[selectedImageDetails.selectedImageIndex || 0], 
                            selectedImageDetails.selectedImageIndex || 0
                          )}
                          sx={{
                            background: 'linear-gradient(135deg, #00f5ff, #8b5cf6)',
                            '&:hover': {
                              background: 'linear-gradient(135deg, #00c4db, #7c3aed)',
                            }
                          }}
                        >
                          Download Image
                        </Button>
                        <Button
                          variant="outlined"
                          startIcon={<FullscreenIcon />}
                          onClick={() => handleViewFullscreen(selectedImageDetails.images[selectedImageDetails.selectedImageIndex || 0])}
                          sx={{
                            borderColor: 'rgba(255, 255, 255, 0.2)',
                            color: 'text.secondary',
                            '&:hover': {
                              borderColor: 'primary.main',
                              color: 'primary.main'
                            }
                          }}
                        >
                          View Fullscreen
                        </Button>
                      </Box>
                    </Box>
                  </Box>
                )}
                
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="primary.main" gutterBottom>
                      Model Information
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2 }}>
                      <strong>Model:</strong> {selectedImageDetails.model_name}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle2" color="primary.main" gutterBottom>
                      Prompt
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 2, p: 2, background: 'rgba(0, 0, 0, 0.2)', borderRadius: 1 }}>
                      {selectedImageDetails.prompt}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} sm={6}>
                    <Typography variant="subtitle2" color="primary.main" gutterBottom>
                      Generation Settings
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Steps:</strong> {selectedImageDetails.sampling_steps}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>CFG Scale:</strong> {selectedImageDetails.cfg_scale}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Size:</strong> {selectedImageDetails.width}×{selectedImageDetails.height}
                    </Typography>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                      <strong>Seed:</strong> {selectedImageDetails.seed}
                    </Typography>
                  </Grid>
                  
                  {selectedImageDetails.aesthetic_scores && (
                    <Grid item xs={12} sm={6}>
                      <Typography variant="subtitle2" color="primary.main" gutterBottom>
                        Aesthetic Scores
                      </Typography>
                      {selectedImageDetails.aesthetic_scores.map((score, index) => (
                        <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                          <strong>Image {index + 1}:</strong> {score.toFixed(2)}
                        </Typography>
                      ))}
                    </Grid>
                  )}
                  
                  {selectedImageDetails.timestamp && (
                    <Grid item xs={12}>
                      <Typography variant="subtitle2" color="primary.main" gutterBottom>
                        Generation Time
                      </Typography>
                      <Typography variant="body2">
                        {new Date(selectedImageDetails.timestamp).toLocaleString()}
                      </Typography>
                    </Grid>
                  )}
                </Grid>
              </Box>
            )}
          </DialogContent>
        </Dialog>
      </motion.div>
    </Container>
  );
} 