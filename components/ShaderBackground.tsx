'use client';

import { useEffect, useRef } from 'react';

// Shadertoy MdVXzw (glowing noise band + floating rotating squares), run on plain WebGL.
// Added: the Shadertoy wrapper (iTime, iResolution, main), mixed shapes, and an accent tint.
const FRAGMENT = `
precision highp float;
uniform float iTime;
uniform vec2 iResolution;
uniform vec3 uAccent; // project accent, normalized to full brightness
uniform float uMix;   // 0 = base blue everywhere, 1 = accent behind the project panel
uniform vec2 uPanel;  // panel's left/right edges, 0..1 across the screen
uniform vec3 uEdge;   // color the project pages fade to at the screen edges
uniform vec3 uBase;   // home color; fog and shapes are this at 42% / 57% strength

vec3 bgColor;
vec3 rectColor;

const float noiseIntensity = 2.8;
const float noiseDefinition = 0.6;
const vec2 glowPos = vec2(-2., 0.);

const float total = 60.;
const float minSize = 0.03;
const float maxSize = 0.08-minSize;
const float yDistribution = 0.5;

float random(vec2 co){
    return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
}

float noise( in vec2 p )
{
    p*=noiseIntensity;
    vec2 i = floor( p );
    vec2 f = fract( p );
    vec2 u = f*f*(3.0-2.0*f);
    return mix( mix( random( i + vec2(0.0,0.0) ),
                     random( i + vec2(1.0,0.0) ), u.x),
                mix( random( i + vec2(0.0,1.0) ),
                     random( i + vec2(1.0,1.0) ), u.x), u.y);
}

float fbm( in vec2 uv )
{
    uv *= 5.0;
    mat2 m = mat2( 1.6,  1.2, -1.2,  1.6 );
    float f  = 0.5000*noise( uv ); uv = m*uv;
    f += 0.2500*noise( uv ); uv = m*uv;
    f += 0.1250*noise( uv ); uv = m*uv;
    f += 0.0625*noise( uv ); uv = m*uv;
    f = 0.5 + 0.5*f;
    return f;
}

vec3 bg(vec2 uv )
{
    float velocity = iTime/1.6;
    float intensity = sin(uv.x*3.+velocity*2.)*1.1+1.5;
    uv.y -= 2.;
    vec2 bp = uv+glowPos;
    uv *= noiseDefinition;
    float rb = fbm(vec2(uv.x*.5-velocity*.03, uv.y))*.1;
    uv += rb;
    float rz = fbm(uv*.9+vec2(velocity*.35, 0.0));
    rz *= dot(bp*intensity,bp)+1.2;
    vec3 col = bgColor/(.1-rz);
    return sqrt(abs(col));
}

float rectangle(vec2 uv, vec2 pos, float width, float height, float blur) {
    pos = (vec2(width, height) + .01)/2. - abs(uv - pos);
    pos = smoothstep(0., blur , pos);
    return pos.x * pos.y;
}

// Mixed shapes instead of only squares. kind: 0 = square, 1 = triangle shard,
// 2 = thin ring, 3 = plus marker. Each particle gets one, in turn.

float box(vec2 p, vec2 halfSize, float blur) {
    vec2 d = smoothstep(0., blur + .002, halfSize - abs(p));
    return d.x * d.y;
}

float triangle(vec2 p, float r) {
    const float k = 1.7320508; // sqrt(3)
    p.x = abs(p.x) - r;
    p.y = p.y + r / k;
    if (p.x + k * p.y > 0.) p = vec2(p.x - k * p.y, -k * p.x - p.y) / 2.;
    p.x -= clamp(p.x, -2. * r, 0.);
    return -length(p) * sign(p.y); // < 0 inside
}

float shape(vec2 uv, vec2 pos, float size, float blur, float kind) {
    vec2 p = uv - pos;
    float r = (size + .01) / 2.;
    // Outlines like PlayStation symbols: same stroke for square, triangle and ring.
    // Blur is capped to the shape's size, or small (blurrier) ones fill in their hole.
    float stroke = r * .12, edge = min(blur * .5, r * .12) + .002;
    if (kind < .5) return 1. - smoothstep(stroke, stroke + edge, abs(max(abs(p.x), abs(p.y)) - r * .75));
    if (kind < 1.5) return 1. - smoothstep(stroke, stroke + edge, abs(triangle(p, r * .8)));
    if (kind < 2.5) return 1. - smoothstep(stroke, stroke + edge, abs(length(p) - r * .8));
    return max(box(p, vec2(r, r * .2), blur * .5), box(p, vec2(r * .2, r), blur * .5));
}

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy / iResolution.xy * 2. - 1.;
    uv.x *= iResolution.x/iResolution.y;

    // Project pages (uMix -> 1): accent behind the panel, fading to uEdge toward the screen edges.
    // Home (uMix = 0): the base blue.
    float x = fragCoord.x / iResolution.x;
    float outside = max(uPanel.x - x, x - uPanel.y);
    float w = 1. - smoothstep(0., max(uPanel.x, .001), outside);
    vec3 tint = mix(uBase, mix(uEdge, uAccent, w), uMix);
    bgColor = tint * 0.42;
    rectColor = tint * 0.57;

    vec3 color = bg(uv)*(2.-abs(uv.y*2.));
    float velX = -iTime/8.;
    float velY = iTime/10.;
    for(float i=0.; i<total; i++){
        float index = i/total;
        float rnd = random(vec2(index));
        vec3 pos = vec3(0, 0., 0.);
        pos.x = fract(velX*rnd+index)*4.-2.0;
        pos.y = sin(index*rnd*1000.+velY) * yDistribution;
        pos.z = maxSize*rnd+minSize;
        vec2 uvRot = uv - pos.xy + pos.z/2.;
        uvRot = rotate2d( i+iTime/2. ) * uvRot;
        uvRot += pos.xy+pos.z/2.;
        float rect = shape(uvRot, pos.xy, pos.z, (maxSize+minSize-pos.z)/2., mod(i, 4.));
        color += rectColor * rect * pos.z/maxSize;
    }
    fragColor = vec4(color, 1.0);
}

void main() { mainImage(gl_FragColor, gl_FragCoord.xy); }
`;

