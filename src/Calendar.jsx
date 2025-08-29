import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { fetchPlatformCalendarEvents, fetchPlatformNotifications } from './ApiDataService';
import { NotificationPanel } from './NotificationPanel';
import './Calendar.css';

export const Calendar = ({ token, setToken, apiSource = 'instagram', onNavigate }) => {
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

  const fetchEvents = async () => {
    try {
      const mockEvents = await fetchPlatformCalendarEvents(apiSource);

      const fetchedEvents = mockEvents.map((event) => ({
        title: event.title,
        start: event.start,
        end: event.end,
        backgroundColor: event.color,
        borderColor: event.color,
        extendedProps: {
          description: event.description,
          platform: event.platform,
          type: event.type,
        },
        id: event.id,
      }));

      setEvents(fetchedEvents);

    } catch (err) {
      console.error(`Error fetching ${apiSource} events:`, err);
    }
  };

  useEffect(() => {
    fetchEvents();

    // Fetch platform notifications
    const fetchNotifications = async () => {
      try {
        const platformNotifications = await fetchPlatformNotifications(apiSource);
        setNotifications(platformNotifications);
      } catch (err) {
        console.error(`Error fetching ${apiSource} notifications:`, err);
      }
    };

    fetchNotifications();
  }, [token, apiSource]); // Added apiSource to dependency array

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
            eventBackgroundColor="#0A66C2"
            eventBorderColor="#0A66C2"
            eventTextColor="#ffffff"
            eventClick={handleEventClick}
            selectable={true}
            select={handleDateClick}
            dayCellContent={(info) => {
              return info.dayNumberText;
            }}
            eventClassNames="custom-event"
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
                        {event.extendedProps?.platform && (
                          <div className="event-type">
                            {event.extendedProps.platform}
                          </div>
                        )}
                        <div className="event-time">
                          {typeof event.start === 'string'
                            ? new Date(event.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                            : event.start?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
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