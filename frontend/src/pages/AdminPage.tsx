import React, { useState } from 'react';
import { Lock, Plus, Edit2, Trash2, Loader2 } from 'lucide-react';

interface BlogPost {
  _id: string;
  title: string;
  content: string;
  imageUrl: string;
  excerpt: string;
  likes: number;
  comments: number;
  shares: number;
  link?: string;
  createdAt?: Date;
}

interface AdminPageProps {
  blogPosts: BlogPost[];
  setBlogPosts: React.Dispatch<React.SetStateAction<BlogPost[]>>;
}

const AdminPage: React.FC<AdminPageProps> = ({ blogPosts, setBlogPosts }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [newPost, setNewPost] = useState<Partial<BlogPost>>({
    title: '',
    content: '',
    imageUrl: '',
    excerpt: '',
    link: ''
  });
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'admin123') {
      setIsAuthenticated(true);
    } else {
      alert('Invalid password');
    }
  };

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'password': 'admin123'
        },
        body: JSON.stringify(newPost)
      });

      if (!response.ok) {
        throw new Error('Failed to create post');
      }

      const post = await response.json();
      setBlogPosts([...blogPosts, post]);
      setNewPost({ title: '', content: '', imageUrl: '', excerpt: '', link: '' });
      alert('Post created successfully! You can view it on the main page.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create post');
      alert('Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditPost = (post: BlogPost) => {
    setEditingPost(post);
    setNewPost({
      title: post.title,
      content: post.content,
      imageUrl: post.imageUrl,
      excerpt: post.excerpt,
      link: post.link
    });
  };

  const handleUpdatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPost) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/posts/${editingPost._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'password': 'admin123'
        },
        body: JSON.stringify(newPost)
      });

      if (!response.ok) {
        throw new Error('Failed to update post');
      }

      const updatedPost = await response.json();
      setBlogPosts(blogPosts.map(post => 
        post._id === editingPost._id ? updatedPost : post
      ));
      setEditingPost(null);
      setNewPost({ title: '', content: '', imageUrl: '', excerpt: '', link: '' });
      alert('Post updated successfully!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update post');
      alert('Failed to update post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/posts/${id}`, {
        method: 'DELETE',
        headers: {
          'password': 'admin123'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to delete post');
      }

      setBlogPosts(blogPosts.filter(post => post._id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete post');
      alert('Failed to delete post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <div className="flex items-center justify-center mb-6">
            <Lock className="text-blue-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">Admin Login</h2>
          <form onSubmit={handleLogin}>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter admin password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            {editingPost ? 'Edit Blog Post' : 'Create New Blog Post'}
          </h2>
          <form onSubmit={editingPost ? handleUpdatePost : handleCreatePost}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                type="text"
                value={newPost.title}
                onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Image URL
              </label>
              <input
                type="url"
                value={newPost.imageUrl}
                onChange={(e) => setNewPost({ ...newPost, imageUrl: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                External Link (optional)
              </label>
              <input
                type="url"
                value={newPost.link}
                onChange={(e) => setNewPost({ ...newPost, link: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="https://example.com/article"
              />
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Excerpt
              </label>
              <textarea
                value={newPost.excerpt}
                onChange={(e) => setNewPost({ ...newPost, excerpt: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={2}
                required
              />
            </div>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                value={newPost.content}
                onChange={(e) => setNewPost({ ...newPost, content: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={6}
                required
              />
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors flex items-center ${
                  loading ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                {loading && <Loader2 className="animate-spin mr-2" size={20} />}
                {editingPost ? (
                  <>
                    <Edit2 className="mr-2" size={20} />
                    Update Post
                  </>
                ) : (
                  <>
                    <Plus className="mr-2" size={20} />
                    Create Post
                  </>
                )}
              </button>
              {editingPost && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingPost(null);
                    setNewPost({ title: '', content: '', imageUrl: '', excerpt: '', link: '' });
                  }}
                  className="bg-gray-200 text-gray-700 py-2 px-6 rounded-md hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-bold mb-6">Existing Blog Posts</h2>
          <div className="space-y-6">
            {blogPosts.map((post) => (
              <div key={post._id} className="border-b border-gray-200 pb-6 last:border-0">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{post.title}</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditPost(post)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                    >
                      <Edit2 size={20} />
                    </button>
                    <button
                      onClick={() => handleDeletePost(post._id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-full transition-colors"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>
                <img
                  src={post.imageUrl}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-md mb-2"
                />
                <p className="text-gray-600 mb-2">{post.excerpt}</p>
                {post.link && (
                  <a
                    href={post.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline mb-2 block"
                  >
                    View External Link
                  </a>
                )}
                <div className="flex space-x-4 text-sm text-gray-500">
                  <span>Likes: {post.likes}</span>
                  <span>Comments: {post.comments}</span>
                  <span>Shares: {post.shares}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage; 