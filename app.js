const { useState, useEffect } = React;
const { motion, AnimatePresence } = window.Motion;

function App() {
    const [prompt, setPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedImages, setGeneratedImages] = useState([]);
    const [history, setHistory] = useState([]);
    const [suggestions, setSuggestions] = useState([]);
    const [showHistory, setShowHistory] = useState(false);

    useEffect(() => {
        // Load history and suggestions on mount
        loadHistory();
        loadSuggestions();
    }, []);

    const loadHistory = async () => {
        try {
            const response = await axios.get('http://localhost:8000/history');
            setHistory(response.data);
        } catch (error) {
            console.error('Error loading history:', error);
        }
    };

    const loadSuggestions = async () => {
        try {
            const response = await axios.get('http://localhost:8000/suggestions');
            setSuggestions(response.data);
        } catch (error) {
            console.error('Error loading suggestions:', error);
        }
    };

    const generateImage = async () => {
        if (!prompt) return;
        
        setIsGenerating(true);
        try {
            const response = await axios.post('http://localhost:8000/generate', {
                prompt,
                num_images: 1,
                guidance_scale: 7.5,
                num_inference_steps: 50
            });
            
            setGeneratedImages(response.data.images);
            await loadHistory(); // Refresh history
        } catch (error) {
            console.error('Error generating image:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const useSuggestion = (suggestion) => {
        setPrompt(suggestion);
    };

    return (
        <div className="min-h-screen gradient-bg p-8">
            <div className="max-w-6xl mx-auto">
                <motion.h1 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-4xl font-bold text-center mb-8 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent"
                >
                    DDPO Image Generator
                </motion.h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Prompt Input */}
                        <div className="card rounded-xl p-6">
                            <div className="flex gap-4">
                                <input
                                    type="text"
                                    value={prompt}
                                    onChange={(e) => setPrompt(e.target.value)}
                                    placeholder="Enter your prompt..."
                                    className="flex-1 bg-slate-800 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <button
                                    onClick={generateImage}
                                    disabled={isGenerating || !prompt}
                                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    {isGenerating ? 'Generating...' : 'Generate'}
                                </button>
                            </div>
                        </div>

                        {/* Generated Images */}
                        <AnimatePresence>
                            {generatedImages.length > 0 && (
                                <motion.div
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    className="card rounded-xl p-6"
                                >
                                    <h2 className="text-xl font-semibold mb-4">Generated Image</h2>
                                    <div className="grid grid-cols-1 gap-4">
                                        {generatedImages.map((image, index) => (
                                            <motion.img
                                                key={index}
                                                src={`data:image/png;base64,${image}`}
                                                alt={`Generated ${index + 1}`}
                                                className="w-full rounded-lg shadow-lg"
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: index * 0.1 }}
                                            />
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-8">
                        {/* Suggestions */}
                        <div className="card rounded-xl p-6">
                            <h2 className="text-xl font-semibold mb-4">Prompt Suggestions</h2>
                            <div className="space-y-2">
                                {suggestions.map((suggestion, index) => (
                                    <motion.button
                                        key={index}
                                        onClick={() => useSuggestion(suggestion)}
                                        className="w-full text-left p-2 rounded-lg hover:bg-slate-700 transition-colors"
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        {suggestion}
                                    </motion.button>
                                ))}
                            </div>
                        </div>

                        {/* History Toggle */}
                        <button
                            onClick={() => setShowHistory(!showHistory)}
                            className="w-full bg-slate-700 hover:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors"
                        >
                            {showHistory ? 'Hide History' : 'Show History'}
                        </button>

                        {/* History */}
                        <AnimatePresence>
                            {showHistory && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="card rounded-xl p-6"
                                >
                                    <h2 className="text-xl font-semibold mb-4">Generation History</h2>
                                    <div className="space-y-4">
                                        {history.slice().reverse().map((item, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: index * 0.1 }}
                                                className="border border-slate-700 rounded-lg p-4"
                                            >
                                                <p className="text-sm text-slate-400 mb-2">
                                                    {new Date(item.timestamp).toLocaleString()}
                                                </p>
                                                <p className="mb-2">{item.prompt}</p>
                                                <img
                                                    src={`data:image/png;base64,${item.images[0]}`}
                                                    alt={item.prompt}
                                                    className="w-full rounded-lg"
                                                />
                                            </motion.div>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </div>
    );
}

ReactDOM.render(<App />, document.getElementById('root')); 