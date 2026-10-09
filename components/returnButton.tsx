'use client';

import { useState, useEffect } from 'react';
import { oncePerFrame } from '@/lib/oncePerFrame';

export default function ReturnButton() {

    const [isVisible, setIsVisible] = useState(false);
    const [scrolledDown, setScrolledDown] = useState(false);

    useEffect(() => {
        function handleDocumentChange() {
            setIsVisible(window.innerWidth > 1360);
            setScrolledDown(window.scrollY > 100);
        };

        const onChange = oncePerFrame(handleDocumentChange);
        window.addEventListener('scroll', onChange, { passive: true });
        window.addEventListener('resize', onChange);

        handleDocumentChange();

        return () => {
            onChange.cancel();
            window.removeEventListener('scroll', onChange);
            window.removeEventListener('resize', onChange);
        };
    }, []);

    function scrollToTop() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    return (
        <button
            className={`fixed bottom-5 right-5 p-3 rounded-full bg-zinc-950 border-2 border-zinc-700 hover:bg-zinc-900 hover:border-zinc-600 flex items-center justify-center w-16 h-16 transition-opacity duration-300 ${isVisible ? "block" : "hidden"} ${scrolledDown ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'}`}
            onClick={scrollToTop}
        >
            <img src="/arrow-up.svg" alt="Return to top" className="fill-zinc-50" />
        </button>
    )
}