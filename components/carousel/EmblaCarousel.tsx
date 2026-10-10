'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Thumb from './EmblaCarouselThumbsButton';
import ClickVideo, { posterOf } from './ClickVideo';

interface EmblaCarouselProps {
    slides: string[];
    video?: string; // project video, shown first; plays on click
    options: any;
}

const EmblaCarousel = ({ slides: images, video, options }: EmblaCarouselProps) => {
    const slides = video ? [video, ...images] : images;
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [emblaMainRef, emblaMainApi] = useEmblaCarousel(options);
    const [emblaThumbsRef, emblaThumbsApi] = useEmblaCarousel({
        containScroll: 'keepSnaps',
        dragFree: true
    });
    const emblaNodeRef = useRef<HTMLDivElement>(null);

    const onThumbClick = useCallback(
        (index: number) => {
            if (!emblaMainApi || !emblaThumbsApi) return;
            emblaMainApi.scrollTo(index);
        },
        [emblaMainApi, emblaThumbsApi]
    );

    const onSelect = useCallback(() => {
        if (!emblaMainApi || !emblaThumbsApi) return;
        setSelectedIndex(emblaMainApi.selectedScrollSnap());
        // Leaving the video slide pauses it.
        emblaNodeRef.current?.querySelectorAll('video[data-click]').forEach(v => (v as HTMLVideoElement).pause());
        emblaThumbsApi.scrollTo(emblaMainApi.selectedScrollSnap());
    }, [emblaMainApi, emblaThumbsApi, setSelectedIndex]);

    useEffect(() => {
        if (!emblaMainApi) return;
        onSelect();

        emblaMainApi.on('select', onSelect).on('reInit', onSelect);
    }, [emblaMainApi, onSelect]);

    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (!emblaMainApi) return;

            if (event.key === 'ArrowLeft') {
                emblaMainApi.scrollPrev();
            } else if (event.key === 'ArrowRight') {
                emblaMainApi.scrollNext();
            }
        };

        const emblaNode = emblaNodeRef.current;
        if (emblaNode) {
            emblaNode.addEventListener('keydown', handleKeyDown);
        }

        return () => {
            if (emblaNode) {
                emblaNode.removeEventListener('keydown', handleKeyDown);
            }
        };
    }, [emblaMainApi]);

    return (
        <div className="embla" ref={emblaNodeRef} tabIndex={0}>
            <div className="embla__viewport" ref={emblaMainRef}>
                <div className="embla__container">
                    {slides.map((image: string, index: number) => (
                        <div className="embla__slide" key={index}>
                            {video && index === 0
                                ? <ClickVideo src={video} />
                                : image.endsWith('.mp4')
                                // Former GIFs, as muted looping video (much lighter).
                                ? <video src={image} autoPlay muted loop playsInline preload="metadata" className="w-full max-h-[70vh] object-contain" />
                                : <img src={image} loading="lazy" decoding="async" className="w-full max-h-[70vh] object-contain" />}
                        </div>
                    ))}
                </div>
            </div>
            {slides.length > 1 &&
                <div className="embla-thumbs">
                    <div className="embla-thumbs__viewport" ref={emblaThumbsRef}>
                        <div className="embla-thumbs__container">
                            {slides.map((image: string, index: number) => (
                                <Thumb
                                    key={index}
                                    onClick={() => onThumbClick(index)}
                                    selected={index === selectedIndex}
                                    image={video && index === 0 ? posterOf(video) : image}
                                    play={!!video && index === 0}
                                />
                            ))}
                        </div>
                    </div>
                </div>
            }
        </div>
    );
};

export default EmblaCarousel;
