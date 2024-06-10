// components/SlideEditor.js
import React from 'react';
// import Icon from './Icon';
import MultipleChoiceSlideEditor from './MultipleChoiceSlideEditor';
import ghost from '../public/assets/ghost.svg';
// import * as m from '../paraglide/messages';
import type { Slide } from '@/lib/types'; // Import your types if using TypeScript

const SlideEditor = ({ slide }: any) => {
//   if (slide === undefined) {
//     return (
//       <div
//         style={{
//           flex: 1,
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: 'center',
//           justifyContent: 'center',
//           textAlign: 'center',
//           fontSize: '2em',
//           opacity: 0.4
//         }}
//       >
//         no_slides
//       </div>
//     );
//   } else if ('MultipleChoice' in slide) {
// }

return <MultipleChoiceSlideEditor slide={slide} />;
};

export default SlideEditor;
