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
                                    {mediaType === 'image' ? <img src={mediaPreviewUrl} alt="Preview" className="media-preview-image" /> : <video src={mediaPreviewUrl} controls className="media-preview-video" />}
                                    <button type="button" className="media-remove-button" onClick={removeMedia}><FontAwesomeIcon icon={faTimes} /></button>
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

// // import React, { useState, useRef, useEffect } from 'react';
// // import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// // import {
// //     faChevronDown,
// //     faImage,
// //     faVideo,
// //     faTimes,
// //     faInfoCircle,
// //     faGlobe,
// //     faClock
// // } from '@fortawesome/free-solid-svg-icons';
// // import './CreatePost.css';

// // import axiosInstance from './api/axios';

// // const CreatePost = ({ token, user, apiSource, onNavigate }) => {
// //     const [showPlatforms, setShowPlatforms] = useState(false);
// //     const [selectedPlatforms, setSelectedPlatforms] = useState(['Facebook', 'Instagram', 'LinkedIn']);
// //     const [postText, setPostText] = useState('');
// //     const [selectedMedia, setSelectedMedia] = useState(null);
// //     const [mediaType, setMediaType] = useState(null);
// //     const [isScheduled, setIsScheduled] = useState(false);
// //     const [scheduleDate, setScheduleDate] = useState(() => {
// //         const today = new Date();
// //         return today.toISOString().split('T')[0];
// //     });
// //     const [scheduleTime, setScheduleTime] = useState(() => {
// //         const now = new Date();
// //         return now.toTimeString().slice(0, 5);
// //     });
// //     const [collaborator, setCollaborator] = useState('');
// //     const [showAdBanner, setShowAdBanner] = useState(true);
// //     const [showStoryNotification, setShowStoryNotification] = useState(true);
// //     const [shareToStory, setShareToStory] = useState(false);
// //     const [activeTab, setActiveTab] = useState('Facebook');
// //     const [customizeEnabled, setCustomizeEnabled] = useState(true);
// //     const [platformTexts, setPlatformTexts] = useState({
// //         Facebook: '',
// //         Instagram: '',
// //         LinkedIn: '',
// //         X: ''
// //     });
// //     const [previewPlatform, setPreviewPlatform] = useState('Facebook');
// //     const [showPreviewDropdown, setShowPreviewDropdown] = useState(false);

// //     const fileInputRef = useRef(null);
// //     const videoInputRef = useRef(null);
// //     const platformDropdownRef = useRef(null);
// //     const previewDropdownRef = useRef(null);

// //     useEffect(() => {
// //         const handleClickOutside = (event) => {
// //             if (previewDropdownRef.current && !previewDropdownRef.current.contains(event.target)) {
// //                 setShowPreviewDropdown(false);
// //             }
// //         };

// //         document.addEventListener('mousedown', handleClickOutside);
// //         return () => {
// //             document.removeEventListener('mousedown', handleClickOutside);
// //         };
// //     }, []);

// //     useEffect(() => {
// //         if (selectedPlatforms.length > 0 && !selectedPlatforms.includes(activeTab)) {
// //             setActiveTab(selectedPlatforms[0]);
// //         }
// //     }, [selectedPlatforms, activeTab]);

// //     const handlePlatformToggle = (platform) => {
// //         setSelectedPlatforms(prev => {
// //             const newPlatforms = prev.includes(platform)
// //                 ? prev.filter(p => p !== platform)
// //                 : [...prev, platform];

// //             if (newPlatforms.length > 0 && !newPlatforms.includes(activeTab)) {
// //                 setActiveTab(newPlatforms[0]);
// //             }

// //             return newPlatforms;
// //         });
// //     };

// //     const getCurrentText = () => {
// //         if (customizeEnabled) {
// //             return platformTexts[activeTab] || '';
// //         }
// //         return postText;
// //     };

// //     const handleTextChange = (value) => {
// //         if (customizeEnabled) {
// //             setPlatformTexts(prev => ({
// //                 ...prev,
// //                 [activeTab]: value
// //             }));
// //         } else {
// //             setPostText(value);
// //         }
// //     };

// //     const getDisplayText = () => {
// //         if (customizeEnabled) {
// //             return platformTexts[getPreviewPlatform()] || '';
// //         }
// //         return postText;
// //     };

// //     const getPreviewPlatform = () => {
// //         return previewPlatform && selectedPlatforms.includes(previewPlatform)
// //             ? previewPlatform
// //             : selectedPlatforms[0] || 'Facebook';
// //     };

// //     const getPlatformName = (platform) => {
// //         switch (platform) {
// //             case 'Facebook': return 'Computer Science and Engineering';
// //             case 'Instagram': return 'cse_uta';
// //             case 'LinkedIn': return 'Computer Science and Engineering';
// //             case 'X': return '@cse_uta';
// //             default: return 'Computer Science and Engineering';
// //         }
// //     };

// //     const getPlatformPreviewStyle = (platform) => {
// //         const baseStyle = {
// //             border: '1px solid #e4e6ea',
// //             borderRadius: '12px',
// //             overflow: 'hidden',
// //             backgroundColor: 'white',
// //             boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
// //             width: '100%',
// //             minHeight: '300px'
// //         };

// //         switch (platform) {
// //             case 'Instagram':
// //                 return { ...baseStyle, border: '1px solid #e4e6ea' };
// //             case 'X':
// //                 return { ...baseStyle, border: '1px solid #e4e6ea' };
// //             case 'LinkedIn':
// //                 return { ...baseStyle, border: '1px solid #e4e6ea' };
// //             default:
// //                 return baseStyle;
// //         }
// //     };

// //     const getPlatformHeaderStyle = (platform) => {
// //         const baseStyle = {
// //             padding: '16px 20px',
// //             display: 'flex',
// //             alignItems: 'center',
// //             gap: '12px',
// //             minHeight: '88px',
// //             backgroundColor: 'white'
// //         };

// //         return baseStyle;
// //     };

// //     const handleMediaUpload = (event, type) => {
// //         const file = event.target.files[0];
// //         if (file) {
// //             const url = URL.createObjectURL(file);
// //             setSelectedMedia(url);
// //             setMediaType(type);
// //         }
// //     };

// //     const removeMedia = () => {
// //         setSelectedMedia(null);
// //         setMediaType(null);
// //         if (fileInputRef.current) fileInputRef.current.value = '';
// //         if (videoInputRef.current) videoInputRef.current.value = '';
// //     };

// //     const getPlatformIcon = (platform) => {
// //         const iconStyle = {
// //             width: '20px',
// //             height: '20px',
// //             display: 'inline-flex',
// //             alignItems: 'center',
// //             justifyContent: 'center'
// //         };

// //         switch (platform) {
// //             case 'Facebook':
// //                 return (
// //                     <img
// //                         src="/icons/facebook.svg"
// //                         alt="Facebook"
// //                         style={iconStyle}
// //                         className="platform-icon facebook"
// //                     />
// //                 );
// //             case 'Instagram':
// //                 return (
// //                     <img
// //                         src="/icons/instagram.svg"
// //                         alt="Instagram"
// //                         style={iconStyle}
// //                         className="platform-icon instagram"
// //                     />
// //                 );
// //             case 'LinkedIn':
// //                 return (
// //                     <img
// //                         src="/icons/linkedin.svg"
// //                         alt="LinkedIn"
// //                         style={iconStyle}
// //                         className="platform-icon linkedin"
// //                     />
// //                 );
// //             case 'X':
// //             case 'Twitter':
// //                 return (
// //                     <img
// //                         src="/icons/x.svg"
// //                         alt="X (Twitter)"
// //                         style={iconStyle}
// //                         className="platform-icon x"
// //                     />
// //                 );
// //             default:
// //                 return null;
// //         }
// //     };

// //     return (
// //         <div className="create-post-container">
// //             <div className="main-content">
// //                 <div className="left-panel">
// //                     <div className="form-content">
// //                         <div className="form-section">
// //                             <label className="section-label">Post to</label>

// //                             <div
// //                                 ref={platformDropdownRef}
// //                                 className="platform-dropdown-header"
// //                                 onClick={() => setShowPlatforms(!showPlatforms)}
// //                             >
// //                                 <div className="platform-avatar">CS</div>
// //                                 <span className="platform-text">
// //                                     Computer Science and Engineering, UT Arlington and cse_uta
// //                                 </span>
// //                                 <FontAwesomeIcon
// //                                     icon={faChevronDown}
// //                                     className={`dropdown-chevron ${showPlatforms ? 'rotated' : ''}`}
// //                                 />
// //                             </div>

