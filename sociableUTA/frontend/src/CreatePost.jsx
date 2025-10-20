// import React, { useState, useRef, useEffect } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import {
//     faChevronDown,
//     faImage,
//     faVideo,
//     faTimes,
//     faInfoCircle,
//     faGlobe,
//     faClock
// } from '@fortawesome/free-solid-svg-icons';
// import './CreatePost.css';

// import axiosInstance from './api/axios';

// const CreatePost = ({ token, user, apiSource, onNavigate }) => {
//     const [showPlatforms, setShowPlatforms] = useState(false);
//     const [selectedPlatforms, setSelectedPlatforms] = useState(['Facebook', 'Instagram', 'LinkedIn']);
//     const [postText, setPostText] = useState('');
//     const [selectedMedia, setSelectedMedia] = useState(null);
//     const [mediaType, setMediaType] = useState(null);
//     const [isScheduled, setIsScheduled] = useState(false);
//     const [scheduleDate, setScheduleDate] = useState(() => {
//         const today = new Date();
//         return today.toISOString().split('T')[0];
//     });
//     const [scheduleTime, setScheduleTime] = useState(() => {
//         const now = new Date();
//         return now.toTimeString().slice(0, 5);
//     });
//     const [collaborator, setCollaborator] = useState('');
//     const [showAdBanner, setShowAdBanner] = useState(true);
//     const [showStoryNotification, setShowStoryNotification] = useState(true);
//     const [shareToStory, setShareToStory] = useState(false);
//     const [activeTab, setActiveTab] = useState('Facebook');
//     const [customizeEnabled, setCustomizeEnabled] = useState(true);
//     const [platformTexts, setPlatformTexts] = useState({
//         Facebook: '',
//         Instagram: '',
//         LinkedIn: '',
//         X: ''
//     });
//     const [previewPlatform, setPreviewPlatform] = useState('Facebook');
//     const [showPreviewDropdown, setShowPreviewDropdown] = useState(false);

//     const fileInputRef = useRef(null);
//     const videoInputRef = useRef(null);
//     const platformDropdownRef = useRef(null);
//     const previewDropdownRef = useRef(null);

//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (previewDropdownRef.current && !previewDropdownRef.current.contains(event.target)) {
//                 setShowPreviewDropdown(false);
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []);

//     useEffect(() => {
//         if (selectedPlatforms.length > 0 && !selectedPlatforms.includes(activeTab)) {
//             setActiveTab(selectedPlatforms[0]);
//         }
//     }, [selectedPlatforms, activeTab]);

//     const handlePlatformToggle = (platform) => {
//         setSelectedPlatforms(prev => {
//             const newPlatforms = prev.includes(platform)
//                 ? prev.filter(p => p !== platform)
//                 : [...prev, platform];

//             if (newPlatforms.length > 0 && !newPlatforms.includes(activeTab)) {
//                 setActiveTab(newPlatforms[0]);
//             }

//             return newPlatforms;
//         });
//     };

//     const getCurrentText = () => {
//         if (customizeEnabled) {
//             return platformTexts[activeTab] || '';
//         }
//         return postText;
//     };

//     const handleTextChange = (value) => {
//         if (customizeEnabled) {
//             setPlatformTexts(prev => ({
//                 ...prev,
//                 [activeTab]: value
//             }));
//         } else {
//             setPostText(value);
//         }
//     };

//     const getDisplayText = () => {
//         if (customizeEnabled) {
//             return platformTexts[getPreviewPlatform()] || '';
//         }
//         return postText;
//     };

//     const getPreviewPlatform = () => {
//         return previewPlatform && selectedPlatforms.includes(previewPlatform)
//             ? previewPlatform
//             : selectedPlatforms[0] || 'Facebook';
//     };

//     const getPlatformName = (platform) => {
//         switch (platform) {
//             case 'Facebook': return 'Computer Science and Engineering';
//             case 'Instagram': return 'cse_uta';
//             case 'LinkedIn': return 'Computer Science and Engineering';
//             case 'X': return '@cse_uta';
//             default: return 'Computer Science and Engineering';
//         }
//     };

//     const getPlatformPreviewStyle = (platform) => {
//         const baseStyle = {
//             border: '1px solid #e4e6ea',
//             borderRadius: '12px',
//             overflow: 'hidden',
//             backgroundColor: 'white',
//             boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
//             width: '100%',
//             minHeight: '300px'
//         };

//         switch (platform) {
//             case 'Instagram':
//                 return { ...baseStyle, border: '1px solid #e4e6ea' };
//             case 'X':
//                 return { ...baseStyle, border: '1px solid #e4e6ea' };
//             case 'LinkedIn':
//                 return { ...baseStyle, border: '1px solid #e4e6ea' };
//             default:
//                 return baseStyle;
//         }
//     };

//     const getPlatformHeaderStyle = (platform) => {
//         const baseStyle = {
//             padding: '16px 20px',
//             display: 'flex',
//             alignItems: 'center',
//             gap: '12px',
//             minHeight: '88px',
//             backgroundColor: 'white'
//         };

//         return baseStyle;
//     };

//     const handleMediaUpload = (event, type) => {
//         const file = event.target.files[0];
//         if (file) {
//             const url = URL.createObjectURL(file);
//             setSelectedMedia(url);
//             setMediaType(type);
//         }
//     };

//     const removeMedia = () => {
//         setSelectedMedia(null);
//         setMediaType(null);
//         if (fileInputRef.current) fileInputRef.current.value = '';
//         if (videoInputRef.current) videoInputRef.current.value = '';
//     };

//     const getPlatformIcon = (platform) => {
//         const iconStyle = {
//             width: '20px',
//             height: '20px',
//             display: 'inline-flex',
//             alignItems: 'center',
//             justifyContent: 'center'
//         };

//         switch (platform) {
//             case 'Facebook':
//                 return (
//                     <img
//                         src="/icons/facebook.svg"
//                         alt="Facebook"
//                         style={iconStyle}
//                         className="platform-icon facebook"
//                     />
//                 );
//             case 'Instagram':
//                 return (
//                     <img
//                         src="/icons/instagram.svg"
//                         alt="Instagram"
//                         style={iconStyle}
//                         className="platform-icon instagram"
//                     />
//                 );
//             case 'LinkedIn':
//                 return (
//                     <img
//                         src="/icons/linkedin.svg"
//                         alt="LinkedIn"
//                         style={iconStyle}
//                         className="platform-icon linkedin"
//                     />
//                 );
//             case 'X':
//             case 'Twitter':
//                 return (
//                     <img
//                         src="/icons/x.svg"
//                         alt="X (Twitter)"
//                         style={iconStyle}
//                         className="platform-icon x"
//                     />
//                 );
//             default:
//                 return null;
//         }
//     };

//     return (
//         <div className="create-post-container">
//             <div className="main-content">
//                 <div className="left-panel">
//                     <div className="form-content">
//                         <div className="form-section">
//                             <label className="section-label">Post to</label>

//                             <div
//                                 ref={platformDropdownRef}
//                                 className="platform-dropdown-header"
//                                 onClick={() => setShowPlatforms(!showPlatforms)}
//                             >
//                                 <div className="platform-avatar">CS</div>
//                                 <span className="platform-text">
//                                     Computer Science and Engineering, UT Arlington and cse_uta
//                                 </span>
//                                 <FontAwesomeIcon
//                                     icon={faChevronDown}
//                                     className={`dropdown-chevron ${showPlatforms ? 'rotated' : ''}`}
//                                 />
//                             </div>

