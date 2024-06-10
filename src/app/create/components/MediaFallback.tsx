import React from 'react';
import image from '../lib/assets/image.svg'; // Adjust the path according to your project structure
// import Icon from './Icon'; // Ensure the path is correct

const MediaFallback: React.FC = () => {
  return (
    <div
      style={{
        height: '100%',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.4,
      }}
    >
      {/* <Icon src={image} alt="fallback" size="50%" /> */}
    </div>
  );
};

export default MediaFallback;