// //                             {showPlatforms && (
// //                                 <div className="platform-dropdown-content">
// //                                     <div className="platform-options-list" onClick={(e) => e.stopPropagation()}>
// //                                         {['Facebook', 'Instagram', 'LinkedIn', 'X'].map((platform) => (
// //                                             <div
// //                                                 key={platform}
// //                                                 className={`platform-option-item ${selectedPlatforms.includes(platform) ? 'selected' : ''}`}
// //                                                 onClick={(e) => {
// //                                                     e.stopPropagation();
// //                                                     handlePlatformToggle(platform);
// //                                                 }}
// //                                             >
// //                                                 <input
// //                                                     type="checkbox"
// //                                                     checked={selectedPlatforms.includes(platform)}
// //                                                     onChange={(e) => {
// //                                                         e.stopPropagation();
// //                                                         handlePlatformToggle(platform);
// //                                                     }}
// //                                                     onClick={(e) => e.stopPropagation()}
// //                                                     className="platform-option-checkbox"
// //                                                 />
// //                                                 {getPlatformIcon(platform)}
// //                                                 <div className="platform-option-info">
// //                                                     <div className="platform-option-name">{platform}</div>
// //                                                 </div>
// //                                             </div>
// //                                         ))}
// //                                     </div>
// //                                 </div>
// //                             )}
// //                         </div>

// //                         <div className="form-section">
// //                             <label className="section-label">Media</label>
// //                             <p className="section-description">
// //                                 Share photos or a video. Instagram posts can't exceed 10 photos.
// //                             </p>

// //                             <div className="media-buttons-container">
// //                                 <button className="media-upload-button" onClick={() => fileInputRef.current?.click()}>
// //                                     <FontAwesomeIcon icon={faImage} className="media-icon" />
// //                                     <span>Add photo</span>
// //                                 </button>
// //                                 <button className="media-upload-button" onClick={() => videoInputRef.current?.click()}>
// //                                     <FontAwesomeIcon icon={faVideo} className="media-icon" />
// //                                     <span>Add video</span>
// //                                     {/* <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '10px' }} /> */}
// //                                 </button>
// //                             </div>

// //                             <input
// //                                 ref={fileInputRef}
// //                                 type="file"
// //                                 accept="image/*"
// //                                 style={{ display: 'none' }}
// //                                 onChange={(e) => handleMediaUpload(e, 'image')}
// //                             />
// //                             <input
// //                                 ref={videoInputRef}
// //                                 type="file"
// //                                 accept="video/*"
// //                                 style={{ display: 'none' }}
// //                                 onChange={(e) => handleMediaUpload(e, 'video')}
// //                             />

// //                             {selectedMedia && (
// //                                 <div className="media-preview-container">
// //                                     {mediaType === 'image' ? (
// //                                         <img src={selectedMedia} alt="Preview" className="media-preview-image" />
// //                                     ) : (
// //                                         <video src={selectedMedia} controls className="media-preview-video" />
// //                                     )}
// //                                     <button className="media-remove-button" onClick={removeMedia}>
// //                                         <FontAwesomeIcon icon={faTimes} />
// //                                     </button>
// //                                 </div>
// //                             )}
// //                         </div>

// //                         <div style={{ marginBottom: '24px' }}>
// //                             <label style={{
// //                                 display: 'block',
// //                                 fontSize: '16px',
// //                                 fontWeight: '600',
// //                                 color: '#1c1e21',
// //                                 marginBottom: '12px'
// //                             }}>Post details</label>

// //                             <div style={{
// //                                 display: 'flex',
// //                                 alignItems: 'center',
// //                                 gap: '12px',
// //                                 marginBottom: '16px'
// //                             }}>
// //                                 <div style={{
// //                                     position: 'relative',
// //                                     width: '40px',
// //                                     height: '20px'
// //                                 }}>
// //                                     <input
// //                                         type="checkbox"
// //                                         checked={customizeEnabled}
// //                                         onChange={() => setCustomizeEnabled(!customizeEnabled)}
// //                                         style={{
// //                                             position: 'absolute',
// //                                             opacity: '0',
// //                                             width: '0',
// //                                             height: '0'
// //                                         }}
// //                                     />
// //                                     <span
// //                                         style={{
// //                                             position: 'absolute',
// //                                             cursor: 'pointer',
// //                                             top: '0',
// //                                             left: '0',
// //                                             right: '0',
// //                                             bottom: '0',
// //                                             background: customizeEnabled ? '#1877f2' : '#ccc',
// //                                             transition: '0.3s',
// //                                             borderRadius: '20px'
// //                                         }}
// //                                         onClick={() => setCustomizeEnabled(!customizeEnabled)}
// //                                     >
// //                                         <span style={{
// //                                             position: 'absolute',
// //                                             height: '16px',
// //                                             width: '16px',
// //                                             right: customizeEnabled ? '2px' : '22px',
// //                                             top: '2px',
// //                                             backgroundColor: 'white',
// //                                             transition: '0.3s',
// //                                             borderRadius: '50%'
// //                                         }}></span>
// //                                     </span>
// //                                 </div>
// //                                 <span style={{ fontSize: '14px', color: '#1c1e21', fontWeight: '500' }}>
// //                                     Customize post for each platform
// //                                 </span>
// //                             </div>

// //                             {customizeEnabled && (
// //                                 <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
// //                                     {selectedPlatforms.map((platform) => (
// //                                         <div
// //                                             key={platform}
// //                                             style={{
// //                                                 display: 'flex',
// //                                                 alignItems: 'center',
// //                                                 gap: '8px',
// //                                                 padding: '8px 12px',
// //                                                 backgroundColor: activeTab === platform ? '#1877f2' : 'white',
// //                                                 color: activeTab === platform ? 'white' : '#1c1e21',
// //                                                 border: activeTab === platform ? 'none' : '1px solid #ddd',
// //                                                 borderRadius: '6px',
// //                                                 fontSize: '14px',
// //                                                 fontWeight: '500',
// //                                                 cursor: 'pointer',
// //                                                 transition: 'all 0.2s ease'
// //                                             }}
// //                                             onClick={() => setActiveTab(platform)}
// //                                         >
// //                                             {getPlatformIcon(platform)}
// //                                             <span>{platform}</span>
// //                                         </div>
// //                                     ))}
// //                                 </div>
// //                             )}
// //                         </div>

// //                         <div style={{ marginBottom: '24px' }}>
// //                             <label style={{
// //                                 display: 'block',
// //                                 fontSize: '16px',
// //                                 fontWeight: '600',
// //                                 color: '#1c1e21',
// //                                 marginBottom: '8px'
// //                             }}>{customizeEnabled ? `${activeTab} text` : 'Post text'}</label>

// //                             <div style={{
// //                                 border: '1px solid #ddd',
// //                                 borderRadius: '8px',
// //                                 backgroundColor: 'white',
// //                                 overflow: 'hidden'
// //                             }}>
// //                                 <textarea
// //                                     style={{
// //                                         width: '100%',
// //                                         minHeight: '120px',
// //                                         padding: '12px',
// //                                         border: 'none',
// //                                         fontSize: '14px',
// //                                         fontFamily: 'inherit',
// //                                         resize: 'vertical',
// //                                         outline: 'none',
// //                                         boxSizing: 'border-box',
// //                                         lineHeight: '1.4'
// //                                     }}
// //                                     placeholder={customizeEnabled ? `Write your ${activeTab} post...` : 'Write your post...'}
// //                                     value={getCurrentText()}
// //                                     onChange={(e) => handleTextChange(e.target.value)}
// //                                 />
// //                                 <div style={{
// //                                     padding: '8px 12px',
// //                                     borderTop: '1px solid #f0f0f0',
// //                                     display: 'flex',
// //                                     alignItems: 'center',
// //                                     gap: '12px'
// //                                 }}>
// //                                     <FontAwesomeIcon icon={faImage} style={{ color: '#65676b', fontSize: '16px', cursor: 'pointer' }} />
// //                                     <img
// //                                         src="/icons/location.svg"
// //                                         alt="Location"
// //                                         style={{ width: '16px', height: '16px', cursor: 'pointer', color: '#65676b' }}
// //                                     />
// //                                     <img
// //                                         src="/icons/emoji.png"
// //                                         alt="Emoji"
// //                                         style={{ width: '16px', height: '16px', cursor: 'pointer' }}
// //                                     />
// //                                     <img
// //                                         src="/icons/tag.svg"
// //                                         alt="Tag"
// //                                         style={{ width: '16px', height: '16px', cursor: 'pointer', color: '#65676b' }}
// //                                     />
// //                                     <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}>
// //                                         <span style={{ color: '#65676b', fontSize: '12px' }}>#</span>
// //                                         <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#65676b', fontSize: '14px' }} />
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         </div>

// //                         {/* Scheduling Options */}
// //                         <div style={{ marginBottom: '24px' }}>
// //                             <div style={{
// //                                 display: 'flex',
// //                                 alignItems: 'center',
// //                                 justifyContent: 'space-between',
// //                                 marginBottom: '12px'
// //                             }}>
// //                                 <label style={{
// //                                     fontSize: '16px',
// //                                     fontWeight: '600',
// //                                     color: '#1c1e21'
// //                                 }}>Scheduling options</label>
// //                                 <div style={{
// //                                     display: 'flex',
// //                                     alignItems: 'center',
// //                                     gap: '8px'
// //                                 }}>
// //                                     <span style={{ fontSize: '14px', color: '#65676b' }}>Set date and time</span>
// //                                     <div style={{
// //                                         width: '40px',
// //                                         height: '20px',
// //                                         borderRadius: '20px',
// //                                         backgroundColor: isScheduled ? '#1877f2' : '#ddd',
// //                                         position: 'relative',
// //                                         cursor: 'pointer',
// //                                         transition: 'background-color 0.3s ease'
// //                                     }}
// //                                         onClick={() => setIsScheduled(!isScheduled)}>
// //                                         <div style={{
// //                                             width: '16px',
// //                                             height: '16px',
// //                                             borderRadius: '50%',
// //                                             backgroundColor: 'white',
// //                                             position: 'absolute',
// //                                             top: '2px',
// //                                             right: isScheduled ? '2px' : '22px',
// //                                             transition: 'all 0.3s ease'
// //                                         }}></div>
// //                                     </div>
// //                                 </div>
// //                             </div>

