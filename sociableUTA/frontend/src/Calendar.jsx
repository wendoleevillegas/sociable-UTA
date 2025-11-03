import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { NotificationPanel } from './NotificationPanel';
import './Calendar.css';

export const Calendar = ({ token, setToken, apiSource = 'all', onNavigate }) => {
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dayEvents, setDayEvents] = useState([]);

  useEffect(() => {
    // Generate mock scheduled posts with media for demonstration
    const generateMockScheduledPosts = () => {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      
      const dayAfterTomorrow = new Date(today);
      dayAfterTomorrow.setDate(today.getDate() + 2);
      
      const nextWeek = new Date(today);
      nextWeek.setDate(today.getDate() + 7);

      const formatDate = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      // Load events from localStorage (created by CreatePost component)
      const storedEvents = JSON.parse(localStorage.getItem('calendarEvents') || '[]');
      console.log('Loading stored events from localStorage:', storedEvents);

      const allMockEvents = [
        {
          id: 'post_1',
          title: 'New Course Announcement - AI & Machine Learning',
          start: formatDate(tomorrow),
          end: formatDate(tomorrow),
          backgroundColor: '#1877F2',
          borderColor: '#1877F2',
          extendedProps: {
            description: 'Exciting news! We are launching a new AI & Machine Learning course next semester. Register now for early bird pricing and secure your spot in this cutting-edge program!',
            platforms: ['Facebook', 'Instagram'],
            media: {
              type: 'image',
              url: 'https://via.placeholder.com/600x400/1877F2/white?text=AI+Course+Announcement',
              filename: 'ai_course.jpg'
            },
            isPublished: false,
            createdAt: new Date(),
            postId: 'post_1'
          }
        },
        {
          id: 'post_2',
          title: 'Student Spotlight: John\'s Google Internship Journey',
          start: formatDate(dayAfterTomorrow),
          end: formatDate(dayAfterTomorrow),
          backgroundColor: '#E4405F',
          borderColor: '#E4405F',
          extendedProps: {
            description: 'Meet John, a computer science senior who just completed his internship at Google. Hear about his amazing journey, the projects he worked on, and his top tips for landing your dream tech internship!',
            platforms: ['Instagram'],
            media: {
              type: 'video',
              url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
              filename: 'student_spotlight.mp4'
            },
            isPublished: false,
            createdAt: new Date(),
            postId: 'post_2'
          }
        },
        {
          id: 'post_3',
          title: 'Campus Tech Fair 2025 - Innovation Showcase',
          start: formatDate(nextWeek),
          end: formatDate(nextWeek),
          backgroundColor: '#0A66C2',
          borderColor: '#0A66C2',
          extendedProps: {
            description: 'Join us for the annual Campus Tech Fair where students showcase their innovative projects. Meet recruiters from top tech companies like Google, Microsoft, Apple, and more!',
            platforms: ['LinkedIn', 'Facebook'],
            media: {
              type: 'image',
              url: 'https://via.placeholder.com/600x400/0A66C2/white?text=Tech+Fair+2025',
              filename: 'tech_fair.jpg'
            },
            isPublished: false,
            createdAt: new Date(),
            postId: 'post_3'
          }
        },
        {
          id: 'post_4',
          title: 'Quick Coding Tip: JavaScript Debugging',
          start: formatDate(today),
          end: formatDate(today),
          backgroundColor: '#000000',
          borderColor: '#000000',
          extendedProps: {
            description: 'Pro tip: Use console.log() strategically and browser dev tools to debug your JavaScript code efficiently. Master these techniques to become a better developer! #CodingTips #WebDev #JavaScript',
            platforms: ['X'],
            media: null,
            isPublished: true,
            createdAt: new Date(),
            postId: 'post_4'
          }
        },
        {
          id: 'post_5',
          title: 'Welcome New CS Students - Fall 2025 Orientation',
          start: formatDate(new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)),
          end: formatDate(new Date(today.getTime() + 3 * 24 * 60 * 60 * 1000)),
          backgroundColor: '#1877F2',
          borderColor: '#1877F2',
          extendedProps: {
            description: 'Welcome to all our new Computer Science students! Join us for orientation week with campus tours, meet & greet sessions, and academic planning.',
            platforms: ['Facebook', 'LinkedIn'],
            media: {
              type: 'image',
              url: 'https://via.placeholder.com/600x400/1877F2/white?text=Welcome+CS+Students',
              filename: 'orientation.jpg'
            },
            isPublished: false,
            createdAt: new Date(),
            postId: 'post_5'
          }
        },
        {
          id: 'post_6',
          title: 'Research Breakthrough: New Algorithm for Faster Data Processing',
          start: formatDate(new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000)),
          end: formatDate(new Date(today.getTime() + 4 * 24 * 60 * 60 * 1000)),
          backgroundColor: '#0A66C2',
          borderColor: '#0A66C2',
          extendedProps: {
            description: 'Our research team has developed a groundbreaking algorithm that processes big data 3x faster than current methods. Read about this innovation in our latest publication.',
            platforms: ['LinkedIn'],
            media: {
              type: 'image',
              url: 'https://via.placeholder.com/600x400/0A66C2/white?text=Research+Breakthrough',
              filename: 'research.jpg'
            },
            isPublished: false,
            createdAt: new Date(),
            postId: 'post_6'
          }
        },
        {
          id: 'post_7',
          title: 'Behind the Scenes: Student Life at CS Department',
          start: formatDate(new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)),
          end: formatDate(new Date(today.getTime() + 5 * 24 * 60 * 60 * 1000)),
          backgroundColor: '#E4405F',
          borderColor: '#E4405F',
          extendedProps: {
            description: 'Get a glimpse into daily life of our computer science students! From coding sessions to group projects, see what makes our department special. 📚💻',
            platforms: ['Instagram'],
            media: {
              type: 'video',
              url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
              filename: 'student_life.mp4'
            },
            isPublished: false,
            createdAt: new Date(),
            postId: 'post_7'
          }
        },
        {
          id: 'post_8',
          title: 'Weekly Motivation: Never Give Up on Your Dreams',
          start: formatDate(new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000)),
          end: formatDate(new Date(today.getTime() + 6 * 24 * 60 * 60 * 1000)),
          backgroundColor: '#000000',
          borderColor: '#000000',
          extendedProps: {
            description: 'Every expert was once a beginner. Every pro was once an amateur. Every icon was once an unknown. Keep pushing forward! 💪 #MondayMotivation #CodingJourney',
            platforms: ['X'],
            media: null,
            isPublished: false,
            createdAt: new Date(),
            postId: 'post_8'
          }
        }
      ];

      // Convert stored events from CreatePost to calendar format
      const formattedStoredEvents = storedEvents.map(storedEvent => ({
        id: storedEvent.id,
        title: storedEvent.title,
        start: storedEvent.start.split('T')[0], // Extract date part
        end: storedEvent.start.split('T')[0],
        backgroundColor: storedEvent.backgroundColor,
        borderColor: storedEvent.borderColor,
        extendedProps: {
          description: storedEvent.description,
          platforms: [storedEvent.platform],
          media: storedEvent.hasMedia ? {
            type: storedEvent.mediaType,
            url: 'Published content media',
            filename: `${storedEvent.platform.toLowerCase()}_media.${storedEvent.mediaType === 'image' ? 'jpg' : 'mp4'}`
          } : null,
          isPublished: true, // These are published posts
          createdAt: new Date(storedEvent.start),
          postId: storedEvent.id,
          collaborator: storedEvent.collaborator,
          scheduledTime: storedEvent.start.split('T')[1] // Keep the time part for display
        }
      }));

      // Combine mock events with stored events
      const allEvents = [...allMockEvents, ...formattedStoredEvents];
      console.log('Combined events (mock + stored):', allEvents);

      // Filter events based on selected platform
      let filteredEvents = allEvents;
      
      if (apiSource && apiSource !== 'all') {
        const platformMapping = {
          'instagram': 'Instagram',
          'facebook': 'Facebook', 
          'x': 'X',
          'linkedin': 'LinkedIn'
        };
        
        const targetPlatform = platformMapping[apiSource.toLowerCase()];
        
        if (targetPlatform) {
          filteredEvents = allEvents.filter(event => 
            event.extendedProps.platforms.includes(targetPlatform)
          );
        }
      }

      setEvents(filteredEvents);
    };

    // Generate mock notifications
    const generateMockNotifications = () => {
      setNotifications([
        {
          id: 'notif_1',
          title: 'Post scheduled successfully',
          message: 'Your AI course announcement is scheduled for tomorrow',
          unread: true,
          targetPage: 'calendar'
        }
      ]);
    };

    generateMockScheduledPosts();
    generateMockNotifications();

    // Listen for localStorage changes (when new events are added from CreatePost)
    const handleStorageChange = (e) => {
      if (e.key === 'calendarEvents') {
        console.log('localStorage calendarEvents changed, refreshing calendar...');
        generateMockScheduledPosts();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also listen for custom events (for same-tab updates)
    const handleCustomEvent = () => {
      console.log('Custom calendarEventsUpdated event received, refreshing calendar...');
      generateMockScheduledPosts();
    };

    window.addEventListener('calendarEventsUpdated', handleCustomEvent);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('calendarEventsUpdated', handleCustomEvent);
    };
  }, [apiSource, token]);

  const handleDateClick = (info) => {
    const clickedDate = info.dateStr;
    setSelectedDate(clickedDate);

    const eventsForDay = events.filter((evt) => {
      let eventDateStr;
      if (typeof evt.start === 'string') {
        eventDateStr = evt.start.slice(0, 10);
      } else if (evt.start instanceof Date) {
        eventDateStr = evt.start.toISOString().slice(0, 10);
      }
      return eventDateStr === clickedDate;
    });

    setDayEvents(eventsForDay);
    setShowModal(true);
  };

  const handleEventClick = (info) => {
    const eventDate = info.event.startStr.slice(0, 10);
    setSelectedDate(eventDate);
    setDayEvents([info.event]);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedDate(null);
    setDayEvents([]);
  };

  const handleNotificationClick = (notificationId) => {
    const clickedNotification = notifications.find(n => n.id === notificationId);

    setNotifications(prev =>
      prev.map(notification =>
        notification.id === notificationId
          ? { ...notification, unread: false }
          : notification
      )
    );

    if (clickedNotification?.targetPage && onNavigate) {
      onNavigate(clickedNotification.targetPage);
    }
  };

  const unreadCount = notifications.filter(n => n.unread).length;

  // Custom event content renderer to show more information
  const renderEventContent = (eventInfo) => {
    const { event } = eventInfo;
    const extendedProps = event.extendedProps || {};
    
    return (
      <div className="fc-event-custom">
        <div className="fc-event-title-wrapper">
          <div className="fc-event-title-text">{event.title}</div>
          <div className="fc-event-platforms">
            {extendedProps.platforms && extendedProps.platforms.map(platform => (
              <span key={platform} className={`fc-platform-badge fc-platform-${platform.toLowerCase()}`}>
                {platform.charAt(0)}
              </span>
            ))}
          </div>
        </div>
        {extendedProps.media && (
          <div className="fc-event-media-indicator">
            <span className="fc-media-icon">
              {extendedProps.media.type === 'image' ? '🖼️' : extendedProps.media.type === 'video' ? '🎥' : '📄'}
            </span>
          </div>
        )}
        <div className="fc-event-description">
          {extendedProps.description && extendedProps.description.length > 60 
            ? extendedProps.description.substring(0, 60) + '...'
            : extendedProps.description}
        </div>
        <div className="fc-event-status">
          <span className={`fc-status-badge ${extendedProps.isPublished ? 'fc-published' : 'fc-scheduled'}`}>
            {extendedProps.isPublished ? 'Published' : 'Scheduled'}
          </span>
        </div>
      </div>
    );
  };

  return (
    <div className="calendar-root">
      <div className="calendar-container">
        <div className="calendar-main">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{ left: '', center: 'prev,title,next', right: 'today' }}
            events={events}
            height={800}
            dayMaxEventRows={false}
            moreLinkClick="popover"
            eventDisplay="block"
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            selectable={true}
            select={handleDateClick}
            eventClassNames="fc-custom-event"
            eventMinHeight={120}
            dayHeaderFormat={{ weekday: 'short' }}
          />
        </div>
        <div className="calendar-notifications">
          <NotificationPanel
            notifications={notifications}
            onNotificationClick={handleNotificationClick}
            unreadCount={unreadCount}
          />
        </div>
      </div>
      {showModal && (
        <div className="calendar-modal-overlay" onClick={handleCloseModal}>
          <div className="calendar-modal" onClick={(e) => e.stopPropagation()}>
            <div className="calendar-modal-header">
              <h3>Events for {selectedDate}</h3>
              <button className="calendar-modal-close" onClick={handleCloseModal}>
                ×
              </button>
            </div>
            <div className="calendar-modal-content">
              {dayEvents.length === 0 ? (
                <p className="calendar-no-events">No events for this date.</p>
              ) : (
                <div className="calendar-events-list">
                  {dayEvents.map((event, index) => {
                    const extendedProps = event.extendedProps || {};
                    return (
                      <div key={event.id || index} className="calendar-event-item">
                        <div className="event-header">
                          <div className="event-title">{event.title}</div>
                          <div className="event-platforms">
                            {extendedProps.platforms && extendedProps.platforms.map(platform => (
                              <span key={platform} className={`platform-badge platform-${platform.toLowerCase()}`}>
                                {platform}
                              </span>
                            ))}
                          </div>
                        </div>
                        
                        {extendedProps.media && (
                          <div className="event-media">
                            {extendedProps.media.type === 'image' ? (
                              <img 
                                src={extendedProps.media.url} 
                                alt="Post media" 
                                className="event-media-preview"
                              />
                            ) : extendedProps.media.type === 'video' ? (
                              <video 
                                src={extendedProps.media.url} 
                                className="event-media-preview"
                                controls
                              />
                            ) : null}
                          </div>
                        )}
                        
                        <div className="event-details">
                          {extendedProps.description && (
                            <div className="event-description">
                              {extendedProps.description}
                            </div>
                          )}
                          <div className="event-meta">
                            <div className="event-time">
                              Scheduled: {typeof event.start === 'string'
                                ? new Date(event.start).toLocaleString()
                                : event.start?.toLocaleString()
                              }
                            </div>
                            {extendedProps.isPublished ? (
                              <span className="event-status published">Published</span>
                            ) : (
                              <span className="event-status scheduled">Scheduled</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};