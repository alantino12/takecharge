const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Debug information
console.log('Server starting...');
console.log('Environment:', process.env.NODE_ENV);
console.log('MongoDB URI exists:', !!process.env.MONGODB_URI);

// CORS configuration
app.use(cors({
  origin: true, // Allow all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'password'],
  exposedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  maxAge: 86400 // 24 hours
}));

// Handle preflight requests
app.options('*', cors());

app.use(express.json());

// MongoDB Connection Cache
let cachedDb = null;

// MongoDB Connection with detailed error handling
const connectDB = async () => {
  if (cachedDb && mongoose.connection.readyState === 1) {
    console.log('Using cached database connection');
    return true;
  }

  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is not defined');
    return false;
  }

  try {
    console.log('Attempting to connect to MongoDB...');
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      bufferCommands: false,
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4
    };

    await mongoose.connect(process.env.MONGODB_URI, opts);
    cachedDb = mongoose.connection;
    console.log('Successfully connected to MongoDB');
    return true;
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    return false;
  }
};

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

// Health check endpoint that doesn't require DB connection
app.get('/api/health', async (req, res) => {
  const dbConnected = await connectDB();
  res.json({ 
    status: 'ok',
    environment: process.env.NODE_ENV,
    mongoDBUri: !!process.env.MONGODB_URI,
    mongoDBConnected: dbConnected
  });
});

// Middleware to ensure DB connection
const ensureDBConnection = async (req, res, next) => {
  try {
    const connected = await connectDB();
    if (!connected) {
      return res.status(500).json({ 
        error: 'Database connection failed',
        details: 'Could not establish connection to MongoDB'
      });
    }
    next();
  } catch (error) {
    console.error('DB Connection middleware error:', error);
    res.status(500).json({ 
      error: 'Database connection failed',
      details: error.message
    });
  }
};

// API Routes - all routes that need DB now use the middleware
app.get('/api/posts', ensureDBConnection, async (req, res) => {
  try {
    const posts = await BlogPost.find().sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    console.error('Error fetching posts:', error);
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
app.post('/api/posts', [ensureDBConnection, authenticateAdmin], async (req, res) => {
  try {
    const post = new BlogPost(req.body);
    const newPost = await post.save();
    res.status(201).json(newPost);
  } catch (error) {
    console.error('Error creating post:', error);
    res.status(400).json({ message: error.message });
  }
});

app.put('/api/posts/:id', [ensureDBConnection, authenticateAdmin], async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Error updating post:', error);
    res.status(400).json({ message: error.message });
  }
});

app.delete('/api/posts/:id', [ensureDBConnection, authenticateAdmin], async (req, res) => {
  try {
    const post = await BlogPost.findByIdAndDelete(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Error deleting post:', error);
    res.status(500).json({ message: error.message });
  }
});

// Root route for basic info
app.get('/', async (req, res) => {
  const dbConnected = await connectDB();
  res.json({
    message: 'TakeCharge API is running',
    environment: process.env.NODE_ENV,
    mongoDBConnected: dbConnected
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// For local development
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5001;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
}

// For Vercel
module.exports = app; 