//                             {showPlatforms && (
//                                 <div className="platform-dropdown-content">
//                                     <div className="platform-options-list" onClick={(e) => e.stopPropagation()}>
//                                         {['Facebook', 'Instagram', 'LinkedIn', 'X'].map((platform) => (
//                                             <div
//                                                 key={platform}
//                                                 className={`platform-option-item ${selectedPlatforms.includes(platform) ? 'selected' : ''}`}
//                                                 onClick={(e) => {
//                                                     e.stopPropagation();
//                                                     handlePlatformToggle(platform);
//                                                 }}
//                                             >
//                                                 <input
//                                                     type="checkbox"
//                                                     checked={selectedPlatforms.includes(platform)}
//                                                     onChange={(e) => {
//                                                         e.stopPropagation();
//                                                         handlePlatformToggle(platform);
//                                                     }}
//                                                     onClick={(e) => e.stopPropagation()}
//                                                     className="platform-option-checkbox"
//                                                 />
//                                                 {getPlatformIcon(platform)}
//                                                 <div className="platform-option-info">
//                                                     <div className="platform-option-name">{platform}</div>
//                                                 </div>
//                                             </div>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//                         </div>

//                         <div className="form-section">
//                             <label className="section-label">Media</label>
//                             <p className="section-description">
//                                 Share photos or a video. Instagram posts can't exceed 10 photos.
//                             </p>

//                             <div className="media-buttons-container">
//                                 <button className="media-upload-button" onClick={() => fileInputRef.current?.click()}>
//                                     <FontAwesomeIcon icon={faImage} className="media-icon" />
//                                     <span>Add photo</span>
//                                 </button>
//                                 <button className="media-upload-button" onClick={() => videoInputRef.current?.click()}>
//                                     <FontAwesomeIcon icon={faVideo} className="media-icon" />
//                                     <span>Add video</span>
//                                     {/* <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '10px' }} /> */}
//                                 </button>
//                             </div>

//                             <input
//                                 ref={fileInputRef}
//                                 type="file"
//                                 accept="image/*"
//                                 style={{ display: 'none' }}
//                                 onChange={(e) => handleMediaUpload(e, 'image')}
//                             />
//                             <input
//                                 ref={videoInputRef}
//                                 type="file"
//                                 accept="video/*"
//                                 style={{ display: 'none' }}
//                                 onChange={(e) => handleMediaUpload(e, 'video')}
//                             />

//                             {selectedMedia && (
//                                 <div className="media-preview-container">
//                                     {mediaType === 'image' ? (
//                                         <img src={selectedMedia} alt="Preview" className="media-preview-image" />
//                                     ) : (
//                                         <video src={selectedMedia} controls className="media-preview-video" />
//                                     )}
//                                     <button className="media-remove-button" onClick={removeMedia}>
//                                         <FontAwesomeIcon icon={faTimes} />
//                                     </button>
//                                 </div>
//                             )}
//                         </div>

//                         <div style={{ marginBottom: '24px' }}>
//                             <label style={{
//                                 display: 'block',
//                                 fontSize: '16px',
//                                 fontWeight: '600',
//                                 color: '#1c1e21',
//                                 marginBottom: '12px'
//                             }}>Post details</label>

//                             <div style={{
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 gap: '12px',
//                                 marginBottom: '16px'
//                             }}>
//                                 <div style={{
//                                     position: 'relative',
//                                     width: '40px',
//                                     height: '20px'
//                                 }}>
//                                     <input
//                                         type="checkbox"
//                                         checked={customizeEnabled}
//                                         onChange={() => setCustomizeEnabled(!customizeEnabled)}
//                                         style={{
//                                             position: 'absolute',
//                                             opacity: '0',
//                                             width: '0',
//                                             height: '0'
//                                         }}
//                                     />
//                                     <span
//                                         style={{
//                                             position: 'absolute',
//                                             cursor: 'pointer',
//                                             top: '0',
//                                             left: '0',
//                                             right: '0',
//                                             bottom: '0',
//                                             background: customizeEnabled ? '#1877f2' : '#ccc',
//                                             transition: '0.3s',
//                                             borderRadius: '20px'
//                                         }}
//                                         onClick={() => setCustomizeEnabled(!customizeEnabled)}
//                                     >
//                                         <span style={{
//                                             position: 'absolute',
//                                             height: '16px',
//                                             width: '16px',
//                                             right: customizeEnabled ? '2px' : '22px',
//                                             top: '2px',
//                                             backgroundColor: 'white',
//                                             transition: '0.3s',
//                                             borderRadius: '50%'
//                                         }}></span>
//                                     </span>
//                                 </div>
//                                 <span style={{ fontSize: '14px', color: '#1c1e21', fontWeight: '500' }}>
//                                     Customize post for each platform
//                                 </span>
//                             </div>

//                             {customizeEnabled && (
//                                 <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
//                                     {selectedPlatforms.map((platform) => (
//                                         <div
//                                             key={platform}
//                                             style={{
//                                                 display: 'flex',
//                                                 alignItems: 'center',
//                                                 gap: '8px',
//                                                 padding: '8px 12px',
//                                                 backgroundColor: activeTab === platform ? '#1877f2' : 'white',
//                                                 color: activeTab === platform ? 'white' : '#1c1e21',
//                                                 border: activeTab === platform ? 'none' : '1px solid #ddd',
//                                                 borderRadius: '6px',
//                                                 fontSize: '14px',
//                                                 fontWeight: '500',
//                                                 cursor: 'pointer',
//                                                 transition: 'all 0.2s ease'
//                                             }}
//                                             onClick={() => setActiveTab(platform)}
//                                         >
//                                             {getPlatformIcon(platform)}
//                                             <span>{platform}</span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>

//                         <div style={{ marginBottom: '24px' }}>
//                             <label style={{
//                                 display: 'block',
//                                 fontSize: '16px',
//                                 fontWeight: '600',
//                                 color: '#1c1e21',
//                                 marginBottom: '8px'
//                             }}>{customizeEnabled ? `${activeTab} text` : 'Post text'}</label>

//                             <div style={{
//                                 border: '1px solid #ddd',
//                                 borderRadius: '8px',
//                                 backgroundColor: 'white',
//                                 overflow: 'hidden'
//                             }}>
//                                 <textarea
//                                     style={{
//                                         width: '100%',
//                                         minHeight: '120px',
//                                         padding: '12px',
//                                         border: 'none',
//                                         fontSize: '14px',
//                                         fontFamily: 'inherit',
//                                         resize: 'vertical',
//                                         outline: 'none',
//                                         boxSizing: 'border-box',
//                                         lineHeight: '1.4'
//                                     }}
//                                     placeholder={customizeEnabled ? `Write your ${activeTab} post...` : 'Write your post...'}
//                                     value={getCurrentText()}
//                                     onChange={(e) => handleTextChange(e.target.value)}
//                                 />
//                                 <div style={{
//                                     padding: '8px 12px',
//                                     borderTop: '1px solid #f0f0f0',
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     gap: '12px'
//                                 }}>
//                                     <FontAwesomeIcon icon={faImage} style={{ color: '#65676b', fontSize: '16px', cursor: 'pointer' }} />
//                                     <img
//                                         src="/icons/location.svg"
//                                         alt="Location"
//                                         style={{ width: '16px', height: '16px', cursor: 'pointer', color: '#65676b' }}
//                                     />
//                                     <img
//                                         src="/icons/emoji.png"
//                                         alt="Emoji"
//                                         style={{ width: '16px', height: '16px', cursor: 'pointer' }}
//                                     />
//                                     <img
//                                         src="/icons/tag.svg"
//                                         alt="Tag"
//                                         style={{ width: '16px', height: '16px', cursor: 'pointer', color: '#65676b' }}
//                                     />
//                                     <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                         <span style={{ color: '#65676b', fontSize: '12px' }}>#</span>
//                                         <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#65676b', fontSize: '14px' }} />
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Scheduling Options */}
//                         <div style={{ marginBottom: '24px' }}>
//                             <div style={{
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'space-between',
//                                 marginBottom: '12px'
//                             }}>
//                                 <label style={{
//                                     fontSize: '16px',
//                                     fontWeight: '600',
//                                     color: '#1c1e21'
//                                 }}>Scheduling options</label>
//                                 <div style={{
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     gap: '8px'
//                                 }}>
//                                     <span style={{ fontSize: '14px', color: '#65676b' }}>Set date and time</span>
//                                     <div style={{
//                                         width: '40px',
//                                         height: '20px',
//                                         borderRadius: '20px',
//                                         backgroundColor: isScheduled ? '#1877f2' : '#ddd',
//                                         position: 'relative',
//                                         cursor: 'pointer',
//                                         transition: 'background-color 0.3s ease'
//                                     }}
//                                         onClick={() => setIsScheduled(!isScheduled)}>
//                                         <div style={{
//                                             width: '16px',
//                                             height: '16px',
//                                             borderRadius: '50%',
//                                             backgroundColor: 'white',
//                                             position: 'absolute',
//                                             top: '2px',
//                                             right: isScheduled ? '2px' : '22px',
//                                             transition: 'all 0.3s ease'
//                                         }}></div>
//                                     </div>
//                                 </div>
//                             </div>

