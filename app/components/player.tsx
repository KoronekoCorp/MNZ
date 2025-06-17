"use client"

import Artplayer from 'artplayer';
import Hls from 'hls.js';
import { useEffect, useRef } from 'react';


type PlayerProps = {
    option: Artplayer["Option"];
    callback?: (art: Artplayer) => void;
} & React.HTMLAttributes<HTMLDivElement>;

function playM3u8(video: HTMLVideoElement, url: string, art: Artplayer) {
    if (Hls.isSupported()) {
        if (art.hls) art.hls.destroy();
        const hls = new Hls();
        hls.loadSource(url);
        hls.attachMedia(video);
        art.hls = hls;
        art.on('destroy', () => hls.destroy());
    } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = url;
    } else {
        art.notice.show = 'Unsupported playback format: m3u8';
    }
}

export default function Player({ option, callback, ...rest }: PlayerProps) {
    const artRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        const art = artRef.current != null ? new Artplayer({
            ...option,
            container: artRef.current,
            moreVideoAttr: {
                // crossOrigin: 'anonymous',
            },
            ...(option.type === 'm3u8' ? {
                customType: {
                    m3u8: playM3u8,
                },
            } : {})
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