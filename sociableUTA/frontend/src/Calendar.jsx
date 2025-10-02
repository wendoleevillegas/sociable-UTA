import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { fetchPlatformCalendarEvents, fetchPlatformNotifications } from './ApiDataService';
import { getScheduledEvents } from './ScheduledPostsStore';
import './Calendar.css';

export const Calendar = ({ token, setToken, apiSource = 'instagram', selectedSources = ['instagram'], onNavigate }) => {
  const [events, setEvents] = useState([]);
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

  // notifications removed
  const getPlatformIconSrc = (p) => {
    switch (p) {
      case 'Facebook': return '/icons/facebook.svg';
      case 'Instagram': return '/icons/instagram.svg';
      case 'LinkedIn': return '/icons/linkedin.svg';
      case 'X': return '/icons/x.svg';
      default: return null;
    }
  };
  const computeStatus = (ev) => {
    const s = ev.extendedProps?.state;
    if (s === 'archived') return 'Archived';
    const startDate = typeof ev.start === 'string' ? new Date(ev.start) : ev.start;
    if (startDate && startDate.getTime() > Date.now()) return 'Scheduled';
    return 'Published';
  };

  const renderEventContent = (arg) => {
    const { event, timeText } = arg;
  const mediaUrl = event.extendedProps?.mediaUrl;
  const mediaType = event.extendedProps?.mediaType;
  const title = event.title || '';
  const description = event.extendedProps?.description || '';
  const platform = event.extendedProps?.platform;
  const boostable = event.extendedProps?.boostable;
    const state = event.extendedProps?.state;
  const collaborators = Array.isArray(event.extendedProps?.collaborators) ? event.extendedProps.collaborators : [];
    const PLATFORM_COLORS = {
      Facebook: '#1877F2',
      Instagram: '#E4405F',
      LinkedIn: '#0A66C2',
      X: '#000000'
    };
    const platformColor = PLATFORM_COLORS[platform] || '#666';
    const tintedBg = state === 'archived' ? '#FFEDE5' : (platform === 'X' ? '#f3f4f6' : `${platformColor}1A`); // peach for archived

    const TitleRow = (
      <div className="fc-event-card-title" style={{ marginTop: mediaUrl ? 6 : 0 }} title={title}>{title}</div>
    );
    const DescRow = description ? (
      <div className="fc-event-card-desc" title={description}>{description}</div>
    ) : null;

    const FooterRow = (
      <div className="fc-event-meta">
        <span className="fc-event-time">{timeText}</span>
        <div style={{ display: 'inline-flex', gap: 6, alignItems: 'center' }}>
          {collaborators.length > 0 && (
            <span className="platform-pill" title={collaborators.map(c=>c.name).join(', ')}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                {collaborators.slice(0,2).map((c, idx) => (
                  <span key={idx} style={{
                    width: 14, height: 14, borderRadius: '50%', background: '#e5e7eb', display: 'inline-block', overflow: 'hidden'
                  }}>
                    {c.avatar ? <img src={c.avatar} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : null}
                  </span>
                ))}
              </span>
              <span>{collaborators.length} collab{collaborators.length>1?'s':''}</span>
            </span>
          )}
          {platform && (
            <span className="platform-pill">
              {getPlatformIconSrc(platform) && (
                <img src={getPlatformIconSrc(platform)} alt={platform} style={{ width: 12, height: 12 }} />
              )}
              <span>{platform}</span>
            </span>
          )}
          <span className={`status-pill status-${(state||'').toString().toLowerCase() || computeStatus(event).toLowerCase()}`}>
            {computeStatus(event)}
          </span>
        </div>
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
          {DescRow}
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
          {DescRow}
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
        {DescRow}
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
          collaborators: event.extendedProps?.collaborators || event.collaborators || [],
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
    // notifications removed
    return () => window.removeEventListener('scheduled-posts-updated', handler);
  }, [token, apiSource, JSON.stringify(selectedSources)]);

  return (
    <div className="calendar-root">
      <div className="calendar-container">
        <div className="calendar-main" style={{ flex: 1 }}>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            headerToolbar={{
              left: '',
              center: 'prev,title,next',
              right: 'today'
            }}
            events={events}
            height={920}
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
                    const title = event.title || '';
                    const desc = event.extendedProps?.description || '';
                    const platform = event.extendedProps?.platform;
                    const mediaUrl = event.extendedProps?.mediaUrl;
                    const mediaType = event.extendedProps?.mediaType;
                    const timeStr = (typeof event.start === 'string'
                      ? new Date(event.start)
                      : event.start)?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || '';
                    const status = computeStatus(event);
                    const collaborators = Array.isArray(event.extendedProps?.collaborators) ? event.extendedProps.collaborators : [];
                    return (
                      <div key={event.id || index} className="calendar-event-item">
                        <div className="event-thumb">
                          {mediaUrl ? (
                            mediaType === 'video' ? (
                              <div className="thumb-video">▶</div>
                            ) : (
                              <img src={mediaUrl} alt="media" />
                            )
                          ) : (
                            <div className="thumb-icon">
                              {getPlatformIconSrc(platform) && (
                                <img src={getPlatformIconSrc(platform)} alt={platform || 'platform'} />
                              )}
                            </div>
                          )}
                        </div>
                        <div className="event-body">
                          <div className="event-title-row">
                            <div className="event-title" title={title}>{title}</div>
                            <span className={`status-pill status-${status.toLowerCase()}`}>{status}</span>
                          </div>
                          {desc && <div className="event-desc" title={desc}>{desc}</div>}
                          <div className="event-meta">
                            <span className="meta-time">{timeStr}</span>
                            <span className="platform-pill">
                              {getPlatformIconSrc(platform) && (
                                <img src={getPlatformIconSrc(platform)} alt={platform || 'platform'} />
                              )}
                              <span>{platform}</span>
                            </span>
                            {collaborators.length > 0 && (
                              <span className="platform-pill" title={collaborators.map(c=>c.name).join(', ')}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: 2 }}>
                                  {collaborators.slice(0,3).map((c, idx) => (
                                    <span key={idx} style={{
                                      width: 16, height: 16, borderRadius: '50%', background: '#e5e7eb', display: 'inline-block', overflow: 'hidden'
                                    }}>
                                      {c.avatar ? <img src={c.avatar} alt={c.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : null}
                                    </span>
                                  ))}
                                </span>
                                <span>{collaborators.length}</span>
                              </span>
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
}