// //                             <p style={{
// //                                 fontSize: '13px',
// //                                 color: '#65676b',
// //                                 marginBottom: '16px',
// //                                 lineHeight: '1.4'
// //                             }}>
// //                                 Schedule your post for the times when your audience is most active, or manually select a date and time in the future to publish your post.
// //                             </p>

// //                             {isScheduled && (
// //                                 <>
// //                                     {selectedPlatforms.map((platform) => (
// //                                         <div key={platform} style={{ marginBottom: '16px' }}>
// //                                             <div style={{
// //                                                 display: 'flex',
// //                                                 alignItems: 'center',
// //                                                 gap: '8px',
// //                                                 marginBottom: '8px'
// //                                             }}>
// //                                                 {getPlatformIcon(platform)}
// //                                                 <span style={{
// //                                                     fontSize: '14px',
// //                                                     fontWeight: '500',
// //                                                     color: '#1c1e21'
// //                                                 }}>{platform}</span>
// //                                             </div>

// //                                             <div style={{ display: 'flex', gap: '12px' }}>
// //                                                 <div style={{
// //                                                     display: 'flex',
// //                                                     alignItems: 'center',
// //                                                     gap: '8px',
// //                                                     padding: '8px 12px',
// //                                                     border: '1px solid #ddd',
// //                                                     borderRadius: '6px',
// //                                                     backgroundColor: 'white',
// //                                                     flex: '1'
// //                                                 }}>
// //                                                     <FontAwesomeIcon icon={faClock} style={{ color: '#65676b', fontSize: '14px' }} />
// //                                                     <input
// //                                                         type="date"
// //                                                         value={scheduleDate}
// //                                                         onChange={(e) => setScheduleDate(e.target.value)}
// //                                                         style={{
// //                                                             border: 'none',
// //                                                             outline: 'none',
// //                                                             fontSize: '14px',
// //                                                             color: '#1c1e21',
// //                                                             backgroundColor: 'transparent',
// //                                                             flex: '1'
// //                                                         }}
// //                                                     />
// //                                                 </div>

// //                                                 <div style={{
// //                                                     display: 'flex',
// //                                                     alignItems: 'center',
// //                                                     gap: '8px',
// //                                                     padding: '8px 12px',
// //                                                     border: '1px solid #ddd',
// //                                                     borderRadius: '6px',
// //                                                     backgroundColor: 'white',
// //                                                     flex: '1'
// //                                                 }}>
// //                                                     <FontAwesomeIcon icon={faClock} style={{ color: '#65676b', fontSize: '14px' }} />
// //                                                     <input
// //                                                         type="time"
// //                                                         value={scheduleTime}
// //                                                         onChange={(e) => setScheduleTime(e.target.value)}
// //                                                         style={{
// //                                                             border: 'none',
// //                                                             outline: 'none',
// //                                                             fontSize: '14px',
// //                                                             color: '#1c1e21',
// //                                                             backgroundColor: 'transparent',
// //                                                             flex: '1'
// //                                                         }}
// //                                                     />
// //                                                 </div>
// //                                             </div>
// //                                         </div>
// //                                     ))}

// //                                     <button style={{
// //                                         display: 'flex',
// //                                         alignItems: 'center',
// //                                         gap: '8px',
// //                                         padding: '8px 12px',
// //                                         border: '1px solid #ddd',
// //                                         borderRadius: '6px',
// //                                         backgroundColor: 'white',
// //                                         color: '#1c1e21',
// //                                         fontSize: '14px',
// //                                         fontWeight: '500',
// //                                         cursor: 'pointer'
// //                                     }}>
// //                                         <FontAwesomeIcon icon={faClock} style={{ fontSize: '14px' }} />
// //                                         <span>Active times</span>
// //                                     </button>
// //                                 </>
// //                             )}
// //                         </div>

// //                         {/* Collaborator */}
// //                         <div style={{ marginBottom: '24px' }}>
// //                             <div style={{
// //                                 display: 'flex',
// //                                 alignItems: 'center',
// //                                 gap: '8px',
// //                                 marginBottom: '8px'
// //                             }}>
// //                                 <label style={{
// //                                     fontSize: '16px',
// //                                     fontWeight: '600',
// //                                     color: '#1c1e21'
// //                                 }}>Collaborator</label>
// //                                 <FontAwesomeIcon icon={faInfoCircle} style={{ color: '#65676b', fontSize: '14px' }} />
// //                             </div>

// //                             <p style={{
// //                                 fontSize: '13px',
// //                                 color: '#65676b',
// //                                 marginBottom: '12px'
// //                             }}>
// //                                 Add a collaborator to your Facebook post and they will automatically be invited.
// //                             </p>

// //                             <input
// //                                 type="text"
// //                                 placeholder="Add a collaborator by name or URL"
// //                                 value={collaborator}
// //                                 onChange={(e) => setCollaborator(e.target.value)}
// //                                 style={{
// //                                     width: '100%',
// //                                     padding: '12px 16px',
// //                                     border: '1px solid #ddd',
// //                                     borderRadius: '8px',
// //                                     fontSize: '14px',
// //                                     outline: 'none',
// //                                     boxSizing: 'border-box'
// //                                 }}
// //                             />
// //                         </div>

// //                         {/* Share to your story */}
// //                         <div style={{ marginBottom: '24px' }}>
// //                             <div style={{
// //                                 display: 'flex',
// //                                 alignItems: 'center',
// //                                 justifyContent: 'space-between',
// //                                 marginBottom: '12px'
// //                             }}>
// //                                 <label style={{
// //                                     fontSize: '16px',
// //                                     fontWeight: '600',
// //                                     color: '#1c1e21'
// //                                 }}>Share to your story</label>
// //                                 <div
// //                                     className={`story-toggle ${shareToStory ? 'active' : 'inactive'}`}
// //                                     onClick={() => setShareToStory(!shareToStory)}
// //                                     onKeyDown={(e) => {
// //                                         if (e.key === 'Enter' || e.key === ' ') {
// //                                             e.preventDefault();
// //                                             setShareToStory(!shareToStory);
// //                                         }
// //                                     }}
// //                                     role="switch"
// //                                     aria-checked={shareToStory}
// //                                     aria-label="Share to your story"
// //                                     tabIndex={0}
// //                                 >
// //                                     <div className={`story-toggle-slider ${shareToStory ? 'active' : 'inactive'}`}></div>
// //                                 </div>
// //                             </div>

// //                             <p style={{
// //                                 fontSize: '13px',
// //                                 color: '#65676b',
// //                                 marginBottom: '16px'
// //                             }}>
// //                                 This is for Facebook only. Your story privacy is set to Public. Anyone on Facebook can see your story.
// //                             </p>

// //                             {shareToStory && showStoryNotification && (
// //                                 <div style={{
// //                                     display: 'flex',
// //                                     alignItems: 'flex-start',
// //                                     gap: '12px',
// //                                     padding: '12px',
// //                                     backgroundColor: '#e8f5e8',
// //                                     borderRadius: '8px',
// //                                     border: '1px solid #d1f2d1'
// //                                 }}>
// //                                     <div style={{
// //                                         width: '20px',
// //                                         height: '20px',
// //                                         borderRadius: '50%',
// //                                         backgroundColor: '#42a942',
// //                                         display: 'flex',
// //                                         alignItems: 'center',
// //                                         justifyContent: 'center',
// //                                         flexShrink: 0,
// //                                         marginTop: '2px'
// //                                     }}>
// //                                         <span style={{ color: 'white', fontSize: '12px' }}>💡</span>
// //                                     </div>
// //                                     <div style={{ flex: '1' }}>
// //                                         <div style={{
// //                                             fontSize: '14px',
// //                                             fontWeight: '500',
// //                                             color: '#1c1e21',
// //                                             marginBottom: '4px'
// //                                         }}>
// //                                             You can now share your post to your story!
// //                                         </div>
// //                                         <div style={{
// //                                             fontSize: '13px',
// //                                             color: '#65676b',
// //                                             lineHeight: '1.4'
// //                                         }}>
// //                                             Drive traffic to your post and keep your audience up-to-date on your new content.
// //                                         </div>
// //                                     </div>
// //                                     <button
// //                                         style={{
// //                                             background: 'none',
// //                                             border: 'none',
// //                                             color: '#65676b',
// //                                             cursor: 'pointer',
// //                                             fontSize: '16px',
// //                                             padding: '4px'
// //                                         }}
// //                                         onClick={() => setShowStoryNotification(false)}
// //                                     >
// //                                         <FontAwesomeIcon icon={faTimes} />
// //                                     </button>
// //                                 </div>
// //                             )}
// //                         </div>

