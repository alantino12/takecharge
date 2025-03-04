import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { ArrowRight, Heart, MessageCircle, Share2, ChevronDown, Check, Loader2 } from 'lucide-react';
import logo from './assets/Take Charge Logo.png';
import worldDiabetesDayVideo from './assets/World Diabetes Day.mp4';
import AdminPage from './pages/AdminPage';

interface BlogPost {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  excerpt: string;
  likes: number;
  comments: number;
  shares: number;
  link?: string;
}

// Move the main content to a new HomePage component
const HomePage: React.FC<{ blogPosts: BlogPost[] }> = ({ blogPosts }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    day: '',
    month: '',
    year: '',
    diabetesStatus: ''
  });

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitStatus('loading');
    
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbw_V6ry1Iw8FgkUIXduiK1ey5l3Smv88b0_id1q5C-RlTO-Y5cpP84B6XCfK03HWTUkQQ/exec', {
        method: 'POST',
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors'
      });

      setSubmitStatus('success');
      
      setTimeout(() => {
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          day: '',
          month: '',
          year: '',
          diabetesStatus: ''
        });
        setSubmitStatus('idle');
      }, 2000);

    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('idle');
      alert('There was an error submitting the form. Please try again later.');
    }
  };

  return (
    <div className="font-sans">
      {/* Hero Section */}
      <section className="relative h-screen overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
          alt="Person walking on road at sunset" 
          className="absolute inset-0 w-full h-full object-cover animate-zoom"
        />
        <div className="absolute top-5 left-5 z-20">
          <Link to="/">
            <img 
              src={logo}
              alt="Take Charge Logo"
              className="h-24 w-auto object-contain drop-shadow-lg"
              style={{ 
                minWidth: '150px'
              }}
            />
          </Link>
        </div>
        <div className="relative z-20 flex flex-col items-center justify-center h-full text-white">
          <h1 className="text-6xl md:text-8xl font-montserrat font-black tracking-wider mb-8 text-center drop-shadow-2xl">
            TAKE CHARGE
          </h1>
          <button className="bg-white text-blue-600 hover:bg-blue-50 font-bold py-4 px-8 rounded-md flex items-center transition-all text-lg">
            GET STARTED <ArrowRight className="ml-2" size={24} />
          </button>
        </div>
      </section>

      {/* Program Offerings Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Take Charge: Your Wellness Starts Here</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Assessment */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative h-64">
              <div className="absolute inset-0 bg-black/20"></div>
              <img 
                src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Medical assessment" 
                className="w-full h-full object-cover"
              />
              <h3 className="absolute bottom-4 left-4 text-white text-2xl font-bold">ASSESSMENT</h3>
            </div>
          </div>

          {/* Nutrition & Dietary Counselling */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative h-64">
              <div className="absolute inset-0 bg-black/20"></div>
              <img 
                src="https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Healthy food" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-2xl font-bold">NUTRITION &</h3>
                <h3 className="text-2xl font-bold">DIETARY COUNSELLING</h3>
              </div>
            </div>
          </div>

          {/* Exercise Coaching */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative h-64">
              <div className="absolute inset-0 bg-black/20"></div>
              <img 
                src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Exercise coaching" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-2xl font-bold">EXERCISE</h3>
                <h3 className="text-2xl font-bold">COACHING</h3>
              </div>
            </div>
          </div>

          {/* Risk Factors Management */}
          <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
            <div className="relative h-64">
              <div className="absolute inset-0 bg-black/20"></div>
              <img 
                src="https://images.unsplash.com/photo-1505751172876-fa1923c5c528?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80" 
                alt="Risk management" 
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-4 left-4 text-white">
                <h3 className="text-2xl font-bold">RISK FACTORS</h3>
                <h3 className="text-2xl font-bold">MANAGEMENT</h3>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold mb-8">About Our Program:</h2>
        
        <div className="flex flex-col md:flex-row gap-8">
          <div className="md:w-1/2">
            <p className="text-gray-700 mb-4">
              At Take Charge, we believe in empowering you to live your best life with diabetes. Our program offers personalized guidance, interactive online courses, and easy-to-follow resources to help you gain control and confidence in managing your health.
            </p>
            <p className="text-gray-700 mb-4">
              Along with expert support from our dedicated medical professionals, you'll have access to an optional Continuous Glucose Monitoring (CGM) device to help you better understand your body's response to different foods.
            </p>
            <p className="text-gray-700 mb-4">
              Whether you're newly diagnosed or looking to deepen your understanding, Take Charge is your partner in achieving a healthier future.
            </p>
            <p className="text-gray-700 mb-4">
              Ready to take control? Begin your journey with us today! Simply fill out the form <span className="font-bold">BELOW</span> to start empowering your health and future with Take Charge.
            </p>
          </div>
          <div className="md:w-1/2">
            <div className="relative h-80 md:h-full rounded-lg overflow-hidden">
              <video
                className="w-full h-full object-cover"
                controls
                autoPlay
                muted
                loop
                playsInline
                poster="https://images.unsplash.com/photo-1576671414121-aa2d0967818d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
              >
                <source src={worldDiabetesDayVideo} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </section>

      {/* Call-to-Action & Registration Form */}
      <section className="py-16 px-4 bg-gradient-to-r from-purple-100 to-blue-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row">
          <div className="md:w-1/2 mb-8 md:mb-0 flex flex-col justify-center">
            <div className="text-center md:text-left space-y-6">
              <h2 className="text-4xl md:text-5xl font-montserrat font-black text-blue-900 mb-8">
                #Take Charge
              </h2>
              <div className="space-y-4">
                <p className="text-3xl md:text-4xl font-montserrat font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Level Up Your Living
                </p>
                <p className="text-3xl md:text-4xl font-montserrat font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  with Diabetes
                </p>
              </div>
              <p className="text-2xl md:text-3xl font-montserrat font-bold text-blue-800 mt-8">
                Own Your Diabetes,<br />Own Your Life.
              </p>
            </div>
          </div>
          
          <div className="md:w-1/2">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Reach out to us for further information:</h3>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">First name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your first name"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Last name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter your last name"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone *</label>
                  <div className="flex">
                    <div className="w-20 flex items-center px-3 py-2 border border-r-0 border-gray-300 bg-gray-50 rounded-l-md">
                      <span className="text-gray-500">+60</span>
                    </div>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-r-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Birthday *</label>
                  <div className="grid grid-cols-3 gap-2">
                    <input
                      type="text"
                      name="day"
                      placeholder="Day"
                      value={formData.day}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                    <div className="relative">
                      <select
                        name="month"
                        value={formData.month}
                        onChange={handleSelectChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                        required
                      >
                        <option value="">Month</option>
                        <option value="01">January</option>
                        <option value="02">February</option>
                        <option value="03">March</option>
                        <option value="04">April</option>
                        <option value="05">May</option>
                        <option value="06">June</option>
                        <option value="07">July</option>
                        <option value="08">August</option>
                        <option value="09">September</option>
                        <option value="10">October</option>
                        <option value="11">November</option>
                        <option value="12">December</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                    </div>
                    <input
                      type="text"
                      name="year"
                      placeholder="Year"
                      value={formData.year}
                      onChange={handleInputChange}
                      className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Are you a diabetic? *</label>
                  <div className="space-y-2">
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="yes"
                        name="diabetesStatus"
                        value="Yes, I am on medication"
                        checked={formData.diabetesStatus === "Yes, I am on medication"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="yes" className="ml-2 text-sm text-gray-700">Yes, I am on medication</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="pre"
                        name="diabetesStatus"
                        value="Pre-diabetic"
                        checked={formData.diabetesStatus === "Pre-diabetic"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="pre" className="ml-2 text-sm text-gray-700">Pre-diabetic</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="notSure"
                        name="diabetesStatus"
                        value="I am not sure"
                        checked={formData.diabetesStatus === "I am not sure"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="notSure" className="ml-2 text-sm text-gray-700">I am not sure</label>
                    </div>
                    <div className="flex items-center">
                      <input
                        type="radio"
                        id="no"
                        name="diabetesStatus"
                        value="I am not diabetic"
                        checked={formData.diabetesStatus === "I am not diabetic"}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
                      />
                      <label htmlFor="no" className="ml-2 text-sm text-gray-700">I am not diabetic</label>
                    </div>
                  </div>
                </div>
                
                <button
                  type="submit"
                  disabled={submitStatus !== 'idle'}
                  className={`w-full font-bold py-3 px-4 rounded-md transition-all flex items-center justify-center ${
                    submitStatus === 'success'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-purple-600 hover:bg-purple-700'
                  } text-white`}
                >
                  {submitStatus === 'loading' && (
                    <Loader2 className="animate-spin mr-2" size={20} />
                  )}
                  {submitStatus === 'success' && (
                    <Check className="mr-2" size={20} />
                  )}
                  {submitStatus === 'loading' ? 'Submitting...' :
                   submitStatus === 'success' ? 'Submitted!' : 'Submit'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 px-4 max-w-7xl mx-auto">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Tools and Tips for a Healthier You</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <div 
              key={post.id} 
              className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer"
              onClick={() => setSelectedPost(post)}
            >
              <img 
                src={post.imageUrl}
                alt={post.title} 
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4">{post.excerpt}</p>
                <div className="flex items-center text-gray-500 text-sm">
                  <div className="flex items-center mr-4">
                    <Heart size={16} className="mr-1" />
                    <span>{post.likes}</span>
                  </div>
                  <div className="flex items-center mr-4">
                    <MessageCircle size={16} className="mr-1" />
                    <span>{post.comments}</span>
                  </div>
                  <div className="flex items-center">
                    <Share2 size={16} className="mr-1" />
                    <span>{post.shares}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Article Modal */}
      {selectedPost && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-3xl font-bold">{selectedPost.title}</h2>
                <button
                  onClick={() => setSelectedPost(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <img
                src={selectedPost.imageUrl}
                alt={selectedPost.title}
                className="w-full h-64 object-cover rounded-lg mb-6"
              />
              <div className="prose max-w-none">
                <p className="text-gray-600 mb-4">{selectedPost.excerpt}</p>
                <div className="whitespace-pre-wrap">{selectedPost.content}</div>
              </div>
              {selectedPost.link && (
                <div className="mt-6">
                  <a
                    href={selectedPost.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline inline-flex items-center"
                  >
                    Read more <ArrowRight className="ml-2" size={16} />
                  </a>
                </div>
              )}
              <div className="flex items-center text-gray-500 mt-6 pt-4 border-t">
                <div className="flex items-center mr-6">
                  <Heart size={20} className="mr-2" />
                  <span>{selectedPost.likes}</span>
                </div>
                <div className="flex items-center mr-6">
                  <MessageCircle size={20} className="mr-2" />
                  <span>{selectedPost.comments}</span>
                </div>
                <div className="flex items-center">
                  <Share2 size={20} className="mr-2" />
                  <span>{selectedPost.shares}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Company</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Refund Policy</a></li>
                <li><Link to="/admin" className="hover:text-blue-400 transition-colors">Admin Login</Link></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Product</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Assessment</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Nutrition & Dietary Counselling</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Exercise Coaching</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Risk Factors Management</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Blog</h3>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-blue-400 transition-colors">Latest Articles</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Health Tips</a></li>
                <li><a href="#" className="hover:text-blue-400 transition-colors">Success Stories</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-bold mb-4">Subscribe to our Newsletter</h3>
              <div className="flex">
                <input 
                  type="email" 
                  placeholder="Your email address" 
                  className="px-4 py-2 w-full rounded-l-md focus:outline-none text-gray-900"
                />
                <button className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-r-md transition-colors">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2024 Made by MEDIT</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

// Main App component with routing
function App() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch blog posts from the API
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/posts');
        if (!response.ok) {
          throw new Error('Failed to fetch blog posts');
        }
        const data = await response.json();
        setBlogPosts(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage blogPosts={blogPosts} />} />
        <Route path="/admin" element={<AdminPage blogPosts={blogPosts} setBlogPosts={setBlogPosts} />} />
      </Routes>
    </Router>
  );
}

export default App;