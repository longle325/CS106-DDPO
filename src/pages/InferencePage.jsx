import React, { useState, useEffect } from 'react';
import {
  Container, Typography, Grid, Paper, Box, TextField, Button, Slider, Select, MenuItem, InputLabel, FormControl, IconButton, Chip, Divider, Card, CardMedia, CardActions, Alert, CircularProgress
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
import DDPOLogo from '../components/DDPOLogo';

const API_BASE = 'http://localhost:8000';

const samplingMethods = [
  'Euler a', 'Euler', 'LMS', 'Heun', 'DPM2', 'DPM++ 2M', 'DDIM', 'PLMS'
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
  const [samplingMethod, setSamplingMethod] = useState('DDIM');
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

  // Check backend health on component mount
  useEffect(() => {
    checkBackendHealth();
    loadCheckpoints();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const response = await fetch(`${API_BASE}/health`);
      const health = await response.json();
      setBackendHealth(health);
    } catch (error) {
      console.error('Backend health check failed:', error);
      setBackendHealth({ status: 'error', model_loaded: false });
    }
  };

  const loadCheckpoints = async () => {
    try {
      const response = await fetch(`${API_BASE}/checkpoints`);
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

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    setError('');
    
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

      const response = await fetch(`${API_BASE}/generate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Generation failed');
      }

      const data = await response.json();
      setImages(data.images);
      setLastMetadata(data.metadata);
      
      // Update seed with the actual seed used
      if (data.metadata.seed !== undefined) {
        setSeed(data.metadata.seed);
      }
      
    } catch (error) {
      console.error('Generation error:', error);
      setError(error.message);
    } finally {
      setIsGenerating(false);
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
                    ? `Model: ${backendHealth.model_loaded ? 'Loaded' : 'Not Loaded'} | Aesthetic Scorer: ${backendHealth.aesthetic_scorer ? 'Ready' : 'Not Available'}`
                    : 'Backend Error'
                }
                color={backendHealth.status === 'healthy' && backendHealth.model_loaded ? 'success' : 'warning'}
                size="small"
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
                {/* Model Selection */}
                <FormControl fullWidth>
                  <InputLabel>Model Checkpoint</InputLabel>
                  <Select
                    value={checkpoint}
                    label="Model Checkpoint"
                    onChange={e => setCheckpoint(e.target.value)}
                  >
                    <MenuItem value="aesthetic">Aesthetic DDPO (Recommended)</MenuItem>
                    <MenuItem value="sd15">Stable Diffusion v1.5</MenuItem>
                    <MenuItem value="sd21">Stable Diffusion v2.1</MenuItem>
                    {checkpoints.map(cp => (
                      <MenuItem key={cp.path} value={cp.path}>{cp.name}</MenuItem>
                    ))}
                  </Select>
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
                placeholder="low quality, blurry, distorted..."
                sx={{ mb: 3 }}
              />

              <Button
                variant="contained"
                size="large"
                startIcon={isGenerating ? <CircularProgress size={20} color="inherit" /> : <ImageIcon />}
                onClick={handleGenerate}
                disabled={!prompt.trim() || isGenerating}
                fullWidth
                sx={{
                  py: 2,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  background: isGenerating ? 
                    'linear-gradient(45deg, #666, #888)' :
                    'linear-gradient(135deg, #00f5ff, #8b5cf6)',
                  boxShadow: isGenerating ? 'none' : '0 8px 32px rgba(0, 245, 255, 0.3)',
                  '&:hover': {
                    boxShadow: isGenerating ? 'none' : '0 12px 48px rgba(0, 245, 255, 0.4)',
                  }
                }}
              >
                {isGenerating ? 'Generating...' : 'Generate Image'}
              </Button>
            </Paper>
          </Grid>

          {/* Right Panel - Generated Images Gallery Only */}
          <Grid item xs={12} lg={7}>
            <Paper 
              elevation={0}
              sx={{ 
                p: 4, 
                borderRadius: 3,
                background: 'rgba(20, 25, 40, 0.6)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                minHeight: 600,
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <PhotoLibraryIcon sx={{ mr: 1, color: 'primary.main' }} />
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
      </motion.div>
    </Container>
  );
} 