// //                         {/* Action Buttons */}
// //                         <div style={{
// //                             display: 'flex',
// //                             gap: '12px',
// //                             paddingTop: '24px',
// //                             borderTop: '1px solid #e4e6ea',
// //                             marginTop: '24px'
// //                         }}>
// //                             <button style={{
// //                                 flex: '1',
// //                                 padding: '12px 24px',
// //                                 backgroundColor: '#1877f2',
// //                                 color: 'white',
// //                                 border: 'none',
// //                                 borderRadius: '8px',
// //                                 fontSize: '16px',
// //                                 fontWeight: '600',
// //                                 cursor: 'pointer',
// //                                 transition: 'background-color 0.2s ease',
// //                                 display: 'flex',
// //                                 alignItems: 'center',
// //                                 justifyContent: 'center',
// //                                 gap: '8px'
// //                             }}
// //                                 onMouseOver={(e) => e.target.style.backgroundColor = '#166fe5'}
// //                                 onMouseOut={(e) => e.target.style.backgroundColor = '#1877f2'}
// //                                 onClick={() => {
// //                                     console.log('Publishing post:', {
// //                                         platforms: selectedPlatforms,
// //                                         text: customizeEnabled ? platformTexts : postText,
// //                                         media: selectedMedia,
// //                                         scheduled: isScheduled ? { date: scheduleDate, time: scheduleTime } : null,
// //                                         shareToStory: shareToStory,
// //                                         collaborator: collaborator
// //                                     });
// //                                 }}>
// //                                 {isScheduled ? 'Schedule post' : 'Publish post'}
// //                             </button>

// //                             <button style={{
// //                                 padding: '12px 24px',
// //                                 backgroundColor: 'white',
// //                                 color: '#1c1e21',
// //                                 border: '1px solid #ddd',
// //                                 borderRadius: '8px',
// //                                 fontSize: '16px',
// //                                 fontWeight: '600',
// //                                 cursor: 'pointer',
// //                                 transition: 'all 0.2s ease',
// //                                 display: 'flex',
// //                                 alignItems: 'center',
// //                                 justifyContent: 'center',
// //                                 gap: '8px'
// //                             }}
// //                                 onMouseOver={(e) => {
// //                                     e.target.style.backgroundColor = '#f5f5f5';
// //                                     e.target.style.borderColor = '#bbb';
// //                                 }}
// //                                 onMouseOut={(e) => {
// //                                     e.target.style.backgroundColor = 'white';
// //                                     e.target.style.borderColor = '#ddd';
// //                                 }}
// //                                 onClick={() => {
// //                                     console.log('Saving draft:', {
// //                                         platforms: selectedPlatforms,
// //                                         text: customizeEnabled ? platformTexts : postText,
// //                                         media: selectedMedia,
// //                                         shareToStory: shareToStory,
// //                                         collaborator: collaborator
// //                                     });
// //                                 }}>
// //                                 Save draft
// //                             </button>
// //                         </div>
// //                     </div>
// //                 </div>

// //                 <div style={{
// //                     flex: '1',
// //                     maxWidth: '600px',
// //                     minWidth: '500px',
// //                     display: 'flex',
// //                     flexDirection: 'column',
// //                     gap: '16px'
// //                 }}>
// //                     <div style={{
// //                         backgroundColor: 'white',
// //                         borderRadius: '16px',
// //                         boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
// //                         border: '1px solid rgba(255, 255, 255, 0.2)',
// //                         height: 'fit-content',
// //                         overflow: 'hidden'
// //                     }}>
// //                         <div style={{ padding: '32px' }}>
// //                             <h2 style={{
// //                                 fontSize: '24px',
// //                                 fontWeight: '700',
// //                                 color: '#1c1e21',
// //                                 marginBottom: '8px',
// //                                 textAlign: 'center'
// //                             }}>Feed Preview</h2>
// //                             <p style={{
// //                                 fontSize: '14px',
// //                                 color: '#65676b',
// //                                 marginBottom: '24px',
// //                                 textAlign: 'center'
// //                             }}>
// //                             </p>

// //                             <div style={{
// //                                 display: 'flex',
// //                                 alignItems: 'center',
// //                                 justifyContent: 'space-between',
// //                                 marginBottom: '28px',
// //                                 padding: '20px 24px',
// //                                 backgroundColor: '#f8f9fa',
// //                                 borderRadius: '8px'
// //                             }}>
// //                                 <div style={{
// //                                     display: 'flex',
// //                                     alignItems: 'center',
// //                                     gap: '8px'
// //                                 }}>
// //                                     {getPlatformIcon(getPreviewPlatform())}
// //                                     <span style={{
// //                                         fontSize: '14px',
// //                                         fontWeight: '600',
// //                                         color: '#1c1e21'
// //                                     }}>
// //                                         Preview
// //                                     </span>
// //                                     {shareToStory && getPreviewPlatform() === 'Facebook' && (
// //                                         <span style={{
// //                                             fontSize: '11px',
// //                                             fontWeight: '500',
// //                                             color: '#1877f2',
// //                                             backgroundColor: '#e7f3ff',
// //                                             padding: '2px 6px',
// //                                             borderRadius: '4px',
// //                                             border: '1px solid #1877f2',
// //                                             marginLeft: '4px'
// //                                         }}>
// //                                             + Story
// //                                         </span>
// //                                     )}
// //                                 </div>

// //                                 <div style={{ position: 'relative' }} ref={previewDropdownRef}>
// //                                     <div
// //                                         style={{
// //                                             display: 'flex',
// //                                             alignItems: 'center',
// //                                             gap: '8px',
// //                                             padding: '6px 12px',
// //                                             border: '1px solid #ddd',
// //                                             borderRadius: '6px',
// //                                             backgroundColor: 'white',
// //                                             cursor: 'pointer',
// //                                             fontSize: '13px',
// //                                             fontWeight: '500'
// //                                         }}
// //                                         onClick={() => setShowPreviewDropdown(!showPreviewDropdown)}
// //                                     >
// //                                         {getPlatformIcon(getPreviewPlatform())}
// //                                         <span>{getPreviewPlatform()}</span>
// //                                         <FontAwesomeIcon
// //                                             icon={faChevronDown}
// //                                             style={{
// //                                                 fontSize: '10px',
// //                                                 transform: showPreviewDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
// //                                                 transition: 'transform 0.2s ease'
// //                                             }}
// //                                         />
// //                                     </div>

// //                                     {showPreviewDropdown && selectedPlatforms.length > 1 && (
// //                                         <div style={{
// //                                             position: 'absolute',
// //                                             top: '100%',
// //                                             right: '0',
// //                                             marginTop: '4px',
// //                                             background: 'white',
// //                                             border: '1px solid #ddd',
// //                                             borderRadius: '8px',
// //                                             boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
// //                                             zIndex: 1000,
// //                                             minWidth: '140px'
// //                                         }}>
// //                                             {selectedPlatforms.map((platform) => (
// //                                                 <div
// //                                                     key={platform}
// //                                                     style={{
// //                                                         display: 'flex',
// //                                                         alignItems: 'center',
// //                                                         gap: '8px',
// //                                                         padding: '8px 12px',
// //                                                         cursor: 'pointer',
// //                                                         fontSize: '13px',
// //                                                         backgroundColor: platform === getPreviewPlatform() ? '#f0f8ff' : 'transparent',
// //                                                         transition: 'background-color 0.2s ease'
// //                                                     }}
// //                                                     onClick={() => {
// //                                                         setPreviewPlatform(platform);
// //                                                         setShowPreviewDropdown(false);
// //                                                     }}
// //                                                     onMouseOver={(e) => {
// //                                                         if (platform !== getPreviewPlatform()) {
// //                                                             e.target.style.backgroundColor = '#f8f9fa';
// //                                                         }
// //                                                     }}
// //                                                     onMouseOut={(e) => {
// //                                                         if (platform !== getPreviewPlatform()) {
// //                                                             e.target.style.backgroundColor = 'transparent';
// //                                                         }
// //                                                     }}
// //                                                 >
// //                                                     {getPlatformIcon(platform)}
// //                                                     <span>{platform}</span>
// //                                                 </div>
// //                                             ))}
// //                                         </div>
// //                                     )}
// //                                 </div>
// //                             </div>

