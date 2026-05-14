import React from 'react';

const DevBar: React.FC = () => {
    const isProduction = import.meta.env.PROD;
    const version = import.meta.env.VITE_APP_VERSION || 'v0.0.0-unknown';

    if (isProduction) return null;

    return (
        <div className="dev-bar">
            <span>DEVELOPMENT ENVIRONMENT</span>
            <span className="dev-bar-badge">VERSION: {version}</span>
        </div>
    );
};

export default DevBar;
