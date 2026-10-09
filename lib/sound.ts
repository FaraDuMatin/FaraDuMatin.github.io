'use client';

// UI sounds over Web Audio, no library. Off by default (like igloo.inc); the choice is
// remembered per browser. Browsers only allow audio after a click/key press, so nothing
// plays before that even when it's on.
//
// Which elements make sound: add data-sound="ui" (hover + click) or data-sound="hover"
// (hover only) to them; SoundToggle listens for those globally.

export type SoundName = 'hover' | 'click' | 'dive' | 'undive' | 'on';

const FILES: Record<Exclude<SoundName, 'undive'>, string> = {
    hover: '/sounds/hover3.mp3',
    click: '/sounds/click.mp3',
    dive: '/sounds/zoom5.mp3',
    on: '/sounds/sound-on.mp3',
};

// Volume per sound, 0..1 — tune here.
const VOLUME: Record<SoundName, number> = { hover: 0.45, click: 0.8, dive: 0.8, undive: 0.8, on: 0.8 };
const HOVER_GAP = 60; // ms — skip hover sounds closer than this, so sweeping the mouse isn't noisy

// Ambient loop: plays while sound is on. Set AMBIENT to false for no ambient at all.
// Visitors pick one of AMBIENTS (first = default) from SoundToggle's hover menu. Only the
// picked file loads, the first time it plays; switching crossfades.
const AMBIENT = true;
export const AMBIENTS = ['/sounds/ambient4.mp3', '/sounds/ambient.mp3', '/sounds/ambient2.mp3', '/sounds/ambient3.mp3', '/sounds/ambient5.mp3'];
const AMBIENT_VOLUME = 0.25;
const AMBIENT_FADE = 1.5; // s

const STORAGE_KEY = 'sound';
const AMBIENT_KEY = 'ambient';
let enabled = false;
let ambientChoice = 0; // index in AMBIENTS
type Ambient = { file: string; gain: GainNode; source?: AudioBufferSourceNode };
let ambient: Ambient | null = null; // the loop playing (or loading) now
const ambientBuffers = new Map<string, Promise<AudioBuffer>>(); // decoded once per file
let ctx: AudioContext | null = null;
const buffers: Partial<Record<SoundName, AudioBuffer>> = {};
const listeners = new Set<() => void>();
let lastHover = 0;

try { enabled = localStorage.getItem(STORAGE_KEY) === 'on'; } catch { /* storage blocked: stay off */ }
try { ambientChoice = Math.max(0, AMBIENTS.indexOf(localStorage.getItem(AMBIENT_KEY) ?? '')); } catch { /* default */ }

// Hidden tab: pause everything (the ambient loop mostly); back: resume if sound is on.
if (typeof document !== 'undefined') {
    document.addEventListener('visibilitychange', () => {
        if (document.hidden) ctx?.suspend();
        else if (enabled) ctx?.resume();
    });
}

function fade(a: Ambient, to: number) {
    const g = a.gain.gain, t = ctx!.currentTime;
    g.cancelScheduledValues(t);
    g.setValueAtTime(g.value, t);
    g.linearRampToValueAtTime(to, t + AMBIENT_FADE);
}

// Fade the ambient loop to where it should be. A different pick fades the old one out while
// the new one loads and fades in.
function updateAmbient() {
    if (!ctx) return;
    const audio = ctx;
    const want = enabled && AMBIENT, file = AMBIENTS[ambientChoice];
    if (ambient && ambient.file !== file) {
        const old = ambient;
        fade(old, 0);
        setTimeout(() => { old.source?.stop(); old.gain.disconnect(); }, AMBIENT_FADE * 1000 + 100);
        ambient = null;
    }
    if (want && !ambient) {
        const entry: Ambient = ambient = { file, gain: audio.createGain() };
        entry.gain.gain.value = 0;
        entry.gain.connect(audio.destination);
        if (!ambientBuffers.has(file)) ambientBuffers.set(file,
            fetch(file).then(r => r.arrayBuffer()).then(d => audio.decodeAudioData(d)));
        ambientBuffers.get(file)!.then(buffer => {
            if (ambient !== entry) return entry.gain.disconnect(); // picked another meanwhile
            entry.source = audio.createBufferSource();
            entry.source.buffer = buffer;
            entry.source.loop = true;
            entry.source.connect(entry.gain);
            entry.source.start();
            updateAmbient();
        }).catch(() => { /* missing file: no ambient */ });
    }
    if (ambient?.source) fade(ambient, want ? AMBIENT_VOLUME : 0);
}

// The clip backwards. The near-silent tail is cut first, or it would become a delay at the start.
const SILENCE = 0.002; // amplitude under which a sample counts as silent
function reversed(audio: AudioContext, buffer: AudioBuffer) {
    const channels = Array.from({ length: buffer.numberOfChannels }, (_, c) => buffer.getChannelData(c));
    let end = buffer.length;
    while (end > 1 && channels.every(d => Math.abs(d[end - 1]) < SILENCE)) end--;
    const out = audio.createBuffer(channels.length, end, buffer.sampleRate);
    channels.forEach((d, c) => out.getChannelData(c).set(d.slice(0, end).reverse()));
    return out;
}

function context() {
    if (!ctx) {
        ctx = new AudioContext();
        // Decode every sound once.
        (Object.keys(FILES) as (keyof typeof FILES)[]).forEach(async name => {
            try {
                const data = await (await fetch(FILES[name])).arrayBuffer();
                buffers[name] = await ctx!.decodeAudioData(data);
                if (name === 'dive') buffers.undive = reversed(ctx!, buffers.dive!); // Back plays the dive backwards
            } catch { /* missing file: that sound stays silent */ }
        });
    }
    if (ctx.state === 'suspended' && !document.hidden) ctx.resume();
    updateAmbient();
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
    } else updateAmbient();
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

export function getAmbient() { return ambientChoice; }

// Picking an ambient also turns sound on: it's a request to hear it.
export function setAmbient(index: number) {
    ambientChoice = index;
    try { localStorage.setItem(AMBIENT_KEY, AMBIENTS[index]); } catch { /* not remembered */ }
    if (!enabled) return setSoundOn(true);
    updateAmbient();
    listeners.forEach(fn => fn());
}
