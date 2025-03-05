const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { execSync } = require('child_process');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Build process for production
if (process.env.NODE_ENV === 'production') {
  try {
    console.log('Starting build process...');
    console.log('Current directory:', process.cwd());
    
    // Go to frontend directory
    process.chdir(path.join(__dirname, '..', 'frontend'));
    console.log('Frontend directory:', process.cwd());
    
    // Install dependencies and build
    console.log('Installing frontend dependencies...');
    execSync('npm install', { stdio: 'inherit' });
    console.log('Building frontend...');
    execSync('npm run build', { stdio: 'inherit' });
    
    // Go back to backend directory
    process.chdir(path.join(__dirname));
    console.log('Backend directory:', process.cwd());
    
    // Create public directory
    const publicPath = path.join(__dirname, 'public');
    if (!fs.existsSync(publicPath)) {
      console.log('Creating public directory...');
      fs.mkdirSync(publicPath, { recursive: true });
    }
    
    // Copy frontend build files
    console.log('Copying frontend build files...');
    const frontendDist = path.join(__dirname, '..', 'frontend', 'dist');
    const files = fs.readdirSync(frontendDist);
    files.forEach(file => {
      fs.copyFileSync(
        path.join(frontendDist, file),
        path.join(publicPath, file)
      );
    });
    
    console.log('Build completed successfully');
    console.log('Public directory contents:', fs.readdirSync(publicPath));
  } catch (error) {
    console.error('Build process failed:', error);
    process.exit(1);
  }
}

// MongoDB Connection with detailed error handling
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    console.log('MongoDB URI:', process.env.MONGODB_URI);
    
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 30000, // Increased timeout to 30 seconds
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
    
    // Retry connection after 5 seconds
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
    process.exit(1);
  }
  
  console.log('Directory contents:', require('fs').readdirSync(publicPath));
  
  // Serve static files from the public directory
  app.use(express.static(publicPath));

  // Handle React routing, return all requests to React app
  app.get('*', (req, res) => {
    const indexPath = path.join(publicPath, 'index.html');
    if (!require('fs').existsSync(indexPath)) {
      console.error('index.html not found at:', indexPath);
      return res.status(404).send('Frontend build files not found');
    }
    res.sendFile(indexPath);
  });
}

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 