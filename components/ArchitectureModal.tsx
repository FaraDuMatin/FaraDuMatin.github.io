'use client';

import { useState } from 'react';
import { Layers, X } from 'lucide-react';
import Image from 'next/image';
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip";

interface ArchitectureModalProps {
    architecturePath: string;
    accentColor: string;
}

export default function ArchitectureModal({ architecturePath, accentColor }: ArchitectureModalProps) {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <TooltipProvider delayDuration={0}>
                <Tooltip>
                    <TooltipTrigger
                        onClick={() => setIsOpen(true)}
                        style={{ color: accentColor }}
                        className="absolute top-6 right-6 sm:top-12 sm:right-12 p-2 rounded-lg hover:bg-zinc-800 transition-colors duration-200"
                        aria-label="View system architecture"
                    >
                        <Layers size={28} />
                    </TooltipTrigger>
                    <TooltipContent side="top">View Architecture</TooltipContent>
                </Tooltip>
            </TooltipProvider>

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
                            src={architecturePath}
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
