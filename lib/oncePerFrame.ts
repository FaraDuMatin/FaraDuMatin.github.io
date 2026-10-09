// Wraps a scroll/resize handler so it runs at most once per frame, however many events fire.
// Call .cancel() on cleanup.
export function oncePerFrame(fn: () => void) {
    let frame = 0;
    const handler = () => {
        if (frame) return;
        frame = requestAnimationFrame(() => { frame = 0; fn(); });
    };
    handler.cancel = () => { cancelAnimationFrame(frame); frame = 0; };
    return handler;
}
