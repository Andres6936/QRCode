import {QRCodeModel} from "../QRCodeModel";

export interface Render {
    clear(): void,

    makeImage(): void,

    draw(model: QRCodeModel): void,
}