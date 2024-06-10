import React, { useEffect, useRef } from 'react';
import tippy, { Instance } from 'tippy.js';
import 'tippy.js/dist/tippy.css';
// import * as m from '$paraglide/messages';

import deleteFuiz from '$lib/assets/delete.svg';
import present from '$lib/assets/slideshow.svg';
import downloadIcon from '$lib/assets/download.svg';
import shareIcon from '$lib/assets/share.svg';
// import IconButton from './IconButton'; // Ensure you have this component
import MediaContainer from './MediaContainer'; // Ensure you have this component
// import { languageTag } from '$paraglide/runtime';
import { Media } from '@/lib/types';

interface Props {
  id: number;
  title: string;
  lastEdited: number;
  slidesCount: number;
  media?: Media;
  onDelete: () => void;
  onPlay?: () => void;
  onDownload: () => void;
  onShare?: (instance: Instance) => void;
}

const MyComponent: React.FC<Props> = ({ id, title, lastEdited, slidesCount, media, onDelete, onPlay, onDownload, onShare }) => {
  const shareElement = useRef<HTMLElement | null>(null);
  const tippyInstance = useRef<Instance | null>(null);

  const sameYear = { month: 'short', day: 'numeric' } as const;
  const diffYear = { year: 'numeric', month: 'numeric', day: 'numeric' } as const;

  const dateToString = (date: Date): string | null => {
    let currentDate = new Date();
    if (currentDate.getFullYear() === date.getFullYear()) {
    //   return date.toLocaleDateString(languageTag(), sameYear);
    return null
    } else {
    //   return date.toLocaleDateString(languageTag(), diffYear);
    return null
    }
  };

  useEffect(() => {
    if (shareElement.current) {
      tippyInstance.current = tippy(shareElement.current, {
        trigger: 'manual',
        content: 'test',
        arrow: false,
        theme: 'fuiz',
      });
    }
  }, []);

  return (
    <div className="entry">
      <a className="main" href={`?id=${id}`}>
        <div className="media">
          <MediaContainer media={media} fit="cover" />
        </div>
        <div className="info">
          {title}
          <div className="desc">
            {/* {dateToString(new Date(lastEdited))} • {m.slides_count({ count: slidesCount })} */}
          </div>
        </div>
      </a>
      <div className="panel">
        {/* <IconButton size="1em" src={present} alt={m.host()} onClick={onPlay} />
        <IconButton size="1em" src={deleteFuiz} alt={m.delete_confirm()} onClick={onDelete} />
        <IconButton size="1em" src={downloadIcon} alt={m.download()} onClick={onDownload} /> */}
        {/* <div ref={shareElement}> */}
          {/* <IconButton
            size="1em"
            src={shareIcon}
            alt={m.share()}
            onClick={() => {
              if (tippyInstance.current) {
                onShare(tippyInstance.current);
              }
            }}
          /> */}
        {/* </div> */}
      </div>
      <style jsx>{`
        .entry {
          --border-color: #a0a0a0;
          background: var(--border-color);
          display: flex;
          max-height: 15ch;
          aspect-ratio: 6 / 5;
          border: 0.15em solid var(--border-color);
          border-radius: 0.7em;
          position: relative;
          overflow: hidden;
          left: 50%;
          transform: translateX(-50%);
          transition: background 150ms ease-out, border 150ms ease-out;
        }
        .main {
          transition: margin-right 150ms ease-out, background 150ms ease-out;
          outline: none;
          background: var(--background-color);
          flex: 1;
          z-index: 1;
          color: inherit;
          text-decoration: inherit;
          display: flex;
          flex-direction: column;
          border-radius: 0.6em;
          overflow: hidden;
        }
        .media {
          width: 100%;
          flex: 1;
          border-bottom: 0.15em solid var(--border-color);
          transition: border-color 150ms ease-out;
          position: relative;
        }
        .info {
          padding: 0.3em 0.4em;
          font-size: 0.75em;
          word-wrap: break-word;
        }
        .desc {
          opacity: 0.7;
        }
        .panel {
          position: absolute;
          right: 0;
          height: 100%;
          z-index: 0;
          color: var(--palette-light);
          display: flex;
          flex-direction: column;
          padding: 0.2em;
          gap: 0.2em;
        }
        .entry:where(:focus-within, :hover) {
          background: var(--accent-color);
          --border-color: var(--accent-color);
        }
        .main:where(:focus, :hover) {
          --trans-color: color-mix(in srgb, currentColor 10%, transparent);
          background: linear-gradient(var(--trans-color), var(--trans-color)), var(--background-color);
        }
        @media (hover: none) {
          .entry {
            --border-color: var(--accent-color);
          }
          .main {
            outline: none;
            margin-right: 1.5em;
          }
        }
      `}</style>
    </div>
  );
};

export default MyComponent;
