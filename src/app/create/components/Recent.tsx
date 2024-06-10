import React, { useState, useEffect, useRef } from 'react';
// import * as m from '@paraglide/messages';
import GalleryCreation from './GalleryCreation';
// import FancyButton from '../lib/FancyButton';
// import Icon from '../lib/Icon';
import ghost from '../lib/assets/ghost.svg';
// import TypicalPage from '../lib/TypicalPage';
// import { parse } from '@ltd/j-toml';
// import JSZip from 'jszip';
import {
  generateUuid,
  getCreation,
  addCreation,
  deleteCreation,
} from '@/lib/storage';
import { useRouter } from 'next/navigation';
// import { env } from '../config/env';
import type { Creation, IdlessFuizConfig, Media } from '@/lib/types';
import { isNotUndefined } from '@/lib/utils';
import { Button } from '@/components/ui/button';
// import { useSession } from 'next-auth/react'; // For session management

const Recent: React.FC<{ creations: Creation[], db: any, data: any }> = ({ creations: initialCreations, db, data }) => {
    console.log("db" , db);
    
    const [creations, setCreations] = useState<Creation[]>(initialCreations);
    console.log(creations);
  const [selectedToDeletion, setSelectedToDeletion] = useState<number | null>(null);
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);
  const fileInput = useRef<HTMLInputElement>(null);
//   const { data: session } = useSession();
  const router = useRouter();

//   const sortedCreations = [...creations].sort((a, b) => b.lastEdited - a.lastEdited);




//   };

//   const deleteSlide = async (id: number) => {
//     await deleteCreation(id, db);
//     setCreations(creations.filter((c: any) => c.id !== id));
//   };

//   const loadFromInput = () => {
//     const target = fileInput.current;
//     if (!target) return;

//     const filesList = target.files;
//     if (!filesList) return;

//     const files: File[] = [];
//     for (let i = 0; i < filesList.length; i++) {
//       const file = filesList.item(i);
//       if (file) files.push(file);
//     }

//     // loadFile(files);
//   };

