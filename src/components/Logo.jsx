import React from 'react';
import bixsolLogo from '../assets/Bixsol logo.jpg';

const Logo = ({ className = "logo-img", height = 48 }) => {
    return (
        <div className={`logo-wrapper ${className}`} style={{ height: `${height}px`, display: 'inline-block' }}>
            <img 
                src={bixsolLogo} 
                alt="BIXSOL Logo" 
                style={{ 
                    height: '100%', 
                    width: 'auto', 
                    display: 'block'
                }} 
            />
        </div>
    );
};

export default Logo;
