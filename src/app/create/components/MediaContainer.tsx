import React from 'react';
import MediaDisplay from './MediaDisplay'; // Ensure you have this component
import MediaFallback from './MediaFallback'; // Ensure you have this component
import { Media } from '@/lib/types'; // Ensure you have this type

interface Props {
  media?: Media;
  align?: 'center' | 'start' | 'end' | 'flex-start' | 'flex-end' | 'left' | 'right';
  fit?: 'scale-down' | 'cover' | 'contain';
  showFallback?: boolean;
}

const MediaComponent: React.FC<Props> = ({
  media,
  align = 'center',
  fit = 'scale-down',
  showFallback = true,
}) => {
  return (
    <div style={{
      maxHeight: '100%',
      display: 'flex',
      justifyContent: align,
      maxWidth: '100%',
      margin: 'auto',
      position: 'absolute',
      inset: 0
    }}>
      {media ? (
        <MediaDisplay media={media} fit={fit} />
      ) : (
        showFallback && <MediaFallback />
      )}
    </div>
  );
};

export default MediaComponent;
