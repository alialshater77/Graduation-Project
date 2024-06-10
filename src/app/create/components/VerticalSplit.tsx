import React, { ReactNode } from 'react';

interface VerticalSplitProps {
  top: ReactNode;
  bottom: ReactNode;
}

const VerticalSplit: React.FC<VerticalSplitProps> = ({ top, bottom }) => {
  return (
    <div
      style={{
        height: '100%',
        display: 'grid',
        gridTemplateRows: '1fr auto',
        flexDirection: 'column',
      }}
    >
      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
        }}
      >
        {top}
      </div>
      {bottom}
    </div>
  );
};

export default VerticalSplit;
