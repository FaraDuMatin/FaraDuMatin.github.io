'use client';

import { useState } from 'react';
import { Play } from 'lucide-react';

// "/forge-video.mp4" -> "/forge-video-poster.webp"
export const posterOf = (src: string) => src.replace(/\.mp4$/, '-poster.webp');

// Project video: shows the poster with a play button; nothing downloads until it's clicked.
export default function ClickVideo({ src }: { src: string }) {
    const [playing, setPlaying] = useState(false);

    if (playing) return (
        <video data-click src={src} poster={posterOf(src)} autoPlay controls playsInline
            className="w-full max-h-[70vh] object-contain" />
    );

    return (
        <button type="button" onClick={() => setPlaying(true)} data-sound="ui" aria-label="Play video"
            className="group relative block w-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={posterOf(src)} alt="" loading="lazy" decoding="async" className="w-full max-h-[70vh] object-contain" />
            <span className="absolute inset-0 grid place-items-center bg-black/20 transition-colors group-hover:bg-black/10">
                <span className="grid size-16 place-items-center rounded-full border border-white/60 bg-black/50 backdrop-blur-sm transition-transform group-hover:scale-110">
                    <Play aria-hidden className="ml-1 h-6 w-6 fill-white text-white" />
                </span>
            </span>
        </button>
    );
}
