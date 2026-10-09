'use client';

import { useEffect, useRef } from 'react';

// Shadertoy MdVXzw (glowing noise band + floating rotating squares), run on plain WebGL.
// The shader body is unchanged; only the Shadertoy wrapper (iTime, iResolution, main) is added.
const FRAGMENT = `
precision highp float;
uniform float iTime;
uniform vec2 iResolution;

vec3 bgColor = vec3(0.01, 0.16, 0.42);
vec3 rectColor = vec3(0.01, 0.26, 0.57);

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

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord.xy / iResolution.xy * 2. - 1.;
    uv.x *= iResolution.x/iResolution.y;
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
        float rect = rectangle(uvRot, pos.xy, pos.z, pos.z, (maxSize+minSize-pos.z)/2.);
        color += rectColor * rect * pos.z/maxSize;
    }
    fragColor = vec4(color, 1.0);
}

void main() { mainImage(gl_FragColor, gl_FragCoord.xy); }
`;

const VERTEX = `attribute vec2 p; void main() { gl_Position = vec4(p, 0.0, 1.0); }`;

const SCALE = 0.75; // render below CSS resolution; the shader is soft, and this keeps it cheap

export default function ShaderBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

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

        const resize = () => {
            canvas.width = Math.round(canvas.clientWidth * SCALE);
            canvas.height = Math.round(canvas.clientHeight * SCALE);
            gl.viewport(0, 0, canvas.width, canvas.height);
            gl.uniform2f(uRes, canvas.width, canvas.height);
        };
        resize();
        window.addEventListener('resize', resize);

        const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const start = performance.now();
        let frame = 0;
        const draw = (now: number) => {
            gl.uniform1f(uTime, still ? 10 : (now - start) / 1000);
            gl.drawArrays(gl.TRIANGLES, 0, 3);
            if (!still) frame = requestAnimationFrame(draw);
        };
        frame = requestAnimationFrame(draw);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener('resize', resize);
            // Free GL objects but keep the context: getContext() hands back the same one on the
            // next mount (React dev runs effects twice), and a lost context renders white.
            gl.deleteBuffer(buffer);
            gl.deleteProgram(program);
        };
    }, []);

    return <canvas ref={canvasRef} aria-hidden className="pointer-events-none fixed inset-0 z-0 h-full w-full" />;
}
