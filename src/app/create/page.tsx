"use client"

import React, { useEffect, useState } from 'react'
import Recent from './components/Recent'
import {
    getAllCreations,
    getCreation,
    type Database,
    loadDatabase,
    type ExportedFuiz
} from '@/lib/storage';
import { useRouter } from 'next/router';

const CreatePage = () => {
    const [status, setStatus] = useState<any>('loading');
    let data:any ;
    // const router = useRouter();
    const idParam = '5' as string | undefined;

    useEffect(() => {
        const getStatus = async (idParam: string | null) => {
          const db = await loadDatabase({ google: data?.google, oauth: data?.user !== null });
          console.log("hello");
          if (idParam) {
            const id = parseInt(idParam);
            const config = await getCreation(id, db);
            console.log(config);
            setStatus(config
              ? {
                  creation: { id, config },
                  db
                }
              : {
                  creation: 'failure',
                  db
                });
          } else {
            const creations = await getAllCreations(db);
            
            
            setStatus({ creations, db });
          }
          console.log(status);
        };
    
        if (typeof window !== 'undefined') {
          getStatus(idParam || null);
        }
      }, [idParam]);

      console.log(status.creation);
      
  return (
    <div>
        <Recent creations={status.creation} db={status.db} data={data} />
        hello
    </div>
  )
}

export default CreatePage