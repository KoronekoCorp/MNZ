"use client"

import Artplayer from 'artplayer';
import { useEffect, useRef } from 'react';


export default function Player({ option, callback, ...rest }: {
    option: Artplayer["Option"],
    callback?: (art: Artplayer) => void,
    rest?: React.HTMLAttributes<HTMLDivElement>
}) {
    const artRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const art = artRef.current != null ? new Artplayer({
            ...option,
            container: artRef.current,
        }) : undefined

        if (art && callback && typeof callback === 'function') {
            callback(art);
        }

        return () => {
            if (art && art.destroy) {
                art.destroy(false);
            }
        };
    }, []);

    return <div ref={artRef} {...rest}></div>;
}