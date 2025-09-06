import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './PostView.css';
// import { fetchPlatformPosts, postToLinkedIn, initiateLinkedInAuth } from './ApiDataService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faVideo, faImages, faThumbsUp, faComments, faShareFromSquare } from '@fortawesome/free-solid-svg-icons';

export const PostView = ({ token, user, apiSource = 'instagram', onNavigate }) => {
  const [posts, setPosts] = useState([]);
  const [media, setMedia] = useState(null);
  const [caption, setCaption] = useState('');
  const [error, setError] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [linkedInToken, setLinkedInToken] = useState(localStorage.getItem('linkedin_token') || '');
  const [isLinkedInAuthenticated, setIsLinkedInAuthenticated] = useState(!!localStorage.getItem('linkedin_token'));

  const fileInputRef = useRef();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      setPosts([]); // clearing previous posts

      if (apiSource === 'instagram') {
        try {
          // calling new backend route for IG media
          const response = await axios.get('http://localhost:5000/api/instagram/media');

          // transform API data to match post structure
          const formattedPosts = response.data.map(post => ({
            id: post.id,
            authorName: 'wendoughlee', // Placeholder name
            authorRole: 'Instagram Account',
            authorAvatar: 'https://via.placeholder.com/48', // Placeholder avatar
            caption: post.caption || '',
            mediaType: post.media_type.toLowerCase(), // 'IMAGE' -> 'image'
            mediaUrl: post.media_url,
            meta: new Date(post.timestamp).toLocaleString(),
            // NOTE: Likes, comments, and shares require a separate insights call per post
            likes: 0,
            comments: 0,
            shares: 0,
          }));

          setPosts(formattedPosts);
        } catch (err) {
          console.error('Failed to fetch ${apiSource} posts:', err);
          setError('Failed to fetch Instagram posts. Please try again.');
          setPosts([]);
        }
      }
      // try {
      //   const mockPosts = await fetchPlatformPosts(apiSource);
      //   setPosts(mockPosts);
      // } catch (err) {
      //   console.error(`Failed to fetch ${apiSource} posts:`, err);
      //   setPosts([]);
      // }
      setLoading(false);
    };

    fetchPosts();

    // // Check for LinkedIn OAuth callback
    // const urlParams = new URLSearchParams(window.location.search);
    // const code = urlParams.get('code');
    // const state = urlParams.get('state');

    // if (code && state === 'linkedin_auth') {
    //   handleLinkedInCallback(code);
    // }
  }, [apiSource]); // before: [token, apiSource])

  // const handleLinkedInCallback = async (code) => {
  //   try {
  //     // Exchange the code for an access token via your backend
  //     const apiBaseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5500';
  //     const response = await fetch(`${apiBaseUrl}/api/linkedin/exchange-token`, {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ code }),
  //     });

  //     if (response.ok) {
  //       const { access_token } = await response.json();
  //       setLinkedInToken(access_token);
  //       setIsLinkedInAuthenticated(true);
  //       localStorage.setItem('linkedin_token', access_token);

  //       // Clean up URL
  //       window.history.replaceState({}, document.title, window.location.pathname);

  //     } else {
  //       const errorData = await response.json();
  //       throw new Error(errorData.error || 'Authentication failed');
  //     }
  //   } catch (error) {
  //     console.error('Error exchanging LinkedIn code:', error);
  //     setError('Failed to authenticate with LinkedIn. Please try again.');
  //   }
  // };

  // const handleLinkedInAuth = () => {
  //   initiateLinkedInAuth();
  // };

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

    // posting to Ig via backend. TODO later
    // if (!caption.trim() && !media) {
    //   setError('Please add some content or media to your post');
    //   return;
    // }

    // setIsPosting(true);
    // setError('');

    // try {
    //   const formData = new FormData();
    //   formData.append('caption', caption);
    //   if (media) formData.append('media', media);

    //   // Post to your local backend
    //   await axios.post('http://localhost:5500/api/posts', formData, {
    //     headers: {
    //       Authorization: `Bearer ${token}`,
    //       'Content-Type': 'multipart/form-data'
    //     }
    //   });

    //   // If LinkedIn is selected and authenticated, also post to LinkedIn
    //   if (apiSource === 'linkedin' && isLinkedInAuthenticated && linkedInToken) {
    //     try {
    //       await postToLinkedIn(linkedInToken, {
    //         text: caption,
    //         media: media
    //       });
    //     } catch (linkedInError) {
    //       console.error('Failed to post to LinkedIn:', linkedInError);
    //       setError('Posted locally but failed to post to LinkedIn. Please try again.');
    //     }
    //   }

    //   setMedia(null);
    //   setCaption('');

    //   const response = await axios.get('http://localhost:5500/api/posts', {
    //     headers: { Authorization: `Bearer ${token}` }
    //   });
    //   setPosts(response.data);

    // } catch (err) {
    //   console.error('Failed to create post:', err);
    //   setError('Failed to create post. Please try again.');
    // } finally {
    //   setIsPosting(false);
    // }
  };

  const getPlatformConfig = (source) => {
    const configs = {
      instagram: {
        name: 'Instagram',
        color: '#E4405F',
        placeholder: 'What\'s happening in your world?',
        buttonText: 'Share'
      },
      facebook: {
        name: 'Facebook',
        color: '#1877F2',
        placeholder: 'What\'s on your mind?',
        buttonText: 'Post'
      },
      x: {
        name: 'X',
        color: '#000000',
        placeholder: 'What\'s happening?',
        buttonText: 'Post'
      },
      linkedin: {
        name: 'LinkedIn',
        color: '#0A66C2',
        placeholder: 'What do you want to talk about?',
        buttonText: 'Post'
      }
    };
    return configs[source] || configs.instagram;
  };

  const platformConfig = getPlatformConfig(apiSource);

  return (
    <div className="postview-root">
      <div className="postview-container">
        <div className="postview-main">
          <div className="postview-create-box">
            <div className="postview-create-header">
              <img
                src={user?.avatarUrl || 'https://via.placeholder.com/48'}
                alt="avatar"
                className="postview-avatar"
              />

              <div className="postview-actions postview-actions-center">
                <div
                  className="postview-action"
                  onClick={() => handleMediaClick('video')}
                >
                  <FontAwesomeIcon icon={faVideo} style={{ color: '#4caf50', fontSize: 32, marginRight: 8 }} />
                  <span style={{ fontSize: 22, fontWeight: 500 }}>Video</span>
                </div>

                <div
                  className="postview-action"
                  onClick={() => handleMediaClick('image')}
                >
                  <FontAwesomeIcon icon={faImages} style={{ color: '#2196f3', fontSize: 32, marginRight: 8 }} />
                  <span style={{ fontSize: 22, fontWeight: 500 }}>Photo</span>
                </div>
              </div>
            </div>

            <input
              ref={fileInputRef}
              type="file"
              style={{ display: 'none' }}
              onChange={handleMediaChange}
            />

            <form onSubmit={handleSubmit} className="postview-form">
              <textarea
                placeholder={platformConfig.placeholder}
                value={caption}
                onChange={e => setCaption(e.target.value)}
                className="postview-textarea"
                required
              />

              {media && (
                <div className="postview-media-preview">
                  {media.type && media.type.startsWith('image') ? (
                    <img
                      src={URL.createObjectURL(media)}
                      alt="preview"
                    />
                  ) : media.type && media.type.startsWith('video') ? (
                    <video controls src={URL.createObjectURL(media)} />
                  ) : null}
                </div>
              )}

              {error && (
                <div className="postview-error">
                  {error}
                </div>
              )}

              <div className="postview-form-buttons">
                <button
                  type="submit"
                  className="postview-post-btn"
                  style={{ backgroundColor: platformConfig.color }}
                  disabled={isPosting}
                >
                  {isPosting ? 'Posting...' : platformConfig.buttonText}
                </button>
              </div>
            </form>
          </div>

          <div className="postview-feed">
            {posts.map(post => (
              <div key={post.id} className="postview-feed-card">
                <div className="postview-feed-header">
                  <img
                    src={post.authorAvatar || 'https://via.placeholder.com/48'}
                    alt="avatar"
                    className="postview-feed-avatar"
                  />

                  <div>
                    <div className="postview-feed-author">{post.authorName}</div>
                    <div className="postview-feed-role">{post.authorRole}</div>
                    <div className="postview-feed-meta">{post.meta}</div>
                  </div>

                  <button className="postview-feed-follow">+ Follow</button>
                </div>

                <div className="postview-feed-caption">
                  {post.caption}
                </div>

                <div className="postview-feed-content">
                  {post.title && (
                    <div className="postview-feed-title">{post.title}</div>
                  )}

                  {post.mediaType === 'image' && (
                    <img src={post.mediaUrl} alt={post.title || 'media'} className="postview-feed-media" />
                  )}

                  {post.mediaType === 'video' && (
                    <video controls src={post.mediaUrl} className="postview-feed-media" />
                  )}
                </div>

                <div className="postview-feed-actions">
                  <span><FontAwesomeIcon icon={faThumbsUp} /> Like</span>
                  <span><FontAwesomeIcon icon={faComments} /> Comment</span>
                  <span><FontAwesomeIcon icon={faShareFromSquare} /> Share</span>
                </div>

                <div className="postview-feed-meta2">
                  <span>{post.likes ?? 0} likes</span>
                  {' · '}
                  <span>{post.comments ?? 0} comments</span>
                  {' · '}
                  <span>{post.shares ?? 0} shares</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}