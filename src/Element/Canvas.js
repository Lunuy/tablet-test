
import ChangyDom from "changy-dom";
import { innerWidth, innerHeight } from "../Changeable/WindowSize";
import { O } from "changy";

function Canvas() {
    let lastXY = [0,0];
    let lastTilts = [1,1];
    let lastPressure = 0.5;
    let isPointerDowned = false;
    let maxTilts = [1,1];
    const lineWidth = 50;
    const inertia = 0.9;

    function mix(a, b, ratio) {
        return a*ratio + b*(1 - ratio);
    }

    function updateTilt(tiltX, tiltY) {
        if(Math.abs(tiltX) > maxTilts[0]) maxTilts[0] = Math.abs(tiltX);
        if(Math.abs(tiltY) > maxTilts[1]) maxTilts[1] = Math.abs(tiltY);
    }

    function drawLine([lastX, lastY], [x, y], [lastTiltX, lastTiltY], [tiltX, tiltY], lastPressure, pressure, shift) {
        updateTilt(tiltX, tiltY);

        ctx.lineCap = "round";

        const r = Math.sqrt((x - lastX)**2 + (y - lastY)**2);
        const lineWidthChangeAmount = Math.abs(lineWidth*(pressure - lastPressure));
        const n = Math.max(r, lineWidthChangeAmount);

        const dX = (x - lastX)/n;
        const dY = (y - lastY)/n;
        const dTiltX = (tiltX - lastTiltX)/n;
        const dTiltY = (tiltY - lastTiltY)/n;
        const dPressure = (pressure - lastPressure)/n;
        const d = n ? ((1 - (1 - n%1)/n) || 1) : 1;

        let i = d;
        do {
            const pressure = lastPressure + i*dPressure;

            ctx.lineWidth = lineWidth * pressure;
            ctx.strokeStyle = shift ? "white" : `hsl(${360 * ((lastTiltX + i*dTiltX)/maxTilts[0] + 0.5)}, ${((lastTiltY + i*dTiltY)/maxTilts[1] + 0.5) *100}%, ${(1-pressure) * 100}%)`;
            ctx.beginPath();
            ctx.moveTo(lastX + (i-d)*dX, lastY+(i-d)*dY);
            ctx.lineTo(lastX + i*dX, lastY + i*dY);
            ctx.stroke();

            i += Math.abs(d);
        } while(i <= n);

    }

    const canvas = (
        <canvas
            id="cv"
            width={innerWidth.ToString()}
            height={innerHeight.ToString()}
            ontouchstart={e => {
                e.preventDefault();
            }}
            onpointerdown={e => {
                e.preventDefault();

                isPointerDowned = true;
                drawLine(
                    lastXY = [e.clientX, e.clientY],
                    lastXY,
                    lastTilts = [e.tiltX, e.tiltY],
                    lastTilts,
                    lastPressure = e.pressure,
                    lastPressure,
                    e.shiftKey
                );
            }}
            onpointerup={e => {
                e.preventDefault();

                isPointerDowned = false;
            }}
            onpointermove={e => {
                e.preventDefault();
                console.log(e.pressure);
                updateTilt(e.tiltX, e.tiltY);

                if(!isPointerDowned) return;
                drawLine(
                    lastXY,
                    lastXY = [e.clientX, e.clientY],
                    lastTilts,
                    lastTilts = [e.tiltX, e.tiltY],//[mix(lastTilts[0], e.tiltX, inertia), mix(lastTilts[1], e.tiltY, inertia)],
                    lastPressure,
                    lastPressure = mix(lastPressure, e.pressure, inertia),
                    e.shiftKey
                );
            }}

            style={{
                cursor: "crosshair",
                display: "block"
            }}
        >
        </canvas>
    );
    const ctx = canvas[O].getContext("2d");

    return canvas;
}

export default Canvas;