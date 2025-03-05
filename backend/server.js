const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection with detailed error handling
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 30000,
      retryWrites: true,
      retryReads: true,
      maxPoolSize: 10
    });
    
    console.log('Successfully connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code
    });
    
    setTimeout(() => {
      console.log('Retrying MongoDB connection...');
      connectDB();
    }, 5000);
  }
};

// Connect to MongoDB
connectDB();

// Add mongoose connection event listeners
mongoose.connection.on('error', err => {
  console.error('MongoDB connection error:', err);
});

mongoose.connection.on('disconnected', () => {
  console.log('MongoDB disconnected');
});

mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

// Blog Post Schema
const blogPostSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  imageUrl: { type: String, required: true },
  excerpt: { type: String, required: true },
  likes: { type: Number, default: 0 },
  comments: { type: Number, default: 0 },
  shares: { type: Number, default: 0 },
  link: { type: String },
  createdAt: { type: Date, default: Date.now }
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// API Routes
app.get('/api/posts', async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Admin authentication middleware
const authenticateAdmin = (req, res, next) => {
  const { password } = req.headers;
  if (password === process.env.ADMIN_PASSWORD) {
    next();
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
};

// Protected admin routes
app.post('/api/posts', authenticateAdmin, async (req, res) => {
  try {
    const post = new BlogPost(req.body);
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/posts/:id', authenticateAdmin, async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    res.json(post);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/posts/:id', authenticateAdmin, async (req, res) => {
  try {
    await BlogPost.findByIdAndDelete(req.params.id);
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Serve static files in production
if (process.env.NODE_ENV === 'production') {
  const publicPath = path.join(__dirname, 'public');
  console.log('Serving static files from:', publicPath);
  
  // Check if public directory exists
  if (!require('fs').existsSync(publicPath)) {
    console.error('Public directory does not exist:', publicPath);
    console.error('Please ensure the build process completed successfully');
    console.error('Current directory:', process.cwd());
    console.error('Directory contents:', require('fs').readdirSync(__dirname));
    process.exit(1);
  }
  
  const files = require('fs').readdirSync(publicPath);
  console.log('Public directory contents:', files);
  
  if (files.length === 0) {
    console.error('Public directory is empty');
    process.exit(1);
  }
  
  // Serve static files from the public directory
  app.use(express.static(publicPath));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    const indexPath = path.join(publicPath, 'index.html');
    if (!require('fs').existsSync(indexPath)) {
      console.error('index.html not found at:', indexPath);
      console.error('Available files:', require('fs').readdirSync(publicPath));
      return res.status(404).send('Frontend build files not found');
    }
    res.sendFile(indexPath);
  });
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 