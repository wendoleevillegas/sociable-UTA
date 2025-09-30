import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { fetchPlatformCalendarEvents, fetchPlatformNotifications } from './ApiDataService';
import { getScheduledEvents } from './ScheduledPostsStore';
import { NotificationPanel } from './NotificationPanel';
import './Calendar.css';

export const Calendar = ({ token, setToken, apiSource = 'instagram', selectedSources = ['instagram'], onNavigate }) => {
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [dayEvents, setDayEvents] = useState([]);

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

  const renderEventContent = (arg) => {
    const { event, timeText } = arg;
    const mediaUrl = event.extendedProps?.mediaUrl;
    const mediaType = event.extendedProps?.mediaType;
    const title = event.title || '';
    const platform = event.extendedProps?.platform;
  const boostable = event.extendedProps?.boostable;
    const state = event.extendedProps?.state;
    const PLATFORM_COLORS = {
      Facebook: '#1877F2',
      Instagram: '#E4405F',
      LinkedIn: '#0A66C2',
      X: '#000000'
    };
    const platformColor = PLATFORM_COLORS[platform] || '#666';
    const tintedBg = state === 'archived' ? '#FFEDE5' : (platform === 'X' ? '#f3f4f6' : `${platformColor}1A`); // peach for archived

    const getPlatformIconSrc = (p) => {
      switch (p) {
        case 'Facebook': return '/icons/facebook.svg';
        case 'Instagram': return '/icons/instagram.svg';
        case 'LinkedIn': return '/icons/linkedin.svg';
        case 'X': return '/icons/x.svg';
        default: return null;
      }
    };

    const TitleRow = (
      <div style={{
        fontSize: 12,
        fontWeight: 600,
        lineHeight: 1.2,
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
        marginTop: mediaUrl ? 6 : 0
      }} title={title}>
        {title}
      </div>
    );

    const FooterRow = (
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <span style={{ fontSize: 11, opacity: 0.8 }}>{timeText}</span>
        {platform && <span style={{ fontSize: 11, opacity: 0.8 }}>{platform}</span>}
      </div>
    );

    const Card = ({ children }) => (
      <div style={{
        background: tintedBg,
        borderRadius: 10,
        border: `1px solid ${platformColor}33`,
        overflow: 'hidden',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        padding: 8
      }}>
        {children}
      </div>
    );

    const Badge = platform ? (
      <div style={{
        position: 'absolute',
        top: 6,
        right: 6,
        height: 22,
        width: 22,
        background: '#fff',
        border: `1px solid ${platformColor}80`,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
        {getPlatformIconSrc(platform) && (
          <img src={getPlatformIconSrc(platform)} alt={platform} style={{ width: 12, height: 12 }} />
        )}
      </div>
    ) : null;

    const TimePill = (
      <div style={{
        position: 'absolute',
        top: 6,
        left: 6,
        background: '#e6f4ea',
        color: '#0b6b3a',
        border: '1px solid #9ad1b4',
        borderRadius: 8,
        padding: '2px 6px',
        fontSize: 10,
        fontWeight: 700
      }}>
        {timeText || '—'}
      </div>
    );

    const ArchivedTag = state === 'archived' ? (
      <div style={{
        marginTop: 6,
        fontSize: 10,
        fontWeight: 700,
        color: '#B45309',
        background: '#FEF3C7',
        border: '1px solid #F59E0B',
        borderRadius: 8,
        width: 'fit-content',
        padding: '2px 6px'
      }}>Archived</div>
    ) : null;

    const MetricsRow = null;

    const BoostRow = boostable ? (
      <div style={{ marginTop: 6 }}>
        <button style={{
          background: '#fff',
          border: `1px solid ${platformColor}55`,
          color: platformColor,
          borderRadius: 8,
          padding: '4px 10px',
          fontSize: 12,
          fontWeight: 700,
          cursor: 'pointer'
        }}>Boost</button>
      </div>
    ) : null;

    if (mediaUrl && mediaType === 'image') {
      return (
        <Card>
          <div style={{ position: 'relative' }}>
            <img src={mediaUrl} alt="media" style={{ width: '100%', height: 96, objectFit: 'cover', borderRadius: 8 }} />
            {TimePill}
            {Badge}
          </div>
          {TitleRow}
          {ArchivedTag}
          {FooterRow}
          {MetricsRow}
          {BoostRow}
        </Card>
      );
    }

    if (mediaUrl && mediaType === 'video') {
      return (
        <Card>
          <div style={{ position: 'relative' }}>
            <div style={{
              height: 96,
              width: '100%',
              borderRadius: 8,
              background: 'linear-gradient(180deg, rgba(0,0,0,0.2), rgba(0,0,0,0.2)), #000',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff',
              fontSize: 12,
              fontWeight: 700
            }}>
              ▶ Video
            </div>
            {TimePill}
            {Badge}
          </div>
          {TitleRow}
          {ArchivedTag}
          {FooterRow}
          {MetricsRow}
          {BoostRow}
        </Card>
      );
    }

    return (
      <Card>
        {TitleRow}
        {ArchivedTag}
        {FooterRow}
        {MetricsRow}
        {BoostRow}
      </Card>
    );
  };

  const fetchEvents = async () => {
    try {
      const sources = Array.isArray(selectedSources) && selectedSources.length ? selectedSources : [apiSource];
      const results = await Promise.all(
        sources.map(async (src) => {
          const remote = await fetchPlatformCalendarEvents(src);
          const local = getScheduledEvents({ platform: src });
          return [...remote, ...local].map(ev => ({
            ...ev,
            platform: ev.platform || src
          }));
        })
      );
      const all = results.flat();

      const fetchedEvents = all.map((event) => ({
        title: event.title,
        start: event.start,
        end: event.end,
        backgroundColor: event.backgroundColor || event.color,
        borderColor: event.borderColor || event.color,
        extendedProps: {
          description: event.description,
          platform: event.platform,
          type: event.type,
          mediaType: event.extendedProps?.mediaType || event.mediaType,
          mediaUrl: event.extendedProps?.mediaUrl || event.mediaUrl,
          metrics: undefined,
          boostable: event.extendedProps?.boostable || event.boostable,
          state: event.extendedProps?.state || event.state,
        },
        id: event.id,
      }));

      setEvents(fetchedEvents);
      
    } catch (err) {
      console.error(`Error fetching events:`, err);
    }
  };

  useEffect(() => {
    fetchEvents();
    const handler = () => fetchEvents();
    window.addEventListener('scheduled-posts-updated', handler);
    
    // Fetch platform notifications
    const fetchNotifications = async () => {
      try {
        const firstSource = (selectedSources && selectedSources[0]) || apiSource;
        const platformNotifications = await fetchPlatformNotifications(firstSource);
        setNotifications(platformNotifications);
      } catch (err) {
        console.error(`Error fetching notifications:`, err);
      }
    };

    fetchNotifications();
    return () => window.removeEventListener('scheduled-posts-updated', handler);
  }, [token, apiSource, JSON.stringify(selectedSources)]);

  return (
    <div className="calendar-root">
      <div className="calendar-container">
        <div className="calendar-main">
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: '',
              center: 'prev,title,next',
              right: 'today'
            }}
            events={events}
            height={800}
            dayMaxEventRows={3}
            moreLinkClick="popover"
            fixedWeekCount={false}
            showNonCurrentDates={false}
            eventDisplay="block"
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            selectable={true}
            dateClick={handleDateClick}
            dayCellContent={(info) => {
              return info.dayNumberText;
            }}
            dayHeaderFormat={{ weekday: 'short' }}
          />
        </div>
        
        {/* Platform Notifications Panel */}
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
                  {dayEvents.map((event, index) => (
                    <div key={event.id || index} className="calendar-event-item">
                      <div className="event-title">{event.title}</div>
                      <div className="event-details">
                        {event.extendedProps?.description && (
                          <div className="event-description">
                            {event.extendedProps.description}
                          </div>
                        )}
                        {event.extendedProps?.mediaUrl && (
                          <div style={{ marginTop: '8px' }}>
                            {event.extendedProps.mediaType === 'video' ? (
                              <video src={event.extendedProps.mediaUrl} controls style={{ width: '100%', borderRadius: 8 }} />
                            ) : (
                              <img src={event.extendedProps.mediaUrl} alt="media" style={{ width: '100%', borderRadius: 8 }} />
                            )}
                          </div>
                        )}
                        {event.extendedProps?.platform && (
                          <div className="event-type">
                            {event.extendedProps.platform}
                          </div>
                        )}
                        <div className="event-time">
                          {typeof event.start === 'string' 
                            ? new Date(event.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                            : event.start?.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
                          }
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}