const VERTEX = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const SCALE = 0.75; // render below CSS resolution; the shader is soft, and this keeps it cheap
const DIM_SCALE = 0.5; // behind project pages it's at 40% under the panels: half res is plenty
const DIM_FPS = 30;    // and half the frame rate
const PANEL_MAX = 1152; // px — the project panels' max-w-6xl
const EASE = 0.05;      // step toward a new accent per 60fps frame (≈1s to settle)
const BASE = '#ffffff'; // home fog + shapes: white = shades of gray. Original blue: '#0661ff'
const EDGE = '#000000'; // project pages fade to this at the screen edges — try '#ffffff' for white

function hexRgb(hex: string): [number, number, number] {
    const n = parseInt(hex.replace('#', ''), 16);
    return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

// Hex → RGB 0..1, scaled so the brightest channel is 1: keeps the hue, and near-black
// accents (PLUMB's #1F2933) still read as a color.
function normalizedRgb(hex: string): [number, number, number] {
    const n = parseInt(hex.replace('#', ''), 16);
    const rgb = [(n >> 16) & 255, (n >> 8) & 255, n & 255];
    const max = Math.max(...rgb, 1);
    return [rgb[0] / max, rgb[1] / max, rgb[2] / max];
}

// dim: fade the shader down behind the project pages so their text stays readable.
// accent: the project in view; tints the shader behind its panel. Omit for the base blue.
// edge: color the project pages fade to at the screen edges (hex).
// base: home color (hex); changes fade in.
export default function ShaderBackground({ dim = false, accent, edge = EDGE, base = BASE }: { dim?: boolean; accent?: string; edge?: string; base?: string }) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const target = useRef({ color: [0.02, 0.38, 1] as number[], mix: 0, base: hexRgb(base) as number[] });
    const redraw = useRef<() => void>(() => {});
    const dimRef = useRef(dim);
    const resizeRef = useRef<() => void>(() => {});

    useEffect(() => {
        if (accent) target.current = { ...target.current, color: normalizedRgb(accent), mix: 1 };
        else target.current = { ...target.current, mix: 0 };
        redraw.current();
    }, [accent]);

    useEffect(() => {
        target.current = { ...target.current, base: hexRgb(base) };
        redraw.current();
    }, [base]);

    useEffect(() => {
        dimRef.current = dim;
        resizeRef.current(); // switch render resolution
    }, [dim]);

    useEffect(() => {
        const canvas = canvasRef.current;
        const gl = canvas?.getContext('webgl', { antialias: false, alpha: false });
        if (!canvas || !gl) return;

        const compile = (type: number, src: string) => {
            const s = gl.createShader(type)!;
            gl.shaderSource(s, src);
            gl.compileShader(s);
            if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) console.error(gl.getShaderInfoLog(s));
            return s;
        };
        const program = gl.createProgram()!;
        gl.attachShader(program, compile(gl.VERTEX_SHADER, VERTEX));
        gl.attachShader(program, compile(gl.FRAGMENT_SHADER, FRAGMENT));
        gl.linkProgram(program);
        gl.useProgram(program);

        // One triangle covering the screen.
        const buffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
        const loc = gl.getAttribLocation(program, 'p');
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

        const uTime = gl.getUniformLocation(program, 'iTime');
        const uRes = gl.getUniformLocation(program, 'iResolution');
        const uAccent = gl.getUniformLocation(program, 'uAccent');
        const uMix = gl.getUniformLocation(program, 'uMix');
        const uPanel = gl.getUniformLocation(program, 'uPanel');
        const uEdge = gl.getUniformLocation(program, 'uEdge');
        gl.uniform3f(uEdge, ...hexRgb(edge));
        const uBase = gl.getUniformLocation(program, 'uBase');

        const resize = () => {
            const scale = dimRef.current ? DIM_SCALE : SCALE;
            canvas.width = Math.round(canvas.clientWidth * scale);
            canvas.height = Math.round(canvas.clientHeight * scale);
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(uRes, canvas.width, canvas.height);
            const edge = Math.max(0, (canvas.clientWidth - PANEL_MAX) / 2) / canvas.clientWidth;
            gl.uniform2f(uPanel, edge, 1 - edge);
        };
        resize();
        resizeRef.current = resize;
        window.addEventListener('resize', resize);

        const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const start = performance.now();
        const current = { color: [...target.current.color], mix: target.current.mix, base: [...target.current.base] };
        let frame = 0;
        let last = start;
        const draw = (now: number) => {
            // Behind project pages, skip frames to hold ~30fps.
            if (!still && dimRef.current && now - last < 1000 / DIM_FPS - 2) {
                frame = requestAnimationFrame(draw);
                return;
            }
            // Ease toward the target accent, by elapsed time so the fade lasts the same at
            // any frame rate; reduced motion snaps to it instead.
            const step = still ? 1 : 1 - Math.pow(1 - EASE, (now - last) / (1000 / 60));
            last = now;
            current.color = current.color.map((c, i) => c + (target.current.color[i] - c) * step);
            current.mix += (target.current.mix - current.mix) * step;
            current.base = current.base.map((c, i) => c + (target.current.base[i] - c) * step);
            gl.uniform3f(uAccent, current.color[0], current.color[1], current.color[2]);
            gl.uniform3f(uBase, current.base[0], current.base[1], current.base[2]);
            gl.uniform1f(uMix, current.mix);
            gl.uniform1f(uTime, still ? 10 : (now - start) / 1000);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            if (!still) frame = requestAnimationFrame(draw);
        };
        frame = requestAnimationFrame(draw);
        // Reduced motion draws one frame; redraw it when the accent changes.
        redraw.current = () => { if (still) frame = requestAnimationFrame(draw); };

        return () => {
            cancelAnimationFrame(frame);
            redraw.current = () => {};
            resizeRef.current = () => {};
            window.removeEventListener('resize', resize);
            // Free GL objects but keep the context: getContext() hands back the same one on the
            // next mount (React dev runs effects twice), and a lost context renders white.
            gl.deleteBuffer(buffer);
            gl.deleteProgram(program);
        };
    }, [edge]);

    return <canvas ref={canvasRef} aria-hidden
        className={`pointer-events-none fixed inset-0 z-0 h-full w-full transition-opacity duration-700 ${dim ? 'opacity-40' : 'opacity-100'}`} />;
}