// //                             <div style={getPlatformPreviewStyle(getPreviewPlatform())}>
// //                                 <div style={getPlatformHeaderStyle(getPreviewPlatform())}>
// //                                     <div style={{
// //                                         width: '56px',
// //                                         height: '56px',
// //                                         borderRadius: '50%',
// //                                         background: getPreviewPlatform() === 'LinkedIn' ?
// //                                             'linear-gradient(135deg, #0077b5 0%, #005885 100%)' :
// //                                             getPreviewPlatform() === 'Instagram' ?
// //                                                 'linear-gradient(135deg, #E4405F 0%, #FCAF45 100%)' :
// //                                                 getPreviewPlatform() === 'X' ?
// //                                                     'linear-gradient(135deg, #000000 0%, #333333 100%)' :
// //                                                     'linear-gradient(135deg, #4267B2 0%, #365899 100%)',
// //                                         color: 'white',
// //                                         display: 'flex',
// //                                         alignItems: 'center',
// //                                         justifyContent: 'center',
// //                                         fontWeight: 'bold',
// //                                         fontSize: '22px',
// //                                         boxShadow: '0 3px 10px rgba(102, 126, 234, 0.25)',
// //                                         flexShrink: 0
// //                                     }}>CS</div>
// //                                     <div style={{ flex: '1', minWidth: '0' }}>
// //                                         <div style={{
// //                                             fontSize: '18px',
// //                                             fontWeight: '600',
// //                                             color: '#1c1e21',
// //                                             marginBottom: '4px',
// //                                             overflow: 'hidden',
// //                                             textOverflow: 'ellipsis',
// //                                             whiteSpace: 'nowrap'
// //                                         }}>{getPlatformName(getPreviewPlatform())}</div>
// //                                         <div style={{
// //                                             fontSize: '14px',
// //                                             color: '#65676b',
// //                                             display: 'flex',
// //                                             alignItems: 'center',
// //                                             gap: '6px',
// //                                             fontWeight: '400'
// //                                         }}>
// //                                             <FontAwesomeIcon icon={faClock} />
// //                                             <span>{isScheduled && scheduleDate ?
// //                                                 `Scheduled for ${new Date(scheduleDate).toLocaleDateString()}` :
// //                                                 'Just now'
// //                                             }</span>
// //                                             <span>·</span>
// //                                             <FontAwesomeIcon icon={faGlobe} />
// //                                         </div>
// //                                     </div>
// //                                 </div>

// //                                 {(getDisplayText() || postText) && (
// //                                     <div style={{
// //                                         padding: '0 20px 20px',
// //                                         fontSize: '17px',
// //                                         color: '#1c1e21',
// //                                         lineHeight: '1.5',
// //                                         whiteSpace: 'pre-wrap',
// //                                         minHeight: '24px'
// //                                     }}>{getDisplayText() || postText}</div>
// //                                 )}

// //                                 {selectedMedia && (
// //                                     <div style={{
// //                                         width: '100%',
// //                                         minHeight: '200px',
// //                                         display: 'flex',
// //                                         alignItems: 'center',
// //                                         justifyContent: 'center',
// //                                         backgroundColor: '#f8f9fa'
// //                                     }}>
// //                                         {mediaType === 'image' ? (
// //                                             <img src={selectedMedia} alt="Post content" style={{
// //                                                 width: '100%',
// //                                                 height: 'auto',
// //                                                 display: 'block',
// //                                                 maxHeight: '400px',
// //                                                 objectFit: 'contain'
// //                                             }} />
// //                                         ) : (
// //                                             <video src={selectedMedia} controls style={{
// //                                                 width: '100%',
// //                                                 height: 'auto',
// //                                                 display: 'block',
// //                                                 maxHeight: '400px',
// //                                                 objectFit: 'contain'
// //                                             }} />
// //                                         )}
// //                                     </div>
// //                                 )}

// //                                 {!(getDisplayText() || postText) && !selectedMedia && (
// //                                     <div style={{
// //                                         padding: '40px 20px',
// //                                         textAlign: 'center',
// //                                         color: '#65676b',
// //                                         fontSize: '15px',
// //                                         fontStyle: 'italic',
// //                                         backgroundColor: '#f8f9fa',
// //                                         minHeight: '120px',
// //                                         display: 'flex',
// //                                         alignItems: 'center',
// //                                         justifyContent: 'center'
// //                                     }}>
// //                                         Your {getPreviewPlatform()} post preview will appear here
// //                                     </div>
// //                                 )}

// //                                 {/* Engagement Buttons */}
// //                                 <div style={{
// //                                     borderTop: '1px solid #e4e6ea',
// //                                     padding: '20px 32px'
// //                                 }}>
// //                                     <div style={{
// //                                         display: 'flex',
// //                                         justifyContent: 'space-between',
// //                                         alignItems: 'center',
// //                                         gap: '32px'
// //                                     }}>
// //                                         <div style={{
// //                                             display: 'flex',
// //                                             alignItems: 'center',
// //                                             gap: '10px',
// //                                             cursor: 'pointer',
// //                                             padding: '14px 24px',
// //                                             borderRadius: '10px',
// //                                             transition: 'background-color 0.2s ease',
// //                                             flex: '1',
// //                                             justifyContent: 'center',
// //                                             minWidth: '0'
// //                                         }}
// //                                             onMouseOver={(e) => e.target.style.backgroundColor = '#f2f2f2'}
// //                                             onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
// //                                             <img
// //                                                 src="/icons/like.svg"
// //                                                 alt="Like"
// //                                                 style={{ width: '22px', height: '22px' }}
// //                                             />
// //                                             <span style={{
// //                                                 fontSize: '15px',
// //                                                 fontWeight: '600',
// //                                                 color: '#65676b'
// //                                             }}>Like</span>
// //                                         </div>

// //                                         <div style={{
// //                                             display: 'flex',
// //                                             alignItems: 'center',
// //                                             gap: '10px',
// //                                             cursor: 'pointer',
// //                                             padding: '14px 24px',
// //                                             borderRadius: '10px',
// //                                             transition: 'background-color 0.2s ease',
// //                                             flex: '1',
// //                                             justifyContent: 'center',
// //                                             minWidth: '0'
// //                                         }}
// //                                             onMouseOver={(e) => e.target.style.backgroundColor = '#f2f2f2'}
// //                                             onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
// //                                             <img
// //                                                 src="/icons/comment.svg"
// //                                                 alt="Comment"
// //                                                 style={{ width: '22px', height: '22px' }}
// //                                             />
// //                                             <span style={{
// //                                                 fontSize: '15px',
// //                                                 fontWeight: '600',
// //                                                 color: '#65676b'
// //                                             }}>Comment</span>
// //                                         </div>

// //                                         <div style={{
// //                                             display: 'flex',
// //                                             alignItems: 'center',
// //                                             gap: '10px',
// //                                             cursor: 'pointer',
// //                                             padding: '14px 24px',
// //                                             borderRadius: '10px',
// //                                             transition: 'background-color 0.2s ease',
// //                                             flex: '1',
// //                                             justifyContent: 'center',
// //                                             minWidth: '0'
// //                                         }}
// //                                             onMouseOver={(e) => e.target.style.backgroundColor = '#f2f2f2'}
// //                                             onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}>
// //                                             <img
// //                                                 src="/icons/share.svg"
// //                                                 alt="Share"
// //                                                 style={{ width: '22px', height: '22px' }}
// //                                             />
// //                                             <span style={{
// //                                                 fontSize: '15px',
// //                                                 fontWeight: '600',
// //                                                 color: '#65676b'
// //                                             }}>Share</span>
// //                                         </div>
// //                                     </div>
// //                                 </div>
// //                             </div>
// //                         </div>
// //                     </div>
// //                 </div>
// //             </div>
// //         </div>
// //     );
// // };

// // export default CreatePost;


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

// // Make sure this path is correct relative to CreatePost.jsx
// import axiosInstance from './api/axios'; // Make sure this is imported

// const CreatePost = ({ token, user, apiSource, onNavigate }) => {
//     // --- Existing State Variables ---
//     const [showPlatforms, setShowPlatforms] = useState(false);
//     const [selectedPlatforms, setSelectedPlatforms] = useState(['Facebook']); // Default Facebook selected
//     const [postText, setPostText] = useState('');
//     const [selectedMedia, setSelectedMedia] = useState(null); // Changed: Stores File object now
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
//     // const [showAdBanner, setShowAdBanner] = useState(true); // Ad Banner logic not shown in UI, can likely be removed if not used
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

//     // --- Added State Variables for Posting ---
//     const [isPosting, setIsPosting] = useState(false);
//     const [postError, setPostError] = useState('');
//     const [postSuccess, setPostSuccess] = useState('');
//     // --- End Added State Variables ---

//     // --- Refs ---
//     const fileInputRef = useRef(null);
//     const videoInputRef = useRef(null);
//     const platformDropdownRef = useRef(null);
//     const previewDropdownRef = useRef(null);

//     // --- useEffect Hooks (No changes needed here from your version) ---
//     useEffect(() => {
//         const handleClickOutside = (event) => {
//             if (previewDropdownRef.current && !previewDropdownRef.current.contains(event.target)) {
//                 setShowPreviewDropdown(false);
//             }
//             // Fix for platform dropdown closing
//             if (platformDropdownRef.current && !platformDropdownRef.current.contains(event.target)) {
//                 // Check if the click target is the header itself before closing
//                 const header = document.querySelector(".platform-dropdown-header"); // Use a more specific selector if needed
//                 if (header && !header.contains(event.target)) {
//                     setShowPlatforms(false);
//                 }
//             }
//         };

//         document.addEventListener('mousedown', handleClickOutside);
//         return () => {
//             document.removeEventListener('mousedown', handleClickOutside);
//         };
//     }, []); // Removed platformDropdownRef from dependency array

