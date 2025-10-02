import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faChevronDown, 
  faImage, 
  faVideo, 
  faTimes, 
  faInfoCircle,
  faGlobe,
  faClock
} from '@fortawesome/free-solid-svg-icons';
import './CreatePost.css';
import { addScheduledPosts } from './ScheduledPostsStore';

const CreatePost = ({ token, user, apiSource, onNavigate }) => {
  const [showPlatforms, setShowPlatforms] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState(['Facebook', 'Instagram', 'LinkedIn']);
  const [postText, setPostText] = useState('');
  const [selectedMedia, setSelectedMedia] = useState(null);
  const [selectedMediaDataUrl, setSelectedMediaDataUrl] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(() => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  });
  const [scheduleTime, setScheduleTime] = useState(() => {
    const now = new Date();
    return now.toTimeString().slice(0, 5);
  });
  const [showAdBanner, setShowAdBanner] = useState(true);
  const [showStoryNotification, setShowStoryNotification] = useState(true);
  const [shareToStory, setShareToStory] = useState(false);
    const [showCollaboratorModal, setShowCollaboratorModal] = useState(false);
    const [selectedCollaborators, setSelectedCollaborators] = useState([]);
    const allUsers = [
    { id: 1, name: 'Alice Johnson', avatar: 'https://via.placeholder.com/40' },
    { id: 2, name: 'Bob Smith', avatar: 'https://via.placeholder.com/40' },
    { id: 3, name: 'Charlie Brown', avatar: 'https://via.placeholder.com/40' },
    { id: 4, name: 'Diana Prince', avatar: 'https://via.placeholder.com/40' },
    { id: 5, name: 'Ethan Hunt', avatar: 'https://via.placeholder.com/40' }
  ];
  const [activeTab, setActiveTab] = useState('Facebook');
  const [customizeEnabled, setCustomizeEnabled] = useState(true);
  const [platformTexts, setPlatformTexts] = useState({
    Facebook: '',
    Instagram: '',
    LinkedIn: '',
    X: ''
  });
  const [previewPlatform, setPreviewPlatform] = useState('Facebook');
  const [showPreviewDropdown, setShowPreviewDropdown] = useState(false);
  
  const fileInputRef = useRef(null);
  const videoInputRef = useRef(null);
  const platformDropdownRef = useRef(null);
  const previewDropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (previewDropdownRef.current && !previewDropdownRef.current.contains(event.target)) {
        setShowPreviewDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    if (selectedPlatforms.length > 0 && !selectedPlatforms.includes(activeTab)) {
      setActiveTab(selectedPlatforms[0]);
    }
  }, [selectedPlatforms, activeTab]);

  const handlePlatformToggle = (platform) => {
    setSelectedPlatforms(prev => {
      const newPlatforms = prev.includes(platform) 
        ? prev.filter(p => p !== platform)
        : [...prev, platform];
      
      if (newPlatforms.length > 0 && !newPlatforms.includes(activeTab)) {
        setActiveTab(newPlatforms[0]);
      }
      
      return newPlatforms;
    });
  };

  const getCurrentText = () => {
    if (customizeEnabled) {
      return platformTexts[activeTab] || '';
    }
    return postText;
  };

  const handleTextChange = (value) => {
    if (customizeEnabled) {
      setPlatformTexts(prev => ({
        ...prev,
        [activeTab]: value
      }));
    } else {
      setPostText(value);
    }
  };

  const getDisplayText = () => {
    if (customizeEnabled) {
      return platformTexts[getPreviewPlatform()] || '';
    }
    return postText;
  };

  const getPreviewPlatform = () => {
    return previewPlatform && selectedPlatforms.includes(previewPlatform) 
      ? previewPlatform 
      : selectedPlatforms[0] || 'Facebook';
  };

  const getPlatformName = (platform) => {
    switch (platform) {
      case 'Facebook': return 'Computer Science and Engineering';
      case 'Instagram': return 'cse_uta';
      case 'LinkedIn': return 'Computer Science and Engineering';
      case 'X': return '@cse_uta';
      default: return 'Computer Science and Engineering';
    }
  };

  const getPlatformPreviewStyle = (platform) => {
    const baseStyle = {
      border: '1px solid #e4e6ea',
      borderRadius: '12px',
      overflow: 'hidden',
      backgroundColor: 'white',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
      width: '100%',
      minHeight: '300px'
    };

    switch (platform) {
      case 'Instagram':
        return { ...baseStyle, border: '1px solid #e4e6ea' };
      case 'X':
        return { ...baseStyle, border: '1px solid #e4e6ea' };
      case 'LinkedIn':
        return { ...baseStyle, border: '1px solid #e4e6ea' };
      default:
        return baseStyle;
    }
  };

  const getPlatformHeaderStyle = (platform) => {
    const baseStyle = {
      padding: '16px 20px',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      minHeight: '88px',
      backgroundColor: 'white'
    };

    return baseStyle;
  };

  const handleMediaUpload = (event, type) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setSelectedMedia(url);
      setMediaType(type);
      const reader = new FileReader();
      reader.onload = () => setSelectedMediaDataUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const removeMedia = () => {
    setSelectedMedia(null);
    setSelectedMediaDataUrl(null);
    setMediaType(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (videoInputRef.current) videoInputRef.current.value = '';
  };

  const getPlatformIcon = (platform) => {
    const iconStyle = {
      width: '20px',
      height: '20px',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    };

    switch (platform) {
      case 'Facebook':
        return (
          <img 
            src="/icons/facebook.svg" 
            alt="Facebook" 
            style={iconStyle}
            className="platform-icon facebook"
          />
        );
      case 'Instagram':
        return (
          <img 
            src="/icons/instagram.svg" 
            alt="Instagram" 
            style={iconStyle}
            className="platform-icon instagram"
          />
        );
      case 'LinkedIn':
        return (
          <img 
            src="/icons/linkedin.svg" 
            alt="LinkedIn" 
            style={iconStyle}
            className="platform-icon linkedin"
          />
        );
      case 'X':
      case 'Twitter':
        return (
          <img 
            src="/icons/x.svg" 
            alt="X (Twitter)" 
            style={iconStyle}
            className="platform-icon x"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="create-post-container">
      <div className="main-content">
        <div className="left-panel">
          <div className="form-content">
            <div className="form-section">
              <label className="section-label">Post to</label>
              
              <div 
                ref={platformDropdownRef}
                className="platform-dropdown-header"
                onClick={() => setShowPlatforms(!showPlatforms)}
              >
                <div className="platform-avatar">CS</div>
                <span className="platform-text">
                  Computer Science and Engineering, UT Arlington and cse_uta
                </span>
                <FontAwesomeIcon 
                  icon={faChevronDown} 
                  className={`dropdown-chevron ${showPlatforms ? 'rotated' : ''}`}
                />
              </div>

              {showPlatforms && (
                <div className="platform-dropdown-content">
                  <div className="platform-options-list" onClick={(e) => e.stopPropagation()}>
                    {['Facebook', 'Instagram', 'LinkedIn', 'X'].map((platform) => (
                      <div 
                        key={platform}
                        className={`platform-option-item ${selectedPlatforms.includes(platform) ? 'selected' : ''}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handlePlatformToggle(platform);
                        }}
                      >
                        <input
                          type="checkbox"
                          checked={selectedPlatforms.includes(platform)}
                          onChange={(e) => {
                            e.stopPropagation();
                            handlePlatformToggle(platform);
                          }}
                          onClick={(e) => e.stopPropagation()}
                          className="platform-option-checkbox"
                        />
                        {getPlatformIcon(platform)}
                        <div className="platform-option-info">
                          <div className="platform-option-name">{platform}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="form-section">
              <label className="section-label">Media</label>
              <p className="section-description">
                Share photos or a video. Instagram posts can't exceed 10 photos.
              </p>
              
              <div className="media-buttons-container">
                <button className="media-upload-button" onClick={() => fileInputRef.current?.click()}>
                  <FontAwesomeIcon icon={faImage} className="media-icon" />
                  <span>Add photo</span>
                </button>
                <button className="media-upload-button" onClick={() => videoInputRef.current?.click()}>
                  <FontAwesomeIcon icon={faVideo} className="media-icon" />
                  <span>Add video</span>
                  {/* <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '10px' }} /> */}
                </button>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                onChange={(e) => handleMediaUpload(e, 'image')}
              />
              <input
                ref={videoInputRef}
                type="file"
                accept="video/*"
                style={{ display: 'none' }}
                onChange={(e) => handleMediaUpload(e, 'video')}
              />

              {selectedMedia && (
                <div className="media-preview-container">
                  {mediaType === 'image' ? (
                    <img src={selectedMedia} alt="Preview" className="media-preview-image" />
                  ) : (
                    <video src={selectedMedia} controls className="media-preview-video" />
                  )}
                  <button className="media-remove-button" onClick={removeMedia}>
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#1c1e21',
                marginBottom: '12px'
              }}>Post details</label>
              
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                marginBottom: '16px'
              }}>
                <div style={{
                  position: 'relative',
                  width: '40px',
                  height: '20px'
                }}>
                  <input 
                    type="checkbox" 
                    checked={customizeEnabled}
                    onChange={() => setCustomizeEnabled(!customizeEnabled)}
                    style={{
                      position: 'absolute',
                      opacity: '0',
                      width: '0',
                      height: '0'
                    }}
                  />
                  <span 
                    style={{
                      position: 'absolute',
                      cursor: 'pointer',
                      top: '0',
                      left: '0',
                      right: '0',
                      bottom: '0',
                      background: customizeEnabled ? '#1877f2' : '#ccc',
                      transition: '0.3s',
                      borderRadius: '20px'
                    }}
                    onClick={() => setCustomizeEnabled(!customizeEnabled)}
                  >
                    <span style={{
                      position: 'absolute',
                      height: '16px',
                      width: '16px',
                      right: customizeEnabled ? '2px' : '22px',
                      top: '2px',
                      backgroundColor: 'white',
                      transition: '0.3s',
                      borderRadius: '50%'
                    }}></span>
                  </span>
                </div>
                <span style={{ fontSize: '14px', color: '#1c1e21', fontWeight: '500' }}>
                  Customize post for each platform
                </span>
              </div>

              {customizeEnabled && (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedPlatforms.map((platform) => (
                    <div 
                      key={platform}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '8px 12px',
                        backgroundColor: activeTab === platform ? '#1877f2' : 'white',
                        color: activeTab === platform ? 'white' : '#1c1e21',
                        border: activeTab === platform ? 'none' : '1px solid #ddd',
                        borderRadius: '6px',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onClick={() => setActiveTab(platform)}
                    >
                      {getPlatformIcon(platform)}
                      <span>{platform}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '16px',
                fontWeight: '600',
                color: '#1c1e21',
                marginBottom: '8px'
              }}>{customizeEnabled ? `${activeTab} text` : 'Post text'}</label>
              
              <div style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                backgroundColor: 'white',
                overflow: 'hidden'
              }}>
                <textarea
                  style={{
                    width: '100%',
                    minHeight: '120px',
                    padding: '12px',
                    border: 'none',
                    fontSize: '14px',
                    fontFamily: 'inherit',
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box',
                    lineHeight: '1.4'
                  }}
                  placeholder={customizeEnabled ? `Write your ${activeTab} post...` : 'Write your post...'}
                  value={getCurrentText()
                  }
                  onChange={(e) => handleTextChange(e.target.value)}
                />
                <div style={{
                  padding: '8px 12px',
                  borderTop: '1px solid #f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px'
                }}>
                  <FontAwesomeIcon icon={faImage} style={{ color: '#65676b', fontSize: '16px', cursor: 'pointer' }} />
                  <img 
                    src="/icons/location.svg" 
                    alt="Location" 
                    style={{ width: '16px', height: '16px', cursor: 'pointer', color: '#65676b' }}
                  />
                  <img 
                    src="/icons/emoji.png" 
                    alt="Emoji" 
                    style={{ width: '16px', height: '16px', cursor: 'pointer' }}
                  />
                  <img 
                    src="/icons/tag.svg" 
                    alt="Tag" 
                    style={{ width: '16px', height: '16px', cursor: 'pointer', color: '#65676b' }}
                  />
                  <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#65676b', fontSize: '12px' }}>#</span>
                    <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#65676b', fontSize: '14px' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Scheduling Options */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <label style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1c1e21'
                }}>Scheduling options</label>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <span style={{ fontSize: '14px', color: '#65676b' }}>Set date and time</span>
                  <div style={{
                    width: '40px',
                    height: '20px',
                    borderRadius: '20px',
                    backgroundColor: isScheduled ? '#1877f2' : '#ddd',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'background-color 0.3s ease'
                  }}
                  onClick={() => setIsScheduled(!isScheduled)}>
                    <div style={{
                      width: '16px',
                      height: '16px',
                      borderRadius: '50%',
                      backgroundColor: 'white',
                      position: 'absolute',
                      top: '2px',
                      right: isScheduled ? '2px' : '22px',
                      transition: 'all 0.3s ease'
                    }}></div>
                  </div>
                </div>
              </div>
              
              <p style={{
                fontSize: '13px',
                color: '#65676b',
                marginBottom: '16px',
                lineHeight: '1.4'
              }}>
                Schedule your post for the times when your audience is most active, or manually select a date and time in the future to publish your post.
              </p>

              {isScheduled && (
                <>
                  {selectedPlatforms.map((platform) => (
                    <div key={platform} style={{ marginBottom: '16px' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '8px'
                      }}>
                        {getPlatformIcon(platform)}
                        <span style={{
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#1c1e21'
                        }}>{platform}</span>
                      </div>
                      
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          backgroundColor: 'white',
                          flex: '1'
                        }}>
                          <FontAwesomeIcon icon={faClock} style={{ color: '#65676b', fontSize: '14px' }} />
                          <input
                            type="date"
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            style={{
                              border: 'none',
                              outline: 'none',
                              fontSize: '14px',
                              color: '#1c1e21',
                              backgroundColor: 'transparent',
                              flex: '1'
                            }}
                          />
                        </div>
                        
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          backgroundColor: 'white',
                          flex: '1'
                        }}>
                          <FontAwesomeIcon icon={faClock} style={{ color: '#65676b', fontSize: '14px' }} />
                          <input
                            type="time"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            style={{
                              border: 'none',
                              outline: 'none',
                              fontSize: '14px',
                              color: '#1c1e21',
                              backgroundColor: 'transparent',
                              flex: '1'
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}

                  <button style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '8px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    color: '#1c1e21',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer'
                  }}>
                    <FontAwesomeIcon icon={faClock} style={{ fontSize: '14px' }} />
                    <span>Active times</span>
                  </button>
                </>
              )}
            </div>

            {/* Collaborator */}
            <div style={{ marginBottom: '24px', position: 'relative' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginBottom: '8px'
              }}>
                <label style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1c1e21'
                }}>Collaborator</label>
                <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#65676b', fontSize: '14px' }} />
              </div>
              <p style={{
                fontSize: '13px',
                color: '#65676b',
                marginBottom: '12px'
              }}>
                Add a collaborator to your Facebook post and they will automatically be invited.
              </p>
              <div style={{ position: 'relative', display: 'inline-block' }}>
                <button
                  type="button"
                  onClick={() => setShowCollaboratorModal(v => !v)}
                  style={{
                    padding: '8px 12px',
                    borderRadius: '6px',
                    border: '1px solid #ddd',
                    backgroundColor: 'white',
                    color: '#1c1e21',
                    fontSize: '14px',
                    fontWeight: '500',
                    cursor: 'pointer',
                    marginBottom: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px'
                  }}
                >
                  Add Collaborator
                  <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '12px' }} />
                </button>
                {showCollaboratorModal && (
                  <div style={{
                    position: 'absolute',
                    top: '110%',
                    left: 0,
                    background: 'white',
                    border: '1px solid #e4e6ea',
                    borderRadius: '12px',
                    boxShadow: '0 4px 16px rgba(0,0,0,0.10)',
                    padding: '18px 20px',
                    minWidth: '220px',
                    zIndex: 10
                  }}>
                    <div style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      marginBottom: '12px'
                    }}>
                      {allUsers.map(user => (
                        <label key={user.id} style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          cursor: 'pointer',
                          fontSize: '15px',
                          color: '#1c1e21',
                          fontWeight: selectedCollaborators.includes(user.id) ? '600' : '500',
                        }}>
                          <input
                            type="checkbox"
                            checked={selectedCollaborators.includes(user.id)}
                            onChange={() => {
                              setSelectedCollaborators(prev =>
                                prev.includes(user.id)
                                  ? prev.filter(cid => cid !== user.id)
                                  : [...prev, user.id]
                              );
                            }}
                            style={{ accentColor: '#1877f2', width: '18px', height: '18px', borderRadius: '5px' }}
                          />
                          <img src={user.avatar} alt={user.name} style={{ width: '28px', height: '28px', borderRadius: '50%' }} />
                          {user.name}
                        </label>
                      ))}
                    </div>
                    <button onClick={() => setShowCollaboratorModal(false)} style={{
                      width: '100%',
                      padding: '8px 0',
                      borderRadius: '6px',
                      border: 'none',
                      background: '#1877f2',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '15px',
                      cursor: 'pointer',
                    }}>Done</button>
                  </div>
                )}
              </div>
              <div style={{ marginTop: '8px' }}>
                <strong>Collaborators:</strong>
                {selectedCollaborators.map(id => {
                  const user = allUsers.find(u => u.id === id);
                  return user ? <span key={id}>{user.name} </span> : null;
                })}
              </div>
            </div>

            {/* Share to your story */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '12px'
              }}>
                <label style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#1c1e21'
                }}>Share to your story</label>
                <div 
                  className={`story-toggle ${shareToStory ? 'active' : 'inactive'}`}
                  onClick={() => setShareToStory(!shareToStory)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setShareToStory(!shareToStory);
                    }
                  }}
                  role="switch"
                  aria-checked={shareToStory}
                  aria-label="Share to your story"
                  tabIndex={0}
                >
                  <div className={`story-toggle-slider ${shareToStory ? 'active' : 'inactive'}`}></div>
                </div>
              </div>
              
              <p style={{
                fontSize: '13px',
                color: '#65676b',
                marginBottom: '16px'
              }}>
                This is for Facebook only. Your story privacy is set to Public. Anyone on Facebook can see your story.
              </p>

              {shareToStory && showStoryNotification && (
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px',
                  padding: '12px',
                  backgroundColor: '#e8f5e8',
                  borderRadius: '8px',
                  border: '1px solid #d1f2d1'
                }}>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    backgroundColor: '#42a942',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    marginTop: '2px'
                  }}>
                    <span style={{ color: 'white', fontSize: '12px' }}>💡</span>
                  </div>
                  <div style={{ flex: '1' }}>
                    <div style={{
                      fontSize: '14px',
                      fontWeight: '500',
                      color: '#1c1e21',
                      marginBottom: '4px'
                    }}>
                      You can now share your post to your story!
                    </div>
                    <div style={{
                      fontSize: '13px',
                      color: '#65676b',
                      lineHeight: '1.4'
                    }}>
                      Drive traffic to your post and keep your audience up-to-date on your new content.
                    </div>
                  </div>
                  <button 
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#65676b',
                      cursor: 'pointer',
                      fontSize: '16px',
                      padding: '4px'
                    }}
                    onClick={() => setShowStoryNotification(false)}
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              gap: '12px',
              paddingTop: '24px',
              borderTop: '1px solid #e4e6ea',
              marginTop: '24px'
            }}>
              <button style={{
                flex: '1',
                padding: '12px 24px',
                backgroundColor: '#1877f2',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'background-color 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#166fe5'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#1877f2'}
              onClick={() => {
                if (isScheduled) {
                  const start = new Date(`${scheduleDate}T${scheduleTime}:00`);
                  if (!isNaN(start.getTime())) {
                    const posts = selectedPlatforms.map((platform) => ({
                      id: `${platform}-${start.getTime()}-${Math.random().toString(36).slice(2, 8)}`,
                      title: `Scheduled ${platform} Post`,
                      text: customizeEnabled ? (platformTexts[platform] || postText || '') : (postText || ''),
                      startISO: start.toISOString(),
                      platform,
                      mediaType: mediaType || null,
                      mediaUrl: selectedMediaDataUrl || selectedMedia || null,
                      collaborators: (selectedCollaborators || []).map(id => {
                        const u = allUsers.find(x => x.id === id);
                        return u ? { id: u.id, name: u.name, avatar: u.avatar } : { id };
                      })
                    }));
                    addScheduledPosts(posts);
                  }
                } else {
                  console.log('Publishing post now (not scheduled):', { 
                    platforms: selectedPlatforms, 
                    text: customizeEnabled ? platformTexts : postText,
                    media: selectedMedia,
                    shareToStory: shareToStory,
                    collaborators: selectedCollaborators
                  });
                }
              }}>
                {isScheduled ? 'Schedule post' : 'Publish post'}
              </button>
              
              <button style={{
                padding: '12px 24px',
                backgroundColor: 'white',
                color: '#1c1e21',
                border: '1px solid #ddd',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#f5f5f5';
                e.target.style.borderColor = '#bbb';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'white';
                e.target.style.borderColor = '#ddd';
              }}
              onClick={() => {
                console.log('Saving draft:', { 
                  platforms: selectedPlatforms, 
                  text: customizeEnabled ? platformTexts : postText,
                  media: selectedMedia,
                  shareToStory: shareToStory,
                  collaborators: selectedCollaborators
                });
              }}>
                Save draft
              </button>
            </div>
          </div>
        </div>

        <div style={{
          flex: '1',
          maxWidth: '600px',
          minWidth: '500px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px'
        }}>
          <div style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          height: 'fit-content',
          overflow: 'hidden'
        }}>
          <div style={{ padding: '32px' }}>
            <h2 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1c1e21',
              marginBottom: '8px',
              textAlign: 'center'
            }}>Feed Preview</h2>
            <p style={{
              fontSize: '14px',
              color: '#65676b',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
            </p>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '28px',
              padding: '20px 24px',
              backgroundColor: '#f8f9fa',
              borderRadius: '8px'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
                {getPlatformIcon(getPreviewPlatform())}
                <span style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#1c1e21'
                }}>
                  Preview
                </span>
                {shareToStory && getPreviewPlatform() === 'Facebook' && (
                  <span style={{
                    fontSize: '11px',
                    fontWeight: '500',
                    color: '#1877f2',
                    backgroundColor: '#e7f3ff',
                    padding: '2px 6px',
                    borderRadius: '4px',
                    border: '1px solid #1877f2',
                    marginLeft: '4px'
                  }}>
                    + Story
                  </span>
                )}
              </div>

              <div style={{ position: 'relative' }} ref={previewDropdownRef}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 12px',
                    border: '1px solid #ddd',
                    borderRadius: '6px',
                    backgroundColor: 'white',
                    cursor: 'pointer',
                    fontSize: '13px',
                    fontWeight: '500'
                  }}
                  onClick={() => setShowPreviewDropdown(!showPreviewDropdown)}
                >
                  {getPlatformIcon(getPreviewPlatform())}
                  <span>{getPreviewPlatform()}</span>
                  <FontAwesomeIcon 
                    icon={faChevronDown} 
                    style={{ 
                      fontSize: '10px',
                      transform: showPreviewDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.2s ease'
                    }} 
                  />
                </div>
                {showPreviewDropdown && selectedPlatforms.length > 1 && (
                  <div style={{
                    position: 'absolute',
                    top: '100%',
                    right: '0',
                    marginTop: '4px',
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    zIndex: 1000,
                    minWidth: '140px'
                  }}>
                    {selectedPlatforms.map((platform) => (
                      <div
                        key={platform}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '8px 12px',
                          cursor: 'pointer',
                          fontSize: '13px',
                          backgroundColor: platform === getPreviewPlatform() ? '#f0f8ff' : 'transparent',
                          transition: 'background-color 0.2s ease'
                        }}
                        onClick={() => {
                          setPreviewPlatform(platform);
                          setShowPreviewDropdown(false);
                        }}
                        onMouseOver={(e) => {
                          if (platform !== getPreviewPlatform()) {
                            e.target.style.backgroundColor = '#f8f9fa';
                          }
                        }}
                        onMouseOut={(e) => {
                          if (platform !== getPreviewPlatform()) {
                            e.target.style.backgroundColor = 'transparent';
                          }
                        }}
                      >
                        {getPlatformIcon(platform)}
                        <span>{platform}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div style={getPlatformPreviewStyle(getPreviewPlatform())}>
              <div style={getPlatformHeaderStyle(getPreviewPlatform())}>
                <div style={{
                  width: '56px',
                  height: '56px',
                  borderRadius: '50%',
                  background: getPreviewPlatform() === 'LinkedIn' ? 
                             'linear-gradient(135deg, #0077b5 0%, #005885 100%)' :
                             getPreviewPlatform() === 'Instagram' ?
                             'linear-gradient(135deg, #E4405F 0%, #FCAF45 100%)' :
                             getPreviewPlatform() === 'X' ?
                             'linear-gradient(135deg, #000000 0%, #333333 100%)' :
                             'linear-gradient(135deg, #4267B2 0%, #365899 100%)',
                  color: 'white',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '22px',
                  boxShadow: '0 3px 10px rgba(102, 126, 234, 0.25)',
                  flexShrink: 0
                }}>CS</div>
                <div style={{ flex: '1', minWidth: '0' }}>
                  <div style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#1c1e21',
                    marginBottom: '4px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap'
                  }}>{getPlatformName(getPreviewPlatform())}</div>
                  <div style={{
                    fontSize: '14px',
                    color: '#65676b',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontWeight: '400'
                  }}>
                    <FontAwesomeIcon icon={faClock} />
                    <span>{isScheduled && scheduleDate ? 
                      `Scheduled for ${new Date(scheduleDate).toLocaleDateString()}` : 
                      'Just now'
                    }</span>
                    <span>·</span>
                    <FontAwesomeIcon icon={faGlobe} />
                  </div>
                </div>
              </div>

              {(getDisplayText() || postText) && (
                <div style={{
                  padding: '0 20px 20px',
                  fontSize: '17px',
                  color: '#1c1e21',
                  lineHeight: '1.5',
                  whiteSpace: 'pre-wrap',
                  minHeight: '24px'
                }}>{getDisplayText() || postText}</div>
              )}

              {selectedMedia && (
                <div style={{ 
                  width: '100%',
                  minHeight: '200px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: '#f8f9fa'
                }}>
                  {mediaType === 'image' ? (
                    <img src={selectedMedia} alt="Post content" style={{ 
                      width: '100%', 
                      height: 'auto', 
                      display: 'block',
                      maxHeight: '400px',
                      objectFit: 'contain'
                    }} />
                  ) : (
                    <video src={selectedMedia} controls style={{ 
                      width: '100%', 
                      height: 'auto', 
                      display: 'block',
                      maxHeight: '400px',
                      objectFit: 'contain'
                    }} />
                  )}
                </div>
              )}

              {!(getDisplayText() || postText) && !selectedMedia && (
                <div style={{
                  padding: '40px 20px',
                  textAlign: 'center',
                  color: '#65676b',
                  fontSize: '15px',
                  fontStyle: 'italic',
                  backgroundColor: '#f8f9fa',
                  minHeight: '120px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  Your {getPreviewPlatform()} post preview will appear here
                </div>
              )}

              {/* Engagement Buttons */}
              <div style={{
                borderTop: '1px solid #e4e6ea',
                padding: '20px 32px'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '32px'
                }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    padding: '14px 24px',
                    borderRadius: '10px',
                    transition: 'background-color 0.2s ease',
                    flex: '1',
                    justifyContent: 'center',
                    minWidth: '0'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f2f2f2'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
                    <img 
                      src="/icons/like.svg" 
                      alt="Like" 
                      style={{ width: '22px', height: '22px' }}
                    />
                    <span style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#65676b'
                    }}>Like</span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    padding: '14px 24px',
                    borderRadius: '10px',
                    transition: 'background-color 0.2s ease',
                    flex: '1',
                    justifyContent: 'center',
                    minWidth: '0'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f2f2f2'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
                    <img 
                      src="/icons/comment.svg" 
                      alt="Comment" 
                      style={{ width: '22px', height: '22px' }}
                    />
                    <span style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#65676b'
                    }}>Comment</span>
                  </div>
                  
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    padding: '14px 24px',
                    borderRadius: '10px',
                    transition: 'background-color 0.2s ease',
                    flex: '1',
                    justifyContent: 'center',
                    minWidth: '0'
                  }}
                  onMouseOver={(e) => e.target.style.backgroundColor = '#f2f2f2'}
                  onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
                    <img 
                      src="/icons/share.svg" 
                      alt="Share" 
                      style={{ width: '22px', height: '22px' }}
                    />
                    <span style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#65676b'
                    }}>Share</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePost;
