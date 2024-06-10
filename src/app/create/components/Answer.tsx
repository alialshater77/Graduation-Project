// components/Answer.js
import React from 'react';
import {  limits } from '@/lib/limits';
import {Checkbox} from '@/components/ui/checkbox';
import {Input} from '@/components/ui/input';
// import IconButton from './IconButton';
import deleteAnswer from '../lib/assets/delete.svg';
import { Button } from '@/components/ui/button';
// import * as m from '../paraglide/messages';

const Answer = ({ correct, setCorrect, content, setContent, index, attention, onDelete } : any) => {
    console.log("hello loaoso");
    
  return (
    <Button
    >
      <div style={{ display: 'flex', alignItems: 'center', padding: '0.15em 0.3em', gap: '0.3em', color: 'var(--palette-light)' }}>
        <div style={{ height: '1.5em', display: 'flex' }}>
          <Checkbox
            value={correct}
            onChange={() => setCorrect(!correct)}
          />
        </div>
        <Input
          value={content.Text}
          onChange={(e : any) => setContent({ ...content, Text: e.target.value })}
          placeholder="answer_text"
          maxLength={limits.fuiz.maxAnswerTextLength}
        />
        <Button onClick={onDelete} >delete</Button>
      </div>
    </Button>
  );
};

export default Answer;