//     useEffect(() => {
//         // Auto-select first platform if active tab is removed or customize is off
//         if (customizeEnabled && selectedPlatforms.length > 0 && !selectedPlatforms.includes(activeTab)) {
//             setActiveTab(selectedPlatforms[0]);
//         }
//         // Ensure preview defaults correctly
//         if (!selectedPlatforms.includes(previewPlatform) && selectedPlatforms.length > 0) {
//             setPreviewPlatform(selectedPlatforms[0]);
//         } else if (selectedPlatforms.length === 0) {
//             setPreviewPlatform('Facebook');
//         }
//     }, [selectedPlatforms, activeTab, customizeEnabled, previewPlatform]);


//     // --- Event Handlers (Platform Toggle, Text Change) ---
//     const handlePlatformToggle = (platform) => {
//         setSelectedPlatforms(prev => {
//             return prev.includes(platform)
//                 ? prev.filter(p => p !== platform)
//                 : [...prev, platform];
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
//             // Sync all platform texts when customize is off
//             setPlatformTexts({ Facebook: value, Instagram: value, LinkedIn: value, X: value });
//         }
//     };

//     // --- Media Handling Functions ---
//     const handleMediaUpload = (event, type) => {
//         const file = event.target.files[0];
//         if (file) {
//             setSelectedMedia(file); // Store the File object
//             setMediaType(type);
//             // Clear the other input ref value
//             if (type === 'image' && videoInputRef.current) videoInputRef.current.value = '';
//             if (type === 'video' && fileInputRef.current) fileInputRef.current.value = '';
//         }
//     };

//     const removeMedia = () => {
//         setSelectedMedia(null);
//         setMediaType(null);
//         if (fileInputRef.current) fileInputRef.current.value = '';
//         if (videoInputRef.current) videoInputRef.current.value = '';
//     };

//     // Helper to get media URL for preview
//     const getMediaPreviewUrl = () => {
//         if (!selectedMedia) return null;
//         if (selectedMedia instanceof File) {
//             return URL.createObjectURL(selectedMedia);
//         }
//         return selectedMedia; // Assume it might already be a URL (e.g., from a draft)
//     };
//     const mediaPreviewUrl = getMediaPreviewUrl(); // Generate preview URL

//     // --- Helper Functions (getDisplayText, getPreviewPlatform, etc. - No changes needed) ---
//     const getDisplayText = () => {
//         const platformToPreview = getPreviewPlatform();
//         if (customizeEnabled) {
//             return platformTexts[platformToPreview] || '';
//         }
//         return postText;
//     };


//     const getPreviewPlatform = () => {
//         if (selectedPlatforms.length === 0) return 'Facebook';
//         if (selectedPlatforms.includes(previewPlatform)) return previewPlatform;
//         return selectedPlatforms[0];
//     };

//     const getPlatformName = (platform) => { /* ... No changes needed ... */
//         switch (platform) {
//             case 'Facebook': return 'Computer Science and Engineering';
//             case 'Instagram': return 'cse_uta';
//             case 'LinkedIn': return 'Computer Science and Engineering';
//             case 'X': return '@cse_uta';
//             default: return 'Computer Science and Engineering';
//         }
//     };
//     const getPlatformPreviewStyle = (platform) => { /* ... No changes needed ... */
//         const baseStyle = {
//             border: '1px solid #e4e6ea', borderRadius: '12px', overflow: 'hidden',
//             backgroundColor: 'white', boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
//             width: '100%', minHeight: '300px'
//         };
//         // Specific styles can be added here if needed
//         return baseStyle;
//     };
//     const getPlatformHeaderStyle = (platform) => { /* ... No changes needed ... */
//         return {
//             padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '12px',
//             minHeight: '88px', backgroundColor: 'white', borderBottom: '1px solid #e4e6ea'
//         };
//     };
//     const getPlatformIcon = (platform) => { /* ... No changes needed ... */
//         const iconStyle = { width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' };
//         switch (platform) {
//             case 'Facebook': return <img src="/icons/facebook.svg" alt="Facebook" style={iconStyle} className="platform-icon facebook" onError={(e) => e.target.style.display = 'none'} />;
//             case 'Instagram': return <img src="/icons/instagram.svg" alt="Instagram" style={iconStyle} className="platform-icon instagram" onError={(e) => e.target.style.display = 'none'} />;
//             case 'LinkedIn': return <img src="/icons/linkedin.svg" alt="LinkedIn" style={iconStyle} className="platform-icon linkedin" onError={(e) => e.target.style.display = 'none'} />;
//             case 'X': case 'Twitter': return <img src="/icons/x.svg" alt="X (Twitter)" style={iconStyle} className="platform-icon x" onError={(e) => e.target.style.display = 'none'} />;
//             default: return <span style={iconStyle}>?</span>;
//         }
//     };

//     const handlePublish = async () => {
//         if (selectedPlatforms.length === 0) {
//             setPostError('Please select at least one platform to post to.');
//             return;
//         }

//         setIsPosting(true);
//         setPostError('');
//         setPostSuccess('');
//         let successMessages = [];
//         let errorMessages = [];

//         const getTextForPlatform = (platform) => {
//             if (customizeEnabled && platformTexts[platform]?.trim()) {
//                 return platformTexts[platform];
//             }
//             return postText; // Fallback to common text
//         };

//         // Check overall content
//         const hasContent = selectedMedia || selectedPlatforms.some(p => getTextForPlatform(p)?.trim());
//         if (!hasContent) {
//             setPostError('Please add text or media to your post.');
//             setIsPosting(false);
//             return;
//         }

//         for (const platform of selectedPlatforms) {
//             const platformText = getTextForPlatform(platform);

//             if (!platformText?.trim() && !selectedMedia) {
//                 continue; // Skip if no content for this platform
//             }

//             if (platform === 'Facebook') {
//                 try {
//                     if(selectedMedia) {
//                         console.log(`Attempting Facebook photo with caption: "${platformText}"`);
//                         const formData = new FormData();
//                         formData.append('caption', platformText);
//                         formData.append('media', selectedMedia);

//                         const response = await axiosInstance.post('/api/facebook/photos', formData, {
//                             headers: {
//                                 'Content-Type': 'multipart/form-data',
//                             },
//                         });
//                         if (response.status === 201) {
//                             successMessages.push(`Successfully posted to Facebook!`);
//                         } else {
//                             errorMessages.push(`Facebook: Unexpected response status ${response.status}`);
//                         }

//                     } else {
//                         console.log(`Attempting Facebook TEXT post: "${platformText}"`);
//                         const response = await axiosInstance.post('/api/facebook/feed', {
//                             message: platformText
//                         });
//                         if (response.status === 201) {
//                             successMessages.push(`Successfully text to Facebook!`);
//                         } else {
//                             errorMessages.push(`Facebook: Unexpected response status ${response.status}`);
//                         }
//                     }   
//                 } catch (err) {
//                     console.error("Facebook post error:", err.response?.data || err.message);
//                     errorMessages.push(`Facebook: ${err.response?.data?.error?.message || err.message}`);
//                 }
                
//             } else if (platform === 'Instagram') {
//                 if (!selectedMedia) {
//                     errorMessages.push('Instagram: Posts require media.'); // Instagram needs media
//                 } else {
//                     try {
//                         console.log(`Attempting Instagram post with caption: "${platformText}"`);
//                         const formData = new FormData();
//                         formData.append('caption', platformText);
//                         formData.append('media', selectedMedia);
                        
//                         // You'll need to create this new endpoint in your server.js
//                         const response = await axiosInstance.post('/api/instagram/post', formData, {
//                             headers: {
//                                 'Content-Type': 'multipart/form-data',
//                             },
//                         });

//                         if (response.status === 201) {
//                             successMessages.push(`Successfully posted to Instagram!`);
//                         } else {
//                             errorMessages.push(`Instagram: Unexpected response status ${response.status}`);
//                         }
//                     } catch (err) {
//                         console.error("Instagram post error:", err.response?.data || err.message);
//                         errorMessages.push(`Instagram: ${err.response?.data?.error?.message || err.message}`);
//                     }
//                 }
//             }
//             // Add other platforms here...
//             // else if (platform === 'LinkedIn') { errorMessages.push('LinkedIn: Posting not implemented yet.'); }
//             // else if (platform === 'X') { errorMessages.push('X: Posting not implemented yet.'); }
//         }

//         // Set feedback messages
//         if (successMessages.length > 0) { setPostSuccess(successMessages.join(' | ')); }
//         if (errorMessages.length > 0) { setPostError(errorMessages.join(' | '));}

//         // Clear fields only if everything was successful
//         if (errorMessages.length === 0 && successMessages.length > 0) {
//             setPostText('');
//             setPlatformTexts({ Facebook: '', Instagram: '', LinkedIn: '', X: '' });
//             removeMedia();
//         }

//         setIsPosting(false);
//     };
//     // --- *** End handlePublish Function *** ---
    
//     // edit this later
//     const handleSchedule = () => {
//         console.log('Schedule button clicked');
//     }

//     // --- JSX Return ---
//     return (
//         <div className="create-post-container">
//             <div className="main-content">
//                 {/* --- Left Panel --- */}
//                 <div className="left-panel">
//                     <div className="form-content">

