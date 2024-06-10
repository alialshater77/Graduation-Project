// components/Thumbnail.tsx

import React from 'react';
import MultipleChoiceThumbnail from './MultipleChoiceThumbnail';
import delete_slide from '../public/assets/delete.svg'; // Adjust the path
import content_copy from '../public/assets/content_copy.svg'; // Adjust the path
// import IconButton from './IconButton'; // Adjust the path
import { Slide } from '@/lib/types'; // Adjust the path
import { Button } from '@/components/ui/button';

interface ThumbnailProps {
  slide: Slide;
  index: number;
  selected: boolean;
  onDelete: () => void;
  onDuplicate: () => void;
  onSelect: () => void;
}

const Thumbnail: React.FC<ThumbnailProps> = ({ slide, index, selected, onDelete, onDuplicate, onSelect }) => {
  return (
    <div style={{ display: 'flex', gap: '0.4em', boxSizing: 'border-box' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', flexDirection: 'column', textAlign: 'center', alignItems: 'center', gap: '0.4em' }}>
        <div>{index + 1}</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2em', padding: '0.2em 0' }}>
          <Button onClick={onDelete}  />
          <Button onClick={onDuplicate}   />
        </div>
      </div>
      <button
        className="thumb"
        style={{
          flex: 1,
          padding: 0,
          appearance: 'none',
          background: 'none',
          font: 'inherit',
          color: 'inherit',
          border: 'none',
          outline: selected ? '3px solid var(--accent-color)' : '1px solid darkgray',
          borderRadius: '0.5em',
          overflow: 'hidden',
          cursor: 'pointer'
        }}
        onClick={onSelect}
      >
        {'MultipleChoice' in slide && <MultipleChoiceThumbnail slide={slide.MultipleChoice} />}
      </button>
    </div>
  );
};

export default Thumbnail;