//                             <p style={{
//                                 fontSize: '13px',
//                                 color: '#65676b',
//                                 marginBottom: '16px',
//                                 lineHeight: '1.4'
//                             }}>
//                                 Schedule your post for the times when your audience is most active, or manually select a date and time in the future to publish your post.
//                             </p>

//                             {isScheduled && (
//                                 <>
//                                     {selectedPlatforms.map((platform) => (
//                                         <div key={platform} style={{ marginBottom: '16px' }}>
//                                             <div style={{
//                                                 display: 'flex',
//                                                 alignItems: 'center',
//                                                 gap: '8px',
//                                                 marginBottom: '8px'
//                                             }}>
//                                                 {getPlatformIcon(platform)}
//                                                 <span style={{
//                                                     fontSize: '14px',
//                                                     fontWeight: '500',
//                                                     color: '#1c1e21'
//                                                 }}>{platform}</span>
//                                             </div>

//                                             <div style={{ display: 'flex', gap: '12px' }}>
//                                                 <div style={{
//                                                     display: 'flex',
//                                                     alignItems: 'center',
//                                                     gap: '8px',
//                                                     padding: '8px 12px',
//                                                     border: '1px solid #ddd',
//                                                     borderRadius: '6px',
//                                                     backgroundColor: 'white',
//                                                     flex: '1'
//                                                 }}>
//                                                     <FontAwesomeIcon icon={faClock} style={{ color: '#65676b', fontSize: '14px' }} />
//                                                     <input
//                                                         type="date"
//                                                         value={scheduleDate}
//                                                         onChange={(e) => setScheduleDate(e.target.value)}
//                                                         style={{
//                                                             border: 'none',
//                                                             outline: 'none',
//                                                             fontSize: '14px',
//                                                             color: '#1c1e21',
//                                                             backgroundColor: 'transparent',
//                                                             flex: '1'
//                                                         }}
//                                                     />
//                                                 </div>

//                                                 <div style={{
//                                                     display: 'flex',
//                                                     alignItems: 'center',
//                                                     gap: '8px',
//                                                     padding: '8px 12px',
//                                                     border: '1px solid #ddd',
//                                                     borderRadius: '6px',
//                                                     backgroundColor: 'white',
//                                                     flex: '1'
//                                                 }}>
//                                                     <FontAwesomeIcon icon={faClock} style={{ color: '#65676b', fontSize: '14px' }} />
//                                                     <input
//                                                         type="time"
//                                                         value={scheduleTime}
//                                                         onChange={(e) => setScheduleTime(e.target.value)}
//                                                         style={{
//                                                             border: 'none',
//                                                             outline: 'none',
//                                                             fontSize: '14px',
//                                                             color: '#1c1e21',
//                                                             backgroundColor: 'transparent',
//                                                             flex: '1'
//                                                         }}
//                                                     />
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     ))}

//                                     <button style={{
//                                         display: 'flex',
//                                         alignItems: 'center',
//                                         gap: '8px',
//                                         padding: '8px 12px',
//                                         border: '1px solid #ddd',
//                                         borderRadius: '6px',
//                                         backgroundColor: 'white',
//                                         color: '#1c1e21',
//                                         fontSize: '14px',
//                                         fontWeight: '500',
//                                         cursor: 'pointer'
//                                     }}>
//                                         <FontAwesomeIcon icon={faClock} style={{ fontSize: '14px' }} />
//                                         <span>Active times</span>
//                                     </button>
//                                 </>
//                             )}
//                         </div>

//                         {/* Collaborator */}
//                         <div style={{ marginBottom: '24px' }}>
//                             <div style={{
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 gap: '8px',
//                                 marginBottom: '8px'
//                             }}>
//                                 <label style={{
//                                     fontSize: '16px',
//                                     fontWeight: '600',
//                                     color: '#1c1e21'
//                                 }}>Collaborator</label>
//                                 <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#65676b', fontSize: '14px' }} />
//                             </div>

//                             <p style={{
//                                 fontSize: '13px',
//                                 color: '#65676b',
//                                 marginBottom: '12px'
//                             }}>
//                                 Add a collaborator to your Facebook post and they will automatically be invited.
//                             </p>

//                             <input
//                                 type="text"
//                                 placeholder="Add a collaborator by name or URL"
//                                 value={collaborator}
//                                 onChange={(e) => setCollaborator(e.target.value)}
//                                 style={{
//                                     width: '100%',
//                                     padding: '12px 16px',
//                                     border: '1px solid #ddd',
//                                     borderRadius: '8px',
//                                     fontSize: '14px',
//                                     outline: 'none',
//                                     boxSizing: 'border-box'
//                                 }}
//                             />
//                         </div>

//                         {/* Share to your story */}
//                         <div style={{ marginBottom: '24px' }}>
//                             <div style={{
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'space-between',
//                                 marginBottom: '12px'
//                             }}>
//                                 <label style={{
//                                     fontSize: '16px',
//                                     fontWeight: '600',
//                                     color: '#1c1e21'
//                                 }}>Share to your story</label>
//                                 <div
//                                     className={`story-toggle ${shareToStory ? 'active' : 'inactive'}`}
//                                     onClick={() => setShareToStory(!shareToStory)}
//                                     onKeyDown={(e) => {
//                                         if (e.key === 'Enter' || e.key === ' ') {
//                                             e.preventDefault();
//                                             setShareToStory(!shareToStory);
//                                         }
//                                     }}
//                                     role="switch"
//                                     aria-checked={shareToStory}
//                                     aria-label="Share to your story"
//                                     tabIndex={0}
//                                 >
//                                     <div className={`story-toggle-slider ${shareToStory ? 'active' : 'inactive'}`}></div>
//                                 </div>
//                             </div>

//                             <p style={{
//                                 fontSize: '13px',
//                                 color: '#65676b',
//                                 marginBottom: '16px'
//                             }}>
//                                 This is for Facebook only. Your story privacy is set to Public. Anyone on Facebook can see your story.
//                             </p>