const  handleStartClick = async () => {
        let newSlide = {
          lastEdited: Date.now(),
          uniqueId: generateUuid(),
          versionId: 0,
          config: {
            title: 'untitled',
            slides: []
          }
        };

        let id = await addCreation(newSlide, db);

        setCreations([
        //   creations ? ...creations : undefined,
          {
            id,
            lastEdited: newSlide.lastEdited,
            title: newSlide.config.title,
            slidesCount: newSlide.config.slides.length
          }
        ]);
    
        router.push(`/create/${id}`);
}

  return (
    <section>
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "0.5em",
        flexWrap: "wrap",
        padding: "0 0.5em"
      }}>
        <div>
          <Button onClick={handleStartClick}>
            <div style={{
              display: "flex",
              alignItems: "center",
              fontFamily: "Poppins",
              gap: "0.2em",
              padding: "0.15em 0.25em",
              justifyContent: "center"
            }}>
              {/* <Icon size="1.25em" src="/assets/file_new.svg" alt={m.start_blank()} /> */}
              start_blank()
            </div>
          </Button>
        </div>
        {/* {env.PUBLIC_GOOGLE === 'true' && (
          data.google ? (
            <div>
              <Button onClick={() => logout('google')}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  fontFamily: "Poppins",
                  gap: "0.2em",
                  padding: "0.15em 0.25em",
                  justifyContent: "center"
                }}>
                  
                  <div>Log Out</div>
                </div>
              </Button>
            </div>
          ) : (
            <div>
              <Button onClick={() => login('google')}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  fontFamily: "Poppins",
                  gap: "0.2em",
                  padding: "0.15em 0.25em",
                  justifyContent: "center"
                }}>
                  <div>Backup</div>
                </div>
              </Button>
            </div>
          )
        )}
        {env.PUBLIC_AUTH === 'true' && (
          session ? (
            <div>
              <Button onClick={() => logout('oauth')}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  fontFamily: "Poppins",
                  gap: "0.2em",
                  padding: "0.15em 0.25em",
                  justifyContent: "center"
                }}>
                  <div>Log Out</div>
                </div>
              </Button>
            </div>
          ) : (
            <div>
              <Button onClick={() => login('oauth')}>
                <div style={{
                  display: "flex",
                  alignItems: "center",
                  fontFamily: "Poppins",
                  gap: "0.2em",
                  padding: "0.15em 0.25em",
                  justifyContent: "center"
                }}>
                  <div>Backup</div>
                </div>
              </Button>
            </div>
          )
        )} */}
        <div>
          {/* <input
            ref={fileInput}
            style={{ display: 'none' }}
            type="file"
            id="config"
            accept="application/toml, .toml, application/x-zip, .zip"
            name="config"
            multiple
            onChange={loadFromInput}
          /> */}
          <Button onClick={() => fileInput.current?.click()}>
            <div style={{
              display: "flex",
              alignItems: "center",
              fontFamily: "Poppins",
              gap: "0.2em",
              padding: "0.15em 0.25em",
              justifyContent: "center"
            }}>
              {/* <Icon size="1.25em" src="/assets/file_open.svg" alt={m.open_file()} /> */}
              open_file
            </div>
          </Button>
        </div>
      </div>
      <div style={{ margin: "0 0.4em" }}>
        <div style={{
          maxWidth: "60ch",
          padding: "0.5em",
          boxSizing: "border-box",
          margin: "1em auto",
          background: "color-mix(in srgb, currentColor 20%, transparent)",
          border: "0.1em solid color-mix(in srgb, currentColor 80%, transparent)",
          borderRadius: "0.7em"
        }}>
          <h2 style={{
            fontFamily: "Poppins",
            lineHeight: "1",
            margin: "0 0 0.2em",
            borderBottom: "0.05em solid color-mix(in srgb, currentColor 80%, transparent)"
          }}>
            recent_fuizzes
          </h2>
          {/* {sortedCreations.length ? (
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(12ch, 1fr))",
              gridAutoRows: "1fr",
              gridGap: "0.4em"
            }}>
              {sortedCreations.map(({ id, title, lastEdited, slidesCount, media }) => (
                <GalleryCreation
                  key={id}
                  id={id}
                  title={title}
                  lastEdited={lastEdited}
                  slidesCount={slidesCount}
                  media={media}
                  onDelete={() => {
                    setSelectedToDeletion(id);
                    setDialogOpen(true);
                  }}
                //   onPlay={() => router.push('host?id=' + id)}
                  onDownload={async () => {
                    const creation = await getCreation(id, db);
                    if (creation) {
                    //   await downloadFuiz(creation.config);
                    }
                  }}
                //   onShare={async (e) => {
                //     const creation = await getCreation(id, db);
                //     if (creation) {
                //       await share(creation.config, session ? creation.uniqueId : undefined);
                //     }
                //     e.detail.show();
                //   }}
                />
              ))}
              {dialogOpen && (
                <div style={{
                  position: "fixed",
                  background: "color-mix(in srgb, var(--background-color) 80%, transparent)",
                  display: "flex",
                  padding: "0.5em",
                  inset: "0",
                  zIndex: "1"
                }}>
                  <div style={{
                    margin: "auto",
                    background: "var(--background-color)",
                    padding: "0.5em",
                    border: "0.2em solid",
                    borderRadius: "0.7em"
                  }}>
                    <h3 style={{ margin: "0 0 0.4em" }}>delete_forever</h3>
                    <div style={{
                      display: "flex",
                      gap: "0.5em",
                      flexWrap: "wrap"
                    }}>
                      <div style={{ flex: "1" }}>
                        <Button
                          onClick={() => setDialogOpen(false)}
                        >
                          <div style={{ padding: "0.2em 0.4em" }}>cancel</div>
                        </Button>
                      </div>
                      <div style={{ flex: "1" }}>
                        <Button onClick={() => {
                          if (selectedToDeletion !== null) {
                            deleteSlide(selectedToDeletion);
                            setDialogOpen(false);
                          }
                        }}>
                          <div style={{ padding: "0.2em 0.4em" }}>delete_confirm</div>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              opacity: "0.3"
            }}>
              {/* <Icon src={ghost} size="min(20vh, 60vw)" alt={m.nothing()} /> 
              nothing
            </div>
          )} */}
        </div>
      </div>
    </section>
  );
};

export default Recent;
