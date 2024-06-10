// components/MultipleChoiceSlideEditor.js
import React, { useState, useEffect } from 'react';
// import * as m from '../paraglide/messages';
import { limits } from '@/lib/limits';
import {Textarea} from '@/components/ui/textarea';
// import MediaChooser from './MediaChooser';
import Answers from './Answers';
import type { MultipleChoiceSlide } from '@/lib/types'; // Assuming you have this type defined

const MultipleChoiceSlideEditor = ({ slide }: any) => {
  const [localSlide, setLocalSlide] = useState(slide);

  useEffect(() => {
    if (localSlide?.time_limit < 1000) {
      setLocalSlide((prevSlide: any) => ({ ...prevSlide, time_limit: prevSlide.time_limit * 1000 }));
    }
    if (localSlide?.introduce_question < 1000) {
      setLocalSlide((prevSlide: any) => ({ ...prevSlide, introduce_question: prevSlide.introduce_question * 1000 }));
    }
  }, [localSlide?.time_limit, localSlide?.introduce_question]);

  const handleTitleChange = (e:any) => {
    setLocalSlide({ ...localSlide, title: e.target.value });
  };

  const handleMediaChange = (media: any) => {
    setLocalSlide({ ...localSlide, media });
  };

  const handleAnswersChange = (answers:any) => {
    setLocalSlide({ ...localSlide, answers });
  };

  return (
    <div
      style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '0.2em',
        padding: '0.6em 0.4em 0.4em',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <div
        style={{
          maxWidth: '25ch',
          width: '100%',
          paddingTop: '0.5em',
          overflow: 'auto'
        }}
      >
        <Textarea
          value={localSlide?.title}
          onChange={handleTitleChange}
          placeholder="question_text"
          id="question_title"
          required={false}
          disabled={false}
          maxLength={limits.fuiz.maxTitleLength}
        />
      </div>
      <div
        style={{
          display: 'flex',
          width: '100%',
          flexWrap: 'wrap-reverse',
          gap: '0.2em',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* <MediaChooser media={localSlide.media} setMedia={handleMediaChange} /> */}
      </div>
      <Answers answers={localSlide?.answers} setAnswers={handleAnswersChange} />
    </div>
  );
};

export default MultipleChoiceSlideEditor;