//                             {shareToStory && showStoryNotification && (
//                                 <div style={{
//                                     display: 'flex',
//                                     alignItems: 'flex-start',
//                                     gap: '12px',
//                                     padding: '12px',
//                                     backgroundColor: '#e8f5e8',
//                                     borderRadius: '8px',
//                                     border: '1px solid #d1f2d1'
//                                 }}>
//                                     <div style={{
//                                         width: '20px',
//                                         height: '20px',
//                                         borderRadius: '50%',
//                                         backgroundColor: '#42a942',
//                                         display: 'flex',
//                                         alignItems: 'center',
//                                         justifyContent: 'center',
//                                         flexShrink: 0,
//                                         marginTop: '2px'
//                                     }}>
//                                         <span style={{ color: 'white', fontSize: '12px' }}>💡</span>
//                                     </div>
//                                     <div style={{ flex: '1' }}>
//                                         <div style={{
//                                             fontSize: '14px',
//                                             fontWeight: '500',
//                                             color: '#1c1e21',
//                                             marginBottom: '4px'
//                                         }}>
//                                             You can now share your post to your story!
//                                         </div>
//                                         <div style={{
//                                             fontSize: '13px',
//                                             color: '#65676b',
//                                             lineHeight: '1.4'
//                                         }}>
//                                             Drive traffic to your post and keep your audience up-to-date on your new content.
//                                         </div>
//                                     </div>
//                                     <button
//                                         style={{
//                                             background: 'none',
//                                             border: 'none',
//                                             color: '#65676b',
//                                             cursor: 'pointer',
//                                             fontSize: '16px',
//                                             padding: '4px'
//                                         }}
//                                         onClick={() => setShowStoryNotification(false)}
//                                     >
//                                         <FontAwesomeIcon icon={faTimes} />
//                                     </button>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Action Buttons */}
//                         <div style={{
//                             display: 'flex',
//                             gap: '12px',
//                             paddingTop: '24px',
//                             borderTop: '1px solid #e4e6ea',
//                             marginTop: '24px'
//                         }}>
//                             <button style={{
//                                 flex: '1',
//                                 padding: '12px 24px',
//                                 backgroundColor: '#1877f2',
//                                 color: 'white',
//                                 border: 'none',
//                                 borderRadius: '8px',
//                                 fontSize: '16px',
//                                 fontWeight: '600',
//                                 cursor: 'pointer',
//                                 transition: 'background-color 0.2s ease',
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                                 gap: '8px'
//                             }}
//                                 onMouseOver={(e) => e.target.style.backgroundColor = '#166fe5'}
//                                 onMouseOut={(e) => e.target.style.backgroundColor = '#1877f2'}
//                                 onClick={() => {
//                                     console.log('Publishing post:', {
//                                         platforms: selectedPlatforms,
//                                         text: customizeEnabled ? platformTexts : postText,
//                                         media: selectedMedia,
//                                         scheduled: isScheduled ? { date: scheduleDate, time: scheduleTime } : null,
//                                         shareToStory: shareToStory,
//                                         collaborator: collaborator
//                                     });
//                                 }}>
//                                 {isScheduled ? 'Schedule post' : 'Publish post'}
//                             </button>

//                             <button style={{
//                                 padding: '12px 24px',
//                                 backgroundColor: 'white',
//                                 color: '#1c1e21',
//                                 border: '1px solid #ddd',
//                                 borderRadius: '8px',
//                                 fontSize: '16px',
//                                 fontWeight: '600',
//                                 cursor: 'pointer',
//                                 transition: 'all 0.2s ease',
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'center',
//                                 gap: '8px'
//                             }}
//                                 onMouseOver={(e) => {
//                                     e.target.style.backgroundColor = '#f5f5f5';
//                                     e.target.style.borderColor = '#bbb';
//                                 }}
//                                 onMouseOut={(e) => {
//                                     e.target.style.backgroundColor = 'white';
//                                     e.target.style.borderColor = '#ddd';
//                                 }}
//                                 onClick={() => {
//                                     console.log('Saving draft:', {
//                                         platforms: selectedPlatforms,
//                                         text: customizeEnabled ? platformTexts : postText,
//                                         media: selectedMedia,
//                                         shareToStory: shareToStory,
//                                         collaborator: collaborator
//                                     });
//                                 }}>
//                                 Save draft
//                             </button>
//                         </div>
//                     </div>
//                 </div>

//                 <div style={{
//                     flex: '1',
//                     maxWidth: '600px',
//                     minWidth: '500px',
//                     display: 'flex',
//                     flexDirection: 'column',
//                     gap: '16px'
//                 }}>
//                     <div style={{
//                         backgroundColor: 'white',
//                         borderRadius: '16px',
//                         boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
//                         border: '1px solid rgba(255, 255, 255, 0.2)',
//                         height: 'fit-content',
//                         overflow: 'hidden'
//                     }}>
//                         <div style={{ padding: '32px' }}>
//                             <h2 style={{
//                                 fontSize: '24px',
//                                 fontWeight: '700',
//                                 color: '#1c1e21',
//                                 marginBottom: '8px',
//                                 textAlign: 'center'
//                             }}>Feed Preview</h2>
//                             <p style={{
//                                 fontSize: '14px',
//                                 color: '#65676b',
//                                 marginBottom: '24px',
//                                 textAlign: 'center'
//                             }}>
//                             </p>

//                             <div style={{
//                                 display: 'flex',
//                                 alignItems: 'center',
//                                 justifyContent: 'space-between',
//                                 marginBottom: '28px',
//                                 padding: '20px 24px',
//                                 backgroundColor: '#f8f9fa',
//                                 borderRadius: '8px'
//                             }}>
//                                 <div style={{
//                                     display: 'flex',
//                                     alignItems: 'center',
//                                     gap: '8px'
//                                 }}>
//                                     {getPlatformIcon(getPreviewPlatform())}
//                                     <span style={{
//                                         fontSize: '14px',
//                                         fontWeight: '600',
//                                         color: '#1c1e21'
//                                     }}>
//                                         Preview
//                                     </span>
//                                     {shareToStory && getPreviewPlatform() === 'Facebook' && (
//                                         <span style={{
//                                             fontSize: '11px',
//                                             fontWeight: '500',
//                                             color: '#1877f2',
//                                             backgroundColor: '#e7f3ff',
//                                             padding: '2px 6px',
//                                             borderRadius: '4px',
//                                             border: '1px solid #1877f2',
//                                             marginLeft: '4px'
//                                         }}>
//                                             + Story
//                                         </span>
//                                     )}
//                                 </div>

//                                 <div style={{ position: 'relative' }} ref={previewDropdownRef}>
//                                     <div
//                                         style={{
//                                             display: 'flex',
//                                             alignItems: 'center',
//                                             gap: '8px',
//                                             padding: '6px 12px',
//                                             border: '1px solid #ddd',
//                                             borderRadius: '6px',
//                                             backgroundColor: 'white',
//                                             cursor: 'pointer',
//                                             fontSize: '13px',
//                                             fontWeight: '500'
//                                         }}
//                                         onClick={() => setShowPreviewDropdown(!showPreviewDropdown)}
//                                     >
//                                         {getPlatformIcon(getPreviewPlatform())}
//                                         <span>{getPreviewPlatform()}</span>
//                                         <FontAwesomeIcon
//                                             icon={faChevronDown}
//                                             style={{
//                                                 fontSize: '10px',
//                                                 transform: showPreviewDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
//                                                 transition: 'transform 0.2s ease'
//                                             }}
//                                         />
//                                     </div>

