import React from 'react';
import './ApiSubmenu.css';

export const ApiSubmenu = ({ activeSource, onSourceChange }) => {
  const platforms = [
    { id: 'instagram', name: 'Instagram', color: '#E4405F' },
    { id: 'facebook', name: 'Facebook', color: '#1877F2' },
    { id: 'x', name: 'X', color: '#000000' },
    { id: 'linkedin', name: 'LinkedIn', color: '#0A66C2' }
  ];

  return (
    <div className="api-submenu">
      <div className="api-submenu-container">
        {platforms.map(platform => (
          <button
            key={platform.id}
            className={`api-submenu-item ${activeSource === platform.id ? 'active' : ''}`}
            onClick={() => onSourceChange(platform.id)}
            style={{
              ...(activeSource === platform.id && {
                borderBottomColor: platform.color,
                color: platform.color
              })
            }}
          >
            {platform.name}
          </button>
        ))}
      </div>
    </div>
  );
};
