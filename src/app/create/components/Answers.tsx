// components/MultipleChoiceAnswers.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
// import * as m from '../paraglide/messages';
import {  limits } from '@/lib/limits';
// import FancyButton from './FancyButton';
// import Icon from './Icon';
import variables from '../lib/assets/variables.svg';
import Answer from './Answer';
import { Button } from '@/components/ui/button';

const Answers = ({ initialAnswers } : any) => {
    console.log("Answers");
    
  const [answers, setAnswers] = useState(initialAnswers);
  console.log(answers);
  

  const addAnswer = () => {
    setAnswers([
      ...answers,
      {
        correct: false,
        content: { Text: '' },
        id: Date.now(),
      },
    ]);
  };

  const removeAnswer = (index: any) => {
    setAnswers(answers.filter((_ : any, i : any) => i !== index));
  };

  return (
    <div id="grid" style={{ display: 'grid', gap: '0.2em', width: '100%' }}>
      {answers?.map(({ correct, content, id }: any, index :any) => (
        <motion.div
          key={id}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{ duration: 0.3, ease: 'backOut' }}
        >
          <Answer
            attention={answers.filter((a:any) => a.correct).length === 0}
            content={content}
            correct={correct}
            index={index}
            onClick={() => removeAnswer(index)}
          />
        </motion.div>
      ))}
      {answers?.length < limits.fuiz.multipleChoice.maxAnswerCount && (
        <motion.div
          style={{ gridColumn: '1 / -1' }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, ease: 'backOut' }}
        >
          <Button
            onClick={addAnswer}
          >
              add_answer
          </Button>
        </motion.div>
      )}
    </div>
  );
};

export default Answers;
