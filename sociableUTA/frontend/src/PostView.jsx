import React, { useState, useEffect, useRef } from 'react';
import axiosInstance from './api/axios';
import axios from 'axios';
import './PostView.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faImages, faThumbsUp, faComments, faShareFromSquare } from '@fortawesome/free-solid-svg-icons';

export const PostView = ({ token, user, apiSource, onNavigate, linkedInToken}) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLinkedInAuthenticated, setIsLinkedInAuthenticated] = useState(!!linkedInToken);
  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef();

  const fetchInstagramPosts = async () => {
    try {
      const response = await axiosInstance.get('/api/instagram/media');
      return response.data.map(post => ({
        platform: 'instagram',
        id: post.id,
        authorName: 'Sociable UTA (Your Account)',
        authorRole: 'Instagram Account',
        authorAvatar: 'https://via.placeholder.com/48/E4405F/FFFFFF?text=IG', // Placeholder with color
        caption: post.caption || '',
        mediaType: post.media_type ? post.media_type.toLowerCase() : 'image',
        mediaUrl: post.media_url,
        timestamp: new Date(post.timestamp), // Store as Date object
        meta: new Date(post.timestamp).toLocaleString(),
        likes: 0, comments: 0, shares: 0,
      }));
    } catch (err) {
      console.error('Failed to load Instagram posts:', err);
      setError(prev => prev + ' Failed to load Instagram posts.');
      return []; // Return empty array on error
    }
  };

  // --- Helper function to fetch Facebook posts ---
  const fetchFacebookPosts = async () => {
    try {
      const response = await axiosInstance.get('/api/facebook/feed');
      return response.data.map(post => ({
        platform: 'facebook',
        id: post.id,
        authorName: 'Sociable UTA (Facebook Page)',
        authorRole: 'Facebook Page',
        authorAvatar: 'https://via.placeholder.com/48/1877F2/FFFFFF?text=FB', // Placeholder with color
        caption: post.message || '',
        mediaType: post.type === 'photo' || post.type === 'video' ? post.type : null,
        mediaUrl: post.full_picture || null,
        timestamp: new Date(post.created_time), // Store as Date object
        meta: new Date(post.created_time).toLocaleString(),
        likes: 0, comments: 0, shares: 0,
      }));
    } catch (err) {
      console.error('Failed to load Facebook posts:', err);
      setError(prev => prev + ' Failed to load Facebook posts.');
      return [];
    }
  };

  // --- Helper function to fetch LinkedIn posts ---
  const fetchLinkedInPosts = async (token) => {
    // const linkedInToken = localStorage.getItem('linkedin_access_token');
    if (!token) {
      setIsLinkedInAuthenticated(false);
      return []; // Not connected
    }
    setIsLinkedInAuthenticated(true);
    try {
      const response = await axiosInstance.get('/api/linkedin/organization-data', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      // Check if organization data and posts exist
      if (!response.data || !response.data.organization || !response.data.organization.posts || !response.data.organization.posts.elements) {
        console.warn('LinkedIn organization or posts data not found in response:', response.data);
        return [];
      }
      return response.data.organization.posts.elements.map(post => ({
        platform: 'linkedin',
        id: post.id,
        authorName: response.data.organization.name || 'Unknown Organization', // Handle missing name
        authorRole: 'LinkedIn Organization',
        authorAvatar: 'https://via.placeholder.com/48/0A66C2/FFFFFF?text=LI', // Placeholder with color
        caption: post.specificContent?.['com.linkedin.ugc.ShareContent']?.shareCommentary?.text || '',
        mediaType: null, // Basic example, could be enhanced
        mediaUrl: null,
        timestamp: new Date(post.lastModified?.time || Date.now()), // Handle potentially missing timestamp
        meta: post.lastModified?.time ? new Date(post.lastModified.time).toLocaleString() : new Date().toLocaleString(),
        likes: 0, comments: 0, shares: 0,
      }));
    } catch (err) {
      console.error('Failed to fetch LinkedIn posts:', err);
      setError('Failed to fetch LinkedIn posts. Token may have expired. Please reconnect.');
      setIsLinkedInAuthenticated(false);
      localStorage.removeItem('linkedin_access_token');
      return [];
    }
  };

  useEffect(() => {

    // --- Helper function to fetch Facebook posts ---
    const fetchFacebookPosts = async () => {
      try {
        const response = await axiosInstance.get('/api/facebook/feed');
        return response.data.map(post => ({
          platform: 'facebook',
          id: post.id,
          authorName: 'Sociable UTA (Facebook Page)',
          authorRole: 'Facebook Page',
          authorAvatar: 'https://via.placeholder.com/48/1877F2/FFFFFF?text=FB', // Placeholder with color
          caption: post.message || '',
          mediaType: post.type === 'photo' || post.type === 'video' ? post.type : null,
          mediaUrl: post.full_picture || null,
          timestamp: new Date(post.created_time), // Store as Date object
          meta: new Date(post.created_time).toLocaleString(),
          likes: 0, comments: 0, shares: 0,
        }));
      } catch (err) {
        console.error('Failed to load Facebook posts:', err);
        setError(prev => prev + ' Failed to load Facebook posts.');
        return [];
      }
    };

    const fetchPosts = async () => {
      setLoading(true);
      setError('');
      setPosts([]);
      let combinedPosts = [];

      if (apiSource === 'all') {
        // Fetch from all platforms concurrently
        const results = await Promise.all([
          fetchInstagramPosts(),
          fetchFacebookPosts(),
          fetchLinkedInPosts(linkedInToken),
          // fetchXPosts()
        ]);
        combinedPosts = results.flat(); // Combine results from all promises
      } else if (apiSource === 'instagram') {
        combinedPosts = await fetchInstagramPosts();
      } else if (apiSource === 'facebook') {
        combinedPosts = await fetchFacebookPosts();
      } else if (apiSource === 'linkedin') {
        combinedPosts = await fetchLinkedInPosts(linkedInToken);
      } else if (apiSource === 'x') {
        combinedPosts = await fetchXPosts();
      }
      combinedPosts.sort((a,b) => b.timestamp - a.timestamp);
      setPosts(combinedPosts);
      setLoading(false);
    };

    fetchPosts();
  }, [apiSource, linkedInToken]);

  const handleLinkedInConnect = () => {
    window.location.href = 'http://localhost:5000/api/linkedin/login';
  };

  const handleMediaClick = (type) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = type === 'video' ? 'video/*' : 'image/*';
      fileInputRef.current.click();
    }
  };

  const handleMediaChange = (e) => {
    setMedia(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  };

  const getPlatformConfig = (source) => {
    const configs = {
      instagram: { name: 'Instagram', color: '#E4405F', placeholder: 'Write a caption...', buttonText: 'Post' },
      facebook: { name: 'Facebook', color: '#1877F2', placeholder: 'What\'s on your mind?', buttonText: 'Post' },
      x: { name: 'X', color: '#000000', placeholder: 'What\'s happening?', buttonText: 'Post' },
      linkedin: { name: 'LinkedIn', color: '#0A66C2', placeholder: 'What do you want to talk about?', buttonText: 'Post' }
    };
    return configs[source] || configs.instagram;
  };

  const platformConfig = getPlatformConfig(apiSource);

  return (
    <div className="postview-root">
      <div className="postview-container">
        <div className="postview-main">
          {apiSource === 'linkedin' && !isLinkedInAuthenticated && !loading && (
            <div className="linkedin-auth-banner">
              <div className="linkedin-auth-content">
                <h3>Connect to LinkedIn</h3>
                <p>To see and manage your organization's posts, you need to connect your LinkedIn account.</p>
                <button className="linkedin-auth-btn" onClick={handleLinkedInConnect}>
                  Connect Now
                </button>
                </div>
            </div>
          )}

          <div className="postview-create-box">
            <div className="postview-create-header">
              {/* <img src={user?.avatarUrl || 'https://via.placeholder.com/48'} alt="avatar" className="postview-avatar" /> */}
              <div className="postview-actions postview-actions-center">
                {/* <div className="postview-action" onClick={() => handleMediaClick('video')}>
                  <FontAwesomeIcon icon={faVideo} style={{ color: '#4caf50', fontSize: 32, marginRight: 8 }} />
                  <span style={{ fontSize: 22, fontWeight: 500 }}>Video</span>
                </div> */}
                {/* <div className="postview-action" onClick={() => handleMediaClick('image')}>
                  <FontAwesomeIcon icon={faImages} style={{ color: '#2196f3', fontSize: 32, marginRight: 8 }} />
                  <span style={{ fontSize: 22, fontWeight: 500 }}>Photo</span>
                </div> */}
              </div>
            </div>
            {/* <input ref={fileInputRef} type="file" style={{ display: 'none' }} onChange={handleMediaChange} /> */}
            <form onSubmit={handleSubmit} className="postview-form">
              {/* <textarea
                placeholder={platformConfig.placeholder}
                value={caption}
                onChange={e => setCaption(e.target.value)}
                className="postview-textarea"
                required
              /> */}
              {media && (
                <div className="postview-media-preview">
                  {media.type?.startsWith('image') ? <img src={URL.createObjectURL(media)} alt="preview" /> : <video controls src={URL.createObjectURL(media)} />}
                </div>
              )}
              {error && (<div className="postview-error">{error}</div>)}
              {/* <div className="postview-form-buttons">
                <button type="submit" className="postview-post-btn" style={{ backgroundColor: platformConfig.color }} disabled={isPosting}>
                  {isPosting ? 'Posting...' : platformConfig.buttonText}
                </button>
              </div> */}
            </form>
          </div>

          <div className="postview-feed">
            {loading && <p style={{ textAlign: 'center' }}>Loading posts...</p>}
            {posts.map(post => (
              <div key={post.id} className="postview-feed-card">
                <div className="postview-feed-header">
                  <img src={post.authorAvatar} alt="avatar" className="postview-feed-avatar" />
                  <div>
                    <div className="postview-feed-author">{post.authorName}</div>
                    <div className="postview-feed-role">{post.authorRole}</div>
                    <div className="postview-feed-meta">{post.meta}</div>
                  </div>
                  <button className="postview-feed-follow">+ Follow</button>
                </div>
                <div className="postview-feed-caption">{post.caption}</div>
                <div className="postview-feed-actions">
                  <span><FontAwesomeIcon icon={faThumbsUp} /> Like</span>
                  <span><FontAwesomeIcon icon={faComments} /> Comment</span>
                  <span><FontAwesomeIcon icon={faShareFromSquare} /> Share</span>
                </div>
                <div className="postview-feed-meta2">
                  <span>{post.likes} likes</span> · <span>{post.comments} comments</span> · <span>{post.shares} shares</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}