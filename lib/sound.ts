'use client';

// UI sounds over Web Audio, no library. Off by default (like igloo.inc); the choice is
// remembered per browser. Browsers only allow audio after a click/key press, so nothing
// plays before that even when it's on.
//
// Which elements make sound: add data-sound="ui" (hover + click) or data-sound="hover"
// (hover only) to them; SoundToggle listens for those globally.

export type SoundName = 'hover' | 'click' | 'dive' | 'on';

const FILES: Record<SoundName, string> = {
    hover: '/sounds/hover.mp3',
    click: '/sounds/click.mp3',
    dive: '/sounds/dive.mp3',
    on: '/sounds/sound-on.mp3',
};

// Volume per sound, 0..1 — tune here.
const VOLUME: Record<SoundName, number> = { hover: 0.35, click: 0.5, dive: 0.6, on: 0.5 };
const HOVER_GAP = 60; // ms — skip hover sounds closer than this, so sweeping the mouse isn't noisy

const STORAGE_KEY = 'sound';
let enabled = false;
let ctx: AudioContext | null = null;
const buffers: Partial<Record<SoundName, AudioBuffer>> = {};
const listeners = new Set<() => void>();
let lastHover = 0;

try { enabled = localStorage.getItem(STORAGE_KEY) === 'on'; } catch { /* storage blocked: stay off */ }

function context() {
    if (!ctx) {
        ctx = new AudioContext();
        // Decode every sound once.
        (Object.keys(FILES) as SoundName[]).forEach(async name => {
            try {
                const data = await (await fetch(FILES[name])).arrayBuffer();
                buffers[name] = await ctx!.decodeAudioData(data);
            } catch { /* missing file: that sound stays silent */ }
        });
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
}

export function playSound(name: SoundName) {
    if (!enabled || !ctx) return; // ctx only exists after a user gesture
    if (name === 'hover') {
        const now = performance.now();
        if (now - lastHover < HOVER_GAP) return;
        lastHover = now;
    }
    const buffer = buffers[name];
    if (!buffer) return;
    const source = ctx.createBufferSource();
    const gain = ctx.createGain();
    gain.gain.value = VOLUME[name];
    source.buffer = buffer;
    source.connect(gain).connect(ctx.destination);
    source.start();
}

export function isSoundOn() { return enabled; }

export function setSoundOn(on: boolean) {
    enabled = on;
    try { localStorage.setItem(STORAGE_KEY, on ? 'on' : 'off'); } catch { /* not remembered */ }
    if (on) {
        context();
        // The first decode may still be running; play the "on" sound once it's ready.
        const tryPlay = (left: number) => buffers.on ? playSound('on') : left > 0 && setTimeout(() => tryPlay(left - 1), 50);
        tryPlay(20);
    }
    listeners.forEach(fn => fn());
}

export function subscribeSound(fn: () => void) {
    listeners.add(fn);
    return () => { listeners.delete(fn); };
}

// Called on any user gesture: if sound was left on from a previous visit, wake it up now.
export function unlockSound() {
    if (enabled) context();
}
