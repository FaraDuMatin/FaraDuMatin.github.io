'use client';

import { Play } from 'lucide-react';

interface ThumbProps {
    selected: boolean;
    image: string;
    play?: boolean; // the project video's thumb: poster + play badge
    onClick: () => void;
}

export default function Thumb({ selected, image, play, onClick }: ThumbProps) {
    return (
        <div className={`embla-thumbs__slide ${selected ? ' embla-thumbs__slide--selected' : ''}`}>
            <button onClick={onClick} className="relative">
                {image.endsWith('.mp4')
                    // First frame as the thumbnail (#t nudges iOS Safari into painting it).
                    ? <video src={`${image}#t=0.1`} muted playsInline preload="metadata" />
                    : <img src={image} loading="lazy" decoding="async" />}
                {play && <Play aria-hidden className="absolute left-1/2 top-1/2 h-5 w-5 -translate-x-1/2 -translate-y-1/2 fill-white text-white drop-shadow-[0_0_6px_rgba(0,0,0,0.8)]" />}
            </button>
        </div>
    )
}
