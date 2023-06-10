import {QRCodeModel} from "../QRCodeModel";

export interface Render {
    clear(): void,

    drawAt(model: QRCodeModel, root: HTMLElement): void,
}