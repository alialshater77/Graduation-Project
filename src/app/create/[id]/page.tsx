"use client"

import React, { useState, useEffect } from 'react';
// import OptionsBar from './OptionsBar';
import Sidebar from '../components/Sidebar';
import SlideEditor from '../components/SlideEditor';
import type { FuizConfig, Slide } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { title } from 'process';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { useRouter , usePathname } from 'next/navigation';

const initialConfig: FuizConfig = {
  slides: [{
    MultipleChoice: {
      title: '',
      introduce_question: 0,
      time_limit: 0,
      points_awarded: 0,
      answers: [{
        content: {
          Text: ''
        },
        correct: true,
        id: 17
      }],
    },
    id: 17
  }],
  title: ''
};

interface EditorProps {
  config: FuizConfig;
}

const Editor: React.FC<EditorProps> = () => {
  const [config, setConfig] = useState<FuizConfig>(initialConfig);
  const [options, setOptions] = useState({
    no_leaderboard: false,
    random_names: false,
    show_answers: true
  });

  const router = useRouter();
  const id = 17
  
  // const [slide, setSlide] = useState([{
  //   MultipleChoice: {}
  // }]);
  // const [chos , setChos] = useState({
  //   answers: [{}],
  //   introduce_question: 3000,
  //   points_awarded: 1000,
  //   time_limit: 30000,
  //   title: ''
  // })
  // const [answer, setAnswer] = useState({
  //   content: {
  //     Text: ''
  //   },
  //   correct: false
  // })


  // useEffect(() => {
  //   setActiveSlide(config?.slides[selectedSlideIndex]);
  // }, [selectedSlideIndex, config?.slides]);

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    
    const fetchOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        config,
        options: options
      }),
    };

    try {
      const response = await fetch('https://rust-api-s1t8.onrender.com/add', fetchOptions);
      console.log("hello");
      
      if (response.ok) {
        const data = await response.json();
        console.log('Success:', data);
      } else {
        console.error('Error:', response.statusText);
      }
    } catch (error) {
      console.error('Fetch error:', error);
    }
    
  }

  const handleMainTitleChange = (e : any) => {
    setConfig((prev) => ({...prev , title: e}))
    console.log(config);
    
  }

  const handleTitleChange = (e : any) => {
    // setChos((prev) => ({...prev, title: e}))
    setConfig((prev) => ({
      ...prev,
      slides: prev.slides.map((slide, i) => (
        i === 0 ? {
          ...slide,
          MultipleChoice: {
            ...slide.MultipleChoice,
            title: e,
          }
        } : slide
      ))
    }))

    console.log(config);
    
  }

  const handleAddAnswer = (e: any) => {
    // setAnswer((prev) => ({...prev , content:{Text: e}}))

    // setChos((prev) => ({...prev, answers:[{...answer}]}))
    setConfig((prevConfig) => ({
      ...prevConfig,
      slides: prevConfig.slides.map((slide, sIndex) =>
        sIndex === 0 ? {
          ...slide,
          MultipleChoice: {
            ...slide.MultipleChoice,
            answers: slide.MultipleChoice.answers.map((answer, aIndex) =>
              aIndex === 0 ? {
                ...answer,
                content: {
                  ...answer.content,
                  Text: e
                }
              } : answer
            )
          }
        } : slide
      )
    }));

    console.log(config);
  }


  const handleChecked = (e: any) => {
    setConfig((prevConfig) => ({
      ...prevConfig,
      slides: prevConfig.slides.map((slide, sIndex) =>
        sIndex === 0 ? {
          ...slide,
          MultipleChoice: {
            ...slide.MultipleChoice,
            answers: slide.MultipleChoice.answers.map((answer, aIndex) =>
              aIndex === 0 ? {
                ...answer,
                correct: !answer.correct
              } : answer
            )
          }
        } : slide
      )
    }));

    console.log(config);
  }

  // console.log(answer);
  

  return (
    <form onSubmit={handleSubmit} className='w-1/2 mt-16'>
      <Input type='text' onChange={e => handleMainTitleChange(e.target.value)}/>
      <Input type='text' onChange={e => handleTitleChange(e.target.value)}/>

      <p className='mt-10'>Answers</p>
      <Input type='text' onChange={e => handleAddAnswer(e.target.value)}/>
      {/* <Checkbox onClick={() => setAnswer((prev) => ({...prev , correct: !prev.correct}))} /> */}
      <Checkbox  onClick={e => handleChecked(e)}/>

      <div>
      <Button>Submit</Button>
      </div>
    </form>
  );
};

export default Editor;
