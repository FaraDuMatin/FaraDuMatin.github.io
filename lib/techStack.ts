// Stack chip styling. Keys are the lowercased chip names from `stack` in projects.ts
// and the translation files. `icon` is a file in public/tech/ (Simple Icons, CC0),
// rendered as a CSS mask so it takes `color`. Colors are brand colors, lightened
// where the brand color is too dark to read on black.
interface Tech {
    color: string;
    icon?: string;
}

const techs: Record<string, Tech> = {
    "next.js": { color: "#ffffff", icon: "nextdotjs" },
    "react": { color: "#61dafb", icon: "react" },
    "typescript": { color: "#3178c6", icon: "typescript" },
    "javascript": { color: "#f7df1e", icon: "javascript" },
    "html": { color: "#e34f26", icon: "html5" },
    "tailwind css": { color: "#06b6d4", icon: "tailwindcss" },
    "prisma": { color: "#5a67d8", icon: "prisma" },
    "neon postgres": { color: "#00e599", icon: "postgresql" },
    "postgresql": { color: "#4169e1", icon: "postgresql" },
    "mongodb atlas": { color: "#47a248", icon: "mongodb" },
    "redis": { color: "#ff4438", icon: "redis" },
    "vercel": { color: "#ffffff", icon: "vercel" },
    "vercel blob": { color: "#ffffff", icon: "vercel" },
    "docker": { color: "#2496ed", icon: "docker" },
    "python": { color: "#4b8bbe", icon: "python" },
    "fastapi": { color: "#009688", icon: "fastapi" },
    "fastmcp": { color: "#d4d4d8", icon: "modelcontextprotocol" },
    "django": { color: "#44b78b", icon: "django" },
    "elevenlabs agents": { color: "#ffffff", icon: "elevenlabs" },
    "gemini api": { color: "#8e75b2", icon: "googlegemini" },
    "clerk": { color: "#6c47ff", icon: "clerk" },
    "convex": { color: "#ee342f" },
    "three.js": { color: "#ffffff", icon: "threedotjs" },
    "unreal engine 5": { color: "#ffffff", icon: "unrealengine" },
    "glsl": { color: "#5586a4", icon: "opengl" },
    "c++": { color: "#659ad2", icon: "cplusplus" },
};

const fallback: Tech = { color: "#a1a1aa" };

export function getTech(name: string): Tech {
    return techs[name.trim().toLowerCase()] ?? fallback;
}

// Mixes a hex color toward white until it's readable on black. Several accentColors
// (PLUMB, Fincheck, uOttaMail...) are near-black and vanish as text.
export function readableColor(hex: string, minLuminance = 0.25): string {
    const n = parseInt(hex.replace('#', ''), 16);
    const rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    const luminance = (c: number[]) => {
        const [r, g, b] = c.map(v => {
            const s = v / 255;
            return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    let mixed = rgb;
    for (let t = 0; t <= 1 && luminance(mixed) < minLuminance; t += 0.05) {
        mixed = rgb.map(v => Math.round(v + (255 - v) * t));
    }
    return `rgb(${mixed.join(', ')})`;
}
