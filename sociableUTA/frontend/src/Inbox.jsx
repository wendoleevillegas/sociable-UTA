import React, { useState, useEffect } from 'react';
import { fetchPlatformInboxMessages, fetchPlatformNotifications } from './ApiDataService';
import { NotificationPanel } from './NotificationPanel';
import './Inbox.css';

export const Inbox = ({ token, apiSource = 'instagram', onNavigate }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const getPlatformConfig = (source) => {
    const configs = {
      instagram: {
        name: 'Instagram',
        color: '#E4405F',
        messageTypes: 'direct messages, story replies, and collaboration requests'
      },
      facebook: {
        name: 'Facebook',
        color: '#1877F2',
        messageTypes: 'personal messages, group notifications, and page interactions'
      },
      x: {
        name: 'X',
        color: '#000000',
        messageTypes: 'mentions, direct messages, and connection requests'
      },
      linkedin: {
        name: 'LinkedIn',
        color: '#0A66C2',
        messageTypes: 'professional messages, job opportunities, and networking requests'
      }
    };
    return configs[source] || configs.instagram;
  };

  const platformConfig = getPlatformConfig(apiSource);

  /*
   * FETCH MESSAGES EFFECT - Load messages when component mounts or API source changes
   * This effect runs when the component first loads and whenever the apiSource changes
   */
  useEffect(() => {
    /*
     * FETCH MESSAGES FUNCTION - Retrieves messages from the selected platform
     * Uses mock data service to simulate different platform responses
     */
    const fetchMessages = async () => {
      setLoading(true);
      try {
        // For demo purposes, use mock data service
        // In production, this would make actual API calls to different platforms
        const mockMessages = await fetchPlatformInboxMessages(apiSource);
        setMessages(mockMessages);
      } catch (err) {
        console.error(`Failed to fetch ${apiSource} messages:`, err);
        setMessages([]);
      } finally {
        setLoading(false);
      }
    };

    fetchMessages();
  }, [apiSource]); // Re-run effect when apiSource changes

  /*
   * HANDLE MESSAGE CLICK - Selects a message for detailed view
   * @param {Object} message - The message object that was clicked
   */
  const handleMessageClick = (message) => {
    setSelectedMessage(message);
    // In a real app, this would also mark the message as read
  };

  /*
   * GET MESSAGE TYPE STYLE - Returns styling based on message type
   * Different message types get different visual indicators
   */
  const getMessageTypeStyle = (messageType) => {
    const styles = {
      dm: { backgroundColor: '#e3f2fd' },
      notification: { backgroundColor: '#f3e5f5' },
      mention: { backgroundColor: '#fff3e0' },
      collaboration: { backgroundColor: '#e8f5e8' },
      group_message: { backgroundColor: '#fce4ec' },
      personal_message: { backgroundColor: '#e0f2f1' },
      invitation: { backgroundColor: '#f1f8e9' },
      professional_inquiry: { backgroundColor: '#e8eaf6' },
      job_opportunity: { backgroundColor: '#fff8e1' },
      speaking_opportunity: { backgroundColor: '#f3e5f5' }
    };
    return styles[messageType] || {};
  };

  /*
   * MAIN COMPONENT RENDER - Creates the complete inbox interface
   */
  return (
    <div className="inbox-container">
      <div className="inbox-main-container">
        {/* Platform indicator removed per user request */}
        <div className="inbox-layout">

          {/* MESSAGE LIST - Left sidebar with list of all messages */}
          <div className="inbox-message-list">
            <div className="inbox-header">
              <h3>Messages</h3>
              {loading && <div className="inbox-loading">Loading...</div>}
            </div>

            <div className="inbox-messages">
              {messages.map(message => (
                <div
                  key={message.id}
                  className={`inbox-message-item ${message.unread ? 'unread' : ''} ${selectedMessage?.id === message.id ? 'selected' : ''}`}
                  onClick={() => handleMessageClick(message)}
                  style={getMessageTypeStyle(message.messageType)}
                >
                  <div className="message-avatar">
                    <img src={message.senderAvatar} alt={message.senderName} />
                    {message.unread && <div className="unread-indicator"></div>}
                  </div>

                  <div className="message-content">
                    <div className="message-header">
                      <span className="message-sender">{message.senderName}</span>
                      <span className="message-time">{message.timestamp}</span>
                    </div>
                    <div className="message-preview">
                      {message.lastMessage}
                    </div>
                    <div className="message-type-badge">
                      {message.messageType.replace('_', ' ')}
                    </div>
                  </div>
                </div>
              ))}

              {/* EMPTY STATE - Show when no messages */}
              {!loading && messages.length === 0 && (
                <div className="inbox-empty">
                  <p>No messages from {platformConfig.name}</p>
                </div>
              )}
            </div>
          </div>

          {/* MESSAGE DETAIL - Right side detailed view of selected message */}
          <div className="inbox-message-detail">
            {selectedMessage ? (
              <div className="message-detail-content">
                <div className="message-detail-header">
                  <img src={selectedMessage.senderAvatar} alt={selectedMessage.senderName} />
                  <div className="message-header-info">
                    <h3>{selectedMessage.senderName}</h3>
                    <p className="message-detail-time">{selectedMessage.timestamp}</p>
                    <span className="message-detail-type" style={{ backgroundColor: platformConfig.color }}>
                      {selectedMessage.messageType.replace('_', ' ')}
                    </span>
                  </div>
                </div>

                <div className="message-detail-body">
                  <div className="message-conversation">
                    <div className="message-bubble incoming">
                      <p>{selectedMessage.lastMessage}</p>
                      <span className="message-timestamp">{selectedMessage.timestamp}</span>
                    </div>
                  </div>
                </div>

                <div className="message-reply-area">
                  <div className="chat-input-section">
                    <div className="chat-input-header">
                      <span className="typing-indicator">Type a message...</span>
                    </div>
                    <div className="reply-input-container">
                      <input
                        type="text"
                        placeholder={`Message ${selectedMessage.senderName}...`}
                        className="reply-input"
                      />
                      <div className="input-actions">
                        <button className="attachment-btn" title="Attach file">
                          📎
                        </button>
                        <button className="emoji-btn" title="Add emoji">
                          😊
                        </button>
                        <button className="reply-send-btn" style={{ backgroundColor: platformConfig.color }}>
                          <span>Send</span>
                          <span className="send-icon">➤</span>
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="message-actions">
                    <button className="action-btn primary">
                      Mark as Read
                    </button>
                    <button className="action-btn">
                      Archive
                    </button>
                    <button className="action-btn">
                      Block
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="inbox-no-selection">
                <div className="no-selection-icon">💬</div>
                <h3>Select a message</h3>
                <p>Choose a message from the list to start chatting</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
