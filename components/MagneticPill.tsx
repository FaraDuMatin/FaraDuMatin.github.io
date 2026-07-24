'use client';

import { useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import type { LucideIcon } from 'lucide-react';

interface MagneticPillProps {
    href: string;
    label: string;
    icon: LucideIcon;
    accentColor: string;
}

export default function MagneticPill({ href, label, icon: Icon, accentColor }: MagneticPillProps) {
    const ref = useRef<HTMLAnchorElement>(null);
    const [offset, setOffset] = useState({ x: 0, y: 0 });

    const handleMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
        const el = ref.current;
        if (!el) return;
        const rect = el.getBoundingClientRect();
        const x = e.clientX - (rect.left + rect.width / 2);
        const y = e.clientY - (rect.top + rect.height / 2);
        setOffset({ x: x * 0.3, y: y * 0.4 });
    };

    const reset = () => setOffset({ x: 0, y: 0 });

    return (
        <a
            ref={ref}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            onMouseMove={handleMove}
            onMouseLeave={reset}
            style={{ '--accent': accentColor, transform: `translate(${offset.x}px, ${offset.y}px)` } as CSSProperties}
            className="magnetic-pill inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white"
        >
            <span className="pill-shine" aria-hidden="true" />
            <span className="relative z-10 inline-flex items-center gap-2">
                <Icon className="h-4 w-4" style={{ color: accentColor }} />
                {label}
            </span>
        </a>
    );
}
