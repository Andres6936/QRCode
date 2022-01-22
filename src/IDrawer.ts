import {QRCodeModel} from "./QRCodeModel";

export interface Options {
    width: number,
    height: number,
    colorDark: string,
    colorLight: string,
}

export interface Render {
    clear(): void,

    makeImage(): void,

    draw(model: QRCodeModel): void,
}