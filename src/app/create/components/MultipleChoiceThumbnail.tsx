// components/MultipleChoiceSlide.tsx

import React from 'react';
// import * as m from '../messages'; // Adjust the path according to your project structure
// import { buttonColors } from '@/lib'; // Adjust the path according to your project structure
import MediaContainer from './MediaContainer';
import VerticalSplit from './VerticalSplit';

interface Answer {
  correct: boolean;
}

interface MultipleChoiceSlide {
  title: string;
  media?: string;
  answers: Answer[];
}

interface MultipleChoiceSlideProps {
  slide: MultipleChoiceSlide;
}

const MultipleChoiceSlideComponent: React.FC<MultipleChoiceSlideProps> = ({ slide }) => {
  const correctAnswers = slide.answers.filter((a) => a.correct).length;
  return (
    <div
      style={{
        display: 'flex',
        gap: '0.2em',
        height: '100%',
        overflow: 'hidden',
        flexDirection: 'column',
        justifyContent: 'space-between',
        background: 'var(--background-color)',
      }}
    >
      <div
        style={{
          padding: '0.2em',
          boxSizing: 'border-box',
          boxShadow: '0 2px 2px #00000040',
          textAlign: 'center',
          fontSize: '0.6em',
          whiteSpace: 'nowrap',
        }}
      >
        {slide.title ? slide.title : '...'}
      </div>
      <VerticalSplit>
        <div slot="top">
          {slide.media && (
            <div style={{ height: '50px' }}>
              <MediaContainer media={slide.media} />
            </div>
          )}
        </div>
        <div slot="bottom">
          {correctAnswers ? (
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '0.2em',
                padding: '0.2em',
              }}
            >
              {slide.answers.map((_, i) => (
                <div
                  key={i}
                  style={{
                    // background: buttonColors[i % buttonColors.length]?.[0],
                    height: '0.5em',
                    borderRadius: '0.7em',
                  }}
                />
              ))}
            </div>
          ) : (
            <div
              style={{
                fontSize: '18px',
                padding: '0.2em 0.1em',
                fontWeight: 'bold',
                background: '#85CCF6',
                flex: '1',
              }}
            >
              {slide.answers.length ? "no_correct" : "no_answers"}
            </div>
          )}
        </div>
      </VerticalSplit>
    </div>
  );
};

export default MultipleChoiceSlideComponent;
