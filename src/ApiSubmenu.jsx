import React from 'react';
import './ApiSubmenu.css';

export const ApiSubmenu = ({ selectedSources, onSourceChange }) => {
  const platforms = [
    { id: 'instagram', name: 'Instagram', color: '#E4405F' },
    { id: 'facebook', name: 'Facebook', color: '#1877F2' },
    { id: 'x', name: 'X', color: '#000000' },
    { id: 'linkedin', name: 'LinkedIn', color: '#0A66C2' }
  ];

  // Multi-select logic for buttons
  const handleButtonClick = (platformId) => {
    if (selectedSources.includes(platformId)) {
      onSourceChange(selectedSources.filter(id => id !== platformId));
    } else {
      onSourceChange([...selectedSources, platformId]);
    }
  };

  return (
    <div className="api-submenu">
      <div className="api-submenu-container">
        {platforms.map(platform => (
          <button
            key={platform.id}
            className={`api-submenu-item ${selectedSources.includes(platform.id) ? 'active' : ''}`}
            onClick={() => handleButtonClick(platform.id)}
            style={{
              ...(selectedSources.includes(platform.id) && {
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
