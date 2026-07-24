'use client';

import { useState } from 'react';
import type { CSSProperties } from 'react';
import { Layers, X } from 'lucide-react';
import Image from 'next/image';

interface ArchitectureModalProps {
    architecturePath: string;
    accentColor: string;
}

export default function ArchitectureModal({ architecturePath, accentColor }: ArchitectureModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <button
                onClick={() => setIsOpen(true)}
                style={{ '--accent': accentColor } as CSSProperties}
                className="group inline-flex items-center gap-2 rounded-lg border border-neutral-800 bg-neutral-950 px-4 py-2 text-sm font-medium text-zinc-300 shadow-sm transition hover:border-[color:var(--accent)] hover:text-white"
                aria-label="View system architecture"
            >
                <Layers className="h-4 w-4" style={{ color: accentColor }} />
                Architecture
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm animate-fadeIn"
                    onClick={() => setIsOpen(false)}
                >
                    <div
                        className="relative max-w-5xl w-full mx-4 animate-scaleIn"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <button
                            onClick={() => setIsOpen(false)}
                            className="absolute -top-12 right-0 p-2 text-zinc-400 hover:text-white transition-colors duration-200"
                            aria-label="Close modal"
                        >
                            <X size={32} />
                        </button>
                        <Image
                            src={`/architecture${architecturePath}`}
                            alt="Architecture diagram"
                            width={1200}
                            height={800}
                            className="w-full h-auto rounded-lg border border-zinc-700"
                        />
                    </div>
                </div>
            )}
        </>
    );
}
