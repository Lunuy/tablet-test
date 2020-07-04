import { Number } from "changy";

export const innerWidth = new Number(window.innerWidth);
export const innerHeight = new Number(window.innerHeight);

window.addEventListener("resize", () => {
    innerWidth.set(window.innerWidth);
    innerHeight.set(window.innerHeight);
});