//                         {/* Post To Section */}
//                         <div className="form-section">
//                             {/* ... (Platform selection UI - same as your code) ... */}
//                             <label className="section-label">Post to</label>
//                             <div ref={platformDropdownRef}>
//                                 <div
//                                     className="platform-dropdown-header" onClick={() => setShowPlatforms(!showPlatforms)}
//                                     role="button"
//                                     aria-expanded={showPlatforms}
//                                     tabIndex={0}
//                                     onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setShowPlatforms(!showPlatforms); } }}
//                                 >
//                                     <div className="platform-avatar">CS</div>
//                                     <span className="platform-text">
//                                         {selectedPlatforms.length === 0
//                                             ? "Select platforms..."
//                                             : selectedPlatforms.length <= 2
//                                                 ? selectedPlatforms.join(' and ')
//                                                 : `${selectedPlatforms.length} platforms selected`}
//                                     </span>
//                                     <FontAwesomeIcon icon={faChevronDown} className={`dropdown-chevron ${showPlatforms ? 'rotated' : ''}`} />
//                                 </div>
//                                 {showPlatforms && (
//                                     <div className="platform-dropdown-content">
//                                         <div className="platform-options-list" role="group" aria-label="Platforms to post to">
//                                             {['Facebook', 'Instagram', 'LinkedIn', 'X'].map((platform) => (
//                                                 <div key={platform}
//                                                     className={`platform-option-item ${selectedPlatforms.includes(platform) ? 'selected' : ''}`}
//                                                     onClick={() => handlePlatformToggle(platform)}
//                                                     role="checkbox"
//                                                     aria-checked={selectedPlatforms.includes(platform)}
//                                                     tabIndex={0}
//                                                     onLeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); handlePlatformToggle(platform); } }}
//                                                 >
//                                                     <input type="checkbox"
//                                                         checked={selectedPlatforms.includes(platform)}
//                                                         readOnly
//                                                         className="platform-option-checkbox"
//                                                         tabIndex={-1} />
//                                                     {getPlatformIcon(platform)}
//                                                     < div className="platform-option-info">
//                                                         <div className="platform-option-name">{platform}</div>
//                                                     </div>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     </div>
//                                 )}
//                             </div>
//                         </div>

//                         {/* Media Section */}
//                         <div className="form-section">
//                             {/* ... (Media buttons, inputs, preview - same as your code, using mediaPreviewUrl) ... */}
//                             <label className="section-label">Media</label>
//                             <p className="section-description">Share photos or a video. Instagram posts require media and can't exceed 10 photos.</p>
//                             <div className="media-buttons-container">
//                                 <button type="button" className="media-upload-button" onClick={() => fileInputRef.current?.click()}><FontAwesomeIcon icon={faImage} className="media-icon" /><span>Add photo</span></button>
//                                 <button type="button" className="media-upload-button" onClick={() => videoInputRef.current?.click()}><FontAwesomeIcon icon={faVideo} className="media-icon" /><span>Add video</span></button>
//                             </div>
//                             <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={(e) => handleMediaUpload(e, 'image')} />
//                             <input ref={videoInputRef} type="file" accept="video/*" style={{ display: 'none' }} onChange={(e) => handleMediaUpload(e, 'video')} />
//                             {mediaPreviewUrl && (
//                                 <div className="media-preview-container">
//                                     {mediaType === 'image' ? <img src={mediaPreviewUrl} alt="Preview" className="media-preview-image" /> : <video src={mediaPreviewUrl} controls className="media-preview-video" />}
//                                     <button type="button" className="media-remove-button" onClick={removeMedia}><FontAwesomeIcon icon={faTimes} /></button>
//                                 </div>
//                             )}
//                         </div>

//                         {/* Post Details Section */}
//                         <div style={{ marginBottom: '24px' }}>
//                             {/* ... (Customize toggle, platform tabs, textarea, text tools - same as your code) ... */}
//                             <label style={{ display: 'block', fontSize: '16px', fontWeight: '600', color: '#1c1e21', marginBottom: '12px' }}>Post details</label>
//                             <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
//                                 <div style={{ position: 'relative', width: '40px', height: '20px' }}>
//                                     <input type="checkbox" id="customizeToggle" checked={customizeEnabled} onChange={() => setCustomizeEnabled(!customizeEnabled)} style={{ position: 'absolute', opacity: '0', width: '0', height: '0' }} />
//                                     <label htmlFor="customizeToggle" style={{ position: 'absolute', cursor: 'pointer', top: '0', left: '0', right: '0', bottom: '0', background: customizeEnabled ? '#1877f2' : '#ccc', transition: '0.3s', borderRadius: '20px' }}>
//                                         <span style={{ position: 'absolute', height: '16px', width: '16px', left: customizeEnabled ? '22px' : '2px', top: '2px', backgroundColor: 'white', transition: '0.3s', borderRadius: '50%' }}></span>
//                                     </label>
//                                 </div>
//                                 <label htmlFor="customizeToggle" style={{ fontSize: '14px', color: '#1c1e21', fontWeight: '500', cursor: 'pointer' }}>Customize post for each platform</label>
//                             </div>
//                             {customizeEnabled && selectedPlatforms.length > 0 && (
//                                 <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
//                                     {selectedPlatforms.map((platform) => (
//                                         <div key={platform} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', backgroundColor: activeTab === platform ? '#1877f2' : 'white', color: activeTab === platform ? 'white' : '#1c1e21', border: activeTab === platform ? 'none' : '1px solid #ddd', borderRadius: '6px', fontSize: '14px', fontWeight: '500', cursor: 'pointer', transition: 'all 0.2s ease' }} onClick={() => setActiveTab(platform)} role="tab" aria-selected={activeTab === platform} tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setActiveTab(platform); }}>
//                                             {getPlatformIcon(platform)}
//                                             <span>{platform}</span>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                             <label style={{ display: 'block', fontSize: '16px', fontWeight: '600', color: '#1c1e21', marginBottom: '8px' }}>{customizeEnabled ? `${activeTab} text` : 'Post text'}</label>
//                             <div style={{ border: '1px solid #ddd', borderRadius: '8px', backgroundColor: 'white', overflow: 'hidden' }}>
//                                 <textarea style={{ width: '100%', minHeight: '120px', padding: '12px', border: 'none', fontSize: '14px', fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box', lineHeight: '1.4' }} placeholder={customizeEnabled ? `Write your ${activeTab} post...` : 'Write your post...'} value={getCurrentText()} onChange={(e) => handleTextChange(e.target.value)} />
//                                 <div style={{ padding: '8px 12px', borderTop: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
//                                     {/* Icons */}
//                                     <FontAwesomeIcon icon={faImage} style={{ color: '#65676b', fontSize: '16px', cursor: 'pointer' }} />
//                                     <img src="/icons/location.svg" alt="Location" style={{ width: '16px', height: '16px', cursor: 'pointer', color: '#65676b' }} onError={(e) => e.target.style.display = 'none'} />
//                                     <img src="/icons/emoji.png" alt="Emoji" style={{ width: '16px', height: '16px', cursor: 'pointer' }} onError={(e) => e.target.style.display = 'none'} />
//                                     <img src="/icons/tag.svg" alt="Tag" style={{ width: '16px', height: '16px', cursor: 'pointer', color: '#65676b' }} onError={(e) => e.target.style.display = 'none'} />
//                                     <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '8px' }}><span style={{ color: '#65676b', fontSize: '12px' }}>#</span><FontAwesomeIcon icon={faInfoCircle} style={{ color: '#65676b', fontSize: '14px' }} /></div>
//                                 </div>
//                             </div>
//                         </div>

//                         {/* Scheduling Options */}
//                         <div style={{ marginBottom: '24px' }}>
//                             {/* ... (Scheduling UI - same as your code) ... */}
//                         </div>

//                         {/* Collaborator */}
//                         <div style={{ marginBottom: '24px' }}>
//                             {/* ... (Collaborator UI - same as your code) ... */}
//                         </div>

//                         {/* Share to story */}
//                         <div style={{ marginBottom: '24px' }}>
//                             {/* ... (Share to Story UI - same as your code) ... */}
//                         </div>

//                         {/* --- Feedback Display Area --- */}
//                         <div style={{ marginBottom: '15px', minHeight: '20px', textAlign: 'center' }}>
//                             {postError && <div style={{ color: '#dc2626', background: '#fee2e2', padding: '8px 12px', borderRadius: '6px', display: 'inline-block' }}>{postError}</div>}
//                             {postSuccess && <div style={{ color: '#16a34a', background: '#dcfce7', padding: '8px 12px', borderRadius: '6px', display: 'inline-block' }}>{postSuccess}</div>}
//                         </div>
//                         {/* --- End Feedback Display Area --- */}

//                         {/* --- Action Buttons --- */}
//                         <div style={{ display: 'flex', gap: '12px', paddingTop: '24px', borderTop: '1px solid #e4e6ea', marginTop: '24px' }}>
//                             {/* --- Updated Publish Button --- */}
//                             <button
//                                 type="button"
//                                 style={{
//                                     flex: '1', padding: '12px 24px', backgroundColor: '#1877f2', color: 'white', border: 'none',
//                                     borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer',
//                                     transition: 'background-color 0.2s ease, opacity 0.2s ease', display: 'flex', alignItems: 'center',
//                                     justifyContent: 'center', gap: '8px',
//                                     opacity: (isPosting || selectedPlatforms.length === 0) ? 0.6 : 1 // Dim when disabled
//                                 }}
//                                 onClick={handlePublish}
//                                 disabled={isPosting || selectedPlatforms.length === 0}
//                                 onMouseOver={(e) => !isPosting && selectedPlatforms.length > 0 && (e.currentTarget.style.backgroundColor = '#166fe5')}
//                                 onMouseOut={(e) => !isPosting && selectedPlatforms.length > 0 && (e.currentTarget.style.backgroundColor = '#1877f2')}
//                             >
//                                 {isPosting ? 'Publishing...' : (isScheduled ? 'Schedule post' : 'Publish post')}
//                             </button>
//                             {/* --- End Updated Publish Button --- */}