//                                     {showPreviewDropdown && selectedPlatforms.length > 1 && (
//                                         <div style={{
//                                             position: 'absolute',
//                                             top: '100%',
//                                             right: '0',
//                                             marginTop: '4px',
//                                             background: 'white',
//                                             border: '1px solid #ddd',
//                                             borderRadius: '8px',
//                                             boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
//                                             zIndex: 1000,
//                                             minWidth: '140px'
//                                         }}>
//                                             {selectedPlatforms.map((platform) => (
//                                                 <div
//                                                     key={platform}
//                                                     style={{
//                                                         display: 'flex',
//                                                         alignItems: 'center',
//                                                         gap: '8px',
//                                                         padding: '8px 12px',
//                                                         cursor: 'pointer',
//                                                         fontSize: '13px',
//                                                         backgroundColor: platform === getPreviewPlatform() ? '#f0f8ff' : 'transparent',
//                                                         transition: 'background-color 0.2s ease'
//                                                     }}
//                                                     onClick={() => {
//                                                         setPreviewPlatform(platform);
//                                                         setShowPreviewDropdown(false);
//                                                     }}
//                                                     onMouseOver={(e) => {
//                                                         if (platform !== getPreviewPlatform()) {
//                                                             e.target.style.backgroundColor = '#f8f9fa';
//                                                         }
//                                                     }}
//                                                     onMouseOut={(e) => {
//                                                         if (platform !== getPreviewPlatform()) {
//                                                             e.target.style.backgroundColor = 'transparent';
//                                                         }
//                                                     }}
//                                                 >
//                                                     {getPlatformIcon(platform)}
//                                                     <span>{platform}</span>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             <div style={getPlatformPreviewStyle(getPreviewPlatform())}>
//                                 <div style={getPlatformHeaderStyle(getPreviewPlatform())}>
//                                     <div style={{
//                                         width: '56px',
//                                         height: '56px',
//                                         borderRadius: '50%',
//                                         background: getPreviewPlatform() === 'LinkedIn' ?
//                                             'linear-gradient(135deg, #0077b5 0%, #005885 100%)' :
//                                             getPreviewPlatform() === 'Instagram' ?
//                                                 'linear-gradient(135deg, #E4405F 0%, #FCAF45 100%)' :
//                                                 getPreviewPlatform() === 'X' ?
//                                                     'linear-gradient(135deg, #000000 0%, #333333 100%)' :
//                                                     'linear-gradient(135deg, #4267B2 0%, #365899 100%)',
//                                         color: 'white',
//                                         display: 'flex',
//                                         alignItems: 'center',
//                                         justifyContent: 'center',
//                                         fontWeight: 'bold',
//                                         fontSize: '22px',
//                                         boxShadow: '0 3px 10px rgba(102, 126, 234, 0.25)',
//                                         flexShrink: 0
//                                     }}>CS</div>
//                                     <div style={{ flex: '1', minWidth: '0' }}>
//                                         <div style={{
//                                             fontSize: '18px',
//                                             fontWeight: '600',
//                                             color: '#1c1e21',
//                                             marginBottom: '4px',
//                                             overflow: 'hidden',
//                                             textOverflow: 'ellipsis',
//                                             whiteSpace: 'nowrap'
//                                         }}>{getPlatformName(getPreviewPlatform())}</div>
//                                         <div style={{
//                                             fontSize: '14px',
//                                             color: '#65676b',
//                                             display: 'flex',
//                                             alignItems: 'center',
//                                             gap: '6px',
//                                             fontWeight: '400'
//                                         }}>
//                                             <FontAwesomeIcon icon={faClock} />
//                                             <span>{isScheduled && scheduleDate ?
//                                                 `Scheduled for ${new Date(scheduleDate).toLocaleDateString()}` :
//                                                 'Just now'
//                                             }</span>
//                                             <span>·</span>
//                                             <FontAwesomeIcon icon={faGlobe} />
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {(getDisplayText() || postText) && (
//                                     <div style={{
//                                         padding: '0 20px 20px',
//                                         fontSize: '17px',
//                                         color: '#1c1e21',
//                                         lineHeight: '1.5',
//                                         whiteSpace: 'pre-wrap',
//                                         minHeight: '24px'
//                                     }}>{getDisplayText() || postText}</div>
//                                 )}

//                                 {selectedMedia && (
//                                     <div style={{
//                                         width: '100%',
//                                         minHeight: '200px',
//                                         display: 'flex',
//                                         alignItems: 'center',
//                                         justifyContent: 'center',
//                                         backgroundColor: '#f8f9fa'
//                                     }}>
//                                         {mediaType === 'image' ? (
//                                             <img src={selectedMedia} alt="Post content" style={{
//                                                 width: '100%',
//                                                 height: 'auto',
//                                                 display: 'block',
//                                                 maxHeight: '400px',
//                                                 objectFit: 'contain'
//                                             }} />
//                                         ) : (
//                                             <video src={selectedMedia} controls style={{
//                                                 width: '100%',
//                                                 height: 'auto',
//                                                 display: 'block',
//                                                 maxHeight: '400px',
//                                                 objectFit: 'contain'
//                                             }} />
//                                         )}
//                                     </div>
//                                 )}

//                                 {!(getDisplayText() || postText) && !selectedMedia && (
//                                     <div style={{
//                                         padding: '40px 20px',
//                                         textAlign: 'center',
//                                         color: '#65676b',
//                                         fontSize: '15px',
//                                         fontStyle: 'italic',
//                                         backgroundColor: '#f8f9fa',
//                                         minHeight: '120px',
//                                         display: 'flex',
//                                         alignItems: 'center',
//                                         justifyContent: 'center'
//                                     }}>
//                                         Your {getPreviewPlatform()} post preview will appear here
//                                     </div>
//                                 )}

//                                 {/* Engagement Buttons */}
//                                 <div style={{
//                                     borderTop: '1px solid #e4e6ea',
//                                     padding: '20px 32px'
//                                 }}>
//                                     <div style={{
//                                         display: 'flex',
//                                         justifyContent: 'space-between',
//                                         alignItems: 'center',
//                                         gap: '32px'
//                                     }}>
//                                         <div style={{
//                                             display: 'flex',
//                                             alignItems: 'center',
//                                             gap: '10px',
//                                             cursor: 'pointer',
//                                             padding: '14px 24px',
//                                             borderRadius: '10px',
//                                             transition: 'background-color 0.2s ease',
//                                             flex: '1',
//                                             justifyContent: 'center',
//                                             minWidth: '0'
//                                         }}
//                                             onMouseOver={(e) => e.target.style.backgroundColor = '#f2f2f2'}
//                                             onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
//                                             <img
//                                                 src="/icons/like.svg"
//                                                 alt="Like"
//                                                 style={{ width: '22px', height: '22px' }}
//                                             />
//                                             <span style={{
//                                                 fontSize: '15px',
//                                                 fontWeight: '600',
//                                                 color: '#65676b'
//                                             }}>Like</span>
//                                         </div>

//                                         <div style={{
//                                             display: 'flex',
//                                             alignItems: 'center',
//                                             gap: '10px',
//                                             cursor: 'pointer',
//                                             padding: '14px 24px',
//                                             borderRadius: '10px',
//                                             transition: 'background-color 0.2s ease',
//                                             flex: '1',
//                                             justifyContent: 'center',
//                                             minWidth: '0'
//                                         }}
//                                             onMouseOver={(e) => e.target.style.backgroundColor = '#f2f2f2'}
//                                             onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
//                                             <img
//                                                 src="/icons/comment.svg"
//                                                 alt="Comment"
//                                                 style={{ width: '22px', height: '22px' }}
//                                             />
//                                             <span style={{
//                                                 fontSize: '15px',
//                                                 fontWeight: '600',
//                                                 color: '#65676b'
//                                             }}>Comment</span>
//                                         </div>

//                                         <div style={{
//                                             display: 'flex',
//                                             alignItems: 'center',
//                                             gap: '10px',
//                                             cursor: 'pointer',
//                                             padding: '14px 24px',
//                                             borderRadius: '10px',
//                                             transition: 'background-color 0.2s ease',
//                                             flex: '1',
//                                             justifyContent: 'center',
//                                             minWidth: '0'
//                                         }}
//                                             onMouseOver={(e) => e.target.style.backgroundColor = '#f2f2f2'}
//                                             onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
//                                             <img
//                                                 src="/icons/share.svg"
//                                                 alt="Share"
//                                                 style={{ width: '22px', height: '22px' }}
//                                             />
//                                             <span style={{
//                                                 fontSize: '15px',
//                                                 fontWeight: '600',
//                                                 color: '#65676b'
//                                             }}>Share</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CreatePost;


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

// Make sure this path is correct relative to CreatePost.jsx
import axiosInstance from './api/axios';

const CreatePost = ({ token, user, apiSource, onNavigate }) => {
    const [showPlatforms, setShowPlatforms] = useState(false);
    const [selectedPlatforms, setSelectedPlatforms] = useState(['Facebook']); // Default to Facebook selected
    const [postText, setPostText] = useState('');
    const [selectedMedia, setSelectedMedia] = useState(null);
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
    const [collaborator, setCollaborator] = useState('');
    const [showAdBanner, setShowAdBanner] = useState(true);
    const [showStoryNotification, setShowStoryNotification] = useState(true);
    const [shareToStory, setShareToStory] = useState(false);
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

    // --- Added State Variables ---
    const [isPosting, setIsPosting] = useState(false);
    const [postError, setPostError] = useState('');
    const [postSuccess, setPostSuccess] = useState('');
    // --- End Added State Variables ---


    const fileInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const platformDropdownRef = useRef(null);
    const previewDropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (previewDropdownRef.current && !previewDropdownRef.current.contains(event.target)) {
                setShowPreviewDropdown(false);
            }
            // Add similar logic for platform dropdown if needed
            if (platformDropdownRef.current && !platformDropdownRef.current.contains(event.target)) {
                // Check if the click target is inside the dropdown header before closing
                const header = platformDropdownRef.current.previousElementSibling; // Assuming header is right before content div
                if (header && !header.contains(event.target)) {
                    setShowPlatforms(false);
                }
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); // Added platformDropdownRef dependency if it can change, otherwise empty is fine

    useEffect(() => {
        // Automatically select the first platform if the active one is deselected
        if (customizeEnabled && selectedPlatforms.length > 0 && !selectedPlatforms.includes(activeTab)) {
            setActiveTab(selectedPlatforms[0]);
        }
        // Ensure preview defaults correctly when selections change
        if (!selectedPlatforms.includes(previewPlatform) && selectedPlatforms.length > 0) {
            setPreviewPlatform(selectedPlatforms[0]);
        } else if (selectedPlatforms.length === 0) {
            setPreviewPlatform('Facebook'); // Default if nothing selected
        }
    }, [selectedPlatforms, activeTab, customizeEnabled, previewPlatform]);


    const handlePlatformToggle = (platform) => {
        setSelectedPlatforms(prev => {
            const newPlatforms = prev.includes(platform)
                ? prev.filter(p => p !== platform)
                : [...prev, platform];
            // Don't auto-switch activeTab here, let the useEffect handle it
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
            // Optionally sync all platform texts when customize is off
            // setPlatformTexts({ Facebook: value, Instagram: value, LinkedIn: value, X: value });
        }
    };

    const getDisplayText = () => {
        const platformToPreview = getPreviewPlatform();
        if (customizeEnabled) {
            return platformTexts[platformToPreview] || '';
        }
        return postText;
    };


    const getPreviewPlatform = () => {
        // Ensure preview platform is always one of the selected ones, or default
        if (selectedPlatforms.length === 0) return 'Facebook'; // Default preview if nothing selected
        if (selectedPlatforms.includes(previewPlatform)) return previewPlatform;
        return selectedPlatforms[0]; // Default to the first selected platform
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
            default: // Facebook
                return baseStyle;
        }
    };

    const getPlatformHeaderStyle = (platform) => {
        return { // Keep consistent style for header
            padding: '16px 20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minHeight: '88px', // Ensure consistent height
            backgroundColor: 'white',
            borderBottom: '1px solid #e4e6ea' // Added border for separation
        };
    };


    const handleMediaUpload = (event, type) => {
        const file = event.target.files[0];
        if (file) {
            // Store the File object itself, not just the URL
            setSelectedMedia(file);
            setMediaType(type);
            // Clear the other input ref value to avoid confusion if user switches
            if (type === 'image' && videoInputRef.current) videoInputRef.current.value = '';
            if (type === 'video' && fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeMedia = () => {
        setSelectedMedia(null);
        setMediaType(null);
        // Reset both file inputs
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (videoInputRef.current) videoInputRef.current.value = '';
    };

    // Helper to get media URL for preview
    const getMediaPreviewUrl = () => {
        if (!selectedMedia) return null;
        // Check if it's a File object before creating URL
        if (selectedMedia instanceof File) {
            return URL.createObjectURL(selectedMedia);
        }
        // If it was already a URL (e.g., from a draft), just return it
        return selectedMedia;
    };


    const getPlatformIcon = (platform) => {
        const iconStyle = {
            width: '20px',
            height: '20px',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
        };

        // TODO: Replace placeholders if you have actual SVG/image files
        switch (platform) {
            case 'Facebook':
                return <img src="/icons/facebook.svg" alt="Facebook" style={iconStyle} className="platform-icon facebook" onError={(e) => e.target.style.display = 'none'} />;
            case 'Instagram':
                return <img src="/icons/instagram.svg" alt="Instagram" style={iconStyle} className="platform-icon instagram" onError={(e) => e.target.style.display = 'none'} />;
            case 'LinkedIn':
                return <img src="/icons/linkedin.svg" alt="LinkedIn" style={iconStyle} className="platform-icon linkedin" onError={(e) => e.target.style.display = 'none'} />;
            case 'X':
            case 'Twitter':
                return <img src="/icons/x.svg" alt="X (Twitter)" style={iconStyle} className="platform-icon x" onError={(e) => e.target.style.display = 'none'} />;
            default:
                return <span style={iconStyle}>?</span>; // Fallback icon
        }
    };

    // --- Added handlePublish Function ---
    const handlePublish = async () => {
        setIsPosting(true);
        setPostError('');
        setPostSuccess('');
        let successMessages = [];
        let errorMessages = [];


        // Determine which text to use - prioritize customized text if enabled
        const getTextForPlatform = (platform) => {
            if (customizeEnabled && platformTexts[platform]?.trim()) {
                return platformTexts[platform];
            }
            return postText; // Fallback to common text
        };

        const commonText = postText; // Get common text once

        // Check if there's any content at all for any selected platform
        const hasContent = selectedMedia || selectedPlatforms.some(p => getTextForPlatform(p)?.trim());

        if (!hasContent) {
            setPostError('Please add text or media to your post.');
            setIsPosting(false);
            return;
        }

        // Loop through selected platforms and attempt to post
        for (const platform of selectedPlatforms) {
            const platformText = getTextForPlatform(platform);

            // Skip if no text and no media for this specific platform (unless media is present globally)
            if (!platformText?.trim() && !selectedMedia) {
                console.log(`Skipping ${platform}: No content specific to it.`);
                continue;
            }

            if (platform === 'Facebook') {
                if (!selectedMedia) { // Handle text-only post
                    try {
                        console.log(`Attempting Facebook text post: "${platformText}"`);
                        const response = await axiosInstance.post('/api/facebook/feed', {
                            message: platformText
                        });
                        if (response.status === 201) {
                            successMessages.push(`Successfully posted to Facebook (ID: ${response.data.postId})`);
                        } else {
                            errorMessages.push(`Facebook: Unexpected response status ${response.status}`);
                        }
                    } catch (err) {
                        console.error("Facebook post error:", err.response?.data || err.message);
                        errorMessages.push(`Facebook: ${err.response?.data?.error?.message || err.message}`);
                    }
                } else {
                    // TODO: Implement Facebook media posting
                    console.log(`Media posting to Facebook for "${platformText}" not implemented yet.`);
                    errorMessages.push('Facebook: Media posting not implemented yet.');
                }
            } else if (platform === 'Instagram') {
                // TODO: Implement Instagram posting (requires media)
                console.log(`Posting to Instagram for "${platformText}" not implemented yet.`);
                errorMessages.push('Instagram: Posting not implemented yet.');
            }
            // Add else if blocks for LinkedIn, X, etc. here
            // else if (platform === 'LinkedIn') { ... }
            // else if (platform === 'X') { ... }
        }

        // Aggregate results
        if (successMessages.length > 0) {
            setPostSuccess(successMessages.join(' | '));
        }
        if (errorMessages.length > 0) {
            setPostError(errorMessages.join(' | '));
        }

        // Optionally clear fields only if all selected platforms were successful
        if (errorMessages.length === 0 && successMessages.length > 0) {
            setPostText('');
            setPlatformTexts({ Facebook: '', Instagram: '', LinkedIn: '', X: '' });
            removeMedia(); // Clear media
        }


        setIsPosting(false);
    };
    // --- End handlePublish Function ---

    // --- Media Preview URL ---
    const mediaPreviewUrl = getMediaPreviewUrl();
    // --- End Media Preview URL ---

    return (
        <div className="create-post-container">
            <div className="main-content">
                <div className="left-panel">
                    <div className="form-content">
                        {/* Post To Section */}
                        <div className="form-section">
                            <label className="section-label">Post to</label>
                            <div
                                ref={platformDropdownRef} // Ref needed for outside click detection
                                className="platform-dropdown-header"
                                onClick={() => setShowPlatforms(!showPlatforms)}
                            >
                                <div className="platform-avatar">CS</div>
                                <span className="platform-text">
                                    {/* Dynamically show selected platform names or a summary */}
                                    {selectedPlatforms.length === 0
                                        ? "Select platforms..."
                                        : selectedPlatforms.length <= 2
                                            ? selectedPlatforms.join(' and ')
                                            : `${selectedPlatforms.length} platforms selected`}
                                </span>
                                <FontAwesomeIcon
                                    icon={faChevronDown}
                                    className={`dropdown-chevron ${showPlatforms ? 'rotated' : ''}`}
                                />
                            </div>

                            {/* Use conditional rendering with CSS for animation if desired */}
                            {showPlatforms && (
                                <div className="platform-dropdown-content">
                                    <div className="platform-options-list"> {/* Removed stopPropagation */}
                                        {['Facebook', 'Instagram', 'LinkedIn', 'X'].map((platform) => (
                                            <div
                                                key={platform}
                                                className={`platform-option-item ${selectedPlatforms.includes(platform) ? 'selected' : ''}`}
                                                onClick={() => handlePlatformToggle(platform)} // Simplified toggle call
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={selectedPlatforms.includes(platform)}
                                                    readOnly // Input controlled by div click
                                                    className="platform-option-checkbox"
                                                    tabIndex={-1} // Make checkbox non-focusable
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

                        {/* Media Section */}
                        <div className="form-section">
                            <label className="section-label">Media</label>
                            <p className="section-description">
                                Share photos or a video. Instagram posts require media and can't exceed 10 photos.
                            </p>
                            <div className="media-buttons-container">
                                <button type="button" className="media-upload-button" onClick={() => fileInputRef.current?.click()}>
                                    <FontAwesomeIcon icon={faImage} className="media-icon" />
                                    <span>Add photo</span>
                                </button>
                                <button type="button" className="media-upload-button" onClick={() => videoInputRef.current?.click()}>
                                    <FontAwesomeIcon icon={faVideo} className="media-icon" />
                                    <span>Add video</span>
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

                            {/* Updated Media Preview */}
                            {mediaPreviewUrl && (
                                <div className="media-preview-container">
                                    {mediaType === 'image' ? (
                                        <img src={mediaPreviewUrl} alt="Preview" className="media-preview-image" />
                                    ) : (
                                        <video src={mediaPreviewUrl} controls className="media-preview-video" />
                                    )}
                                    <button type="button" className="media-remove-button" onClick={removeMedia}>
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Post Details Section */}
                        <div style={{ marginBottom: '24px' }}>
                            {/* ... (Customize toggle remains the same) ... */}
                            <label style={{ display: 'block', /*...*/ marginBottom: '12px' }}>Post details</label>
                            <div style={{ display: 'flex', /*...*/ marginBottom: '16px' }}>
                                <div style={{ position: 'relative', width: '40px', height: '20px' }}>
                                    {/* Input and spans for the toggle switch */}
                                    <input
                                        type="checkbox"
                                        id="customizeToggle" // Added id for label association
                                        checked={customizeEnabled}
                                        onChange={() => setCustomizeEnabled(!customizeEnabled)}
                                        style={{ position: 'absolute', opacity: '0', width: '0', height: '0' }}
                                    />
                                    <label htmlFor="customizeToggle" style={{ /* outer span style */
                                        position: 'absolute', cursor: 'pointer', top: '0', left: '0', right: '0', bottom: '0',
                                        background: customizeEnabled ? '#1877f2' : '#ccc', transition: '0.3s', borderRadius: '20px'
                                    }}>
                                        <span style={{ /* inner span (knob) style */
                                            position: 'absolute', height: '16px', width: '16px', left: customizeEnabled ? '22px' : '2px', // Adjusted left positioning
                                            top: '2px', backgroundColor: 'white', transition: '0.3s', borderRadius: '50%'
                                        }}></span>
                                    </label>
                                </div>
                                <label htmlFor="customizeToggle" style={{ fontSize: '14px', color: '#1c1e21', fontWeight: '500', cursor: 'pointer' }}>
                                    Customize post for each platform
                                </label>
                            </div>

                            {/* Platform Tabs */}
                            {customizeEnabled && selectedPlatforms.length > 0 && (
                                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                                    {selectedPlatforms.map((platform) => (
                                        <div
                                            key={platform}
                                            style={{
                                                display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px',
                                                backgroundColor: activeTab === platform ? '#1877f2' : 'white',
                                                color: activeTab === platform ? 'white' : '#1c1e21',
                                                border: activeTab === platform ? 'none' : '1px solid #ddd',
                                                borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer',
                                                transition: 'all 0.2s ease'
                                            }}
                                            onClick={() => setActiveTab(platform)}
                                            role="tab" // Accessibility
                                            aria-selected={activeTab === platform}
                                            tabIndex={0} // Make focusable
                                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTab(platform); }} // Keyboard activation
                                        >
                                            {getPlatformIcon(platform)}
                                            <span>{platform}</span>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Text Input */}
                        <div style={{ marginBottom: '24px' }}>
                            <label style={{ /* ... */ }}>{customizeEnabled ? `${activeTab} text` : 'Post text'}</label>
                            <div style={{ border: '1px solid #ddd', /* ... */ }}>
                                <textarea
                                    style={{ /* ... */ }}
                                    placeholder={customizeEnabled ? `Write your ${activeTab} post...` : 'Write your post...'}
                                    value={getCurrentText()}
                                    onChange={(e) => handleTextChange(e.target.value)}
                                />
                                <div style={{ /* ... Text Tools ... */ }}>
                                    {/* ... Icons ... */}
                                </div>
                            </div>
                        </div>

                        {/* Scheduling Options */}
                        <div style={{ marginBottom: '24px' }}>
                            {/* ... (Scheduling UI remains the same) ... */}
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <label style={{ fontSize: '16px', fontWeight: '600', color: '#1c1e21' }}>Scheduling options</label>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '14px', color: '#65676b' }}>Set date and time</span>
                                    <div style={{ width: '40px', height: '20px', borderRadius: '20px', backgroundColor: isScheduled ? '#1877f2' : '#ddd', position: 'relative', cursor: 'pointer', transition: 'background-color 0.3s ease' }}
                                        onClick={() => setIsScheduled(!isScheduled)}>
                                        <div style={{ width: '16px', height: '16px', borderRadius: '50%', backgroundColor: 'white', position: 'absolute', top: '2px', left: isScheduled ? '22px' : '2px', transition: 'all 0.3s ease' }}></div> {/* Adjusted left positioning */}
                                    </div>
                                </div>
                            </div>
                            {/* ... (Description and date/time inputs remain the same) ... */}
                        </div>

                        {/* Collaborator */}
                        <div style={{ marginBottom: '24px' }}>
                            {/* ... (Collaborator UI remains the same) ... */}
                        </div>

                        {/* Share to story */}
                        <div style={{ marginBottom: '24px' }}>
                            {/* ... (Share to Story UI remains the same) ... */}
                        </div>

                        {/* --- Added Feedback Display --- */}
                        <div style={{ marginBottom: '15px', minHeight: '20px' }}> {/* Reserve space */}
                            {postError && <div style={{ color: '#dc2626', background: '#fee2e2', padding: '8px', borderRadius: '4px', textAlign: 'center' }}>{postError}</div>}
                            {postSuccess && <div style={{ color: '#16a34a', background: '#dcfce7', padding: '8px', borderRadius: '4px', textAlign: 'center' }}>{postSuccess}</div>}
                        </div>
                        {/* --- End Feedback Display --- */}

                        {/* Action Buttons */}
                        <div style={{
                            display: 'flex', gap: '12px', paddingTop: '24px',
                            borderTop: '1px solid #e4e6ea', marginTop: '24px'
                        }}>
                            {/* --- Updated Publish Button --- */}
                            <button
                                type="button" // Change to type="button" as it's handled by onClick
                                style={{ /* Keep existing styles */
                                    flex: '1', padding: '12px 24px', backgroundColor: '#1877f2', color: 'white',
                                    border: 'none', borderRadius: '8px', fontSize: '16px', fontWeight: '600',
                                    cursor: 'pointer', transition: 'background-color 0.2s ease', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}
                                onMouseOver={(e) => !isPosting && (e.currentTarget.style.backgroundColor = '#166fe5')}
                                onMouseOut={(e) => !isPosting && (e.currentTarget.style.backgroundColor = '#1877f2')}
                                onClick={handlePublish} // Use the new handler
                                disabled={isPosting || selectedPlatforms.length === 0} // Disable while posting or if nothing selected
                            >
                                {isPosting ? 'Publishing...' : (isScheduled ? 'Schedule post' : 'Publish post')}
                            </button>
                            {/* --- End Updated Publish Button --- */}

                            <button
                                type="button" // Change to type="button"
                                style={{ /* Keep existing styles */
                                    padding: '12px 24px', backgroundColor: 'white', color: '#1c1e21',
                                    border: '1px solid #ddd', borderRadius: '8px', fontSize: '16px', fontWeight: '600',
                                    cursor: 'pointer', transition: 'all 0.2s ease', display: 'flex',
                                    alignItems: 'center', justifyContent: 'center', gap: '8px'
                                }}
                                onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5'; e.currentTarget.style.borderColor = '#bbb'; }}
                                onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#ddd'; }}
                                onClick={() => {
                                    console.log('Saving draft:', { /* ... */ });
                                }}
                            >
                                Save draft
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right Panel (Preview) */}
                <div style={{ flex: '1', maxWidth: '600px', minWidth: '500px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div style={{ /* Outer container style */ backgroundColor: 'white', borderRadius: '16px', boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)', border: '1px solid rgba(255, 255, 255, 0.2)', height: 'fit-content', overflow: 'hidden' }}>
                        <div style={{ padding: '32px' }}>
                            {/* Feed Preview Title/Subtitle */}
                            <h2 style={{ fontSize: '24px', /* ... */ textAlign: 'center' }}>Feed Preview</h2>
                            <p style={{ fontSize: '14px', /* ... */ textAlign: 'center' }}></p>

                            {/* Preview Header with Dropdown */}
                            <div style={{ display: 'flex', /* ... */ marginBottom: '28px', /* ... */ }}>
                                <div style={{ display: 'flex', /* ... */ }}>
                                    {getPlatformIcon(getPreviewPlatform())}
                                    <span style={{ fontSize: '14px', /* ... */ }}>Preview</span>
                                    {shareToStory && getPreviewPlatform() === 'Facebook' && (
                                        <span style={{ fontSize: '11px', /* ... */ }}>+ Story</span>
                                    )}
                                </div>
                                <div style={{ position: 'relative' }} ref={previewDropdownRef}>
                                    {/* Dropdown Button */}
                                    <div style={{ display: 'flex', /* ... */ cursor: 'pointer', /* ... */ }}
                                        onClick={() => setShowPreviewDropdown(!showPreviewDropdown)}>
                                        {getPlatformIcon(getPreviewPlatform())}
                                        <span>{getPreviewPlatform()}</span>
                                        <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '10px', transform: showPreviewDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
                                    </div>
                                    {/* Dropdown Menu */}
                                    {showPreviewDropdown && selectedPlatforms.length > 1 && (
                                        <div style={{ position: 'absolute', /* ... */ }}>
                                            {selectedPlatforms.map((platform) => (
                                                <div key={platform} style={{ display: 'flex', /* ... */ cursor: 'pointer', /* ... */ }}
                                                    onClick={() => { setPreviewPlatform(platform); setShowPreviewDropdown(false); }}
                                                    // Added hover effects directly here for simplicity
                                                    onMouseEnter={(e) => { if (platform !== getPreviewPlatform()) e.currentTarget.style.backgroundColor = '#f8f9fa'; }}
                                                    onMouseLeave={(e) => { if (platform !== getPreviewPlatform()) e.currentTarget.style.backgroundColor = 'transparent'; }}
                                                >
                                                    {getPlatformIcon(platform)}
                                                    <span>{platform}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* The Actual Post Preview */}
                            <div style={getPlatformPreviewStyle(getPreviewPlatform())}>
                                {/* Post Header */}
                                <div style={getPlatformHeaderStyle(getPreviewPlatform())}>
                                    {/* Avatar */}
                                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: /* Dynamic Background based on platform */ '...', /* ... other styles ... */ flexShrink: 0 }}>CS</div>
                                    {/* Name and Time */}
                                    <div style={{ flex: '1', minWidth: '0' }}>
                                        <div style={{ fontSize: '18px', /* ... */ }}>{getPlatformName(getPreviewPlatform())}</div>
                                        <div style={{ fontSize: '14px', /* ... */ }}>
                                            <FontAwesomeIcon icon={faClock} />
                                            <span>{isScheduled && scheduleDate ? `Scheduled for ${new Date(scheduleDate + 'T' + (scheduleTime || '00:00')).toLocaleDateString()}` : 'Just now'}</span> {/* Improved date display */}
                                            <span>·</span>
                                            <FontAwesomeIcon icon={faGlobe} />
                                        </div>
                                    </div>
                                </div>

                                {/* Post Text */}
                                {(getDisplayText()) && ( // Display even if only spaces, trim check done before publish
                                    <div style={{ padding: '0 20px 20px', /* ... */ }}>{getDisplayText()}</div>
                                )}

                                {/* Post Media */}
                                {mediaPreviewUrl && (
                                    <div style={{ width: '100%', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
                                        {mediaType === 'image' ? (
                                            <img src={mediaPreviewUrl} alt="Post content" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '400px', objectFit: 'contain' }} />
                                        ) : (
                                            <video src={mediaPreviewUrl} controls style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '400px', objectFit: 'contain' }} />
                                        )}
                                    </div>
                                )}

                                {/* Placeholder */}
                                {!(getDisplayText()) && !mediaPreviewUrl && (
                                    <div style={{ padding: '40px 20px', textAlign: 'center', /* ... */ }}>
                                        Your {getPreviewPlatform()} post preview will appear here
                                    </div>
                                )}

                                {/* Engagement Buttons (Static Preview) */}
                                <div style={{ borderTop: '1px solid #e4e6ea', padding: '20px 32px' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', /* ... */ }}>
                                        {/* Like Button */}
                                        <div style={{ display: 'flex', /* ... */ }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f2f2f2'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                            <img src="/icons/like.svg" alt="Like" style={{ width: '22px', height: '22px' }} onError={(e) => e.target.style.display = 'none'} />
                                            <span style={{ fontSize: '15px', /* ... */ }}>Like</span>
                                        </div>
                                        {/* Comment Button */}
                                        <div style={{ display: 'flex', /* ... */ }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f2f2f2'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                            <img src="/icons/comment.svg" alt="Comment" style={{ width: '22px', height: '22px' }} onError={(e) => e.target.style.display = 'none'} />
                                            <span style={{ fontSize: '15px', /* ... */ }}>Comment</span>
                                        </div>
                                        {/* Share Button */}
                                        <div style={{ display: 'flex', /* ... */ }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f2f2f2'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                            <img src="/icons/share.svg" alt="Share" style={{ width: '22px', height: '22px' }} onError={(e) => e.target.style.display = 'none'} />
                                            <span style={{ fontSize: '15px', /* ... */ }}>Share</span>
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