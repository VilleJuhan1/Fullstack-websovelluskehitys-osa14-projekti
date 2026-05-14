import React from 'react';

const DevBar: React.FC = () => {
    const showDevBar = import.meta.env.VITE_SHOW_DEV_BAR === 'true';
    const version = import.meta.env.VITE_APP_VERSION || 'v0.0.0-unknown';

    if (!showDevBar) return null;

    return (
        <div className="dev-bar">
            <span>DEVELOPMENT ENVIRONMENT</span>
            <span className="dev-bar-badge">VERSION: {version}</span>
        </div>
    );
};

export default DevBar;
