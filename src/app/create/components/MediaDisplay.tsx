import React from 'react';
import MediaFallback from './MediaFallback'; // Ensure this component is created
import { Media } from '@/lib/types'; // Ensure this type is defined
const PUBLIC_CORKBOARD_URL = process.env.NEXT_PUBLIC_CORKBOARD_URL;

interface MediaComponentProps {
  media: Media;
  fit: string;
}

const MediaComponent: React.FC<MediaComponentProps> = ({ media, fit }) => {
  if ('Base64' in media.Image) {
    return media.Image.Base64.data !== '' ? (
      <img
        style={{ display: 'flex', height: '100%', width: '100%', objectFit: 'cover' }}
        alt={media.Image.Base64.alt}
        src={media.Image.Base64.data}
      />
    ) : (
      <MediaFallback />
    );
  } else if ('Corkboard' in media.Image) {
    return (
      <img
        style={{ display: 'flex', height: '100%', width: '100%', objectFit: 'cover' }}
        src={`${PUBLIC_CORKBOARD_URL}/get/${media.Image.Corkboard.id}`}
        alt={media.Image.Corkboard.alt}
      />
    );
  } else if ('Url' in media.Image) {
    return (
      <div
        style={{
          display: 'flex',
          height: '100%',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div dangerouslySetInnerHTML={{ __html: media.Image.Url.url }} />
      </div>
    );
  }

  return null;
};

export default MediaComponent;
