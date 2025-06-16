"use client"

import Artplayer from 'artplayer';
import { useEffect, useRef } from 'react';


type PlayerProps = {
    option: Artplayer["Option"];
    callback?: (art: Artplayer) => void;
} & React.HTMLAttributes<HTMLDivElement>;

export default function Player({ option, callback, ...rest }: PlayerProps) {
    const artRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const art = artRef.current != null ? new Artplayer({
            ...option,
            container: artRef.current,
            moreVideoAttr:{
                // crossOrigin: 'anonymous',
            },
        }) : undefined

        if (art) {
            art.on('error', (err) => {
                console.error('Artplayer Error:', err);
            });
            art.on('ready', () => {
                console.log('Artplayer is ready');
            })
            if (callback && typeof callback === 'function') {
                callback(art);
            }
        }

        return () => {
            if (art && art.destroy) {
                art.destroy(false);
            }
        };
    }, []);

    return <div ref={artRef} {...rest}></div>;
}