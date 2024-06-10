"use client"

import { useState, useEffect, useRef } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { Slide } from '@/lib/types'; // Adjust the import path accordingly
// import FancyButton from '../components/FancyButton'; // Adjust the import path accordingly
// import IconButton from '../components/IconButton'; // Adjust the import path accordingly
import Thumbnail from './Thumbnail'; // Adjust the import path accordingly
import { limits } from '@/lib/limits'; // Adjust the import path accordingly
import { Button } from '@/components/ui/button';

const clamp = (min: number, value: number, max: number): number => {
  return Math.min(max, Math.max(value, min));
};

const Sidebar = ({ slides: initialSlides, selectedSlideIndex: initialSelectedSlideIndex }: { slides: Slide[], selectedSlideIndex: number }) => {
    
    const [slides, setSlides] = useState<Slide[]>(initialSlides);
    console.log("slides",slides);
  const [selectedSlideIndex, setSelectedSlideIndex] = useState<number>(initialSelectedSlideIndex);
  const sectionRef = useRef<HTMLElement>(null);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;

    const newSlides = Array.from(slides);
    const [reorderedSlide] = newSlides.splice(result.source.index, 1);
    newSlides.splice(result.destination.index, 0, reorderedSlide);

    setSlides(newSlides);

    const id = slides[selectedSlideIndex]?.id ?? 0;
    const newIndex = newSlides.findIndex(s => s.id === id);
    setSelectedSlideIndex(newIndex === -1 ? newSlides.findIndex(s => s.id.toString().startsWith('id')) : newIndex);
  };

  const changeSelected = async (newValue: number) => {
    const clamped = clamp(0, newValue, slides.length - 1);
    setSelectedSlideIndex(clamped);

    await new Promise(requestAnimationFrame);

    const selectedSlide = document.querySelector(`#slide_${clamped}`);
    if (!selectedSlide) return;

    const selectedRect = selectedSlide.getBoundingClientRect();
    const parentRect = sectionRef.current?.getBoundingClientRect();
    if (parentRect) {
      sectionRef.current?.scrollTo({
        top: sectionRef.current.scrollTop + clamp(selectedRect.bottom - parentRect.bottom, 0, selectedRect.top - parentRect.top),
        left: sectionRef.current.scrollLeft + clamp(selectedRect.right - parentRect.right, 0, selectedRect.left - parentRect.left),
      });
    }
  };

  return (
    <div id="sidebar" style={{ display: 'flex', flexDirection: 'column' }}>
      <div className="switched" style={{ flex: 1, display: 'flex', alignItems: 'stretch', justifyContent: 'space-between', boxSizing: 'border-box' }}>
        <div style={{ flex: 1, flexDirection: 'column', boxSizing: 'border-box' }}>
          <section ref={sectionRef} style={{ display: 'flex', width: '0', minHeight: '100%', minWidth: '100%', gap: '0.2em', overflow: 'auto' }}>
            <DragDropContext onDragEnd={handleDragEnd}>
              <Droppable droppableId="slides">
                {(provided) => (
                  <div {...provided.droppableProps} ref={provided.innerRef}>
                    {slides?.map((slide, index) => (
                      <Draggable key={slide.id} draggableId={slide.id.toString()} index={index}>
                        {(provided) => (
                          <div
                            id={`slide_${index}`}
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={{ padding: '0.4em', boxSizing: 'border-box', height: 'fit-content', ...provided.draggableProps.style }}
                          >
                            <Thumbnail
                              slide={slide}
                              index={index}
                              selected={index === selectedSlideIndex}
                              onSelect={() => changeSelected(index)}
                              onDelete={async () => {
                                const newSlides = slides.filter((_, i) => i !== index);
                                setSlides(newSlides);
                                if (index <= selectedSlideIndex) {
                                  await changeSelected(selectedSlideIndex - 1);
                                }
                              }}
                              onDuplicate={async () => {
                                const sameSlide = { ...slide, id: Date.now() };
                                const newSlides = [...slides.slice(0, index + 1), sameSlide, ...slides.slice(index + 1)];
                                setSlides(newSlides);
                                await changeSelected(index + 1);
                              }}
                            />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          </section>
        </div>
        <div id="add-button">
          <Button
            disabled={slides?.length >= limits.fuiz.maxSlidesCount}
            onClick={async () => {
              const newSlide = {
                MultipleChoice: {
                  title: '',
                  media: undefined,
                  introduce_question: limits.fuiz.multipleChoice.introduceQuestion,
                  time_limit: limits.fuiz.multipleChoice.defaultTimeLimit,
                  points_awarded: limits.fuiz.multipleChoice.pointsAwarded,
                  answers: []
                },
                id: Date.now()
              };
              const newSlides = [...slides, newSlide];
              setSlides(newSlides);
              await changeSelected(newSlides.length - 1);
            }}
          >
            <div style={{ padding: '0.2em 0.4em', height: '100%', boxSizing: 'border-box', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.2em' }}>
              {/* <Icon size="1em" src="/add_slide.svg" alt={m.add_slide()} /> */}
              <div className="would-be-hidden">add_slide</div>
            </div>
          </Button>
        </div>
      </div>
      <div id="controls">
        <div>
          {/* <IconButton src="/first.svg" alt={m.first_slide()} size="1.2em" padding="0.2em" onClick={() => changeSelected(0)} /> */}
        </div>
        <div>
          {/* <IconButton src="/left.svg" alt={m.prev_slide()} size="1.2em" padding="0.2em" onClick={() => changeSelected(selectedSlideIndex - 1)} /> */}
        </div>
        <div>
          <div style={{ height: '1.2em', aspectRatio: '1/1', padding: '0.2em', textAlign: 'center', fontWeight: 'bold' }}>
            {selectedSlideIndex + 1}
          </div>
        </div>
        <div>
          {/* <IconButton src="/right.svg" alt={m.next_slide()} size="1.2em" padding="0.2em" onClick={() => changeSelected(selectedSlideIndex + 1)} /> */}
        </div>
        <div>
          {/* <IconButton src="/last.svg" alt={m.last_slide()} size="1.2em" padding="0.2em" onClick={() => changeSelected(slides.length - 1)} /> */}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