//                             <button
//                                 type="button"
//                                 style={{ /* Keep existing styles */
//                                     padding: '12px 24px', backgroundColor: 'white', color: '#1c1e21', border: '1px solid #ddd',
//                                     borderRadius: '8px', fontSize: '16px', fontWeight: '600', cursor: 'pointer',
//                                     transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
//                                 }}
//                                 onMouseOver={(e) => { e.currentTarget.style.backgroundColor = '#f5f5f5'; e.currentTarget.style.borderColor = '#bbb'; }}
//                                 onMouseOut={(e) => { e.currentTarget.style.backgroundColor = 'white'; e.currentTarget.style.borderColor = '#ddd'; }}
//                                 onClick={() => { console.log('Saving draft...'); }}
//                             >
//                                 Save draft
//                             </button>
//                         </div>
//                     </div> {/* End form-content */}
//                 </div> {/* End left-panel */}

//                 {/* --- Right Panel (Preview) --- */}
//                 <div style={{ flex: '1', maxWidth: '600px', minWidth: '500px', /* ... */ }}>
//                     <div style={{ backgroundColor: 'white', borderRadius: '16px', /* ... */ }}>
//                         <div style={{ padding: '32px' }}>
//                             {/* ... (Preview Title, Subtitle, Header, Dropdown - same as your code) ... */}
//                             <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1c1e21', marginBottom: '8px', textAlign: 'center' }}>Feed Preview</h2>
//                             {/* ... Subtitle ... */}
//                             <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', padding: '20px 24px', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
//                                 {/* ... Preview brand/label ... */}
//                                 <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
//                                     {getPlatformIcon(getPreviewPlatform())}
//                                     <span style={{ fontSize: '14px', fontWeight: '600', color: '#1c1e21' }}>Preview</span>
//                                     {/* ... + Story Badge ... */}
//                                 </div>
//                                 {/* ... Preview Dropdown ... */}
//                                 <div style={{ position: 'relative' }} ref={previewDropdownRef}>
//                                     <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 12px', border: '1px solid #ddd', borderRadius: '6px', backgroundColor: 'white', cursor: 'pointer', fontSize: '13px', fontWeight: '500' }} onClick={() => setShowPreviewDropdown(!showPreviewDropdown)}>
//                                         {getPlatformIcon(getPreviewPlatform())}
//                                         <span>{getPreviewPlatform()}</span>
//                                         <FontAwesomeIcon icon={faChevronDown} style={{ fontSize: '10px', transform: showPreviewDropdown ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.2s ease' }} />
//                                     </div>
//                                     {/* Dropdown Menu */}
//                                     {showPreviewDropdown && selectedPlatforms.length > 1 && (
//                                         <div style={{ position: 'absolute', top: '100%', right: '0', marginTop: '4px', background: 'white', border: '1px solid #ddd', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', zIndex: 1000, minWidth: '140px' }}>
//                                             {selectedPlatforms.map((platform) => (
//                                                 <div key={platform} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', cursor: 'pointer', fontSize: '13px', backgroundColor: platform === getPreviewPlatform() ? '#f0f8ff' : 'transparent', transition: 'background-color 0.2s ease' }} onClick={() => { setPreviewPlatform(platform); setShowPreviewDropdown(false); }} onMouseEnter={(e) => { if (platform !== getPreviewPlatform()) e.currentTarget.style.backgroundColor = '#f8f9fa'; }} onMouseLeave={(e) => { if (platform !== getPreviewPlatform()) e.currentTarget.style.backgroundColor = 'transparent'; }}>
//                                                     {getPlatformIcon(platform)}
//                                                     <span>{platform}</span>
//                                                 </div>
//                                             ))}
//                                         </div>
//                                     )}
//                                 </div>
//                             </div>

//                             {/* --- The Actual Post Preview --- */}
//                             <div style={getPlatformPreviewStyle(getPreviewPlatform())}>
//                                 <div style={getPlatformHeaderStyle(getPreviewPlatform())}>
//                                     {/* ... (Avatar, Name, Time - same as your code) ... */}
//                                     <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: /* Dynamic Background based on platform */ 'linear-gradient(135deg, #4267B2 0%, #365899 100%)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '22px', boxShadow: '0 3px 10px rgba(102, 126, 234, 0.25)', flexShrink: 0 }}>CS</div>
//                                     <div style={{ flex: '1', minWidth: '0' }}>
//                                         <div style={{ fontSize: '18px', fontWeight: '600', color: '#1c1e21', marginBottom: '4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{getPlatformName(getPreviewPlatform())}</div>
//                                         <div style={{ fontSize: '14px', color: '#65676b', display: 'flex', alignItems: 'center', gap: '6px', fontWeight: '400' }}>
//                                             <FontAwesomeIcon icon={faClock} />
//                                             <span>{isScheduled && scheduleDate ? `Scheduled for ${new Date(scheduleDate + 'T' + (scheduleTime || '00:00')).toLocaleDateString()}` : 'Just now'}</span>
//                                             <span>·</span>
//                                             <FontAwesomeIcon icon={faGlobe} />
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Text Preview */}
//                                 {(getDisplayText()) && (
//                                     <div style={{ padding: '0 20px 20px', fontSize: '17px', color: '#1c1e21', lineHeight: '1.5', whiteSpace: 'pre-wrap', minHeight: '24px' }}>
//                                         {getDisplayText()}
//                                     </div>
//                                 )}
//                                 {/* Media Preview */}
//                                 {mediaPreviewUrl && (
//                                     <div style={{ width: '100%', minHeight: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f8f9fa' }}>
//                                         {mediaType === 'image' ? (
//                                             <img src={mediaPreviewUrl} alt="Post content" style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '400px', objectFit: 'contain' }} />
//                                         ) : (
//                                             <video src={mediaPreviewUrl} controls style={{ width: '100%', height: 'auto', display: 'block', maxHeight: '400px', objectFit: 'contain' }} />
//                                         )}
//                                     </div>
//                                 )}
//                                 {/* Placeholder */}
//                                 {!(getDisplayText()) && !mediaPreviewUrl && (
//                                     <div style={{ padding: '40px 20px', textAlign: 'center', color: '#65676b', fontSize: '15px', fontStyle: 'italic', backgroundColor: '#f8f9fa', minHeight: '120px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
//                                         Your {getPreviewPlatform()} post preview will appear here
//                                     </div>
//                                 )}

//                                 {/* Engagement Buttons (Static) */}
//                                 <div style={{ borderTop: '1px solid #e4e6ea', padding: '20px 32px' }}>
//                                     {/* ... (Like, Comment, Share buttons - same as your code) ... */}
//                                     <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '32px' }}>
//                                         {/* Like */}
//                                         <button type="button" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '14px 24px', borderRadius: '10px', transition: 'background-color 0.2s ease', flex: '1', justifyContent: 'center', minWidth: '0', background: 'none', border: 'none' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f2f2f2'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
//                                             <img src="/icons/like.svg" alt="Like" style={{ width: '22px', height: '22px' }} onError={(e) => e.target.style.display = 'none'} />
//                                             <span style={{ fontSize: '15px', fontWeight: '600', color: '#65676b' }}>Like</span>
//                                         </button>
//                                         {/* Comment */}
//                                         <button type="button" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '14px 24px', borderRadius: '10px', transition: 'background-color 0.2s ease', flex: '1', justifyContent: 'center', minWidth: '0', background: 'none', border: 'none' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f2f2f2'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
//                                             <img src="/icons/comment.svg" alt="Comment" style={{ width: '22px', height: '22px' }} onError={(e) => e.target.style.display = 'none'} />
//                                             <span style={{ fontSize: '15px', fontWeight: '600', color: '#65676b' }}>Comment</span>
//                                         </button>
//                                         {/* Share */}
//                                         <button type="button" style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', padding: '14px 24px', borderRadius: '10px', transition: 'background-color 0.2s ease', flex: '1', justifyContent: 'center', minWidth: '0', background: 'none', border: 'none' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f2f2f2'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
//                                             <img src="/icons/share.svg" alt="Share" style={{ width: '22px', height: '22px' }} onError={(e) => e.target.style.display = 'none'} />
//                                             <span style={{ fontSize: '15px', fontWeight: '600', color: '#65676b' }}>Share</span>
//                                         </button>
//                                     </div>
//                                 </div>
//                             </div>
//                         </div>
//                     </div>
//                 </div> {/* End right-panel */}
//             </div> {/* End main-content */}
//         </div > // End create-post-container
//     );
// };

// export default CreatePost;