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
import axiosInstance from './api/axios'; // Make sure this is imported

const CreatePost = ({ token, user, apiSource, onNavigate, onCalendarEventCreate }) => {
    // --- Existing State Variables ---
    const [showPlatforms, setShowPlatforms] = useState(false);
    const [selectedPlatforms, setSelectedPlatforms] = useState(['Facebook']); // Default Facebook selected
    const [postText, setPostText] = useState('');
    const [selectedMedia, setSelectedMedia] = useState(null); // Changed: Stores File object now
    const [mediaType, setMediaType] = useState(null);
    const [altText, setAltText] = useState('');
    const [isScheduled, setIsScheduled] = useState(false);
    const [setDateTimeEnabled, setSetDateTimeEnabled] = useState(true); // For the "Set date and time" toggle
    const [scheduleDate, setScheduleDate] = useState(() => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    });
    const [scheduleTime, setScheduleTime] = useState(() => {
        const now = new Date();
        return now.toTimeString().slice(0, 5);
    });
    const [collaborator, setCollaborator] = useState('');
    const [showCollaboratorDropdown, setShowCollaboratorDropdown] = useState(false);
    const [collaboratorSuggestions] = useState([
        { name: 'Dr. Sarah Johnson', role: 'Professor of Computer Science', avatar: 'SJ' },
        { name: 'Mike Chen', role: 'Graduate Student', avatar: 'MC' },
        { name: 'Emily Rodriguez', role: 'Research Assistant', avatar: 'ER' },
        { name: 'David Kim', role: 'Department Head', avatar: 'DK' },
        { name: 'Lisa Thompson', role: 'Lab Coordinator', avatar: 'LT' },
        { name: 'Alex Martinez', role: 'PhD Candidate', avatar: 'AM' },
        { name: 'Rachel Green', role: 'Teaching Assistant', avatar: 'RG' },
        { name: 'James Wilson', role: 'Industry Partner', avatar: 'JW' }
    ]);
    // const [showAdBanner, setShowAdBanner] = useState(true); // Ad Banner logic not shown in UI, can likely be removed if not used
    const [showStoryNotification, setShowStoryNotification] = useState(true);
    const [shareToStory, setShareToStory] = useState(false);
    const [activeTimesApplied, setActiveTimesApplied] = useState(false);
    const [calendarEventsCreated, setCalendarEventsCreated] = useState(false);
    
    // Platform-specific scheduling
    const [platformSchedules, setPlatformSchedules] = useState({
        Facebook: { date: '', time: '' },
        Instagram: { date: '', time: '' },
        LinkedIn: { date: '', time: '' },
        X: { date: '', time: '' }
    });
    
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

    // --- Added State Variables for Posting ---
    const [isPosting, setIsPosting] = useState(false);
    const [postError, setPostError] = useState('');
    const [postSuccess, setPostSuccess] = useState('');
    // --- End Added State Variables ---

    // --- Refs ---
    const fileInputRef = useRef(null);
    const videoInputRef = useRef(null);
    const platformDropdownRef = useRef(null);
    const previewDropdownRef = useRef(null);
    const collaboratorDropdownRef = useRef(null);

    // --- useEffect Hooks (No changes needed here from your version) ---
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (previewDropdownRef.current && !previewDropdownRef.current.contains(event.target)) {
                setShowPreviewDropdown(false);
            }
            // Fix for platform dropdown closing
            if (platformDropdownRef.current && !platformDropdownRef.current.contains(event.target)) {
                // Check if the click target is the header itself before closing
                const header = document.querySelector(".platform-dropdown-header"); // Use a more specific selector if needed
                if (header && !header.contains(event.target)) {
                    setShowPlatforms(false);
                }
            }
            // Handle collaborator dropdown
            if (collaboratorDropdownRef.current && !collaboratorDropdownRef.current.contains(event.target)) {
                setShowCollaboratorDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []); // Removed platformDropdownRef from dependency array

    useEffect(() => {
        // Auto-select first platform if active tab is removed or customize is off
        if (customizeEnabled && selectedPlatforms.length > 0 && !selectedPlatforms.includes(activeTab)) {
            setActiveTab(selectedPlatforms[0]);
        }
        // Ensure preview defaults correctly
        if (!selectedPlatforms.includes(previewPlatform) && selectedPlatforms.length > 0) {
            setPreviewPlatform(selectedPlatforms[0]);
        } else if (selectedPlatforms.length === 0) {
            setPreviewPlatform('Facebook');
        }
    }, [selectedPlatforms, activeTab, customizeEnabled, previewPlatform]);


    // --- Event Handlers (Platform Toggle, Text Change) ---
    const handlePlatformToggle = (platform) => {
        setSelectedPlatforms(prev => {
            return prev.includes(platform)
                ? prev.filter(p => p !== platform)
                : [...prev, platform];
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
            // Sync all platform texts when customize is off
            setPlatformTexts({ Facebook: value, Instagram: value, LinkedIn: value, X: value });
        }
    };

    // Platform-specific scheduling function
    const updatePlatformSchedule = (platform, field, value) => {
        console.log(`Manually updating ${platform} ${field} to:`, value);
        setPlatformSchedules(prev => {
            const updated = {
                ...prev,
                [platform]: {
                    ...prev[platform],
                    [field]: value
                }
            };
            console.log('Updated platform schedules:', updated);
            return updated;
        });
    };

    // Active times function - applies optimal posting times for each platform
    const applyActiveTimes = () => {
        console.log('Applying active times for optimal posting...');
        
        // Optimal posting times based on platform research
        const optimalTimes = {
            Facebook: { time: '15:00', label: '3:00 PM' }, // 3 PM - peak engagement time
            Instagram: { time: '17:00', label: '5:00 PM' }, // 5 PM - highest activity
            LinkedIn: { time: '08:00', label: '8:00 AM' }, // 8 AM - business hours start
            X: { time: '12:00', label: '12:00 PM' } // 12 PM - lunch break peak
        };

        // Use current date as default (or tomorrow if current time is past optimal times)
        const now = new Date();
        const currentHour = now.getHours();
        
        // If it's late in the day (after 6 PM), suggest tomorrow, otherwise suggest today
        const suggestedDate = currentHour >= 18 ? 
            new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0] :
            now.toISOString().split('T')[0];

        // Apply optimal times ONLY to platforms that don't have times set yet
        const updatedSchedules = {};
        selectedPlatforms.forEach(platform => {
            const currentSchedule = platformSchedules[platform];
            const hasExistingTime = currentSchedule?.time && currentSchedule.time !== '';
            const hasExistingDate = currentSchedule?.date && currentSchedule.date !== '';
            
            updatedSchedules[platform] = {
                // Keep existing date if user has set one, otherwise use suggested date
                date: hasExistingDate ? currentSchedule.date : suggestedDate,
                // Keep existing time if user has set one, otherwise use optimal time
                time: hasExistingTime ? currentSchedule.time : (optimalTimes[platform]?.time || '10:00')
            };
        });

        setPlatformSchedules(prev => ({
            ...prev,
            ...updatedSchedules
        }));

        // Show feedback
        setActiveTimesApplied(true);
        setTimeout(() => setActiveTimesApplied(false), 4000); // Hide after 4 seconds
        
        console.log('Active times applied:', updatedSchedules);
    };

    // Collaborator functions
    const handleCollaboratorFocus = () => {
        setShowCollaboratorDropdown(true);
    };

    const handleCollaboratorChange = (value) => {
        setCollaborator(value);
        setShowCollaboratorDropdown(value.length === 0 || getFilteredCollaborators(value).length > 0);
    };

    const selectCollaborator = (suggestion) => {
        setCollaborator(suggestion.name);
        setShowCollaboratorDropdown(false);
    };

    const getFilteredCollaborators = (searchTerm) => {
        if (!searchTerm.trim()) return collaboratorSuggestions;
        return collaboratorSuggestions.filter(suggestion => 
            suggestion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            suggestion.role.toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    // Function to create calendar events for posts
    const createCalendarEvents = (publishedPlatforms) => {
        const events = [];
        
        publishedPlatforms.forEach(platform => {
            const platformText = customizeEnabled && platformTexts[platform]?.trim() 
                ? platformTexts[platform] 
                : postText;
            
            // Determine event date and time
            let eventDate, eventTime;
            if (isScheduled && setDateTimeEnabled && platformSchedules[platform]?.date && platformSchedules[platform]?.time) {
                // Use scheduled time
                eventDate = platformSchedules[platform].date;
                eventTime = platformSchedules[platform].time;
            } else {
                // Use current time for immediate posts
                const now = new Date();
                eventDate = now.toISOString().split('T')[0];
                eventTime = now.toTimeString().slice(0, 5);
            }
            
            // Create event object
            const event = {
                id: `post-${platform}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                title: `${platform} Post Published`,
                start: `${eventDate}T${eventTime}`,
                description: platformText ? `"${platformText.substring(0, 100)}${platformText.length > 100 ? '...' : ''}"` : 'Social media post',
                platform: platform,
                collaborator: collaborator || null,
                hasMedia: !!selectedMedia,
                mediaType: mediaType,
                allDay: false,
                backgroundColor: getPlatformColor(platform),
                borderColor: getPlatformColor(platform),
                textColor: '#ffffff'
            };
            
            events.push(event);
        });
        
        // Store events in localStorage (in a real app, this would be sent to a backend)
        const existingEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
        const updatedEvents = [...existingEvents, ...events];
        localStorage.setItem('calendarEvents', JSON.stringify(updatedEvents));
        
        // Call callback if provided (to update parent component's calendar)
        if (onCalendarEventCreate && typeof onCalendarEventCreate === 'function') {
            onCalendarEventCreate(events);
        }

        // Dispatch custom event to notify Calendar component to refresh
        window.dispatchEvent(new CustomEvent('calendarEventsUpdated'));
        
        console.log('Calendar events created:', events);
        
        // Debug: Check what's in localStorage after storing
        const allStoredEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
        console.log('All events now in localStorage:', allStoredEvents);
        
        return events;
    };

    // Get platform-specific colors for calendar events
    const getPlatformColor = (platform) => {
        switch (platform) {
            case 'Facebook': return '#1877f2';
            case 'Instagram': return '#e4405f';
            case 'LinkedIn': return '#0077b5';
            case 'X': return '#1da1f2';
            default: return '#65676b';
        }
    };

    // Utility function to retrieve all calendar events (can be used by Calendar component)
    const getCalendarEvents = () => {
        return JSON.parse(localStorage.getItem('calendarEvents') || '[]');
    };

    // Export this function for use in other components
    CreatePost.getCalendarEvents = getCalendarEvents;

    // --- Media Handling Functions ---
    const handleMediaUpload = (event, type) => {
        const file = event.target.files[0];
        if (file) {
            setSelectedMedia(file); // Store the File object
            setMediaType(type);
            // Clear the other input ref value
            if (type === 'image' && videoInputRef.current) videoInputRef.current.value = '';
            if (type === 'video' && fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const removeMedia = () => {
        setSelectedMedia(null);
        setMediaType(null);
        if (fileInputRef.current) fileInputRef.current.value = '';
        if (videoInputRef.current) videoInputRef.current.value = '';
    };

    // Helper to get media URL for preview
    const getMediaPreviewUrl = () => {
        if (!selectedMedia) return null;
        if (selectedMedia instanceof File) {
            return URL.createObjectURL(selectedMedia);
        }
        return selectedMedia; // Assume it might already be a URL (e.g., from a draft)
    };
    const mediaPreviewUrl = getMediaPreviewUrl(); // Generate preview URL

    // --- Helper Functions (getDisplayText, getPreviewPlatform, etc. - No changes needed) ---
    const getDisplayText = () => {
        const platformToPreview = getPreviewPlatform();
        if (customizeEnabled) {
            return platformTexts[platformToPreview] || '';
        }
        return postText;
    };


    const getPreviewPlatform = () => {
        if (selectedPlatforms.length === 0) return 'Facebook';
        if (selectedPlatforms.includes(previewPlatform)) return previewPlatform;
        return selectedPlatforms[0];
    };

    // Get scheduled time for preview platform
    const getPreviewScheduledTime = () => {
        const platform = getPreviewPlatform();
        const platformSchedule = platformSchedules[platform];
        
        if (isScheduled && setDateTimeEnabled && platformSchedule?.date && platformSchedule?.time) {
            const scheduledDateTime = new Date(platformSchedule.date + 'T' + platformSchedule.time);
            const now = new Date();
            
            // Format the date and time
            const dateOptions = { 
                weekday: 'short',
                month: 'short', 
                day: 'numeric',
                year: scheduledDateTime.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
            };
            const timeOptions = { 
                hour: 'numeric', 
                minute: '2-digit',
                hour12: true 
            };
            
            const formattedDate = scheduledDateTime.toLocaleDateString('en-US', dateOptions);
            const formattedTime = scheduledDateTime.toLocaleTimeString('en-US', timeOptions);
            
            return `Scheduled for ${formattedDate} at ${formattedTime}`;
        } else if (isScheduled) {
            return 'Scheduled post';
        }
        
        return 'Just now';
    };

    const getPlatformName = (platform) => { /* ... No changes needed ... */
        switch (platform) {
            case 'Facebook': return 'Computer Science and Engineering';
            case 'Instagram': return 'cse_uta';
            case 'LinkedIn': return 'Computer Science and Engineering';
            case 'X': return '@cse_uta';
            default: return 'Computer Science and Engineering';
        }
    };
    const getPlatformPreviewStyle = (platform) => { /* ... No changes needed ... */
        const baseStyle = {
            border: '1px solid #e4e6ea', borderRadius: '12px', overflow: 'hidden',
            backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
            width: '100%', minHeight: '300px'
        };
        // Specific styles can be added here if needed
        return baseStyle;
    };
    const getPlatformHeaderStyle = (platform) => { /* ... No changes needed ... */
        return {
            padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px',
            minHeight: '88px', backgroundColor: 'white', borderBottom: '1px solid #e4e6ea'
        };
    };
    const getPlatformIcon = (platform) => { /* ... No changes needed ... */
        const iconStyle = { width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };
        switch (platform) {
            case 'Facebook': return <img src="/icons/facebook.svg" alt="Facebook" style={iconStyle} className="platform-icon facebook" onError={(e) => e.target.style.display = 'none'} />;
            case 'Instagram': return <img src="/icons/instagram.svg" alt="Instagram" style={iconStyle} className="platform-icon instagram" onError={(e) => e.target.style.display = 'none'} />;
            case 'LinkedIn': return <img src="/icons/linkedin.svg" alt="LinkedIn" style={iconStyle} className="platform-icon linkedin" onError={(e) => e.target.style.display = 'none'} />;
            case 'X': case 'Twitter': return <img src="/icons/x.svg" alt="X (Twitter)" style={iconStyle} className="platform-icon x" onError={(e) => e.target.style.display = 'none'} />;
            default: return <span style={iconStyle}>?</span>;
        }
    };

    const handlePublish = async () => {
        if (selectedPlatforms.length === 0) {
            setPostError('Please select at least one platform to post to.');
            return;
        }

        setIsPosting(true);
        setPostError('');
        setPostSuccess('');
        let successMessages = [];
        let errorMessages = [];

        const getTextForPlatform = (platform) => {
            if (customizeEnabled && platformTexts[platform]?.trim()) {
                return platformTexts[platform];
            }
            return postText; // Fallback to common text
        };

        // Check overall content
        const hasContent = selectedMedia || selectedPlatforms.some(p => getTextForPlatform(p)?.trim());
        if (!hasContent) {
            setPostError('Please add text or media to your post.');
            setIsPosting(false);
            return;
        }

        for (const platform of selectedPlatforms) {
            const platformText = getTextForPlatform(platform);

            if (!platformText?.trim() && !selectedMedia) {
                continue; // Skip if no content for this platform
            }

            if (platform === 'Facebook') {
                try {
                    if(selectedMedia) {
                        console.log(`Attempting Facebook photo with caption: "${platformText}"`);
                        const formData = new FormData();
                        formData.append('caption', platformText);
                        formData.append('media', selectedMedia);

                        const response = await axiosInstance.post('/api/facebook/photos', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });
                        if (response.status === 201) {
                            successMessages.push(`Successfully posted to Facebook!`);
                        } else {
                            errorMessages.push(`Facebook: Unexpected response status ${response.status}`);
                        }

                    } else {
                        console.log(`Attempting Facebook TEXT post: "${platformText}"`);
                        const response = await axiosInstance.post('/api/facebook/feed', {
                            message: platformText
                        });
                        if (response.status === 201) {
                            successMessages.push(`Successfully text to Facebook!`);
                        } else {
                            errorMessages.push(`Facebook: Unexpected response status ${response.status}`);
                        }
                    }
                } catch (err) {
                    console.error("Facebook post error:", err.response?.data || err.message);
                    errorMessages.push(`Facebook: ${err.response?.data?.error?.message || err.message}`);
                }

            } else if (platform === 'Instagram') {
                if (!selectedMedia) {
                    errorMessages.push('Instagram: Posts require media.'); // Instagram needs media
                } else {
                    try {
                        console.log(`Attempting Instagram post with caption: "${platformText}"`);
                        const formData = new FormData();
                        formData.append('caption', platformText);
                        formData.append('media', selectedMedia);

                        // You'll need to create this new endpoint in your server.js
                        const response = await axiosInstance.post('/api/instagram/post', formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });

                        if (response.status === 201) {
                            successMessages.push(`Successfully posted to Instagram!`);
                        } else {
                            errorMessages.push(`Instagram: Unexpected response status ${response.status}`);
                        }
                    } catch (err) {
                        console.error("Instagram post error:", err.response?.data || err.message);
                        errorMessages.push(`Instagram: ${err.response?.data?.error?.message || err.message}`);
                    }
                }
            }
            // Add other platforms here...
            // else if (platform === 'LinkedIn') { errorMessages.push('LinkedIn: Posting not implemented yet.'); }
            // else if (platform === 'X') { errorMessages.push('X: Posting not implemented yet.'); }
        }

        // Set feedback messages
        if (successMessages.length > 0) { 
            setPostSuccess(successMessages.join(' | ')); 
        }
        if (errorMessages.length > 0) { setPostError(errorMessages.join(' | '));}

        // Create calendar events - regardless of API success/failure
        // In production, this would only be done for successfully published posts
        if (selectedPlatforms.length > 0) {
            // Create events for all selected platforms
            const createdEvents = createCalendarEvents(selectedPlatforms);
            console.log(`Created ${createdEvents.length} calendar events for selected platforms`);
            
            // Show calendar events created feedback
            setCalendarEventsCreated(true);
            setTimeout(() => setCalendarEventsCreated(false), 4000);
        }

        // Clear fields only if everything was successful
        if (errorMessages.length === 0 && successMessages.length > 0) {
            setPostText('');
            setPlatformTexts({ Facebook: '', Instagram: '', LinkedIn: '', X: '' });
            removeMedia();
            setCollaborator('');
            setShareToStory(false);
            // Reset scheduling if it was used
            if (isScheduled) {
                setIsScheduled(false);
                setSetDateTimeEnabled(true);
                setPlatformSchedules({
                    Facebook: { date: '', time: '' },
                    Instagram: { date: '', time: '' },
                    LinkedIn: { date: '', time: '' },
                    X: { date: '', time: '' }
                });
            }
        }

        setIsPosting(false);
    };
    // --- *** End handlePublish Function *** ---

    const handleSaveDraft = () => {
        // Placeholder for Save Draft logic
        console.log('Save draft clicked');
    };

    const handleSchedule = () => {
        // Toggle scheduling and initialize platform schedules with default values
        const newScheduledState = !isScheduled;
        setIsScheduled(newScheduledState);
        
        if (newScheduledState) {
            // Initialize all platform schedules with default date and time
            const defaultDate = '2025-08-01';
            const defaultTime = '10:00';
            const initialSchedules = {};
            
            selectedPlatforms.forEach(platform => {
                initialSchedules[platform] = {
                    date: defaultDate,
                    time: defaultTime
                };
            });
            
            setPlatformSchedules(prev => ({
                ...prev,
                ...initialSchedules
            }));
        }
    };

    // --- JSX Return ---
    return (
        <div className="create-post-container"> {/* This is likely defined in CreatePost.css */}
            <div className="main-content"> {/* This is likely defined in CreatePost.css */}
                {/* --- Left Panel --- */}
                <div className="left-panel"> {/* Use class from CreatePost.css */}
                    <div className="form-content"> {/* Use class from CreatePost.css */}

                        {/* Post To Section */}
                        <div className="form-section">
                            <label className="section-label">Post to</label>
                            <div ref={platformDropdownRef}>
                                <div
                                    className="platform-dropdown-header" onClick={() => setShowPlatforms(!showPlatforms)}
                                    role="button"
                                    aria-expanded={showPlatforms}
                                    tabIndex={0}
                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowPlatforms(!showPlatforms); } }}
                                >
                                    <div className="platform-avatar">CS</div>
                                    <span className="platform-text">
                                        {selectedPlatforms.length === 0
                                            ? "Select platforms..."
                                            : selectedPlatforms.length <= 2
                                                ? selectedPlatforms.join(' and ')
                                                : `${selectedPlatforms.length} platforms selected`}
                                    </span>
                                    <FontAwesomeIcon icon={faChevronDown} className={`dropdown-chevron ${showPlatforms ? 'rotated' : ''}`} />
                                </div>
                                {showPlatforms && (
                                    <div className="platform-dropdown-content">
                                        <div className="platform-options-list" role="group" aria-label="Platforms to post to">
                                            {['Facebook', 'Instagram', 'LinkedIn', 'X'].map((platform) => (
                                                <div key={platform}
                                                    className={`platform-option-item ${selectedPlatforms.includes(platform) ? 'selected' : ''}`}
                                                    onClick={() => handlePlatformToggle(platform)}
                                                    role="checkbox"
                                                    aria-checked={selectedPlatforms.includes(platform)}
                                                    tabIndex={0}
                                                    onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handlePlatformToggle(platform); } }}
                                                >
                                                    <input type="checkbox"
                                                        checked={selectedPlatforms.includes(platform)}
                                                        readOnly
                                                        className="platform-option-checkbox"
                                                        tabIndex={-1} />
                                                    {getPlatformIcon(platform)}
                                                    < div className="platform-option-info">
                                                        <div className="platform-option-name">{platform}</div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Media Section */}
                        <div className="form-section">
                           <label className="section-label">Media</label>
                            <p className="section-description">Share photos or a video. Instagram posts require media and can't exceed 10 photos.</p>
                            <div className="media-buttons-container">
                                <button type="button" className="media-upload-button" onClick={() => fileInputRef.current?.click()}><FontAwesomeIcon icon={faImage} className="media-icon" /><span>Add photo</span></button>
                                <button type="button" className="media-upload-button" onClick={() => videoInputRef.current?.click()}><FontAwesomeIcon icon={faVideo} className="media-icon" /><span>Add video</span></button>
                            </div>
                            <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleMediaUpload(e, 'image')} />
                            <input ref={videoInputRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={(e) => handleMediaUpload(e, 'video')} />
                            {mediaPreviewUrl && (
                                <div className="media-preview-container">
                                    {mediaType === 'image' ? (
                                    <img
                                        src={mediaPreviewUrl}
                                        alt={altText || 'Uploaded image preview'}
                                        className="media-preview-image"
                                    />
                                    ) : (
                                    <video
                                        src={mediaPreviewUrl}
                                        controls
                                        className="media-preview-video"
                                        aria-label={altText || 'Uploaded video preview'}
                                    />
                                    )}

                                    <button
                                    type="button"
                                    className="media-remove-button"
                                    onClick={removeMedia}
                                    aria-label="Remove media"
                                    >
                                    <FontAwesomeIcon icon={faTimes} />
                                    </button>

                                    {/* Alt-text input */}
                                    <input
                                    type="text"
                                    className="alt-text-input"
                                    placeholder="Alt text (accessibility)"
                                    value={altText}
                                    onChange={(e) => setAltText(e.target.value)}
                                    />
                                </div>
                                )}

                        </div>

                        {/* Post Details Section */}
                        <div className="form-section"> {/* Use form-section for consistent spacing */}
                            <label className="section-label">Post details</label> {/* Use section-label */}
                            <div className="customize-section"> {/* Use customize-section for layout */}
                                <label htmlFor="customizeToggle" className="customize-toggle-text">Customize post for each platform</label>
                                <div className="customize-toggle-container">
                                    <button
                                        type="button"
                                        id="customizeToggle"
                                        role="switch"
                                        aria-checked={customizeEnabled}
                                        onClick={() => setCustomizeEnabled(!customizeEnabled)}
                                        className={`story-toggle ${customizeEnabled ? 'active' : 'inactive'}`} // Use story-toggle styles
                                    >
                                        <span className={`story-toggle-slider ${customizeEnabled ? 'active' : 'inactive'}`}></span>
                                    </button>
                                    {customizeEnabled && <span className="toggle-indicator"></span>}
                                </div>
                            </div>
                            {customizeEnabled && selectedPlatforms.length > 0 && (
                                <div className="platform-tabs-container">
                                    {selectedPlatforms.map((platform) => (
                                        <button
                                            key={platform}
                                            type="button"
                                            className={`platform-tab ${activeTab === platform ? 'active' : ''}`}
                                            onClick={() => setActiveTab(platform)}
                                            role="tab" aria-selected={activeTab === platform}
                                            tabIndex={0}
                                            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTab(platform); }}
                                        >
                                            {getPlatformIcon(platform)}
                                            <span>{platform}</span>
                                        </button>
                                    ))}
                                </div>
                            )}
                            <label className="text-input-label">{customizeEnabled ? `${activeTab} text` : 'Post text'}</label>
                            <div className="text-input-container">
                                <textarea
                                    className="post-textarea"
                                    placeholder={customizeEnabled ? `Write your ${activeTab} post...` : 'Write your post...'}
                                    value={getCurrentText()}
                                    onChange={(e) => handleTextChange(e.target.value)}
                                />
                                <div className="text-tools">
                                    <button className="text-tool">😊</button> {/* Example: Emoji */}
                                    <button className="text-tool">#</button> {/* Example: Hashtag */}
                                    <button className="text-tool">@</button> {/* Example: Mention */}
                                </div>
                            </div>
                        </div>

                        {/* Scheduling Options */}
                        {isScheduled && ( // Conditionally render schedule options
                           <div className="schedule-section form-section">
                             <div className="schedule-header">
                               <label className="section-label">Scheduling options</label>
                               <div className="schedule-toggle">
                                 <span>Set date and time</span>
                                 <label className="schedule-toggle-switch">
                                   <input 
                                     type="checkbox" 
                                     checked={setDateTimeEnabled} 
                                     onChange={(e) => {
                                       console.log('Schedule toggle clicked:', e.target.checked);
                                       setSetDateTimeEnabled(e.target.checked);
                                     }}
                                   />
                                   <span className="schedule-slider"></span>
                                 </label>
                               </div>
                             </div>
                             <p className="schedule-description">
                               Schedule your post for the times when your audience is most active, or manually select a date and time in the future to publish your post.
                             </p>
                             
                             {setDateTimeEnabled && (
                               <div className="schedule-platform-group">
                                 {selectedPlatforms.map(platform => (
                                   <div key={platform} className="platform-schedule">
                                     <div className="platform-info">
                                       {getPlatformIcon(platform)}
                                       <span className="platform-name">{platform}</span>
                                     </div>
                                     <div className="schedule-inputs">
                                       <input
                                         type="date"
                                         className="schedule-date"
                                         value={platformSchedules[platform].date || '2025-08-01'}
                                         onChange={(e) => updatePlatformSchedule(platform, 'date', e.target.value)}
                                         min={new Date().toISOString().split('T')[0]}
                                       />
                                       <input
                                         type="time"
                                         className="schedule-time"
                                         value={platformSchedules[platform].time || '10:00'}
                                         onChange={(e) => updatePlatformSchedule(platform, 'time', e.target.value)}
                                       />
                                     </div>
                                   </div>
                                 ))}
                                 <button type="button" className="active-times-button" onClick={applyActiveTimes}>
                                   <span className="active-times-icon"></span> Active times
                                 </button>
                                 {activeTimesApplied && (
                                   <div className="active-times-notification">
                                     ✅ Optimal times applied to platforms without custom times set!
                                   </div>
                                 )}
                               </div>
                             )}
                           </div>
                        )}

                        {/* Collaborator Section */}
                        <div className="collaborator-section form-section">
                          <div className="collaborator-header">
                            <label className="section-label">
                              Collaborator 
                              <FontAwesomeIcon icon={faInfoCircle} className="info-icon" />
                            </label>
                          </div>
                          <p className="collaborator-description">
                            Add a collaborator to your Facebook post and they will automatically be invited.
                          </p>
                          <div className="collaborator-input-container" ref={collaboratorDropdownRef}>
                            <input
                              type="text"
                              className="collaborator-input"
                              placeholder="Add a collaborator by name or URL"
                              value={collaborator}
                              onChange={(e) => handleCollaboratorChange(e.target.value)}
                              onFocus={handleCollaboratorFocus}
                            />
                            {showCollaboratorDropdown && (
                              <div className="collaborator-dropdown">
                                <div className="collaborator-dropdown-header">
                                  <span>Suggested collaborators</span>
                                </div>
                                <div className="collaborator-suggestions">
                                  {getFilteredCollaborators(collaborator).map((suggestion, index) => (
                                    <div
                                      key={index}
                                      className="collaborator-suggestion-item"
                                      onClick={() => selectCollaborator(suggestion)}
                                    >
                                      <div className="collaborator-avatar">{suggestion.avatar}</div>
                                      <div className="collaborator-info">
                                        <div className="collaborator-name">{suggestion.name}</div>
                                        <div className="collaborator-role">{suggestion.role}</div>
                                      </div>
                                    </div>
                                  ))}
                                  {getFilteredCollaborators(collaborator).length === 0 && collaborator.trim() && (
                                    <div className="no-collaborators-found">
                                      No collaborators found matching "{collaborator}"
                                    </div>
                                  )}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Share to Story Section */}
                        <div className="story-section form-section">
                          <div className="story-header">
                            <label className="section-label">Share to your story</label>
                            <label className="story-toggle-switch">
                              <input 
                                type="checkbox" 
                                checked={shareToStory}
                                onChange={(e) => {
                                  console.log('Story toggle clicked:', e.target.checked);
                                  setShareToStory(e.target.checked);
                                }}
                              />
                              <span className="story-slider"></span>
                            </label>
                          </div>
                          <p className="story-description">
                            This is for Facebook only. Your story privacy is set to Public. Anyone on Facebook can see your story.
                          </p>
                          {shareToStory && showStoryNotification && (
                            <div className="story-notification">
                              <FontAwesomeIcon icon={faInfoCircle} />
                              <span>You can now share your post to your story!</span>
                              <button 
                                className="close-notification"
                                onClick={() => setShowStoryNotification(false)}
                              >
                                ×
                              </button>
                              <p>Drive traffic to your post and keep your audience up-to-date on your new content.</p>
                            </div>
                          )}
                        </div>

                        {/* --- Feedback Display Area --- */}
                        <div style={{ marginTop: '15px', minHeight: '20px', textAlign: 'center' }}>
                            {postError && <div style={{ color: '#dc2626', background: '#fee2e2', padding: '8px 12px', borderRadius: '6px', display: 'inline-block', fontSize: '14px' }}>{postError}</div>}
                            {postSuccess && <div style={{ color: '#16a34a', background: '#dcfce7', padding: '8px 12px', borderRadius: '6px', display: 'inline-block', fontSize: '14px' }}>{postSuccess}</div>}
                            {calendarEventsCreated && (
                                <div style={{ color: '#1877f2', background: '#e3f2fd', padding: '8px 12px', borderRadius: '6px', display: 'inline-block', fontSize: '14px', marginTop: '8px' }}>
                                    📅 Calendar events created for your published posts!
                                </div>
                            )}
                        </div>
                        {/* --- End Feedback Display Area --- */}

                        {/* Action Buttons Container - Moved to Bottom */}
                        <div className="action-buttons-container">
                            <button
                                className="publish-button"
                                onClick={handlePublish}
                                disabled={isPosting || selectedPlatforms.length === 0}
                            >
                                {isPosting ? 'Publishing...' : 'Publish Post'}
                            </button>
                            <div className="secondary-buttons-group">
                                <button className="save-draft-button" onClick={handleSaveDraft}>
                                    Save Draft
                                </button>
                                <button className="schedule-post-button" onClick={handleSchedule}>
                                    Schedule Post
                                </button>
                            </div>
                        </div>

                    </div> {/* End form-content */}
                </div> {/* End left-panel */}

                {/* --- Right Panel (Preview) --- */}
                <div className="right-panel"> {/* Use class from CreatePost.css */}
                    <div className="preview-panel"> {/* Use class from CreatePost.css */}
                         <div className="preview-header">
                             <div className="preview-brand">
                                 {getPlatformIcon(getPreviewPlatform())}
                                 <span className="preview-brand-text">Preview</span>
                                 {isScheduled && setDateTimeEnabled && (
                                     <span className="preview-schedule-badge">🕒 Scheduled</span>
                                 )}
                             </div>
                             {/* Preview Platform Selector Dropdown */}
                             {selectedPlatforms.length > 1 && (
                                 <div className="preview-dropdown" ref={previewDropdownRef}>
                                     <button type="button" className="preview-dropdown-button" onClick={() => setShowPreviewDropdown(!showPreviewDropdown)}>
                                         {getPlatformIcon(getPreviewPlatform())}
                                         <span>{getPreviewPlatform()}</span>
                                         <FontAwesomeIcon icon={faChevronDown} className={`preview-dropdown-arrow ${showPreviewDropdown ? 'rotated' : ''}`} />
                                     </button>
                                     {showPreviewDropdown && (
                                         <div className="preview-dropdown-menu">
                                             {selectedPlatforms.map((platform) => (
                                                 <div key={platform}
                                                      className={`preview-dropdown-item ${platform === getPreviewPlatform() ? 'selected' : ''}`}
                                                      onClick={() => { setPreviewPlatform(platform); setShowPreviewDropdown(false); }}>
                                                     {getPlatformIcon(platform)}
                                                     <span>{platform}</span>
                                                 </div>
                                             ))}
                                         </div>
                                     )}
                                 </div>
                             )}
                         </div>

                         <div className="preview-content"> {/* Ensure this allows scrolling */}
                             <div className="preview-post"> {/* Apply post styling */}
                                 {/* Post Header */}
                                 <div className="preview-post-header">
                                     <div className="preview-profile">
                                         <div className={`preview-avatar ${getPreviewPlatform().toLowerCase()}`}>CS</div>
                                         <div className="preview-profile-info">
                                             <div className="preview-profile-name">{getPlatformName(getPreviewPlatform())}</div>
                                             <div className="preview-post-time">
                                                 <FontAwesomeIcon icon={faClock} />
                                                 <span>{getPreviewScheduledTime()}</span>
                                                 <span>·</span>
                                                 <FontAwesomeIcon icon={faGlobe} />
                                             </div>
                                         </div>
                                     </div>
                                 </div>

                                 {/* Post Text */}
                                 {(getDisplayText()) && (
                                     <div className="preview-post-text">
                                         {getDisplayText()}
                                     </div>
                                 )}

                                 {/* Post Media */}
                                 {mediaPreviewUrl && (
                                     <div className="preview-media-container">
                                         {mediaType === 'image' ? (
                                             <img src={mediaPreviewUrl} alt="Post content" className="preview-media" />
                                         ) : (
                                             <video src={mediaPreviewUrl} controls className="preview-media" />
                                         )}
                                     </div>
                                 )}

                                 {/* Placeholder if no content */}
                                 {!(getDisplayText()) && !mediaPreviewUrl && (
                                     <div className="preview-placeholder">
                                         Your {getPreviewPlatform()} post preview will appear here
                                     </div>
                                 )}

                                 {/* Engagement Actions (Static) */}
                                 <div className="preview-engagement">
                                     <div className="preview-actions">
                                         <button type="button" className="preview-action-button">
                                             <img src="/icons/like.svg" alt="Like" className="preview-action-icon" onError={(e) => e.target.style.display = 'none'} />
                                             <span className="preview-action-text">Like</span>
                                         </button>
                                         <button type="button" className="preview-action-button">
                                             <img src="/icons/comment.svg" alt="Comment" className="preview-action-icon" onError={(e) => e.target.style.display = 'none'} />
                                             <span className="preview-action-text">Comment</span>
                                         </button>
                                         <button type="button" className="preview-action-button">
                                             <img src="/icons/share.svg" alt="Share" className="preview-action-icon" onError={(e) => e.target.style.display = 'none'} />
                                             <span className="preview-action-text">Share</span>
                                         </button>
                                     </div>
                                 </div>
                             </div>
                         </div>
                    </div> {/* End preview-panel */}
                 </div> {/* End right-panel */}
            </div> {/* End main-content */}
        </div > // End create-post-container
    );
};

export default CreatePost;

